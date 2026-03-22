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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await fetchPools();
  const product = findProduct(products, slug);

  if (!product) {
    return { title: 'Vault Not Found | Earnbase' };
  }

  const T = product.ticker.toUpperCase();
  const hubCount = products.filter(p => (p.ticker || '').toUpperCase() === T).length;
  const seo = vaultProductSEO(
    product.product_name, product.platform_name, product.ticker,
    product.network, product.spotAPY, product.tvl, slug,
    product.curator, hubCount
  );
  const pageUrl = `${BASE_URL}/vault/${slug}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: pageUrl },
    openGraph: { title: seo.title, description: seo.description, url: pageUrl },
    twitter: { title: seo.title, description: seo.description },
  };
}

export default async function VaultPage({ params }: Props) {
  const { slug } = await params;
  const { products, privateCreditIds } = await fetchPools();
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
  const netSlug = product.network.toLowerCase().replace(/\s+/g, '-');
  const hasCurator = product.curator && product.curator !== '-' && product.curator.trim() !== '';
  const hubCount = products.filter(p => (p.ticker || '').toUpperCase() === T).length;

  const seo = vaultProductSEO(
    product.product_name, product.platform_name, product.ticker,
    product.network, product.spotAPY, product.tvl, slug,
    product.curator, hubCount
  );

  // Find alternatives — same ticker, different product, sorted by APY
  const alternatives = products
    .filter(p => (p.ticker || '').toUpperCase() === T && getProductSlug(p) !== slug)
    .sort((a, b) => b.spotAPY - a.spotAPY)
    .slice(0, 10);

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
