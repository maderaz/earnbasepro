import type { Metadata } from 'next';
import { fetchPools } from '@/lib/api';
import { networkFilterSEO, BASE_URL, getProductSlug, formatTVLCompact } from '@/lib/seo';
import { resolveNetworkKey, computeNetworkSEOVars, buildNetworkFaq, getNetworkYieldExplainer } from '@/lib/networkSEOData';
import { NetworkFilterClient } from './network-filter-client';
import { NetworkSEOContent } from '../../components/NetworkSEOContent';

function nameToSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export const dynamic = 'force-dynamic'; // always fetch fresh, AbortSignal.timeout(8000) in api.ts prevents hangs

interface Props { params: Promise<{ ticker: string; network: string }> }

function matchNetwork(productNetwork: string, slug: string): boolean {
  const pn = productNetwork.toLowerCase().replace(/\s+/g, '-');
  return pn === slug || pn.startsWith(slug);
}

function networkDisplayName(slug: string): string {
  const names: Record<string, string> = {
    mainnet: 'Ethereum', ethereum: 'Ethereum', base: 'Base',
    arbitrum: 'Arbitrum', avalanche: 'Avalanche', bnb: 'BNB Chain', sonic: 'Sonic',
  };
  return names[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker, network } = await params;
  const t = ticker.toLowerCase();
  const netSlug = network.toLowerCase();
  const netName = networkDisplayName(netSlug);
  const networkKey = resolveNetworkKey(netSlug);

  let products: Awaited<ReturnType<typeof fetchPools>>['products'] = [];
  try { ({ products } = await fetchPools()); } catch { /* network unavailable */ }
  const T = t.toUpperCase();
  const filtered = products.filter(p =>
    (p.ticker || '').toUpperCase() === T && matchNetwork(p.network, netSlug)
  );
  const sorted = [...filtered].sort((a, b) => b.spotAPY - a.spotAPY);

  // Build FAQ items for FAQPage schema
  const vars = computeNetworkSEOVars(t, netSlug, networkKey, products);
  const faqItems = buildNetworkFaq(T, netName, t, vars);

  const seo = networkFilterSEO(t, netName, filtered.length, sorted, faqItems);
  const pageUrl = `${BASE_URL}/${t}/${netSlug}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: pageUrl },
    openGraph: { title: seo.title, description: seo.description, url: pageUrl },
    twitter: { title: seo.title, description: seo.description },
  };
}

export default async function NetworkPage({ params }: Props) {
  const { ticker, network } = await params;
  const t = ticker.toLowerCase();
  const T = t.toUpperCase();
  const netSlug = network.toLowerCase();
  const netName = networkDisplayName(netSlug);
  const networkKey = resolveNetworkKey(netSlug);

  let products: Awaited<ReturnType<typeof fetchPools>>['products'] = [];
  try { ({ products } = await fetchPools()); } catch { /* network unavailable */ }
  const filtered = products.filter(p =>
    (p.ticker || '').toUpperCase() === T && matchNetwork(p.network, netSlug)
  );
  const sorted = [...filtered].sort((a, b) => b.spotAPY - a.spotAPY);

  // Build FAQ + explainer content for SSR HTML + JSON-LD schema
  const vars = computeNetworkSEOVars(t, netSlug, networkKey, products);
  const faqItems = buildNetworkFaq(T, netName, t, vars);
  const [yieldPara1, yieldPara2] = getNetworkYieldExplainer(T, networkKey, netName);

  const seo = networkFilterSEO(t, netName, filtered.length, sorted, faqItems);

  // Strip history arrays and pass only current-ticker products — client components
  // filter to this ticker+network internally; passing all 300+ doubles the hydration payload.
  const leanFiltered = products
    .filter(p => (p.ticker || '').toUpperCase() === T)
    .map(({ dailyApyHistory: _a, tvlHistory: _t, ...rest }) => rest);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.structuredData) }} />

      {/* SSR skeleton */}
      <div id="network-filter-seo-content" className="space-y-10">
        <nav className="text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <span className="mx-1">/</span>
          <a href={`/${t}`} className="hover:text-foreground">{T}</a>
          <span className="mx-1">/</span>
          <span className="text-foreground">{netName}</span>
        </nav>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            Compare {filtered.length} {T} Yields on {netName}
          </h2>
          <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed max-w-2xl">
            {filtered.length} {T} strategies tracked on {netName}. Compare on-chain APY rates, TVL, and yield history side by side.
          </p>
        </section>

        <section>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Strategy</th>
                  <th className="py-3 pr-4 font-medium">Platform</th>
                  <th className="py-3 pr-4 font-medium">Curator</th>
                  <th className="py-3 pr-4 font-medium text-right">APY</th>
                  <th className="py-3 font-medium text-right">TVL</th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 20).map((p, i) => (
                  <tr key={p.id || i} className="border-b border-border/50">
                    <td className="py-3 pr-4">
                      <a href={`/vault/${getProductSlug(p)}`} className="text-foreground font-medium hover:text-[#08a671]">
                        {p.product_name}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      <a href={`/project/${nameToSlug(p.platform_name)}`} className="hover:text-[#08a671]">{p.platform_name}</a>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {p.curator && p.curator !== '-'
                        ? <a href={`/curator/${nameToSlug(p.curator.trim())}`} className="hover:text-[#08a671]">{p.curator.trim()}</a>
                        : '—'}
                    </td>
                    <td className="py-3 pr-4 text-right font-medium">{p.spotAPY.toFixed(2)}%</td>
                    <td className="py-3 text-right text-muted-foreground">{formatTVLCompact(p.tvl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sorted.length > 20 && (
            <p className="text-sm text-muted-foreground mt-3">
              Showing top 20 of {sorted.length} {T} strategies on {netName}.
            </p>
          )}
        </section>

        {/* Yield explainer paragraphs */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            How {T} Yields Work on {netName}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{yieldPara1}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{yieldPara2}</p>
        </section>

        {/* Best yield answer */}
        {vars.count > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              What is the best {T} yield on {netName} right now?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The highest on-chain {T} APY on {netName} currently tracked on Earnbase is {vars.topAPY}, offered by {vars.topProductName} on {vars.topPlatform}. This rate reflects the vault&apos;s native exchange rate and excludes external incentives.
            </p>
          </section>
        )}

        {/* SSR FAQ */}
        {faqItems.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Common Questions about {T} Yields on {netName}
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i}>
                  <h3 className="text-sm font-medium text-foreground">{item.question}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <a href={`/${t}`} className="text-sm text-[#08a671] font-medium hover:underline">
            ← All {T} strategies
          </a>
        </section>
      </div>

      {/* Interactive client */}
      <NetworkFilterClient
        ticker={t}
        network={netSlug}
        networkName={netName}
        products={JSON.parse(JSON.stringify(leanFiltered))}
      />

      {/* SEO editorial content (client-side interactive accordion) */}
      <NetworkSEOContent
        ticker={t}
        network={netSlug}
        networkName={netName}
        products={JSON.parse(JSON.stringify(leanFiltered))}
      />
    </>
  );
}
