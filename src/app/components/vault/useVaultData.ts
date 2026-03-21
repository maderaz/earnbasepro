/**
 * useVaultData — All computed data for the Vault Product page.
 */
import { useMemo, useState } from 'react';
import type { DeFiProduct } from '@/app/utils/types';
import { getProductSlug } from '@/app/utils/slugify';
import { formatTVL } from '@/app/utils/formatters';
import { vaultProductSEO, ogImageUrl } from '@/app/components/SEO';
import { subDays, format } from 'date-fns';

export interface HistoryStats {
  min: number; max: number; avg: number; stdDev: number;
  trendPct: number; trendDirection: 'upward' | 'downward' | 'stable';
  earlyAvg: number; recentAvg: number;
  volatility: 'Low' | 'Moderate' | 'High';
  dataPoints: number;
}

export interface TvlStats {
  min: number; max: number; avg: number; stdDev: number;
  trendPct: number; trendDirection: 'growing' | 'declining' | 'stable';
  earlyAvg: number; recentAvg: number;
  netChange: number; netChangePct: number;
  dataPoints: number;
}

export interface MarketStats {
  avgApy: number; rank: number; totalInAsset: number;
  diffPercent: number; isAboveAverage: boolean;
}

export interface SustainabilityMetrics {
  score: number | null; status: string; description: string;
  deviation: number; insufficientData?: boolean; daysCollected?: number;
}

export interface ContextAnalysis {
  netAvg: number; platAvg: number;
  netCount: number; platCount: number;
  isBestOnNetwork: boolean; isMostLiquidOnPlatform: boolean;
  netDiff: number;
}

export interface ChartEntry { date: string; fullDate: string; apy: number; }
export interface TvlChartEntry { date: string; fullDate: string; tvl: number; }

export interface YieldTrajectory {
  streakCount: number;
  streakDirection: 'upward' | 'downward' | 'flat';
  streakStartApy: number;
  streakEndApy: number;
  daysPositive: number;
  totalDays: number;
  daysAbove10pct: number;
  daysAtZero: number;
  weeklyAverages: { avg: number; startDate: string; endDate: string }[];
  wowChange: number;
  bestWeek: { avg: number; startDate: string; endDate: string } | null;
  worstWeek: { avg: number; startDate: string; endDate: string } | null;
  currentVs30dAvg: number;
  consecutiveWeeksCount: number;
  consecutiveWeeksDirection: 'improved' | 'declined' | 'fluctuated' | 'stable';
}

export interface CapitalFlows {
  tvl7dChangeAbs: number;
  tvl7dChangePct: number;
  tvl30dChangeAbs: number;
  tvl30dChangePct: number;
  tvlMax30d: number;
  tvlMin30d: number;
  tvlMaxDate: string;
  tvlMinDate: string;
  inflowDays: number;
  outflowDays: number;
  largestInflow: number;
  largestInflowDate: string;
  largestOutflow: number;
  largestOutflowDate: string;
  totalDays: number;
  inflowDays7d: number;
}

export interface YieldTvlCorrelation {
  apyDirection: number;
  tvlDirection: number;
  insight: string;
  icon: string;
}

export interface ExpandedApyStats {
  median: number;
  daysAboveAvg: number;
  bestDayApy: number;
  bestDayDate: string;
  worstDayApy: number;
  worstDayDate: string;
  percentile: number;
  apyRange: number;
  totalDays: number;
}

export interface ExpandedTvlStats {
  median: number;
  tvlPerApyPoint: number;
  inflowDays: number;
  outflowDays: number;
  largestInflow: number;
  largestInflowDate: string;
  largestOutflow: number;
  largestOutflowDate: string;
  totalDays: number;
}

export interface RankedProduct {
  product: DeFiProduct;
  rank: number;
  slug: string;
}

const median = (arr: number[]): number => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const sign = (n: number): number => (n > 0 ? 1 : n < 0 ? -1 : 0);

/** Parse raw history array into numbers */
const parseHistory = (raw: any): number[] => {
  let arr: any[] = [];
  if (Array.isArray(raw)) arr = raw;
  else if (typeof raw === 'string') { try { arr = JSON.parse(raw); } catch { arr = []; } }
  return arr.map((v: any) => (typeof v === 'number' ? v : parseFloat(String(v)))).filter((v: number) => !isNaN(v));
};

/** Get date string for index in history array (last element = today) */
const dateForIndex = (i: number, total: number, fmt = 'MMM dd'): string => {
  return format(subDays(new Date(), total - 1 - i), fmt);
};
const fullDateForIndex = (i: number, total: number): string => {
  return format(subDays(new Date(), total - 1 - i), 'MMM dd, yyyy');
};

const rankWindow = (allRanked: RankedProduct[], productId: string, windowSize = 6): RankedProduct[] => {
  const myIndex = allRanked.findIndex(r => r.product.id === productId);
  if (myIndex === -1) return allRanked.slice(0, windowSize);
  let start = Math.max(0, myIndex - 3);
  let end = start + windowSize;
  if (end > allRanked.length) { end = allRanked.length; start = Math.max(0, end - windowSize); }
  return allRanked.slice(start, end);
};

export function useVaultData(product: DeFiProduct | undefined, products: DeFiProduct[], isPrivateCredit = false) {
  const [timeframe, setTimeframe] = useState<'30D' | 'ALL'>('ALL');
  const [tvlTimeframe, setTvlTimeframe] = useState<'30D' | 'ALL'>('ALL');

  const marketStats = useMemo((): MarketStats | null => {
    if (!product || !products.length) return null;
    const sameAsset = products.filter(p => p.ticker === product.ticker);
    const avgApy = sameAsset.reduce((s, p) => s + p.spotAPY, 0) / sameAsset.length;
    const sorted = [...sameAsset].sort((a, b) => b.spotAPY - a.spotAPY);
    const rank = sorted.findIndex(p => p.id === product.id) + 1;
    const diffPercent = ((product.spotAPY - avgApy) / (avgApy || 1)) * 100;
    return { avgApy, rank, totalInAsset: sameAsset.length, diffPercent, isAboveAverage: product.spotAPY > avgApy };
  }, [product, products]);

  const comparativeRankings = useMemo((): RankedProduct[] => {
    if (!product || !products.length) return [];
    const sameAsset = products.filter(p => p.ticker === product.ticker && (p.spotAPY ?? 0) > 0);
    const sorted = [...sameAsset].sort((a, b) => b.spotAPY - a.spotAPY);
    const allRanked = sorted.map((p, i) => {
      const c = p.curator && p.curator !== '-' ? p.curator : null;
      return { product: p, rank: i + 1, slug: getProductSlug(p) };
    });
    return rankWindow(allRanked, product.id);
  }, [product, products]);

  const sustainabilityMetrics = useMemo((): SustainabilityMetrics | null => {
    if (!product) return null;
    const history = product.dailyApyHistory || (product as any).spotApy30dHistory || [];
    const historyLength = Array.isArray(history) ? history.filter((v: any) => v != null && v > 0).length : 0;

    if (historyLength < 7) {
      return { score: null, status: 'Awaiting Data', description: '', deviation: 0, insufficientData: true, daysCollected: historyLength };
    }

    const ratio = product.spotAPY / (product.monthlyAPY || 1);
    const deviation = Math.abs(1 - ratio);
    let score = Math.max(10, Math.round(100 - (deviation * 120)));
    let status = '';
    let description = '';

    // Cap score for extreme deviations
    if (ratio > 1.5) score = Math.min(score, 32);
    if (ratio < 0.5) score = Math.min(score, 28);

    // 5-tier classification based on final score
    if (score >= 90) {
      status = 'Very Stable';
      description = `The 24h APY of ${product.spotAPY.toFixed(2)}% is nearly identical to the 30-day mean, with only a ${(deviation * 100).toFixed(1)}% variance. This level of consistency is uncommon in DeFi and reflects a mature, well-calibrated yield source with predictable returns.`;
    } else if (score >= 75) {
      status = 'Stable';
      description = `Current yield of ${product.spotAPY.toFixed(2)}% shows a ${(deviation * 100).toFixed(1)}% variance from the 30-day average, well within normal operating bands. The strategy demonstrates healthy yield generation with minor, expected fluctuations typical of actively managed positions.`;
    } else if (score >= 55) {
      status = 'Moderate';
      description = `Yield is ${ratio > 1 ? `${(ratio * 100 - 100).toFixed(1)}% above` : `${(100 - ratio * 100).toFixed(1)}% below`} the monthly average. This level of variance is common among active DeFi strategies and often reflects shifts in utilization rates, liquidity depth, or protocol incentive cycles.`;
    } else if (score >= 35) {
      status = 'Low Stability';
      description = `Yield has deviated meaningfully from its 30-day baseline, with a ${(deviation * 100).toFixed(1)}% gap between the current rate and the historical mean. This may indicate changing market conditions, a recent incentive adjustment, or a liquidity shift within the protocol.`;
    } else {
      status = 'Very Low Stability';
      description = `An extreme ${(deviation * 100).toFixed(1)}% deviation from the historical average suggests the current yield level, whether a sharp spike or a steep decline, is unlikely to persist. This pattern is often driven by temporary incentive programs, one-off events, or rapid capital reallocation.`;
    }

    return { score, status, description, deviation };
  }, [product]);

  const contextAnalysis = useMemo((): ContextAnalysis | null => {
    if (!product || !products.length) return null;
    const networkPeers = products.filter(p => p.network === product.network && p.ticker === product.ticker);
    const platformPeers = products.filter(p => p.platform_name === product.platform_name && p.ticker === product.ticker);
    const netAvg = networkPeers.reduce((s, p) => s + p.spotAPY, 0) / networkPeers.length;
    const platAvg = platformPeers.reduce((s, p) => s + p.spotAPY, 0) / platformPeers.length;
    return {
      netAvg, platAvg,
      netCount: networkPeers.length, platCount: platformPeers.length,
      isBestOnNetwork: networkPeers.every(p => product.spotAPY >= p.spotAPY),
      isMostLiquidOnPlatform: platformPeers.every(p => product.tvl >= p.tvl),
      netDiff: ((product.spotAPY - netAvg) / (netAvg || 1)) * 100,
    };
  }, [product, products]);

  const networkRankings = useMemo((): RankedProduct[] => {
    if (!product || !products.length) return [];
    const peers = products.filter(p => p.network === product.network && p.ticker === product.ticker && (p.spotAPY ?? 0) > 0);
    const sorted = [...peers].sort((a, b) => b.spotAPY - a.spotAPY);
    const allRanked = sorted.map((p, i) => {
      const c = p.curator && p.curator !== '-' ? p.curator : null;
      return { product: p, rank: i + 1, slug: getProductSlug(p) };
    });
    return rankWindow(allRanked, product.id);
  }, [product, products]);

  const historyStats = useMemo((): HistoryStats | null => {
    if (!product) return null;
    const valid = (Array.isArray(product.dailyApyHistory) ? product.dailyApyHistory : [])
      .map(v => typeof v === 'number' ? v : parseFloat(String(v)))
      .filter(v => !isNaN(v) && v > 0);
    if (valid.length < 3) return null;

    const min = Math.min(...valid);
    const max = Math.max(...valid);
    const avg = valid.reduce((s, v) => s + v, 0) / valid.length;
    const variance = valid.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / valid.length;
    const stdDev = Math.sqrt(variance);
    const third = Math.max(1, Math.floor(valid.length / 3));
    const earlyAvg = valid.slice(0, third).reduce((s, v) => s + v, 0) / third;
    const recentAvg = valid.slice(-third).reduce((s, v) => s + v, 0) / third;
    const trendPct = ((recentAvg - earlyAvg) / (earlyAvg || 1)) * 100;
    const trendDirection: 'upward' | 'downward' | 'stable' = trendPct > 5 ? 'upward' : trendPct < -5 ? 'downward' : 'stable';
    const volatility: 'Low' | 'Moderate' | 'High' = stdDev < 0.5 ? 'Low' : stdDev < 2 ? 'Moderate' : 'High';

    return { min, max, avg, stdDev, trendPct, trendDirection, earlyAvg, recentAvg, volatility, dataPoints: valid.length };
  }, [product]);

  const tvlStats = useMemo((): TvlStats | null => {
    if (!product) return null;
    const valid = (Array.isArray(product.tvlHistory) ? product.tvlHistory : [])
      .map((v: any) => typeof v === 'number' ? v : parseFloat(String(v)))
      .filter((v: number) => !isNaN(v) && v > 0);
    if (valid.length < 3) return null;

    const min = Math.min(...valid);
    const max = Math.max(...valid);
    const avg = valid.reduce((s: number, v: number) => s + v, 0) / valid.length;
    const variance = valid.reduce((s: number, v: number) => s + Math.pow(v - avg, 2), 0) / valid.length;
    const stdDev = Math.sqrt(variance);
    const third = Math.max(1, Math.floor(valid.length / 3));
    const earlyAvg = valid.slice(0, third).reduce((s: number, v: number) => s + v, 0) / third;
    const recentAvg = valid.slice(-third).reduce((s: number, v: number) => s + v, 0) / third;
    const trendPct = ((recentAvg - earlyAvg) / (earlyAvg || 1)) * 100;
    const trendDirection: 'growing' | 'declining' | 'stable' = trendPct > 5 ? 'growing' : trendPct < -5 ? 'declining' : 'stable';
    const netChange = valid[valid.length - 1] - valid[0];
    const netChangePct = ((valid[valid.length - 1] - valid[0]) / (valid[0] || 1)) * 100;

    return { min, max, avg, stdDev, trendPct, trendDirection, earlyAvg, recentAvg, netChange, netChangePct, dataPoints: valid.length };
  }, [product]);

  const yieldTrajectory = useMemo((): YieldTrajectory | null => {
    if (!product) return null;
    const raw = parseHistory(product.dailyApyHistory || (product as any).spotApy30dHistory);
    const valid = raw.filter(v => v >= 0);
    if (valid.length < 7) return null;

    const last30 = valid.slice(-30);
    const total = last30.length;

    // Streak
    let streakCount = 1;
    let streakDir: 'upward' | 'downward' | 'flat' = 'flat';
    for (let i = last30.length - 1; i > 0; i--) {
      const diff = last30[i] - last30[i - 1];
      const curDir: 'upward' | 'downward' | 'flat' = diff > 0.001 ? 'upward' : diff < -0.001 ? 'downward' : 'flat';
      if (i === last30.length - 1) { streakDir = curDir; streakCount = 1; }
      else if (curDir === streakDir) streakCount++;
      else break;
    }

    const daysPositive = last30.filter(v => v > 0).length;
    const daysAbove10pct = last30.filter(v => v > 10).length;
    const daysAtZero = last30.filter(v => v === 0 || v < 0.001).length;

    // Weekly averages
    const weeklyAverages: YieldTrajectory['weeklyAverages'] = [];
    for (let w = 0; w < 4 && w * 7 < last30.length; w++) {
      const start = w * 7;
      const end = Math.min(start + 7, last30.length);
      const slice = last30.slice(start, end);
      if (slice.length === 0) continue;
      const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
      weeklyAverages.push({
        avg,
        startDate: dateForIndex(valid.length - total + start, valid.length),
        endDate: dateForIndex(valid.length - total + end - 1, valid.length),
      });
    }

    const wowChange = weeklyAverages.length >= 2
      ? ((weeklyAverages[weeklyAverages.length - 1].avg - weeklyAverages[weeklyAverages.length - 2].avg) / (weeklyAverages[weeklyAverages.length - 2].avg || 1)) * 100
      : 0;

    const bestWeek = weeklyAverages.length > 0 ? weeklyAverages.reduce((best, w) => w.avg > best.avg ? w : best, weeklyAverages[0]) : null;
    const worstWeek = weeklyAverages.length > 0 ? weeklyAverages.reduce((worst, w) => w.avg < worst.avg ? w : worst, weeklyAverages[0]) : null;

    const avg30d = last30.reduce((s, v) => s + v, 0) / total;
    const currentVs30dAvg = ((product.spotAPY - avg30d) / (avg30d || 1)) * 100;

    // Consecutive weeks analysis
    let consecutiveWeeksCount = 0;
    let consecutiveWeeksDirection: 'improved' | 'declined' | 'fluctuated' | 'stable' = 'stable';
    if (weeklyAverages.length > 1) {
      let prevAvg = weeklyAverages[0].avg;
      for (let i = 1; i < weeklyAverages.length; i++) {
        const currentAvg = weeklyAverages[i].avg;
        if (currentAvg > prevAvg) {
          if (consecutiveWeeksDirection === 'declined') {
            consecutiveWeeksCount = 1;
          } else {
            consecutiveWeeksCount++;
          }
          consecutiveWeeksDirection = 'improved';
        } else if (currentAvg < prevAvg) {
          if (consecutiveWeeksDirection === 'improved') {
            consecutiveWeeksCount = 1;
          } else {
            consecutiveWeeksCount++;
          }
          consecutiveWeeksDirection = 'declined';
        } else {
          if (consecutiveWeeksDirection === 'stable') {
            consecutiveWeeksCount++;
          } else {
            consecutiveWeeksCount = 1;
          }
          consecutiveWeeksDirection = 'stable';
        }
        prevAvg = currentAvg;
      }
    }

    return {
      streakCount, streakDirection: streakDir,
      streakStartApy: last30[last30.length - streakCount] ?? last30[0],
      streakEndApy: last30[last30.length - 1],
      daysPositive, totalDays: total,
      daysAbove10pct, daysAtZero,
      weeklyAverages, wowChange,
      bestWeek, worstWeek,
      currentVs30dAvg,
      consecutiveWeeksCount,
      consecutiveWeeksDirection,
    };
  }, [product]);

  const capitalFlows = useMemo((): CapitalFlows | null => {
    if (!product) return null;
    const raw = parseHistory(product.tvlHistory);
    if (raw.length < 7) return null;

    const last30 = raw.slice(-30);
    const total = last30.length;

    const tvlToday = last30[last30.length - 1];
    const tvl7dAgo = last30.length >= 7 ? last30[last30.length - 7] : last30[0];
    const tvl30dAgo = last30[0];

    const tvl7dChangeAbs = tvlToday - tvl7dAgo;
    const tvl7dChangePct = ((tvlToday - tvl7dAgo) / (tvl7dAgo || 1)) * 100;
    const tvl30dChangeAbs = tvlToday - tvl30dAgo;
    const tvl30dChangePct = ((tvlToday - tvl30dAgo) / (tvl30dAgo || 1)) * 100;

    let maxIdx = 0, minIdx = 0;
    for (let i = 1; i < last30.length; i++) {
      if (last30[i] > last30[maxIdx]) maxIdx = i;
      if (last30[i] < last30[minIdx]) minIdx = i;
    }

    let inflowDays = 0, outflowDays = 0;
    let largestInflow = 0, largestOutflow = 0;
    let largestInflowIdx = 0, largestOutflowIdx = 0;

    for (let i = 1; i < last30.length; i++) {
      const delta = last30[i] - last30[i - 1];
      if (delta > 0) {
        inflowDays++;
        if (delta > largestInflow) { largestInflow = delta; largestInflowIdx = i; }
      } else if (delta < 0) {
        outflowDays++;
        if (Math.abs(delta) > largestOutflow) { largestOutflow = Math.abs(delta); largestOutflowIdx = i; }
      }
    }

    const offset = raw.length - total;
    return {
      tvl7dChangeAbs, tvl7dChangePct,
      tvl30dChangeAbs, tvl30dChangePct,
      tvlMax30d: last30[maxIdx],
      tvlMin30d: last30[minIdx],
      tvlMaxDate: fullDateForIndex(offset + maxIdx, raw.length),
      tvlMinDate: fullDateForIndex(offset + minIdx, raw.length),
      inflowDays, outflowDays,
      largestInflow,
      largestInflowDate: fullDateForIndex(offset + largestInflowIdx, raw.length),
      largestOutflow,
      largestOutflowDate: fullDateForIndex(offset + largestOutflowIdx, raw.length),
      totalDays: total,
      inflowDays7d: (() => {
        const last7 = last30.slice(-7);
        let count = 0;
        for (let i = 1; i < last7.length; i++) {
          if (last7[i] > last7[i - 1]) count++;
        }
        return count;
      })(),
    };
  }, [product]);

  const yieldTvlCorrelation = useMemo((): YieldTvlCorrelation | null => {
    if (!product) return null;
    const apyRaw = parseHistory(product.dailyApyHistory || (product as any).spotApy30dHistory);
    const tvlRaw = parseHistory(product.tvlHistory);
    if (apyRaw.length < 7 || tvlRaw.length < 7) return null;

    const apy30 = apyRaw.slice(-30);
    const tvl30 = tvlRaw.slice(-30);

    const apyDir = sign(apy30[apy30.length - 1] - apy30[0]);
    const tvlDir = sign(tvl30[tvl30.length - 1] - tvl30[0]);

    let insight: string;
    let icon: string;

    // ── Private credit override: TVL-only variants ──
    if (isPrivateCredit) {
      if (tvlDir > 0) {
        insight = `Capital is flowing into this fixed-rate product, suggesting investor confidence in the contractual yield of ${product.spotAPY.toFixed(2)}%.`;
        icon = '\u2197';
      } else if (tvlDir < 0) {
        insight = `Capital is flowing out despite a stable fixed rate of ${product.spotAPY.toFixed(2)}%. This may reflect broader portfolio rebalancing or maturity-related withdrawals.`;
        icon = '\u2198';
      } else {
        insight = `Capital levels have remained stable alongside the fixed ${product.spotAPY.toFixed(2)}% yield, indicating a balanced inflow-outflow dynamic.`;
        icon = '\u2192';
      }
      return { apyDirection: 0, tvlDirection: tvlDir, insight, icon };
    }

    if (apyDir > 0 && tvlDir > 0) {
      insight = 'Rising yields have attracted capital, with both APY and TVL trending upward over the past 30 days.';
      icon = '\u2197\u2197';
    } else if (apyDir > 0 && tvlDir < 0) {
      insight = 'Despite rising yields, capital has been flowing out. This may indicate concerns about sustainability or broader market rotation.';
      icon = '\u2197\u2198';
    } else if (apyDir < 0 && tvlDir > 0) {
      insight = 'Yields are declining as more capital enters the vault, a common dynamic where increased deposits dilute per-depositor returns.';
      icon = '\u2198\u2197';
    } else if (apyDir < 0 && tvlDir < 0) {
      insight = 'Both yield and TVL are declining, and depositors may be exiting in response to falling returns.';
      icon = '\u2198\u2198';
    } else {
      insight = 'Yield and TVL have remained relatively stable over the past 30 days, suggesting a balanced equilibrium between capital and returns.';
      icon = '\u2192\u2192';
    }

    return { apyDirection: apyDir, tvlDirection: tvlDir, insight, icon };
  }, [product, isPrivateCredit]);

  const expandedApyStats = useMemo((): ExpandedApyStats | null => {
    if (!product) return null;
    const raw = parseHistory(product.dailyApyHistory || (product as any).spotApy30dHistory);
    const valid = raw.filter(v => v > 0);
    if (valid.length < 3) return null;

    const last30 = valid.slice(-30);
    const avg = last30.reduce((s, v) => s + v, 0) / last30.length;
    const med = median(last30);
    const daysAboveAvg = last30.filter(v => v > avg).length;

    let bestIdx = 0, worstIdx = 0;
    for (let i = 1; i < last30.length; i++) {
      if (last30[i] > last30[bestIdx]) bestIdx = i;
      if (last30[i] < last30[worstIdx]) worstIdx = i;
    }

    // Percentile among all same-ticker vaults
    const sameAsset = products.filter(p => p.ticker === product.ticker);
    const allAvgs = sameAsset.map(p => p.monthlyAPY || p.spotAPY).sort((a, b) => a - b);
    const myAvg = product.monthlyAPY || product.spotAPY;
    const below = allAvgs.filter(a => a < myAvg).length;
    const percentile = Math.round((below / (allAvgs.length || 1)) * 100);

    const offset = valid.length - last30.length;
    return {
      median: med,
      daysAboveAvg,
      bestDayApy: last30[bestIdx],
      bestDayDate: fullDateForIndex(offset + bestIdx, valid.length),
      worstDayApy: last30[worstIdx],
      worstDayDate: fullDateForIndex(offset + worstIdx, valid.length),
      percentile,
      apyRange: last30[bestIdx] - last30[worstIdx],
      totalDays: last30.length,
    };
  }, [product, products]);

  const expandedTvlStats = useMemo((): ExpandedTvlStats | null => {
    if (!product) return null;
    const raw = parseHistory(product.tvlHistory);
    if (raw.length < 3) return null;

    const last30 = raw.slice(-30);
    const med = median(last30);
    const apy30d = product.monthlyAPY || product.spotAPY;
    const tvlPerApyPoint = apy30d > 0 ? product.tvl / apy30d : 0;

    let inflowDays = 0, outflowDays = 0;
    let largestInflow = 0, largestOutflow = 0;
    let liIdx = 0, loIdx = 0;

    for (let i = 1; i < last30.length; i++) {
      const delta = last30[i] - last30[i - 1];
      if (delta > 0) {
        inflowDays++;
        if (delta > largestInflow) { largestInflow = delta; liIdx = i; }
      } else if (delta < 0) {
        outflowDays++;
        if (Math.abs(delta) > largestOutflow) { largestOutflow = Math.abs(delta); loIdx = i; }
      }
    }

    const offset = raw.length - last30.length;
    return {
      median: med,
      tvlPerApyPoint,
      inflowDays, outflowDays,
      largestInflow,
      largestInflowDate: fullDateForIndex(offset + liIdx, raw.length),
      largestOutflow,
      largestOutflowDate: fullDateForIndex(offset + loIdx, raw.length),
      totalDays: last30.length,
    };
  }, [product, products]);

  const alternativeStrategies = useMemo(() => {
    if (!product || !products.length) return [];
    return products
      .filter(p => p.ticker.toLowerCase() === product.ticker.toLowerCase() && p.id !== product.id && (p.spotAPY ?? 0) > 0)
      .sort((a, b) => b.spotAPY - a.spotAPY)
      .slice(0, 4);
  }, [product, products]);

  const tvlRank = useMemo(() => {
    if (!product || !products.length) return null;
    const sameAsset = products.filter(p => p.ticker.toLowerCase() === product.ticker.toLowerCase());
    const sorted = [...sameAsset].sort((a, b) => b.tvl - a.tvl);
    const rank = sorted.findIndex(p => p.id === product.id) + 1;
    const avgTvl = sameAsset.reduce((s, p) => s + p.tvl, 0) / sameAsset.length;
    const medianTvl = median(sameAsset.map(p => p.tvl));
    return { rank, total: sameAsset.length, avgTvl, medianTvl };
  }, [product, products]);

  const networkTvlRank = useMemo(() => {
    if (!product || !products.length) return null;
    const peers = products.filter(p =>
      p.ticker.toLowerCase() === product.ticker.toLowerCase() &&
      p.network === product.network
    );
    if (peers.length < 2) return null;
    const sorted = [...peers].sort((a, b) => b.tvl - a.tvl);
    const rank = sorted.findIndex(p => p.id === product.id) + 1;
    return { networkTvlRank: rank, networkTvlTotal: peers.length };
  }, [product, products]);

  const faqItems = useMemo(() => {
    if (!product) return [];
    const items: { question: string; answer: string; category: string }[] = [];

    items.push({
      category: 'Yield & Performance',
      question: `What is the current APY of ${product.product_name}?`,
      answer: isPrivateCredit
        ? `${product.product_name} offers a fixed yield of ${product.spotAPY.toFixed(2)}% on ${product.ticker}. As a private credit instrument, this rate is contractually set and remains constant regardless of market conditions. The 24-hour, 7-day, and 30-day APY readings all reflect this same fixed rate.`
        : `${product.product_name} on ${product.platform_name} offers a 24-hour APY of ${product.spotAPY.toFixed(2)}%, a 7-day average of ${(product.weeklyAPY || product.spotAPY * 0.98).toFixed(2)}%, and a 30-day average of ${product.monthlyAPY.toFixed(2)}% on ${product.ticker}. Yields are variable and update daily based on protocol activity.`,
    });

    items.push({
      category: 'Strategy & Access',
      question: `What blockchain is ${product.product_name} on?`,
      answer: `${product.product_name} operates on the ${product.network} network and is managed by ${product.platform_name}. It accepts ${product.ticker} deposits.${product.curator && product.curator !== '-' ? ` The strategy is curated by ${product.curator}.` : ''}`,
    });

    items.push({
      category: 'Liquidity & TVL',
      question: `How much is deposited in ${product.product_name}?`,
      answer: `${product.product_name} currently has a total value locked (TVL) of ${formatTVL(product.tvl)} in ${product.ticker} deposits. TVL reflects the total capital allocated to this strategy by all depositors.`,
    });

    if (marketStats) {
      const direction = marketStats.isAboveAverage ? 'above' : 'below';
      const standardCompare = `${product.product_name} ranks #${marketStats.rank} out of ${marketStats.totalInAsset} monitored ${product.ticker} strategies across all chains. Its current yield of ${product.spotAPY.toFixed(2)}% is ${Math.abs(marketStats.diffPercent).toFixed(1)}% ${direction} the market average of ${marketStats.avgApy.toFixed(2)}%.`;
      items.push({
        category: 'Yield & Performance',
        question: `How does ${product.product_name} compare to other ${product.ticker} yield strategies?`,
        answer: isPrivateCredit
          ? `${standardCompare} Note that ${product.product_name} is a private credit product with a fixed rate, while most competing strategies have variable yields that fluctuate with market conditions.`
          : standardCompare,
      });
    }

    if (sustainabilityMetrics && !sustainabilityMetrics.insufficientData) {
      items.push({
        category: 'Yield & Performance',
        question: `Is the yield on ${product.product_name} sustainable?`,
        answer: isPrivateCredit
          ? `${product.product_name} has a sustainability score of 100 out of 100, reflecting its fixed-rate structure. As a private credit instrument, the ${product.spotAPY.toFixed(2)}% yield is contractually set and does not depend on DeFi market dynamics. The primary risk factor is counterparty risk, the borrower's ability to honor the agreed rate.`
          : `Earnbase rates the yield sustainability of ${product.product_name} at ${sustainabilityMetrics.score}/100, classified as "${sustainabilityMetrics.status}". ${sustainabilityMetrics.description}`,
      });
    }

    items.push({
      category: 'Strategy & Access',
      question: `How do I deposit into ${product.product_name}?`,
      answer: `To deposit into ${product.product_name}, you need ${product.ticker} tokens on the ${product.network} network. Visit the ${product.platform_name} platform directly to connect your wallet and make a deposit. Always verify the contract address and review the strategy's risk profile before committing capital.`,
    });

    if (contextAnalysis) {
      const isBest = contextAnalysis.isBestOnNetwork;
      items.push({
        category: 'Strategy & Access',
        question: `Is ${product.product_name} the best ${product.ticker} yield on ${product.network}?`,
        answer: isBest
          ? `Yes, ${product.product_name} offers the highest ${product.ticker} yield on ${product.network} at ${product.spotAPY.toFixed(2)}% APY, leading ${contextAnalysis.netCount - 1} other tracked ${product.ticker} strateg${contextAnalysis.netCount - 1 === 1 ? 'y' : 'ies'} on the same network. Rankings update daily.`
          : `Currently, ${product.product_name} ranks among ${contextAnalysis.netCount} monitored ${product.ticker} strategies on ${product.network}. Its yield of ${product.spotAPY.toFixed(2)}% is ${Math.abs(contextAnalysis.netDiff).toFixed(1)}% ${contextAnalysis.netDiff >= 0 ? 'above' : 'below'} the ${product.network} average of ${contextAnalysis.netAvg.toFixed(2)}%.`,
      });
    }

    // ➑ Enhanced FAQ with trajectory data
    const pcTrendAnswer = `${product.product_name} maintains a constant APY of ${product.spotAPY.toFixed(2)}% as a private credit instrument. There is no upward or downward trend, the rate is fixed by contract.`;
    const pcVolAnswer = `${product.product_name} has near-zero yield volatility. As a fixed-rate private credit product, the ${product.spotAPY.toFixed(2)}% yield does not fluctuate with market supply and demand. Any minor recorded variation reflects data-recording timing, not actual rate changes.`;
    if (historyStats && yieldTrajectory) {
      items.push({
        category: 'Yield & Performance',
        question: `What is the APY trend for ${product.product_name}?`,
        answer: isPrivateCredit ? pcTrendAnswer : `Over the past ${historyStats.dataPoints} days, ${product.product_name} has shown ${historyStats.trendDirection === 'upward' ? 'an upward' : historyStats.trendDirection === 'downward' ? 'a downward' : 'a stable'} yield trajectory. The average APY moved from ${historyStats.earlyAvg.toFixed(2)}% in the earlier period to ${historyStats.recentAvg.toFixed(2)}% in the most recent period, a ${Math.abs(historyStats.trendPct).toFixed(1)}% ${historyStats.trendPct >= 0 ? 'increase' : 'decrease'}. The vault is on a ${yieldTrajectory.streakCount}-day ${yieldTrajectory.streakDirection} streak.`,
      });

      items.push({
        category: 'Yield & Performance',
        question: `How volatile is the yield on ${product.product_name}?`,
        answer: isPrivateCredit ? pcVolAnswer : `The yield volatility of ${product.product_name}, measured by standard deviation over ${historyStats.dataPoints} days, is ${historyStats.stdDev.toFixed(2)} percentage points. This indicates ${historyStats.volatility.toLowerCase()} variability, with yields ranging from a low of ${historyStats.min.toFixed(2)}% to a high of ${historyStats.max.toFixed(2)}%. ${historyStats.volatility === 'Low' ? 'The narrow range suggests a highly predictable yield environment.' : historyStats.volatility === 'Moderate' ? 'The moderate range reflects normal DeFi market dynamics and shifting liquidity conditions.' : 'The wide range indicates significant yield swings, often driven by large capital inflows/outflows or protocol incentive changes.'}`,
      });
    } else if (historyStats) {
      items.push({
        category: 'Yield & Performance',
        question: `What is the APY trend for ${product.product_name}?`,
        answer: isPrivateCredit ? pcTrendAnswer : `Over the past ${historyStats.dataPoints} days, ${product.product_name} has shown ${historyStats.trendDirection === 'upward' ? 'an upward' : historyStats.trendDirection === 'downward' ? 'a downward' : 'a stable'} yield trajectory. The average APY moved from ${historyStats.earlyAvg.toFixed(2)}% to ${historyStats.recentAvg.toFixed(2)}%, a ${Math.abs(historyStats.trendPct).toFixed(1)}% ${historyStats.trendPct >= 0 ? 'increase' : 'decrease'}. The 30-day average APY is ${historyStats.avg.toFixed(2)}%.`,
      });
      items.push({
        category: 'Yield & Performance',
        question: `How volatile is the yield on ${product.product_name}?`,
        answer: isPrivateCredit ? pcVolAnswer : `The yield volatility of ${product.product_name}, measured by standard deviation over ${historyStats.dataPoints} days, is ${historyStats.stdDev.toFixed(2)} percentage points. This indicates ${historyStats.volatility.toLowerCase()} variability, with yields ranging from a low of ${historyStats.min.toFixed(2)}% to a high of ${historyStats.max.toFixed(2)}%.`,
      });
    }

    if (tvlRank && tvlRank.total > 1) {
      const tvlDirection = product.tvl > tvlRank.avgTvl ? 'above' : 'below';
      items.push({
        category: 'Liquidity & TVL',
        question: `How does ${product.product_name}'s TVL compare to other ${product.ticker} vaults?`,
        answer: `With ${formatTVL(product.tvl)} in total value locked, ${product.product_name} ranks #${tvlRank.rank} out of ${tvlRank.total} tracked ${product.ticker} strategies by liquidity depth. The median TVL for ${product.ticker} vaults is ${formatTVL(tvlRank.medianTvl)}. This vault's TVL is ${tvlDirection} the market average of ${formatTVL(tvlRank.avgTvl)}, indicating ${tvlDirection === 'above' ? 'strong depositor confidence and robust liquidity' : 'a smaller but potentially more agile pool with room for growth'}.`,
      });
    }

    if (networkTvlRank) {
      const tvlDirection = tvlRank && product.tvl > tvlRank.avgTvl ? 'above' : 'below';
      items.push({
        category: 'Liquidity & TVL',
        question: `How does ${product.product_name}'s TVL compare to other ${product.ticker} vaults on ${product.network}?`,
        answer: `With ${formatTVL(product.tvl)} in total value locked, ${product.product_name} ranks #${networkTvlRank.networkTvlRank} out of ${networkTvlRank.networkTvlTotal} tracked ${product.ticker} strategies on ${product.network} by liquidity depth.${tvlRank ? ` This vault's TVL is ${tvlDirection} the market average of ${formatTVL(tvlRank.avgTvl)}, indicating ${tvlDirection === 'above' ? 'strong depositor confidence and robust liquidity' : 'a smaller but potentially more agile pool with room for growth'}.` : ''}`,
      });
    }

    if (tvlStats && capitalFlows) {
      items.push({
        category: 'Liquidity & TVL',
        question: `Is ${product.product_name}'s TVL growing or declining?`,
        answer: `Over the past ${capitalFlows.totalDays} days, ${product.product_name} TVL has ${capitalFlows.tvl30dChangePct >= 0 ? 'increased' : 'decreased'} by ${Math.abs(capitalFlows.tvl30dChangePct).toFixed(1)}%, from ${formatTVL(capitalFlows.tvl30dChangeAbs >= 0 ? product.tvl - capitalFlows.tvl30dChangeAbs : product.tvl + Math.abs(capitalFlows.tvl30dChangeAbs))} to ${formatTVL(product.tvl)}. Capital ${capitalFlows.inflowDays >= capitalFlows.outflowDays ? 'inflows' : 'outflows'} were observed on ${capitalFlows.inflowDays} out of ${capitalFlows.totalDays - 1} days.`,
      });
    } else if (tvlStats) {
      const tvlTrendWord = tvlStats.trendDirection === 'growing' ? 'an upward' : tvlStats.trendDirection === 'declining' ? 'a downward' : 'a stable';
      items.push({
        category: 'Liquidity & TVL',
        question: `Is ${product.product_name}'s TVL growing or declining?`,
        answer: `Over the past ${tvlStats.dataPoints} days, ${product.product_name} has shown ${tvlTrendWord} TVL trajectory. Average liquidity moved from ${formatTVL(tvlStats.earlyAvg)} to ${formatTVL(tvlStats.recentAvg)}, a ${Math.abs(tvlStats.trendPct).toFixed(1)}% ${tvlStats.trendPct >= 0 ? 'increase' : 'decrease'}.`,
      });
    }

    // New FAQ: Yield-TVL correlation
    if (yieldTvlCorrelation) {
      items.push({
        category: 'Liquidity & TVL',
        question: `What is the relationship between yield and TVL for ${product.product_name}?`,
        answer: isPrivateCredit
          ? `Since ${product.product_name} has a fixed yield of ${product.spotAPY.toFixed(2)}%, TVL movements are driven entirely by depositor behavior rather than yield changes. ${yieldTvlCorrelation.insight}`
          : `${yieldTvlCorrelation.insight} This 30-day dynamic is an important factor when evaluating whether current yield levels are likely to persist as capital allocation shifts.`,
      });
    }

    // New FAQ: Capital flows
    if (capitalFlows) {
      items.push({
        category: 'Liquidity & TVL',
        question: `What are the recent capital flows for ${product.product_name}?`,
        answer: `Over the past ${capitalFlows.totalDays} days, ${product.product_name} experienced a net ${capitalFlows.tvl30dChangePct >= 0 ? 'inflow' : 'outflow'} of ${formatTVL(Math.abs(capitalFlows.tvl30dChangeAbs))}. The vault saw capital inflows on ${capitalFlows.inflowDays} days and outflows on ${capitalFlows.outflowDays} days. The largest single-day inflow was ${formatTVL(capitalFlows.largestInflow)}${capitalFlows.largestOutflow > 0 ? `, while the largest outflow was ${formatTVL(capitalFlows.largestOutflow)}` : ''}.`,
      });
    }

    // FAQ #14: Fees
    items.push({
      category: 'Strategy & Access',
      question: `What are the fees for ${product.product_name}?`,
      answer: `${product.product_name} is deployed on ${product.platform_name}'s vault infrastructure. Fee structures are set at the protocol and curator level. Consult the vault directly for current performance and management fee rates.`,
    });

    // FAQ #15: What is {platform}?
    items.push({
      category: 'Strategy & Access',
      question: `What is ${product.platform_name}?`,
      answer: `${product.platform_name} is the DeFi protocol infrastructure that ${product.product_name} operates on. It provides the smart contract layer for deposits, withdrawals, and strategy execution on the ${product.network} network.`,
    });

    // FAQ #16: Counterparty risk (private credit only)
    if (isPrivateCredit) {
      items.push({
        category: 'Strategy & Access',
        question: `What is the counterparty risk for ${product.product_name}?`,
        answer: `${product.product_name} is a private credit instrument where yield is generated from a borrower's contractual obligation to pay ${product.spotAPY.toFixed(2)}% on deposited ${product.ticker}. The primary risk is counterparty risk, the possibility that the borrower fails to meet their payment obligations. This differs from smart-contract-based DeFi yield where risk stems from protocol mechanics.`,
      });
    }

    return items;
  }, [product, marketStats, sustainabilityMetrics, contextAnalysis, historyStats, tvlRank, tvlStats, yieldTrajectory, capitalFlows, yieldTvlCorrelation, networkTvlRank, isPrivateCredit]);

  const buildSeoData = useMemo(() => {
    if (!product) return null;
    const curator = product.curator && product.curator !== '-' ? product.curator : null;
    const slug = getProductSlug(product);
    const hubCount = products.filter(p => p && (p.ticker || '').toUpperCase() === product.ticker.toUpperCase()).length;
    const vault = vaultProductSEO(product.product_name, product.platform_name, product.ticker, product.network, product.spotAPY, formatTVL(product.tvl), slug, curator, hubCount);
    const sd = vault.buildStructuredData(faqItems) as any;

    // Inject additionalProperty into FinancialProduct
    const fp = sd['@graph']?.find((n: any) => n['@type'] === 'FinancialProduct');
    if (fp) {
      const props: any[] = [];
      if (yieldTrajectory) {
        props.push({ '@type': 'PropertyValue', name: 'Yield Streak', value: `${yieldTrajectory.streakCount}-day ${yieldTrajectory.streakDirection}` });
        props.push({ '@type': 'PropertyValue', name: 'Days With Positive Yield (30D)', value: `${yieldTrajectory.daysPositive}/${yieldTrajectory.totalDays}` });
        if (yieldTrajectory.weeklyAverages.length >= 2) {
          props.push({ '@type': 'PropertyValue', name: 'Weekly APY Trend', value: `${yieldTrajectory.consecutiveWeeksDirection} for ${yieldTrajectory.consecutiveWeeksCount} consecutive week(s)` });
        }
      }
      if (expandedApyStats) {
        props.push({ '@type': 'PropertyValue', name: 'Median APY (30D)', value: `${expandedApyStats.median.toFixed(2)}%` });
        props.push({ '@type': 'PropertyValue', name: 'Best Day APY (30D)', value: `${expandedApyStats.bestDayApy.toFixed(2)}% on ${expandedApyStats.bestDayDate}` });
        props.push({ '@type': 'PropertyValue', name: 'Worst Day APY (30D)', value: `${expandedApyStats.worstDayApy.toFixed(2)}% on ${expandedApyStats.worstDayDate}` });
        props.push({ '@type': 'PropertyValue', name: 'APY Percentile', value: `${expandedApyStats.percentile}th among all ${product.ticker.toUpperCase()} vaults` });
      }
      if (capitalFlows) {
        props.push({ '@type': 'PropertyValue', name: '30D Net TVL Change', value: `${capitalFlows.tvl30dChangePct.toFixed(1)}%` });
        props.push({ '@type': 'PropertyValue', name: 'Capital Inflow Days (30D)', value: `${capitalFlows.inflowDays}/${capitalFlows.totalDays}` });
      }
      if (expandedTvlStats) {
        props.push({ '@type': 'PropertyValue', name: 'TVL per APY Point', value: formatTVL(expandedTvlStats.tvlPerApyPoint) });
      }
      if (yieldTvlCorrelation) {
        props.push({ '@type': 'PropertyValue', name: 'Yield-TVL Dynamic', value: yieldTvlCorrelation.insight.split('. ')[0] });
      }
      if (networkRankings.length > 0) {
        const myRank = networkRankings.find(r => r.product.id === product.id);
        if (myRank) {
          const totalNetPeers = Math.max(...networkRankings.map(r => r.rank), networkRankings.length);
          props.push({ '@type': 'PropertyValue', name: `Network Rank (${product.ticker.toUpperCase()} on ${product.network})`, value: `#${myRank.rank} of ${totalNetPeers}` });
        }
      }
      if (networkTvlRank) {
        props.push({ '@type': 'PropertyValue', name: `Network TVL Rank (${product.ticker.toUpperCase()} on ${product.network})`, value: `#${networkTvlRank.networkTvlRank} of ${networkTvlRank.networkTvlTotal}` });
      }
      // Private credit schema additions
      if (isPrivateCredit) {
        // Remove standard "Rate Type" if present
        const existingRateIdx = props.findIndex((p: any) => p.name === 'Rate Type');
        if (existingRateIdx >= 0) props.splice(existingRateIdx, 1);
        props.push({ '@type': 'PropertyValue', name: 'Rate Type', value: 'Fixed rate (private credit)' });
        props.push({ '@type': 'PropertyValue', name: 'Yield Source', value: 'Contractual borrower obligation' });
        props.push({ '@type': 'PropertyValue', name: 'Counterparty Risk', value: 'Present, yield depends on borrower solvency' });
      }
      if (props.length > 0) fp.additionalProperty = props;
    }

    if (alternativeStrategies.length > 0) {
      const items = alternativeStrategies.map((p, i) => {
        const altCurator = p.curator && p.curator !== '-' ? p.curator : null;
        const altSlug = getProductSlug(p);
        return { '@type': 'ListItem', position: i + 1, name: `${p.product_name} (${p.platform_name})`, url: `https://earnbase.finance/vault/${altSlug}` };
      });
      sd['@graph'].push({ '@type': 'ItemList', name: `Alternative ${product.ticker.toUpperCase()} DeFi Vaults`, numberOfItems: items.length, itemListElement: items });
    }

    return { title: vault.title, description: vault.description, structuredData: sd, ogImage: ogImageUrl.vault(slug) };
  }, [product, faqItems, alternativeStrategies, yieldTrajectory, expandedApyStats, capitalFlows, expandedTvlStats, yieldTvlCorrelation, networkRankings, networkTvlRank, isPrivateCredit]);

  const allChartData = useMemo((): ChartEntry[] => {
    if (!product) return [];
    const history = (product as any).dailyApyHistory || (product as any).spotApy30dHistory || (product as any).daily_apy_history || (product as any).spot_apy_history || [];
    let arr: any[] = [];
    if (Array.isArray(history)) arr = history;
    else if (typeof history === 'string') { try { arr = JSON.parse(history); } catch { arr = []; } }
    if (!Array.isArray(arr) || arr.length === 0) return [];

    const today = new Date();
    const raw = arr.map((apy, i) => {
      const date = subDays(today, arr.length - 1 - i);
      const n = typeof apy === 'number' ? apy : parseFloat(String(apy));
      return { date: format(date, 'MMM dd'), fullDate: format(date, 'yyyy-MM-dd'), apy: isNaN(n) ? 0 : parseFloat(n.toFixed(2)) };
    });
    // Deduplicate by fullDate (ISO) — keep last entry per day
    const seen = new Map<string, ChartEntry>();
    for (const entry of raw) seen.set(entry.fullDate, entry);
    return Array.from(seen.values());
  }, [product]);

  const chartData = useMemo(() => timeframe === '30D' ? allChartData.slice(-30) : allChartData, [allChartData, timeframe]);

  const allTvlChartData = useMemo((): TvlChartEntry[] => {
    if (!product) return [];
    const history = (product as any).tvlHistory || [];
    let arr: any[] = [];
    if (Array.isArray(history)) arr = history;
    else if (typeof history === 'string') { try { arr = JSON.parse(history); } catch { arr = []; } }
    if (!Array.isArray(arr) || arr.length === 0) return [];

    const today = new Date();
    const raw = arr.map((tvl: any, i: number) => {
      const date = subDays(today, arr.length - 1 - i);
      const n = typeof tvl === 'number' ? tvl : parseFloat(String(tvl));
      return { date: format(date, 'MMM dd'), fullDate: format(date, 'yyyy-MM-dd'), tvl: isNaN(n) ? 0 : n };
    });
    // Deduplicate by fullDate (ISO) — keep last entry per day
    const seen = new Map<string, TvlChartEntry>();
    for (const entry of raw) seen.set(entry.fullDate, entry);
    return Array.from(seen.values());
  }, [product]);

  const tvlChartData = useMemo(() => tvlTimeframe === '30D' ? allTvlChartData.slice(-30) : allTvlChartData, [allTvlChartData, tvlTimeframe]);

  const isTvlHistoryEmpty = !product || !Array.isArray(product.tvlHistory) || (product.tvlHistory.length === 0);
  const isHistoryEmpty = !product || (!Array.isArray(product.dailyApyHistory) && !Array.isArray((product as any).spotApy30dHistory)) ||
    ((product.dailyApyHistory?.length || 0) === 0 && ((product as any).spotApy30dHistory?.length || 0) === 0);

  return {
    // Computed data
    marketStats, sustainabilityMetrics, contextAnalysis,
    historyStats, tvlStats,
    alternativeStrategies, tvlRank, networkTvlRank, faqItems,
    seoData: buildSeoData,
    // New sections
    yieldTrajectory, capitalFlows, yieldTvlCorrelation,
    comparativeRankings, networkRankings,
    expandedApyStats, expandedTvlStats,
    // Chart
    allChartData, chartData, timeframe, setTimeframe,
    allTvlChartData, tvlChartData, tvlTimeframe, setTvlTimeframe,
    // Flags
    isTvlHistoryEmpty, isHistoryEmpty,
  };
}