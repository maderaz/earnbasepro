'use client';
/**
 * useVaultData — All computed data for the Vault Product page.
 * Ported from src/app/components/vault/useVaultData.ts
 */
import { useMemo, useState } from 'react';
import type { DeFiProduct } from '@/lib/api';
import { getProductSlug } from '@/app/utils/slugify';
import { formatTVL } from '@/app/utils/formatters';
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
  tvl7dChangeAbs: number; tvl7dChangePct: number;
  tvl30dChangeAbs: number; tvl30dChangePct: number;
  tvlMax30d: number; tvlMin30d: number;
  tvlMaxDate: string; tvlMinDate: string;
  inflowDays: number; outflowDays: number;
  largestInflow: number; largestInflowDate: string;
  largestOutflow: number; largestOutflowDate: string;
  totalDays: number; inflowDays7d: number;
}

export interface YieldTvlCorrelation {
  apyDirection: number; tvlDirection: number;
  insight: string; icon: string;
}

export interface ExpandedApyStats {
  median: number;
  daysAboveAvg: number;
  bestDayApy: number; bestDayDate: string;
  worstDayApy: number; worstDayDate: string;
  percentile: number; apyRange: number; totalDays: number;
}

export interface ExpandedTvlStats {
  median: number; tvlPerApyPoint: number;
  inflowDays: number; outflowDays: number;
  largestInflow: number; largestInflowDate: string;
  largestOutflow: number; largestOutflowDate: string;
  totalDays: number;
}

export interface RankedProduct {
  product: DeFiProduct; rank: number; slug: string;
}

const median = (arr: number[]): number => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const sign = (n: number): number => (n > 0 ? 1 : n < 0 ? -1 : 0);

const parseHistory = (raw: any): number[] => {
  let arr: any[] = [];
  if (Array.isArray(raw)) arr = raw;
  else if (typeof raw === 'string') { try { arr = JSON.parse(raw); } catch { arr = []; } }
  return arr.map((v: any) => (typeof v === 'number' ? v : parseFloat(String(v)))).filter((v: number) => !isNaN(v));
};

const dateForIndex = (i: number, total: number): string => {
  return format(subDays(new Date(), total - 1 - i), 'MMM dd');
};
const fullDateForIndex = (i: number, total: number): string => {
  return format(subDays(new Date(), total - 1 - i), 'MMM dd, yyyy');
};

const rankWindow = (allRanked: RankedProduct[], productId: string | number, windowSize = 6): RankedProduct[] => {
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
    const allRanked = sorted.map((p, i) => ({ product: p, rank: i + 1, slug: getProductSlug(p) }));
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

    if (ratio > 1.5) score = Math.min(score, 32);
    if (ratio < 0.5) score = Math.min(score, 28);

    if (score >= 90) {
      status = 'Very Stable';
      description = `The 24h APY of ${product.spotAPY.toFixed(2)}% is nearly identical to the 30-day mean, with only a ${(deviation * 100).toFixed(1)}% variance. This level of consistency is uncommon in DeFi and reflects a mature, well-calibrated yield source with predictable returns.`;
    } else if (score >= 75) {
      status = 'Stable';
      description = `Current yield of ${product.spotAPY.toFixed(2)}% shows a ${(deviation * 100).toFixed(1)}% variance from the 30-day average, well within normal operating bands.`;
    } else if (score >= 55) {
      status = 'Moderate';
      description = `Yield is ${ratio > 1 ? `${(ratio * 100 - 100).toFixed(1)}% above` : `${(100 - ratio * 100).toFixed(1)}% below`} the monthly average.`;
    } else if (score >= 35) {
      status = 'Low Stability';
      description = `Yield has deviated meaningfully from its 30-day baseline, with a ${(deviation * 100).toFixed(1)}% gap between the current rate and the historical mean.`;
    } else {
      status = 'Very Low Stability';
      description = `An extreme ${(deviation * 100).toFixed(1)}% deviation from the historical average suggests the current yield level is unlikely to persist.`;
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
    const allRanked = sorted.map((p, i) => ({ product: p, rank: i + 1, slug: getProductSlug(p) }));
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

    let consecutiveWeeksCount = 0;
    let consecutiveWeeksDirection: 'improved' | 'declined' | 'fluctuated' | 'stable' = 'stable';
    if (weeklyAverages.length > 1) {
      let prevAvg = weeklyAverages[0].avg;
      for (let i = 1; i < weeklyAverages.length; i++) {
        const currentAvg = weeklyAverages[i].avg;
        if (currentAvg > prevAvg) {
          if (consecutiveWeeksDirection === 'declined') consecutiveWeeksCount = 1;
          else consecutiveWeeksCount++;
          consecutiveWeeksDirection = 'improved';
        } else if (currentAvg < prevAvg) {
          if (consecutiveWeeksDirection === 'improved') consecutiveWeeksCount = 1;
          else consecutiveWeeksCount++;
          consecutiveWeeksDirection = 'declined';
        } else {
          if (consecutiveWeeksDirection === 'stable') consecutiveWeeksCount++;
          else consecutiveWeeksCount = 1;
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
      tvlMax30d: last30[maxIdx], tvlMin30d: last30[minIdx],
      tvlMaxDate: fullDateForIndex(offset + maxIdx, raw.length),
      tvlMinDate: fullDateForIndex(offset + minIdx, raw.length),
      inflowDays, outflowDays,
      largestInflow, largestInflowDate: fullDateForIndex(offset + largestInflowIdx, raw.length),
      largestOutflow, largestOutflowDate: fullDateForIndex(offset + largestOutflowIdx, raw.length),
      totalDays: total,
      inflowDays7d: (() => {
        const last7 = last30.slice(-7);
        let count = 0;
        for (let i = 1; i < last7.length; i++) { if (last7[i] > last7[i - 1]) count++; }
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

    if (isPrivateCredit) {
      if (tvlDir > 0) { insight = `Capital is flowing into this fixed-rate product, suggesting investor confidence in the contractual yield of ${product.spotAPY.toFixed(2)}%.`; icon = '↗'; }
      else if (tvlDir < 0) { insight = `Capital is flowing out despite a stable fixed rate of ${product.spotAPY.toFixed(2)}%.`; icon = '↘'; }
      else { insight = `Capital levels have remained stable alongside the fixed ${product.spotAPY.toFixed(2)}% yield.`; icon = '→'; }
      return { apyDirection: 0, tvlDirection: tvlDir, insight, icon };
    }

    if (apyDir > 0 && tvlDir > 0) { insight = 'Rising yields have attracted capital, with both APY and TVL trending upward over the past 30 days.'; icon = '↗↗'; }
    else if (apyDir > 0 && tvlDir < 0) { insight = 'Despite rising yields, capital has been flowing out. This may indicate concerns about sustainability or broader market rotation.'; icon = '↗↘'; }
    else if (apyDir < 0 && tvlDir > 0) { insight = 'Yields are declining as more capital enters the vault, a common dynamic where increased deposits dilute per-depositor returns.'; icon = '↘↗'; }
    else if (apyDir < 0 && tvlDir < 0) { insight = 'Both yield and TVL are declining, and depositors may be exiting in response to falling returns.'; icon = '↘↘'; }
    else { insight = 'Yield and TVL have remained relatively stable over the past 30 days.'; icon = '→→'; }

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

    const sameAsset = products.filter(p => p.ticker === product.ticker);
    const allAvgs = sameAsset.map(p => p.monthlyAPY || p.spotAPY).sort((a, b) => a - b);
    const myAvg = product.monthlyAPY || product.spotAPY;
    const below = allAvgs.filter(a => a < myAvg).length;
    const percentile = Math.round((below / (allAvgs.length || 1)) * 100);

    const offset = valid.length - last30.length;
    return {
      median: med, daysAboveAvg,
      bestDayApy: last30[bestIdx], bestDayDate: fullDateForIndex(offset + bestIdx, valid.length),
      worstDayApy: last30[worstIdx], worstDayDate: fullDateForIndex(offset + worstIdx, valid.length),
      percentile, apyRange: last30[bestIdx] - last30[worstIdx], totalDays: last30.length,
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
      if (delta > 0) { inflowDays++; if (delta > largestInflow) { largestInflow = delta; liIdx = i; } }
      else if (delta < 0) { outflowDays++; if (Math.abs(delta) > largestOutflow) { largestOutflow = Math.abs(delta); loIdx = i; } }
    }

    const offset = raw.length - last30.length;
    return {
      median: med, tvlPerApyPoint,
      inflowDays, outflowDays,
      largestInflow, largestInflowDate: fullDateForIndex(offset + liIdx, raw.length),
      largestOutflow, largestOutflowDate: fullDateForIndex(offset + loIdx, raw.length),
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
        ? `${product.product_name} offers a fixed yield of ${product.spotAPY.toFixed(2)}% on ${product.ticker}. This rate is contractually set and remains constant regardless of market conditions.`
        : `${product.product_name} on ${product.platform_name} offers a 24-hour APY of ${product.spotAPY.toFixed(2)}%, a 30-day average of ${product.monthlyAPY.toFixed(2)}% on ${product.ticker}. Yields are variable and update daily based on protocol activity.`,
    });

    items.push({
      category: 'Strategy & Access',
      question: `What blockchain is ${product.product_name} on?`,
      answer: `${product.product_name} operates on the ${product.network} network and is managed by ${product.platform_name}. It accepts ${product.ticker} deposits.${product.curator && product.curator !== '-' ? ` The strategy is curated by ${product.curator}.` : ''}`,
    });

    items.push({
      category: 'Liquidity & TVL',
      question: `How much is deposited in ${product.product_name}?`,
      answer: `${product.product_name} currently has a total value locked (TVL) of ${formatTVL(product.tvl)} in ${product.ticker} deposits.`,
    });

    if (marketStats) {
      const direction = marketStats.isAboveAverage ? 'above' : 'below';
      items.push({
        category: 'Yield & Performance',
        question: `How does ${product.product_name} compare to other ${product.ticker} yield strategies?`,
        answer: `${product.product_name} ranks #${marketStats.rank} out of ${marketStats.totalInAsset} monitored ${product.ticker} strategies. Its current yield of ${product.spotAPY.toFixed(2)}% is ${Math.abs(marketStats.diffPercent).toFixed(1)}% ${direction} the market average of ${marketStats.avgApy.toFixed(2)}%.`,
      });
    }

    if (sustainabilityMetrics && !sustainabilityMetrics.insufficientData) {
      items.push({
        category: 'Yield & Performance',
        question: `Is the yield on ${product.product_name} sustainable?`,
        answer: isPrivateCredit
          ? `${product.product_name} has a sustainability score of 100 out of 100, reflecting its fixed-rate structure.`
          : `Earnbase rates the yield sustainability of ${product.product_name} at ${sustainabilityMetrics.score}/100, classified as "${sustainabilityMetrics.status}". ${sustainabilityMetrics.description}`,
      });
    }

    items.push({
      category: 'Strategy & Access',
      question: `How do I deposit into ${product.product_name}?`,
      answer: `To deposit into ${product.product_name}, you need ${product.ticker} tokens on the ${product.network} network. Visit the ${product.platform_name} platform directly to connect your wallet and make a deposit.`,
    });

    if (contextAnalysis) {
      const isBest = contextAnalysis.isBestOnNetwork;
      items.push({
        category: 'Strategy & Access',
        question: `Is ${product.product_name} the best ${product.ticker} yield on ${product.network}?`,
        answer: isBest
          ? `Yes, ${product.product_name} offers the highest ${product.ticker} yield on ${product.network} at ${product.spotAPY.toFixed(2)}% APY.`
          : `${product.product_name} ranks among ${contextAnalysis.netCount} monitored ${product.ticker} strategies on ${product.network}. Its yield of ${product.spotAPY.toFixed(2)}% is ${Math.abs(contextAnalysis.netDiff).toFixed(1)}% ${contextAnalysis.netDiff >= 0 ? 'above' : 'below'} the ${product.network} average of ${contextAnalysis.netAvg.toFixed(2)}%.`,
      });
    }

    if (historyStats && yieldTrajectory) {
      items.push({
        category: 'Yield & Performance',
        question: `What is the APY trend for ${product.product_name}?`,
        answer: isPrivateCredit
          ? `${product.product_name} maintains a constant APY of ${product.spotAPY.toFixed(2)}% as a private credit instrument.`
          : `Over the past ${historyStats.dataPoints} days, ${product.product_name} has shown ${historyStats.trendDirection === 'upward' ? 'an upward' : historyStats.trendDirection === 'downward' ? 'a downward' : 'a stable'} yield trajectory. The average APY moved from ${historyStats.earlyAvg.toFixed(2)}% to ${historyStats.recentAvg.toFixed(2)}%.`,
      });
    }

    items.push({
      category: 'Strategy & Access',
      question: `What are the fees for ${product.product_name}?`,
      answer: `${product.product_name} is deployed on ${product.platform_name}'s vault infrastructure. Fee structures are set at the protocol and curator level. Consult the vault directly for current performance and management fee rates.`,
    });

    items.push({
      category: 'Strategy & Access',
      question: `What is ${product.platform_name}?`,
      answer: `${product.platform_name} is the DeFi protocol infrastructure that ${product.product_name} operates on. It provides the smart contract layer for deposits, withdrawals, and strategy execution on the ${product.network} network.`,
    });

    // ── Additional Yield & Performance ──────────────────────────

    if (historyStats && !isPrivateCredit) {
      items.push({
        category: 'Yield & Performance',
        question: `How volatile is the yield on ${product.product_name}?`,
        answer: `${product.product_name} has a yield volatility rating of "${historyStats.volatility}" (standard deviation: ${historyStats.stdDev.toFixed(2)}pp over ${historyStats.dataPoints} days). The APY has ranged from ${historyStats.min.toFixed(2)}% to ${historyStats.max.toFixed(2)}% in the tracked period, with an average of ${historyStats.avg.toFixed(2)}%.`,
      });
    }

    // ── Additional Liquidity & TVL ───────────────────────────────

    if (marketStats && tvlStats) {
      items.push({
        category: 'Liquidity & TVL',
        question: `How does ${product.product_name}'s TVL compare to other ${product.ticker} vaults?`,
        answer: `${product.product_name} holds ${formatTVL(product.tvl)} in ${product.ticker} deposits. Across all ${marketStats.totalInAsset} tracked ${product.ticker} strategies, deposits range widely depending on the protocol and curator reputation. ${product.tvl > 0 ? `This vault's TVL of ${formatTVL(product.tvl)} places it within the broader spectrum of ${product.ticker} opportunities tracked on Earnbase.` : ''}`,
      });
    }

    if (networkTvlRank) {
      items.push({
        category: 'Liquidity & TVL',
        question: `How does ${product.product_name}'s TVL compare to other ${product.ticker} vaults on ${product.network}?`,
        answer: `By total value locked, ${product.product_name} ranks #${networkTvlRank.networkTvlRank} of ${networkTvlRank.networkTvlTotal} ${product.ticker} strategies on ${product.network}. It currently holds ${formatTVL(product.tvl)}.`,
      });
    }

    if (tvlStats) {
      items.push({
        category: 'Liquidity & TVL',
        question: `Is ${product.product_name}'s TVL growing or declining?`,
        answer: `${product.product_name}'s TVL is currently ${tvlStats.trendDirection === 'growing' ? 'on an upward trajectory' : tvlStats.trendDirection === 'declining' ? 'declining' : 'relatively stable'}. Over the past ${tvlStats.dataPoints} days, TVL moved from ${formatTVL(tvlStats.earlyAvg)} to ${formatTVL(tvlStats.recentAvg)}, a ${tvlStats.trendPct >= 0 ? '+' : ''}${tvlStats.trendPct.toFixed(1)}% change. The 30-day high was ${formatTVL(tvlStats.max)} and the 30-day low was ${formatTVL(tvlStats.min)}.`,
      });
    }

    if (yieldTvlCorrelation && !isPrivateCredit) {
      items.push({
        category: 'Liquidity & TVL',
        question: `What is the relationship between yield and TVL for ${product.product_name}?`,
        answer: `${yieldTvlCorrelation.insight} In general, rising TVL in a lending vault can compress yields as more capital competes for the same borrow demand.`,
      });
    }

    if (capitalFlows) {
      items.push({
        category: 'Liquidity & TVL',
        question: `What are the recent capital flows for ${product.product_name}?`,
        answer: `Over the past 30 days, ${product.product_name} had ${capitalFlows.inflowDays} days of inflows and ${capitalFlows.outflowDays} days of outflows. The largest single-day inflow was +${formatTVL(capitalFlows.largestInflow)} (${capitalFlows.largestInflowDate}) and the largest outflow was -${formatTVL(capitalFlows.largestOutflow)} (${capitalFlows.largestOutflowDate}). Net 30-day TVL change: ${capitalFlows.tvl30dChangePct >= 0 ? '+' : ''}${capitalFlows.tvl30dChangePct.toFixed(1)}%.`,
      });
    }

    return items;
  }, [product, marketStats, sustainabilityMetrics, contextAnalysis, historyStats, tvlStats, yieldTrajectory, yieldTvlCorrelation, capitalFlows, networkTvlRank, isPrivateCredit]);

  const allChartData = useMemo((): ChartEntry[] => {
    if (!product) return [];
    const history = (product as any).dailyApyHistory || (product as any).spotApy30dHistory || [];
    let arr: any[] = [];
    if (Array.isArray(history)) arr = history;
    else if (typeof history === 'string') { try { arr = JSON.parse(history); } catch { arr = []; } }
    if (!Array.isArray(arr) || arr.length === 0) return [];

    const today = new Date();
    const raw = arr.map((apy: any, i: number) => {
      const date = subDays(today, arr.length - 1 - i);
      const n = typeof apy === 'number' ? apy : parseFloat(String(apy));
      return { date: format(date, 'MMM dd'), fullDate: format(date, 'yyyy-MM-dd'), apy: isNaN(n) ? 0 : parseFloat(n.toFixed(2)) };
    });
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
    const seen = new Map<string, TvlChartEntry>();
    for (const entry of raw) seen.set(entry.fullDate, entry);
    return Array.from(seen.values());
  }, [product]);

  const tvlChartData = useMemo(() => tvlTimeframe === '30D' ? allTvlChartData.slice(-30) : allTvlChartData, [allTvlChartData, tvlTimeframe]);

  return {
    marketStats, sustainabilityMetrics, contextAnalysis,
    historyStats, tvlStats,
    alternativeStrategies, tvlRank, networkTvlRank, faqItems,
    yieldTrajectory, capitalFlows, yieldTvlCorrelation,
    comparativeRankings, networkRankings,
    expandedApyStats, expandedTvlStats,
    allChartData, chartData,
    allTvlChartData, tvlChartData,
    timeframe, setTimeframe,
    tvlTimeframe, setTvlTimeframe,
  };
}
