/**
 * ClicksPanel — Control Room tab for tracking "Open Product" clicks.
 * Three sub-tabs: Log (individual events) · Live Feed (aggregated) · Ranking.
 * Bar chart for daily timeline. Product cell mirrors TrackerTable.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MousePointerClick, RefreshCw, TrendingUp, Activity, Trophy,
  ChevronLeft, ChevronRight, BarChart3, List,
  Monitor, Smartphone, Tablet, Globe, Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import * as api from '@/app/utils/api';
import type { ClickRecord, DailyClickRecord, ClickEvent } from '@/app/utils/api';
import { useRegistry } from '@/app/contexts/RegistryContext';
import { useDarkMode } from '@/app/utils/useDarkMode';

type ClicksView = 'log' | 'feed' | 'ranking';
const PER_PAGE = 50;
const LOG_PER_PAGE = 50;

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

const titleCase = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());

const DeviceIcon: React.FC<{ device: string; className?: string }> = ({ device, className = 'w-3 h-3' }) => {
  if (device === 'mobile') return <Smartphone className={className} />;
  if (device === 'tablet') return <Tablet className={className} />;
  return <Monitor className={className} />;
};

/** Country code → flag emoji */
const countryFlag = (code: string): string => {
  if (!code || code.length !== 2) return '';
  const c = code.toUpperCase();
  return String.fromCodePoint(...[...c].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65));
};

// ── Product Cell — mirrors TrackerTable ──────────────────────

const ProductCell: React.FC<{
  item: { productName: string; platform: string; ticker: string; network: string; curator: string };
  resolveAssetIcon: (t: string) => string | null;
  resolveNetworkIcon: (n: string) => string;
  compact?: boolean;
}> = ({ item, resolveAssetIcon, resolveNetworkIcon, compact = false }) => {
  const hasCurator = item.curator && item.curator !== '-' && item.curator.trim() !== '';

  return (
    <div className="flex items-center min-w-0">
      <div className="flex items-center shrink-0">
        <div
          className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} rounded-full bg-background border border-border flex items-center justify-center overflow-hidden shrink-0`}
          title={item.network}
        >
          <img
            src={resolveNetworkIcon(item.network)}
            alt={item.network}
            className={`${compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} object-contain`}
          />
        </div>
        <div className={`${compact ? 'w-5 h-5' : 'w-7 h-7'} flex items-center justify-center shrink-0 ml-1`}>
          {resolveAssetIcon(item.ticker) ? (
            <img
              src={resolveAssetIcon(item.ticker)!}
              alt={item.ticker}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} rounded-full bg-muted flex items-center justify-center`}>
              <span className="text-[8px] font-semibold text-foreground">
                {(item.ticker || '?')[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <span className="hidden lg:inline text-[13px] font-medium text-foreground ml-2 shrink-0">
          {item.ticker?.toUpperCase()}
        </span>
      )}

      <div className={`flex flex-col min-w-0 ${compact ? 'ml-1.5' : 'ml-2 lg:ml-3'}`}>
        <span className={`${compact ? 'text-[11px]' : 'text-[13px]'} font-semibold text-foreground leading-tight truncate max-w-[240px]`}>
          {item.productName}
          {hasCurator && (
            <span className="font-medium text-muted-foreground">
              {' '}• {titleCase(item.curator)}
            </span>
          )}
        </span>
        <span className={`${compact ? 'text-[9px]' : 'text-[10px]'} text-muted-foreground truncate tracking-wide font-normal mt-0.5`}>
          {item.platform}
        </span>
      </div>
    </div>
  );
};

// ── Aggregated Click Row (Feed/Ranking) ──────────────────────

const ClickRow: React.FC<{
  item: ClickRecord;
  rank: number;
  showRank?: boolean;
  resolveAssetIcon: (t: string) => string | null;
  resolveNetworkIcon: (n: string) => string;
}> = ({ item, rank, showRank = true, resolveAssetIcon, resolveNetworkIcon }) => (
  <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 px-4 py-2.5 items-center hover:bg-muted/20 transition-colors">
    {showRank ? (
      <span className="text-[11px] font-normal text-muted-foreground/60 tabular-nums w-8 shrink-0 text-right">
        {rank}
      </span>
    ) : (
      <span className="w-0" />
    )}
    <ProductCell
      item={item}
      resolveAssetIcon={resolveAssetIcon}
      resolveNetworkIcon={resolveNetworkIcon}
    />
    <div className="w-16 text-right">
      <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 bg-[#08a671]/10 text-[#08a671] rounded-md text-xs font-semibold tabular-nums">
        {item.count}
      </span>
    </div>
    <div className="w-20 text-right hidden sm:block">
      <span className="text-[10px] font-medium text-muted-foreground">
        {item.lastClickedAt ? formatTimeAgo(item.lastClickedAt) : '—'}
      </span>
    </div>
  </div>
);

// ── Individual Click Event Row (Log) ─────────────────────────

const LogRow: React.FC<{
  event: ClickEvent;
  resolveAssetIcon: (t: string) => string | null;
  resolveNetworkIcon: (n: string) => string;
}> = ({ event, resolveAssetIcon, resolveNetworkIcon }) => {
  let formattedTime = '';
  try {
    formattedTime = format(parseISO(event.timestamp), 'MMM dd, HH:mm:ss');
  } catch {
    formattedTime = event.timestamp;
  }

  return (
    <div className="px-4 py-3 hover:bg-muted/20 transition-colors">
      {/* Top row: product + timestamp */}
      <div className="flex items-center justify-between gap-3">
        <ProductCell
          item={event}
          resolveAssetIcon={resolveAssetIcon}
          resolveNetworkIcon={resolveNetworkIcon}
          compact
        />
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
            {formattedTime}
          </span>
          <span className="text-[9px] text-muted-foreground/50 font-medium">
            {formatTimeAgo(event.timestamp)}
          </span>
        </div>
      </div>

      {/* Bottom row: user details pills */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2 ml-[44px]">
        {/* Country + Flag */}
        {event.country && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/50 rounded-md text-[9px] font-medium text-muted-foreground">
            <span>{countryFlag(event.country)}</span>
            {event.country}
            {event.city && <span className="text-muted-foreground/50">· {decodeURIComponent(event.city)}</span>}
          </span>
        )}

        {/* Device + OS */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/50 rounded-md text-[9px] font-medium text-muted-foreground">
          <DeviceIcon device={event.device} className="w-2.5 h-2.5 text-muted-foreground/60" />
          {event.os || event.device}
        </span>

        {/* Browser */}
        {event.browser && event.browser !== 'Unknown' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/50 rounded-md text-[9px] font-medium text-muted-foreground">
            <Globe className="w-2.5 h-2.5 text-muted-foreground/60" />
            {event.browser}
          </span>
        )}

        {/* Screen */}
        {event.screenWidth > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/50 rounded-md text-[9px] font-medium text-muted-foreground tabular-nums">
            {event.screenWidth}×{event.screenHeight}
          </span>
        )}

        {/* Language */}
        {event.language && (
          <span className="inline-flex items-center px-2 py-0.5 bg-muted/50 rounded-md text-[9px] font-medium text-muted-foreground">
            {event.language}
          </span>
        )}

        {/* Timezone */}
        {event.timezone && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/50 rounded-md text-[9px] font-medium text-muted-foreground/60">
            <Clock className="w-2.5 h-2.5" />
            {event.timezone.replace(/_/g, ' ')}
          </span>
        )}

        {/* Referrer */}
        {event.referrer && (
          <span className="inline-flex items-center px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-md text-[9px] font-medium truncate max-w-[180px]" title={event.referrer}>
            {(() => {
              try { return new URL(event.referrer).hostname; } catch { return event.referrer; }
            })()}
          </span>
        )}

        {/* IP (masked last octet) */}
        {event.ip && (
          <span className="inline-flex items-center px-2 py-0.5 bg-muted/30 rounded-md text-[9px] font-normal text-muted-foreground/40 tabular-nums">
            {event.ip.replace(/\.\d+$/, '.*')}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Column Headers ───────────────────────────────────────────

const ColumnHeader: React.FC<{ showRank: boolean }> = ({ showRank }) => (
  <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 px-4 py-2.5 border-b border-border bg-muted/30 text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-[0.12em]">
    {showRank ? <span className="w-8 text-right">#</span> : <span className="w-0" />}
    <span>Product</span>
    <span className="text-right w-16">Clicks</span>
    <span className="text-right w-20 hidden sm:block">Last Click</span>
  </div>
);

const LogColumnHeader: React.FC = () => (
  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30 text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-[0.12em]">
    <span>Click Event</span>
    <span>Time</span>
  </div>
);

// ── Empty / Loading States ───────────────────────────────────

const EmptyState: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
    <MousePointerClick className="w-8 h-8 text-muted-foreground/30 mb-3" />
    <p className="text-sm text-muted-foreground font-medium">{message || 'No clicks recorded yet'}</p>
    <p className="text-xs text-muted-foreground/70 mt-1">
      Clicks on "Open Product" buttons will appear here
    </p>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-5 h-5 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
  </div>
);

// ── Chart Custom Tooltip ─────────────────────────────────────

const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const clickCount = payload[0].value;
  let formattedDate = label;
  try {
    formattedDate = format(parseISO(label), 'MMM dd, yyyy');
  } catch { /* keep raw */ }
  return (
    <div className="bg-card border border-border rounded-xl px-3.5 py-2.5 shadow-lg">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{formattedDate}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="w-2 h-2 rounded-full bg-[#08a671]" />
        <span className="text-sm font-semibold text-foreground tabular-nums">{clickCount}</span>
        <span className="text-[10px] text-muted-foreground font-medium">clicks</span>
      </div>
    </div>
  );
};

// ── Daily Clicks Bar Chart ───────────────────────────────────

const DailyClicksChart: React.FC<{ data: DailyClickRecord[]; loading: boolean }> = ({ data, loading }) => {
  const { isDark } = useDarkMode();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((d) => ({ date: d.date, clicks: d.count }));
  }, [data]);

  const gridColor = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)';
  const tickColor = isDark ? '#64748b' : '#94a3b8';

  const formatXTick = (dateStr: string) => {
    try { return format(parseISO(dateStr), 'MMM dd'); }
    catch { return dateStr; }
  };

  const tickInterval = chartData.length <= 14 ? 0 : Math.floor(chartData.length / 8);

  if (loading && data.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-[#08a671]" />
          <span className="text-[11px] font-semibold text-foreground">Daily Click Activity</span>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <div className="w-5 h-5 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-[#08a671]" />
          <span className="text-[11px] font-semibold text-foreground">Daily Click Activity</span>
        </div>
        <div className="flex flex-col items-center justify-center h-[200px] text-center px-4">
          <p className="text-xs text-muted-foreground font-medium">No daily data yet</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Chart will populate as clicks are tracked</p>
        </div>
      </div>
    );
  }

  const totalInRange = chartData.reduce((sum, d) => sum + d.clicks, 0);
  const peakDay = chartData.reduce((max, d) => (d.clicks > max.clicks ? d : max), chartData[0]);
  let peakLabel = '';
  try { peakLabel = format(parseISO(peakDay.date), 'MMM dd'); }
  catch { peakLabel = peakDay.date; }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-[#08a671]" />
          <span className="text-[11px] font-semibold text-foreground">Daily Click Activity</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Peak</span>
            <span className="text-[10px] font-semibold text-foreground tabular-nums">{peakDay.clicks}</span>
            <span className="text-[9px] text-muted-foreground/50 font-medium">({peakLabel})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Total</span>
            <span className="text-[10px] font-semibold text-foreground tabular-nums">{totalInRange}</span>
          </div>
        </div>
      </div>
      <div className="px-2 pt-4 pb-2">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 20, left: 0, bottom: 0 }} barCategoryGap="20%">
            <defs>
              <linearGradient id="clicksBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#08a671" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#08a671" stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXTick}
              tick={{ fontSize: 10, fill: tickColor, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              interval={tickInterval}
              dy={6}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: tickColor, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', radius: 4 }} />
            <Bar
              dataKey="clicks"
              fill="url(#clicksBarGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────

export const ClicksPanel: React.FC = () => {
  const { resolveAssetIcon, resolveNetworkIcon } = useRegistry();
  const [clicks, setClicks] = useState<ClickRecord[]>([]);
  const [dailyClicks, setDailyClicks] = useState<DailyClickRecord[]>([]);
  const [clickLog, setClickLog] = useState<ClickEvent[]>([]);
  const [logTotal, setLogTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(true);
  const [view, setView] = useState<ClicksView>('log');
  const [page, setPage] = useState(1);
  const [logPage, setLogPage] = useState(1);

  const fetchClicks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.fetchClicks();
      setClicks(data || []);
    } catch (err: any) {
      console.error('[ClicksPanel] Fetch error:', err);
      toast.error('Failed to load click data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDaily = useCallback(async () => {
    try {
      setDailyLoading(true);
      const data = await api.fetchDailyClicks();
      setDailyClicks(data || []);
    } catch (err: any) {
      console.error('[ClicksPanel] Daily fetch error:', err);
    } finally {
      setDailyLoading(false);
    }
  }, []);

  const fetchLog = useCallback(async (pageNum: number = 1) => {
    try {
      setLogLoading(true);
      const offset = (pageNum - 1) * LOG_PER_PAGE;
      const data = await api.fetchClickLog(LOG_PER_PAGE, offset);
      setClickLog(data.events || []);
      setLogTotal(data.total || 0);
    } catch (err: any) {
      console.error('[ClicksPanel] Log fetch error:', err);
      toast.error('Failed to load click log');
    } finally {
      setLogLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchClicks(), fetchDaily(), fetchLog(logPage)]);
  }, [fetchClicks, fetchDaily, fetchLog, logPage]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Reset pagination when switching views
  useEffect(() => {
    setPage(1);
    setLogPage(1);
  }, [view]);

  // Refetch log when page changes
  useEffect(() => {
    if (view === 'log') fetchLog(logPage);
  }, [logPage, view, fetchLog]);

  const totalClicks = clicks.reduce((sum, c) => sum + c.count, 0);

  // Feed: sorted by most recent activity
  const feedItems = useMemo(
    () => [...clicks].sort((a, b) =>
      new Date(b.lastClickedAt).getTime() - new Date(a.lastClickedAt).getTime(),
    ),
    [clicks],
  );

  // Ranking: sorted by count desc
  const rankedItems = useMemo(
    () => [...clicks].sort((a, b) => b.count - a.count),
    [clicks],
  );

  const totalPages = Math.max(1, Math.ceil(rankedItems.length / PER_PAGE));
  const pagedItems = rankedItems.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const rankOffset = (page - 1) * PER_PAGE;
  const logTotalPages = Math.max(1, Math.ceil(logTotal / LOG_PER_PAGE));

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#08a671]/10 flex items-center justify-center">
            <MousePointerClick className="w-4 h-4 text-[#08a671]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Product Clicks</h2>
            <p className="text-[10px] text-muted-foreground font-medium">
              Real user clicks — bots filtered server-side
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-xl border border-border">
            <TrendingUp className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground tabular-nums">{totalClicks}</span>
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">total</span>
          </div>
          <button
            onClick={refreshAll}
            disabled={loading || logLoading}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || logLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Daily timeline chart */}
      <DailyClicksChart data={dailyClicks} loading={dailyLoading} />

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-0.5 bg-muted/40 rounded-xl border border-border/60 w-fit">
        <button
          onClick={() => setView('log')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold transition-all ${
            view === 'log'
              ? 'bg-card text-foreground shadow-sm border border-border/80'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <List className="w-3 h-3" />
          Log
          {logTotal > 0 && (
            <span className="text-[9px] font-medium text-muted-foreground/60 tabular-nums">{logTotal}</span>
          )}
        </button>
        <button
          onClick={() => setView('feed')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold transition-all ${
            view === 'feed'
              ? 'bg-card text-foreground shadow-sm border border-border/80'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity className="w-3 h-3" />
          Feed
        </button>
        <button
          onClick={() => setView('ranking')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold transition-all ${
            view === 'ranking'
              ? 'bg-card text-foreground shadow-sm border border-border/80'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Trophy className="w-3 h-3" />
          Ranking
        </button>
      </div>

      {/* ═══ Log (individual events) ═══ */}
      {view === 'log' && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {logLoading && clickLog.length === 0 ? (
            <LoadingState />
          ) : clickLog.length === 0 ? (
            <EmptyState message="No individual click events yet" />
          ) : (
            <div className="overflow-x-auto">
              <LogColumnHeader />
              <div className="divide-y divide-border/50">
                {clickLog.map((event) => (
                  <LogRow
                    key={event.id}
                    event={event}
                    resolveAssetIcon={resolveAssetIcon}
                    resolveNetworkIcon={resolveNetworkIcon}
                  />
                ))}
              </div>
            </div>
          )}

          {clickLog.length > 0 && (
            <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between">
              <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                <span className="inline-block w-1.5 h-1.5 bg-[#08a671] rounded-full mr-1.5 align-middle" />
                {logTotal} events · 1 click per row · newest first
              </span>

              {logTotalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                    disabled={logPage === 1}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-semibold text-muted-foreground tabular-nums px-1.5">
                    {logPage} / {logTotalPages}
                  </span>
                  <button
                    onClick={() => setLogPage((p) => Math.min(logTotalPages, p + 1))}
                    disabled={logPage === logTotalPages}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ Live Feed (aggregated) ═══ */}
      {view === 'feed' && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {loading && clicks.length === 0 ? (
            <LoadingState />
          ) : clicks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <ColumnHeader showRank={false} />
              <div className="divide-y divide-border/50">
                {feedItems.map((item, idx) => (
                  <ClickRow
                    key={item.slug}
                    item={item}
                    rank={idx + 1}
                    showRank={false}
                    resolveAssetIcon={resolveAssetIcon}
                    resolveNetworkIcon={resolveNetworkIcon}
                  />
                ))}
              </div>
            </div>
          )}
          {clicks.length > 0 && (
            <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between">
              <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                <span className="inline-block w-1.5 h-1.5 bg-[#08a671] rounded-full mr-1.5 align-middle" />
                {clicks.length} products · sorted by recent activity
              </span>
              <span className="text-[9px] font-medium text-muted-foreground/40">Bot-filtered</span>
            </div>
          )}
        </div>
      )}

      {/* ═══ Ranking ═══ */}
      {view === 'ranking' && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {loading && clicks.length === 0 ? (
            <LoadingState />
          ) : clicks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <ColumnHeader showRank />
              <div className="divide-y divide-border/50">
                {pagedItems.map((item, idx) => (
                  <ClickRow
                    key={item.slug}
                    item={item}
                    rank={rankOffset + idx + 1}
                    showRank
                    resolveAssetIcon={resolveAssetIcon}
                    resolveNetworkIcon={resolveNetworkIcon}
                  />
                ))}
              </div>
            </div>
          )}
          {clicks.length > 0 && (
            <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between">
              <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                <span className="inline-block w-1.5 h-1.5 bg-[#08a671] rounded-full mr-1.5 align-middle" />
                {rankedItems.length} products · sorted by clicks
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-semibold text-muted-foreground tabular-nums px-1.5">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};