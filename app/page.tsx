import type { Metadata } from 'next';
import { fetchPools, fetchDisplaySettings } from '@/lib/api';
import { homepageSEO, BASE_URL } from '@/lib/seo';
import { HomepageClient } from './homepage-client';

// SSR at request time — APY data changes frequently
export const dynamic = 'force-dynamic';

/**
 * Homepage — Server Component.
 * Fetches product data on the server so the full HTML is rendered for Google.
 */

export async function generateMetadata(): Promise<Metadata> {
  const { products } = await fetchPools();
  const tickers = [...new Set(products.map(p => (p.ticker || '').toUpperCase()))].sort();
  const seo = homepageSEO(tickers, products.length);

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: BASE_URL },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: BASE_URL,
      images: [{ url: seo.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
  };
}

export default async function HomePage() {
  const [poolsData, displaySettings] = await Promise.all([
    fetchPools(),
    fetchDisplaySettings(),
  ]);

  const { products } = poolsData;

  // Derive tickers and counts server-side
  const tickerCounts: Record<string, number> = {};
  for (const p of products) {
    if (p) {
      const t = (p.ticker || 'N/A').toUpperCase();
      tickerCounts[t] = (tickerCounts[t] || 0) + 1;
    }
  }
  const tickers = Object.keys(tickerCounts).sort((a, b) => {
    const diff = tickerCounts[b] - tickerCounts[a];
    return diff !== 0 ? diff : a.localeCompare(b);
  });

  // Filter products for homepage display
  const homeMinTvl = displaySettings.homeMinTvl ?? 0;
  let homeProducts = products;
  if (homeMinTvl > 0) {
    homeProducts = homeProducts.filter(p => (p.tvl ?? 0) >= homeMinTvl);
  }
  if (!displaySettings.showZeroApy) {
    homeProducts = homeProducts.filter(p => {
      const spot = Math.abs(p.spotAPY) >= 0.005;
      const monthly = Math.abs(p.monthlyAPY) >= 0.005;
      return spot && monthly;
    });
  }

  // Compute network count
  const networks = new Set<string>();
  products.forEach(p => { if (p?.network) networks.add(p.network); });

  // JSON-LD structured data
  const seo = homepageSEO(tickers, products.length);

  // Top strategy per asset for SEO content
  const topPerAsset = getTopPerAsset(homeProducts);

  // Top projects with strategy counts
  const TOP_PROJECTS = ['Morpho', 'Euler', 'Aave', 'IPOR Fusion', 'Harvest', 'Yearn', 'Lagoon', 'Fluid'];
  const projectCounts = TOP_PROJECTS.map(name => {
    const count = homeProducts.filter(p =>
      (p.platform_name || '').trim().toLowerCase() === name.toLowerCase()
    ).length;
    return { name, slug: name.toLowerCase().replace(/\s+/g, '-'), count };
  }).filter(p => p.count > 0);

  return (
    <>
      {/* JSON-LD structured data — rendered in HTML for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.structuredData) }}
      />

      {/* SSR content visible to crawlers */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Hero */}
        <section>
          <h1 className="text-2xl font-semibold text-foreground">
            Compare DeFi Yields Across Protocols
          </h1>
          <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed max-w-2xl">
            Track and compare {products.length}+ yield strategies across {networks.size} networks
            and {new Set(products.map(p => (p.platform_name || '').trim())).size}+ protocols.
            On-chain APY data — no token incentives, no points, just real yield.
          </p>
        </section>

        {/* Top DeFi Yields — SEO-rich answer capsule */}
        {topPerAsset.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Top DeFi Yields Right Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topPerAsset.map(p => (
                <a
                  key={p.id}
                  href={`/vault/${p.url || ''}`}
                  className="block p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#08a671]">{p.ticker.toUpperCase()}</span>
                    <span className="text-xs text-muted-foreground">{p.network}</span>
                  </div>
                  <p className="text-[13px] text-foreground font-medium truncate">{p.product_name}</p>
                  <p className="text-xs text-muted-foreground">{p.platform_name}{p.curator ? ` · ${p.curator.trim()}` : ''}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-foreground">{p.spotAPY.toFixed(2)}%</span>
                    <span className="text-xs text-muted-foreground">TVL {formatTVLCompact(p.tvl)}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Asset hubs — internal links for crawlers */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Explore Assets</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {tickers.map(t => (
              <a
                key={t}
                href={`/${t.toLowerCase()}`}
                className="block p-4 rounded-xl border border-border bg-card text-center hover:shadow-md transition-shadow"
              >
                <span className="text-base font-semibold text-foreground">{t}</span>
                <p className="text-xs text-muted-foreground mt-1">{tickerCounts[t]} strategies</p>
              </a>
            ))}
          </div>
        </section>

        {/* Top protocols — internal links */}
        {projectCounts.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Top Protocols</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {projectCounts.map(p => (
                <a
                  key={p.slug}
                  href={`/project/${p.slug}`}
                  className="block p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
                >
                  <span className="text-sm font-semibold text-foreground">{p.name}</span>
                  <p className="text-xs text-muted-foreground mt-1">{p.count} strategies</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Product table — all strategies visible in HTML */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">All Yield Strategies</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Strategy</th>
                  <th className="py-3 pr-4 font-medium">Asset</th>
                  <th className="py-3 pr-4 font-medium">Network</th>
                  <th className="py-3 pr-4 font-medium">Platform</th>
                  <th className="py-3 pr-4 font-medium text-right">APY</th>
                  <th className="py-3 font-medium text-right">TVL</th>
                </tr>
              </thead>
              <tbody>
                {homeProducts.slice(0, 50).map((p, i) => (
                  <tr key={p.id || i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 pr-4">
                      <a href={`/vault/${p.url || ''}`} className="text-foreground font-medium hover:text-[#08a671] transition-colors">
                        {p.product_name}
                      </a>
                    </td>
                    <td className="py-3 pr-4">
                      <a href={`/${p.ticker.toLowerCase()}`} className="text-[#08a671] font-medium">
                        {p.ticker.toUpperCase()}
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
          {homeProducts.length > 50 && (
            <p className="text-xs text-muted-foreground mt-3">
              Showing top 50 of {homeProducts.length} strategies.
            </p>
          )}
        </section>
      </main>

      {/* Client component for interactive features (sorting, filtering, charts) */}
      <HomepageClient
        initialProducts={JSON.parse(JSON.stringify(homeProducts))}
        tickers={tickers}
        tickerCounts={tickerCounts}
        displaySettings={displaySettings}
      />
    </>
  );
}

// ── Helpers ──

function getTopPerAsset(products: any[]) {
  const map = new Map<string, any>();
  for (const p of products) {
    if (!p || p.tvl < 10_000) continue;
    const t = p.ticker.toUpperCase();
    const current = map.get(t);
    if (!current || p.spotAPY > current.spotAPY) {
      map.set(t, p);
    }
  }
  const order = ['USDC', 'ETH', 'USDT', 'CBBTC', 'WBTC', 'EURC'];
  return order
    .filter(t => map.has(t))
    .map(t => map.get(t)!);
}

function formatTVLCompact(tvl: number): string {
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(1)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(1)}K`;
  return `$${tvl.toFixed(0)}`;
}
