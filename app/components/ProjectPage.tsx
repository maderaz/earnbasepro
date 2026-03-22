'use client';
/**
 * ProjectPage — Port of src/app/components/ProjectPage.tsx
 * Renders /project/[slug] with sortable per-ticker tables + FAQ.
 */
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { useRegistry } from '@/app/hooks/useRegistry';
import { getProductSlug } from '@/app/utils/slugify';
import { formatTVL, formatAPY } from '@/app/utils/formatters';
import type { DeFiProduct } from '@/lib/api';

// ── Slug helpers ──────────────────────────────────────────────

export const projectToSlug = (name: string): string =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// ── Project descriptions ──────────────────────────────────────

const PROJECT_DESCRIPTIONS: Record<string, string> = {
  morpho: "With over a hundred curated strategies available, Morpho presents one of the widest yield selection problems in DeFi. Two vaults accepting the same asset on the same network can offer dramatically different rates depending on who manages them. This happens because Morpho's isolated market architecture lets any curator create their own lending strategy with custom risk parameters, collateral choices, and allocation logic. Gauntlet tends toward conservative, risk-scored allocations. Steakhouse focuses on blue-chip lending with deep liquidity. Re7 often pursues more aggressive opportunities. MEV Capital optimizes around maximal extractable value dynamics. Morpho operates across Ethereum Mainnet and Base, and curator strategies on Base often show different rate dynamics than Mainnet due to distinct borrowing demand patterns on each network.",
  euler: "Euler's dual-track system — permissionless markets alongside professionally curated vaults — creates an unusually broad range of yield opportunities within a single protocol. The protocol's cluster vault architecture adds another dimension: these combine multiple lending positions into a single token, offering diversified yield exposure. Euler is active on Ethereum, Base, and Arbitrum, with each network hosting different subsets of curators and market types. Rate differences between networks can be substantial.",
  aave: "As the largest lending protocol by total value locked across most networks it operates on, Aave functions as the baseline yield benchmark in DeFi. Its V3 pools are deployed on Ethereum, Base, Arbitrum, Avalanche, BNB Chain, and Sonic. The rates on Aave reflect broad market lending demand: when borrowing activity rises across DeFi, Aave rates tend to move first because of its deep liquidity. The protocol has operated since 2020 through multiple market cycles, building one of the most extensive audit and governance track records in the space.",
  'ipor-fusion': "What separates IPOR Fusion from standard lending protocols is its support for leveraged strategies — vaults that borrow against their own deposits to re-enter lending positions, amplifying yield through recursive leverage. A standard lending deposit might earn 5% APY, while a leveraged looping version of the same underlying market could show 12-15% by running multiple borrow-lend cycles. IPOR Fusion also hosts non-leveraged lending optimizer strategies managed by curators like Reservoir. The protocol operates on Ethereum Mainnet, Base, and Arbitrum.",
  harvest: "Harvest adds an autocompounding layer on top of other protocols — it doesn't create its own lending markets but instead deposits into strategies on Morpho, Moonwell, Arcadia, Aave, and others, then automatically harvests earned rewards and reinvests them. Harvest operates on Ethereum Mainnet and Base, deploying vaults that mirror underlying strategies from multiple protocols.",
  yearn: "Yearn occupies a unique position in DeFi as the project that essentially invented automated yield optimization when Andre Cronje launched it in 2020. Unlike protocols where you choose a specific lending market, Yearn vaults accept your deposit and then allocate it across multiple yield sources based on the strategy team's judgment. Yearn's OG Compounder strategies on Morpho represent a newer iteration where Yearn's allocation expertise is applied specifically to Morpho's isolated markets.",
  lagoon: "Lagoon is vault infrastructure, not a yield source — it provides the framework that curators use to build and deploy managed strategies. Two Lagoon vaults can have entirely different risk profiles, asset allocations, and yield targets depending on which curator manages them. Active curators include 9Summits, Almanak, Tulipa Capital, Detrade, Syntropia, and Excellion. Lagoon vaults are deployed across Ethereum Mainnet, Base, and Avalanche.",
  fluid: "Fluid's core innovation is capital efficiency — deposited assets can serve as liquidity across multiple DeFi functions simultaneously rather than being locked into a single lending pool. The protocol operates on Ethereum Mainnet, Base, and Arbitrum, offering lending positions for USDC, ETH, and other major assets. Fluid rates tend to respond quickly to shifts in borrowing demand.",
  beefy: "Beefy autocompounds yield from other protocols across more networks than almost any other tracked project. Each Beefy vault targets a specific position on a specific protocol and network, handling the gas-intensive process of claiming rewards and reinvesting them to compound returns. On Earnbase, Beefy vaults appear across Ethereum, Base, Arbitrum, and Sonic.",
  gearbox: "Gearbox enables leveraged positions across DeFi by letting users borrow additional capital against their deposits and deploy the combined amount into yield strategies. This leverage amplifies returns but equally amplifies losses and introduces liquidation risk. The protocol operates on Ethereum Mainnet with strategies spanning USDC, USDT, ETH, and WBTC.",
  wildcat: "Wildcat is structurally different from every other yield source on Earnbase — instead of earning variable interest from pooled lending markets, depositors lend directly to named institutional borrowers at contractually fixed rates. Current borrowers include Wintermute and Hyperithm. Wildcat yields carry counterparty risk rather than smart contract market risk. Wildcat operates exclusively on Ethereum Mainnet.",
  spark: "Spark inherits its risk framework and governance process from the MakerDAO (now Sky) ecosystem, one of the oldest continuously operating protocol families in DeFi — Maker has been live since 2017. Spark offers lending for USDC, ETH, and WBTC on Ethereum Mainnet with conservative parameters set by Maker governance.",
  compound: "Compound pioneered the automated money market model that most DeFi lending protocols now follow. Compound V3 focuses on isolated markets rather than shared lending pools. The protocol operates on Ethereum Mainnet, Base, and Arbitrum with markets for USDC, ETH, and other assets.",
  moonwell: "Moonwell has established itself as a core lending primitive on Base, functioning as one of the primary money markets for the network's DeFi ecosystem. Its standard lending pools for USDC, ETH, cbBTC, and EURC provide straightforward variable-rate yield based on borrowing demand within the Base network.",
  silo: "Silo's architecture enforces complete isolation between lending markets — each market operates independently with its own liquidity pool, meaning a default or exploit in one Silo market cannot affect any other market on the protocol. Silo is deployed on Sonic with USDC lending markets.",
};

const getProjectDescription = (slug: string, projectName: string): string =>
  PROJECT_DESCRIPTIONS[slug] ||
  `${projectName} is a DeFi protocol tracked on Earnbase. Compare yield strategies, APY rates, and TVL data across multiple assets and networks.`;

const formatDescriptionParagraphs = (raw: string): string[] => {
  const cleaned = raw.replace(/ -- /g, '. ').replace(/\.\./g, '.').replace(/\. ,/g, ',');
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    paragraphs.push(sentences.slice(i, i + 3).join('').trim());
  }
  return paragraphs;
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
              const curatorDisplay = product.curator && product.curator !== '-' ? product.curator : null;
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
                            {product.network}{curatorDisplay ? ` · ${curatorDisplay}` : null}
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
  slug: string;
  products: DeFiProduct[];
}

export const ProjectPage: React.FC<Props> = ({ slug, products }) => {
  const { resolveAssetIcon } = useRegistry();

  const projectProducts = useMemo(
    () => products.filter(p => projectToSlug(p.platform_name) === slug),
    [products, slug],
  );

  const projectName = projectProducts[0]?.platform_name || '';

  const { tickers, networks, tickerList, networkList } = useMemo(() => {
    const tSet = new Set<string>();
    const nSet = new Set<string>();
    projectProducts.forEach(p => {
      tSet.add(p.ticker.toUpperCase());
      nSet.add(p.network);
    });
    const tickers = [...tSet].sort();
    const networks = [...nSet].sort();
    return { tickers, networks, tickerList: tickers.join(', '), networkList: networks.join(', ') };
  }, [projectProducts]);

  const tickerGroups = useMemo(() => {
    const map: Record<string, DeFiProduct[]> = {};
    projectProducts.forEach(p => {
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
  }, [projectProducts]);

  const topProduct = useMemo(
    () => [...projectProducts].sort((a, b) => b.spotAPY - a.spotAPY)[0] || null,
    [projectProducts],
  );

  const faqItems = useMemo(() => {
    if (!projectName || projectProducts.length === 0) return [];
    const topAPY = topProduct ? formatAPY(topProduct.spotAPY) : '0%';
    return [
      {
        question: `What is the highest APY on ${projectName}?`,
        answer: `The highest yield currently tracked on ${projectName} is ${topAPY} APY on ${topProduct?.product_name || ''} (${topProduct?.ticker?.toUpperCase() || ''} on ${topProduct?.network || ''}). Rates are variable and update daily.`,
      },
      {
        question: `How many strategies does Earnbase track on ${projectName}?`,
        answer: `Earnbase tracks ${projectProducts.length} yield strategies on ${projectName} across ${tickers.length} assets and ${networks.length} networks.`,
      },
      {
        question: `What assets can I earn yield on with ${projectName}?`,
        answer: `${projectName} supports yield strategies for ${tickerList}. Each asset has multiple strategies with different risk profiles and APY rates.`,
      },
      {
        question: `Does ${projectName} yield include external rewards?`,
        answer: `No. APY shown on Earnbase reflects on-chain vault performance only. External incentives such as token rewards, points programs, and liquidity mining are excluded.`,
      },
    ];
  }, [projectName, projectProducts, topProduct, tickers, networks, tickerList]);

  if (projectProducts.length === 0) return null;

  const description = getProjectDescription(slug, projectName);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-[17px] font-medium text-[#141414] dark:text-foreground leading-tight">
          {projectName} Yields: Compare APY Across {tickers.length} Asset{tickers.length !== 1 ? 's' : ''}
        </h1>
        <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed w-full">
          Earnbase tracks {projectProducts.length} yield strategies on {projectName} across {networks.length} network{networks.length !== 1 ? 's' : ''}. Compare APY rates for {tickerList}, updated daily.
        </p>
      </header>

      {/* Asset jump links */}
      <section>
        <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.1em] mb-3">
          Tracked Assets on {projectName} | Jump to
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
        <h2 className="text-[15px] font-medium text-foreground mb-3">About {projectName}</h2>
        <div className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed space-y-3">
          {formatDescriptionParagraphs(description).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p>Earnbase tracks {projectProducts.length} strategies on {projectName} across {networkList}.</p>
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
