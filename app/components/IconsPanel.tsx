'use client';

/**
 * IconsPanel — Control Room tab for managing asset and network icons.
 * Shows all assets (tickers) and networks from the registry, displays their
 * current icons, and lets you upload/replace them with drag-and-drop.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/app/utils/api';
import type { RegistryItem } from '@/app/utils/api';
import { useRegistry } from '../hooks/useRegistry';

// ─── Single icon tile with upload ────────────────────────────

interface IconTileProps {
  id: string;
  label: string;
  sublabel?: string;
  type: api.RegistryType;
  iconUrl?: string;
  folder: string;
  onSaved: () => void;
}

const IconTile: React.FC<IconTileProps> = ({ id, label, sublabel, type, iconUrl, folder, onSaved }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [localUrl, setLocalUrl] = useState(iconUrl);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  // sync if parent refreshes
  useEffect(() => { setLocalUrl(iconUrl); }, [iconUrl]);

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
      const { signedUrl, path } = await api.uploadIcon(file, folder);
      await api.upsertRegistryItem(type, id, { iconUrl: signedUrl, iconPath: path, iconType: 'custom' });
      setLocalUrl(signedUrl);
      setStatus('ok');
      toast.success(`${label} icon updated`);
      onSaved();
    } catch (err: any) {
      setStatus('error');
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [folder, id, label, onSaved, type]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Drop zone / icon preview */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload icon for ${label}`}
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
              : 'border-border/60 hover:border-[#08a671]/60 bg-muted/30'
        }`}
      >
        {uploading ? (
          <div className="w-5 h-5 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
        ) : localUrl ? (
          <>
            <img src={localUrl} alt={label} className="w-10 h-10 object-contain" />
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

        {/* Status badge */}
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

      {/* Label */}
      <div className="text-center">
        <p className="text-[12px] font-semibold text-foreground leading-tight">{label}</p>
        {sublabel && <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
};

// ─── Section card wrapper ─────────────────────────────────────

interface SectionProps {
  title: string;
  subtitle: string;
  accentColor: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, subtitle, accentColor, children }) => (
  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-border">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

// ─── Main panel ───────────────────────────────────────────────

export const IconsPanel: React.FC = () => {
  const { refreshRegistry } = useRegistry();
  const [registry, setRegistry] = useState<api.RegistryAll>({ networks: [], assets: [], platforms: [], curators: [] });
  const [loading, setLoading] = useState(true);

  const loadRegistry = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.fetchRegistryAll();
      setRegistry(data);
    } catch {
      toast.error('Failed to load registry');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRegistry(); }, [loadRegistry]);

  const handleSaved = useCallback(async () => {
    await loadRegistry();
    refreshRegistry(); // propagate to app-wide icon resolution
  }, [loadRegistry, refreshRegistry]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
      </div>
    );
  }

  const assets = registry.assets;
  const networks = registry.networks;

  const hasNoAssets = assets.length === 0;
  const hasNoNetworks = networks.length === 0;

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-muted-foreground">
            Click or drag-and-drop an image onto any tile to upload. SVG, PNG, JPG — max 2 MB.
          </p>
        </div>
        <button
          onClick={handleSaved}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors border border-border"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Assets (Tickers) */}
      <Section
        title="Asset Icons"
        subtitle={`${assets.length} assets in registry — tickers shown in nav, filters, and product pages`}
        accentColor="text-[#08a671]"
      >
        {hasNoAssets ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No assets in registry yet. Seed the registry first.</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-5">
            {assets.map((item) => (
              <IconTile
                key={item._id}
                id={item._id!}
                label={item.ticker || item.name || item._id || '?'}
                sublabel={item.name}
                type="asset"
                iconUrl={item.iconUrl}
                folder="assets"
                onSaved={handleSaved}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Networks */}
      <Section
        title="Network Icons"
        subtitle={`${networks.length} networks in registry — shown in filter pills and product rows`}
        accentColor="text-blue-600"
      >
        {hasNoNetworks ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No networks in registry yet. Seed the registry first.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
            {networks.map((item) => (
              <IconTile
                key={item._id}
                id={item._id!}
                label={item.name || item._id || '?'}
                sublabel={(item.aliases || []).slice(0, 2).join(', ')}
                type="network"
                iconUrl={item.iconUrl}
                folder="networks"
                onSaved={handleSaved}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Hint */}
      <p className="text-[11px] text-muted-foreground text-center pb-4">
        Icons are stored in Supabase Storage and served globally. Changes propagate immediately across all pages.
      </p>
    </div>
  );
};
