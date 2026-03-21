import React, { useMemo } from 'react';
import { Link } from 'react-router';
import { SEO } from '@/app/components/SEO';
import { useRegistry } from '@/app/contexts/RegistryContext';
import { slugify, getProductSlug } from '@/app/utils/slugify';
import { NETWORKS } from '@/app/utils/assets';
import { formatAPY } from '@/app/utils/formatters';
import type { DeFiProduct } from '@/app/utils/types';
import { ChevronRight, Globe, Layers, MapPin, Building2 } from 'lucide-react';
import { projectToSlug } from './ProjectPage';

const BASE_URL = 'https://earnbase.finance';

// ─── Helpers ────────────────────────────────────────────────────

/** Maps a product's network name to its canonical URL slug */
const getNetworkSlug = (networkName: string): string => {
  const n = networkName.toLowerCase();
  const entry = NETWORKS.find(
    net => net.name.toLowerCase() === n || net.id === n
  );
  return entry ? entry.id : n.replace(/\s+/g, '-');
};

// ─── Types ──────────────────────────────────────────────────────

interface VaultEntry {
  name: string;
  platform: string;
  curator: string;
  slug: string;
  apy: number;
}

interface NetworkGroup {
  name: string;
  slug: string;
  vaults: VaultEntry[];
}

interface AssetGroup {
  ticker: string;
  tickerSlug: string;
  networks: NetworkGroup[];
  totalVaults: number;
}

// ─── Build hierarchy ────────────────────────────────────────────

function buildHierarchy(products: DeFiProduct[], resolveNetworkName?: (n: string) => string): AssetGroup[] {
  const getNetworkName = resolveNetworkName || ((n: string) => n);
  const tickerMap = new Map<string, Map<string, VaultEntry[]>>();

  for (const p of products) {
    if (!p) continue;
    const ticker = (p.ticker || 'N/A').toUpperCase();
    const network = p.network || 'Unknown';

    if (!tickerMap.has(ticker)) tickerMap.set(ticker, new Map());
    const netMap = tickerMap.get(ticker)!;

    if (!netMap.has(network)) netMap.set(network, []);

    const slug = getProductSlug(p);

    netMap.get(network)!.push({
      name: p.product_name,
      platform: p.platform_name,
      curator: p.curator,
      slug,
      apy: p.spotAPY || 0,
    });
  }

  const groups: AssetGroup[] = [];

  for (const [ticker, netMap] of tickerMap) {
    const networks: NetworkGroup[] = [];
    let totalVaults = 0;

    for (const [netName, vaults] of netMap) {
      // Sort vaults by APY descending
      vaults.sort((a, b) => b.apy - a.apy);
      totalVaults += vaults.length;

      networks.push({
        name: getNetworkName(netName),
        slug: getNetworkSlug(netName),
        vaults,
      });
    }

    // Sort networks by vault count descending
    networks.sort((a, b) => b.vaults.length - a.vaults.length);

    groups.push({
      ticker,
      tickerSlug: slugify(ticker),
      networks,
      totalVaults,
    });
  }

  // Sort assets by vault count descending
  groups.sort((a, b) => b.totalVaults - a.totalVaults);
  return groups;
}

// ─── JSON-LD ────────────────────────────────────────────────────

function buildStructuredData(groups: AssetGroup[]) {
  const items: { '@type': string; position: number; name: string; url: string }[] = [];
  let pos = 1;

  // Homepage
  items.push({
    '@type': 'ListItem',
    position: pos++,
    name: 'Explore Assets | DeFi Yield Overview',
    url: BASE_URL,
  });

  for (const group of groups) {
    // Tier 1: Asset Hub
    items.push({
      '@type': 'ListItem',
      position: pos++,
      name: `Best ${group.ticker} Yields`,
      url: `${BASE_URL}/${group.tickerSlug}`,
    });

    for (const net of group.networks) {
      // Tier 2: Network Filter
      items.push({
        '@type': 'ListItem',
        position: pos++,
        name: `${group.ticker} on ${net.name}`,
        url: `${BASE_URL}/${group.tickerSlug}/${net.slug}`,
      });
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Sitemap | All DeFi Vault Pages',
        url: `${BASE_URL}/sitemap`,
        description: 'Complete index of all Earnbase pages — assets, networks, and individual DeFi vault strategies.',
        isPartOf: { '@type': 'WebSite', name: 'Earnbase', url: BASE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Sitemap' },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Earnbase Sitemap',
        numberOfItems: items.length,
        itemListElement: items,
      },
    ],
  };
}

// ─── Component ──────────────────────────────────────────────────

interface SitemapPageProps {
  products: DeFiProduct[];
  loading: boolean;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ products, loading }) => {
  const { resolveAssetIcon, resolveNetworkIcon, resolveNetworkName } = useRegistry();

  const hierarchy = useMemo(() => buildHierarchy(products, resolveNetworkName), [products, resolveNetworkName]);

  const stats = useMemo(() => {
    const uniqueNetworks = new Set<string>();
    let networkFilterPages = 0;
    let totalVaults = 0;
    for (const g of hierarchy) {
      for (const net of g.networks) {
        uniqueNetworks.add(net.slug);
      }
      networkFilterPages += g.networks.length;
      totalVaults += g.totalVaults;
    }
    return {
      assets: hierarchy.length,
      networks: uniqueNetworks.size,
      vaults: totalVaults,
      totalPages: 1 + hierarchy.length + networkFilterPages + totalVaults, // home + Tier1 + Tier2 + Tier3
    };
  }, [hierarchy]);

  const structuredData = useMemo(() => buildStructuredData(hierarchy), [hierarchy]);

  // ── Project pages — derive from product data ──
  const projectPages = useMemo(() => {
    const MIN_STRATEGIES = 3;
    const platformMap = new Map<string, { name: string; slug: string; count: number; bestAPY: number }>();
    for (const p of products) {
      if (!p) continue;
      const slug = projectToSlug(p.platform_name);
      const existing = platformMap.get(slug);
      if (existing) {
        existing.count++;
        if (p.spotAPY > existing.bestAPY) existing.bestAPY = p.spotAPY;
      } else {
        platformMap.set(slug, { name: p.platform_name, slug, count: 1, bestAPY: p.spotAPY || 0 });
      }
    }
    return [...platformMap.values()]
      .filter(p => p.count >= MIN_STRATEGIES)
      .sort((a, b) => b.count - a.count);
  }, [products]);

  if (loading && products.length === 0) {
    return (
      <div className="space-y-8">
        <SEO
          title="Sitemap | Earnbase"
          description="Complete index of all Earnbase pages."
        />
        <div className="animate-pulse space-y-6">
          <div className="h-7 w-32 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-[20px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <SEO
        title="Sitemap | All DeFi Vault Pages | Earnbase"
        description={`Browse all ${stats.totalPages} pages on Earnbase — ${stats.assets} assets, ${stats.networks} network filters, and ${stats.vaults} individual vault strategies.`}
        structuredData={structuredData}
      />

      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#08a671]/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#08a671]" />
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-[-0.02em]">
            Sitemap
          </h1>
        </div>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-2xl">
          Complete index of all pages on Earnbase. Browse by asset, filter by network, 
          or jump directly to any vault strategy.
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Pages', value: stats.totalPages },
          { label: 'Assets', value: stats.assets },
          { label: 'Networks', value: stats.networks },
          { label: 'Vaults', value: stats.vaults },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-1">{s.label}</p>
            <p className="text-xl font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Homepage link */}
      <div className="bg-card border border-border rounded-[20px] p-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#08a671] hover:underline"
        >
          <span>Homepage | Explore Assets</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Project Pages */}
      {projectPages.length > 0 && (
        <section className="bg-card border border-border rounded-[20px] md:rounded-[24px] overflow-hidden">
          <div className="p-5 md:p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-[#08a671]/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-[#08a671]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-foreground">Projects</h2>
                <p className="text-xs text-muted-foreground font-medium">
                  {projectPages.length} project {projectPages.length === 1 ? 'page' : 'pages'}
                </p>
              </div>
            </div>
          </div>
          <ul className="divide-y divide-border">
            {projectPages.map(proj => (
              <li key={proj.slug}>
                <Link
                  to={`/project/${proj.slug}`}
                  className="flex items-center justify-between gap-3 px-5 md:px-6 py-3.5 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground font-normal truncate">
                      {proj.name}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted shrink-0">
                      {proj.count} strategies
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#08a671] whitespace-nowrap shrink-0">
                    {formatAPY(proj.bestAPY)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Hierarchical Tree */}
      <div className="space-y-6">
        {hierarchy.map(asset => {
          const assetIcon = resolveAssetIcon(asset.ticker);

          return (
            <section
              key={asset.ticker}
              className="bg-card border border-border rounded-[20px] md:rounded-[24px] overflow-hidden"
            >
              {/* Tier 1: Asset header */}
              <div className="p-5 md:p-6 border-b border-border">
                <Link
                  to={`/${asset.tickerSlug}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shrink-0">
                    {assetIcon ? (
                      <img src={assetIcon} alt={asset.ticker} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-semibold text-foreground">{asset.ticker[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-foreground group-hover:text-[#08a671] transition-colors">
                      {asset.ticker}
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium">
                      {asset.totalVaults} {asset.totalVaults === 1 ? 'vault' : 'vaults'} across {asset.networks.length} {asset.networks.length === 1 ? 'network' : 'networks'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#08a671] transition-colors shrink-0" />
                </Link>
              </div>

              {/* Tier 2 + Tier 3: Networks & Vaults */}
              <div className="divide-y divide-border">
                {asset.networks.map(net => {
                  const netIcon = resolveNetworkIcon(net.name);

                  return (
                    <div key={net.slug} className="px-5 md:px-6 py-4">
                      {/* Network header */}
                      <Link
                        to={`/${asset.tickerSlug}/${net.slug}`}
                        className="flex items-center gap-2.5 mb-3 group"
                      >
                        <div className="w-5 h-5 flex items-center justify-center shrink-0 ml-1">
                          <Globe className="w-4 h-4 text-muted-foreground group-hover:text-[#08a671] transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-[#08a671] transition-colors">
                          {net.name}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted">
                          {net.vaults.length}
                        </span>
                      </Link>

                      {/* Vault links */}
                      <ul className="ml-8 space-y-1.5">
                        {net.vaults.map((vault, idx) => (
                          <li key={`${vault.slug}-${idx}`}>
                            <Link
                              to={`/vault/${vault.slug}`}
                              className="flex items-center justify-between gap-3 py-1.5 px-3 -mx-1 rounded-xl hover:bg-muted/50 transition-colors group/vault"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <Layers className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                                <span className="text-sm text-foreground/80 group-hover/vault:text-foreground truncate font-normal">
                                  {vault.name}
                                  <span className="text-muted-foreground font-normal"> on {vault.platform}</span>
                                  {vault.curator && vault.curator !== '-' && vault.curator.trim() !== '' && (
                                    <span className="text-muted-foreground/60 font-normal"> &middot; {vault.curator}</span>
                                  )}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-[#08a671] whitespace-nowrap shrink-0">
                                {formatAPY(vault.apy)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground/60 font-medium text-center pb-4">
        This page is automatically generated from live data. All links are updated in real time.
      </p>
    </div>
  );
};