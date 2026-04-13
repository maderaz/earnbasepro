/**
 * TrafficPanel — Control Room tab for page view analytics.
 * Sub-tabs: Overview (daily chart + stats) · Top Pages · Referrers · Log.
 * Orange/amber BarChart. Maple Look typography (semibold/medium/normal).
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Eye, RefreshCw, TrendingUp, Trophy, List,
  ChevronLeft, ChevronRight, BarChart3,
  Monitor, Smartphone, Tablet, Globe, Clock,
  ExternalLink, ArrowRight, Hash, UserPlus, UserCheck, Users,
  EyeOff, X, ShieldOff, Shield, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import * as api from '@/app/utils/api';
import type {
  DailyPageViewRecord, TopPageRecord, ReferrerRecord, PageViewEvent,
  VisitorInsights, HiddenVisitor,
} from '@/app/utils/api';
import { useDarkMode } from '@/app/utils/useDarkMode';

type TrafficView = 'overview' | 'pages' | 'referrers' | 'log';
const LOG_PER_PAGE = 50;

/** Domains to exclude from all traffic displays (dev/preview noise) */
const IGNORED_REFERRER_DOMAINS = ['figma.com', 'www.figma.com'];
const isIgnoredReferrer = (domain: string) =>
  IGNORED_REFERRER_DOMAINS.some(d => domain.toLowerCase().includes(d));

// ── Shared helpers ───────────────────────────────────────────

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const countryFlag = (code: string): string => {
  if (!code || code.length !== 2) return '';
  const c = code.toUpperCase();
  return String.fromCodePoint(...[...c].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65));
};

const DeviceIcon: React.FC<{ device: string; className?: string }> = ({ device, className = 'w-3 h-3' }) => {
  if (device === 'mobile') return <Smartphone className={className} />;
  if (device === 'tablet') return <Tablet className={className} />;
  return <Monitor className={className} />;
};

const ROUTE_TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  home:     { label: 'Home',    color: 'text-[#08a671]',  bg: 'bg-[#08a671]/10' },
  asset:    { label: 'Asset',   color: 'text-blue-600',   bg: 'bg-blue-500/10' },
  network:  { label: 'Network', color: 'text-purple-600', bg: 'bg-purple-500/10' },
  vault:    { label: 'Vault',   color: 'text-amber-600',  bg: 'bg-amber-500/10' },
  internal: { label: 'Internal', color: 'text-gray-500',  bg: 'bg-gray-500/10' },
  other:    { label: 'Other',   color: 'text-gray-500',   bg: 'bg-gray-500/10' },
};

const RouteTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const cfg = ROUTE_TYPE_LABELS[type] || ROUTE_TYPE_LABELS.other;
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${cfg.color} ${cfg.bg}`}>
      {cfg.label}
    </span>
  );
};

// ── Custom Tooltip ───────────────────────────────────────────

const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  let dateLabel = label;
  try { dateLabel = format(parseISO(label), 'MMM d, yyyy'); } catch {}
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[10px] font-medium text-muted-foreground">{dateLabel}</p>
      <p className="text-sm font-semibold text-foreground">{value.toLocaleString()} views</p>
    </div>
  );
};

const VisitorChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  let dateLabel = label;
  try { dateLabel = format(parseISO(label), 'MMM d, yyyy'); } catch {}
  const newV = payload.find((p: any) => p.dataKey === 'newVisitors')?.value ?? 0;
  const retV = payload.find((p: any) => p.dataKey === 'returningVisitors')?.value ?? 0;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg space-y-1">
      <p className="text-[10px] font-medium text-muted-foreground">{dateLabel}</p>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-orange-400" />
        <p className="text-xs font-medium text-foreground">{newV} new</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-orange-600" />
        <p className="text-xs font-medium text-foreground">{retV} returning</p>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────

export const TrafficPanel: React.FC = () => {
  const { isDark } = useDarkMode();
  const [view, setView] = useState<TrafficView>('overview');
  const [loading, setLoading] = useState(true);

  // Data
  const [daily, setDaily] = useState<DailyPageViewRecord[]>([]);
  const [topPages, setTopPages] = useState<TopPageRecord[]>([]);
  const [referrers, setReferrers] = useState<ReferrerRecord[]>([]);
  const [logEvents, setLogEvents] = useState<PageViewEvent[]>([]);
  const [logTotal, setLogTotal] = useState(0);
  const [logPage, setLogPage] = useState(0);
  const [visitors, setVisitors] = useState<VisitorInsights | null>(null);
  const [hiddenVisitors, setHiddenVisitors] = useState<HiddenVisitor[]>([]);
  const [showHiddenManager, setShowHiddenManager] = useState(false);

  /** Build a visitor fingerprint matching the server-side visitor analysis formula */
  const getVisitorFingerprint = useCallback((ev: PageViewEvent): string => {
    return `${ev.ip}|${ev.browser}|${ev.os}|${ev.device}|${ev.screenWidth}x${ev.screenHeight}`;
  }, []);

  /** Human-readable label for a visitor fingerprint */
  const getVisitorLabel = useCallback((ev: PageViewEvent): string => {
    const parts: string[] = [];
    if (ev.browser) parts.push(ev.browser);
    if (ev.os) parts.push(ev.os);
    if (ev.device && ev.device !== 'desktop') parts.push(ev.device);
    if (ev.screenWidth && ev.screenHeight) parts.push(`${ev.screenWidth}x${ev.screenHeight}`);
    if (ev.country) parts.push(countryFlag(ev.country));
    return parts.join(' / ') || 'Unknown visitor';
  }, []);

  const hiddenFingerprintSet = useMemo(
    () => new Set(hiddenVisitors.map(v => v.fingerprint)),
    [hiddenVisitors]
  );

  const filteredLogEvents = useMemo(() => {
    if (hiddenFingerprintSet.size === 0) return logEvents;
    return logEvents.filter(ev => !hiddenFingerprintSet.has(getVisitorFingerprint(ev)));
  }, [logEvents, hiddenFingerprintSet, getVisitorFingerprint]);

  /** IDs of rows that start a new session — used for visual grouping in the log table */
  const sessionBoundaries = useMemo(() => {
    const boundaries = new Set<string>();
    let lastSid = '';
    for (const ev of filteredLogEvents) {
      if (ev.sessionId !== lastSid) {
        boundaries.add(ev.id);
        lastSid = ev.sessionId;
      }
    }
    return boundaries;
  }, [filteredLogEvents]);

  /** Count how many raw events in current page are hidden */
  const hiddenCountInPage = logEvents.length - filteredLogEvents.length;

  const fetchHiddenVisitors = useCallback(async () => {
    try {
      const list = await api.fetchHiddenVisitors();
      setHiddenVisitors(list);
    } catch (err: any) {
      console.warn('[HiddenVisitors] Load failed:', err.message);
    }
  }, []);

  const handleHideVisitor = useCallback(async (ev: PageViewEvent) => {
    const fp = getVisitorFingerprint(ev);
    const label = getVisitorLabel(ev);
    try {
      const res = await api.addHiddenVisitor(fp, label);
      setHiddenVisitors(res.list);
      toast.success('Visitor hidden from log');
    } catch (err: any) {
      console.error('[HiddenVisitors] Add failed:', err);
      toast.error(`Failed to hide visitor: ${err.message}`);
    }
  }, [getVisitorFingerprint, getVisitorLabel]);

  const handleUnhideVisitor = useCallback(async (fp: string) => {
    try {
      const res = await api.removeHiddenVisitor(fp);
      setHiddenVisitors(res.list);
      toast.success('Visitor restored');
    } catch (err: any) {
      console.error('[HiddenVisitors] Remove failed:', err);
      toast.error(`Failed to unhide visitor: ${err.message}`);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [d, tp, ref, vis] = await Promise.all([
        api.fetchDailyPageViews().catch(() => []),
        api.fetchTopPages(50).catch(() => []),
        api.fetchReferrers().catch(() => []),
        api.fetchVisitorInsights().catch(() => null),
      ]);
      setDaily(d);
      setTopPages(tp);
      setReferrers(ref.filter(r => !isIgnoredReferrer(r.domain)));
      setVisitors(vis);
    } catch (err: any) {
      console.error('[Traffic] Fetch error:', err);
      toast.error('Failed to load traffic data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLog = useCallback(async (page: number) => {
    try {
      const res = await api.fetchPageViewLog(LOG_PER_PAGE, page * LOG_PER_PAGE);
      setLogEvents(res.events.filter(ev => !isIgnoredReferrer(ev.referrerDomain || '')));
      setLogTotal(res.total);
    } catch (err: any) {
      console.error('[Traffic] Log fetch error:', err);
      toast.error('Failed to load page view log');
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { if (view === 'log') fetchLog(logPage); }, [view, logPage, fetchLog]);
  useEffect(() => { fetchHiddenVisitors(); }, [fetchHiddenVisitors]);

  // Stats
  const totalViews = useMemo(() => daily.reduce((s, d) => s + d.count, 0), [daily]);
  const todayViews = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return daily.find(d => d.date === today)?.count || 0;
  }, [daily]);
  const uniquePages = topPages.length;
  const avgPerDay = useMemo(() => {
    if (daily.length === 0) return 0;
    return Math.round(totalViews / daily.length);
  }, [daily, totalViews]);

  // Chart data — last 30 days
  const chartData = useMemo(() => {
    // Deduplicate by date and filter out null/undefined dates
    const seen = new Set<string>();
    const deduped = daily.filter(d => {
      if (!d.date || seen.has(d.date)) return false;
      seen.add(d.date);
      return true;
    });
    if (deduped.length <= 30) return deduped;
    return deduped.slice(-30);
  }, [daily]);

  const logTotalPages = Math.ceil(logTotal / LOG_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Eye className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Traffic</h2>
            <p className="text-muted-foreground text-xs font-medium">Page views, top pages, and traffic sources</p>
          </div>
        </div>
        <button
          onClick={() => { fetchAll(); if (view === 'log') fetchLog(logPage); }}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Total Views</p>
          <p className="text-xl font-semibold text-foreground mt-1">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Today</p>
          <p className="text-xl font-semibold text-foreground mt-1">{todayViews.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Avg / Day</p>
          <p className="text-xl font-semibold text-foreground mt-1">{avgPerDay.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Unique Pages</p>
          <p className="text-xl font-semibold text-foreground mt-1">{uniquePages}</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border w-fit">
        {([
          { key: 'overview', label: 'Overview', icon: BarChart3 },
          { key: 'pages', label: 'Top Pages', icon: Trophy },
          { key: 'referrers', label: 'Referrers', icon: Globe },
          { key: 'log', label: 'Log', icon: List },
        ] as { key: TrafficView; label: string; icon: React.ElementType }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              view === tab.key
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ Overview ═══ */}
      {view === 'overview' && (
        <div className="space-y-6">
          {/* Daily BarChart */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-foreground">Daily Page Views</h3>
              <span className="text-[10px] font-medium text-muted-foreground ml-auto">Last 30 days</span>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="pvGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => { try { return format(parseISO(d), 'MMM d'); } catch { return d; } }}
                    tick={{ fontSize: 10, fill: isDark ? '#888' : '#999' }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: isDark ? '#888' : '#999' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="count" fill="url(#pvGradient)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm font-medium">
                {loading ? 'Loading...' : 'No page view data yet'}
              </div>
            )}
          </div>

          {/* ── New vs Returning Visitors ── */}
          {visitors && visitors.summary.totalUnique > 0 && (() => {
            const { summary, daily: visitorDaily } = visitors;
            // Deduplicate visitor daily data by date, filter nulls
            const seenDates = new Set<string>();
            const dedupedVisitor = visitorDaily.filter(d => {
              if (!d.date || seenDates.has(d.date)) return false;
              seenDates.add(d.date);
              return true;
            });
            const visitorChartData = dedupedVisitor.length <= 30 ? dedupedVisitor : dedupedVisitor.slice(-30);
            const newPct = summary.totalUnique > 0 ? Math.round((summary.newCount / summary.totalUnique) * 100) : 0;
            const retPct = 100 - newPct;

            return (
              <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-foreground">New vs Returning Visitors</h3>
                  <span className="text-[10px] font-medium text-muted-foreground/60 ml-auto">Fingerprint-based estimation</span>
                </div>

                {/* Summary stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-muted/30 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="w-3 h-3 text-muted-foreground/60" />
                      <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Unique Visitors</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{summary.totalUnique.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-500/5 rounded-xl p-3 border border-orange-500/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <UserPlus className="w-3 h-3 text-orange-400" />
                      <p className="text-[9px] font-semibold text-orange-500/70 uppercase tracking-wider">New</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      {summary.newCount.toLocaleString()}
                      <span className="text-xs font-medium text-muted-foreground ml-1.5">{newPct}%</span>
                    </p>
                  </div>
                  <div className="bg-orange-600/5 rounded-xl p-3 border border-orange-600/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <UserCheck className="w-3 h-3 text-orange-600" />
                      <p className="text-[9px] font-semibold text-orange-600/70 uppercase tracking-wider">Returning</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      {summary.returningCount.toLocaleString()}
                      <span className="text-xs font-medium text-muted-foreground ml-1.5">{retPct}%</span>
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3 h-3 text-muted-foreground/60" />
                      <p className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Return Rate</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{summary.returnRate}%</p>
                  </div>
                </div>

                {/* Ratio bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      <span>New ({newPct}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-600" />
                      <span>Returning ({retPct}%)</span>
                    </div>
                  </div>
                  <div className="h-3 bg-muted/50 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-orange-400 transition-all"
                      style={{ width: `${newPct}%` }}
                    />
                    <div
                      className="h-full bg-orange-600 transition-all"
                      style={{ width: `${retPct}%` }}
                    />
                  </div>
                </div>

                {/* Stacked bar chart */}
                {visitorChartData.length > 1 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-medium text-muted-foreground mb-3">Daily breakdown (last 30 days)</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={visitorChartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                        <defs>
                          <linearGradient id="newVisGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fb923c" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#fb923c" stopOpacity={0.4} />
                          </linearGradient>
                          <linearGradient id="retVisGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ea580c" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#ea580c" stopOpacity={0.4} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(d) => { try { return format(parseISO(d), 'MMM d'); } catch { return d; } }}
                          tick={{ fontSize: 10, fill: isDark ? '#888' : '#999' }}
                          axisLine={false}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: isDark ? '#888' : '#999' }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<VisitorChartTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                        <Bar dataKey="returningVisitors" stackId="visitors" fill="url(#retVisGradient)" radius={[0, 0, 0, 0]} maxBarSize={32} />
                        <Bar dataKey="newVisitors" stackId="visitors" fill="url(#newVisGradient)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Quick insights: Route type breakdown */}
          {topPages.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-foreground">Traffic by Page Type</h3>
              </div>
              <div className="space-y-2">
                {(() => {
                  const typeMap = new Map<string, number>();
                  for (const p of topPages) {
                    typeMap.set(p.routeType, (typeMap.get(p.routeType) || 0) + p.count);
                  }
                  const total = [...typeMap.values()].reduce((s, c) => s + c, 0);
                  const sorted = [...typeMap.entries()].sort((a, b) => b[1] - a[1]);
                  return sorted.map(([type, count]) => {
                    const pct = total > 0 ? (count / total * 100) : 0;
                    const cfg = ROUTE_TYPE_LABELS[type] || ROUTE_TYPE_LABELS.other;
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <RouteTypeBadge type={type} />
                        <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-orange-500/60 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground w-16 text-right">
                          {count.toLocaleString()} <span className="text-muted-foreground/50">({pct.toFixed(0)}%)</span>
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* Top 5 referrers quick card */}
          {referrers.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-semibold text-foreground">Top Traffic Sources</h3>
                </div>
                <button
                  onClick={() => setView('referrers')}
                  className="text-[10px] font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-0.5"
                >
                  See all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {referrers.slice(0, 5).map((ref, i) => {
                  const maxCount = referrers[0]?.count || 1;
                  const pct = (ref.count / maxCount) * 100;
                  return (
                    <div key={ref.domain} className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold text-muted-foreground/50 w-4 text-right">{i + 1}</span>
                      <span className="text-xs font-medium text-foreground min-w-[120px] truncate">{ref.domain}</span>
                      <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-500/50 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground w-12 text-right">{ref.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ Top Pages ═══ */}
      {view === 'pages' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Route</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">Views</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">Visitors</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {topPages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm font-medium">
                      {loading ? 'Loading...' : 'No page view data yet'}
                    </td>
                  </tr>
                ) : topPages.map((page, i) => {
                  const maxCount = topPages[0]?.count || 1;
                  const pct = (page.count / maxCount) * 100;
                  return (
                    <tr key={page.route} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-medium text-muted-foreground/50">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground truncate max-w-[300px]">{page.route}</span>
                          {page.tickerContext && (
                            <span className="px-1.5 py-0.5 bg-muted rounded text-[9px] font-semibold text-muted-foreground uppercase">
                              {page.tickerContext}
                            </span>
                          )}
                        </div>
                        {/* Visual bar */}
                        <div className="mt-1.5 h-1 bg-muted/50 rounded-full overflow-hidden max-w-[200px]">
                          <div className="h-full rounded-full bg-orange-500/50" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <RouteTypeBadge type={page.routeType} />
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-foreground text-right">{page.count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">{page.uniqueVisitors}</td>
                      <td className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">{formatTimeAgo(page.lastViewedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ Referrers ═══ */}
      {view === 'referrers' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">Views</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">Visitors</th>
                  <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {referrers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm font-medium">
                      {loading ? 'Loading...' : 'No referrer data yet'}
                    </td>
                  </tr>
                ) : referrers.map((ref, i) => {
                  const maxCount = referrers[0]?.count || 1;
                  const pct = (ref.count / maxCount) * 100;
                  return (
                    <tr key={ref.domain} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-medium text-muted-foreground/50">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground">{ref.domain}</span>
                          {ref.domain !== 'direct' && (
                            <ExternalLink className="w-3 h-3 text-muted-foreground/40" />
                          )}
                        </div>
                        <div className="mt-1.5 h-1 bg-muted/50 rounded-full overflow-hidden max-w-[200px]">
                          <div className="h-full rounded-full bg-orange-500/50" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-foreground text-right">{ref.count.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">{ref.uniqueVisitors}</td>
                      <td className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">{formatTimeAgo(ref.lastSeenAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ Log ═══ */}
      {view === 'log' && (
        <div className="space-y-4">
          {/* Hidden visitors banner */}
          {hiddenVisitors.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-orange-500/5 border border-orange-500/15 rounded-xl">
              <EyeOff className="w-4 h-4 text-orange-500 shrink-0" />
              <p className="text-[11px] font-medium text-muted-foreground flex-1">
                <span className="font-semibold text-foreground">{hiddenVisitors.length}</span> visitor{hiddenVisitors.length !== 1 ? 's' : ''} hidden
                {hiddenCountInPage > 0 && (
                  <span className="text-orange-600 dark:text-orange-400"> ({hiddenCountInPage} on this page)</span>
                )}
              </p>
              <button
                onClick={() => setShowHiddenManager(!showHiddenManager)}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
              >
                <Shield className="w-3 h-3" />
                {showHiddenManager ? 'Close' : 'Manage'}
              </button>
            </div>
          )}

          {/* Hidden visitors manager */}
          {showHiddenManager && hiddenVisitors.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <ShieldOff className="w-3.5 h-3.5 text-muted-foreground" />
                <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Hidden Visitors</h4>
              </div>
              {hiddenVisitors.map(v => (
                <div key={v.fingerprint} className="flex items-center gap-3 px-3 py-2 bg-muted/30 rounded-lg group">
                  <EyeOff className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-medium text-foreground block truncate">{v.label}</span>
                    <span className="text-[9px] text-muted-foreground/50 font-mono block truncate">{v.fingerprint}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground/50 shrink-0">{formatTimeAgo(v.hiddenAt)}</span>
                  <button
                    onClick={() => handleUnhideVisitor(v.fingerprint)}
                    className="p-1 rounded-md text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Unhide this visitor"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Route</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Source</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Visitor</th>
                    <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider text-right">When</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm font-medium">
                        {loading ? 'Loading...' : logEvents.length > 0 ? 'All events on this page are from hidden visitors' : 'No page views recorded yet'}
                      </td>
                    </tr>
                  ) : filteredLogEvents.map((ev) => {
                    const isSessionStart = sessionBoundaries.has(ev.id);
                    const isInternal = !isSessionStart && (!ev.referrerDomain || ev.referrerDomain === 'direct');
                    return (
                    <tr key={ev.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors group${isSessionStart ? ' border-t border-t-border/60' : ''}`}>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-foreground truncate block max-w-[240px]">{ev.route}</span>
                        {ev.tickerContext && (
                          <span className="text-[10px] font-medium text-muted-foreground mt-0.5 block">{ev.tickerContext.toUpperCase()}{ev.networkContext ? ` / ${ev.networkContext}` : ''}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <RouteTypeBadge type={ev.routeType} />
                      </td>
                      <td className="px-4 py-3">
                        {isInternal ? (
                          <span className="text-[10px] text-muted-foreground/40 font-medium">↩ internal</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground">{ev.referrerDomain || 'direct'}</span>
                            {isSessionStart && ev.sessionId && (
                              <span className="text-[9px] font-mono text-muted-foreground/30 bg-muted/50 px-1 py-0.5 rounded">
                                {ev.sessionId.slice(0, 6)}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {ev.country && <span className="text-xs">{countryFlag(ev.country)}</span>}
                          <DeviceIcon device={ev.device} className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] font-medium text-muted-foreground">{ev.browser}</span>
                          {ev.os && <span className="text-[9px] text-muted-foreground/40 hidden md:inline">{ev.os}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs font-medium text-muted-foreground">{formatTimeAgo(ev.timestamp)}</span>
                      </td>
                      <td className="px-2 py-3">
                        <button
                          onClick={() => handleHideVisitor(ev)}
                          className="p-1 rounded-md text-muted-foreground/30 hover:text-orange-500 hover:bg-orange-500/10 transition-all opacity-0 group-hover:opacity-100"
                          title="Hide all events from this visitor"
                        >
                          <EyeOff className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {logTotalPages > 1 && (
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>
                {logTotal.toLocaleString()} total events
                {hiddenCountInPage > 0 && (
                  <span className="text-orange-500 ml-1">({hiddenCountInPage} hidden)</span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLogPage(p => Math.max(0, p - 1))}
                  disabled={logPage === 0}
                  className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  {logPage + 1} / {logTotalPages}
                </span>
                <button
                  onClick={() => setLogPage(p => Math.min(logTotalPages - 1, p + 1))}
                  disabled={logPage >= logTotalPages - 1}
                  className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};