import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, Search,
} from 'lucide-react';
import { useRegistry } from '@/app/contexts/RegistryContext';
import { getProductSlug } from '@/app/utils/slugify';
import { formatTVL, formatAPY } from '@/app/utils/formatters';
import { SEO, projectPageSEO, ogImageUrl } from '@/app/components/SEO';
import type { DeFiProduct } from '@/app/utils/types';
import { ListPageSkeleton } from '@/app/components/ui/Skeletons';

// ── Slug derivation (spec-defined) ──────────────────────────
export const projectToSlug = (name: string): string =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

/** Minimum strategies for a project to get its own page */
const MIN_STRATEGIES = 2;

/** Check if a project qualifies for a /project/ page */
export const projectHasPage = (platformName: string, products: DeFiProduct[]): boolean => {
  const slug = projectToSlug(platformName);
  const count = products.filter(p => projectToSlug(p.platform_name) === slug).length;
  return count >= MIN_STRATEGIES;
};

/** Get the project page URL if the project qualifies, otherwise null */
export const getProjectUrl = (platformName: string, products: DeFiProduct[]): string | null => {
  if (!projectHasPage(platformName, products)) return null;
  return `/project/${projectToSlug(platformName)}`;
};

// ── Project descriptions ─────────────────────────────────────
const PROJECT_DESCRIPTIONS: Record<string, string> = {

  "morpho": "With over a hundred curated strategies available, Morpho presents one of the widest yield selection problems in DeFi -- two vaults accepting the same asset on the same network can offer dramatically different rates depending on who manages them. This happens because Morpho's isolated market architecture lets any curator create their own lending strategy with custom risk parameters, collateral choices, and allocation logic. Gauntlet tends toward conservative, risk-scored allocations. Steakhouse focuses on blue-chip lending with deep liquidity. Re7 often pursues more aggressive opportunities. MEV Capital optimizes around maximal extractable value dynamics. The result is a spectrum where a 'Prime' USDC vault from Gauntlet might yield 4% while a 'Frontier' vault from the same curator targets 8% with different collateral exposure. Morpho operates across Ethereum Mainnet and Base, and curator strategies on Base often show different rate dynamics than Mainnet due to distinct borrowing demand patterns on each network. For anyone evaluating where to deploy stablecoins or ETH, sorting through Morpho's curator landscape is where most of the yield optimization happens -- the protocol infrastructure is shared, but the risk-return tradeoffs are entirely curator-dependent.",

  "euler": "Euler's dual-track system -- permissionless markets alongside professionally curated vaults -- creates an unusually broad range of yield opportunities within a single protocol. Anyone can spin up a lending market on Euler for any token pair, while curators like Gauntlet, Re7, and Apostro build managed strategies with institutional-grade risk controls on top of the same infrastructure. This means Euler hosts both experimental high-yield positions and conservative multi-market allocations, sometimes for the same asset on the same network. The protocol's cluster vault architecture adds another dimension: these combine multiple lending positions into a single token, offering diversified yield exposure that differs from standard single-market deposits. Euler is active on Ethereum, Base, and Arbitrum, with each network hosting different subsets of curators and market types. Rate differences between networks can be substantial -- a USDC cluster vault on Arbitrum may reflect completely different borrowing dynamics than one on Mainnet. The variety of curator philosophies and vault architectures makes comparing Euler strategies particularly important, since the headline APY alone doesn't reveal whether you're entering a single concentrated market or a diversified cluster position.",

  "aave": "As the largest lending protocol by total value locked across most networks it operates on, Aave functions as the baseline yield benchmark in DeFi. Its V3 pools are deployed on Ethereum, Base, Arbitrum, Avalanche, BNB Chain, and Sonic -- more networks than nearly any other tracked protocol. The rates on Aave reflect broad market lending demand: when borrowing activity rises across DeFi, Aave rates tend to move first because of its deep liquidity. This makes Aave useful not just as a yield source but as a reference point for evaluating whether higher rates elsewhere adequately compensate for additional risk. The protocol has operated since 2020 through multiple market cycles, hacks affecting other protocols, and shifting regulatory attention, building one of the most extensive audit and governance track records in the space. Yield on Aave varies meaningfully by network -- USDC lending on Base may offer double the rate available on Mainnet during periods of high Base-specific borrowing demand. Comparing Aave rates across its six supported networks reveals where borrowing demand is strongest, which can inform both direct deposits and broader DeFi strategy decisions.",

  "ipor-fusion": "What separates IPOR Fusion from standard lending protocols is its support for leveraged strategies -- vaults that borrow against their own deposits to re-enter lending positions, amplifying yield through recursive leverage. A standard lending deposit might earn 5% APY, while a leveraged looping version of the same underlying market could show 12-15% by running multiple borrow-lend cycles. This leverage is the reason IPOR Fusion strategies frequently appear near the top of APY rankings, but it comes with liquidation risk that doesn't exist in standard lending. If borrowing costs spike or collateral values drop, leveraged positions can be partially or fully liquidated. IPOR Fusion also hosts non-leveraged lending optimizer strategies managed by curators like Reservoir, which allocate across markets without leverage. The protocol operates on Ethereum Mainnet, Base, and Arbitrum. When evaluating IPOR Fusion yields, the critical distinction is whether a strategy uses leverage -- the strategy name usually indicates this with terms like 'Leveraged Looping' or 'Looper.' Comparing a leveraged IPOR Fusion vault against an unleveraged Morpho vault purely on APY misses the fundamental risk difference between the two approaches.",

  "harvest": "Harvest adds an autocompounding layer on top of other protocols -- it doesn't create its own lending markets but instead deposits into strategies on Morpho, Moonwell, Arcadia, Aave, and others, then automatically harvests earned rewards and reinvests them. The compounding effect can add meaningful value over time: a position earning 5% APY with weekly manual compounding will underperform the same position autocompounded daily, with the gap widening over longer time horizons. Harvest operates on Ethereum Mainnet and Base, deploying vaults that mirror underlying strategies from multiple protocols. This creates an interesting comparison opportunity -- you can often find both a direct deposit version and a Harvest autocompounder version of the same underlying strategy, letting you evaluate whether the compounding benefit justifies the additional smart contract layer. The trade-off is straightforward: Harvest adds convenience and compounding efficiency, but also adds a contract between you and the underlying yield source. Harvest vaults track their underlying protocol's performance closely, so when comparing yields, the relevant question is usually how much incremental value the autocompounding provides over the base rate.",

  "yearn": "Yearn occupies a unique position in DeFi as the project that essentially invented automated yield optimization when Andre Cronje launched it in 2020. Unlike protocols where you choose a specific lending market, Yearn vaults accept your deposit and then allocate it across multiple yield sources based on the strategy team's judgment. A single Yearn vault might simultaneously lend on Aave, provide liquidity on Morpho, and farm rewards across other protocols -- all managed programmatically with human oversight on the strategic level. This multi-source approach tends to produce more stable yields than single-protocol deposits because gains from one source can offset temporary drops in another. Yearn operates primarily on Ethereum Mainnet, where it has built deep integrations with lending protocols over several years. The protocol's OG Compounder strategies on Morpho represent a newer iteration where Yearn's allocation expertise is applied specifically to Morpho's isolated markets. Yearn's long track record provides more historical data for evaluating yield consistency than most newer protocols -- some strategies have been running for years with observable performance patterns.",

  "lagoon": "Lagoon is vault infrastructure, not a yield source -- it provides the framework that curators use to build and deploy managed strategies, similar to how Shopify provides storefronts for different merchants. Two Lagoon vaults can have entirely different risk profiles, asset allocations, and yield targets depending on which curator manages them. Active curators include 9Summits (targeting risk-adjusted yield across multiple protocols), Almanak (algorithmic allocation strategies), Tulipa Capital (institutional-focused vaults), Detrade (Base-native yield optimization), Syntropia, and Excellion. Lagoon vaults are deployed across Ethereum Mainnet, Base, and Avalanche. Because the curator determines everything about a Lagoon vault's strategy, comparing Lagoon yields requires looking past the Lagoon name to evaluate each curator independently. A Lagoon vault managed by 9Summits on Avalanche has essentially nothing in common with a Lagoon vault managed by Detrade on Base except the underlying smart contract framework. This makes Lagoon project pages particularly useful for seeing all curator strategies in one view.",

  "fluid": "Fluid's core innovation is capital efficiency -- deposited assets can serve as liquidity across multiple DeFi functions simultaneously rather than being locked into a single lending pool. In practice, this means Fluid can achieve higher utilization rates than traditional lending protocols, which translates to more competitive interest rates when borrowing demand is strong. The protocol operates on Ethereum Mainnet, Base, and Arbitrum, offering lending positions for USDC, ETH, and other major assets. Fluid rates tend to respond quickly to shifts in borrowing demand because the protocol's efficient capital structure means less idle liquidity dampening rates. Comparing Fluid across its three networks often reveals meaningful rate divergences -- Base and Arbitrum may offer different rates for the same asset depending on local DeFi activity levels. The protocol's lending positions are straightforward single-market deposits without the curator complexity of protocols like Morpho or Euler, making yield comparison more direct: the main variables are asset choice and network selection.",

  "beefy": "Beefy autocompounds yield from other protocols across more networks than almost any other tracked project -- its vaults sit on top of lending positions, LP tokens, and staking strategies from dozens of underlying protocols. Each Beefy vault targets a specific position on a specific protocol and network, handling the gas-intensive process of claiming rewards and reinvesting them to compound returns. On Earnbase, Beefy vaults appear across Ethereum, Base, Arbitrum, and Sonic, autocompounding positions from Morpho, Silo, Compound, and other protocols. The important nuance when comparing Beefy yields is that the vault's performance is fundamentally tied to its underlying strategy -- a Beefy vault autocompounding a Morpho position on Base reflects Morpho's lending rates on Base plus the compounding benefit minus Beefy's performance fee. Evaluating Beefy vaults means evaluating their underlying protocols. Where Beefy adds clear value is in comparing the autocompounded version of a strategy against the direct deposit version of the same strategy, showing exactly what the compounding layer contributes.",

  "gearbox": "Gearbox enables leveraged positions across DeFi by letting users borrow additional capital against their deposits and deploy the combined amount into yield strategies. This leverage amplifies returns -- a 2x leveraged position on a 5% APY strategy would target roughly 10% minus borrowing costs. But leverage equally amplifies losses and introduces liquidation risk: if the value of your position drops below the required margin, Gearbox automatically unwinds it. The protocol operates on Ethereum Mainnet with strategies spanning USDC, USDT, ETH, and WBTC. Gearbox APY figures inherently include the leverage component, which means they aren't directly comparable to unleveraged lending rates on protocols like Aave or Fluid. A 12% Gearbox yield and a 6% Aave yield don't represent the same risk exposure -- the Gearbox figure reflects leveraged returns with liquidation risk while the Aave figure reflects a straightforward lending deposit. Understanding the leverage multiple behind each Gearbox strategy is essential for meaningful yield comparison.",

  "wildcat": "Wildcat is structurally different from every other yield source on Earnbase -- instead of earning variable interest from pooled lending markets, depositors lend directly to named institutional borrowers at contractually fixed rates. Current borrowers include Wintermute, one of the largest crypto market makers, and Hyperithm, an institutional digital asset management firm. This means Wildcat yields carry counterparty risk rather than smart contract market risk: the rate is guaranteed by the borrower's agreement to repay, not by on-chain supply and demand dynamics. If a borrower defaults, depositors bear the loss -- there is no liquidation mechanism or collateral backing as in standard DeFi lending. The fixed-rate nature makes Wildcat yields particularly interesting as a benchmark: when Wildcat's fixed rates exceed variable DeFi lending rates, it suggests institutional borrowers are willing to pay a premium for undercollateralized access to capital. When DeFi variable rates exceed Wildcat's fixed rates, the market is pricing in strong short-term borrowing demand. Wildcat operates exclusively on Ethereum Mainnet.",

  "spark": "Spark inherits its risk framework and governance process from the MakerDAO (now Sky) ecosystem, one of the oldest continuously operating protocol families in DeFi -- Maker has been live since 2017 through every major market event the space has experienced. This lineage gives Spark unusually deep governance oversight: changes to lending parameters go through Maker's established proposal and voting process rather than faster but less scrutinized governance common at newer protocols. Spark offers lending for USDC, ETH, and WBTC on Ethereum Mainnet. The protocol's integration with Maker means it benefits from Maker's extensive liquidity infrastructure and risk modeling. Yield rates on Spark tend to reflect the conservative parameters set by Maker governance -- rates may not match more aggressive protocols, but they come with the stability of a risk framework that has been stress-tested through multiple bear markets and black swan events. For yield seekers who weigh protocol maturity and governance rigor alongside raw APY, Spark represents the established end of the risk spectrum.",

  "yo": "YO takes a focused approach to yield generation on Base, offering a compact set of vault strategies for USDC, ETH, EURC, and cbBTC rather than trying to cover every network and asset combination. Its core vaults allocate deposits across Base lending markets to optimize returns within the Base ecosystem specifically. This network focus means YO's rates reflect Base-specific lending dynamics -- borrowing demand, liquidity depth, and protocol activity on Base -- rather than cross-network arbitrage. The limited strategy count compared to protocols like Morpho or Euler makes evaluation more straightforward: fewer vaults means fewer choices, but each choice is tailored to Base conditions. YO vaults provide an alternative to direct lending on Moonwell or Aave on Base, potentially offering different rate optimization approaches for the same underlying liquidity pools.",

  "compound": "Compound pioneered the automated money market model that most DeFi lending protocols now follow -- when it launched, the concept of earning variable interest by depositing tokens into a smart contract was genuinely novel. Compound V3, the current version, simplifies earlier designs by focusing on isolated markets rather than shared lending pools. The protocol operates on Ethereum Mainnet, Base, and Arbitrum with markets for USDC, ETH, and other assets. Compound's multi-year operating history across major market events provides an extensive track record for evaluating yield consistency. Like Aave, Compound functions as a baseline yield benchmark -- its rates reflect broad lending market conditions without the curator complexity or leverage that characterizes more specialized protocols. Comparing Compound rates against Morpho curated vaults or IPOR Fusion leveraged strategies helps calibrate how much additional return the added complexity and risk of those approaches actually delivers.",

  "yearn-v2": "Yearn V2 represents the second generation of Yearn's vault architecture, designed to run multiple yield strategies simultaneously within a single vault. Where a standard lending deposit earns from one source, a Yearn V2 vault might split capital across up to twenty different strategies, each pursuing yield from different lending markets, liquidity pools, or farming opportunities. This diversification can smooth yield volatility -- when one strategy underperforms, others may compensate. V2 vaults operate on Ethereum Mainnet and have been running alongside the newer V3 architecture, with some strategies accumulating years of performance history. The multi-strategy approach means Yearn V2 yields don't directly correspond to any single underlying protocol's rates, making them difficult to benchmark against single-source yields. Comparing Yearn V2 against single-protocol deposits reveals the trade-off between diversified managed yield and the transparency of knowing exactly where your capital sits.",

  "moonwell": "Moonwell has established itself as a core lending primitive on Base, functioning as one of the primary money markets for the network's DeFi ecosystem. Its standard lending pools for USDC, ETH, cbBTC, and EURC provide straightforward variable-rate yield based on borrowing demand within the Base network. Because Moonwell is widely used as underlying infrastructure, its rates serve as a Base-specific yield benchmark -- similar to how Aave benchmarks rates on Ethereum Mainnet. Several other projects build on top of Moonwell: Harvest autocompounds Moonwell positions, Beefy wraps Moonwell deposits for compounding, and Morpho curators sometimes include Moonwell markets in their allocation strategies. This means Moonwell yields appear both as direct deposits and as the underlying rate for derivative strategies, making it useful to compare the base Moonwell rate against autocompounded or curated versions to see what the additional layers contribute.",

  "extrafi": "ExtraFi combines two distinct yield approaches on a single Base-native platform: standard lending markets and leveraged yield farming positions. The standard lending side offers straightforward deposits for USDC, ETH, EURC, and cbBTC, while the leveraged side enables amplified positions with correspondingly higher risk. This dual structure means comparing ExtraFi yields requires distinguishing between the two modes -- a 5% lending rate and a 15% leveraged farming rate on the same platform represent fundamentally different risk exposures. ExtraFi's lending rates reflect Base-specific borrowing demand, making them comparable to other Base lending protocols like Moonwell and Aave. The leveraged positions, however, carry liquidation risk and should be compared against other leveraged strategies like those on IPOR Fusion or Gearbox rather than against standard lending rates.",

  "tokemak": "Tokemak's Autopool system takes a different approach to yield than static lending deposits -- instead of committing capital to a single market, Autopools dynamically shift liquidity across multiple DeFi venues to capture the best available rates. This active rebalancing means Tokemak yields can reflect opportunities across multiple protocols and market conditions simultaneously, rather than being tied to one lending pool's borrowing demand. Autopools operate on Ethereum Mainnet and Base, primarily targeting ETH and EURC strategies. The dynamic allocation model makes Tokemak yields somewhat less predictable than fixed-market deposits: the rate you see today depends on where the Autopool algorithm is currently deploying capital, which may shift tomorrow. Comparing Tokemak Autopool yields against static lending rates shows whether the active management adds value over simply choosing a single high-yielding market.",

  "silo": "Silo's architecture enforces complete isolation between lending markets -- each market operates independently with its own liquidity pool, meaning a default or exploit in one Silo market cannot affect any other market on the protocol. This is a meaningful structural difference from shared-pool protocols where all markets draw from common liquidity. Silo is deployed on Sonic with USDC lending markets, making it one of the few yield sources tracked on the Sonic network. The isolated market design can result in different liquidity dynamics than shared pools -- rates may be more volatile with smaller pools but the risk containment is stronger. For users evaluating Sonic network yield options, Silo provides a lending alternative with a distinct risk architecture compared to other available protocols.",

  "arcadia": "Arcadia's lending pools serve a dual purpose -- deposited assets earn standard lending yield while simultaneously becoming available as collateral for margin trading positions on the platform. This dual demand source means Arcadia's lending rates can differ from pure lending protocols because borrowing demand comes from both standard borrowers and margin traders. The protocol operates on Base with pools for USDC, ETH, and cbBTC. When margin trading activity is high, Arcadia's utilization rates rise and lending yields increase accordingly. Comparing Arcadia rates against pure lending protocols like Moonwell or Fluid on Base can reveal whether the margin trading demand premium translates to meaningfully higher yields for depositors, and whether that premium is consistent or sporadic.",

};

const getProjectDescription = (slug: string, projectName: string): string =>
  PROJECT_DESCRIPTIONS[slug] ||
  `${projectName} is a DeFi protocol tracked on Earnbase. Compare yield strategies, APY rates, and TVL data across multiple assets and networks.`;

/** Split a raw description into ~3-sentence paragraphs, stripping double-hyphens. */
const formatDescriptionParagraphs = (raw: string): string[] => {
  const cleaned = raw.replace(/ -- /g, '. ').replace(/\.\./g, '.').replace(/\. ,/g, ',');
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    paragraphs.push(sentences.slice(i, i + 3).join('').trim());
  }
  return paragraphs;
};

/** Convert a project slug back to a display-friendly name for loading-state SEO. */
const slugToProjectName = (slug: string | undefined): string => {
  if (!slug) return 'Protocol';
  // Capitalise each word; handle common casing
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const slugToProjectTitle = (slug: string | undefined): string => {
  const name = slugToProjectName(slug);
  const full = `${name} Yield Strategies | Earnbase`;
  return full.length <= 60 ? full : `${name} | Earnbase`;
};

// ── Sort Icon (identical to AssetPageV2) ─────────────────────
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

// ── Per-ticker table (mirrors AssetPageV2 table exactly) ─────
interface TickerTableProps {
  ticker: string;
  products: DeFiProduct[];
}

const TickerTable: React.FC<TickerTableProps> = ({ ticker, products }) => {
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
              const curatorDisplay = product.curator && product.curator !== '-' ? product.curator : null;
              const networkLabel = product.network || '';
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
                          <span className="inline-flex items-center gap-1"><span className="w-3.5 h-3.5 rounded-full border border-border/60 flex items-center justify-center shrink-0 md:hidden"><img src={resolveNetworkIcon(product.network)} alt={product.network} className="w-2.5 h-2.5 object-contain" /></span><span className="contents">{networkLabel}{curatorDisplay ? <span className="contents"> · {curatorDisplay}</span> : null}</span></span>
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

// ── Main Component ───────────────────────────────────────────
interface ProjectPageProps {
  products: DeFiProduct[];
  loading: boolean;
  error?: string | null;
}

export const ProjectPage: React.FC<ProjectPageProps> = ({ products, loading, error }) => {
  const { slug } = useParams<{ slug: string }>();
  const { resolveAssetIcon } = useRegistry();

  // ── Filter products by project slug ──────────────────────
  const projectProducts = useMemo(
    () => products.filter(p => projectToSlug(p.platform_name) === slug),
    [products, slug]
  );

  // ── Derive project name from data ────────────────────────
  const projectName = useMemo(() => {
    if (projectProducts.length === 0) return '';
    return projectProducts[0].platform_name;
  }, [projectProducts]);

  // ── Computed stats ───────────────────────────────────────
  const { tickers, networks, tickerList, networkList } = useMemo(() => {
    const tSet = new Set<string>();
    const nSet = new Set<string>();
    projectProducts.forEach(p => {
      tSet.add(p.ticker.toUpperCase());
      nSet.add(p.network);
    });
    const tickers = [...tSet].sort();
    const networks = [...nSet].sort();
    return {
      tickers,
      networks,
      tickerList: tickers.join(', '),
      networkList: networks.join(', '),
    };
  }, [projectProducts]);

  const strategyCount = projectProducts.length;

  // ── Per-ticker groups (sorted by count desc) ─────────────
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

  // ── Top product (by spotAPY) ─────────────────────────────
  const topProduct = useMemo(
    () => [...projectProducts].sort((a, b) => b.spotAPY - a.spotAPY)[0] || null,
    [projectProducts]
  );

  // ── FAQ items ────────────────────────────────────────────
  const faqItems = useMemo(() => {
    if (!projectName || strategyCount === 0) return [];
    const topAPY = topProduct ? formatAPY(topProduct.spotAPY) : '0%';
    const topName = topProduct?.product_name || '';
    const topTicker = topProduct?.ticker?.toUpperCase() || '';
    const topNetwork = topProduct?.network || '';

    return [
      {
        question: `What is the highest APY on ${projectName}?`,
        answer: `The highest yield currently tracked on ${projectName} is ${topAPY} APY on ${topName} (${topTicker} on ${topNetwork}). Rates are variable and update daily.`,
      },
      {
        question: `How many strategies does Earnbase track on ${projectName}?`,
        answer: `Earnbase tracks ${strategyCount} yield strategies on ${projectName} across ${tickers.length} assets and ${networks.length} networks.`,
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
  }, [projectName, strategyCount, topProduct, tickers, networks, tickerList]);

  // ── SEO ──────────────────────────────────────────────────
  const seo = useMemo(() => {
    if (!slug || !projectName) return null;
    return projectPageSEO(
      projectName,
      slug,
      strategyCount,
      tickers,
      networks.length,
      projectProducts.slice().sort((a, b) => b.spotAPY - a.spotAPY).slice(0, 10),
      faqItems
    );
  }, [slug, projectName, strategyCount, tickers, networks, projectProducts, faqItems]);

  // ── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <>
        <SEO
          title={slugToProjectTitle(slug)}
          description={`Yield strategies for ${slugToProjectName(slug)} on Earnbase. Live APY, TVL, and performance data — updated daily.`}
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
          title={slugToProjectTitle(slug)}
          description={`Yield strategies for ${slugToProjectName(slug)} on Earnbase.`}
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

  // ── 404 state — unknown slug ─────────────────────────────
  if (projectProducts.length === 0) {
    return (
      <>
        <SEO
          title="Project Not Found | Earnbase"
          description="This project page does not exist on Earnbase."
          noindex
        />
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Search className="w-7 h-7 text-muted-foreground/40" />
          </div>
          <div>
            <h1 className="text-[17px] font-medium text-foreground">Project Not Found</h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              No strategies found for <code className="px-1.5 py-0.5 bg-muted rounded text-xs">/{slug}</code>
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

  const description = getProjectDescription(slug!, projectName);

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
            {projectName} Yields: Compare APY Across {tickers.length} Asset{tickers.length !== 1 ? 's' : ''}
          </h1>
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed w-full">
            Earnbase tracks {strategyCount} yield strategies on {projectName} across {networks.length} network{networks.length !== 1 ? 's' : ''}. Compare APY rates for {tickerList}, updated daily.
          </p>
        </header>

        {/* ── Jump-to boxes ───────────────────────────────── */}
        <section>
          <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.1em] mb-3">
            Tracked Assets on {projectName} | Jump to
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
            <TickerTable ticker={g.ticker} products={g.products} />
          </section>
        ))}

        {/* ── About Section ───────────────────────────────── */}
        <section>
          <h2 className="text-[15px] font-medium text-foreground mb-3">About {projectName}</h2>
          <div className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed space-y-3">
            {formatDescriptionParagraphs(description).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <p>Earnbase tracks {strategyCount} strategies on {projectName} across {networkList}.</p>
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