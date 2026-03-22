'use client';

/**
 * SearchesPanel — Control Room tab for tracking internal search queries.
 * Sub-tabs: Log (individual events) · Ranking (top keywords).
 * Bar chart for daily timeline. Maple Look typography (semibold/medium/normal).
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, RefreshCw, TrendingUp, Trophy, List,
  ChevronLeft, ChevronRight, BarChart3,
  Monitor, Smartphone, Tablet, Globe, Clock, Hash,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import * as api from '@/app/utils/api';
import type { SearchRecord, DailySearchRecord, SearchEvent } from '@/app/utils/api';
import { useDarkMode } from '@/app/utils/useDarkMode';

type SearchView = 'log' | 'ranking';
const LOG_PER_PAGE = 50;
const RANK_PER_PAGE = 50;

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

const DeviceIcon: React.FC<{ device: string; className?: string }> = ({ device, className = 'w-3 h-3' }) => {
  if (device === 'mobile') return <Smartphone className={className} />;
  if (device === 'tablet') return <Tablet className={className} />;
  return <Monitor className={className} />;
};

const countryFlag = (code: string): string => {
  if (!code || code.length !== 2) return '';
  const c = code.toUpperCase();
  return String.fromCodePoint(...[...c].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65));
};

// ── Ranking Row ──────────────────────────────────────────────

const RankingRow: React.FC<{
  item: SearchRecord;
  rank: number;
  maxCount: number;
}> = ({ item, rank, maxCount }) => {
  const barWidth = maxCount > 0 ? Math.max(4, (item.count / maxCount) * 100) : 0;

  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-3 items-center hover:bg-muted/20 transition-colors">
      <span className="text-[11px] font-normal text-muted-foreground/60 tabular-nums w-8 shrink-0 text-right">
        {rank}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground truncate">
            {item.queryRaw || item.query}
          </span>
          {item.avgResults === 0 && (
            <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded text-[8px] font-semibold uppercase tracking-wider shrink-0">
              0 results
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500/70 to-blue-500/30 transition-all duration-500"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
      <div className="w-16 text-right">
        <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md text-xs font-semibold tabular-nums">
          {item.count}
        </span>
      </div>
      <div className="w-12 text-right hidden sm:block">
        <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
          ~{item.avgResults}
        </span>
      </div>
      <div className="w-20 text-right hidden sm:block">
        <span className="text-[10px] font-medium text-muted-foreground">
          {item.lastSearchedAt ? formatTimeAgo(item.lastSearchedAt) : '—'}
        </span>
      </div>
    </div>
  );
};

// ── Log Row ──────────────────────────────────────────────────

const LogRow: React.FC<{ event: SearchEvent }> = ({ event }) => {
  let formattedTime = '';
  try {
    formattedTime = format(parseISO(event.timestamp), 'MMM dd, HH:mm:ss');
  } catch {
    formattedTime = event.timestamp;
  }

  return (
    <div className="px-4 py-3 hover:bg-muted/20 transition-colors">
      {/* Top row: query + timestamp */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Search className="w-3.5 h-3.5 text-blue-500/60 shrink-0" />
          <span className="text-[13px] font-semibold text-foreground truncate">
            {event.queryRaw || event.query}
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold tabular-nums shrink-0 ${
            event.resultsCount === 0
              ? 'bg-red-500/10 text-red-500'
              : 'bg-muted/60 text-muted-foreground'
          }`}>
            {event.resultsCount} result{event.resultsCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
            {formattedTime}
          </span>
          <span className="text-[9px] text-muted-foreground/50 font-medium">
            {formatTimeAgo(event.timestamp)}
          </span>
        </div>
      </div>

      {/* Bottom row: context + user pills */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2 ml-[22px]">
        {/* Page context */}
        {event.pageContext && event.pageContext !== '/' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-[9px] font-medium">
            <Hash className="w-2.5 h-2.5" />
            {event.pageContext}
          </span>
        )}

        {/* Ticker context */}
        {event.tickerContext && (
          <span className="inline-flex items-center px-2 py-0.5 bg-[#08a671]/10 text-[#08a671] rounded-md text-[9px] font-semibold uppercase">
            {event.tickerContext}
          </span>
        )}

        {/* Network context */}
        {event.networkContext && (
          <span className="inline-flex items-center px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md text-[9px] font-medium capitalize">
            {event.networkContext}
          </span>
        )}

        {/* Country */}
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

        {/* IP masked */}
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

const RankingColumnHeader: React.FC = () => (
  <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-2.5 border-b border-border bg-muted/30 text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-[0.12em]">
    <span className="w-8 text-right">#</span>
    <span>Query</span>
    <span className="text-right w-16">Count</span>
    <span className="text-right w-12 hidden sm:block">Avg Res</span>
    <span className="text-right w-20 hidden sm:block">Last</span>
  </div>
);

const LogColumnHeader: React.FC = () => (
  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30 text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-[0.12em]">
    <span>Search Event</span>
    <span>Time</span>
  </div>
);

// ── Empty / Loading ──────────────────────────────────────────

const EmptyState: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
    <Search className="w-8 h-8 text-muted-foreground/30 mb-3" />
    <p className="text-sm text-muted-foreground font-medium">{message || 'No searches recorded yet'}</p>
    <p className="text-xs text-muted-foreground/70 mt-1">
      User search queries will appear here automatically
    </p>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

// ── Chart Tooltip ────────────────────────────────────────────

const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const count = payload[0].value;
  let formattedDate = label;
  try { formattedDate = format(parseISO(label), 'MMM dd, yyyy'); } catch {}
  return (
    <div className="bg-card border border-border rounded-xl px-3.5 py-2.5 shadow-lg">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{formattedDate}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-sm font-semibold text-foreground tabular-nums">{count}</span>
        <span className="text-[10px] text-muted-foreground font-medium">searches</span>
      </div>
    </div>
  );
};

// ── Daily Chart ──────────────────────────────────────────────

const DailySearchChart: React.FC<{ data: DailySearchRecord[]; loading: boolean }> = ({ data, loading }) => {
  const { isDark } = useDarkMode();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(d => ({ date: d.date, searches: d.count }));
  }, [data]);

  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const tickColor = isDark ? '#64748b' : '#94a3b8';

  const formatXTick = (dateStr: string) => {
    try { return format(parseISO(dateStr), 'MMM dd'); } catch { return dateStr; }
  };

  const tickInterval = chartData.length <= 14 ? 0 : Math.floor(chartData.length / 8);

  if (loading && data.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-semibold text-foreground">Daily Search Activity</span>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-semibold text-foreground">Daily Search Activity</span>
        </div>
        <div className="flex flex-col items-center justify-center h-[200px] text-center px-4">
          <p className="text-xs text-muted-foreground font-medium">No daily data yet</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Chart will populate as searches are tracked</p>
        </div>
      </div>
    );
  }

  const totalInRange = chartData.reduce((sum, d) => sum + d.searches, 0);
  const peakDay = chartData.reduce((max, d) => (d.searches > max.searches ? d : max), chartData[0]);
  let peakLabel = '';
  try { peakLabel = format(parseISO(peakDay.date), 'MMM dd'); } catch { peakLabel = peakDay.date; }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-semibold text-foreground">Daily Search Activity</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Peak</span>
            <span className="text-[10px] font-semibold text-foreground tabular-nums">{peakDay.searches}</span>
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
              <linearGradient id="searchBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.35} />
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
              dataKey="searches"
              fill="url(#searchBarGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ── Zero-Results Summary Card ────────────────────────────────

const ZeroResultsCard: React.FC<{ searches: SearchRecord[] }> = ({ searches }) => {
  const zeroResults = useMemo(
    () => searches.filter(s => s.avgResults === 0).sort((a, b) => b.count - a.count).slice(0, 10),
    [searches],
  );

  if (zeroResults.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500/70" />
        <span className="text-[11px] font-semibold text-foreground">Top Zero-Result Queries</span>
        <span className="text-[9px] font-medium text-muted-foreground/60 ml-auto">{zeroResults.length} unique</span>
      </div>
      <div className="divide-y divide-border/30">
        {zeroResults.map(item => (
          <div key={item.query} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-3 h-3 text-red-400/60 shrink-0" />
              <span className="text-[12px] font-medium text-foreground truncate">{item.queryRaw || item.query}</span>
            </div>
            <span className="text-[10px] font-semibold text-red-500 tabular-nums shrink-0 ml-3">
              {item.count}x
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────

export const SearchesPanel: React.FC = () => {
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [dailySearches, setDailySearches] = useState<DailySearchRecord[]>([]);
  const [searchLog, setSearchLog] = useState<SearchEvent[]>([]);
  const [logTotal, setLogTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(true);
  const [view, setView] = useState<SearchView>('log');
  const [logPage, setLogPage] = useState(1);
  const [rankPage, setRankPage] = useState(1);

  const fetchSearches_ = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.fetchSearches();
      setSearches(data || []);
    } catch (err: any) {
      console.error('[SearchesPanel] Fetch error:', err);
      toast.error('Failed to load search data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDaily = useCallback(async () => {
    try {
      setDailyLoading(true);
      const data = await api.fetchDailySearches();
      setDailySearches(data || []);
    } catch (err: any) {
      console.error('[SearchesPanel] Daily fetch error:', err);
    } finally {
      setDailyLoading(false);
    }
  }, []);

  const fetchLog = useCallback(async (pageNum: number = 1) => {
    try {
      setLogLoading(true);
      const offset = (pageNum - 1) * LOG_PER_PAGE;
      const data = await api.fetchSearchLog(LOG_PER_PAGE, offset);
      setSearchLog(data.events || []);
      setLogTotal(data.total || 0);
    } catch (err: any) {
      console.error('[SearchesPanel] Log fetch error:', err);
      toast.error('Failed to load search log');
    } finally {
      setLogLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchSearches_(), fetchDaily(), fetchLog(logPage)]);
  }, [fetchSearches_, fetchDaily, fetchLog, logPage]);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  useEffect(() => { setLogPage(1); setRankPage(1); }, [view]);

  useEffect(() => {
    if (view === 'log') fetchLog(logPage);
  }, [logPage, view, fetchLog]);

  const totalSearches = searches.reduce((sum, s) => sum + s.count, 0);
  const uniqueQueries = searches.length;

  // Ranking with pagination
  const rankedItems = useMemo(() => [...searches].sort((a, b) => b.count - a.count), [searches]);
  const rankTotalPages = Math.max(1, Math.ceil(rankedItems.length / RANK_PER_PAGE));
  const pagedRanked = rankedItems.slice((rankPage - 1) * RANK_PER_PAGE, rankPage * RANK_PER_PAGE);
  const rankOffset = (rankPage - 1) * RANK_PER_PAGE;
  const maxCount = rankedItems.length > 0 ? rankedItems[0].count : 0;
  const logTotalPages = Math.max(1, Math.ceil(logTotal / LOG_PER_PAGE));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Search className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Search Analytics</h2>
            <p className="text-[10px] text-muted-foreground font-medium">
              What users search for — debounced, 2+ chars, bots filtered
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-xl border border-border">
            <TrendingUp className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground tabular-nums">{totalSearches}</span>
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">total</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-xl border border-border">
            <Hash className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground tabular-nums">{uniqueQueries}</span>
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">unique</span>
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

      {/* Daily chart */}
      <DailySearchChart data={dailySearches} loading={dailyLoading} />

      {/* Zero-results insight card */}
      <ZeroResultsCard searches={searches} />

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
          onClick={() => setView('ranking')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold transition-all ${
            view === 'ranking'
              ? 'bg-card text-foreground shadow-sm border border-border/80'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Trophy className="w-3 h-3" />
          Ranking
          {uniqueQueries > 0 && (
            <span className="text-[9px] font-medium text-muted-foreground/60 tabular-nums">{uniqueQueries}</span>
          )}
        </button>
      </div>

      {/* ═══ Log ═══ */}
      {view === 'log' && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {logLoading && searchLog.length === 0 ? (
            <LoadingState />
          ) : searchLog.length === 0 ? (
            <EmptyState message="No individual search events yet" />
          ) : (
            <div className="overflow-x-auto">
              <LogColumnHeader />
              <div className="divide-y divide-border/50">
                {searchLog.map(event => (
                  <LogRow key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {searchLog.length > 0 && (
            <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between">
              <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 align-middle" />
                {logTotal} events · newest first
              </span>
              {logTotalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLogPage(p => Math.max(1, p - 1))}
                    disabled={logPage === 1}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-semibold text-muted-foreground tabular-nums px-1.5">
                    {logPage} / {logTotalPages}
                  </span>
                  <button
                    onClick={() => setLogPage(p => Math.min(logTotalPages, p + 1))}
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

      {/* ═══ Ranking ═══ */}
      {view === 'ranking' && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {loading && searches.length === 0 ? (
            <LoadingState />
          ) : searches.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <RankingColumnHeader />
              <div className="divide-y divide-border/50">
                {pagedRanked.map((item, idx) => (
                  <RankingRow
                    key={item.query}
                    item={item}
                    rank={rankOffset + idx + 1}
                    maxCount={maxCount}
                  />
                ))}
              </div>
            </div>
          )}

          {searches.length > 0 && (
            <div className="px-4 py-2 border-t border-border bg-muted/20 flex items-center justify-between">
              <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 align-middle" />
                {uniqueQueries} unique queries · {totalSearches} total searches
              </span>
              {rankTotalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRankPage(p => Math.max(1, p - 1))}
                    disabled={rankPage === 1}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-semibold text-muted-foreground tabular-nums px-1.5">
                    {rankPage} / {rankTotalPages}
                  </span>
                  <button
                    onClick={() => setRankPage(p => Math.min(rankTotalPages, p + 1))}
                    disabled={rankPage === rankTotalPages}
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
