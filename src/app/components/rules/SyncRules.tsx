/**
 * Rules #3 and #4 — Consolidate Names + Sync Index → Products
 * Extracted from ControlRoomRules.tsx for modular file size.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertTriangle, Search, Loader2, ArrowRight, Eye, EyeOff, Merge, Check, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/app/utils/api';
import type { NameMismatch } from '@/app/utils/api';
import { capitalizeWords, type RulePhase } from './shared';

// ═══════════════════════════════════════════════════════════════
// Rule #3: Consolidate Names
// ═══════════════════════════════════════════════════════════════

type ConsolidateField = 'platform_name' | 'curator';
type ConsolidatePhase = 'idle' | 'loading' | 'selecting' | 'previewing' | 'executing' | 'done';

export const ConsolidateNamesRule: React.FC = () => {
  const [field, setField] = useState<ConsolidateField>('platform_name');
  const [phase, setPhase] = useState<ConsolidatePhase>('idle');
  const [uniqueValues, setUniqueValues] = useState<{ name: string; products: number; index: number; total: number }[]>([]);
  const [fetchedField, setFetchedField] = useState<ConsolidateField | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [canonicalName, setCanonicalName] = useState('');
  const [changes, setChanges] = useState<any[]>([]);
  const [result, setResult] = useState<{ productsUpdated: number; indexUpdated: number } | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const fieldLabel = field === 'platform_name' ? 'Platform' : 'Curator';
  const selectedTotal = useMemo(() => {
    return uniqueValues.filter(v => selected.has(v.name)).reduce((s, v) => s + v.total, 0);
  }, [uniqueValues, selected]);

  const handleScan = useCallback(async () => {
    try {
      setPhase('loading'); setSelected(new Set()); setCanonicalName(''); setChanges([]); setResult(null); setSearchFilter('');
      const data = await api.fetchUniqueValues(field);
      setUniqueValues(data); setFetchedField(field); setPhase('selecting');
      if (data.length === 0) toast('No values found');
      else toast(`Found ${data.length} unique ${fieldLabel.toLowerCase()} names`);
    } catch (err: any) { console.error('Consolidate scan failed:', err); toast.error(err.message || 'Failed'); setPhase('idle'); }
  }, [field, fieldLabel]);

  const toggleSelect = useCallback((name: string) => {
    setSelected(prev => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  }, []);

  const handlePreview = useCallback(async () => {
    const target = canonicalName.trim();
    if (!target || selected.size < 2) return;
    try {
      setPhase('previewing');
      const res = await api.consolidateNames(field, Array.from(selected), target, true);
      setChanges(res.changes);
      if (res.changes.length === 0) toast('No rows to update');
      else toast(`${res.changes.length} row(s) will be updated`);
    } catch (err: any) { console.error('Preview failed:', err); toast.error(err.message || 'Preview failed'); setPhase('selecting'); }
  }, [field, selected, canonicalName]);

  const handleExecute = useCallback(async () => {
    const target = canonicalName.trim();
    if (!target || changes.length === 0) return;
    try {
      setPhase('executing');
      const res = await api.consolidateNames(field, Array.from(selected), target, false);
      setResult({ productsUpdated: res.productsUpdated || 0, indexUpdated: res.indexUpdated || 0 });
      setPhase('done');
      toast.success(`Consolidated ${(res.productsUpdated || 0) + (res.indexUpdated || 0)} row(s) → "${target}"`);
    } catch (err: any) { console.error('Execute failed:', err); toast.error(err.message || 'Consolidation failed'); setPhase('previewing'); }
  }, [field, selected, canonicalName, changes]);

  const handleReset = () => { setPhase('idle'); setUniqueValues([]); setSelected(new Set()); setCanonicalName(''); setChanges([]); setResult(null); setSearchFilter(''); };
  const handleBackToSelect = () => { setChanges([]); setPhase('selecting'); };

  const filteredValues = useMemo(() => {
    if (!searchFilter.trim()) return uniqueValues;
    const q = searchFilter.toLowerCase();
    return uniqueValues.filter(v => v.name.toLowerCase().includes(q));
  }, [uniqueValues, searchFilter]);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0"><Merge className="w-5 h-5 text-blue-500" /></div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">Consolidate Names</h3>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-500 shrink-0">Rule #3</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
              Merges variant spellings of platform or curator names across Products and Index into one canonical name. Select 2+ name variants, define the target, preview changes, then execute.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {phase === 'idle' && <button onClick={handleScan} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-xs font-semibold hover:opacity-90 transition-all"><Search className="w-3.5 h-3.5" />Scan {fieldLabel}s</button>}
          {phase === 'loading' && <div className="flex items-center gap-2 px-5 py-2.5 bg-muted rounded-xl text-xs font-semibold text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />Loading...</div>}
          {phase === 'executing' && <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/80 text-white rounded-xl text-xs font-semibold"><Loader2 className="w-3.5 h-3.5 animate-spin" />Consolidating...</div>}
          {phase === 'done' && <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-xs font-semibold hover:bg-[#08a671]/90 transition-all"><CheckCircle2 className="w-3.5 h-3.5" />Done — Start Over</button>}
          {(phase === 'selecting' || phase === 'previewing') && <button onClick={handleReset} className="px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-all">Reset</button>}
        </div>
      </div>

      {phase !== 'idle' && phase !== 'loading' && (
        <div className="p-5 md:p-6 space-y-4">
          {/* Field toggle */}
          {phase === 'selecting' && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex bg-muted rounded-lg p-0.5">
                <button onClick={() => { setField('platform_name'); setSelected(new Set()); setCanonicalName(''); }} className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${field === 'platform_name' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Platform</button>
                <button onClick={() => { setField('curator'); setSelected(new Set()); setCanonicalName(''); }} className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${field === 'curator' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Curator</button>
              </div>
              {fetchedField && field !== fetchedField && <button onClick={handleScan} className="text-[10px] font-semibold text-blue-500 hover:underline">Re-scan for {field === 'platform_name' ? 'platforms' : 'curators'}</button>}
            </div>
          )}

          {/* Selection phase */}
          {(phase === 'selecting') && uniqueValues.length > 0 && (
            <div className="contents">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                <input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} placeholder={`Filter ${fieldLabel.toLowerCase()} names...`} className="w-full pl-9 pr-3 py-2.5 bg-muted border border-border rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50" />
              </div>

              <div className="border border-border rounded-xl overflow-hidden max-h-[360px] overflow-y-auto">
                {filteredValues.map(v => {
                  const isSelected = selected.has(v.name);
                  const isDash = v.name === '-' || v.name === '';
                  return (
                    <button key={v.name} onClick={() => !isDash && toggleSelect(v.name)} disabled={isDash} className={`w-full px-4 py-2.5 flex items-center gap-3 text-left border-b border-border/50 last:border-b-0 transition-all ${isDash ? 'opacity-30 cursor-not-allowed' : isSelected ? 'bg-blue-500/[0.06]' : 'hover:bg-muted/50'}`}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-border'}`}>{isSelected && <Check className="w-2.5 h-2.5 text-white" />}</div>
                      <span className={`text-xs font-medium flex-1 truncate ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>{capitalizeWords(v.name)}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {v.products > 0 && <span className="text-[9px] font-semibold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">{v.products} prod</span>}
                        {v.index > 0 && <span className="text-[9px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">{v.index} idx</span>}
                        <span className="text-[9px] font-medium text-muted-foreground w-8 text-right">{v.total}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selected.size >= 2 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Merging:</span>
                    {Array.from(selected).map(name => (
                      <span key={name} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-600 rounded-lg text-[11px] font-semibold">
                        {capitalizeWords(name)}
                        <button onClick={() => toggleSelect(name)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    <span className="text-[10px] text-muted-foreground font-medium">({selectedTotal} rows total)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input type="text" value={canonicalName} onChange={(e) => setCanonicalName(e.target.value)} placeholder="Canonical name..." className="flex-1 px-3 py-2.5 bg-muted border border-border rounded-xl text-xs font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50" />
                    <button onClick={handlePreview} disabled={!canonicalName.trim()} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-40"><Eye className="w-3.5 h-3.5" />Preview</button>
                  </div>
                </div>
              )}
              {selected.size === 1 && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl"><AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" /><span className="text-[11px] text-muted-foreground font-medium">Select at least 2 names to consolidate.</span></div>
              )}
            </div>
          )}

          {/* Preview phase */}
          {phase === 'previewing' && (
            <div className="contents">
              <div className="flex items-center gap-6 text-xs flex-wrap">
                <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Target:</span><span className="font-semibold text-blue-500">"{canonicalName.trim()}"</span></div>
                <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Sources:</span><span className="font-semibold text-foreground">{selected.size} names</span></div>
                <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Rows affected:</span><span className="font-semibold text-foreground">{changes.length}</span></div>
              </div>

              {changes.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border"><CheckCircle2 className="w-5 h-5 text-[#08a671] shrink-0" /><p className="text-sm text-muted-foreground font-medium">All rows already use the canonical name.</p></div>
              ) : (
                <div className="contents">
                  <div className="border border-border rounded-xl overflow-hidden max-h-[320px] overflow-y-auto divide-y divide-border/50">
                    {changes.map((ch: any) => (
                      <div key={`${ch.table}-${ch.id}`} className="px-4 py-2.5 flex items-center gap-3 flex-wrap">
                        <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${ch.table === 'Products' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>{ch.table}</span>
                        <code className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">id:{ch.id}</code>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-xs text-red-400 font-medium line-through truncate max-w-[160px]" title={ch.oldValue}>{ch.oldValue}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="text-xs text-[#08a671] font-semibold truncate max-w-[160px]" title={ch.newValue}>{ch.newValue}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded shrink-0 truncate max-w-[200px]">{ch.productName}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={handleExecute} className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-all"><Merge className="w-3.5 h-3.5" />Consolidate {changes.length} Row{changes.length !== 1 ? 's' : ''}</button>
                    <button onClick={handleBackToSelect} className="px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-all">Back</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Done */}
          {phase === 'done' && result && (
            <div className="flex items-center gap-3 p-4 bg-[#08a671]/5 rounded-xl border border-[#08a671]/20"><CheckCircle2 className="w-5 h-5 text-[#08a671] shrink-0" /><p className="text-sm text-[#08a671] font-medium">Done. Updated {result.productsUpdated} Products row(s) and {result.indexUpdated} Index row(s) to "{canonicalName.trim()}".</p></div>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Rule #4: Sync Names from Index → Products
// ═══════════════════════════════════════════════════════════════

export const SyncNamesFromIndexRule: React.FC = () => {
  const [phase, setPhase] = useState<RulePhase>('idle');
  const [mismatches, setMismatches] = useState<NameMismatch[]>([]);
  const [stats, setStats] = useState<{ productsCount: number; indexCount: number; matchedCount: number } | null>(null);
  const [result, setResult] = useState<{ updated: number; errors: number; firstError?: string | null; detectedCols?: any } | null>(null);

  const handleScan = useCallback(async () => {
    try {
      setPhase('scanning'); setMismatches([]); setResult(null); setStats(null);
      const res = await api.syncNamesFromIndex(true);
      setMismatches(res.mismatches);
      setStats({ productsCount: res.productsCount || 0, indexCount: res.indexCount || 0, matchedCount: res.matchedCount || 0 });
      setPhase('scanned');
      if (res.mismatches.length === 0) toast.success('Products table is in sync with Index — no mismatches found');
      else toast(`Found ${res.mismatches.length} name/curator mismatch(es) between Index and Products`);
    } catch (err: any) { console.error('Sync names scan failed:', err); toast.error(err.message || 'Failed'); setPhase('idle'); }
  }, []);

  const handleExecute = useCallback(async () => {
    if (mismatches.length === 0) return;
    try {
      setPhase('running');
      const res = await api.syncNamesFromIndex(false);
      setResult({ updated: res.updated || 0, errors: res.errors || 0, firstError: (res as any).firstError, detectedCols: (res as any).detectedCols });
      setPhase('done');
      toast.success(`Synced ${res.updated || 0} product(s) from Index → Products`);
    } catch (err: any) { console.error('Sync names execution failed:', err); toast.error(err.message || 'Failed'); setPhase('scanned'); }
  }, [mismatches]);

  const handleReset = () => { setPhase('idle'); setMismatches([]); setStats(null); setResult(null); };

  const nameChanges = mismatches.filter(m => m.nameChanged);
  const curatorChanges = mismatches.filter(m => m.curatorChanged);
  const platformChanges = mismatches.filter(m => m.platformChanged);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#08a671]/10 flex items-center justify-center shrink-0"><RefreshCw className="w-5 h-5 text-[#08a671]" /></div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">Sync: Index → Products</h3>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider bg-[#08a671]/10 text-[#08a671] shrink-0">Rule #4</span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-500 shrink-0">Recovery</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">
              Index is the source of truth for curated <code className="text-[11px] bg-muted px-1 py-0.5 rounded font-mono">productName</code>, <code className="text-[11px] bg-muted px-1 py-0.5 rounded font-mono">curator</code>, and <code className="text-[11px] bg-muted px-1 py-0.5 rounded font-mono">platform</code>. After a deploy that overwrites Products with stale data, this rule pushes the correct values back. Matches by <code className="text-[11px] bg-muted px-1 py-0.5 rounded font-mono">defillamaId</code>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {phase === 'idle' && <button onClick={handleScan} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-xs font-semibold hover:opacity-90 transition-all"><Search className="w-3.5 h-3.5" />Scan</button>}
          {phase === 'scanning' && <div className="flex items-center gap-2 px-5 py-2.5 bg-muted rounded-xl text-xs font-semibold text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" />Comparing tables...</div>}
          {phase === 'scanned' && mismatches.length > 0 && <button onClick={handleExecute} className="flex items-center gap-2 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-xs font-semibold hover:bg-[#08a671]/90 transition-all shadow-sm"><RefreshCw className="w-3.5 h-3.5" />Push {mismatches.length} Fix{mismatches.length !== 1 ? 'es' : ''}</button>}
          {phase === 'running' && <div className="flex items-center gap-2 px-5 py-2.5 bg-[#08a671]/80 text-white rounded-xl text-xs font-semibold"><Loader2 className="w-3.5 h-3.5 animate-spin" />Syncing...</div>}
          {phase === 'done' && <button onClick={handleReset} className="flex items-center gap-2 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-xs font-semibold hover:bg-[#08a671]/90 transition-all"><CheckCircle2 className="w-3.5 h-3.5" />Done — Scan Again</button>}
          {phase === 'scanned' && <button onClick={handleReset} className="px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-all">Reset</button>}
        </div>
      </div>

      {phase !== 'idle' && (
        <div className="p-5 md:p-6 space-y-4">
          {stats && (
            <div className="flex items-center gap-6 text-xs flex-wrap">
              <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Products:</span><span className="font-semibold text-foreground">{stats.productsCount}</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Index:</span><span className="font-semibold text-foreground">{stats.indexCount}</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Matched:</span><span className="font-semibold text-foreground">{stats.matchedCount}</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground font-medium">Mismatches:</span><span className={`font-semibold ${mismatches.length > 0 ? 'text-amber-500' : 'text-[#08a671]'}`}>{mismatches.length}</span></div>
              {nameChanges.length > 0 && <span className="text-[9px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">{nameChanges.length} name</span>}
              {curatorChanges.length > 0 && <span className="text-[9px] font-semibold text-purple-500 bg-purple-500/10 px-1.5 py-0.5 rounded">{curatorChanges.length} curator</span>}
              {platformChanges.length > 0 && <span className="text-[9px] font-semibold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">{platformChanges.length} platform</span>}
            </div>
          )}

          {phase === 'scanned' && mismatches.length === 0 && (
            <div className="flex items-center gap-3 p-4 bg-[#08a671]/5 rounded-xl border border-[#08a671]/20"><CheckCircle2 className="w-5 h-5 text-[#08a671] shrink-0" /><p className="text-sm text-[#08a671] font-medium">All Products names, curators, and platforms match Index. No sync needed.</p></div>
          )}
          {phase === 'done' && result && (
            <div className="flex items-center gap-3 p-4 bg-[#08a671]/5 rounded-xl border border-[#08a671]/20"><CheckCircle2 className="w-5 h-5 text-[#08a671] shrink-0" /><p className="text-sm text-[#08a671] font-medium">Done. Updated {result.updated} product(s). {result.errors > 0 ? `${result.errors} error(s).` : 'No errors.'}</p></div>
          )}

          {mismatches.length > 0 && phase !== 'done' && (
            <div className="border border-border rounded-xl overflow-hidden max-h-[400px] overflow-y-auto divide-y divide-border/50">
              {mismatches.map((m) => (
                <div key={m.productsId} className="px-4 py-3 space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <code className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">prod:{m.productsId} idx:{m.indexId}</code>
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded shrink-0">{m.ticker} · {m.network} · {m.platform}</span>
                  </div>
                  {m.nameChanged && (
                    <div className="flex items-center gap-2 pl-1">
                      <span className="text-[9px] font-semibold text-amber-500 uppercase tracking-wider shrink-0 w-14">Name</span>
                      <span className="text-xs text-red-400 font-medium line-through truncate max-w-[250px]" title={m.oldProductName}>{m.oldProductName}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-[#08a671] font-semibold truncate max-w-[250px]" title={m.newProductName}>{m.newProductName}</span>
                    </div>
                  )}
                  {m.curatorChanged && (
                    <div className="flex items-center gap-2 pl-1">
                      <span className="text-[9px] font-semibold text-purple-500 uppercase tracking-wider shrink-0 w-14">Curator</span>
                      <span className="text-xs text-red-400 font-medium line-through truncate max-w-[250px]" title={m.oldCurator}>{m.oldCurator || '-'}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-purple-500 font-semibold truncate max-w-[250px]" title={m.newCurator}>{capitalizeWords(m.newCurator)}</span>
                    </div>
                  )}
                  {m.platformChanged && (
                    <div className="flex items-center gap-2 pl-1">
                      <span className="text-[9px] font-semibold text-blue-500 uppercase tracking-wider shrink-0 w-14">Platform</span>
                      <span className="text-xs text-red-400 font-medium line-through truncate max-w-[250px]" title={m.oldPlatform}>{m.oldPlatform || '-'}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-blue-500 font-semibold truncate max-w-[250px]" title={m.newPlatform}>{capitalizeWords(m.newPlatform)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};