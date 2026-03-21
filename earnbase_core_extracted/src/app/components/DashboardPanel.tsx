/**
 * DashboardPanel — Control Room default landing tab.
 * Key stats: Total Clicks, Search Traffic Visitors, AI Visitors.
 * Below: raw traffic log (search + AI only) with time/page/source/identity/device.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  MousePointerClick, Search, Bot, RefreshCw,
  Monitor, Smartphone, Tablet, Globe, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/app/utils/api';
import type { PageViewEvent } from '@/app/utils/api';
import { format, parseISO } from 'date-fns';

/* ── Source classification ─────────────────────────────────── */

const SEARCH_DOMAINS = [
  'google', 'bing', 'duckduckgo', 'yahoo', 'baidu', 'yandex',
  'ecosia', 'startpage', 'brave', 'qwant', 'sogou', 'naver',
];

const AI_DOMAINS = [
  'chatgpt', 'chat.openai', 'openai', 'perplexity', 'claude',
  'anthropic', 'you.com', 'phind', 'copilot.microsoft', 'gemini',
  'bard', 'poe.com', 'kagi',
];

type SourceType = 'search' | 'ai' | 'direct' | 'other';

const classifySource = (domain: string): SourceType => {
  if (!domain || domain === 'direct') return 'direct';
  const d = domain.toLowerCase();
  if (SEARCH_DOMAINS.some(s => d.includes(s))) return 'search';
  if (AI_DOMAINS.some(s => d.includes(s))) return 'ai';
  return 'other';
};

/** Friendly name for referrer domain */
const sourceName = (domain: string): string => {
  if (!domain || domain === 'direct') return 'Direct';
  const d = domain.toLowerCase();
  if (d.includes('google')) return 'Google';
  if (d.includes('bing')) return 'Bing';
  if (d.includes('duckduckgo')) return 'DuckDuckGo';
  if (d.includes('yahoo')) return 'Yahoo';
  if (d.includes('baidu')) return 'Baidu';
  if (d.includes('yandex')) return 'Yandex';
  if (d.includes('ecosia')) return 'Ecosia';
  if (d.includes('brave')) return 'Brave';
  if (d.includes('chatgpt') || d.includes('openai')) return 'ChatGPT';
  if (d.includes('perplexity')) return 'Perplexity';
  if (d.includes('claude') || d.includes('anthropic')) return 'Claude';
  if (d.includes('you.com')) return 'You.com';
  if (d.includes('phind')) return 'Phind';
  if (d.includes('copilot')) return 'Copilot';
  if (d.includes('gemini') || d.includes('bard')) return 'Gemini';
  if (d.includes('poe')) return 'Poe';
  if (d.includes('kagi')) return 'Kagi';
  return domain;
};

const SOURCE_BADGE: Record<SourceType, { color: string; bg: string }> = {
  search: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  ai:     { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
  direct: { color: 'text-gray-500', bg: 'bg-gray-500/10' },
  other:  { color: 'text-gray-500', bg: 'bg-gray-500/10' },
};

/* ── Helpers ────────────────────────────────────────────────── */

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

const LOG_PER_PAGE = 20;

/* ── Component ─────────────────────────────────────────────── */

export const DashboardPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [allEvents, setAllEvents] = useState<(PageViewEvent & { sourceType: SourceType; sourceLabel: string })[]>([]);
  const [logTotal, setLogTotal] = useState(0);
  const [logPage, setLogPage] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'search' | 'ai'>('all');
  const [searchVisitors, setSearchVisitors] = useState(0);
  const [aiVisitors, setAiVisitors] = useState(0);
  const [searchVisitors24h, setSearchVisitors24h] = useState(0);
  const [aiVisitors24h, setAiVisitors24h] = useState(0);
  const [clicks24h, setClicks24h] = useState(0);

  /* Server-side source param based on filter */
  const sourceParam = filterType === 'all' ? 'search,ai' : filterType;

  /* Fetch visitor counts once from a large batch (separate from paginated log) */
  const fetchVisitorCounts = useCallback(async () => {
    try {
      const [searchData, aiData] = await Promise.all([
        api.fetchPageViewLog(500, 0, 'search').catch(() => ({ events: [], total: 0 })),
        api.fetchPageViewLog(500, 0, 'ai').catch(() => ({ events: [], total: 0 })),
      ]);
      const now = Date.now();
      const DAY_MS = 24 * 60 * 60 * 1000;
      // Dedup search visitors
      const searchFps = new Set<string>();
      const searchFps24h = new Set<string>();
      for (const ev of searchData.events) {
        const fp = `${ev.ip}|${ev.browser}|${ev.os}|${ev.device}`;
        searchFps.add(fp);
        if (now - new Date(ev.timestamp).getTime() < DAY_MS) searchFps24h.add(fp);
      }
      setSearchVisitors(searchFps.size);
      setSearchVisitors24h(searchFps24h.size);
      // Dedup AI visitors
      const aiFps = new Set<string>();
      const aiFps24h = new Set<string>();
      for (const ev of aiData.events) {
        const fp = `${ev.ip}|${ev.browser}|${ev.os}|${ev.device}`;
        aiFps.add(fp);
        if (now - new Date(ev.timestamp).getTime() < DAY_MS) aiFps24h.add(fp);
      }
      setAiVisitors(aiFps.size);
      setAiVisitors24h(aiFps24h.size);
    } catch (err) {
      console.error('[Dashboard] Visitor count error:', err);
    }
  }, []);

  const fetchLog = useCallback(async (page: number, source: string) => {
    try {
      setLoading(true);
      const offset = page * LOG_PER_PAGE;
      const [clickData, logData] = await Promise.all([
        api.fetchClickAnalytics().catch(() => null),
        api.fetchPageViewLog(LOG_PER_PAGE, offset, source).catch(() => ({ events: [], total: 0 })),
      ]);
      setTotalClicks(clickData?.totalClicks ?? 0);
      setClicks24h(clickData?.clicks24h ?? 0);
      const classified = logData.events.map(ev => ({
        ...ev,
        sourceType: classifySource(ev.referrerDomain),
        sourceLabel: sourceName(ev.referrerDomain),
      }));
      setAllEvents(classified);
      setLogTotal(logData.total);
    } catch (err: any) {
      console.error('[Dashboard] Fetch error:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load — visitor counts
  useEffect(() => { fetchVisitorCounts(); }, [fetchVisitorCounts]);

  // Fetch log when page or filter changes
  useEffect(() => {
    fetchLog(logPage, sourceParam);
  }, [logPage, sourceParam, fetchLog]);

  const totalPages = Math.ceil(logTotal / LOG_PER_PAGE);

  // Reset page when filter changes
  useEffect(() => { setLogPage(0); }, [filterType]);

  const handleRefresh = () => {
    fetchVisitorCounts();
    fetchLog(logPage, sourceParam);
  };

  /* ── Render ── */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#08a671]/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#08a671]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground text-xs font-medium">Key metrics and acquisition log</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Key Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Clicks */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#08a671]/10 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4 text-[#08a671]" />
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Total Clicks</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-semibold text-foreground tabular-nums">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-muted/50 rounded animate-pulse" />
              ) : (
                totalClicks.toLocaleString()
              )}
            </p>
            {!loading && clicks24h > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#08a671]/10 text-[10px] font-semibold text-[#08a671] tabular-nums">
                +{clicks24h}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Product link clicks (all time)</p>
        </div>

        {/* Search Traffic */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Search className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Search Visitors</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-semibold text-foreground tabular-nums">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-muted/50 rounded animate-pulse" />
              ) : (
                searchVisitors.toLocaleString()
              )}
            </p>
            {!loading && searchVisitors24h > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-blue-500/10 text-[10px] font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                +{searchVisitors24h}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">Google, Bing, DuckDuckGo, etc.</p>
        </div>

        {/* AI Traffic */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">AI Visitors</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-semibold text-foreground tabular-nums">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-muted/50 rounded animate-pulse" />
              ) : (
                aiVisitors.toLocaleString()
              )}
            </p>
            {!loading && aiVisitors24h > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-purple-500/10 text-[10px] font-semibold text-purple-600 dark:text-purple-400 tabular-nums">
                +{aiVisitors24h}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">ChatGPT, Perplexity, Claude, etc.</p>
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider mr-1">Show:</span>
        {([
          { key: 'all' as const, label: 'Search + AI' },
          { key: 'search' as const, label: 'Search only' },
          { key: 'ai' as const, label: 'AI only' },
        ]).map(f => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
              filterType === f.key
                ? 'bg-[#08a671]/10 border-[#08a671]/40 text-[#08a671]'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-[11px] font-medium text-muted-foreground/50 tabular-nums">
          {logTotal.toLocaleString()} event{logTotal !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Traffic Log Table ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Page</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Visitor</th>
                <th className="px-4 py-3 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Device</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="px-4 py-3"><div className="w-20 h-4 bg-muted/40 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="w-40 h-4 bg-muted/40 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="w-20 h-4 bg-muted/40 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="w-32 h-4 bg-muted/40 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="w-16 h-4 bg-muted/40 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : allEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm font-medium">
                    No traffic recorded yet
                  </td>
                </tr>
              ) : allEvents.map(ev => {
                const badge = SOURCE_BADGE[ev.sourceType];
                const diffMs = Date.now() - new Date(ev.timestamp).getTime();
                const isRecent = diffMs < 24 * 60 * 60 * 1000;
                let timeStr: string;
                if (isRecent) {
                  const mins = Math.floor(diffMs / 60_000);
                  if (mins < 1) timeStr = 'just now';
                  else if (mins < 60) timeStr = `${mins}min ago`;
                  else {
                    const hrs = Math.floor(mins / 60);
                    timeStr = `${hrs}hr ago`;
                  }
                } else {
                  try {
                    timeStr = format(parseISO(ev.timestamp), 'MMM d, HH:mm');
                  } catch {
                    timeStr = ev.timestamp?.slice(0, 16) ?? '';
                  }
                }

                return (
                  <tr key={ev.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    {/* Time */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-medium text-muted-foreground">{timeStr}</span>
                    </td>
                    {/* Page */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-foreground block truncate max-w-[260px]">{ev.route}</span>
                    </td>
                    {/* Source */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${badge.color} ${badge.bg}`}>
                        {ev.sourceLabel}
                      </span>
                    </td>
                    {/* Visitor identity */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {ev.country && (
                          <span className="text-xs" title={ev.country}>{countryFlag(ev.country)}</span>
                        )}
                        {ev.city && ev.city !== 'Unknown' && (
                          <span className="text-[10px] font-medium text-muted-foreground">{ev.city}</span>
                        )}
                        {ev.region && ev.region !== 'Unknown' && ev.region !== ev.city && (
                          <span className="text-[10px] text-muted-foreground/50">{ev.region}</span>
                        )}
                        {ev.language && (
                          <span className="text-[9px] font-mono text-muted-foreground/40 uppercase">{ev.language.split(',')[0].split('-')[0]}</span>
                        )}
                        {ev.timezone && (
                          <span className="text-[9px] text-muted-foreground/30 hidden lg:inline">{ev.timezone}</span>
                        )}
                      </div>
                    </td>
                    {/* Device */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <DeviceIcon device={ev.device} className="w-3 h-3 text-muted-foreground/60" />
                        <span className="text-[10px] font-medium text-muted-foreground">{ev.browser}</span>
                        <span className="text-[9px] text-muted-foreground/40 hidden md:inline">{ev.os}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>{allEvents.length} events</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLogPage(p => Math.max(0, p - 1))}
              disabled={logPage === 0}
              className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>{logPage + 1} / {totalPages}</span>
            <button
              onClick={() => setLogPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={logPage >= totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};