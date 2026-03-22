'use client';

/**
 * Rules #1 and #2 — Deduplicate Products + Extract Curator
 * Extracted from ControlRoomRules.tsx for modular file size.
 */
import React, { useState, useCallback } from 'react';
import { Copy, CheckCircle2, Trash2, Search, Loader2, Users, ArrowRight, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/app/utils/api';
import type { DeFiProduct } from '@/lib/api';
import { capitalizeWords, fingerprint, groupLabel, type RulePhase, type DuplicateGroup } from './shared';

// ─── Types ───────────────────────────────────────────────────
interface CuratorChange {
  table: string; id: number;
  oldProductName: string; newProductName: string;
  oldCurator: string; newCurator: string;
  platform: string; network: string; ticker: string;
}

/** Pick the best item to keep — prefer: longer history > has curator > lower id (older) */
const pickBest = (items: DeFiProduct[]): DeFiProduct => {
  return [...items].sort((a, b) => {
    const aHist = Array.isArray(a.dailyApyHistory) ? a.dailyApyHistory.length : 0;
    const bHist = Array.isArray(b.dailyApyHistory) ? b.dailyApyHistory.length : 0;
    if (aHist !== bHist) return bHist - aHist;
    const aCur = a.curator && a.curator !== '-' ? 1 : 0;
    const bCur = b.curator && b.curator !== '-' ? 1 : 0;
    if (aCur !== bCur) return bCur - aCur;
    return Number(a.id) - Number(b.id);
  })[0];
};

// ═══════════════════════════════════════════════════════════════
// Rule #1: Remove Duplicate Products
export const DeduplicateProductsRule: React.FC = () => {
  const [phase, setPhase] = useState<RulePhase>('idle');
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [removedCount, setRemovedCount] = useState(0);

  const handleScan = useCallback(async () => {
    try {
      setPhase('scanning'); setDuplicates([]); setRemovedCount(0);
      const { products } = await api.fetchPools();
      setTotalProducts(products.length);

      const groups = new Map<string, DeFiProduct[]>();
      for (const p of products) { const fp = fingerprint(p); const arr = groups.get(fp) || []; arr.push(p); groups.set(fp, arr); }

      const dupeGroups: DuplicateGroup[] = [];
      for (const [fp, items] of groups) {
        if (items.length > 1) {
          const keep = pickBest(items);
          dupeGroups.push({ fingerprint: fp, label: groupLabel(items[0]), items, keep, remove: items.filter(i => i.id !== keep.id) });
        }
      }
      dupeGroups.sort((a, b) => b.remove.length - a.remove.length);
      setDuplicates(dupeGroups); setPhase('scanned');

      if (dupeGroups.length === 0) toast.success('No duplicates found — Products table is clean');
      else toast(`Found ${dupeGroups.reduce((s, g) => s + g.remove.length, 0)} duplicate(s) across ${dupeGroups.length} product(s)`);
    } catch (err: any) {
      console.error('Scan failed:', err); toast.error(err.message || 'Failed to scan products'); setPhase('idle');
    }
  }, []);

  const handleExecute = useCallback(async () => {
    if (duplicates.length === 0) return;
    try {
      setPhase('running'); let removed = 0;
      for (const group of duplicates) { for (const item of group.remove) { await api.deleteProduct(item.id); removed++; } }
      setRemovedCount(removed); setPhase('done');
      toast.success(`Removed ${removed} duplicate product(s) from the database`);
    } catch (err: any) {
      console.error('Execution failed:', err); toast.error(err.message || 'Failed to remove duplicates'); setPhase('scanned');
    }
  }, [duplicates]);

  const handleReset = () => { setPhase('idle'); setDuplicates([]); setTotalProducts(0); setRemovedCount(0); };
  const totalToRemove = duplicates.reduce((s, g) => s + g.remove.length, 0);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0"><Copy className="w-5 h-5 text-red-500" /></div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">Remove Duplicate Products</h3>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider bg-[#08a671]/10 text-[#08a671] shrink-0">Rule #1</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
              Scans the Products table for rows with identical product name, 24h APY, 30D APY, and TVL. Keeps the entry with the longest history and removes the rest.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {phase === 'idle' && <button onClick={handleScan} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-xs font-semibold hover:opacity-90 transition-all"><Search className="w-3.5 h-3.5" />Scan</button>}
          {phase === 'scanning' && <div className="flex items-center gap-2 px-5 py-2.5 bg-muted rounded-xl text-xs font-semibold text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />Scanning...</div>}
          {phase === 'scanned' && duplicates.length > 0 && <button onClick={handleExecute} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-all"><Trash2 className="w-3.5 h-3.5" />Remove {totalToRemove} Duplicate{totalToRemove !== 1 ? 's' : ''}</button>}
          {phase === 'running' && <div className="flex items-center gap-2 px-5 py-2.5 bg-red-500/80 text-white rounded-xl text-xs font-semibold"><Loader2 className="w-3.5 h-3.5 animate-spin" />Removing...</div>}
          {phase === 'done' && <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-xs font-semibold hover:bg-[#08a671]/90 transition-all"><CheckCircle2 className="w-3.5 h-3.5" />Done — Scan Again</button>}
          {phase === 'scanned' && <button onClick={handleReset} className="px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-all">Reset</button>}
        </div>
      </div>

      {phase !== 'idle' && (
        <div className="p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-6 text-xs flex-wrap">
            <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Total products:</span><span className="font-semibold text-foreground">{totalProducts}</span></div>
            <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Duplicate groups:</span><span className="font-semibold text-foreground">{duplicates.length}</span></div>
            <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">To remove:</span><span className="font-semibold text-red-500">{totalToRemove}</span></div>
          </div>

          {phase === 'scanned' && duplicates.length === 0 && (
            <div className="flex items-center gap-3 p-4 bg-[#08a671]/5 rounded-xl border border-[#08a671]/20"><CheckCircle2 className="w-5 h-5 text-[#08a671] shrink-0" /><p className="text-sm text-[#08a671] font-medium">No duplicates found. Products table is clean.</p></div>
          )}
          {phase === 'done' && (
            <div className="flex items-center gap-3 p-4 bg-[#08a671]/5 rounded-xl border border-[#08a671]/20"><CheckCircle2 className="w-5 h-5 text-[#08a671] shrink-0" /><p className="text-sm text-[#08a671] font-medium">Done. Removed {removedCount} duplicate product(s). Refresh the dashboard to verify.</p></div>
          )}

          {duplicates.length > 0 && phase !== 'done' && (
            <div className="border border-border rounded-xl overflow-hidden max-h-[400px] overflow-y-auto divide-y divide-border">
              {duplicates.map((group) => (
                <div key={group.fingerprint} className="p-4 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">{capitalizeWords(group.label)}</span>
                    <span className="text-[9px] font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">{group.items.length} copies</span>
                  </div>
                  {group.items.map((item) => {
                    const isKeep = item.id === group.keep.id;
                    const histLen = Array.isArray(item.dailyApyHistory) ? item.dailyApyHistory.length : 0;
                    return (
                      <div key={item.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${isKeep ? 'bg-[#08a671]/5 border border-[#08a671]/20' : 'bg-red-500/5 border border-red-500/15'}`}>
                        <code className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">id:{String(item.id)}</code>
                        <span className="font-medium text-foreground/80 truncate">{item.platform_name}</span>
                        <span className="text-muted-foreground">{item.network}</span>
                        {histLen > 0 && <span className="text-[9px] font-semibold text-purple-500 shrink-0">{histLen}d history</span>}
                        <span className={`text-[9px] font-semibold uppercase tracking-wider shrink-0 ${isKeep ? 'text-[#08a671]' : 'text-red-500'}`}>{isKeep ? 'Keep' : 'Remove'}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Rule #2: Extract Curator from Product Name
export const ExtractCuratorRule: React.FC = () => {
  const [curatorInput, setCuratorInput] = useState('');
  const [phase, setPhase] = useState<RulePhase>('idle');
  const [changes, setChanges] = useState<CuratorChange[]>([]);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<{ productsUpdated: number; indexUpdated: number } | null>(null);

  const toggleExclude = useCallback((table: string, id: number) => {
    const key = `${table}:${id}`;
    setExcludedIds(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  }, []);

  const toggleAllExcluded = useCallback(() => {
    if (excludedIds.size === changes.length) setExcludedIds(new Set());
    else setExcludedIds(new Set(changes.map(ch => `${ch.table}:${ch.id}`)));
  }, [excludedIds.size, changes]);

  const includedChanges = changes.filter(ch => !excludedIds.has(`${ch.table}:${ch.id}`));

  const handleScan = useCallback(async () => {
    const name = curatorInput.trim();
    if (!name) { toast.error('Enter a curator name first'); return; }
    try {
      setPhase('scanning'); setChanges([]); setExcludedIds(new Set()); setResult(null);
      const res = await api.extractCurator(name, true);
      setChanges(res.changes); setPhase('scanned');
      if (res.changes.length === 0) toast('No products found matching that curator name');
      else toast(`Found ${res.changes.length} product(s) matching "${name}"`);
    } catch (err: any) { console.error('Curator scan failed:', err); toast.error(err.message || 'Failed to scan'); setPhase('idle'); }
  }, [curatorInput]);

  const handleExecute = useCallback(async () => {
    const name = curatorInput.trim();
    if (!name || includedChanges.length === 0) return;
    const excluded = changes.filter(ch => excludedIds.has(`${ch.table}:${ch.id}`)).map(ch => ({ table: ch.table, id: ch.id }));
    try {
      setPhase('running');
      const res = await api.extractCurator(name, false, excluded.length > 0 ? excluded : undefined);
      setResult({ productsUpdated: res.productsUpdated || 0, indexUpdated: res.indexUpdated || 0 }); setPhase('done');
      toast.success(`Curator "${name}" extracted from ${(res.productsUpdated || 0) + (res.indexUpdated || 0)} row(s)`);
    } catch (err: any) { console.error('Curator extraction failed:', err); toast.error(err.message || 'Failed'); setPhase('scanned'); }
  }, [curatorInput, includedChanges, changes, excludedIds]);

  const handleReset = () => { setPhase('idle'); setChanges([]); setExcludedIds(new Set()); setResult(null); setCuratorInput(''); };
  const productsChanges = includedChanges.filter(c => c.table === 'Products');
  const indexChanges = includedChanges.filter(c => c.table === 'Index');

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-purple-500" /></div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">Extract Curator from Product Name</h3>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-500 shrink-0">Rule #2</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
              Finds products where the curator name appears as a prefix (<code className="text-[11px] bg-muted px-1 py-0.5 rounded font-mono">Gauntlet USDC Prime</code>) or in parentheses (<code className="text-[11px] bg-muted px-1 py-0.5 rounded font-mono">USDC Prime (Gauntlet)</code>). Strips it from the product name, sets the curator column.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(phase === 'idle' || phase === 'scanned') && (
            <span className="contents">
              <input type="text" value={curatorInput} onChange={(e) => setCuratorInput(e.target.value)} placeholder="Curator name..." onKeyDown={(e) => e.key === 'Enter' && handleScan()} className="w-36 md:w-44 px-3 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50" />
              <button onClick={handleScan} disabled={!curatorInput.trim()} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-40"><Search className="w-3.5 h-3.5" />Scan</button>
            </span>
          )}
          {phase === 'scanning' && <div className="flex items-center gap-2 px-5 py-2.5 bg-muted rounded-xl text-xs font-semibold text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />Scanning...</div>}
          {phase === 'scanned' && includedChanges.length > 0 && <button onClick={handleExecute} className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 text-white rounded-xl text-xs font-semibold hover:bg-purple-600 transition-all"><CheckCircle2 className="w-3.5 h-3.5" />Execute ({includedChanges.length})</button>}
          {phase === 'running' && <div className="flex items-center gap-2 px-5 py-2.5 bg-purple-500/80 text-white rounded-xl text-xs font-semibold"><Loader2 className="w-3.5 h-3.5 animate-spin" />Updating...</div>}
          {phase === 'done' && <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-xs font-semibold hover:bg-[#08a671]/90 transition-all"><CheckCircle2 className="w-3.5 h-3.5" />Done — Next Curator</button>}
          {phase === 'scanned' && <button onClick={handleReset} className="px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-all">Reset</button>}
        </div>
      </div>

      {phase !== 'idle' && (
        <div className="p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-6 text-xs flex-wrap">
            <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Curator:</span><span className="font-semibold text-purple-500">"{curatorInput.trim()}"</span></div>
            <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Products rows:</span><span className="font-semibold text-foreground">{productsChanges.length}</span></div>
            <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Index rows:</span><span className="font-semibold text-foreground">{indexChanges.length}</span></div>
            {excludedIds.size > 0 && <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Excluded:</span><span className="font-semibold text-amber-500">{excludedIds.size}</span></div>}
          </div>

          {phase === 'scanned' && changes.length === 0 && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border"><Search className="w-5 h-5 text-muted-foreground shrink-0" /><p className="text-sm text-muted-foreground font-medium">No products found with "{curatorInput.trim()}" — try a different curator name.</p></div>
          )}
          {phase === 'scanned' && changes.length > 0 && includedChanges.length === 0 && (
            <div className="flex items-center gap-3 p-4 bg-amber-500/5 rounded-xl border border-amber-500/20"><EyeOff className="w-5 h-5 text-amber-500 shrink-0" /><p className="text-sm text-amber-600 font-medium">All results are excluded. Include at least one row to execute.</p></div>
          )}
          {phase === 'done' && result && (
            <div className="flex items-center gap-3 p-4 bg-[#08a671]/5 rounded-xl border border-[#08a671]/20"><CheckCircle2 className="w-5 h-5 text-[#08a671] shrink-0" /><p className="text-sm text-[#08a671] font-medium">Done. Updated {result.productsUpdated} Products row(s) and {result.indexUpdated} Index row(s).</p></div>
          )}

          {changes.length > 0 && phase !== 'done' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{includedChanges.length} of {changes.length} included</span>
                <button onClick={toggleAllExcluded} className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  {excludedIds.size === changes.length ? <span className="contents"><Eye className="w-3 h-3" /> Include All</span> : <span className="contents"><EyeOff className="w-3 h-3" /> Exclude All</span>}
                </button>
              </div>
              {changes.map((ch) => {
                const isExcluded = excludedIds.has(`${ch.table}:${ch.id}`);
                return (
                  <div key={`${ch.table}-${ch.id}`} className={`rounded-xl border overflow-hidden transition-all ${isExcluded ? 'border-border/50 bg-muted/30 opacity-50' : 'border-border bg-purple-500/[0.02]'}`}>
                    <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
                      <button onClick={() => toggleExclude(ch.table, ch.id)} className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${isExcluded ? 'bg-muted hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500' : 'bg-purple-500/10 hover:bg-red-500/10 text-purple-500 hover:text-red-500'}`} title={isExcluded ? 'Include this row' : 'Exclude this row'}>
                        {isExcluded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${ch.table === 'Products' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>{ch.table}</span>
                      <code className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">id:{ch.id}</code>
                      <div className={`flex items-center gap-2 min-w-0 flex-1 ${isExcluded ? 'line-through' : ''}`}>
                        <span className="text-xs text-red-400 font-medium line-through truncate max-w-[200px]" title={ch.oldProductName}>{ch.oldProductName}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-[#08a671] font-semibold truncate max-w-[200px]" title={ch.newProductName}>{ch.newProductName}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded shrink-0">{ch.ticker} · {ch.platform}</span>
                      <span className={`text-[9px] font-semibold shrink-0 ${isExcluded ? 'text-muted-foreground' : 'text-purple-500'}`}>curator → {capitalizeWords(ch.newCurator)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};