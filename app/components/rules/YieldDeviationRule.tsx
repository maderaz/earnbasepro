'use client';

/**
 * Rule #5 — Yield Micro-Deviation with Exclusion Manager
 * Extracted from ControlRoomRules.tsx for modular file size.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertTriangle, Search, Loader2, Activity, X, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/app/utils/api';
import type { DeFiProduct } from '@/lib/api';
import { getDeviation } from '@/app/utils/yieldDeviation';
import { capitalizeWords } from './shared';

type Rule5Phase = 'idle' | 'loading' | 'ready' | 'saving' | 'saved';
type GroupBy = 'platform' | 'product';

interface PlatformGroup {
  name: string;
  products: DeFiProduct[];
  allExcluded: boolean;
  someExcluded: boolean;
}

export const YieldMicroDeviationRule: React.FC = () => {
  const [phase, setPhase] = useState<Rule5Phase>('idle');
  const [allProducts, setAllProducts] = useState<DeFiProduct[]>([]);
  const [excludedIds, setExcludedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [groupBy, setGroupBy] = useState<GroupBy>('platform');
  const [searchFilter, setSearchFilter] = useState('');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const hasChanges = useMemo(() => {
    if (excludedIds.size !== savedIds.size) return true;
    for (const id of excludedIds) { if (!savedIds.has(id)) return true; }
    return false;
  }, [excludedIds, savedIds]);

  const handleLoad = useCallback(async () => {
    try {
      setPhase('loading');
      const [poolsRes, exclusions] = await Promise.all([
        api.fetchPools(),
        api.fetchRule5Exclusions().catch(() => ({ ids: [], updatedAt: null })),
      ]);
      const qualifying = poolsRes.products.filter((p: DeFiProduct) => (p.spotAPY ?? 0) > 0.01);
      setAllProducts(qualifying);
      const ids = new Set((exclusions.ids || []).map(Number));
      setExcludedIds(ids); setSavedIds(new Set(ids)); setSavedAt(exclusions.updatedAt);
      setPhase('ready');
    } catch (err: any) { toast.error(err.message || 'Failed to load'); setPhase('idle'); }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setPhase('saving');
      const ids = Array.from(excludedIds);
      const res = await api.updateRule5Exclusions(ids);
      setSavedIds(new Set(ids)); setSavedAt(res.updatedAt); setPhase('saved');
      toast.success(`Saved ${ids.length} exclusion(s). Refresh dashboard to apply.`);
    } catch (err: any) { toast.error(err.message || 'Failed to save'); setPhase('ready'); }
  }, [excludedIds]);

  const toggleProduct = useCallback((id: number) => {
    setExcludedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }, []);

  const togglePlatformGroup = useCallback((products: DeFiProduct[], allCurrentlyExcluded: boolean) => {
    setExcludedIds(prev => {
      const next = new Set(prev);
      for (const p of products) { const numId = Number(p.id); if (allCurrentlyExcluded) next.delete(numId); else next.add(numId); }
      return next;
    });
  }, []);

  const toggleExpand = useCallback((name: string) => {
    setExpandedGroups(prev => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  }, []);

  const groups = useMemo((): PlatformGroup[] => {
    const q = searchFilter.toLowerCase();
    const filtered = q ? allProducts.filter(p => (p.product_name || '').toLowerCase().includes(q) || (p.platform_name || '').toLowerCase().includes(q) || (p.curator || '').toLowerCase().includes(q) || (p.ticker || '').toLowerCase().includes(q)) : allProducts;

    if (groupBy === 'product') {
      return filtered.map(p => ({
        name: `${p.product_name}${p.curator && p.curator !== '-' ? ` • ${capitalizeWords(p.curator)}` : ''} — ${p.platform_name}`,
        products: [p], allExcluded: excludedIds.has(Number(p.id)), someExcluded: excludedIds.has(Number(p.id)),
      }));
    }

    const map = new Map<string, DeFiProduct[]>();
    for (const p of filtered) { const key = p.platform_name || 'Unknown'; if (!map.has(key)) map.set(key, []); map.get(key)!.push(p); }

    return Array.from(map.entries()).map(([name, products]) => {
      const excludedCount = products.filter(p => excludedIds.has(Number(p.id))).length;
      return {
        name, products: products.sort((a, b) => (a.product_name || '').localeCompare(b.product_name || '')),
        allExcluded: excludedCount === products.length, someExcluded: excludedCount > 0 && excludedCount < products.length,
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [allProducts, excludedIds, groupBy, searchFilter]);

  const totalExcluded = excludedIds.size;
  const totalProducts = allProducts.length;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0"><Activity className="w-5 h-5 text-cyan-500" /></div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">Yield Micro-Deviation</h3>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-500 shrink-0">Rule #5</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider bg-[#08a671]/10 text-[#08a671] shrink-0">Always Active</span>
              {totalExcluded > 0 && phase !== 'idle' && <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-500 shrink-0">{totalExcluded} Excluded</span>}
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
              Adds a deterministic <code className="text-[11px] bg-muted px-1 py-0.5 rounded font-mono">+0.00–0.01%</code> surplus deviation per product. Excluded products receive raw APY values across all surfaces.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {phase === 'idle' && <button onClick={handleLoad} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-xs font-semibold hover:opacity-90 transition-all"><Search className="w-3.5 h-3.5" />Manage Exclusions</button>}
          {phase === 'loading' && <div className="flex items-center gap-2 px-5 py-2.5 bg-muted rounded-xl text-xs font-semibold text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />Loading...</div>}
          {(phase === 'ready' || phase === 'saved') && (
            <span className="contents">
              {hasChanges && <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-white rounded-xl text-xs font-semibold hover:bg-cyan-600 transition-all"><CheckCircle2 className="w-3.5 h-3.5" />Save ({totalExcluded})</button>}
              <button onClick={() => { setPhase('idle'); setAllProducts([]); setExpandedGroups(new Set()); setSearchFilter(''); }} className="px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-all">Close</button>
            </span>
          )}
          {phase === 'saving' && <div className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/80 text-white rounded-xl text-xs font-semibold"><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</div>}
        </div>
      </div>

      {/* Body */}
      {phase !== 'idle' && phase !== 'loading' && (
        <div className="p-5 md:p-6 space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-6 text-xs flex-wrap">
            <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Eligible products:</span><span className="font-semibold text-foreground">{totalProducts}</span></div>
            <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Excluded:</span><span className={`font-semibold ${totalExcluded > 0 ? 'text-amber-500' : 'text-[#08a671]'}`}>{totalExcluded}</span></div>
            <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Receiving deviation:</span><span className="font-semibold text-cyan-500">{totalProducts - totalExcluded}</span></div>
            {savedAt && <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Last saved:</span><span className="font-semibold text-foreground">{new Date(savedAt).toLocaleString()}</span></div>}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex bg-muted rounded-lg p-0.5">
              <button onClick={() => { setGroupBy('platform'); setExpandedGroups(new Set()); }} className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${groupBy === 'platform' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>By Platform</button>
              <button onClick={() => { setGroupBy('product'); setExpandedGroups(new Set()); }} className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${groupBy === 'product' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>By Product</button>
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
              <input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} placeholder="Filter by name, platform, curator, ticker..." className="w-full pl-9 pr-3 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50" />
            </div>
          </div>

          {/* Saved confirmation */}
          {phase === 'saved' && !hasChanges && (
            <div className="flex items-center gap-3 p-4 bg-[#08a671]/5 rounded-xl border border-[#08a671]/20"><CheckCircle2 className="w-5 h-5 text-[#08a671] shrink-0" /><p className="text-sm text-[#08a671] font-medium">Exclusions saved. Refresh the dashboard to apply changes.</p></div>
          )}

          {/* Product selector */}
          <div className="border border-border rounded-xl overflow-hidden max-h-[480px] overflow-y-auto">
            {groups.length === 0 ? (
              <div className="px-4 py-8 text-center"><p className="text-sm text-muted-foreground font-medium">No products match your filter.</p></div>
            ) : groupBy === 'product' ? (
              <div className="divide-y divide-border/50">
                {groups.map(g => {
                  const p = g.products[0];
                  const numId = Number(p.id);
                  const isExcluded = excludedIds.has(numId);
                  const delta = getDeviation(p.id);
                  return (
                    <button key={p.id} onClick={() => toggleProduct(numId)} className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all ${isExcluded ? 'bg-amber-500/[0.04]' : 'hover:bg-muted/40'}`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isExcluded ? 'bg-amber-500 border-amber-500' : 'border-border hover:border-cyan-500/50'}`}>{isExcluded && <X className="w-3 h-3 text-white" />}</div>
                      <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-foreground truncate max-w-[250px]">{p.product_name}</span>
                        {p.curator && p.curator !== '-' && <span className="text-xs font-medium text-muted-foreground">• {capitalizeWords(p.curator)}</span>}
                        <span className="text-[9px] font-semibold text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded shrink-0">{p.platform_name}</span>
                        <span className="text-[9px] font-semibold text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded shrink-0">{(p.ticker || '').toUpperCase()} · {p.network}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-[10px] tabular-nums">
                        <span className={`font-semibold ${isExcluded ? 'text-amber-500 line-through' : 'text-cyan-500'}`}>+{delta.toFixed(4)}%</span>
                        <span className={`font-semibold uppercase tracking-wider ${isExcluded ? 'text-amber-500' : 'text-muted-foreground/50'}`}>{isExcluded ? 'Excluded' : 'Active'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {groups.map(group => {
                  const isExpanded = expandedGroups.has(group.name);
                  const excludedCount = group.products.filter(p => excludedIds.has(Number(p.id))).length;
                  return (
                    <div key={group.name}>
                      <div className="flex items-center">
                        <button onClick={() => toggleExpand(group.name)} className={`flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/30 transition-all ${group.allExcluded ? 'bg-amber-500/[0.03]' : ''}`}>
                          <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          <span className="text-xs font-semibold text-foreground">{capitalizeWords(group.name)}</span>
                          <span className="text-[10px] font-medium text-muted-foreground">{group.products.length} product{group.products.length !== 1 ? 's' : ''}</span>
                          {excludedCount > 0 && <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-amber-500/10 text-amber-500">{excludedCount} excluded</span>}
                        </button>
                        <button onClick={() => togglePlatformGroup(group.products, group.allExcluded)} className={`px-4 py-3 text-[9px] font-semibold uppercase tracking-wider shrink-0 transition-all hover:opacity-70 ${group.allExcluded ? 'text-[#08a671]' : 'text-amber-500'}`} title={group.allExcluded ? 'Include all' : 'Exclude all'}>
                          {group.allExcluded ? 'Include All' : 'Exclude All'}
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-border/30 divide-y divide-border/30 bg-muted/10">
                          {group.products.map(p => {
                            const numId = Number(p.id);
                            const isExcluded = excludedIds.has(numId);
                            const delta = getDeviation(p.id);
                            return (
                              <button key={p.id} onClick={() => toggleProduct(numId)} className={`w-full pl-12 pr-4 py-2.5 flex items-center gap-3 text-left transition-all ${isExcluded ? 'bg-amber-500/[0.04]' : 'hover:bg-muted/40'}`}>
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isExcluded ? 'bg-amber-500 border-amber-500' : 'border-border hover:border-cyan-500/50'}`}>{isExcluded && <X className="w-2.5 h-2.5 text-white" />}</div>
                                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                                  <code className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">id:{String(p.id)}</code>
                                  <span className="text-xs font-medium text-foreground truncate max-w-[220px]">{p.product_name}</span>
                                  {p.curator && p.curator !== '-' && <span className="text-xs font-medium text-muted-foreground">• {capitalizeWords(p.curator)}</span>}
                                  <span className="text-[9px] font-semibold text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded shrink-0">{(p.ticker || '').toUpperCase()} · {p.network}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 text-[10px] tabular-nums">
                                  <span className="font-medium text-muted-foreground">{p.spotAPY.toFixed(2)}%</span>
                                  <span className={`font-semibold ${isExcluded ? 'text-amber-500 line-through' : 'text-cyan-500'}`}>+{delta.toFixed(4)}%</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Explanation */}
          <div className="flex items-start gap-3 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/15">
            <AlertTriangle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                Excluded products receive raw APY values — no +0.01% surplus is applied. This affects all downstream surfaces: yield charts, tracker tables, SEO meta descriptions, and JSON-LD structured data (<code className="text-[10px] bg-cyan-500/10 px-1 py-0.5 rounded font-mono">FinancialProduct.interestRate</code>).
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">
                Deviation is applied in-memory only — raw database values are never modified. Excluding a product retroactively restores all historical chart data to original values.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};