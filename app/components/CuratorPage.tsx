'use client';
/**
 * CuratorPage — Port of src/app/components/CuratorPage.tsx
 * Renders /curator/[curatorSlug] with sortable per-ticker tables + FAQ.
 */
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { useRegistry } from '../hooks/useRegistry';
import { getProductSlug } from '@/app/utils/slugify';
import { formatTVL, formatAPY } from '@/app/utils/formatters';
import type { DeFiProduct } from '@/lib/api';

// ── Slug helpers ──────────────────────────────────────────────

export const curatorToSlug = (name: string): string =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export const normalizeCurator = (name: string | null | undefined): string | null =>
  name ? name.trim() : null;

export const MIN_CURATOR_STRATEGIES = 4;

// ── Curator descriptions ──────────────────────────────────────

const CURATOR_DESCRIPTIONS: Record<string, string> = {
  gauntlet: 'Gauntlet is a quantitative risk research firm that has become one of the largest vault curators in DeFi, managing over a billion dollars across more than 60 vaults. Before entering vault curation, Gauntlet spent years as the risk management advisor for protocols like Aave, Compound, and Uniswap, building agent-based simulation models to optimize lending parameters and stress-test collateral under extreme market conditions. This deep protocol-level experience now informs how Gauntlet designs its own vaults. Gauntlet organizes its Morpho strategies into distinct risk tiers: Prime vaults allocate to blue-chip collateral with conservative parameters, Core vaults target moderate risk with broader collateral exposure, and Frontier vaults pursue higher yields by accepting more volatile assets. The same curator running all three tiers creates a natural comparison. Gauntlet also curates vaults on Euler across Ethereum, Base, and Arbitrum, including cluster vaults that combine multiple lending positions.',
  steakhouse: "Steakhouse Financial is the largest vault curator on Morpho by deposits, having grown from zero to over a billion dollars in user deposits within eighteen months. Founded by an ex-Goldman Sachs professional and a former MakerDAO core contributor, Steakhouse combines traditional finance structuring with DeFi-native risk management. The firm pioneered several risk innovations on Morpho, including the use of Aragon DAO guardians that give vault depositors veto rights over curator actions, and extended 7-day timelocks on all market changes. These depositor protections earned Steakhouse vaults the highest Credora ratings among Morpho curators. Steakhouse organizes strategies into Prime vaults for conservative blue-chip lending and High Yield vaults that access tokenized real-world assets and private credit alongside crypto-native collateral.",
  re7: 'Re7 Labs is a research-driven DeFi curator that manages vault strategies on Morpho across Ethereum Mainnet, Base, and Arbitrum. Re7 tends toward more aggressive allocations than conservative curators like Steakhouse or Gauntlet Prime, often including a broader set of collateral types and accepting higher utilization rates to target elevated yields. This positioning means Re7 vaults frequently appear in the upper range of APY rankings for the same asset, particularly on USDC where Re7 operates multiple vault variants. Re7 also curates EURC and WBTC strategies, giving it one of the broadest asset coverages among Morpho curators.',
  clearstar: "Clearstar Labs is a Swiss-based DeFi strategy curator backed by a family office with approximately one billion euros in assets under management. The firm combines backgrounds in private equity, investment banking, and DeFi operations to build vault strategies across Morpho, Euler, and IPOR. Clearstar deploys two main vault types on Morpho: High Yield vaults that optimize across both stable and volatile collateral markets, and Reactor vaults designed to maximize risk-adjusted returns through broader market exposure. Clearstar operates across Ethereum Mainnet, Base, and Arbitrum, often deploying the same strategy across multiple networks.",
  'mev-capital': "MEV Capital curates vault strategies on Morpho with a focus on maximizing yield through deep understanding of maximal extractable value dynamics and DeFi market microstructure. The firm operates strategies across USDC, ETH, and cbBTC on Ethereum Mainnet and Base. MEV Capital's approach to vault curation is informed by its expertise in transaction ordering and DeFi liquidity dynamics.",
  apostro: "Apostro curates lending strategies on both Euler and Morpho, with a presence on Ethereum Mainnet, Base, and BNB Chain. This multi-protocol approach is notable — most curators focus on a single lending protocol, while Apostro has built vault strategies across different architectures. Apostro also maintains Resolv-focused vaults that allocate specifically to Resolv collateral markets.",
  '9summits': "9Summits curates yield strategies across both Morpho and Lagoon, operating on Ethereum Mainnet and Avalanche. The firm's strategies include Turtle vaults on Morpho that target conservative, risk-adjusted yield, and Flagship vaults on Lagoon that allocate across DeFi lending markets. 9Summits is one of the few curators tracked on Earnbase that operates on Avalanche.",
  kpk: "kpk, formerly known as karpatkey, is one of the pioneering onchain asset managers in DeFi, with a track record managing treasuries for major protocols including Gnosis, ENS, Nexus Mutual, and Balancer since 2020. The firm has executed over fifteen thousand onchain transactions without loss of funds. kpk's vault curation approach is distinctive for its use of agent-powered automation — deterministic onchain agents that manage liquidity rebalancing and risk responses within seconds.",
  wintermute: 'Wintermute is one of the largest crypto market makers globally, providing liquidity across hundreds of exchanges and DeFi protocols. On Earnbase, Wintermute appears as a borrower on Wildcat, the private credit protocol — rather than curating lending vaults, Wintermute borrows capital from DeFi lenders at fixed rates to fund its market-making operations.',
  yearn: "Yearn's strategies appear under the Yearn curator label on platforms like Morpho, representing the protocol's managed approach to vault allocation. These strategies often carry the OG Compounder branding, combining Yearn's historical yield optimization knowledge with Morpho's market infrastructure.",
};

const getCuratorDescription = (slug: string, curatorName: string): string =>
  CURATOR_DESCRIPTIONS[slug] ||
  `${curatorName} is a DeFi vault curator tracked on Earnbase. Compare yield strategies curated by ${curatorName}, including APY rates, TVL, and performance data across multiple platforms and networks.`;

const formatDescriptionParagraphs = (raw: string): string[] => {
  const cleaned = raw.replace(/ -- /g, '. ').replace(/\.\./g, '.').replace(/\. ,/g, ',');
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    paragraphs.push(sentences.slice(i, i + 3).map(s => s.trim()).join(' '));
  }
  return paragraphs;
};

const formatNaturalList = (items: string[]): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
};

// ── Sort Icon ─────────────────────────────────────────────────

type SortKey = keyof DeFiProduct;

const SortIcon: React.FC<{
  col: SortKey;
  sortConfig: { key: SortKey; direction: 'asc' | 'desc' } | null;
}> = ({ col, sortConfig }) => {
  const active = sortConfig?.key === col;
  if (!active) return <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/th:opacity-30 transition-opacity" />;
  return sortConfig.direction === 'desc'
    ? <ArrowDown className="w-3 h-3 text-[#08a671]" />
    : <ArrowUp className="w-3 h-3 text-[#08a671]" />;
};

// ── Per-ticker table ──────────────────────────────────────────

const TickerTable: React.FC<{ products: DeFiProduct[] }> = ({ products }) => {
  const router = useRouter();
  const { resolveAssetIcon, resolveNetworkIcon } = useRegistry();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(
    { key: 'spotAPY', direction: 'desc' },
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
      if (typeof aVal === 'number' && typeof bVal === 'number')
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      return direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [products, sortConfig]);

  return (
    <div className="-mx-5 sm:mx-0 bg-card sm:rounded-lg border border-border overflow-hidden transition-colors duration-300">
      <div className="w-full overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50">
              <th className="hidden md:table-cell pl-5 pr-1 py-3 text-[11px] font-medium text-muted-foreground/50 w-[44px]">#</th>
              <th className="pl-4 md:pl-3 pr-2 py-3 text-[11px] font-medium text-muted-foreground/50 cursor-pointer group/th" onClick={() => handleSort('product_name')}>
                <span className="inline-flex items-center gap-1">Product <SortIcon col="product_name" sortConfig={sortConfig} /></span>
              </th>
              <th className="pl-1 pr-3 py-3 text-[11px] font-medium text-muted-foreground/50 text-right cursor-pointer group/th whitespace-nowrap w-[80px] sm:w-[90px]" onClick={() => handleSort('spotAPY')}>
                <span className="inline-flex items-center justify-end gap-1 w-full">APY <span className="hidden sm:inline">24h</span> <SortIcon col="spotAPY" sortConfig={sortConfig} /></span>
              </th>
              <th className="hidden xl:table-cell px-4 py-3 text-[11px] font-medium text-muted-foreground/70 text-right cursor-pointer group/th whitespace-nowrap" onClick={() => handleSort('monthlyAPY')}>
                <span className="inline-flex items-center justify-end gap-1 w-full">APY 30d <SortIcon col="monthlyAPY" sortConfig={sortConfig} /></span>
              </th>
              <th className="hidden sm:table-cell px-4 py-3 text-[11px] font-medium text-muted-foreground/70 text-right cursor-pointer group/th" onClick={() => handleSort('tvl')}>
                <span className="inline-flex items-center justify-end gap-1 w-full">TVL <SortIcon col="tvl" sortConfig={sortConfig} /></span>
              </th>
              <th className="hidden md:table-cell px-2 py-3 text-[11px] font-medium text-muted-foreground/50 text-center w-[44px]" />
              <th className="hidden lg:table-cell py-3 pr-5 w-[110px]" />
              <th className="lg:hidden w-6 pr-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((product, idx) => {
              const vaultUrl = `/vault/${getProductSlug(product)}`;
              return (
                <tr
                  key={product.id}
                  onClick={() => router.push(vaultUrl)}
                  className="border-b border-border/30 last:border-b-0 hover:bg-[#f8fafb] dark:hover:bg-muted/10 transition-colors cursor-pointer group"
                  role="link"
                >
                  <td className="hidden md:table-cell pl-5 pr-1 py-3 align-middle text-[12px] text-muted-foreground/35 font-normal tabular-nums">{idx + 1}</td>
                  <td className="pl-4 md:pl-3 pr-2 py-3 align-middle max-w-0 sm:max-w-none">
                    <Link href={vaultUrl} className="flex items-center gap-2 sm:gap-2.5 min-w-0" onClick={e => e.stopPropagation()} tabIndex={-1}>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                        {resolveAssetIcon(product.ticker) ? (
                          <img src={resolveAssetIcon(product.ticker)!} alt={product.ticker} className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                        ) : (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-[8px] sm:text-[9px] font-bold">{product.ticker[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <span className="text-[12px] sm:text-[13px] font-medium text-foreground leading-tight truncate block">{product.product_name}</span>
                        <span className="text-[10px] sm:text-[11px] text-muted-foreground/65 font-normal truncate block mt-px">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-3.5 h-3.5 rounded-full border border-border/60 flex items-center justify-center shrink-0 md:hidden">
                              <img src={resolveNetworkIcon(product.network)} alt={product.network} className="w-2.5 h-2.5 object-contain" />
                            </span>
                            {product.platform_name}{product.curator && product.curator !== '-' ? ` · ${product.curator}` : null}
                          </span>
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td className="pl-1 pr-3 py-3 align-middle text-right">
                    <span className="text-[13px] font-semibold text-[#08a671] tabular-nums">{formatAPY(product.spotAPY)}</span>
                  </td>
                  <td className="hidden xl:table-cell px-4 py-3 align-middle text-right">
                    <span className="text-[12px] text-muted-foreground/80 font-medium tabular-nums">{formatAPY(product.monthlyAPY)}</span>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-3 align-middle text-right">
                    <span className="text-[12px] text-muted-foreground/80 font-medium tabular-nums">{formatTVL(product.tvl)}</span>
                  </td>
                  <td className="hidden md:table-cell px-2 py-3 align-middle w-[44px]">
                    <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 mx-auto">
                      <img src={resolveNetworkIcon(product.network)} alt={product.network} className="w-full h-full object-contain" />
                    </div>
                  </td>
                  <td className="hidden lg:table-cell py-3 pr-5 align-middle">
                    <Link
                      href={vaultUrl}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md text-[12px] font-medium text-foreground/70 bg-muted/60 border border-border/50 hover:bg-[#08a671] hover:text-white hover:border-[#08a671] transition-all duration-200"
                      onClick={e => e.stopPropagation()}
                      tabIndex={-1}
                    >
                      Explore <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
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

// ── Main Component ────────────────────────────────────────────

interface Props {
  curatorSlug: string;
  products: DeFiProduct[];
}

export const CuratorPage: React.FC<Props> = ({ curatorSlug, products }) => {
  const { resolveAssetIcon } = useRegistry();

  // Build slug → display name map
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

  const curatorName = curatorMap[curatorSlug];

  const curatorProducts = useMemo(
    () => curatorName ? products.filter(p => normalizeCurator(p.curator) === curatorName) : [],
    [products, curatorName],
  );

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
    return { tickers, platforms, networks, tickerList: formatNaturalList(tickers), platformList: formatNaturalList(platforms) };
  }, [curatorProducts]);

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

  const topProduct = useMemo(
    () => [...curatorProducts].sort((a, b) => b.spotAPY - a.spotAPY)[0] || null,
    [curatorProducts],
  );

  const faqItems = useMemo(() => {
    if (!curatorName || curatorProducts.length === 0) return [];
    const topAPY = topProduct ? `${topProduct.spotAPY.toFixed(2)}%` : '0%';
    return [
      {
        question: `What is the highest APY curated by ${curatorName}?`,
        answer: `The highest yield curated by ${curatorName} is ${topAPY} APY on ${topProduct?.product_name || ''} (${topProduct?.ticker?.toUpperCase() || ''} on ${topProduct?.network || ''}). Rates are variable and update daily.`,
      },
      {
        question: `How many strategies does ${curatorName} curate on Earnbase?`,
        answer: `Earnbase tracks ${curatorProducts.length} strategies curated by ${curatorName} across ${platforms.length} platform${platforms.length !== 1 ? 's' : ''} and ${networks.length} network${networks.length !== 1 ? 's' : ''}.`,
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
  }, [curatorName, curatorProducts, topProduct, platforms, networks, tickerList, platformList]);

  if (!curatorName || curatorProducts.length < MIN_CURATOR_STRATEGIES) return null;

  const description = getCuratorDescription(curatorSlug, curatorName);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-[17px] font-medium text-[#141414] dark:text-foreground leading-tight">
          {curatorName} Yields — Compare APY Across {tickers.length} Asset{tickers.length !== 1 ? 's' : ''}
        </h1>
        <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed w-full">
          Earnbase tracks {curatorProducts.length} yield strategies curated by {curatorName} across {platforms.length} platform{platforms.length !== 1 ? 's' : ''} and {networks.length} network{networks.length !== 1 ? 's' : ''}. Compare APY rates for {tickerList} — updated daily.
        </p>
      </header>

      {/* Asset jump links */}
      <section>
        <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.1em] mb-3">
          Tracked Assets by {curatorName} — Jump to
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {tickerGroups.map(g => {
            const icon = resolveAssetIcon(g.ticker);
            return (
              <a key={g.ticker} href={`#${g.ticker.toLowerCase()}`}
                className="inline-flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border hover:border-[#08a671]/30 hover:shadow-sm transition-all">
                <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                  {icon ? <img src={icon} alt={g.ticker} className="w-5 h-5 object-contain" /> : (
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

      {/* Per-ticker sortable tables */}
      {tickerGroups.map(g => (
        <section key={g.ticker} id={g.ticker.toLowerCase()} className="scroll-mt-24">
          <div className="flex items-center gap-2.5 mb-3">
            {resolveAssetIcon(g.ticker) && (
              <img src={resolveAssetIcon(g.ticker)!} alt={g.ticker} className="w-5 h-5 object-contain" />
            )}
            <h2 className="text-[15px] font-medium text-foreground">{g.ticker}</h2>
            <span className="text-[11px] text-muted-foreground font-medium">
              {g.products.length} strateg{g.products.length === 1 ? 'y' : 'ies'}
            </span>
          </div>
          <TickerTable products={g.products} />
        </section>
      ))}

      {/* About */}
      <section>
        <h2 className="text-[15px] font-medium text-foreground mb-3">About {curatorName}</h2>
        <div className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed space-y-3">
          {formatDescriptionParagraphs(description).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p>Earnbase tracks {curatorProducts.length} strategies curated by {curatorName} across {platformList}.</p>
        </div>
      </section>

      {/* FAQ */}
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
  );
};
