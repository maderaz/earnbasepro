import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, Search,
} from 'lucide-react';
import { useRegistry } from '@/app/contexts/RegistryContext';
import { getProductSlug } from '@/app/utils/slugify';
import { formatTVL, formatAPY } from '@/app/utils/formatters';
import { SEO, curatorPageSEO, ogImageUrl } from '@/app/components/SEO';
import type { DeFiProduct } from '@/app/utils/types';
import { ListPageSkeleton } from '@/app/components/ui/Skeletons';

// ── Slug derivation ──────────────────────────────────────────
export const curatorToSlug = (name: string): string =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

/** Normalize curator names (handles trailing spaces in data) */
export const normalizeCurator = (name: string | null | undefined): string | null =>
  name ? name.trim() : null;

/** Minimum strategies for a curator to get a dedicated page */
export const MIN_CURATOR_STRATEGIES = 4;

/** Check if a curator qualifies for a /curator/ page */
export const curatorHasPage = (curatorName: string, products: DeFiProduct[]): boolean => {
  const normalized = normalizeCurator(curatorName);
  if (!normalized) return false;
  const count = products.filter(p => normalizeCurator(p.curator) === normalized).length;
  return count >= MIN_CURATOR_STRATEGIES;
};

/** Get the curator page URL if the curator qualifies, otherwise null */
export const getCuratorUrl = (curatorName: string, products: DeFiProduct[]): string | null => {
  if (!curatorHasPage(curatorName, products)) return null;
  return `/curator/${curatorToSlug(normalizeCurator(curatorName)!)}`;
};

// ── Curator descriptions ─────────────────────────────────────
const CURATOR_DESCRIPTIONS: Record<string, string> = {
  "gauntlet": "Gauntlet is a quantitative risk research firm that has become one of the largest vault curators in DeFi, managing over a billion dollars across more than 60 vaults. Before entering vault curation, Gauntlet spent years as the risk management advisor for protocols like Aave, Compound, and Uniswap, building agent-based simulation models to optimize lending parameters and stress-test collateral under extreme market conditions. This deep protocol-level experience now informs how Gauntlet designs its own vaults. Gauntlet organizes its Morpho strategies into distinct risk tiers: Prime vaults allocate to blue-chip collateral with conservative parameters, Core vaults target moderate risk with broader collateral exposure, and Frontier vaults pursue higher yields by accepting more volatile assets. The same curator running all three tiers creates a natural comparison — the APY difference between a Gauntlet Prime vault and a Gauntlet Frontier vault reflects the market price of risk as assessed by the same risk model. Gauntlet also curates vaults on Euler across Ethereum, Base, and Arbitrum, including cluster vaults that combine multiple lending positions. For yield seekers evaluating Gauntlet strategies, the tiered structure makes risk-return tradeoffs explicit: each tier name signals the curator's own risk assessment.",

  "steakhouse": "Steakhouse Financial is the largest vault curator on Morpho by deposits, having grown from zero to over a billion dollars in user deposits within eighteen months. Founded by an ex-Goldman Sachs professional and a former MakerDAO core contributor, Steakhouse combines traditional finance structuring with DeFi-native risk management. The firm pioneered several risk innovations on Morpho, including the use of Aragon DAO guardians that give vault depositors veto rights over curator actions, and extended 7-day timelocks on all market changes. These depositor protections earned Steakhouse vaults the highest Credora ratings among Morpho curators. Steakhouse organizes strategies into Prime vaults for conservative blue-chip lending and High Yield vaults that access tokenized real-world assets and private credit alongside crypto-native collateral. The firm operates across Ethereum Mainnet, Base, and Arbitrum, with strategies spanning USDC, USDT, ETH, and EURC. Steakhouse was the first curator to bring tokenized private credit to Morpho, structuring a repo strategy that grew from zero to significant scale within weeks. For yield comparison, Steakhouse vaults offer a useful benchmark for depositor protection — if other curators show higher APY, the question is whether they match Steakhouse's timelock and guardian standards.",

  "re7": "Re7 Labs is a research-driven DeFi curator that manages vault strategies on Morpho across Ethereum Mainnet, Base, and Arbitrum. Re7 tends toward more aggressive allocations than conservative curators like Steakhouse or Gauntlet Prime, often including a broader set of collateral types and accepting higher utilization rates to target elevated yields. This positioning means Re7 vaults frequently appear in the upper range of APY rankings for the same asset, particularly on USDC where Re7 operates multiple vault variants. Re7 also curates EURC and WBTC strategies, giving it one of the broadest asset coverages among Morpho curators. The firm publishes research on DeFi lending dynamics and has established itself as a technically sophisticated curator with deep protocol-level knowledge. When comparing Re7 yields against more conservative curators, the APY premium typically reflects Re7's willingness to include collateral markets that others exclude — a trade-off between yield and collateral diversification risk that becomes visible when looking at the underlying market allocations.",

  "clearstar": "Clearstar Labs is a Swiss-based DeFi strategy curator backed by a family office with approximately one billion euros in assets under management. The firm combines backgrounds in private equity, investment banking, and DeFi operations to build vault strategies across Morpho, Euler, and IPOR. Clearstar deploys two main vault types on Morpho: High Yield vaults that optimize across both stable and volatile collateral markets, and Reactor vaults designed to maximize risk-adjusted returns through broader market exposure. Clearstar operates across Ethereum Mainnet, Base, and Arbitrum, often deploying the same strategy across multiple networks to capture network-specific rate differences. The firm also curates on other protocols beyond Morpho, including Euler and Upshift, making it one of the more platform-diversified curators tracked on Earnbase. Comparing Clearstar strategies across networks reveals how the same curator's approach produces different yield levels depending on local borrowing demand and liquidity conditions.",

  "mev-capital": "MEV Capital curates vault strategies on Morpho with a focus on maximizing yield through deep understanding of maximal extractable value dynamics and DeFi market microstructure. The firm operates strategies across USDC, ETH, and cbBTC on Ethereum Mainnet and Base. MEV Capital's approach to vault curation is informed by its expertise in transaction ordering and DeFi liquidity dynamics — an unusual background among curators that most focus on traditional risk modeling. MEV Capital's vaults tend to include frontier collateral markets and aggressive allocations, which can produce higher headline APY but with different risk characteristics than curators focused on blue-chip lending. For yield comparison, MEV Capital strategies are best evaluated against other aggressive-tier curators like Re7 rather than against conservative curators like Steakhouse or Gauntlet Prime.",

  "apostro": "Apostro curates lending strategies on both Euler and Morpho, with a presence on Ethereum Mainnet, Base, and BNB Chain. This multi-protocol approach is notable — most curators focus on a single lending protocol, while Apostro has built vault strategies across different architectures. On Euler, Apostro curates standalone vaults, while on Morpho the firm manages allocated lending strategies. Apostro also maintains Resolv-focused vaults that allocate specifically to Resolv collateral markets, targeting yield from this particular asset class. The firm operates across USDC and EURC, with strategies deployed on multiple networks. Comparing Apostro vaults across Euler and Morpho can reveal how the same curator's philosophy produces different results on different underlying protocol architectures.",

  "9summits": "9Summits curates yield strategies across both Morpho and Lagoon, operating on Ethereum Mainnet and Avalanche. The firm's strategies include Turtle vaults on Morpho that target conservative, risk-adjusted yield, and Flagship vaults on Lagoon that allocate across DeFi lending markets. 9Summits is one of the few curators tracked on Earnbase that operates on Avalanche, where its Lagoon vaults provide yield exposure to a network with different liquidity dynamics than Ethereum or Base. The firm manages strategies for USDC and ETH, with each vault reflecting a defined risk profile. For users specifically seeking Avalanche-native yield opportunities, 9Summits represents one of the primary curated options available.",

  "kpk": "kpk, formerly known as karpatkey, is one of the pioneering onchain asset managers in DeFi, with a track record managing treasuries for major protocols including Gnosis, ENS, Nexus Mutual, and Balancer since 2020. The firm has executed over fifteen thousand onchain transactions without loss of funds. kpk's vault curation approach is distinctive for its use of agent-powered automation — deterministic onchain agents that manage liquidity rebalancing and risk responses within seconds, operating within strictly defined policy parameters rather than relying on manual curator decisions. kpk curates strategies on both Morpho and Gearbox, spanning USDC and ETH on Ethereum Mainnet and Arbitrum. The Gearbox strategies involve leveraged positions, while the Morpho vaults focus on standard lending optimization. This dual-protocol approach means kpk manages both leveraged and unleveraged yield strategies, and comparing across them reveals the yield premium that leverage adds against the additional liquidation risk it introduces.",

  "wintermute": "Wintermute is one of the largest crypto market makers globally, providing liquidity across hundreds of exchanges and DeFi protocols. On Earnbase, Wintermute appears as a borrower on Wildcat, the private credit protocol — rather than curating lending vaults, Wintermute borrows capital from DeFi lenders at fixed rates to fund its market-making operations. This makes Wintermute-linked yields structurally different from other curators: the rate reflects what a major institutional borrower is willing to pay for capital, not variable DeFi lending supply and demand. Wintermute Private Credit vaults are available for USDC, USDT, ETH, and cbBTC on Ethereum Mainnet. The fixed-rate nature of these yields makes them a useful benchmark — when Wintermute's borrowing rates exceed variable DeFi lending rates, it signals strong institutional demand for capital. Comparing Wintermute's fixed rates against variable curator yields shows the premium institutions pay for undercollateralized DeFi access.",

  "yearn": "Yearn's strategies appear under the Yearn curator label on platforms like Morpho, representing the protocol's managed approach to vault allocation. Rather than deploying on its own infrastructure exclusively, Yearn curates Morpho vaults that leverage its allocation expertise within Morpho's isolated lending markets. These strategies often carry the OG Compounder branding, combining Yearn's historical yield optimization knowledge with Morpho's market infrastructure. Yearn-curated vaults span USDC and USDT on Ethereum Mainnet and Base. The firm's long history in DeFi yield optimization — dating back to 2020 — gives it one of the longest track records among active curators, with observable yield patterns across multiple market cycles.",
};

const getCuratorDescription = (slug: string, curatorName: string): string =>
  CURATOR_DESCRIPTIONS[slug] ||
  `${curatorName} is a DeFi vault curator tracked on Earnbase. Compare yield strategies curated by ${curatorName}, including APY rates, TVL, and performance data across multiple platforms and networks.`;

/** Convert a curator slug back to a display-friendly name for loading-state SEO. */
const slugToCuratorName = (slug: string | undefined): string => {
  if (!slug) return 'Curator';
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const slugToCuratorTitle = (slug: string | undefined): string => {
  const name = slugToCuratorName(slug);
  const full = `Strategies Curated by ${name} | Earnbase`;
  return full.length <= 60 ? full : `${name} Yields | Earnbase`;
};

/** Split a raw description into ~3-sentence paragraphs, stripping double-hyphens. */
const formatDescriptionParagraphs = (raw: string): string[] => {
  const cleaned = raw.replace(/ -- /g, '. ').replace(/\.\./g, '.').replace(/\. ,/g, ',');
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    paragraphs.push(sentences.slice(i, i + 3).map(s => s.trim()).join(' '));
  }
  return paragraphs;
};

// ── Sort Icon ────────────────────────────────────────────────
type SortKey = keyof DeFiProduct;
const SortIcon: React.FC<{
  col: SortKey;
  sortConfig: { key: SortKey; direction: 'asc' | 'desc' } | null;
}> = ({ col, sortConfig }) => {
  const active = sortConfig?.key === col;
  if (!active) {
    return <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/th:opacity-30 transition-opacity" />;
  }
  return sortConfig.direction === 'desc' ? (
    <ArrowDown className="w-3 h-3 text-[#08a671]" />
  ) : (
    <ArrowUp className="w-3 h-3 text-[#08a671]" />
  );
};

// ── Per-ticker table ─────────────────────────────────────────
interface TickerTableProps {
  ticker: string;
  products: DeFiProduct[];
  allProducts: DeFiProduct[];
}

const TickerTable: React.FC<TickerTableProps> = ({ ticker, products, allProducts }) => {
  const navigate = useNavigate();
  const { resolveAssetIcon, resolveNetworkIcon } = useRegistry();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(
    { key: 'spotAPY', direction: 'desc' }
  );

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'desc') return { key, direction: 'asc' };
        return null;
      }
      return { key, direction: 'desc' };
    });
  };

  const sorted = useMemo(() => {
    const arr = [...products];
    if (!sortConfig) return arr;
    const { key, direction } = sortConfig;
    return arr.sort((a, b) => {
      const aVal = (a as any)[key] ?? 0;
      const bVal = (b as any)[key] ?? 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const sa = String(aVal).toLowerCase();
      const sb = String(bVal).toLowerCase();
      return direction === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }, [products, sortConfig]);

  return (
    <div className="-mx-5 sm:mx-0 bg-card sm:rounded-lg border border-border overflow-hidden transition-colors duration-300">
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50">
              {/* # */}
              <th className="hidden md:table-cell pl-5 pr-1 py-3 text-[11px] font-medium text-muted-foreground/50 w-[44px]">
                <span className="contents">#</span>
              </th>
              {/* Product */}
              <th
                className="pl-4 md:pl-3 pr-2 py-3 text-[11px] font-medium text-muted-foreground/50 cursor-pointer group/th"
                onClick={() => handleSort('product_name')}
              >
                <span className="inline-flex items-center gap-1">
                  Product <SortIcon col="product_name" sortConfig={sortConfig} />
                </span>
              </th>
              {/* APY 24h */}
              <th
                className="pl-1 pr-3 py-3 text-[11px] font-medium text-muted-foreground/50 text-right cursor-pointer group/th whitespace-nowrap w-[80px] sm:w-[90px]"
                onClick={() => handleSort('spotAPY')}
              >
                <span className="inline-flex items-center justify-end gap-1 w-full">
                  APY <span className="hidden sm:inline">24h</span> <SortIcon col="spotAPY" sortConfig={sortConfig} />
                </span>
              </th>
              {/* APY 30d */}
              <th
                className="hidden xl:table-cell px-4 py-3 text-[11px] font-medium text-muted-foreground/70 text-right cursor-pointer group/th whitespace-nowrap"
                onClick={() => handleSort('monthlyAPY')}
              >
                <span className="inline-flex items-center justify-end gap-1 w-full">
                  APY 30d <SortIcon col="monthlyAPY" sortConfig={sortConfig} />
                </span>
              </th>
              {/* TVL */}
              <th
                className="hidden sm:table-cell px-4 py-3 text-[11px] font-medium text-muted-foreground/70 text-right cursor-pointer group/th"
                onClick={() => handleSort('tvl')}
              >
                <span className="inline-flex items-center justify-end gap-1 w-full">
                  TVL <SortIcon col="tvl" sortConfig={sortConfig} />
                </span>
              </th>
              {/* Chain */}
              <th className="hidden md:table-cell px-2 py-3 text-[11px] font-medium text-muted-foreground/50 text-center w-[44px]">
                <span className="contents" />
              </th>
              {/* Explore CTA */}
              <th className="hidden lg:table-cell py-3 pr-5 w-[110px]" />
              {/* Arrow -- mobile */}
              <th className="lg:hidden w-6 pr-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((product, idx) => {
              const vaultUrl = `/vault/${getProductSlug(product)}`;
              return (
                <tr
                  key={product.id}
                  onClick={() => navigate(vaultUrl)}
                  className="border-b border-border/30 last:border-b-0 hover:bg-[#f8fafb] dark:hover:bg-muted/10 transition-colors cursor-pointer group"
                  role="link"
                >
                  {/* # */}
                  <td className="hidden md:table-cell pl-5 pr-1 py-3 align-middle text-[12px] text-muted-foreground/35 font-normal tabular-nums">
                    {idx + 1}
                  </td>

                  {/* Product */}
                  <td className="pl-4 md:pl-3 pr-2 py-3 align-middle max-w-0 sm:max-w-none">
                    <Link
                      to={vaultUrl}
                      className="flex items-center gap-2 sm:gap-2.5 min-w-0"
                      onClick={(e) => e.stopPropagation()}
                      tabIndex={-1}
                    >
                      {/* Icon */}
                      <div className="relative shrink-0">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex items-center justify-center">
                          {resolveAssetIcon(product.ticker) ? (
                            <img src={resolveAssetIcon(product.ticker)!} alt={product.ticker} className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                          ) : (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-[8px] sm:text-[9px] font-bold">{product.ticker[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <span className="text-[12px] sm:text-[13px] font-medium text-foreground leading-tight truncate block">
                          {product.product_name}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-muted-foreground/65 dark:text-muted-foreground/60 font-normal truncate block mt-px">
                          <span className="inline-flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-full border border-border/60 flex items-center justify-center shrink-0 md:hidden"><img src={resolveNetworkIcon(product.network)} alt={product.network} className="w-2.5 h-2.5 object-contain" /></span><span className="contents">{product.platform_name}{product.curator && product.curator !== '-' ? <span className="contents"> · {product.curator}</span> : null}</span></span>
                        </span>
                      </div>
                    </Link>
                  </td>

                  {/* APY 24h */}
                  <td className="pl-1 pr-3 py-3 align-middle text-right">
                    <span className="text-[13px] font-semibold text-[#08a671] tabular-nums">
                      {formatAPY(product.spotAPY)}
                    </span>
                  </td>

                  {/* APY 30d */}
                  <td className="hidden xl:table-cell px-4 py-3 align-middle text-right">
                    <span className="text-[12px] text-muted-foreground/80 dark:text-muted-foreground/70 font-medium tabular-nums">
                      {formatAPY(product.monthlyAPY)}
                    </span>
                  </td>

                  {/* TVL */}
                  <td className="hidden sm:table-cell px-4 py-3 align-middle text-right">
                    <span className="text-[12px] text-muted-foreground/80 dark:text-muted-foreground/70 font-medium tabular-nums">
                      {formatTVL(product.tvl)}
                    </span>
                  </td>

                  {/* Chain */}
                  <td className="hidden md:table-cell px-2 py-3 align-middle w-[44px]">
                    <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 mx-auto">
                      <img src={resolveNetworkIcon(product.network)} alt={product.network} className="w-full h-full object-contain" />
                    </div>
                  </td>

                  {/* Explore CTA */}
                  <td className="hidden lg:table-cell py-3 pr-5 align-middle">
                    <Link
                      to={vaultUrl}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md text-[12px] font-medium text-foreground/70 bg-muted/60 border border-border/50 hover:bg-[#08a671] hover:text-white hover:border-[#08a671] transition-all duration-200"
                      onClick={(e) => e.stopPropagation()}
                      tabIndex={-1}
                    >
                      Explore
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>

                  {/* Chevron -- mobile */}
                  <td className="lg:hidden pr-3 py-3 align-middle">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/15 group-hover:text-muted-foreground/40 transition-colors ml-auto" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Helpers ──────────────────────────────────────────────────
const formatNaturalList = (items: string[]): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
};

// ── Main Component ───────────────────────────────────────────
interface CuratorPageProps {
  products: DeFiProduct[];
  loading: boolean;
  error?: string | null;
}

export const CuratorPage: React.FC<CuratorPageProps> = ({ products, loading, error }) => {
  const { curatorSlug } = useParams<{ curatorSlug: string }>();
  const { resolveAssetIcon } = useRegistry();

  // ── Build curator slug → name map ────────────────────────
  const curatorMap = useMemo(() => {
    const map: Record<string, string> = {};
    products.forEach(p => {
      const normalized = normalizeCurator(p.curator);
      if (!normalized) return;
      const slug = curatorToSlug(normalized);
      if (!map[slug]) map[slug] = normalized;
    });
    return map;
  }, [products]);

  const curatorName = curatorSlug ? curatorMap[curatorSlug] : undefined;

  // ── Filter products by curator ───────────────────────────
  const curatorProducts = useMemo(
    () => curatorName
      ? products.filter(p => normalizeCurator(p.curator) === curatorName)
      : [],
    [products, curatorName]
  );

  // ── Computed stats ───────────────────────────────────────
  const { tickers, platforms, networks, tickerList, platformList } = useMemo(() => {
    const tSet = new Set<string>();
    const pSet = new Set<string>();
    const nSet = new Set<string>();
    curatorProducts.forEach(p => {
      tSet.add(p.ticker.toUpperCase());
      pSet.add(p.platform_name);
      nSet.add(p.network);
    });
    const tickers = [...tSet].sort();
    const platforms = [...pSet].sort();
    const networks = [...nSet].sort();
    return {
      tickers,
      platforms,
      networks,
      tickerList: formatNaturalList(tickers),
      platformList: formatNaturalList(platforms),
    };
  }, [curatorProducts]);

  const strategyCount = curatorProducts.length;

  // ── Per-ticker groups (sorted by count desc) ─────────────
  const tickerGroups = useMemo(() => {
    const map: Record<string, DeFiProduct[]> = {};
    curatorProducts.forEach(p => {
      const t = p.ticker.toUpperCase();
      if (!map[t]) map[t] = [];
      map[t].push(p);
    });
    return Object.entries(map)
      .map(([ticker, prods]) => ({
        ticker,
        products: prods,
        topAPY: Math.max(...prods.map(p => p.spotAPY || 0)),
      }))
      .sort((a, b) => b.products.length - a.products.length);
  }, [curatorProducts]);

  // ── Top product (by spotAPY) ─────────────────────────────
  const topProduct = useMemo(
    () => [...curatorProducts].sort((a, b) => b.spotAPY - a.spotAPY)[0] || null,
    [curatorProducts]
  );

  // ── FAQ items ────────────────────────────────────────────
  const faqItems = useMemo(() => {
    if (!curatorName || strategyCount === 0) return [];
    const topAPY = topProduct ? `${topProduct.spotAPY.toFixed(2)}%` : '0%';
    const topName = topProduct?.product_name || '';
    const topTicker = topProduct?.ticker?.toUpperCase() || '';
    const topNetwork = topProduct?.network || '';

    return [
      {
        question: `What is the highest APY curated by ${curatorName}?`,
        answer: `The highest yield curated by ${curatorName} is ${topAPY} APY on ${topName} (${topTicker} on ${topNetwork}). Rates are variable and update daily.`,
      },
      {
        question: `How many strategies does ${curatorName} curate on Earnbase?`,
        answer: `Earnbase tracks ${strategyCount} strategies curated by ${curatorName} across ${platforms.length} platform${platforms.length !== 1 ? 's' : ''} and ${networks.length} network${networks.length !== 1 ? 's' : ''}.`,
      },
      {
        question: `What assets does ${curatorName} support?`,
        answer: `${curatorName} curates yield strategies for ${tickerList}. Each asset has strategies with different risk profiles and APY rates.`,
      },
      {
        question: `Which platforms does ${curatorName} operate on?`,
        answer: `${curatorName} operates on ${platformList}. Different platforms offer different risk architectures and yield mechanics.`,
      },
    ];
  }, [curatorName, strategyCount, topProduct, tickers, platforms, networks, tickerList, platformList]);

  // ── SEO ──────────────────────────────────────────────────
  const seo = useMemo(() => {
    if (!curatorSlug || !curatorName) return null;
    return curatorPageSEO(
      curatorName,
      curatorSlug,
      strategyCount,
      tickers,
      networks.length,
      curatorProducts.slice().sort((a, b) => b.spotAPY - a.spotAPY).slice(0, 10),
      faqItems
    );
  }, [curatorSlug, curatorName, strategyCount, tickers, networks, curatorProducts, faqItems]);

  // ── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <>
        <SEO
          title={slugToCuratorTitle(curatorSlug)}
          description={`Yield strategies curated by ${slugToCuratorName(curatorSlug)} on Earnbase. Live APY, TVL, and performance data — updated daily.`}
        />
        <ListPageSkeleton />
      </>
    );
  }

  // ── Server error state — backend is down ────────────────
  if (error && products.length === 0) {
    return (
      <>
        <SEO
          title={slugToCuratorTitle(curatorSlug)}
          description={`Yield strategies curated by ${slugToCuratorName(curatorSlug)} on Earnbase.`}
        />
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Search className="w-7 h-7 text-destructive/40" />
          </div>
          <div>
            <h1 className="text-[17px] font-medium text-foreground">Unable to Load Data</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              The server is temporarily unavailable. Please try again in a moment.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-xs font-semibold hover:bg-[#08a671]/90 transition-all"
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  // ── 404 state — unknown slug or not enough strategies ────
  if (!curatorName || curatorProducts.length < MIN_CURATOR_STRATEGIES) {
    return (
      <>
        <SEO
          title="Curator Not Found | Earnbase"
          description="This curator page does not exist on Earnbase."
          noindex
        />
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Search className="w-7 h-7 text-muted-foreground/40" />
          </div>
          <div>
            <h1 className="text-[17px] font-medium text-foreground">Curator Not Found</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              No strategies found for <code className="px-1.5 py-0.5 bg-muted rounded text-xs">/curator/{curatorSlug}</code>
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-xs font-semibold hover:bg-[#08a671]/90 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  const description = getCuratorDescription(curatorSlug!, curatorName);

  return (
    <>
      {seo && (
        <SEO
          title={seo.title}
          description={seo.description}
          structuredData={seo.structuredData}
          ogImage={ogImageUrl.home()}
        />
      )}

      <div className="space-y-8">
        {/* ── H1 + Intro ──────────────────────────────────── */}
        <header className="space-y-3">
          <h1 className="text-[17px] font-medium text-[#141414] dark:text-foreground leading-tight">
            {curatorName} Yields — Compare APY Across {tickers.length} Asset{tickers.length !== 1 ? 's' : ''}
          </h1>
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed w-full">
            Earnbase tracks {strategyCount} yield strategies curated by {curatorName} across {platforms.length} platform{platforms.length !== 1 ? 's' : ''} and {networks.length} network{networks.length !== 1 ? 's' : ''}. Compare APY rates for {tickerList} — updated daily.
          </p>
        </header>

        {/* ── Jump-to boxes (Asset Cards) ─────────────────── */}
        <section>
          <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.1em] mb-3">
            Tracked Assets by {curatorName} — Jump to
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {tickerGroups.map(g => {
              const icon = resolveAssetIcon(g.ticker);
              return (
                <a
                  key={g.ticker}
                  href={`#${g.ticker.toLowerCase()}`}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border hover:border-[#08a671]/30 hover:shadow-sm transition-all group"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                    {icon ? (
                      <img src={icon} alt={g.ticker} className="w-5 h-5 object-contain" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-[8px] font-bold">{g.ticker.slice(0, 2)}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[12px] font-semibold text-foreground">{g.ticker}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{g.products.length}</span>
                  <span className="text-[10px] text-[#08a671] font-medium tabular-nums">{formatAPY(g.topAPY)}</span>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── Per-ticker tables ───────────────────────────── */}
        {tickerGroups.map(g => (
          <section key={g.ticker} id={g.ticker.toLowerCase()} className="scroll-mt-24">
            <div className="flex items-center gap-2.5 mb-3">
              {(() => {
                const icon = resolveAssetIcon(g.ticker);
                return icon ? (
                  <img src={icon} alt={g.ticker} className="w-5 h-5 object-contain" />
                ) : null;
              })()}
              <h2 className="text-[15px] font-medium text-foreground">
                {g.ticker}
              </h2>
              <span className="text-[11px] text-muted-foreground font-medium">
                {g.products.length} strateg{g.products.length === 1 ? 'y' : 'ies'}
              </span>
            </div>
            <TickerTable ticker={g.ticker} products={g.products} allProducts={products} />
          </section>
        ))}

        {/* ── About Section ───────────────────────────────── */}
        <section>
          <h2 className="text-[15px] font-medium text-foreground mb-3">About {curatorName}</h2>
          <div className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed space-y-3">
            {formatDescriptionParagraphs(description).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <p>Earnbase tracks {strategyCount} strategies curated by {curatorName} across {platformList}.</p>
          </div>
        </section>

        {/* ── FAQ Section ─────────────────────────────────── */}
        <section>
          <h2 className="text-[15px] font-medium text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="group bg-card rounded-xl border border-border overflow-hidden">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-[13px] font-medium text-foreground hover:bg-muted/30 transition-colors list-none">
                  {item.question}
                  <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90 shrink-0 ml-2" />
                </summary>
                <div className="px-4 pb-3 text-[13px] text-muted-foreground leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};