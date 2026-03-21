/**
 * ClientsPanel — Control Room tab for generating platform-specific
 * click reports for potential clients (platforms & curators).
 * Lean: one API call per selection, client-side search matching.
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Building2, RefreshCw, BarChart3, Search, ChevronDown, X,
  MousePointerClick, TrendingUp, ExternalLink, Eye, Target, Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import * as api from '@/app/utils/api';
import type {
  ClickRecord, ClientReport, ClientReportProduct,
  DailyClickRecord, SearchRecord, TopPageRecord,
} from '@/app/utils/api';
import { useRegistry } from '@/app/contexts/RegistryContext';
import { useDarkMode } from '@/app/utils/useDarkMode';

// ── Helpers ──────────────────────────────────────────────────

const pct = (n: number, d: number) => d > 0 ? (n / d) * 100 : 0;
const fmtPct = (v: number) => v >= 10 ? v.toFixed(0) : v >= 1 ? v.toFixed(1) : v >= 0.1 ? v.toFixed(2) : '<0.1';
const ordinal = (n: number) => {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  const last = n % 10;
  if (last === 1) return `${n}st`;
  if (last === 2) return `${n}nd`;
  if (last === 3) return `${n}rd`;
  return `${n}th`;
};

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
        <span className="w-2 h-2 rounded-full bg-purple-500" />
        <span className="text-sm font-semibold text-foreground tabular-nums">{count}</span>
        <span className="text-[10px] text-muted-foreground font-medium">clicks</span>
      </div>
    </div>
  );
};

// ── Daily Chart (purple gradient) ────────────────────────────

const ClientDailyChart: React.FC<{ data: DailyClickRecord[]; platform: string; loading: boolean }> = ({
  data, platform, loading,
}) => {
  const { isDark } = useDarkMode();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(d => ({ date: d.date, clicks: d.count }));
  }, [data]);

  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const tickColor = isDark ? '#64748b' : '#94a3b8';

  const formatXTick = (dateStr: string) => {
    try { return format(parseISO(dateStr), 'MMM dd'); } catch { return dateStr; }
  };

  const tickInterval = chartData.length <= 14 ? 0 : Math.floor(chartData.length / 8);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[11px] font-semibold text-foreground">Daily Clicks — {platform}</span>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[11px] font-semibold text-foreground">Daily Clicks — {platform}</span>
        </div>
        <div className="flex flex-col items-center justify-center h-[180px] text-center px-4">
          <p className="text-xs text-muted-foreground font-medium">No click data for this platform yet</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Data appears after users click on products from this platform</p>
        </div>
      </div>
    );
  }

  const totalInRange = chartData.reduce((sum, d) => sum + d.clicks, 0);
  const peakDay = chartData.reduce((max, d) => (d.clicks > max.clicks ? d : max), chartData[0]);
  let peakLabel = '';
  try { peakLabel = format(parseISO(peakDay.date), 'MMM dd'); } catch { peakLabel = peakDay.date; }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-[11px] font-semibold text-foreground">Daily Clicks — {platform}</span>
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
              <linearGradient id="clientBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.35} />
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
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', radius: 4 }}
            />
            <Bar
              dataKey="clicks"
              fill="url(#clientBarGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ── Product Breakdown Row ────────────────────────────────────

const ProductRow: React.FC<{
  product: ClientReportProduct;
  rank: number;
  maxCount: number;
  resolveAssetIcon: (t: string) => string | null;
  resolveNetworkIcon: (n: string) => string;
}> = ({ product, rank, maxCount, resolveAssetIcon, resolveNetworkIcon }) => {
  const barWidth = maxCount > 0 ? Math.max(4, (product.count / maxCount) * 100) : 0;
  const hasCurator = product.curator && product.curator !== '-' && product.curator.trim() !== '';

  return (
    <div className="grid grid-cols-[auto_auto_1fr_auto_auto] gap-x-3 px-4 py-3 items-center hover:bg-muted/20 transition-colors">
      <span className="text-[11px] font-normal text-muted-foreground/60 tabular-nums w-6 shrink-0 text-right">
        {rank}
      </span>

      {/* Asset + Network icons */}
      <div className="flex items-center shrink-0">
        <div className="w-4 h-4 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden shrink-0" title={product.network}>
          <img src={resolveNetworkIcon(product.network)} alt={product.network} className="w-2.5 h-2.5 object-contain" />
        </div>
        <div className="w-5 h-5 flex items-center justify-center shrink-0 ml-0.5">
          {resolveAssetIcon(product.ticker) ? (
            <img src={resolveAssetIcon(product.ticker)!} alt={product.ticker} className="w-full h-full object-contain" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-[8px] font-semibold text-foreground">{(product.ticker || '?')[0].toUpperCase()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Product name + bar */}
      <div className="min-w-0">
        <span className="text-[12px] font-semibold text-foreground truncate block max-w-[280px]">
          {product.productName}
          {hasCurator && (
            <span className="font-medium text-muted-foreground"> · {titleCase(product.curator)}</span>
          )}
        </span>
        <div className="mt-1.5 h-1 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500/70 to-purple-500/30 transition-all duration-500"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      {/* Count badge */}
      <div className="w-14 text-right">
        <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-xs font-semibold tabular-nums">
          {product.count}
        </span>
      </div>

      {/* Last click */}
      <div className="w-16 text-right hidden sm:block">
        <span className="text-[10px] font-medium text-muted-foreground">
          {product.lastClickedAt ? formatTimeAgo(product.lastClickedAt) : '—'}
        </span>
      </div>
    </div>
  );
};

// ── Related Searches Card ────────────────────────────────────

const RelatedSearchesCard: React.FC<{
  searches: SearchRecord[];
  platform: string;
  products: ClientReportProduct[];
}> = ({ searches, platform, products }) => {
  const related = useMemo(() => {
    if (!platform || searches.length === 0) return [];

    // Build keyword set from platform name + product names + tickers
    const keywords = new Set<string>();
    keywords.add(platform.toLowerCase());
    // Add individual words from platform name
    platform.toLowerCase().split(/\s+/).forEach(w => { if (w.length >= 3) keywords.add(w); });
    // Add product tickers & curator names
    for (const p of products) {
      if (p.ticker) keywords.add(p.ticker.toLowerCase());
      if (p.curator && p.curator !== '-') keywords.add(p.curator.toLowerCase());
    }

    return searches
      .filter(s => {
        const q = s.query.toLowerCase();
        return [...keywords].some(kw => q.includes(kw));
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [searches, platform, products]);

  if (related.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-[11px] font-semibold text-foreground">Related Searches</span>
        <span className="text-[9px] font-medium text-muted-foreground/60 ml-auto">{related.length} matching</span>
      </div>
      <div className="divide-y divide-border/30">
        {related.map(item => (
          <div key={item.query} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-3 h-3 text-blue-400/60 shrink-0" />
              <span className="text-[12px] font-medium text-foreground truncate">{item.queryRaw || item.query}</span>
              {item.avgResults === 0 && (
                <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded text-[8px] font-semibold shrink-0">0 res</span>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 tabular-nums">{item.count}x</span>
              <span className="text-[9px] font-medium text-muted-foreground/50">{formatTimeAgo(item.lastSearchedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Platform Picker (searchable) ─────────────────────────────

const PlatformPicker: React.FC<{
  platforms: { name: string; clicks: number }[];
  selected: string;
  onSelect: (name: string) => void;
}> = ({ platforms, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = filter
    ? platforms.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : platforms;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl hover:border-purple-500/40 transition-all min-w-[240px]"
      >
        <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
        <span className="text-sm font-semibold text-foreground truncate flex-1 text-left">
          {selected || 'Select platform...'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                placeholder="Filter platforms..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground">No platforms match</div>
            ) : (
              filtered.map(p => (
                <button
                  key={p.name}
                  onClick={() => { onSelect(p.name); setOpen(false); setFilter(''); }}
                  className={`flex items-center justify-between w-full px-4 py-2.5 hover:bg-muted/30 transition-colors text-left ${
                    selected === p.name ? 'bg-purple-500/10' : ''
                  }`}
                >
                  <span className={`text-[12px] font-semibold truncate ${
                    selected === p.name ? 'text-purple-600 dark:text-purple-400' : 'text-foreground'
                  }`}>
                    {p.name}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground tabular-nums shrink-0 ml-3">
                    {p.clicks} clicks
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────

export const ClientsPanel: React.FC = () => {
  const { resolveAssetIcon, resolveNetworkIcon } = useRegistry();

  // Global aggregated clicks (for platform list)
  const [allClicks, setAllClicks] = useState<ClickRecord[]>([]);
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [topPages, setTopPages] = useState<TopPageRecord[]>([]);
  const [globalLoading, setGlobalLoading] = useState(true);

  // Selected platform report
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [report, setReport] = useState<ClientReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Fetch global data once
  const fetchGlobal = useCallback(async () => {
    try {
      setGlobalLoading(true);
      const [clicks, srch, pages] = await Promise.all([
        api.fetchClicks(),
        api.fetchSearches(),
        api.fetchTopPages(500),
      ]);
      setAllClicks(clicks || []);
      setSearches(srch || []);
      setTopPages(pages || []);
    } catch (err: any) {
      console.error('[ClientsPanel] Fetch error:', err);
      toast.error('Failed to load data');
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  useEffect(() => { fetchGlobal(); }, [fetchGlobal]);

  // Derive platform list from aggregated clicks
  const platforms = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of allClicks) {
      if (!c.platform) continue;
      map.set(c.platform, (map.get(c.platform) || 0) + c.count);
    }
    return [...map.entries()]
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks);
  }, [allClicks]);

  // Fetch report when platform changes
  const fetchReport = useCallback(async (platform: string) => {
    if (!platform) { setReport(null); return; }
    try {
      setReportLoading(true);
      const data = await api.fetchClientReport(platform);
      setReport(data);
    } catch (err: any) {
      console.error('[ClientsPanel] Report error:', err);
      toast.error(`Failed to load report for ${platform}`);
    } finally {
      setReportLoading(false);
    }
  }, []);

  const handleSelect = useCallback((name: string) => {
    setSelectedPlatform(name);
    fetchReport(name);
  }, [fetchReport]);

  const handleClear = useCallback(() => {
    setSelectedPlatform('');
    setReport(null);
  }, []);

  // ── Platform share metrics ─────────────────────────────────
  const totalGlobalClicks = useMemo(
    () => platforms.reduce((sum, p) => sum + p.clicks, 0),
    [platforms],
  );

  const shareMetrics = useMemo(() => {
    if (!report || !selectedPlatform) return null;
    const platformClicks = report.totalClicks;
    const clickShare = pct(platformClicks, totalGlobalClicks);
    const oneInN = totalGlobalClicks > 0 && platformClicks > 0
      ? Math.round(totalGlobalClicks / platformClicks)
      : 0;

    // Traffic share: match platform's product slugs against vault pageviews
    const productSlugs = new Set(report.products.map(p => p.slug));
    const vaultPages = topPages.filter(p => p.routeType === 'vault' || p.vaultSlug);
    const totalVaultViews = vaultPages.reduce((s, p) => s + p.count, 0);
    const platformVaultViews = vaultPages
      .filter(p => productSlugs.has(p.vaultSlug))
      .reduce((s, p) => s + p.count, 0);
    const trafficShare = pct(platformVaultViews, totalVaultViews);

    // Rank among all platforms
    const platformRank = platforms.findIndex(p => p.name === selectedPlatform) + 1;

    return {
      platformClicks,
      clickShare,
      oneInN,
      platformVaultViews,
      totalVaultViews,
      trafficShare,
      platformRank,
      totalPlatforms: platforms.length,
    };
  }, [report, selectedPlatform, totalGlobalClicks, topPages, platforms]);

  const maxProductCount = report?.products?.[0]?.count || 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Client Reports</h2>
            <p className="text-[10px] text-muted-foreground font-medium">
              Per-platform click analytics for potential clients
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedPlatform && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
          <button
            onClick={() => { fetchGlobal(); if (selectedPlatform) fetchReport(selectedPlatform); }}
            disabled={globalLoading || reportLoading}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${globalLoading || reportLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Platform Picker */}
      <div className="flex items-center gap-3 flex-wrap">
        <PlatformPicker
          platforms={platforms}
          selected={selectedPlatform}
          onSelect={handleSelect}
        />
        {selectedPlatform && report && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <MousePointerClick className="w-3 h-3 text-purple-500" />
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 tabular-nums">
              {report.totalClicks}
            </span>
            <span className="text-[9px] font-medium text-purple-600/60 dark:text-purple-400/60 uppercase tracking-wider">
              total clicks
            </span>
          </div>
        )}
      </div>

      {/* Empty state — no platform selected */}
      {!selectedPlatform && !globalLoading && (
        <div className="bg-card rounded-2xl border border-dashed border-border p-12 text-center">
          <Building2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Select a platform to generate their click report</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {platforms.length} platforms with tracked clicks
          </p>
        </div>
      )}

      {/* Loading global */}
      {globalLoading && !selectedPlatform && (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}

      {/* ═══ Report content ═══ */}
      {selectedPlatform && (
        <div className="space-y-4">
          {/* Daily chart */}
          <ClientDailyChart
            data={report?.daily || []}
            platform={selectedPlatform}
            loading={reportLoading}
          />

          {/* ── Platform Share — pitch-ready metrics card ── */}
          {!reportLoading && report && shareMetrics && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-[11px] font-semibold text-foreground">Platform Share</span>
                <span className="text-[9px] font-medium text-muted-foreground/60 ml-auto">
                  #{shareMetrics.platformRank} of {shareMetrics.totalPlatforms} platforms
                </span>
              </div>

              {/* Metric tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/30">
                {/* Click Share */}
                <div className="px-4 py-4 text-center">
                  <div className="text-[22px] font-semibold text-purple-600 dark:text-purple-400 tabular-nums tracking-tight">
                    {fmtPct(shareMetrics.clickShare)}%
                  </div>
                  <p className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-[0.08em] mt-0.5">
                    Click Share
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 tabular-nums">
                    {shareMetrics.platformClicks} / {totalGlobalClicks}
                  </p>
                </div>

                {/* 1-in-N */}
                <div className="px-4 py-4 text-center">
                  <div className="text-[22px] font-semibold text-foreground tabular-nums tracking-tight">
                    {shareMetrics.oneInN > 0 ? (
                      <>1 in {shareMetrics.oneInN}</>
                    ) : (
                      '—'
                    )}
                  </div>
                  <p className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-[0.08em] mt-0.5">
                    Outgoing Clicks
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {shareMetrics.oneInN > 0
                      ? `Every ${ordinal(shareMetrics.oneInN)} click`
                      : 'No data'}
                  </p>
                </div>

                {/* Traffic Share */}
                <div className="px-4 py-4 text-center">
                  <div className="text-[22px] font-semibold text-blue-600 dark:text-blue-400 tabular-nums tracking-tight">
                    {shareMetrics.totalVaultViews > 0 ? `${fmtPct(shareMetrics.trafficShare)}%` : '—'}
                  </div>
                  <p className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-[0.08em] mt-0.5">
                    Traffic Share
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 tabular-nums">
                    {shareMetrics.platformVaultViews} / {shareMetrics.totalVaultViews} views
                  </p>
                </div>

                {/* Products listed */}
                <div className="px-4 py-4 text-center">
                  <div className="text-[22px] font-semibold text-foreground tabular-nums tracking-tight">
                    {report.products.length}
                  </div>
                  <p className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-[0.08em] mt-0.5">
                    Products Listed
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    on Earnbase
                  </p>
                </div>
              </div>

              {/* Pitch line */}
              {shareMetrics.oneInN > 0 && shareMetrics.oneInN <= 20 && (
                <div className="px-4 py-3 border-t border-border/30 bg-purple-500/[0.03]">
                  <div className="flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                    <p className="text-[12px] text-foreground/80 leading-relaxed">
                      <span className="font-semibold text-foreground">{selectedPlatform}</span> captures{' '}
                      <span className="font-semibold text-purple-600 dark:text-purple-400">{fmtPct(shareMetrics.clickShare)}%</span> of
                      all outgoing clicks
                      {shareMetrics.totalVaultViews > 0 && shareMetrics.trafficShare >= 0.1 && (
                        <> and <span className="font-semibold text-blue-600 dark:text-blue-400">{fmtPct(shareMetrics.trafficShare)}%</span> of product page traffic</>
                      )}
                      {' '}on Earnbase — every <span className="font-semibold">{ordinal(shareMetrics.oneInN)}</span> user
                      click goes to their site.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Products breakdown */}
          {!reportLoading && report && report.products.length > 0 && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-[11px] font-semibold text-foreground">Products by Clicks</span>
                </div>
                <span className="text-[9px] font-medium text-muted-foreground/60">
                  {report.products.length} product{report.products.length !== 1 ? 's' : ''}
                </span>
              </div>
              {/* Column header */}
              <div className="grid grid-cols-[auto_auto_1fr_auto_auto] gap-x-3 px-4 py-2 border-b border-border bg-muted/30 text-[9px] font-semibold text-muted-foreground/60 uppercase tracking-[0.12em]">
                <span className="w-6 text-right">#</span>
                <span className="w-[38px]"></span>
                <span>Product</span>
                <span className="text-right w-14">Clicks</span>
                <span className="text-right w-16 hidden sm:block">Last</span>
              </div>
              <div className="divide-y divide-border/30">
                {report.products.map((p, idx) => (
                  <ProductRow
                    key={p.slug}
                    product={p}
                    rank={idx + 1}
                    maxCount={maxProductCount}
                    resolveAssetIcon={resolveAssetIcon}
                    resolveNetworkIcon={resolveNetworkIcon}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Related searches */}
          {!reportLoading && report && (
            <RelatedSearchesCard
              searches={searches}
              platform={selectedPlatform}
              products={report.products}
            />
          )}
        </div>
      )}
    </div>
  );
};