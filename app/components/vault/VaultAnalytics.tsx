'use client';
/** VaultAnalytics — Analytics sections for the Vault page. */
import React from 'react';
import { Info } from 'lucide-react';
import Link from 'next/link';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { formatTVL, trendColor } from '@/app/utils/formatters';
import type { DeFiProduct } from '@/lib/api';
import type {
  MarketStats, SustainabilityMetrics, ContextAnalysis, HistoryStats, TvlStats,
  YieldTrajectory, ExpandedApyStats, ExpandedTvlStats, RankedProduct,
} from './useVaultData';
import { KVRow } from '../ui/KVRow';
import { PeriodSuffix, TooltipLabel } from '../ui/TooltipLabel';

const MARKET_BENCH = {
  'Asset Average APY': 'Mean 24h APY across all tracked strategies for this asset.',
  'This Product APY': 'Current 24-hour annualized yield for this specific product.',
  'Market Rank': "This product's position when all same-asset strategies are sorted by 24h APY.",
  'vs. Average': "How far this product's APY is above or below the asset-wide average, in percent.",
};
const SUSTAINABILITY = {
  'Sustainability Score': 'Measures how stable current yields are relative to 30-day history. 100 = very stable, 10 = highly volatile.',
  Status: 'Classification of yield stability based on the sustainability score.',
};
const YIELD_TRAJECTORY = {
  'Current Streak': 'Number of consecutive days the APY has moved in the same direction.',
  'Days With Yield': 'Days in the tracking period where the product generated a positive return.',
  'vs. 30D Average': "How the current 24h APY compares to the product's own 30-day average.",
  'Week-over-Week': 'Change in average weekly APY compared to the previous 7-day period.',
};
const APY_STATS = {
  '30D Low': 'Lowest recorded 24h APY in the tracking period.',
  '30D High': 'Highest recorded 24h APY in the tracking period.',
  '30D Average': 'Mean of all daily APY values in the tracking period.',
  'Median APY': 'The middle value when all daily APYs are sorted.',
  'Days Above Average': 'Number of days where APY exceeded the period average.',
  'Best Day': 'Single day with the highest recorded APY and the date it occurred.',
  'Worst Day': 'Single day with the lowest recorded APY and the date it occurred.',
  Volatility: 'Standard deviation of daily APY values.',
  Trend: 'Direction of yield movement.',
  'Data Points': 'Total number of days with valid APY data.',
  'APY Range': 'Spread between the highest and lowest daily APY.',
  'Current Percentile': "This product's 30D average APY rank among all same-asset strategies.",
};
const TVL_STATS = {
  '30D Low': 'Lowest recorded TVL in the tracking period.',
  '30D High': 'Highest recorded TVL in the tracking period.',
  '30D Average': 'Mean of all daily TVL values in the tracking period.',
  'Median TVL': 'The middle value when all daily TVLs are sorted.',
  'Current TVL': 'Total value of deposits held in this product right now.',
  'Net Change': 'Total TVL percentage change from the start to end of the tracking period.',
  Trend: 'Direction of TVL movement.',
  'TVL per APY Point': 'Amount of capital per 1% of APY.',
  'Days of Inflows': 'Days where TVL increased compared to the previous day.',
  'Days of Outflows': 'Days where TVL decreased compared to the previous day.',
  'Largest Inflow': 'Biggest single-day TVL increase.',
  'Largest Outflow': 'Biggest single-day TVL decrease.',
};

function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || singular + 's');
}

const platformDescriptions: Record<string, string> = {
  "Morpho": "Morpho is a decentralized lending protocol that enables the creation of isolated lending markets and curated vaults.",
  "Euler": "Euler is a non-custodial lending protocol offering both permissionless lending markets and curated vault strategies.",
  "Aave": "Aave is one of the largest DeFi lending protocols by total value locked, offering variable and stable rate lending pools.",
  "IPOR Fusion": "IPOR Fusion is a yield optimization protocol that enables complex strategies including leveraged looping.",
  "Yearn": "Yearn is a DeFi yield aggregator that automates capital allocation across lending protocols and liquidity pools.",
  "Fluid": "Fluid is a lending and borrowing protocol designed for capital efficiency.",
  "Lagoon": "Lagoon is a DeFi vault infrastructure protocol that enables curated yield strategies.",
  "Wildcat": "Wildcat is a fixed-rate lending protocol focused on private credit.",
  "Harvest": "Harvest Finance is a DeFi yield aggregator that automatically compounds yields across lending protocols.",
  "Moonwell": "Moonwell is a lending and borrowing protocol primarily deployed on Base and Moonbeam.",
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

    {/* Market Benchmarking */}
    {marketStats && (() => {
      const spotAPY = product.spotAPY;
      const avgAPY = marketStats.avgApy;
      const absDiff = (spotAPY - avgAPY).toFixed(2);
      const pctDiff = (((spotAPY - avgAPY) / (avgAPY || 1)) * 100).toFixed(1);
      const usesPp = Math.abs(parseFloat(pctDiff)) < 5;
      const comparisonText = usesPp
        ? <span>Its {spotAPY.toFixed(2)}% yield is <span className={`mx-1 font-medium ${marketStats.isAboveAverage ? 'text-[#08a671]' : 'text-amber-600'}`}>{absDiff}pp {parseFloat(absDiff) >= 0 ? 'above' : 'below'}</span> the market average of {avgAPY.toFixed(2)}%.</span>
        : <span>Its {spotAPY.toFixed(2)}% yield is <span className={`mx-1 font-medium ${marketStats.isAboveAverage ? 'text-[#08a671]' : 'text-amber-600'}`}>{Math.abs(parseFloat(pctDiff)).toFixed(1)}% {marketStats.isAboveAverage ? 'higher' : 'lower'}</span> than the market average of {avgAPY.toFixed(2)}%.</span>;

      return (
        <div>
          <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Market Benchmarking</h2>
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
            {spotAPY > 0 ? (
              <span>
                Within the <span className="font-medium">{product.ticker}</span> ecosystem, this product ranks <span className="font-medium">#{marketStats.rank}</span> out of {marketStats.totalInAsset} {pluralize(marketStats.totalInAsset, 'strategy', 'strategies')}. {comparisonText}
                {marketStats.isAboveAverage && marketStats.rank > 1 && (
                  <span> While not the highest available, this strategy outperforms the majority of tracked {product.ticker} opportunities.</span>
                )}
              </span>
            ) : (
              <span>No yield data available. This product is tracked within the <span className="font-medium">{product.ticker}</span> ecosystem alongside {marketStats.totalInAsset} {pluralize(marketStats.totalInAsset, 'strategy', 'strategies')}.</span>
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
            <div>
              <KVRow label="Asset Average APY" value={`${marketStats.avgApy.toFixed(2)}%`} tooltip={MARKET_BENCH['Asset Average APY']} />
              <KVRow label="This Product APY" value={spotAPY > 0 ? `${spotAPY.toFixed(2)}%` : '—'} valueColor={spotAPY > 0 ? 'text-[#08a671]' : undefined} tooltip={MARKET_BENCH['This Product APY']} />
            </div>
            <div>
              <KVRow label="Market Rank" value={marketStats.rank > 0 ? `#${marketStats.rank} / ${marketStats.totalInAsset}` : '—'} tooltip={MARKET_BENCH['Market Rank']} />
              <KVRow label="vs. Average" value={spotAPY > 0 ? `${marketStats.isAboveAverage ? '+' : '-'}${Math.abs(marketStats.diffPercent).toFixed(1)}%` : '—'} valueColor={spotAPY > 0 ? (marketStats.isAboveAverage ? 'text-[#08a671]' : 'text-amber-600') : undefined} tooltip={MARKET_BENCH['vs. Average']} />
            </div>
          </div>
        </div>
      );
    })()}

    {/* Comparative Rankings */}
    {comparativeRankings.length > 1 && marketStats && (
      <div>
        <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">How {product.product_name} Compares</h2>
        <div className="mb-3">
          <div className="flex items-center gap-2 py-2 text-[11px] font-medium text-[#a0a0b0] uppercase tracking-[0.06em] border-b border-[#eff0f4] dark:border-border/30">
            <span className="w-8 shrink-0">#</span>
            <span className="flex-1 min-w-0">Product</span>
            <span className="w-20 text-right shrink-0 hidden sm:block">Network</span>
            <span className="w-20 text-right shrink-0">APY</span>
            <span className="w-20 text-right shrink-0 hidden sm:block">TVL</span>
          </div>
          {comparativeRankings.map(r => {
            const isCurrent = r.product.id === product.id;
            return (
              <Link key={r.product.id} href={`/vault/${r.slug}`}
                className={`flex items-center gap-2 py-2.5 border-b border-[#eff0f4] dark:border-border/30 group transition-colors ${isCurrent ? 'bg-[#08a671]/[0.03]' : 'hover:bg-[#f8f8fa] dark:hover:bg-white/[0.02]'}`}>
                <span className={`w-8 shrink-0 text-[12px] font-medium tabular-nums ${isCurrent ? 'text-[#08a671]' : 'text-[#a0a0b0]'}`}>#{r.rank}</span>
                <span className={`flex-1 min-w-0 text-[13px] font-medium truncate ${isCurrent ? 'text-[#08a671]' : 'text-[#30313e] dark:text-foreground/80 group-hover:text-[#08a671]'} transition-colors`}>
                  {r.product.product_name}
                  <span className="text-[#a0a0b0] font-normal ml-1.5">{r.product.platform_name}</span>
                </span>
                <span className="w-20 text-right shrink-0 text-[12px] text-[#a0a0b0] hidden sm:block">{r.product.network}</span>
                <span className={`w-20 text-right shrink-0 text-[13px] font-medium tabular-nums ${isCurrent ? 'text-[#08a671]' : 'text-[#09090b] dark:text-foreground/80'}`}>{r.product.spotAPY.toFixed(2)}%</span>
                <span className="w-20 text-right shrink-0 text-[12px] text-[#a0a0b0] tabular-nums hidden sm:block">{formatTVL(r.product.tvl)}</span>
              </Link>
            );
          })}
          <div className="flex items-center gap-2 py-2.5 text-[12px]">
            <span className="w-8 shrink-0" />
            <span className="flex-1 min-w-0 font-medium text-[#a0a0b0] uppercase tracking-[0.04em]">{product.ticker.toUpperCase()} Market Average</span>
            <span className="w-20 text-right shrink-0 hidden sm:block" />
            <span className="w-20 text-right shrink-0 font-medium text-[#a0a0b0] tabular-nums">{marketStats.avgApy.toFixed(2)}%</span>
            <span className="w-20 text-right shrink-0 hidden sm:block" />
          </div>
        </div>
        {(() => {
          const higherTvlNeighbors = comparativeRankings.filter(r => r.product.id !== product.id && r.product.tvl > product.tvl * 1.5);
          if (higherTvlNeighbors.length === 0) return null;
          const top = higherTvlNeighbors.sort((a, b) => b.product.tvl - a.product.tvl)[0];
          return (
            <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mt-3">
              {product.product_name} currently ranks #{marketStats.rank} among {marketStats.totalInAsset} monitored {product.ticker} strategies.
              {' '}However, with a TVL of {formatTVL(product.tvl)}, it holds significantly less capital than higher-TVL alternatives like {top.product.product_name} ({formatTVL(top.product.tvl)}).
            </p>
          );
        })()}
      </div>
    )}

    {/* Ecosystem Context */}
    {contextAnalysis && (() => {
      const hasCurator = product.curator && product.curator !== '-' && product.curator.trim() !== '';
      const curatorProducts = hasCurator ? products.filter(p => p.curator === product.curator) : [];
      return (
        <div>
          <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Ecosystem Context</h2>
          {(() => {
            const curatorNetworks = hasCurator
              ? new Set(curatorProducts.map(p => p.network)).size
              : 0;
            const samePlatformTicker = products.filter(p => p.platform_name === product.platform_name && p.ticker === product.ticker && p.id !== product.id).length;
            return (
              <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7]">
                Positioned within the <span className="font-medium">{product.network}</span> ecosystem, this product's yield is{' '}
                <span className="text-[#08a671] font-medium">{Math.abs(contextAnalysis.netDiff).toFixed(1)}% {contextAnalysis.netDiff >= 0 ? 'higher' : 'lower'}</span>{' '}
                than the network average for {product.ticker} strategies.
                {contextAnalysis.isBestOnNetwork && ` Currently the highest-yielding ${product.ticker} opportunity on ${product.network} among ${contextAnalysis.netCount} tracked products.`}
                {hasCurator && curatorProducts.length > 0 && ` This strategy is curated by ${product.curator}, with ${curatorProducts.length} ${product.curator} strategies tracked on Earnbase${curatorNetworks > 1 ? ` across ${curatorNetworks} networks` : ''}.`}
                {samePlatformTicker > 0 && ` Within ${product.platform_name}, it competes against ${samePlatformTicker} other ${product.ticker} ${pluralize(samePlatformTicker, 'strategy', 'strategies')}.`}
                {networkTvlRank && ` By TVL, this product ranks #${networkTvlRank.networkTvlRank} of ${networkTvlRank.networkTvlTotal} ${product.ticker} strategies on ${product.network}.`}
              </p>
            );
          })()}
        </div>
      );
    })()}

    {/* About platform */}
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

    {/* Network Positioning */}
    {networkRankings.length > 1 && contextAnalysis && (
      <div>
        {(() => {
          const myRank = networkRankings.find(r => r.product.id === product.id);
          return (
            <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">
              {product.ticker.toUpperCase()} on {product.network}
              {myRank && <span className="ml-2 text-[13px] font-normal text-[#a0a0b0]">#{myRank.rank} of {contextAnalysis.netCount}</span>}
            </h2>
          );
        })()}
        <div className="mb-3">
          {networkRankings.map(r => {
            const isCurrent = r.product.id === product.id;
            return (
              <Link key={r.product.id} href={`/vault/${r.slug}`}
                className={`flex items-center justify-between py-2.5 border-b border-[#eff0f4] dark:border-border/30 group transition-colors ${isCurrent ? 'bg-[#08a671]/[0.03]' : 'hover:bg-[#f8f8fa]'}`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`text-[12px] font-medium tabular-nums w-6 shrink-0 ${isCurrent ? 'text-[#08a671]' : 'text-[#a0a0b0]'}`}>#{r.rank}</span>
                  <span className={`text-[13px] font-medium truncate ${isCurrent ? 'text-[#08a671]' : 'text-[#30313e] dark:text-foreground/80 group-hover:text-[#08a671]'}`}>{r.product.product_name}</span>
                  {isCurrent && <span className="text-[9px] font-bold text-[#08a671] bg-[#08a671]/10 px-1.5 py-0.5 rounded-full ml-1 shrink-0 uppercase tracking-wider">You are here</span>}
                </div>
                <span className={`text-[13px] font-medium tabular-nums shrink-0 ${isCurrent ? 'text-[#08a671]' : 'text-[#09090b] dark:text-foreground/80'}`}>{r.product.spotAPY.toFixed(2)}%</span>
              </Link>
            );
          })}
          <div className="flex items-center justify-between py-2.5 text-[12px]">
            <span className="font-medium text-[#a0a0b0] uppercase tracking-[0.04em]">Network Average</span>
            <span className="font-medium text-[#a0a0b0] tabular-nums">{contextAnalysis.netAvg.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    )}

    {/* Yield Sustainability */}
    {sustainabilityMetrics && (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground">Yield Sustainability</h2>
          <RadixTooltip.Provider delayDuration={0}>
            <RadixTooltip.Root>
              <RadixTooltip.Trigger asChild>
                <button className="text-[#a0a0b0] hover:text-[#30313e] transition-colors cursor-help outline-none">
                  <Info className="w-3.5 h-3.5" />
                </button>
              </RadixTooltip.Trigger>
              <RadixTooltip.Portal>
                <RadixTooltip.Content className="z-50 max-w-[240px] bg-white dark:bg-card p-3 rounded-[10px] border border-[#e4e4e7] text-[11px] shadow-sm" sideOffset={5}>
                  <p className="text-[10px] text-[#a0a0b0] mb-2.5">Measures how closely the current yield tracks its 30-day average.</p>
                  <div className="space-y-1.5">
                    {[['#08a671','90–100','Very Stable'],['#34d399','75–89','Stable'],['amber-400','55–74','Moderate'],['orange-400','35–54','Low Stability'],['rose-400','10–34','Very Low Stability']].map(([color,range,label]) => (
                      <div key={range} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: color.startsWith('#') ? color : undefined }} />
                        <span className="text-[#a0a0b0]"><span className="font-medium text-[#30313e] dark:text-foreground/80">{range}</span> {label}</span>
                      </div>
                    ))}
                  </div>
                </RadixTooltip.Content>
              </RadixTooltip.Portal>
            </RadixTooltip.Root>
          </RadixTooltip.Provider>
        </div>
        {isPrivateCredit ? (
          <div>
            <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
              This is a private credit product with a contractually fixed yield rate of {product.spotAPY.toFixed(2)}%. The yield does not fluctuate based on market conditions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
              <div><KVRow label="Sustainability Score" tooltip="Fixed-rate product." value={<span className="font-medium text-[#3b82f6]">100 / 100</span>} /></div>
              <div><KVRow label="Status" tooltip={SUSTAINABILITY.Status} value={<span className="font-medium text-[#3b82f6]">Fixed Rate</span>} /></div>
            </div>
          </div>
        ) : sustainabilityMetrics.insufficientData ? (
          <div>
            <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
              Recently added. Sustainability scoring requires at least 7 days of yield data{(sustainabilityMetrics.daysCollected ?? 0) > 0 ? `, ${7 - (sustainabilityMetrics.daysCollected ?? 0)} more days to go` : ''}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
              <div>
                <KVRow label="Score" value="Pending" />
                <KVRow label="Days Collected" value={`${sustainabilityMetrics.daysCollected ?? 0} / 7`} />
              </div>
              <div><KVRow label="Status" value="Awaiting Data" tooltip={SUSTAINABILITY.Status} /></div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
              {sustainabilityMetrics.description}
              {(sustainabilityMetrics.score ?? 100) < 35 && ' This pattern is often driven by temporary incentive programs, one-off events, or rapid capital reallocation.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
              <div>
                <KVRow label="Sustainability Score" tooltip={SUSTAINABILITY['Sustainability Score']} value={
                  <span className={`font-medium ${(sustainabilityMetrics.score ?? 0) >= 90 ? 'text-[#08a671]' : (sustainabilityMetrics.score ?? 0) >= 75 ? 'text-[#34d399]' : (sustainabilityMetrics.score ?? 0) >= 55 ? 'text-amber-500' : (sustainabilityMetrics.score ?? 0) >= 35 ? 'text-orange-500' : 'text-rose-400'}`}>
                    {sustainabilityMetrics.score} / 100
                  </span>
                } />
              </div>
              <div>
                <KVRow label="Status" tooltip={SUSTAINABILITY.Status} value={
                  <span className={`font-medium ${(sustainabilityMetrics.score ?? 0) >= 90 ? 'text-[#08a671]' : (sustainabilityMetrics.score ?? 0) >= 75 ? 'text-[#34d399]' : (sustainabilityMetrics.score ?? 0) >= 55 ? 'text-amber-500' : (sustainabilityMetrics.score ?? 0) >= 35 ? 'text-orange-500' : 'text-rose-400'}`}>
                    {sustainabilityMetrics.status}
                  </span>
                } />
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    {/* Yield Trajectory */}
    {yieldTrajectory && (
      <div>
        <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Yield Trajectory</h2>
        {!isPrivateCredit && (
          <>
            <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
              {yieldTrajectory.streakCount <= 1
                ? `${product.product_name} recorded a 24h APY of ${product.spotAPY.toFixed(2)}% in the most recent data point.`
                : `${product.product_name} has been on a ${yieldTrajectory.streakCount}-day ${yieldTrajectory.streakDirection} streak${yieldTrajectory.streakCount >= 2 ? `, with APY ${yieldTrajectory.streakDirection === 'downward' ? 'falling' : 'rising'} from ${yieldTrajectory.streakStartApy.toFixed(2)}% to ${yieldTrajectory.streakEndApy.toFixed(2)}% over this period` : ''}.`
              }
              {' '}Over the past {yieldTrajectory.totalDays} days, the product delivered positive yields on {yieldTrajectory.daysPositive} out of {yieldTrajectory.totalDays} days.
              {yieldTrajectory.weeklyAverages.length >= 2 && (
                <> Week-over-week, yields have {yieldTrajectory.wowChange >= 0 ? 'increased' : 'declined'} by {Math.abs(yieldTrajectory.wowChange).toFixed(1)}%.{' '}
                {yieldTrajectory.bestWeek && yieldTrajectory.worstWeek && yieldTrajectory.bestWeek.startDate !== yieldTrajectory.worstWeek.startDate && (
                  <>The strongest 7-day period was {yieldTrajectory.bestWeek.startDate}–{yieldTrajectory.bestWeek.endDate} averaging {yieldTrajectory.bestWeek.avg.toFixed(2)}%, while the weakest was {yieldTrajectory.worstWeek.startDate}–{yieldTrajectory.worstWeek.endDate} at {yieldTrajectory.worstWeek.avg.toFixed(2)}%.</>
                )}
                </>
              )}
              {' '}Current 24h APY of {product.spotAPY.toFixed(2)}% is{' '}
              <span className={`font-medium ${yieldTrajectory.currentVs30dAvg >= 0 ? 'text-[#08a671]' : 'text-amber-600'}`}>
                {Math.abs(yieldTrajectory.currentVs30dAvg).toFixed(1)}% {yieldTrajectory.currentVs30dAvg >= 0 ? 'above' : 'below'}
              </span>{' '}
              the product's own 30-day average.
            </p>
            {yieldTrajectory.weeklyAverages.length >= 2 && yieldTrajectory.consecutiveWeeksCount > 0 && (
              <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7] mb-4">
                {yieldTrajectory.consecutiveWeeksDirection === 'improved'
                  ? `Weekly yields have improved for ${yieldTrajectory.consecutiveWeeksCount} consecutive ${pluralize(yieldTrajectory.consecutiveWeeksCount, 'week')}, with the most recent 7-day average of ${[...yieldTrajectory.weeklyAverages].reverse()[0]?.avg.toFixed(2)}% representing a${yieldTrajectory.consecutiveWeeksCount >= 2 ? ' sustained' : ' mid-range'} weekly performance in the tracked period.`
                  : yieldTrajectory.consecutiveWeeksDirection === 'declined'
                    ? `Weekly yields have declined for ${yieldTrajectory.consecutiveWeeksCount} consecutive ${pluralize(yieldTrajectory.consecutiveWeeksCount, 'week')}. The most recent 7-day average stands at ${[...yieldTrajectory.weeklyAverages].reverse()[0]?.avg.toFixed(2)}%.`
                    : null
                }
              </p>
            )}
          </>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16">
          <div>
            <KVRow label="Current Streak" tooltip={YIELD_TRAJECTORY['Current Streak']} value={isPrivateCredit ? <span className="font-medium text-[#3b82f6]">Fixed rate</span> : yieldTrajectory.streakCount < 2 ? '—' : `${yieldTrajectory.streakCount}-day ${yieldTrajectory.streakDirection}`} />
            <KVRow label="Days With Yield" value={`${yieldTrajectory.daysPositive} / ${yieldTrajectory.totalDays}`} tooltip={YIELD_TRAJECTORY['Days With Yield']} />
          </div>
          <div>
            <KVRow label="vs. 30D Average" value={isPrivateCredit ? '0.0%' : `${yieldTrajectory.currentVs30dAvg >= 0 ? '+' : ''}${yieldTrajectory.currentVs30dAvg.toFixed(1)}%`} valueColor={isPrivateCredit ? 'text-[#a0a0b0]' : trendColor(yieldTrajectory.currentVs30dAvg)} tooltip={YIELD_TRAJECTORY['vs. 30D Average']} />
            {yieldTrajectory.weeklyAverages.length >= 2 && (
              <KVRow label="Week-over-Week" value={`${yieldTrajectory.wowChange >= 0 ? '+' : ''}${yieldTrajectory.wowChange.toFixed(1)}%`} valueColor={isPrivateCredit ? 'text-[#a0a0b0]' : trendColor(yieldTrajectory.wowChange)} tooltip={YIELD_TRAJECTORY['Week-over-Week']} />
            )}
          </div>
        </div>
      </div>
    )}

    {/* Weekly Breakdown */}
    {yieldTrajectory && yieldTrajectory.weeklyAverages.length >= 2 && (
      <div>
        <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Weekly Breakdown</h2>
        <div className="mb-3">
          <div className="flex items-center gap-2 py-2 text-[11px] font-medium text-[#a0a0b0] uppercase tracking-[0.06em] border-b border-[#eff0f4] dark:border-border/30">
            <span className="flex-1 min-w-0">Period</span>
            <span className="w-20 text-right shrink-0">Avg APY</span>
            <span className="w-24 text-right shrink-0">vs. Previous</span>
          </div>
          {[...yieldTrajectory.weeklyAverages].reverse().slice(0, 4).map((week, idx, arr) => {
            const isOldest = idx === arr.length - 1;
            const prevWeek = isOldest ? null : arr[idx + 1];
            const delta = prevWeek ? ((week.avg - prevWeek.avg) / (prevWeek.avg || 1)) * 100 : 0;
            return (
              <div key={week.startDate} className="flex items-center gap-2 py-2.5 border-b border-[#eff0f4] dark:border-border/30">
                <span className="flex-1 min-w-0 text-[13px] font-medium text-[#30313e] dark:text-foreground/80">{week.startDate} – {week.endDate}</span>
                <span className="w-20 text-right shrink-0 text-[13px] font-medium text-[#08a671] tabular-nums">{week.avg.toFixed(2)}%</span>
                <span className={`w-24 text-right shrink-0 text-[13px] font-medium tabular-nums ${isOldest ? 'text-[#a0a0b0]' : isPrivateCredit ? 'text-[#a0a0b0]' : trendColor(delta)}`}>
                  {isOldest ? '(baseline)' : isPrivateCredit ? '0.0%' : `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Historical APY Statistics */}
    {historyStats && (
      <div>
        <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Historical APY Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 mb-4">
          <div>
            <KVRow label="30D Low" value={historyStats.dataPoints < 3 ? 'Pending' : `${historyStats.min.toFixed(2)}%`} tooltip={APY_STATS['30D Low']} labelSuffix={<PeriodSuffix dataPoints={historyStats.dataPoints} />} />
            <KVRow label="30D High" value={historyStats.dataPoints < 3 ? 'Pending' : `${historyStats.max.toFixed(2)}%`} tooltip={APY_STATS['30D High']} labelSuffix={<PeriodSuffix dataPoints={historyStats.dataPoints} />} />
            <KVRow label="30D Average" value={historyStats.dataPoints < 3 ? 'Pending' : `${historyStats.avg.toFixed(2)}%`} valueColor="text-[#08a671]" tooltip={APY_STATS['30D Average']} labelSuffix={<PeriodSuffix dataPoints={historyStats.dataPoints} />} />
            {expandedApyStats && <KVRow label="Median APY" value={`${expandedApyStats.median.toFixed(2)}%`} tooltip={APY_STATS['Median APY']} />}
            {expandedApyStats && <KVRow label="Days Above Average" value={`${expandedApyStats.daysAboveAvg} / ${expandedApyStats.totalDays}`} tooltip={APY_STATS['Days Above Average']} />}
            {expandedApyStats && <KVRow label="Best Day" tooltip={APY_STATS['Best Day']} value={<span><span className="text-[#08a671] font-medium">{expandedApyStats.bestDayApy.toFixed(2)}%</span><span className="ml-1.5 text-[11px] text-[#a0a0b0]">{expandedApyStats.bestDayDate}</span></span>} />}
          </div>
          <div>
            <div className="flex items-center justify-between py-[11px] border-b border-[#eff0f4] dark:border-border/30">
              <span className="text-[13px] font-medium text-[#71717b]"><TooltipLabel tooltip={APY_STATS.Volatility}>Volatility</TooltipLabel></span>
              <span className="text-[13px] font-medium tabular-nums text-right">
                <span className="tabular-nums">{historyStats.stdDev.toFixed(2)}</span>
                <span className={`ml-2 text-[11px] ${historyStats.volatility === 'Low' ? 'text-[#08a671]' : historyStats.volatility === 'Moderate' ? 'text-amber-600' : 'text-red-500'}`}>{historyStats.volatility}</span>
              </span>
            </div>
            <KVRow label="Trend" tooltip={APY_STATS.Trend} value={<span className={`font-medium ${trendColor(historyStats.trendPct)}`}>{historyStats.trendDirection === 'upward' ? 'Upward' : historyStats.trendDirection === 'downward' ? 'Downward' : 'Stable'} ({historyStats.trendPct >= 0 ? '+' : ''}{historyStats.trendPct.toFixed(1)}%)</span>} />
            <KVRow label="Data Points" value={`${historyStats.dataPoints} days`} tooltip={APY_STATS['Data Points']} />
            {expandedApyStats && <KVRow label="APY Range" value={`${expandedApyStats.apyRange.toFixed(2)}pp`} tooltip={APY_STATS['APY Range']} />}
            {expandedApyStats && <KVRow label="Worst Day" tooltip={APY_STATS['Worst Day']} value={<span><span className="tabular-nums">{expandedApyStats.worstDayApy.toFixed(2)}%</span><span className="ml-1.5 text-[11px] text-[#a0a0b0]">{expandedApyStats.worstDayDate}</span></span>} />}
            {expandedApyStats && <KVRow label="Current Percentile" value={`${expandedApyStats.percentile}th`} tooltip={APY_STATS['Current Percentile']} />}
          </div>
        </div>
        {historyStats.dataPoints >= 7 && (
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7]">
            Over the past {historyStats.dataPoints} days, {product.product_name}'s yield has shown a {historyStats.trendDirection} trend,
            {' '}with yields {historyStats.trendDirection === 'downward' ? 'compressing' : 'expanding'} from {historyStats.earlyAvg.toFixed(2)}% to {historyStats.recentAvg.toFixed(2)}%,
            {' '}a {Math.abs(historyStats.trendPct).toFixed(1)}% {historyStats.trendDirection === 'downward' ? 'decline' : 'increase'}.
            {sustainabilityMetrics && !sustainabilityMetrics.insufficientData && (
              <> The sustainability score of {sustainabilityMetrics.score}/100 aligns with {(sustainabilityMetrics.score ?? 0) < 35 ? 'a reversion from previously unsustainable levels' : (sustainabilityMetrics.score ?? 0) >= 75 ? 'a period of relative yield stability' : 'moderate yield variability'}.</>
            )}
          </p>
        )}
      </div>
    )}

    {/* Historical TVL Statistics */}
    {tvlStats && (
      <div>
        <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-3">Historical TVL Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 mb-4">
          <div>
            <KVRow label="30D Low" value={tvlStats.dataPoints < 3 ? 'Pending' : formatTVL(tvlStats.min)} tooltip={TVL_STATS['30D Low']} labelSuffix={<PeriodSuffix dataPoints={tvlStats.dataPoints} />} />
            <KVRow label="30D High" value={tvlStats.dataPoints < 3 ? 'Pending' : formatTVL(tvlStats.max)} tooltip={TVL_STATS['30D High']} labelSuffix={<PeriodSuffix dataPoints={tvlStats.dataPoints} />} />
            <KVRow label="30D Average" value={tvlStats.dataPoints < 3 ? 'Pending' : formatTVL(tvlStats.avg)} valueColor="text-[#3b82f6]" tooltip={TVL_STATS['30D Average']} labelSuffix={<PeriodSuffix dataPoints={tvlStats.dataPoints} />} />
            {expandedTvlStats && <KVRow label="Median TVL" value={formatTVL(expandedTvlStats.median)} tooltip={TVL_STATS['Median TVL']} />}
            {expandedTvlStats && <KVRow label="Days of Inflows" value={`${expandedTvlStats.inflowDays} / ${expandedTvlStats.totalDays}`} tooltip={TVL_STATS['Days of Inflows']} />}
            {expandedTvlStats && <KVRow label="Largest Inflow" tooltip={TVL_STATS['Largest Inflow']} value={<span><span className="text-[#08a671] font-medium">+{formatTVL(expandedTvlStats.largestInflow)}</span><span className="ml-1.5 text-[11px] text-[#a0a0b0]">{expandedTvlStats.largestInflowDate}</span></span>} />}
          </div>
          <div>
            <KVRow label="Current TVL" value={product.tvl > 0 ? formatTVL(product.tvl) : 'No deposits tracked'} tooltip={TVL_STATS['Current TVL']} />
            <KVRow label="Net Change" tooltip={TVL_STATS['Net Change']} value={<span className={`font-medium ${trendColor(tvlStats.netChangePct)}`}>{tvlStats.netChangePct >= 0 ? '+' : ''}{tvlStats.netChangePct.toFixed(1)}%</span>} />
            <KVRow label="Trend" tooltip={TVL_STATS.Trend} value={<span className={`font-medium ${trendColor(tvlStats.trendDirection === 'growing' ? tvlStats.trendPct : tvlStats.trendDirection === 'declining' ? -Math.abs(tvlStats.trendPct) : 0)}`}>{tvlStats.trendDirection === 'growing' ? 'Growing' : tvlStats.trendDirection === 'declining' ? 'Declining' : 'Stable'}</span>} />
            {expandedTvlStats && <KVRow label="TVL per APY Point" value={formatTVL(expandedTvlStats.tvlPerApyPoint)} tooltip={TVL_STATS['TVL per APY Point']} />}
            {expandedTvlStats && <KVRow label="Days of Outflows" value={`${expandedTvlStats.outflowDays} / ${expandedTvlStats.totalDays}`} tooltip={TVL_STATS['Days of Outflows']} />}
            {expandedTvlStats && <KVRow label="Largest Outflow" tooltip={TVL_STATS['Largest Outflow']} value={<span><span className="text-orange-500 font-medium">-{formatTVL(expandedTvlStats.largestOutflow)}</span><span className="ml-1.5 text-[11px] text-[#a0a0b0]">{expandedTvlStats.largestOutflowDate}</span></span>} />}
          </div>
        </div>
        {tvlStats.dataPoints >= 7 && (
          <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-[1.7]">
            Over the past {tvlStats.dataPoints} days, {product.product_name}'s total value locked has experienced a {tvlStats.trendDirection === 'growing' ? 'growth phase' : tvlStats.trendDirection === 'declining' ? 'contraction' : 'period of stability'},{' '}
            {tvlStats.trendDirection !== 'stable'
              ? <>{tvlStats.trendDirection === 'growing' ? 'growing' : 'declining'} from {formatTVL(tvlStats.earlyAvg)} to {formatTVL(tvlStats.recentAvg)}, a {Math.abs(tvlStats.trendPct).toFixed(1)}% {tvlStats.trendDirection === 'growing' ? 'increase' : 'reduction'}.</>
              : <>with TVL remaining relatively steady around {formatTVL(tvlStats.avg)}.</>
            }
          </p>
        )}
      </div>
    )}
  </div>
);
