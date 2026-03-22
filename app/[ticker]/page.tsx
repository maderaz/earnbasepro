import type { Metadata } from 'next';
import { fetchPools } from '@/lib/api';
import { assetHubSEO, BASE_URL, getProductSlug, formatTVLCompact } from '@/lib/seo';
import { AssetHubClient } from './asset-hub-client';
import { AssetSEOContent } from '../components/AssetSEOContent';

export const revalidate = 300; // ISR: rebuild at most every 5 minutes

const VALID_TICKERS = ['usdc', 'eth', 'usdt', 'eurc', 'wbtc', 'cbbtc'];

interface Props { params: Promise<{ ticker: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const t = ticker.toLowerCase();
  if (!VALID_TICKERS.includes(t)) {
    return { title: 'Page Not Found | Earnbase' };
  }

  const { products } = await fetchPools();
  const T = t.toUpperCase();
  const filtered = products.filter(p => (p.ticker || '').toUpperCase() === T);
  const networks = new Set(filtered.map(p => p.network));
  const sorted = [...filtered].sort((a, b) => b.spotAPY - a.spotAPY);
  const seo = assetHubSEO(t, filtered.length, networks.size, sorted);
  const pageUrl = `${BASE_URL}/${t}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: pageUrl },
    openGraph: { title: seo.title, description: seo.description, url: pageUrl },
    twitter: { title: seo.title, description: seo.description },
  };
}

export default async function AssetHubPage({ params }: Props) {
  const { ticker } = await params;
  const t = ticker.toLowerCase();
  const T = t.toUpperCase();

  if (!VALID_TICKERS.includes(t)) {
    return <NotFound />;
  }

  const { products } = await fetchPools();
  const filtered = products.filter(p => (p.ticker || '').toUpperCase() === T);
  const sorted = [...filtered].sort((a, b) => b.spotAPY - a.spotAPY);
  const networks = new Set(filtered.map(p => p.network));
  const networkCounts = new Map<string, number>();
  filtered.forEach(p => networkCounts.set(p.network, (networkCounts.get(p.network) || 0) + 1));

  const seo = assetHubSEO(t, filtered.length, networks.size, sorted);

  // Compute allTickers sorted by product count (for mobile asset switcher)
  const tickerCounts = new Map<string, number>();
  products.forEach(p => tickerCounts.set(p.ticker.toUpperCase(), (tickerCounts.get(p.ticker.toUpperCase()) || 0) + 1));
  const allTickers = [...tickerCounts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.structuredData) }} />

      {/* SSR skeleton */}
      <div id="asset-hub-seo-content" className="space-y-10">
        <section>
          <h1 className="text-2xl font-semibold text-foreground">
            Compare {filtered.length} {T} Yield Strategies
          </h1>
          <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed max-w-2xl">
            Track and compare {T} yield opportunities across {networks.size} networks
            and {new Set(filtered.map(p => p.platform_name)).size}+ protocols. On-chain APY data — updated daily.
          </p>
        </section>

        {/* Network links */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">{T} by Network</h2>
          <div className="flex flex-wrap gap-2">
            {[...networkCounts.entries()].sort((a, b) => b[1] - a[1]).map(([net, count]) => (
              <a key={net} href={`/${t}/${net.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:shadow-md transition-shadow">
                {net} <span className="text-muted-foreground">({count})</span>
              </a>
            ))}
          </div>
        </section>

        {/* Product table */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">All {T} Strategies</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Strategy</th>
                  <th className="py-3 pr-4 font-medium">Network</th>
                  <th className="py-3 pr-4 font-medium">Platform</th>
                  <th className="py-3 pr-4 font-medium text-right">APY</th>
                  <th className="py-3 font-medium text-right">TVL</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => (
                  <tr key={p.id || i} className="border-b border-border/50">
                    <td className="py-3 pr-4">
                      <a href={`/vault/${getProductSlug(p)}`} className="text-foreground font-medium hover:text-[#08a671]">
                        {p.product_name}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{p.network}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{p.platform_name}</td>
                    <td className="py-3 pr-4 text-right font-medium">{p.spotAPY.toFixed(2)}%</td>
                    <td className="py-3 text-right text-muted-foreground">{formatTVLCompact(p.tvl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cross-links */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Other Assets</h2>
          <div className="flex flex-wrap gap-2">
            {VALID_TICKERS.filter(v => v !== t).map(v => (
              <a key={v} href={`/${v}`} className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm font-medium hover:shadow-md">
                {v.toUpperCase()}
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Interactive client */}
      <AssetHubClient
        ticker={t}
        products={JSON.parse(JSON.stringify(products))}
        allTickers={allTickers}
      />

      {/* SEO editorial content */}
      <AssetSEOContent ticker={t} products={JSON.parse(JSON.stringify(products))} />
    </>
  );
}

function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-xl font-medium">Page Not Found</h1>
      <p className="text-muted-foreground mt-2">This page doesn't exist on Earnbase.</p>
      <a href="/" className="inline-block mt-4 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-sm font-semibold">Back to Home</a>
    </div>
  );
}
