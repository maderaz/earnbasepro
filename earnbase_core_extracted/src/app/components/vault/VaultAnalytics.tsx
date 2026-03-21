/** VaultAnalytics — All analytics sections for the Vault Product page. */
import React from 'react';
import { Info } from 'lucide-react';
import { Link } from 'react-router';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { formatTVL, trendColor } from '@/app/utils/formatters';
import type { DeFiProduct } from '@/app/utils/types';
import type {
  MarketStats, SustainabilityMetrics, ContextAnalysis, HistoryStats, TvlStats,
  YieldTrajectory, ExpandedApyStats, ExpandedTvlStats, RankedProduct,
} from './useVaultData';
import { KVRow } from '../ui/KVRow';
import { PeriodSuffix, TooltipLabel } from '../ui/TooltipLabel';
import {
  MARKET_BENCH, SUSTAINABILITY, YIELD_TRAJECTORY, WEEKLY_BREAKDOWN,
  APY_STATS, TVL_STATS, YIELD_TVL,
} from '@/app/utils/tooltipDefs';

// ── Global helpers ────────────────────────────────────────────

function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || singular + 's');
}

function getStrategyType(productName: string, isPrivateCredit = false): string | null {
  // Use control room tagging as primary detection
  if (isPrivateCredit) return 'Private Credit';
  const lower = productName.toLowerCase();
  if (lower.includes('leveraged looping') || lower.includes('levmoonwell') || lower.includes('leveraged'))
    return 'Leveraged Looping';
  if (lower.includes('private credit'))
    return 'Private Credit';
  if (lower.includes('lend'))
    return 'Lending';
  if (lower.includes('autopilot') || lower.includes('autocompounder'))
    return 'Autocompounder';
  if (lower.includes('core') || lower.includes('prime') || lower.includes('flagship'))
    return 'Curated Vault';
  if (lower.includes('frontier') || lower.includes('degen'))
    return 'Aggressive Vault';
  if (lower.includes('horizon'))
    return 'Conservative Vault';
  return null;
}

const platformDescriptions: Record<string, string> = {
  "Morpho": "Morpho is a decentralized lending protocol that enables the creation of isolated lending markets and curated vaults. Curators optimize lending allocations to target higher yields than standard money markets.",
  "Euler": "Euler is a non-custodial lending protocol offering both permissionless lending markets and curated vault strategies. It supports multiple asset types across Ethereum and Layer 2 networks.",
  "Aave": "Aave is one of the largest DeFi lending protocols by total value locked. It offers variable and stable rate lending pools across multiple networks with extensive governance and audit history.",
  "IPOR Fusion": "IPOR Fusion is a yield optimization protocol that enables complex strategies including leveraged looping and interest rate derivatives. It provides automated vault management for DeFi yield strategies.",
  "Yearn": "Yearn is a DeFi yield aggregator that automates capital allocation across lending protocols and liquidity pools. Its vaults automatically optimize for the highest available yield.",
  "Yearn V3": "Yearn V3 is the latest version of the Yearn yield aggregator, offering modular vault architecture and more flexible strategy management compared to earlier versions.",
  "Fluid": "Fluid is a lending and borrowing protocol designed for capital efficiency. It supports lending with integrated liquidity that can be used simultaneously across multiple DeFi applications.",
  "Lagoon": "Lagoon is a DeFi vault infrastructure protocol that enables curated yield strategies. Curators use Lagoon to build managed vaults that allocate capital across DeFi lending markets.",
  "Wildcat": "Wildcat is a fixed-rate lending protocol focused on private credit. It enables institutional borrowers to access DeFi capital markets through undercollateralized lending arrangements.",
  "Maple": "Maple is an institutional lending protocol that connects institutional borrowers with DeFi lenders. It offers fixed-rate lending pools primarily targeting institutional-grade credit.",
  "Harvest": "Harvest Finance is a DeFi yield aggregator that automatically compounds yields across lending protocols. Its autocompounder vaults handle reward claiming and reinvestment.",
  "Moonwell": "Moonwell is a lending and borrowing protocol primarily deployed on Base and Moonbeam. It offers standard money market functionality with competitive lending rates.",
  "40 Acres": "40 Acres is a DeFi vault protocol on Base offering curated yield strategies with managed exposure to Base ecosystem lending opportunities.",
  "Spark": "Spark is a DeFi lending protocol developed by MakerDAO (now Sky). It offers lending and borrowing services integrated with the Maker ecosystem.",
  "Venus": "Venus is a major lending protocol on BNB Chain offering algorithmic money markets. It is one of the most established DeFi protocols on the BNB ecosystem.",
  "Radiant V2": "Radiant is a cross-chain lending protocol offering money market services. V2 introduces omnichain functionality allowing lending and borrowing across multiple networks.",
  "ExtraFi": "ExtraFi is a leveraged yield farming and lending protocol offering both standard lending pools and leveraged position management on Layer 2 networks.",
  "Arcadia": "Arcadia is a margin and lending protocol that enables users to earn yield on deposited assets while using them as collateral for leveraged DeFi positions.",
  "Silo": "Silo is an isolated lending protocol where each market is independent, reducing systemic risk. Borrowers and lenders interact in asset-pair-specific silos.",
  "Beefy": "Beefy Finance is a multi-chain yield optimizer that automates compounding across hundreds of DeFi strategies. It deploys to over 25 blockchains.",
  "Benqi": "Benqi is a liquidity protocol on Avalanche offering lending, borrowing, and liquid staking services. It is one of the core DeFi primitives on the Avalanche network.",
  "Kinza": "Kinza Finance is a lending and borrowing protocol on BNB Chain offering competitive rates through its algorithmic interest rate model.",
  "Across Protocol": "Across Protocol is a cross-chain bridge and lending protocol that generates yield by facilitating fast cross-chain transfers.",
  "Avantis": "Avantis is a perpetuals and yield protocol on Base. Its earn vaults generate yield by providing liquidity to the Avantis perpetuals trading engine.",
  "YO": "YO is a DeFi vault protocol offering core yield strategies. Its vaults allocate deposits across lending markets to generate optimized returns.",
  "Swaap": "Swaap is a protocol offering market-making and yield strategies with lending integrations on Euler.",
};

interface AnalyticsProps {
  product: DeFiProduct;
  products?: DeFiProduct[];
  marketStats: MarketStats | null;
  sustainabilityMetrics: SustainabilityMetrics | null;
  contextAnalysis: ContextAnalysis | null;
  historyStats: HistoryStats | null;
  tvlStats: TvlStats | null;
  yieldTrajectory: YieldTrajectory | null;
  comparativeRankings: RankedProduct[];
  networkRankings: RankedProduct[];
  expandedApyStats: ExpandedApyStats | null;
  expandedTvlStats: ExpandedTvlStats | null;
  networkTvlRank: { networkTvlRank: number; networkTvlTotal: number } | null;
  isPrivateCredit?: boolean;
}

export const VaultAnalytics: React.FC<AnalyticsProps> = ({
  product, products = [], marketStats, sustainabilityMetrics, contextAnalysis, historyStats, tvlStats,
  yieldTrajectory, comparativeRankings, networkRankings, expandedApyStats, expandedTvlStats,
  networkTvlRank, isPrivateCredit = false,
}) => (
  <div className="space-y-8">
    {/* ═══ Market Benchmarking ═══ */}
    {marketStats && (() => {
      const spotAPY = product.spotAPY;
      const avgAPY = marketStats.avgApy;
      const absDiff = (spotAPY - avgAPY).toFixed(2);
      const pctDiff = (((spotAPY - avgAPY) / (avgAPY || 1)) * 100).toFixed(1);
      const usesPp = Math.abs(parseFloat(pctDiff)) < 5;
      const comparisonText = usesPp
        ? <span className="contents">Its {spotAPY.toFixed(2)}% yield is <span className={`mx-1 font-medium ${marketStats.isAboveAverage ? 'text-[#08a671]' : 'text-amber-600 dark:text-amber-400'}`}>{absDiff}pp {parseFloat(absDiff) >= 0 ? 'above' : 'below'}</span> the market average of {avgAPY.toFixed(2)}%.</span>
        : <span className="contents">Its {spotAPY.toFixed(2)}% yield is <span className={`mx-1 font-medium ${marketStats.isAboveAverage ? 'text-[#08a671]' : 'text-amber-600 dark:text-amber-400'}`}>{Math.abs(parseFloat(pctDiff)).toFixed(1)}% {marketStats.isAboveAverage ? 'higher' : 'lower'}</span> than the market average of {avgAPY.toFixed(2)}%.</span>;

      const rankContext = (() => {
        if (!marketStats.rank || !marketStats.totalInAsset) return '';
        if (marketStats.rank <= 3) return ` This places it among the highest-yielding ${product.ticker} strategies tracked on Earnbase. Higher yields typically correlate with higher risk — review the sustainability score and strategy type below.`;
        if (marketStats.rank <= 20) return ` While not the highest available, this strategy outperforms the majority of tracked ${product.ticker} opportunities.`;
        if (marketStats.rank > marketStats.totalInAsset / 2) return ` Lower-yielding strategies often reflect more conservative risk profiles or established protocols with deep liquidity.`;
        return '';
      })();

      return (
        <div>
          <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Market Benchmarking</h2>
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
            {spotAPY > 0 ? (
              <span className="contents">
                Within the <span className="text-[#30313e] dark:text-foreground/80 font-medium">{product.ticker}</span> ecosystem, this product ranks <span className="text-[#30313e] dark:text-foreground/80 font-medium">#{marketStats.rank}</span> out of {marketStats.totalInAsset} {pluralize(marketStats.totalInAsset, 'strategy', 'strategies')}.{' '}
                {comparisonText}
                {rankContext}
              </span>
            ) : (
              <span className="contents">
                No yield data is available for the most recent period. This product is tracked within the <span className="text-[#30313e] dark:text-foreground/80 font-medium">{product.ticker}</span> ecosystem alongside {marketStats.totalInAsset} {pluralize(marketStats.totalInAsset, 'strategy', 'strategies')}.
              </span>
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
            <div>
              <KVRow label="Asset Average APY" value={`${marketStats.avgApy.toFixed(2)}%`} tooltip={MARKET_BENCH['Asset Average APY']} />
              <KVRow label="This Product APY" value={spotAPY > 0 ? `${spotAPY.toFixed(2)}%` : '—'} valueColor={spotAPY > 0 ? 'text-[#08a671]' : undefined} tooltip={MARKET_BENCH['This Product APY']} />
            </div>
            <div>
              <KVRow label="Market Rank" value={marketStats.rank > 0 ? `#${marketStats.rank} / ${marketStats.totalInAsset}` : '—'} tooltip={MARKET_BENCH['Market Rank']} />
              <KVRow label="vs. Average" value={spotAPY > 0 ? `${marketStats.isAboveAverage ? '+' : '-'}${Math.abs(marketStats.diffPercent).toFixed(1)}%` : '—'} valueColor={spotAPY > 0 ? (marketStats.isAboveAverage ? 'text-[#08a671]' : 'text-amber-600 dark:text-amber-400') : undefined} tooltip={MARKET_BENCH['vs. Average']} />
            </div>
          </div>
        </div>
      );
    })()}

    {/* ═══ Comparative Rankings (➍) ═══ */}
    {comparativeRankings.length > 1 && marketStats && (
      <ComparativeRankingsSection product={product} rankings={comparativeRankings} marketStats={marketStats} isPrivateCredit={isPrivateCredit} />
    )}

    {/* ═══ Ecosystem Context ═══ */}
    {contextAnalysis && (() => {
      const hasCurator = product.curator && product.curator !== '-' && product.curator.trim() !== '';
      const curatorProducts = hasCurator ? products.filter(p => p.curator === product.curator) : [];
      const curatorProductCount = curatorProducts.length;
      const curatorNetworkCount = [...new Set(curatorProducts.map(p => p.network))].length;
      const platformSameTickerCount = contextAnalysis.platCount - 1;

      const curatorContext = hasCurator
        ? `This strategy is curated by ${product.curator}, with ${curatorProductCount} ${product.curator} ${pluralize(curatorProductCount, 'strategy', 'strategies')} tracked on Earnbase${curatorNetworkCount > 1 ? ` across ${curatorNetworkCount} networks` : ''}.`
        : '';

      return (
        <div>
          <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Ecosystem Context</h2>
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7]">
            Positioned within the <span className="text-[#30313e] dark:text-foreground/80 font-medium">{product.network}</span> ecosystem, this product's yield is <span className="text-[#08a671] font-medium">{Math.abs(contextAnalysis.netDiff).toFixed(1)}% {contextAnalysis.netDiff >= 0 ? 'higher' : 'lower'}</span> than the network average for {product.ticker} strategies.
            {contextAnalysis.isBestOnNetwork && ` Currently the highest-yielding ${product.ticker} opportunity on ${product.network} among ${contextAnalysis.netCount} tracked ${pluralize(contextAnalysis.netCount, 'product')}.`}
            {curatorContext ? ` ${curatorContext}` : ''}
            {platformSameTickerCount > 0 ? (
              ` Within ${product.platform_name}, it competes against ${platformSameTickerCount} other ${product.ticker} ${pluralize(platformSameTickerCount, 'strategy', 'strategies')}${contextAnalysis.isMostLiquidOnPlatform ? ', holding the strongest liquidity position' : ''}.`
            ) : (
              ` As a primary offering on ${product.platform_name}, it serves as the flagship entry for ${product.ticker} returns.`
            )}
            {networkTvlRank && (
              ` By TVL, this product ranks #${networkTvlRank.networkTvlRank} of ${networkTvlRank.networkTvlTotal} ${product.ticker} ${pluralize(networkTvlRank.networkTvlTotal, 'strategy', 'strategies')} on ${product.network}.`
            )}
            {isPrivateCredit && ' As a fixed-rate private credit product, its yield stability differs fundamentally from variable-rate DeFi strategies on the same network.'}
          </p>
        </div>
      );
    })()}

    {/* ═══ About {platform} ═══ */}
    {(() => {
      const platformTotalCount = products.filter(p => p.platform_name === product.platform_name).length;
      const desc = platformDescriptions[product.platform_name] || `${product.platform_name} is a DeFi protocol offering yield strategies tracked by Earnbase.`;
      return (
        <div>
          <h3 className="text-[15px] font-medium text-[#141414] dark:text-foreground mb-2">About {product.platform_name}</h3>
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7]">
            {desc} Earnbase tracks {platformTotalCount} {pluralize(platformTotalCount, 'strategy', 'strategies')} on {product.platform_name}.
          </p>
        </div>
      );
    })()}

    {/* ═══ Network Positioning (➐) ═══ */}
    {networkRankings.length > 1 && contextAnalysis && (
      <NetworkPositioningSection product={product} rankings={networkRankings} netAvg={contextAnalysis.netAvg} />
    )}

    {/* ═══ Sustainability ═══ */}
    {sustainabilityMetrics && <SustainabilitySection metrics={sustainabilityMetrics} isPrivateCredit={isPrivateCredit} spotAPY={product.spotAPY} productName={product.product_name} />}

    {/* ═══ Yield Trajectory (➊) ═══ */}
    {yieldTrajectory && <YieldTrajectorySection product={product} trajectory={yieldTrajectory} isPrivateCredit={isPrivateCredit} />}

    {/* ═══ Weekly Breakdown ═══ */}
    {yieldTrajectory && yieldTrajectory.weeklyAverages.length >= 2 && (
      <WeeklyBreakdownSection product={product} trajectory={yieldTrajectory} isPrivateCredit={isPrivateCredit} />
    )}

    {/* ═══ APY Stats (expanded ➎) ═══ */}
    {historyStats && <ApyStatsSection product={product} stats={historyStats} expandedStats={expandedApyStats} sustainabilityScore={sustainabilityMetrics && !sustainabilityMetrics.insufficientData ? (sustainabilityMetrics.score ?? 100) : 100} isPrivateCredit={isPrivateCredit} />}

    {/* ═══ TVL Stats (expanded ➏) ═══ */}
    {tvlStats && <TvlStatsSection product={product} stats={tvlStats} expandedStats={expandedTvlStats} />}
  </div>
);

// ── Comparative Rankings (➍) ──────────────────────────────────

const ComparativeRankingsSection: React.FC<{
  product: DeFiProduct;
  rankings: RankedProduct[];
  marketStats: MarketStats;
  isPrivateCredit?: boolean;
}> = ({ product, rankings, marketStats, isPrivateCredit = false }) => {
  const displayName = product.product_name;
  const myEntry = rankings.find(r => r.product.id === product.id);
  const topTwo = rankings.slice(0, 2);
  const diffFromSecond = topTwo.length >= 2 && myEntry?.rank === 1
    ? (topTwo[0].product.spotAPY - topTwo[1].product.spotAPY).toFixed(2)
    : null;

  return (
    <div>
      <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">
        How {displayName} Compares
      </h2>

      {/* Mini ranking table */}
      <div className="mb-3">
        {/* Header */}
        <div className="flex items-center gap-2 py-2 text-[11px] font-medium text-[#a0a0b0] uppercase tracking-[0.06em] border-b border-[#eff0f4] dark:border-border/30">
          <span className="w-8 shrink-0">#</span>
          <span className="flex-1 min-w-0">Product</span>
          <span className="w-20 text-right shrink-0 hidden sm:block">Network</span>
          <span className="w-20 text-right shrink-0">APY</span>
          <span className="w-20 text-right shrink-0 hidden sm:block">TVL</span>
        </div>

        {rankings.map(r => {
          const isCurrent = r.product.id === product.id;
          return (
            <Link
              key={r.product.id}
              to={`/vault/${r.slug}`}
              className={`flex items-center gap-2 py-2.5 border-b border-[#eff0f4] dark:border-border/30 group transition-colors ${isCurrent ? 'bg-[#08a671]/[0.03]' : 'hover:bg-[#f8f8fa] dark:hover:bg-white/[0.02]'}`}
            >
              <span className={`w-8 shrink-0 text-[12px] font-medium tabular-nums ${isCurrent ? 'text-[#08a671]' : 'text-[#a0a0b0]'}`}>#{r.rank}</span>
              <span className={`flex-1 min-w-0 text-[13px] font-medium truncate ${isCurrent ? 'text-[#08a671]' : 'text-[#30313e] dark:text-foreground/80 group-hover:text-[#08a671]'} transition-colors`}>
                {r.product.product_name}
                <span className="text-[#a0a0b0] font-normal ml-1.5">{r.product.platform_name}</span>
              </span>
              <span className="w-20 text-right shrink-0 text-[12px] font-normal text-[#a0a0b0] hidden sm:block">{r.product.network}</span>
              <span className={`w-20 text-right shrink-0 text-[13px] font-medium tabular-nums ${isCurrent ? 'text-[#08a671]' : 'text-[#09090b] dark:text-foreground/80'}`}>{r.product.spotAPY.toFixed(2)}%</span>
              <span className="w-20 text-right shrink-0 text-[12px] font-normal text-[#a0a0b0] tabular-nums hidden sm:block">{formatTVL(r.product.tvl)}</span>
            </Link>
          );
        })}

        {/* Market average row */}
        <div className="flex items-center gap-2 py-2.5 text-[12px]">
          <span className="w-8 shrink-0" />
          <span className="flex-1 min-w-0 font-medium text-[#a0a0b0] uppercase tracking-[0.04em]">{product.ticker.toUpperCase()} Market Average</span>
          <span className="w-20 text-right shrink-0 hidden sm:block" />
          <span className="w-20 text-right shrink-0 font-medium text-[#a0a0b0] tabular-nums">{marketStats.avgApy.toFixed(2)}%</span>
          <span className="w-20 text-right shrink-0 hidden sm:block" />
        </div>
      </div>

      {/* Comparative narrative */}
      <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7]">
        {isPrivateCredit ? (
          <span className="contents">
            {displayName} offers a fixed <span className="text-[#3b82f6] font-medium">{product.spotAPY.toFixed(2)}%</span> yield, {myEntry?.rank === 1
              ? `currently the highest rate among all ${marketStats.totalInAsset} monitored ${product.ticker.toUpperCase()} strategies`
              : `ranking #${myEntry?.rank} among ${marketStats.totalInAsset} monitored ${product.ticker.toUpperCase()} strategies`
            }. As a private credit instrument, this rate is contractually guaranteed rather than market-driven.
            {rankings.length >= 2 && (() => {
              const highestTvl = [...rankings].sort((a, b) => b.product.tvl - a.product.tvl)[0];
              if (highestTvl.product.id !== product.id && highestTvl.product.tvl > product.tvl * 3) {
                return ` However, with a TVL of ${formatTVL(product.tvl)}, it holds significantly less capital than higher-TVL alternatives like ${highestTvl.product.product_name} (${formatTVL(highestTvl.product.tvl)}).`;
              }
              return '';
            })()}
          </span>
        ) : (
          <span className="contents">
            {displayName} currently{' '}
            {myEntry?.rank === 1 ? (
              <span className="contents">
                offers the highest 24-hour APY among all {marketStats.totalInAsset} monitored {product.ticker.toUpperCase()} strategies
                {diffFromSecond ? <span className="contents">, leading the #2 ranked strategy by <span className="text-[#08a671] font-medium">{diffFromSecond}pp</span></span> : ''}
              </span>
            ) : (
              <span className="contents">
                ranks <span className="font-medium">#{myEntry?.rank}</span> among {marketStats.totalInAsset} monitored {product.ticker.toUpperCase()} strategies
              </span>
            )}.
            {rankings.length >= 2 && (() => {
              const highestTvl = [...rankings].sort((a, b) => b.product.tvl - a.product.tvl)[0];
              if (highestTvl.product.id !== product.id && highestTvl.product.tvl > product.tvl * 3) {
                return ` However, with a TVL of ${formatTVL(product.tvl)}, it holds significantly less capital than higher-TVL alternatives like ${highestTvl.product.product_name} (${formatTVL(highestTvl.product.tvl)}).`;
              }
              return '';
            })()}
          </span>
        )}
      </p>
    </div>
  );
};

// ── Network Positioning (➐) ──────────────────────────────────

const NetworkPositioningSection: React.FC<{
  product: DeFiProduct;
  rankings: RankedProduct[];
  netAvg: number;
}> = ({ product, rankings, netAvg }) => {
  const myEntry = rankings.find(r => r.product.id === product.id);
  const totalPeers = rankings.length > 0 ? Math.max(...rankings.map(r => r.rank), rankings.length) : 0;

  return (
    <div>
      <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">
        {product.ticker.toUpperCase()} on {product.network}{myEntry ? `: #${myEntry.rank} of ${totalPeers}` : ''}
      </h2>

      <div className="mb-3">
        {rankings.map(r => {
          const isCurrent = r.product.id === product.id;
          return (
            <Link
              key={r.product.id}
              to={`/vault/${r.slug}`}
              className={`flex items-center justify-between py-2.5 border-b border-[#eff0f4] dark:border-border/30 group transition-colors ${isCurrent ? 'bg-[#08a671]/[0.03]' : 'hover:bg-[#f8f8fa] dark:hover:bg-white/[0.02]'}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`text-[12px] font-medium tabular-nums w-6 shrink-0 ${isCurrent ? 'text-[#08a671]' : 'text-[#a0a0b0]'}`}>#{r.rank}</span>
                <span className={`text-[13px] font-medium truncate ${isCurrent ? 'text-[#08a671]' : 'text-[#30313e] dark:text-foreground/80 group-hover:text-[#08a671]'} transition-colors`}>{r.product.product_name}</span>
                {isCurrent && <span className="text-[10px] font-medium text-[#08a671]/60 uppercase tracking-[0.06em] shrink-0 hidden sm:inline">You are here</span>}
              </div>
              <span className={`text-[13px] font-medium tabular-nums shrink-0 ${isCurrent ? 'text-[#08a671]' : 'text-[#09090b] dark:text-foreground/80'}`}>{r.product.spotAPY.toFixed(2)}%</span>
            </Link>
          );
        })}

        <div className="flex items-center justify-between py-2.5 text-[12px]">
          <span className="font-medium text-[#a0a0b0] uppercase tracking-[0.04em]">Network Average</span>
          <span className="font-medium text-[#a0a0b0] tabular-nums">{netAvg.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

// ── Sustainability ────────────────────────────────────────────

const SustainabilitySection: React.FC<{ metrics: SustainabilityMetrics; isPrivateCredit?: boolean; spotAPY?: number; productName?: string }> = ({ metrics, isPrivateCredit = false, spotAPY = 0, productName = '' }) => {
  const strategyRiskContext = (() => {
    const type = getStrategyType(productName, isPrivateCredit);
    if (!type) return '';
    const contexts: Record<string, string> = {
      'Leveraged Looping': 'Leveraged looping strategies amplify yield by borrowing against deposits. While this can produce higher APY, it introduces liquidation risk if market conditions shift rapidly.',
      'Private Credit': "Private credit yields are contractually fixed rather than market-driven. Sustainability depends on the borrower's ability to meet repayment obligations, not on DeFi market conditions.",
      'Lending': 'Lending yields fluctuate with borrowing demand. Periods of high demand produce higher APY, while low demand compresses rates.',
      'Autocompounder': 'Autocompounder strategies reinvest earned yields automatically, which can produce compounding effects over time but does not change the underlying yield source.',
      'Curated Vault': "Curated vaults are actively managed, with the curator adjusting allocations across lending markets. Yield stability depends on the curator's risk management and market conditions.",
      'Aggressive Vault': 'Aggressive vault strategies target higher yields by accepting more risk exposure. These may include concentrated positions or higher-leverage allocations.',
      'Conservative Vault': 'Conservative vault strategies prioritize capital preservation over maximum yield, typically allocating to established lending markets with deeper liquidity.',
    };
    return contexts[type] || '';
  })();

  return (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground">Yield Sustainability</h2>
      <RadixTooltip.Provider delayDuration={0}>
        <RadixTooltip.Root>
          <RadixTooltip.Trigger asChild>
            <button className="text-[#a0a0b0] hover:text-[#30313e] dark:hover:text-foreground/70 transition-colors cursor-help outline-none">
              <Info className="w-3.5 h-3.5" />
            </button>
          </RadixTooltip.Trigger>
          <RadixTooltip.Portal>
            <RadixTooltip.Content className="z-50 max-w-[240px] bg-white dark:bg-card p-3 rounded-[10px] border border-[#e4e4e7] dark:border-border text-[11px] animate-in fade-in zoom-in duration-200 shadow-sm" sideOffset={5}>
              <p className="text-[10px] text-[#a0a0b0] mb-2.5 leading-relaxed">Measures how closely the current yield tracks its 30-day average. Higher = more predictable.</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#08a671]" /><span className="text-[#a0a0b0]"><span className="font-medium text-[#30313e] dark:text-foreground/80">90–100</span> Very Stable</span></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#34d399]" /><span className="text-[#a0a0b0]"><span className="font-medium text-[#30313e] dark:text-foreground/80">75–89</span> Stable</span></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /><span className="text-[#a0a0b0]"><span className="font-medium text-[#30313e] dark:text-foreground/80">55–74</span> Moderate</span></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /><span className="text-[#a0a0b0]"><span className="font-medium text-[#30313e] dark:text-foreground/80">35–54</span> Low Stability</span></div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-400" /><span className="text-[#a0a0b0]"><span className="font-medium text-[#30313e] dark:text-foreground/80">10–34</span> Very Low Stability</span></div>
              </div>
              <RadixTooltip.Arrow className="fill-white dark:fill-card" />
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    </div>

    {isPrivateCredit ? (
      <div>
        <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
          This is a private credit product with a contractually fixed yield rate of {spotAPY.toFixed(2)}%. Unlike variable-rate DeFi strategies, the yield does not fluctuate based on market supply and demand. The sustainability score reflects this inherent rate stability.
          {strategyRiskContext && ` ${strategyRiskContext}`}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
          <div>
            <KVRow label="Sustainability Score" tooltip="Fixed-rate product. Score reflects contractual rate stability, not market-driven performance." value={
              <span className="font-medium text-[#3b82f6]">100 / 100</span>
            } />
          </div>
          <div>
            <KVRow label="Status" tooltip={SUSTAINABILITY.Status} value={
              <span className="font-medium text-[#3b82f6]">Fixed Rate</span>
            } />
          </div>
        </div>
      </div>
    ) : metrics.insufficientData ? (
      <div>
        <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
          Recently added to the Earnbase index. Sustainability scoring requires at least 7 days of yield data{(metrics.daysCollected ?? 0) > 0 ? `, ${7 - (metrics.daysCollected ?? 0)} more ${pluralize(7 - (metrics.daysCollected ?? 0), 'day')} to go` : ''}.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
          <div>
            <KVRow label="Score" value="Pending" />
            <KVRow label="Status" value="Awaiting Data" tooltip={SUSTAINABILITY.Status} />
          </div>
          <div>
            <KVRow label="Days Collected" value={`${metrics.daysCollected ?? 0} / 7`} />
            <KVRow label="Progress" value={`${Math.round(((metrics.daysCollected ?? 0) / 7) * 100)}%`} />
          </div>
        </div>
      </div>
    ) : (
      <div>
        <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
          {metrics.description}
          {strategyRiskContext && ` ${strategyRiskContext}`}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
          <div>
            <KVRow label="Sustainability Score" tooltip={SUSTAINABILITY['Sustainability Score']} value={
              <span className={`font-medium ${
                (metrics.score ?? 0) >= 90 ? 'text-[#08a671]' :
                (metrics.score ?? 0) >= 75 ? 'text-[#34d399]' :
                (metrics.score ?? 0) >= 55 ? 'text-amber-500' :
                (metrics.score ?? 0) >= 35 ? 'text-orange-500' :
                'text-rose-400'
              }`}>{metrics.score} / 100</span>
            } />
          </div>
          <div>
            <KVRow label="Status" tooltip={SUSTAINABILITY.Status} value={
              <span className={`font-medium ${
                (metrics.score ?? 0) >= 90 ? 'text-[#08a671]' :
                (metrics.score ?? 0) >= 75 ? 'text-[#34d399]' :
                (metrics.score ?? 0) >= 55 ? 'text-amber-500' :
                (metrics.score ?? 0) >= 35 ? 'text-orange-500' :
                'text-rose-400'
              }`}>{metrics.status}</span>
            } />
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

// ── Yield Trajectory (➊) ─────────────────────────────────────

const YieldTrajectorySection: React.FC<{
  product: DeFiProduct;
  trajectory: YieldTrajectory;
  isPrivateCredit?: boolean;
}> = ({ product, trajectory, isPrivateCredit = false }) => {
  const displayName = product.product_name;
  const streakLabel = trajectory.streakDirection === 'upward' ? 'upward' : trajectory.streakDirection === 'downward' ? 'downward' : 'flat';
  const streakAction = trajectory.streakDirection === 'upward'
    ? `rising from ${trajectory.streakStartApy.toFixed(2)}% to ${trajectory.streakEndApy.toFixed(2)}%`
    : trajectory.streakDirection === 'downward'
    ? `falling from ${trajectory.streakStartApy.toFixed(2)}% to ${trajectory.streakEndApy.toFixed(2)}%`
    : `holding steady at ${trajectory.streakEndApy.toFixed(2)}%`;

  return (
    <div>
      <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Yield Trajectory</h2>
      {isPrivateCredit ? (
        <span className="contents">
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
            {displayName} maintains a fixed yield of {product.spotAPY.toFixed(2)}%, consistent across the entire {trajectory.totalDays}-day tracking period. The product delivered positive yields on {trajectory.daysPositive} out of {trajectory.totalDays} {pluralize(trajectory.totalDays, 'day')}. As a private credit instrument, yield does not fluctuate with market conditions.
          </p>
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
            Weekly averages remain consistent at approximately {product.spotAPY.toFixed(2)}%, reflecting the fixed-rate nature of this product. There are no meaningful week-over-week variations to report.
          </p>
        </span>
      ) : (
        <span className="contents">
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
            {trajectory.streakCount <= 1
              ? `${displayName} recorded a 24h APY of ${product.spotAPY.toFixed(2)}% in the most recent data point.`
              : trajectory.streakStartApy.toFixed(2) === trajectory.streakEndApy.toFixed(2)
              ? `${displayName} has maintained a ${streakLabel} trend over the past ${trajectory.streakCount} ${pluralize(trajectory.streakCount, 'day')}, holding steady near ${trajectory.streakEndApy.toFixed(2)}% APY.`
              : `${displayName} has been on a ${trajectory.streakCount}-day ${streakLabel} streak, with APY ${streakAction} over this period.`
            }
            {' '}Over the past {trajectory.totalDays} {pluralize(trajectory.totalDays, 'day')}, the product delivered positive yields on {trajectory.daysPositive} out of {trajectory.totalDays} {pluralize(trajectory.totalDays, 'day')}
            {trajectory.daysAbove10pct > 0 ? `, with ${trajectory.daysAbove10pct} ${pluralize(trajectory.daysAbove10pct, 'day')} exceeding 10% APY` : ''}
            {trajectory.daysAtZero > 0 ? ` and ${trajectory.daysAtZero} ${pluralize(trajectory.daysAtZero, 'day')} of inactivity (0% APY)` : ''}.
          </p>
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
            {trajectory.weeklyAverages.length >= 2 && (
              <span className="contents">
                Week-over-week, yields have {trajectory.wowChange >= 0 ? 'increased' : 'decreased'} by {Math.abs(trajectory.wowChange).toFixed(1)}%.{' '}
              </span>
            )}
            {trajectory.bestWeek && (
              <span className="contents">
                The strongest 7-day period was {trajectory.bestWeek.startDate}–{trajectory.bestWeek.endDate} averaging <span className="text-[#08a671] font-medium">{trajectory.bestWeek.avg.toFixed(2)}%</span>
                {trajectory.worstWeek && trajectory.worstWeek !== trajectory.bestWeek && (
                  <span className="contents">, while the weakest was {trajectory.worstWeek.startDate}–{trajectory.worstWeek.endDate} at {trajectory.worstWeek.avg.toFixed(2)}%</span>
                )}.{' '}
              </span>
            )}
            Current 24h APY of {product.spotAPY.toFixed(2)}% is <span className={`font-medium ${trajectory.currentVs30dAvg >= 0 ? 'text-[#08a671]' : 'text-amber-600 dark:text-amber-400'}`}>{Math.abs(trajectory.currentVs30dAvg).toFixed(1)}% {trajectory.currentVs30dAvg >= 0 ? 'above' : 'below'}</span> the product's own 30-day average.
          </p>
        </span>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
        <div>
          <KVRow label="Current Streak" tooltip={isPrivateCredit ? 'This product has a contractually fixed rate. There is no directional yield movement.' : YIELD_TRAJECTORY['Current Streak']} value={
            isPrivateCredit ? <span className="font-medium text-[#3b82f6]">Fixed rate</span> : trajectory.streakCount < 2 ? '—' : `${trajectory.streakCount}-day ${streakLabel}`
          } />
          <KVRow label="Days With Yield" value={`${trajectory.daysPositive} / ${trajectory.totalDays}`} tooltip={YIELD_TRAJECTORY['Days With Yield']} />
        </div>
        <div>
          <KVRow label="vs. 30D Average" value={isPrivateCredit ? '0.0%' : `${trajectory.currentVs30dAvg >= 0 ? '+' : ''}${trajectory.currentVs30dAvg.toFixed(1)}%`} valueColor={isPrivateCredit ? 'text-[#a0a0b0]' : trendColor(trajectory.currentVs30dAvg)} tooltip={YIELD_TRAJECTORY['vs. 30D Average']} />
          {trajectory.weeklyAverages.length >= 2 && (
            <KVRow label="Week-over-Week" value={isPrivateCredit ? '0.0%' : `${trajectory.wowChange >= 0 ? '+' : ''}${trajectory.wowChange.toFixed(1)}%`} valueColor={isPrivateCredit ? 'text-[#a0a0b0]' : trendColor(trajectory.wowChange)} tooltip={YIELD_TRAJECTORY['Week-over-Week']} />
          )}
        </div>
      </div>
    </div>
  );
};

// ── Weekly Breakdown ─────────────────────────────────────────

const WeeklyBreakdownSection: React.FC<{
  product: DeFiProduct;
  trajectory: YieldTrajectory;
  isPrivateCredit?: boolean;
}> = ({ product, trajectory, isPrivateCredit = false }) => {
  const weeks = trajectory.weeklyAverages;

  const dirWord = trajectory.consecutiveWeeksDirection === 'improved' ? 'improved'
    : trajectory.consecutiveWeeksDirection === 'declined' ? 'declined'
    : trajectory.consecutiveWeeksDirection === 'stable' ? 'remained stable'
    : 'fluctuated';

  const latest = weeks[weeks.length - 1];
  const isHighest = trajectory.bestWeek && latest.avg >= trajectory.bestWeek.avg;
  const isLowest = trajectory.worstWeek && latest.avg <= trajectory.worstWeek.avg;

  return (
    <div>
      <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Weekly Breakdown</h2>

      <div className="mb-3">
        <div className="flex items-center gap-2 py-2 text-[11px] font-medium text-[#a0a0b0] uppercase tracking-[0.06em] border-b border-[#eff0f4] dark:border-border/30">
          <span className="flex-1 min-w-0">Period</span>
          <span className="w-20 text-right shrink-0">Avg APY</span>
          <span className="w-24 text-right shrink-0">vs. Previous</span>
        </div>

        {[...weeks].reverse().slice(0, 4).map((week, idx, arr) => {
          const isOldest = idx === arr.length - 1;
          const prevWeek = isOldest ? null : arr[idx + 1];
          const delta = prevWeek ? ((week.avg - prevWeek.avg) / (prevWeek.avg || 1)) * 100 : 0;
          return (
            <div key={week.startDate} className="flex items-center gap-2 py-2.5 border-b border-[#eff0f4] dark:border-border/30">
              <span className="flex-1 min-w-0 text-[13px] font-medium text-[#30313e] dark:text-foreground/80">
                {week.startDate} – {week.endDate}
              </span>
              <span className="w-20 text-right shrink-0 text-[13px] font-medium text-[#08a671] tabular-nums">
                {week.avg.toFixed(2)}%
              </span>
              <span className={`w-24 text-right shrink-0 text-[13px] font-medium tabular-nums ${isOldest ? 'text-[#a0a0b0]' : isPrivateCredit ? 'text-[#a0a0b0]' : trendColor(delta)}`}>
                {isOldest ? '(baseline)' : isPrivateCredit ? '0.0%' : `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7]">
        {isPrivateCredit
          ? `As a fixed-rate private credit product, weekly APY averages remain stable at approximately ${product.spotAPY.toFixed(2)}% throughout the tracked period.`
          : <span className="contents">Weekly yields have {dirWord} for {trajectory.consecutiveWeeksCount} consecutive {pluralize(trajectory.consecutiveWeeksCount, 'week')}, with the most recent 7-day average of <span className="text-[#08a671] font-medium">{latest.avg.toFixed(2)}%</span> representing the {isHighest ? 'highest' : isLowest ? 'lowest' : 'a mid-range'} weekly performance in the tracked period.</span>
        }
      </p>
    </div>
  );
};

// ── APY Stats (expanded ➎) ───────────────────────────────────

const ApyStatsSection: React.FC<{
  product: DeFiProduct;
  stats: HistoryStats;
  expandedStats: ExpandedApyStats | null;
  sustainabilityScore: number;
  isPrivateCredit?: boolean;
}> = ({ product, stats, expandedStats, sustainabilityScore, isPrivateCredit = false }) => {
  const isSpiking = sustainabilityScore < 50;
  const isElevated = sustainabilityScore >= 50 && sustainabilityScore < 70;

  const trendParagraph = (() => {
    if (stats.trendDirection === 'upward' && isSpiking) return ` moved sharply upward, with the recent average of ${stats.recentAvg.toFixed(2)}% representing a ${Math.abs(stats.trendPct).toFixed(1)}% surge over the earlier average of ${stats.earlyAvg.toFixed(2)}%. The sustainability score of ${sustainabilityScore}/100 flags this as a potential speculative spike.`;
    if (stats.trendDirection === 'upward' && isElevated) return ` demonstrated an upward trajectory, with the recent average of ${stats.recentAvg.toFixed(2)}% representing a ${Math.abs(stats.trendPct).toFixed(1)}% improvement over the earlier ${stats.earlyAvg.toFixed(2)}%. The sustainability score of ${sustainabilityScore}/100 suggests elevated volatility.`;
    if (stats.trendDirection === 'upward') return ` demonstrated an upward trajectory, with the recent average of ${stats.recentAvg.toFixed(2)}% representing a ${Math.abs(stats.trendPct).toFixed(1)}% improvement over the earlier ${stats.earlyAvg.toFixed(2)}%.`;
    if (stats.trendDirection === 'downward' && isSpiking) return ` shown a downward trend, with yields compressing from ${stats.earlyAvg.toFixed(2)}% to ${stats.recentAvg.toFixed(2)}%, a ${Math.abs(stats.trendPct).toFixed(1)}% decline. The sustainability score of ${sustainabilityScore}/100 aligns with a reversion from previously unsustainable levels.`;
    if (stats.trendDirection === 'downward') return ` shown a downward trend, with yields compressing from ${stats.earlyAvg.toFixed(2)}% to ${stats.recentAvg.toFixed(2)}%, a ${Math.abs(stats.trendPct).toFixed(1)}% decline.`;
    return ` remained largely stable, fluctuating within a ${stats.volatility.toLowerCase()}-volatility band between ${stats.min.toFixed(2)}% and ${stats.max.toFixed(2)}%.`;
  })();

  const dp = stats.dataPoints;

  return (
    <div>
      <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Historical APY Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 mb-4">
        <div>
          <KVRow label="30D Low" value={dp < 3 ? 'Pending' : `${stats.min.toFixed(2)}%`} tooltip={APY_STATS['30D Low']} labelSuffix={<PeriodSuffix dataPoints={dp} />} />
          <KVRow label="30D High" value={dp < 3 ? 'Pending' : `${stats.max.toFixed(2)}%`} tooltip={APY_STATS['30D High']} labelSuffix={<PeriodSuffix dataPoints={dp} />} />
          <KVRow label="30D Average" value={dp < 3 ? 'Pending' : `${stats.avg.toFixed(2)}%`} valueColor="text-[#08a671]" tooltip={APY_STATS['30D Average']} labelSuffix={<PeriodSuffix dataPoints={dp} />} />
          {expandedStats && <KVRow label="Median APY" value={`${expandedStats.median.toFixed(2)}%`} tooltip={APY_STATS['Median APY']} />}
          {expandedStats && <KVRow label="Days Above Average" value={`${expandedStats.daysAboveAvg} / ${expandedStats.totalDays}`} tooltip={APY_STATS['Days Above Average']} />}
          {expandedStats && <KVRow label="Best Day" tooltip={APY_STATS['Best Day']} value={
            <span className="contents">
              <span className="text-[#08a671] font-medium tabular-nums">{expandedStats.bestDayApy.toFixed(2)}%</span>
              <span className="ml-1.5 text-[11px] text-[#a0a0b0]">{expandedStats.bestDayDate}</span>
            </span>
          } />}
        </div>
        <div>
          <div className="flex items-center justify-between py-[11px] border-b border-[#eff0f4] dark:border-border/30">
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#71717b] dark:text-muted-foreground/60">
              <TooltipLabel tooltip={APY_STATS.Volatility}>Volatility</TooltipLabel>
            </span>
            <span className="text-[13px] font-medium tabular-nums text-right text-[#09090b] dark:text-foreground/90">
              <span className="contents">
                <span className="tabular-nums">{stats.stdDev.toFixed(2)}</span>
                <span className={`ml-2 text-[11px] ${
                  stats.volatility === 'Low' ? 'text-[#08a671]' :
                  stats.volatility === 'Moderate' ? 'text-amber-600 dark:text-amber-400' :
                  'text-red-500'
                }`}>{stats.volatility}</span>
              </span>
            </span>
          </div>
          <KVRow label="Trend" tooltip={APY_STATS.Trend} value={
            <span className={`font-medium ${trendColor(stats.trendPct)}`}>
              {stats.trendDirection === 'upward' ? 'Upward' : stats.trendDirection === 'downward' ? 'Downward' : 'Stable'} ({stats.trendPct >= 0 ? '+' : ''}{stats.trendPct.toFixed(1)}%)
            </span>
          } />
          <KVRow label="Data Points" value={`${stats.dataPoints} ${pluralize(stats.dataPoints, 'day')}`} tooltip={APY_STATS['Data Points']} />
          {expandedStats && <KVRow label="APY Range" value={`${expandedStats.apyRange.toFixed(2)}pp`} tooltip={APY_STATS['APY Range']} />}
          {expandedStats && <KVRow label="Worst Day" tooltip={APY_STATS['Worst Day']} value={
            <span className="contents">
              <span className="tabular-nums">{expandedStats.worstDayApy.toFixed(2)}%</span>
              <span className="ml-1.5 text-[11px] text-[#a0a0b0]">{expandedStats.worstDayDate}</span>
            </span>
          } />}
          {expandedStats && <KVRow label="Current Percentile" value={`${expandedStats.percentile}th`} tooltip={APY_STATS['Current Percentile']} />}
        </div>
      </div>

      <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7]">
        {isPrivateCredit
          ? `${product.product_name} maintains a fixed yield of ${product.spotAPY.toFixed(2)}% as a private credit instrument. Historical APY statistics reflect minor data-recording variations rather than actual rate changes. The ${stats.volatility.toLowerCase()}-volatility reading of ${stats.stdDev.toFixed(2)} confirms the rate's contractual stability.`
          : `Over the past ${stats.dataPoints} ${pluralize(stats.dataPoints, 'day')}, ${product.product_name}'s yield has${trendParagraph}`
        }
      </p>
    </div>
  );
};

// ── TVL Stats (expanded ➏) ───────────────────────────────────

const TvlStatsSection: React.FC<{
  product: DeFiProduct;
  stats: TvlStats;
  expandedStats: ExpandedTvlStats | null;
}> = ({ product, stats, expandedStats }) => {
  const tvlParagraph = (() => {
    if (stats.trendDirection === 'growing') return ` demonstrated a growth trajectory, expanding from an average of ${formatTVL(stats.earlyAvg)} to ${formatTVL(stats.recentAvg)}, a ${Math.abs(stats.trendPct).toFixed(1)}% increase.`;
    if (stats.trendDirection === 'declining') return ` experienced a contraction, declining from ${formatTVL(stats.earlyAvg)} to ${formatTVL(stats.recentAvg)}, a ${Math.abs(stats.trendPct).toFixed(1)}% reduction.`;
    return ` remained stable, fluctuating between ${formatTVL(stats.min)} and ${formatTVL(stats.max)} with an average of ${formatTVL(stats.avg)}.`;
  })();

  const dp = stats.dataPoints;

  return (
    <div>
      <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Historical TVL Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 mb-4">
        <div>
          <KVRow label="30D Low" value={dp < 3 ? 'Pending' : formatTVL(stats.min)} tooltip={TVL_STATS['30D Low']} labelSuffix={<PeriodSuffix dataPoints={dp} />} />
          <KVRow label="30D High" value={dp < 3 ? 'Pending' : formatTVL(stats.max)} tooltip={TVL_STATS['30D High']} labelSuffix={<PeriodSuffix dataPoints={dp} />} />
          <KVRow label="30D Average" value={dp < 3 ? 'Pending' : formatTVL(stats.avg)} valueColor="text-[#3b82f6]" tooltip={TVL_STATS['30D Average']} labelSuffix={<PeriodSuffix dataPoints={dp} />} />
          {expandedStats && <KVRow label="Median TVL" value={formatTVL(expandedStats.median)} tooltip={TVL_STATS['Median TVL']} />}
          {expandedStats && <KVRow label="Days of Inflows" value={`${expandedStats.inflowDays} / ${expandedStats.totalDays}`} tooltip={TVL_STATS['Days of Inflows']} />}
          {expandedStats && <KVRow label="Largest Inflow" tooltip={TVL_STATS['Largest Inflow']} value={
            <span className="contents">
              <span className="text-[#08a671] font-medium tabular-nums">+{formatTVL(expandedStats.largestInflow)}</span>
              <span className="ml-1.5 text-[11px] text-[#a0a0b0]">{expandedStats.largestInflowDate}</span>
            </span>
          } />}
        </div>
        <div>
          <KVRow label="Current TVL" value={product.tvl > 0 ? formatTVL(product.tvl) : 'No deposits currently tracked'} tooltip={TVL_STATS['Current TVL']} />
          <KVRow label="Net Change" tooltip={TVL_STATS['Net Change']} value={
            <span className={`font-medium ${trendColor(stats.netChangePct)}`}>
              {stats.netChangePct >= 0 ? '+' : ''}{stats.netChangePct.toFixed(1)}%
            </span>
          } />
          <KVRow label="Trend" tooltip={TVL_STATS.Trend} value={
            <span className={`font-medium ${trendColor(stats.trendDirection === 'growing' ? stats.trendPct : stats.trendDirection === 'declining' ? -Math.abs(stats.trendPct) : 0)}`}>
              {stats.trendDirection === 'growing' ? 'Growing' : stats.trendDirection === 'declining' ? 'Declining' : 'Stable'}
            </span>
          } />
          {expandedStats && <KVRow label="TVL per APY Point" value={formatTVL(expandedStats.tvlPerApyPoint)} tooltip={TVL_STATS['TVL per APY Point']} />}
          {expandedStats && <KVRow label="Days of Outflows" value={`${expandedStats.outflowDays} / ${expandedStats.totalDays}`} tooltip={TVL_STATS['Days of Outflows']} />}
          {expandedStats && <KVRow label="Largest Outflow" tooltip={TVL_STATS['Largest Outflow']} value={
            <span className="contents">
              <span className="text-orange-500 dark:text-orange-400 font-medium tabular-nums">-{formatTVL(expandedStats.largestOutflow)}</span>
              <span className="ml-1.5 text-[11px] text-[#a0a0b0]">{expandedStats.largestOutflowDate}</span>
            </span>
          } />}
        </div>
      </div>

      <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7]">
        Over the past {stats.dataPoints} {pluralize(stats.dataPoints, 'day')}, {product.product_name}'s total value locked has{tvlParagraph}
      </p>
    </div>
  );
};