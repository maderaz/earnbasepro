'use client';

/**
 * IconsPanel — staged icon management.
 *
 * Drop/click a file → local preview only (no upload yet).
 * Collect as many as you want → hit "Save X changes" → all upload at once.
 * Sources: registry DB + live product tickers/networks merged.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/app/utils/api';
import { useRegistry } from '../hooks/useRegistry';

// ─── Types ────────────────────────────────────────────────────

interface IconEntry {
  id: string;
  label: string;
  sublabel?: string;
  type: api.RegistryType;
  folder: string;
  iconUrl?: string;
  inRegistry: boolean;
  autoCreateFields?: Record<string, any>;
}

interface PendingItem {
  entry: IconEntry;
  file: File;
  previewUrl: string;
}

// ─── Static network list ──────────────────────────────────────

const KNOWN_NETWORKS = [
  { id: 'ethereum', name: 'Ethereum', aliases: ['eth', 'mainnet', 'ethereum'] },
  { id: 'base',     name: 'Base',     aliases: ['base'] },
  { id: 'arbitrum', name: 'Arbitrum', aliases: ['arbitrum', 'arb'] },
  { id: 'bnb',      name: 'BNB Chain',aliases: ['bnb', 'bsc', 'binance'] },
  { id: 'sonic',    name: 'Sonic',    aliases: ['sonic', 'fraxtal'] },
  { id: 'avalanche',name: 'Avalanche',aliases: ['avalanche', 'avax'] },
];

// ─── Icon tile ────────────────────────────────────────────────

interface IconTileProps {
  entry: IconEntry;
  pending?: PendingItem;
  saving?: boolean;
  saveStatus?: 'ok' | 'error';
  onStage: (entry: IconEntry, file: File) => void;
  onDiscard: (id: string) => void;
}

const IconTile: React.FC<IconTileProps> = ({ entry, pending, saving, saveStatus, onStage, onDiscard }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const validate = (file: File): boolean => {
    if (!file.type.startsWith('image/')) { toast.error('Only image files are allowed'); return false; }
    if (file.size > 2 * 1024 * 1024)    { toast.error('File must be under 2 MB');        return false; }
    return true;
  };

  const handleFile = (file: File) => {
    if (!validate(file)) return;
    onStage(entry, file);
  };

  const displayUrl = pending?.previewUrl ?? entry.iconUrl;
  const isPending  = !!pending && !saving && !saveStatus;

  // border colour logic
  const borderClass = dragOver
    ? 'border-[#08a671] bg-[#08a671]/10 scale-105'
    : isPending
      ? 'border-amber-400 bg-amber-50/10 dark:bg-amber-900/5'
      : saveStatus === 'ok'
        ? 'border-[#08a671]/60 bg-[#08a671]/5'
        : saveStatus === 'error'
          ? 'border-red-400/60'
          : displayUrl
            ? 'border-border hover:border-[#08a671]/60'
            : entry.inRegistry
              ? 'border-border/60 hover:border-[#08a671]/60 bg-muted/30'
              : 'border-amber-300/40 hover:border-amber-400 bg-amber-50/5 dark:bg-amber-900/5';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div
          role="button"
          tabIndex={0}
          aria-label={`Stage icon for ${entry.label}`}
          onClick={() => !saving && inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && !saving && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          className={`w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer group transition-all shrink-0 overflow-hidden ${borderClass}`}
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
          ) : displayUrl ? (
            <>
              <img src={displayUrl} alt={entry.label} className="w-10 h-10 object-contain" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[14px]">
                <Upload className="w-4 h-4 text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-[#08a671] transition-colors">
              <ImageIcon className="w-5 h-5" />
              <span className="text-[7px] font-bold uppercase tracking-widest">Drop</span>
            </div>
          )}

          {/* Status corner badge */}
          {saveStatus === 'ok'    && <span className="absolute top-1 right-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#08a671]" /></span>}
          {saveStatus === 'error' && <span className="absolute top-1 right-1"><AlertCircle  className="w-3.5 h-3.5 text-red-500"   /></span>}

          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
        </div>

        {/* Pending dot + discard button */}
        {isPending && (
          <button
            onClick={(e) => { e.stopPropagation(); onDiscard(entry.id); }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 hover:bg-red-500 flex items-center justify-center transition-colors shadow-sm"
            title="Discard this change"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}
      </div>

      <div className="text-center max-w-[72px]">
        <p className="text-[12px] font-semibold text-foreground leading-tight truncate">{entry.label}</p>
        {entry.sublabel && <p className="text-[9px] text-muted-foreground leading-tight mt-0.5 truncate">{entry.sublabel}</p>}
        {isPending && <p className="text-[8px] text-amber-500 font-bold uppercase tracking-wider mt-0.5">staged</p>}
        {!entry.inRegistry && !isPending && saveStatus !== 'ok' && (
          <p className="text-[8px] text-muted-foreground/60 font-medium uppercase tracking-wider mt-0.5">no icon</p>
        )}
      </div>
    </div>
  );
};

// ─── Section wrapper ──────────────────────────────────────────

const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-border">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── Main panel ───────────────────────────────────────────────

export const IconsPanel: React.FC = () => {
  const { refreshRegistry } = useRegistry();

  const [assetEntries,   setAssetEntries]   = useState<IconEntry[]>([]);
  const [networkEntries, setNetworkEntries] = useState<IconEntry[]>([]);
  const [loading,        setLoading]        = useState(true);

  // Staged changes: id → PendingItem
  const [pending, setPending] = useState<Map<string, PendingItem>>(new Map());

  // Per-tile save state (only during the commit pass)
  const [savingIds,  setSavingIds]  = useState<Set<string>>(new Set());
  const [savedOk,    setSavedOk]    = useState<Set<string>>(new Set());
  const [savedError, setSavedError] = useState<Set<string>>(new Set());
  const [committing, setCommitting] = useState(false);

  // ── Load ────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [regData, poolsData] = await Promise.all([
        api.fetchRegistryAll(),
        api.fetchPools().catch(() => ({ products: [] as any[] })),
      ]);

      const registryAssets   = regData.assets   ?? [];
      const registryNetworks = regData.networks  ?? [];
      const products: any[]  = poolsData.products ?? [];

      // ── Assets ─────────────────────────────────────────────

      const regAssetByKey = new Map<string, api.RegistryItem>();
      for (const item of registryAssets) {
        if (item.ticker) regAssetByKey.set(item.ticker.toUpperCase(), item);
        if (item._id)    regAssetByKey.set(item._id.toUpperCase(),    item);
      }

      const liveTickers = new Set<string>();
      for (const p of products) { if (p.ticker) liveTickers.add(p.ticker.toUpperCase()); }

      const assetMap = new Map<string, IconEntry>();
      for (const item of registryAssets) {
        const key = (item.ticker || item._id || '').toUpperCase();
        if (!key) continue;
        assetMap.set(key, {
          id: item._id!,
          label: item.ticker || item.name || item._id || '?',
          sublabel: item.ticker && item.name && item.name !== item.ticker ? item.name : undefined,
          type: 'asset', folder: 'assets',
          iconUrl: item.iconUrl,
          inRegistry: true,
        });
      }
      for (const ticker of liveTickers) {
        if (!assetMap.has(ticker)) {
          assetMap.set(ticker, {
            id: ticker.toLowerCase(), label: ticker,
            type: 'asset', folder: 'assets',
            inRegistry: false,
            autoCreateFields: { ticker, name: ticker },
          });
        }
      }
      const sortedAssets = Array.from(assetMap.values())
        .sort((a, b) => (a.inRegistry === b.inRegistry ? a.label.localeCompare(b.label) : a.inRegistry ? -1 : 1));

      // ── Networks ────────────────────────────────────────────

      const regNetById = new Map<string, api.RegistryItem>();
      for (const item of registryNetworks) { if (item._id) regNetById.set(item._id.toLowerCase(), item); }

      const liveNets = new Set<string>();
      for (const p of products) {
        const n = (p.network || p.chain || '').toLowerCase().trim();
        if (n) liveNets.add(n);
      }

      const networkMap = new Map<string, IconEntry>();
      for (const cfg of KNOWN_NETWORKS) {
        const reg = regNetById.get(cfg.id);
        networkMap.set(cfg.id, {
          id: reg?._id ?? cfg.id, label: reg?.name ?? cfg.name,
          sublabel: cfg.aliases.slice(0, 2).join(', '),
          type: 'network', folder: 'networks',
          iconUrl: reg?.iconUrl, inRegistry: !!reg,
          autoCreateFields: reg ? undefined : { name: cfg.name, aliases: cfg.aliases },
        });
      }
      for (const item of registryNetworks) {
        const key = item._id?.toLowerCase() ?? '';
        if (!networkMap.has(key)) {
          networkMap.set(key, {
            id: item._id!, label: item.name || item._id || '?',
            sublabel: (item.aliases || []).slice(0, 2).join(', '),
            type: 'network', folder: 'networks',
            iconUrl: item.iconUrl, inRegistry: true,
          });
        }
      }
      for (const rawNet of liveNets) {
        if (!KNOWN_NETWORKS.some(c => c.aliases.some(a => rawNet.includes(a))) && !regNetById.has(rawNet)) {
          networkMap.set(rawNet, {
            id: rawNet, label: rawNet,
            type: 'network', folder: 'networks',
            inRegistry: false,
            autoCreateFields: { name: rawNet, aliases: [rawNet] },
          });
        }
      }
      const sortedNetworks = Array.from(networkMap.values())
        .sort((a, b) => (a.inRegistry === b.inRegistry ? a.label.localeCompare(b.label) : a.inRegistry ? -1 : 1));

      setAssetEntries(sortedAssets);
      setNetworkEntries(sortedNetworks);
    } catch {
      toast.error('Failed to load icon data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Staging ─────────────────────────────────────────────────

  const stageFile = useCallback((entry: IconEntry, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPending(prev => {
      // Revoke old preview URL to avoid memory leak
      const old = prev.get(entry.id);
      if (old) URL.revokeObjectURL(old.previewUrl);
      return new Map(prev).set(entry.id, { entry, file, previewUrl });
    });
    // Clear any previous save status for this tile
    setSavedOk(prev    => { const s = new Set(prev); s.delete(entry.id); return s; });
    setSavedError(prev => { const s = new Set(prev); s.delete(entry.id); return s; });
  }, []);

  const discardOne = useCallback((id: string) => {
    setPending(prev => {
      const old = prev.get(id);
      if (old) URL.revokeObjectURL(old.previewUrl);
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const discardAll = useCallback(() => {
    setPending(prev => {
      prev.forEach(p => URL.revokeObjectURL(p.previewUrl));
      return new Map();
    });
    setSavedOk(new Set());
    setSavedError(new Set());
  }, []);

  // ── Commit ──────────────────────────────────────────────────

  const commitAll = useCallback(async () => {
    if (pending.size === 0) return;
    setCommitting(true);
    const items = Array.from(pending.values());

    const newSaving = new Set(items.map(p => p.entry.id));
    setSavingIds(newSaving);

    const ok    = new Set<string>();
    const error = new Set<string>();

    await Promise.all(items.map(async ({ entry, file, previewUrl }) => {
      try {
        const { signedUrl, path } = await api.uploadIcon(file, entry.folder);
        await api.upsertRegistryItem(entry.type, entry.id, {
          ...(entry.autoCreateFields ?? {}),
          iconUrl: signedUrl,
          iconPath: path,
          iconType: 'custom',
        });
        URL.revokeObjectURL(previewUrl);
        ok.add(entry.id);
      } catch (err: any) {
        error.add(entry.id);
        console.error(`Icon save failed for ${entry.label}:`, err);
      }
    }));

    setSavingIds(new Set());
    setSavedOk(ok);
    setSavedError(error);
    setCommitting(false);

    // Remove successfully saved items from pending
    setPending(prev => {
      const next = new Map(prev);
      ok.forEach(id => next.delete(id));
      return next;
    });

    if (ok.size > 0) {
      toast.success(`${ok.size} icon${ok.size > 1 ? 's' : ''} saved`);
      await load();
      refreshRegistry();
    }
    if (error.size > 0) {
      toast.error(`${error.size} icon${error.size > 1 ? 's' : ''} failed — check console`);
    }
  }, [pending, load, refreshRegistry]);

  // ── Render helpers ───────────────────────────────────────────

  const allEntries = [...assetEntries, ...networkEntries];
  const pendingCount = pending.size;

  const renderTile = (entry: IconEntry) => (
    <IconTile
      key={entry.id}
      entry={entry}
      pending={pending.get(entry.id)}
      saving={savingIds.has(entry.id)}
      saveStatus={savedOk.has(entry.id) ? 'ok' : savedError.has(entry.id) ? 'error' : undefined}
      onStage={stageFile}
      onDiscard={discardOne}
    />
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-[13px] text-muted-foreground">
          Drop or click any tile to stage an icon. Nothing uploads until you hit <strong>Save</strong>.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { discardAll(); load(); }}
            disabled={committing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors border border-border"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          {pendingCount > 0 && (
            <>
              <button
                onClick={discardAll}
                disabled={committing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-red-500 hover:bg-red-50/10 transition-colors border border-border"
              >
                <X className="w-3.5 h-3.5" />
                Discard all
              </button>
              <button
                onClick={commitAll}
                disabled={committing}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#08a671] hover:bg-[#07935f] disabled:opacity-60 transition-colors shadow-sm"
              >
                {committing ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save {pendingCount} change{pendingCount > 1 ? 's' : ''}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Assets ── */}
      <Section
        title="Asset Icons (Tickers)"
        subtitle={`${assetEntries.length} assets — registry + live product data`}
      >
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-5">
          {assetEntries.map(renderTile)}
        </div>
      </Section>

      {/* ── Networks ── */}
      <Section
        title="Network Icons"
        subtitle={`${networkEntries.length} networks — registry + known + live product data`}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
          {networkEntries.map(renderTile)}
        </div>
      </Section>

      <p className="text-[11px] text-muted-foreground text-center pb-4">
        Icons stored in Supabase Storage — changes propagate immediately after saving.
      </p>
    </div>
  );
};
