/**
 * AnalyticsPanel — Control Room tab for product CTR insights.
 * Shows: search traffic (Google/Bing), device breakdown (Desktop/Mobile),
 * and daily trends with click-through rate visualization.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrendingUp, RefreshCw, BarChart3, Monitor, Smartphone,
  Globe, MousePointerClick, Eye, Percent, Tablet,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import * as api from '@/app/utils/api';
import type { ClickAnalytics, DailyPageViewRecord } from '@/app/utils/api';
import { useDarkMode } from '@/app/utils/useDarkMode';

// ── Custom Tooltip ───────────────────────────────────────────

const DeviceChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  let dateLabel = label;
  try { dateLabel = format(parseISO(label), 'MMM d, yyyy'); } catch {}
  const desktop = payload.find((p: any) => p.dataKey === 'desktop')?.value ?? 0;
  const mobile = payload.find((p: any) => p.dataKey === 'mobile')?.value ?? 0;
  const tablet = payload.find((p: any) => p.dataKey === 'tablet')?.value ?? 0;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg space-y-1">
      <p className="text-[10px] font-medium text-muted-foreground">{dateLabel}</p>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <p className="text-xs font-medium text-foreground">{desktop} desktop</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#08a671]" />
        <p className="text-xs font-medium text-foreground">{mobile} mobile</p>
      </div>
      {tablet > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <p className="text-xs font-medium text-foreground">{tablet} tablet</p>
        </div>
      )}
    </div>
  );
};

const CTRChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  let dateLabel = label;
  try { dateLabel = format(parseISO(label), 'MMM d, yyyy'); } catch {}
  const clicks = payload.find((p: any) => p.dataKey === 'clicks')?.value ?? 0;
  const views = payload.find((p: any) => p.dataKey === 'views')?.value ?? 0;
  const ctr = views > 0 ? ((clicks / views) * 100).toFixed(2) : '0.00';
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg space-y-1">
      <p className="text-[10px] font-medium text-muted-foreground">{dateLabel}</p>
      <p className="text-xs font-medium text-foreground">{clicks} clicks · {views} views</p>
      <p className="text-xs font-semibold text-[#08a671]">{ctr}% CTR</p>
    </div>
  );
};

const CTRPerDeviceTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  let dateLabel = label;
  try { dateLabel = format(parseISO(label), 'MMM d, yyyy'); } catch {}
  
  const desktopCTR = payload.find((p: any) => p.dataKey === 'desktopCTR')?.value ?? 0;
  const mobileCTR = payload.find((p: any) => p.dataKey === 'mobileCTR')?.value ?? 0;
  const tabletCTR = payload.find((p: any) => p.dataKey === 'tabletCTR')?.value ?? 0;
  
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg space-y-1.5">
      <p className="text-[10px] font-medium text-muted-foreground">{dateLabel}</p>
      {desktopCTR > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <p className="text-xs font-medium text-foreground">Desktop: {desktopCTR.toFixed(2)}%</p>
        </div>
      )}
      {mobileCTR > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#08a671]" />
          <p className="text-xs font-medium text-foreground">Mobile: {mobileCTR.toFixed(2)}%</p>
        </div>
      )}
      {tabletCTR > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <p className="text-xs font-medium text-foreground">Tablet: {tabletCTR.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────

export const AnalyticsPanel: React.FC = () => {
  const { isDark } = useDarkMode();
  const [loading, setLoading] = useState(true);
  
  // Toggle state for CTR chart legend
  const [showViews, setShowViews] = useState(true);
  const [showClicks, setShowClicks] = useState(true);

  const [analytics, setAnalytics] = useState<ClickAnalytics | null>(null);
  const [dailyPageViews, setDailyPageViews] = useState<DailyPageViewRecord[]>([]);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [clickData, pageViewData] = await Promise.all([
        api.fetchClickAnalytics().catch(() => null),
        api.fetchDailyPageViews().catch(() => []),
      ]);
      setAnalytics(clickData);
      setDailyPageViews(pageViewData);
    } catch (err: any) {
      console.error('[Analytics] Fetch error:', err);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Computed stats ──
  const totalClicks = analytics?.totalClicks || 0;
  const totalPageViews = useMemo(() => dailyPageViews.reduce((s, d) => s + d.count, 0), [dailyPageViews]);
  const overallCTR = useMemo(() => {
    if (totalPageViews === 0) return 0;
    return ((totalClicks / totalPageViews) * 100).toFixed(2);
  }, [totalClicks, totalPageViews]);

  // ── Device breakdown ──
  const deviceData = useMemo(() => {
    if (!analytics) return [];
    const { desktop, mobile, tablet } = analytics.deviceBreakdown;
    const total = desktop + mobile + tablet;
    if (total === 0) return [];
    return [
      { name: 'Desktop', value: desktop, pct: ((desktop / total) * 100).toFixed(1), color: '#3b82f6' },
      { name: 'Mobile', value: mobile, pct: ((mobile / total) * 100).toFixed(1), color: '#08a671' },
      { name: 'Tablet', value: tablet, pct: ((tablet / total) * 100).toFixed(1), color: '#a855f7' },
    ].filter(d => d.value > 0);
  }, [analytics]);

  // ── Referrer breakdown ──
  const referrerData = useMemo(() => {
    if (!analytics) return [];
    const { google, bing, direct, other } = analytics.referrerBreakdown;
    const total = google + bing + direct + other;
    if (total === 0) return [];
    return [
      { name: 'Google', value: google, pct: ((google / total) * 100).toFixed(1), color: '#3b82f6' },
      { name: 'Bing', value: bing, pct: ((bing / total) * 100).toFixed(1), color: '#08a671' },
      { name: 'Direct', value: direct, pct: ((direct / total) * 100).toFixed(1), color: '#a855f7' },
      { name: 'Other', value: other, pct: ((other / total) * 100).toFixed(1), color: '#f59e0b' },
    ].filter(d => d.value > 0);
  }, [analytics]);

  // ── Daily device chart data (last 30 days) ──
  const deviceChartData = useMemo(() => {
    if (!analytics || analytics.dailyDeviceBreakdown.length === 0) return [];
    // Deduplicate by date
    const map = new Map<string, { date: string; desktop: number; mobile: number; tablet: number }>();
    for (const day of analytics.dailyDeviceBreakdown) {
      const existing = map.get(day.date);
      if (existing) {
        existing.desktop += day.desktop;
        existing.mobile += day.mobile;
        existing.tablet += day.tablet;
      } else {
        map.set(day.date, { date: day.date, desktop: day.desktop, mobile: day.mobile, tablet: day.tablet });
      }
    }
    const data = [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
    if (data.length <= 30) return data;
    return data.slice(-30);
  }, [analytics]);

  // ── CTR timeline (merge clicks + page views by date, last 30 days) ──
  const ctrChartData = useMemo(() => {
    if (!analytics || dailyPageViews.length === 0) return [];
    
    // Map page views by date
    const viewsMap = new Map<string, number>();
    for (const pv of dailyPageViews) {
      viewsMap.set(pv.date, pv.count);
    }

    // Merge with clicks
    const mergedMap = new Map<string, { date: string; clicks: number; views: number; ctr: number }>();
    for (const day of analytics.dailyDeviceBreakdown) {
      const clicks = day.desktop + day.mobile + day.tablet;
      const views = viewsMap.get(day.date) || 0;
      const ctr = views > 0 ? (clicks / views) * 100 : 0;
      const existing = mergedMap.get(day.date);
      if (existing) {
        existing.clicks += clicks;
        existing.views = views;
        existing.ctr = existing.views > 0 ? (existing.clicks / existing.views) * 100 : 0;
      } else {
        mergedMap.set(day.date, { date: day.date, clicks, views, ctr });
      }
    }
    const merged = [...mergedMap.values()];

    // Sort by date and take last 30 days
    merged.sort((a, b) => a.date.localeCompare(b.date));
    if (merged.length <= 30) return merged;
    return merged.slice(-30);
  }, [analytics, dailyPageViews]);

  // ── CTR per device (calc CTR for each device by merging with page views) ──
  const ctrPerDeviceData = useMemo(() => {
    if (!analytics || dailyPageViews.length === 0) return [];
    
    // Map page views by date (note: page views are total, not split by device)
    // For device-specific CTR, we'll approximate by using total pageviews
    const viewsMap = new Map<string, number>();
    for (const pv of dailyPageViews) {
      viewsMap.set(pv.date, pv.count);
    }

    // Deduplicate device breakdown by date first
    const dedupedMap = new Map<string, { date: string; desktop: number; mobile: number; tablet: number }>();
    for (const day of analytics.dailyDeviceBreakdown) {
      const existing = dedupedMap.get(day.date);
      if (existing) {
        existing.desktop += day.desktop;
        existing.mobile += day.mobile;
        existing.tablet += day.tablet;
      } else {
        dedupedMap.set(day.date, { date: day.date, desktop: day.desktop, mobile: day.mobile, tablet: day.tablet });
      }
    }

    const merged = [...dedupedMap.values()].map((day) => {
      const totalViews = viewsMap.get(day.date) || 0;
      const totalClicks = day.desktop + day.mobile + day.tablet;
      
      // Estimate device-specific page views proportionally based on click distribution
      let desktopViews = 0, mobileViews = 0, tabletViews = 0;
      if (totalClicks > 0) {
        const desktopRatio = day.desktop / totalClicks;
        const mobileRatio = day.mobile / totalClicks;
        const tabletRatio = day.tablet / totalClicks;
        desktopViews = totalViews * desktopRatio;
        mobileViews = totalViews * mobileRatio;
        tabletViews = totalViews * tabletRatio;
      } else {
        // If no clicks, split views equally (rough estimate)
        desktopViews = totalViews / 3;
        mobileViews = totalViews / 3;
        tabletViews = totalViews / 3;
      }

      return {
        date: day.date,
        desktopCTR: desktopViews > 0 ? (day.desktop / desktopViews) * 100 : 0,
        mobileCTR: mobileViews > 0 ? (day.mobile / mobileViews) * 100 : 0,
        tabletCTR: tabletViews > 0 ? (day.tablet / tabletViews) * 100 : 0,
      };
    });

    // Sort by date and take last 30 days
    merged.sort((a, b) => a.date.localeCompare(b.date));
    if (merged.length <= 30) return merged;
    return merged.slice(-30);
  }, [analytics, dailyPageViews]);

  // Custom legend click handler
  const handleLegendClick = (dataKey: string) => {
    if (dataKey === 'views') {
      setShowViews(!showViews);
    } else if (dataKey === 'clicks') {
      setShowClicks(!showClicks);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#08a671]/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#08a671]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Analytics</h2>
            <p className="text-muted-foreground text-xs font-medium">Product CTR insights & traffic breakdown</p>
          </div>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <MousePointerClick className="w-3 h-3 text-muted-foreground/60" />
            <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Total Clicks</p>
          </div>
          <p className="text-xl font-semibold text-foreground">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Eye className="w-3 h-3 text-muted-foreground/60" />
            <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Page Views</p>
          </div>
          <p className="text-xl font-semibold text-foreground">{totalPageViews.toLocaleString()}</p>
        </div>
        <div className="bg-[#08a671]/5 border border-[#08a671]/10 rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Percent className="w-3 h-3 text-[#08a671]" />
            <p className="text-[9px] font-semibold text-[#08a671]/70 uppercase tracking-wider">Overall CTR</p>
          </div>
          <p className="text-xl font-semibold text-foreground">{overallCTR}%</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-3 h-3 text-muted-foreground/60" />
            <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Tracked Days</p>
          </div>
          <p className="text-xl font-semibold text-foreground">{ctrChartData.length}</p>
        </div>
      </div>

      {/* ═══ CTR Timeline ═══ */}
      {ctrChartData.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Percent className="w-4 h-4 text-[#08a671]" />
            <h3 className="text-sm font-semibold text-foreground">Click-Through Rate Over Time</h3>
            <span className="text-[10px] font-medium text-muted-foreground ml-auto">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ctrChartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs key="ctr-defs">
                <linearGradient id="ctr-clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#08a671" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#08a671" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="ctr-viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid
                key="ctr-grid"
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                vertical={false}
              />
              <XAxis
                key="ctr-xaxis"
                dataKey="date"
                tickFormatter={(d) => { try { return format(parseISO(d), 'MMM d'); } catch { return d; } }}
                tick={{ fontSize: 10, fill: isDark ? '#888' : '#999' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                key="ctr-yaxis"
                tick={{ fontSize: 10, fill: isDark ? '#888' : '#999' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip key="ctr-tooltip" content={<CTRChartTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
              <Legend
                key="ctr-legend"
                wrapperStyle={{ fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                iconType="circle"
                onClick={(e) => handleLegendClick(e.dataKey)}
              />
              <Bar key="bar-views" dataKey="views" fill="url(#ctr-viewsGradient)" radius={[4, 4, 0, 0]} maxBarSize={32} name="Page Views" hide={!showViews} />
              <Bar key="bar-clicks" dataKey="clicks" fill="url(#ctr-clicksGradient)" radius={[4, 4, 0, 0]} maxBarSize={32} name="Clicks" hide={!showClicks} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ═══ CTR Per Device ═══ */}
      {ctrPerDeviceData.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Percent className="w-4 h-4 text-[#08a671]" />
            <h3 className="text-sm font-semibold text-foreground">CTR by Device</h3>
            <span className="text-[10px] font-medium text-muted-foreground ml-auto">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ctrPerDeviceData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid
                key="ctrdev-grid"
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                vertical={false}
              />
              <XAxis
                key="ctrdev-xaxis"
                dataKey="date"
                tickFormatter={(d) => { try { return format(parseISO(d), 'MMM d'); } catch { return d; } }}
                tick={{ fontSize: 10, fill: isDark ? '#888' : '#999' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                key="ctrdev-yaxis"
                tick={{ fontSize: 10, fill: isDark ? '#888' : '#999' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val.toFixed(0)}%`}
              />
              <Tooltip key="ctrdev-tooltip" content={<CTRPerDeviceTooltip />} cursor={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', strokeWidth: 1 }} />
              <Legend
                key="ctrdev-legend"
                wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
                iconType="line"
              />
              <Line key="line-desktop" type="monotone" dataKey="desktopCTR" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Desktop CTR" />
              <Line key="line-mobile" type="monotone" dataKey="mobileCTR" stroke="#08a671" strokeWidth={2} dot={{ r: 3 }} name="Mobile CTR" />
              <Line key="line-tablet" type="monotone" dataKey="tabletCTR" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} name="Tablet CTR" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ═══ Device Breakdown ═══ */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Device stats */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-foreground">Device Breakdown</h3>
          </div>
          {deviceData.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm font-medium">
              {loading ? 'Loading...' : 'No device data yet'}
            </div>
          ) : (
            <div className="space-y-3">
              {deviceData.map((item) => {
                const Icon = item.name === 'Desktop' ? Monitor : item.name === 'Mobile' ? Smartphone : Tablet;
                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground">{item.name}</span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.value} <span className="text-muted-foreground/50">({item.pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search traffic (referrers) */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-[#08a671]" />
            <h3 className="text-sm font-semibold text-foreground">Traffic Sources</h3>
          </div>
          {referrerData.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm font-medium">
              {loading ? 'Loading...' : 'No referrer data yet'}
            </div>
          ) : (
            <div className="space-y-3">
              {referrerData.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{item.name}</span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.value} <span className="text-muted-foreground/50">({item.pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Daily Device Breakdown ═══ */}
      {deviceChartData.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-foreground">Daily Device Breakdown</h3>
            <span className="text-[10px] font-medium text-muted-foreground ml-auto">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deviceChartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs key="dev-defs">
                <linearGradient id="dev-desktopGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="dev-mobileGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#08a671" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#08a671" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="dev-tabletGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid
                key="dev-grid"
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                vertical={false}
              />
              <XAxis
                key="dev-xaxis"
                dataKey="date"
                tickFormatter={(d) => { try { return format(parseISO(d), 'MMM d'); } catch { return d; } }}
                tick={{ fontSize: 10, fill: isDark ? '#888' : '#999' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                key="dev-yaxis"
                tick={{ fontSize: 10, fill: isDark ? '#888' : '#999' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip key="dev-tooltip" content={<DeviceChartTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
              <Legend
                key="dev-legend"
                wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
                iconType="circle"
              />
              <Bar key="bar-desktop" dataKey="desktop" stackId="device" fill="url(#dev-desktopGradient)" radius={[0, 0, 0, 0]} maxBarSize={32} name="Desktop" />
              <Bar key="bar-mobile" dataKey="mobile" stackId="device" fill="url(#dev-mobileGradient)" radius={[0, 0, 0, 0]} maxBarSize={32} name="Mobile" />
              <Bar key="bar-tablet" dataKey="tablet" stackId="device" fill="url(#dev-tabletGradient)" radius={[4, 4, 0, 0]} maxBarSize={32} name="Tablet" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty state */}
      {!loading && (!analytics || totalClicks === 0) && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <TrendingUp className="w-8 h-8 text-muted-foreground/30 mb-3 mx-auto" />
          <p className="text-sm text-muted-foreground font-medium">No analytics data yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Click data will appear here once users start clicking "Open Product" buttons
          </p>
        </div>
      )}
    </div>
  );
};