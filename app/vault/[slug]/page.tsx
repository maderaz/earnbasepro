import type { Metadata } from 'next';
import { fetchPools } from '@/lib/api';
import { vaultProductSEO, BASE_URL, getProductSlug, formatTVLCompact } from '@/lib/seo';
import type { DeFiProduct } from '@/lib/api';
import { VaultClient } from './vault-client';

export const dynamic = 'force-dynamic'; // always fetch fresh, AbortSignal.timeout(8000) in api.ts prevents hangs

interface Props { params: Promise<{ slug: string }> }

function findProduct(products: DeFiProduct[], slug: string): DeFiProduct | undefined {
  return products.find(p => getProductSlug(p) === slug);
}

function buildVaultFaq(product: DeFiProduct, T: string): { question: string; answer: string }[] {
  return [
    {
      question: `What is the current APY for ${product.product_name}?`,
      answer: `The current spot APY for ${product.product_name} on ${product.platform_name} (${product.network}) is ${product.spotAPY.toFixed(2)}%. The 30-day average APY is ${product.monthlyAPY.toFixed(2)}%. All figures exclude external token rewards and are calculated from on-chain exchange rates only.`,
    },
    {
      question: `How much total value is locked in ${product.product_name}?`,
      answer: `The total value locked (TVL) in ${product.product_name} is ${formatTVLCompact(product.tvl)}. TVL measures the total ${T} assets currently deposited in this vault.`,
    },
    {
      question: `Does the ${product.product_name} yield include token rewards?`,
      answer: `No. Earnbase tracks on-chain APY only, derived from the vault's exchange rate changes over time. External incentives, token rewards, points programs, and liquidity mining bonuses are not included in the reported APY.`,
    },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let products: Awaited<ReturnType<typeof fetchPools>>['products'] = [];
  try { ({ products } = await fetchPools()); } catch { /* network unavailable */ }
  const product = findProduct(products, slug);

  if (!product) {
    return { title: 'Vault Not Found | Earnbase' };
  }

  // noindex dead vaults: TVL nearly empty AND 30-day APY is zero (not just a temporary spot swing)
  const isDeadVault = (product.tvl ?? 0) < 5000 && (product.monthlyAPY ?? 0) === 0;

  const T = product.ticker.toUpperCase();
  const hubCount = products.filter(p => (p.ticker || '').toUpperCase() === T).length;
  const vaultFaq = buildVaultFaq(product, T);
  const seo = vaultProductSEO(
    product.product_name, product.platform_name, product.ticker,
    product.network, product.spotAPY, product.tvl, slug,
    product.curator, hubCount, vaultFaq
  );
  const pageUrl = `${BASE_URL}/vault/${slug}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: pageUrl },
    openGraph: { title: seo.title, description: seo.description, url: pageUrl, images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
    twitter: { title: seo.title, description: seo.description },
    ...(isDeadVault && { robots: { index: false, follow: true } }),
  };
}

export default async function VaultPage({ params }: Props) {
  const { slug } = await params;
  let products: Awaited<ReturnType<typeof fetchPools>>['products'] = [];
  let privateCreditIds: Awaited<ReturnType<typeof fetchPools>>['privateCreditIds'] = [];
  try { ({ products, privateCreditIds } = await fetchPools()); } catch { /* network unavailable */ }
  const product = findProduct(products, slug);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-xl font-medium">Vault Not Found</h1>
        <p className="text-muted-foreground mt-2">This vault doesn't exist or has been removed.</p>
        <a href="/" className="inline-block mt-4 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-sm font-semibold">Back to Home</a>
      </div>
    );
  }

  const T = product.ticker.toUpperCase();
  const t = product.ticker.toLowerCase();

  // Dead vault: TVL nearly empty AND 30-day APY is zero — serve minimal page, noindex set in generateMetadata
  if ((product.tvl ?? 0) < 5000 && (product.monthlyAPY ?? 0) === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground text-sm">This vault is no longer active.</p>
        <a href={`/${t}`} className="inline-block mt-4 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-sm font-semibold">
          See all {T} strategies →
        </a>
      </div>
    );
  }

  const netSlug = product.network.toLowerCase().replace(/\s+/g, '-');
  const hasCurator = product.curator && product.curator !== '-' && product.curator.trim() !== '';
  const hubCount = products.filter(p => (p.ticker || '').toUpperCase() === T).length;

  const vaultFaq = buildVaultFaq(product, T);
  const seo = vaultProductSEO(
    product.product_name, product.platform_name, product.ticker,
    product.network, product.spotAPY, product.tvl, slug,
    product.curator, hubCount, vaultFaq
  );

  // Find alternatives — same ticker, different product, sorted by APY
  const alternatives = products
    .filter(p => (p.ticker || '').toUpperCase() === T && getProductSlug(p) !== slug)
    .sort((a, b) => b.spotAPY - a.spotAPY)
    .slice(0, 10);

  // Cross-asset platform links — same platform, different asset, for internal PageRank flow
  const platformCross = products
    .filter(p =>
      p.platform_name === product.platform_name &&
      (p.ticker || '').toUpperCase() !== T &&
      getProductSlug(p) !== slug &&
      (p.spotAPY ?? 0) > 0
    )
    .sort((a, b) => b.spotAPY - a.spotAPY)
    .slice(0, 6);

  const isPrivateCredit = (privateCreditIds || []).some(id => String(id) === String(product.id)) ||
    product.platform_name.toLowerCase() === 'wildcat';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.structuredData) }} />

      {/* SSR skeleton — hidden by VaultClient once JS loads */}
      <div id="vault-seo-content" className="space-y-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <span className="mx-1">/</span>
          <a href={`/${t}`} className="hover:text-foreground">{T}</a>
          <span className="mx-1">/</span>
          <a href={`/${t}/${netSlug}`} className="hover:text-foreground">{product.network}</a>
          <span className="mx-1">/</span>
          <span className="text-foreground">{product.product_name}</span>
        </nav>

        {/* Hero card */}
        <section className="p-6 rounded-xl border border-border bg-card space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{product.product_name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {product.platform_name}{hasCurator ? ` · Curated by ${product.curator!.trim()}` : ''} · {product.network}
              </p>
            </div>
            <span className="text-2xl font-bold text-[#08a671]">{product.spotAPY.toFixed(2)}%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">24h APY</p>
              <p className="text-sm font-semibold">{product.spotAPY.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">30d APY</p>
              <p className="text-sm font-semibold">{product.monthlyAPY.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">TVL</p>
              <p className="text-sm font-semibold">{formatTVLCompact(product.tvl)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Asset</p>
              <p className="text-sm font-semibold">
                <a href={`/${t}`} className="text-[#08a671] hover:underline">{T}</a>
              </p>
            </div>
          </div>

          {product.product_link && (
            <div className="pt-4 border-t border-border">
              <a href={product.product_link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#08a671] text-white rounded-lg text-sm font-semibold hover:bg-[#08a671]/90">
                Open Vault ↗
              </a>
            </div>
          )}
        </section>

        {/* FAQ section */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          {vaultFaq.map((item, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-sm font-medium text-foreground">{item.question}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
            </div>
          ))}
        </section>

        {/* Alternative strategies */}
        {alternatives.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Compare with Other {T} Strategies
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">Strategy</th>
                    <th className="py-3 pr-4 font-medium">Platform</th>
                    <th className="py-3 pr-4 font-medium">Network</th>
                    <th className="py-3 pr-4 font-medium text-right">APY</th>
                    <th className="py-3 font-medium text-right">TVL</th>
                  </tr>
                </thead>
                <tbody>
                  {alternatives.map((p, i) => (
                    <tr key={p.id || i} className="border-b border-border/50">
                      <td className="py-3 pr-4">
                        <a href={`/vault/${getProductSlug(p)}`} className="text-foreground font-medium hover:text-[#08a671]">
                          {p.product_name}
                        </a>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{p.platform_name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{p.network}</td>
                      <td className="py-3 pr-4 text-right font-medium">{p.spotAPY.toFixed(2)}%</td>
                      <td className="py-3 text-right text-muted-foreground">{formatTVLCompact(p.tvl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Cross-asset platform links — distributes PageRank across asset hubs */}
        {platformCross.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              More {product.platform_name} Strategies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {platformCross.map((p, i) => (
                <a key={p.id || i} href={`/vault/${getProductSlug(p)}`}
                  className="block p-3 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#08a671]">{p.ticker.toUpperCase()}</span>
                    <span className="text-xs text-muted-foreground">{p.network}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground mt-1 truncate">{p.product_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.spotAPY.toFixed(2)}% APY · {formatTVLCompact(p.tvl)}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Interactive client component */}
      <VaultClient
        product={JSON.parse(JSON.stringify(product))}
        products={JSON.parse(JSON.stringify(products))}
        isPrivateCredit={isPrivateCredit}
      />
    </>
  );
}
