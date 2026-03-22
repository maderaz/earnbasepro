import type { Metadata } from 'next';
import { fetchPools } from '@/lib/api';
import { networkFilterSEO, BASE_URL, getProductSlug, formatTVLCompact } from '@/lib/seo';
import { NetworkFilterClient } from './network-filter-client';

export const dynamic = 'force-dynamic';

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

  const { products } = await fetchPools();
  const T = t.toUpperCase();
  const filtered = products.filter(p =>
    (p.ticker || '').toUpperCase() === T && matchNetwork(p.network, netSlug)
  );
  const sorted = [...filtered].sort((a, b) => b.spotAPY - a.spotAPY);
  const seo = networkFilterSEO(t, netName, filtered.length, sorted);
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

  const { products } = await fetchPools();
  const filtered = products.filter(p =>
    (p.ticker || '').toUpperCase() === T && matchNetwork(p.network, netSlug)
  );
  const sorted = [...filtered].sort((a, b) => b.spotAPY - a.spotAPY);
  const seo = networkFilterSEO(t, netName, filtered.length, sorted);

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
          <h1 className="text-2xl font-semibold text-foreground">
            Compare {filtered.length} {T} Yields on {netName}
          </h1>
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
                {sorted.map((p, i) => (
                  <tr key={p.id || i} className="border-b border-border/50">
                    <td className="py-3 pr-4">
                      <a href={`/vault/${getProductSlug(p)}`} className="text-foreground font-medium hover:text-[#08a671]">
                        {p.product_name}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{p.platform_name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{p.curator && p.curator !== '-' ? p.curator.trim() : '—'}</td>
                    <td className="py-3 pr-4 text-right font-medium">{p.spotAPY.toFixed(2)}%</td>
                    <td className="py-3 text-right text-muted-foreground">{formatTVLCompact(p.tvl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
        products={JSON.parse(JSON.stringify(products))}
      />
    </>
  );
}
