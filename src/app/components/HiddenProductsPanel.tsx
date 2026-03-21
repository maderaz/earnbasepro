import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  EyeOff, Eye, Search, X, RefreshCw, AlertCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/app/utils/api';
import { formatTVL, formatAPY } from '@/app/utils/formatters';

interface Product {
  id: number;
  ticker: string;
  network: string;
  platform_name: string;
  product_name: string;
  curator: string;
  spotAPY: number;
  tvl: number;
}

type SortKey = 'product_name' | 'ticker' | 'network' | 'platform_name' | 'spotAPY' | 'tvl';

export const HiddenProductsPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'visible' | 'hidden'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('product_name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [pendingChanges, setPendingChanges] = useState(false);
  const [expandedTicker, setExpandedTicker] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [allProducts, hiddenData] = await Promise.all([
        api.fetchPoolsIncludingHidden(),
        api.fetchHiddenProducts(),
      ]);
      setProducts(allProducts);
      setHiddenIds(new Set(hiddenData.ids || []));
      setPendingChanges(false);
    } catch (err: any) {
      console.error('[HiddenProducts] Fetch error:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleHidden = (id: number) => {
    setHiddenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPendingChanges(true);
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      await api.updateHiddenProducts(Array.from(hiddenIds));
      toast.success(`${hiddenIds.size} product${hiddenIds.size !== 1 ? 's' : ''} hidden`);
      setPendingChanges(false);
    } catch (err: any) {
      console.error('[HiddenProducts] Save error:', err);
      toast.error('Failed to save hidden products');
    } finally {
      setSaving(false);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  // Group products by ticker
  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const p of products) {
      const t = (p.ticker || 'N/A').toUpperCase();
      if (!map[t]) map[t] = [];
      map[t].push(p);
    }
    return map;
  }, [products]);

  // Filter and sort
  const filteredGrouped = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const result: Record<string, Product[]> = {};

    for (const [ticker, items] of Object.entries(grouped)) {
      const filtered = items.filter(p => {
        // filter mode
        if (filterMode === 'hidden' && !hiddenIds.has(p.id)) return false;
        if (filterMode === 'visible' && hiddenIds.has(p.id)) return false;
        // search
        if (!q) return true;
        return (
          (p.product_name || '').toLowerCase().includes(q) ||
          (p.platform_name || '').toLowerCase().includes(q) ||
          (p.curator || '').toLowerCase().includes(q) ||
          (p.network || '').toLowerCase().includes(q) ||
          (p.ticker || '').toLowerCase().includes(q) ||
          String(p.id).includes(q)
        );
      });
      if (filtered.length > 0) {
        // sort within group
        filtered.sort((a, b) => {
          let av: any = a[sortKey];
          let bv: any = b[sortKey];
          if (typeof av === 'string') av = av.toLowerCase();
          if (typeof bv === 'string') bv = bv.toLowerCase();
          if (av < bv) return sortDir === 'asc' ? -1 : 1;
          if (av > bv) return sortDir === 'asc' ? 1 : -1;
          return 0;
        });
        result[ticker] = filtered;
      }
    }
    return result;
  }, [grouped, searchQuery, filterMode, hiddenIds, sortKey, sortDir]);

  const tickers = Object.keys(filteredGrouped).sort();
  const totalFiltered = tickers.reduce((sum, t) => sum + filteredGrouped[t].length, 0);
  const hiddenCount = hiddenIds.size;

  const SortIcon: React.FC<{ col: SortKey }> = ({ col }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 inline ml-0.5" />
      : <ChevronDown className="w-3 h-3 inline ml-0.5" />;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <EyeOff className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Hidden Products</h2>
            <p className="text-muted-foreground text-xs font-medium">
              {hiddenCount} hidden out of {products.length} total products
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {pendingChanges && (
            <button
              onClick={saveChanges}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#08a671] text-white rounded-xl text-xs font-semibold hover:bg-[#08a671]/90 transition-all disabled:opacity-50 shadow-sm"
            >
              {saving ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products, platforms, curators..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-muted/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        {/* Filter mode */}
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border">
          {(['all', 'visible', 'hidden'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                filterMode === mode
                  ? 'bg-card text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode === 'all' ? `All (${products.length})`
                : mode === 'visible' ? `Visible (${products.length - hiddenCount})`
                : `Hidden (${hiddenCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Loading products...</p>
        </div>
      ) : tickers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <Search className="w-8 h-8 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm font-medium">No products matching your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Info banner */}
          {pendingChanges && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                You have unsaved changes. Click "Save Changes" to apply.
              </p>
            </div>
          )}

          {/* Products grouped by ticker */}
          {tickers.map(ticker => {
            const items = filteredGrouped[ticker];
            const tickerHiddenCount = items.filter(p => hiddenIds.has(p.id)).length;
            const isExpanded = expandedTicker === ticker || tickers.length === 1 || !!searchQuery;

            return (
              <div key={ticker} className="bg-card rounded-2xl border border-border overflow-hidden">
                {/* Ticker header */}
                <button
                  onClick={() => setExpandedTicker(expandedTicker === ticker ? null : ticker)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{ticker}</span>
                    <span className="px-2 py-0.5 bg-muted rounded-lg text-[10px] font-semibold text-muted-foreground">
                      {items.length} product{items.length !== 1 ? 's' : ''}
                    </span>
                    {tickerHiddenCount > 0 && (
                      <span className="px-2 py-0.5 bg-red-500/10 rounded-lg text-[10px] font-semibold text-red-500">
                        {tickerHiddenCount} hidden
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Products table */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {/* Table header */}
                    <div className="hidden md:grid grid-cols-[40px_1fr_100px_120px_90px_80px_60px] gap-2 px-5 py-2.5 bg-muted/30 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center">ID</span>
                      <button onClick={() => handleSort('product_name')} className="text-left hover:text-foreground transition-colors flex items-center">
                        Product <SortIcon col="product_name" />
                      </button>
                      <button onClick={() => handleSort('network')} className="text-left hover:text-foreground transition-colors flex items-center">
                        Network <SortIcon col="network" />
                      </button>
                      <button onClick={() => handleSort('platform_name')} className="text-left hover:text-foreground transition-colors flex items-center">
                        Platform <SortIcon col="platform_name" />
                      </button>
                      <button onClick={() => handleSort('spotAPY')} className="text-right hover:text-foreground transition-colors flex items-center justify-end">
                        APY <SortIcon col="spotAPY" />
                      </button>
                      <button onClick={() => handleSort('tvl')} className="text-right hover:text-foreground transition-colors flex items-center justify-end">
                        TVL <SortIcon col="tvl" />
                      </button>
                      <span className="flex items-center justify-center">Status</span>
                    </div>
                    {/* Rows */}
                    {items.map(p => {
                      const isHidden = hiddenIds.has(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleHidden(p.id)}
                          className={`grid grid-cols-1 md:grid-cols-[40px_1fr_100px_120px_90px_80px_60px] gap-1 md:gap-2 px-5 py-3 border-t border-border/50 cursor-pointer transition-all group ${
                            isHidden
                              ? 'bg-red-500/[0.03] hover:bg-red-500/[0.06]'
                              : 'hover:bg-muted/30'
                          }`}
                        >
                          {/* ID */}
                          <span className="hidden md:flex items-center text-[10px] font-medium text-muted-foreground/60">
                            #{p.id}
                          </span>
                          {/* Product name */}
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`text-xs font-medium truncate ${isHidden ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {p.product_name}
                            </span>
                            {p.curator && p.curator !== '-' && (
                              <span className="hidden md:inline px-1.5 py-0.5 bg-muted rounded text-[9px] font-medium text-muted-foreground shrink-0 truncate max-w-[100px]">
                                {p.curator}
                              </span>
                            )}
                          </div>
                          {/* Mobile meta row */}
                          <div className="md:hidden flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                            <span>#{p.id}</span>
                            <span className="text-border">|</span>
                            <span>{p.network}</span>
                            <span className="text-border">|</span>
                            <span>{p.platform_name}</span>
                            <span className="text-border">|</span>
                            <span>{formatAPY(p.spotAPY)}</span>
                            <span className="text-border">|</span>
                            <span>{formatTVL(p.tvl)}</span>
                            <span className="ml-auto">
                              {isHidden
                                ? <EyeOff className="w-3.5 h-3.5 text-red-400" />
                                : <Eye className="w-3.5 h-3.5 text-[#08a671]" />}
                            </span>
                          </div>
                          {/* Network */}
                          <span className="hidden md:flex items-center text-[11px] font-medium text-muted-foreground truncate">
                            {p.network}
                          </span>
                          {/* Platform */}
                          <span className="hidden md:flex items-center text-[11px] font-medium text-muted-foreground truncate">
                            {p.platform_name}
                          </span>
                          {/* APY */}
                          <span className="hidden md:flex items-center justify-end text-[11px] font-medium text-foreground tabular-nums">
                            {formatAPY(p.spotAPY)}
                          </span>
                          {/* TVL */}
                          <span className="hidden md:flex items-center justify-end text-[11px] font-medium text-muted-foreground tabular-nums">
                            {formatTVL(p.tvl)}
                          </span>
                          {/* Toggle */}
                          <span className="hidden md:flex items-center justify-center">
                            {isHidden ? (
                              <EyeOff className="w-3.5 h-3.5 text-red-400 group-hover:text-red-500 transition-colors" />
                            ) : (
                              <Eye className="w-3.5 h-3.5 text-[#08a671]/60 group-hover:text-[#08a671] transition-colors" />
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {!loading && (
        <div className="px-5 py-3 bg-card rounded-2xl border border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
            {hiddenCount} hidden across {tickers.length} asset{tickers.length !== 1 ? 's' : ''}
            {searchQuery && <span className="normal-case tracking-normal font-medium ml-1">({totalFiltered} shown)</span>}
          </div>
          <p className="text-[9px] text-muted-foreground/60 font-medium">
            Click a row to toggle visibility
          </p>
        </div>
      )}
    </div>
  );
};