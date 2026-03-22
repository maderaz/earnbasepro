'use client';

/**
 * IconsPanel — Control Room tab for managing asset and network icons.
 *
 * Sources icons from TWO places merged together:
 *  1. The registry DB (existing entries with/without iconUrl)
 *  2. Live product data (every unique ticker/network actually used in the app)
 *
 * Any ticker or network found in live data but missing from the registry
 * is shown as "unregistered" — uploading an icon auto-creates the entry.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/app/utils/api';
import { useRegistry } from '../hooks/useRegistry';

// ─── Merged entry type ────────────────────────────────────────

interface IconEntry {
  /** ID used for upsert — lowercase ticker / network id */
  id: string;
  /** Human-readable label */
  label: string;
  sublabel?: string;
  type: api.RegistryType;
  folder: string;
  iconUrl?: string;
  /** true = exists in registry DB */
  inRegistry: boolean;
}

// Known static networks (mirrors NETWORK_CONFIG in useRegistry)
const KNOWN_NETWORKS = [
  { id: 'ethereum', name: 'Ethereum', aliases: ['eth', 'mainnet', 'ethereum'] },
  { id: 'base', name: 'Base', aliases: ['base'] },
  { id: 'arbitrum', name: 'Arbitrum', aliases: ['arbitrum', 'arb'] },
  { id: 'bnb', name: 'BNB Chain', aliases: ['bnb', 'bsc', 'binance'] },
  { id: 'sonic', name: 'Sonic', aliases: ['sonic', 'fraxtal'] },
  { id: 'avalanche', name: 'Avalanche', aliases: ['avalanche', 'avax'] },
];

// ─── Single icon tile with upload ────────────────────────────

interface IconTileProps {
  entry: IconEntry;
  /** ticker or name fields to use when auto-creating a registry entry */
  autoCreateFields?: Record<string, any>;
  onSaved: () => void;
}

const IconTile: React.FC<IconTileProps> = ({ entry, autoCreateFields, onSaved }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [localUrl, setLocalUrl] = useState(entry.iconUrl);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  useEffect(() => { setLocalUrl(entry.iconUrl); }, [entry.iconUrl]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File must be under 2 MB');
      return;
    }
    setUploading(true);
    setStatus('idle');
    try {
      const { signedUrl, path } = await api.uploadIcon(file, entry.folder);
      // upsertRegistryItem handles create-or-update — safe for unregistered entries
      await api.upsertRegistryItem(entry.type, entry.id, {
        ...(autoCreateFields ?? {}),
        iconUrl: signedUrl,
        iconPath: path,
        iconType: 'custom',
      });
      setLocalUrl(signedUrl);
      setStatus('ok');
      toast.success(`${entry.label} icon updated`);
      onSaved();
    } catch (err: any) {
      setStatus('error');
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [entry, autoCreateFields, onSaved]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload icon for ${entry.label}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer group transition-all shrink-0 overflow-hidden ${
          dragOver
            ? 'border-[#08a671] bg-[#08a671]/10 scale-105'
            : localUrl
              ? 'border-border hover:border-[#08a671]/60'
              : entry.inRegistry
                ? 'border-border/60 hover:border-[#08a671]/60 bg-muted/30'
                : 'border-dashed border-amber-400/50 hover:border-amber-400 bg-amber-50/10 dark:bg-amber-900/5'
        }`}
      >
        {uploading ? (
          <div className="w-5 h-5 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
        ) : localUrl ? (
          <>
            <img src={localUrl} alt={entry.label} className="w-10 h-10 object-contain" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[14px]">
              <Upload className="w-4 h-4 text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-[#08a671] transition-colors">
            <ImageIcon className="w-5 h-5" />
            <span className="text-[7px] font-bold uppercase tracking-widest">Upload</span>
          </div>
        )}

        {status === 'ok' && (
          <span className="absolute top-1 right-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#08a671]" />
          </span>
        )}
        {status === 'error' && (
          <span className="absolute top-1 right-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </span>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
        />
      </div>

      <div className="text-center max-w-[72px]">
        <p className="text-[12px] font-semibold text-foreground leading-tight truncate">{entry.label}</p>
        {entry.sublabel && (
          <p className="text-[9px] text-muted-foreground leading-tight mt-0.5 truncate">{entry.sublabel}</p>
        )}
        {!entry.inRegistry && (
          <p className="text-[8px] text-amber-500 font-bold uppercase tracking-wider mt-0.5">not in registry</p>
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
  const [assetEntries, setAssetEntries] = useState<IconEntry[]>([]);
  const [networkEntries, setNetworkEntries] = useState<IconEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch registry and live products in parallel
      const [regData, poolsData] = await Promise.all([
        api.fetchRegistryAll(),
        api.fetchPools().catch(() => ({ products: [] })),
      ]);

      const registryAssets = regData.assets ?? [];
      const registryNetworks = regData.networks ?? [];
      const products: any[] = poolsData.products ?? [];

      // ── Build asset entries ─────────────────────────────────

      // Map registry assets by ticker (uppercase) and by _id
      const regAssetByTicker = new Map<string, api.RegistryItem>();
      for (const item of registryAssets) {
        if (item.ticker) regAssetByTicker.set(item.ticker.toUpperCase(), item);
        if (item._id) regAssetByTicker.set(item._id.toUpperCase(), item);
      }

      // Collect all unique tickers from live products
      const liveTickers = new Set<string>();
      for (const p of products) {
        if (p.ticker) liveTickers.add(p.ticker.toUpperCase());
      }

      // Start with all registry assets
      const assetMap = new Map<string, IconEntry>();
      for (const item of registryAssets) {
        const key = (item.ticker || item._id || '').toUpperCase();
        if (!key) continue;
        assetMap.set(key, {
          id: item._id!,
          label: item.ticker || item.name || item._id || '?',
          sublabel: item.ticker && item.name && item.name !== item.ticker ? item.name : undefined,
          type: 'asset',
          folder: 'assets',
          iconUrl: item.iconUrl,
          inRegistry: true,
        });
      }

      // Add live tickers not yet in registry
      for (const ticker of liveTickers) {
        if (!assetMap.has(ticker)) {
          assetMap.set(ticker, {
            id: ticker.toLowerCase(),
            label: ticker,
            type: 'asset',
            folder: 'assets',
            iconUrl: undefined,
            inRegistry: false,
          });
        }
      }

      // Sort: registry items first, then by label
      const sortedAssets = Array.from(assetMap.values()).sort((a, b) => {
        if (a.inRegistry !== b.inRegistry) return a.inRegistry ? -1 : 1;
        return a.label.localeCompare(b.label);
      });

      // ── Build network entries ───────────────────────────────

      // Map registry networks by _id and aliases
      const regNetworkById = new Map<string, api.RegistryItem>();
      for (const item of registryNetworks) {
        if (item._id) regNetworkById.set(item._id.toLowerCase(), item);
      }

      // Collect all unique networks from live products
      const liveNetworks = new Set<string>();
      for (const p of products) {
        const n: string = (p.network || p.chain || '').toLowerCase().trim();
        if (n) liveNetworks.add(n);
      }

      const networkMap = new Map<string, IconEntry>();

      // Seed from KNOWN_NETWORKS (canonical IDs)
      for (const cfg of KNOWN_NETWORKS) {
        const regItem = regNetworkById.get(cfg.id);
        networkMap.set(cfg.id, {
          id: regItem?._id ?? cfg.id,
          label: regItem?.name ?? cfg.name,
          sublabel: cfg.aliases.slice(0, 2).join(', '),
          type: 'network',
          folder: 'networks',
          iconUrl: regItem?.iconUrl,
          inRegistry: !!regItem,
        });
      }

      // Add remaining registry networks not covered by KNOWN_NETWORKS
      for (const item of registryNetworks) {
        const key = item._id?.toLowerCase() ?? '';
        if (!networkMap.has(key)) {
          networkMap.set(key, {
            id: item._id!,
            label: item.name || item._id || '?',
            sublabel: (item.aliases || []).slice(0, 2).join(', '),
            type: 'network',
            folder: 'networks',
            iconUrl: item.iconUrl,
            inRegistry: true,
          });
        }
      }

      // Add live networks that match no known/registry entry
      for (const rawNet of liveNetworks) {
        const matched = KNOWN_NETWORKS.some(cfg => cfg.aliases.some(a => rawNet.includes(a)));
        if (!matched && !regNetworkById.has(rawNet)) {
          networkMap.set(rawNet, {
            id: rawNet,
            label: rawNet,
            type: 'network',
            folder: 'networks',
            iconUrl: undefined,
            inRegistry: false,
          });
        }
      }

      const sortedNetworks = Array.from(networkMap.values()).sort((a, b) => {
        if (a.inRegistry !== b.inRegistry) return a.inRegistry ? -1 : 1;
        return a.label.localeCompare(b.label);
      });

      setAssetEntries(sortedAssets);
      setNetworkEntries(sortedNetworks);
    } catch {
      toast.error('Failed to load icon data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaved = useCallback(async () => {
    await load();
    refreshRegistry();
  }, [load, refreshRegistry]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
      </div>
    );
  }

  const unregisteredAssets = assetEntries.filter(e => !e.inRegistry).length;
  const unregisteredNetworks = networkEntries.filter(e => !e.inRegistry).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          Click or drag an image to upload. SVG, PNG, JPG — max 2 MB.
          {(unregisteredAssets + unregisteredNetworks) > 0 && (
            <span className="ml-2 text-amber-500 font-medium">
              {unregisteredAssets + unregisteredNetworks} item{unregisteredAssets + unregisteredNetworks > 1 ? 's' : ''} from live data not yet in registry — uploading an icon creates the entry automatically.
            </span>
          )}
        </p>
        <button
          onClick={handleSaved}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors border border-border shrink-0 ml-4"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Assets */}
      <Section
        title="Asset Icons (Tickers)"
        subtitle={`${assetEntries.length} assets — tickers from registry + live product data`}
      >
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-5">
          {assetEntries.map((entry) => (
            <IconTile
              key={entry.id}
              entry={entry}
              autoCreateFields={entry.inRegistry ? undefined : {
                ticker: entry.label,
                name: entry.label,
              }}
              onSaved={handleSaved}
            />
          ))}
        </div>
      </Section>

      {/* Networks */}
      <Section
        title="Network Icons"
        subtitle={`${networkEntries.length} networks — from registry, known networks, and live product data`}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
          {networkEntries.map((entry) => (
            <IconTile
              key={entry.id}
              entry={entry}
              autoCreateFields={entry.inRegistry ? undefined : {
                name: entry.label,
                aliases: [entry.id],
              }}
              onSaved={handleSaved}
            />
          ))}
        </div>
      </Section>

      <p className="text-[11px] text-muted-foreground text-center pb-4">
        Icons stored in Supabase Storage — changes propagate immediately across all pages.
      </p>
    </div>
  );
};
