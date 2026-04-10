'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Globe, Coins, Building2, Users, Plus, Trash2, Edit2, Save, X,
  Upload, Image as ImageIcon, CheckCircle2, AlertCircle, Search,
  Settings, ChevronRight, Sparkles, RefreshCw,
  BookOpen, MousePointerClick, Eye, EyeOff, Landmark, Link2,
  TrendingUp, LayoutDashboard, BarChart2
} from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/app/utils/api';
import type { RegistryItem, RegistryType } from '@/app/utils/api';
import { useRegistry } from '../hooks/useRegistry';
import { ControlRoomRules } from './ControlRoomRules';
import { ClicksPanel } from './ClicksPanel';
import { SearchesPanel } from './SearchesPanel';
import { ClientsPanel } from './ClientsPanel';
import { TrafficPanel } from './TrafficPanel';
import { HiddenProductsPanel } from './HiddenProductsPanel';
import { PrivateCreditPanel } from './PrivateCreditPanel';
import { AnalyticsPanel } from './AnalyticsPanel';
import { SerpViewPanel } from './SerpViewPanel';
import { DashboardPanel } from './DashboardPanel';
import { IconsPanel } from './IconsPanel';

// ─── Platform Strategies Table ───────────────────────────────
const PlatformStrategiesTable: React.FC = () => {
  const [rows, setRows] = useState<{ platform: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { products } = await api.fetchPools();
        const counts: Record<string, number> = {};
        products.forEach((p: any) => {
          const name = (p.platform_name || 'Unknown').trim();
          counts[name] = (counts[name] || 0) + 1;
        });
        const sorted = Object.entries(counts)
          .map(([platform, count]) => ({ platform, count }))
          .sort((a, b) => b.count - a.count);
        setRows(sorted);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
      </div>
    );
  }

  const total = rows.reduce((s, r) => s + r.count, 0);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">Strategies by Platform</h3>
          <p className="text-[11px] text-muted-foreground">{rows.length} platforms · {total} strategies tracked</p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-5 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Platform</th>
            <th className="text-right px-5 py-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"># Strategies</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.platform} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
              <td className="px-5 py-2.5 text-[13px] text-foreground font-medium">{r.platform}</td>
              <td className="px-5 py-2.5 text-[13px] text-foreground text-right tabular-nums">{r.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type SectionTab = 'dashboard' | 'registry' | 'icons' | 'rules' | 'clicks' | 'searches' | 'clients' | 'traffic' | 'hidden' | 'private-credit' | 'analytics' | 'serp';

// ─── Types ───────────────────────────────────────────────────
interface TabConfig {
  type: RegistryType;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
  fields: FieldConfig[];
}

interface FieldConfig {
  key: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'tags';
}

const TABS: TabConfig[] = [
  {
    type: 'network',
    label: 'Networks',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    description: 'Blockchain networks where yield products are deployed',
    fields: [
      { key: 'name', label: 'Display Name', placeholder: 'e.g. Ethereum', required: true },
      { key: 'aliases', label: 'Aliases (comma separated)', placeholder: 'e.g. eth, mainnet, ethereum', type: 'tags' },
    ],
  },
  {
    type: 'asset',
    label: 'Assets',
    icon: Coins,
    color: 'text-[#08a671]',
    bgColor: 'bg-[#08a671]/10',
    description: 'Tracked tokens and cryptocurrencies',
    fields: [
      { key: 'ticker', label: 'Ticker Symbol', placeholder: 'e.g. USDC', required: true },
      { key: 'name', label: 'Full Name', placeholder: 'e.g. USD Coin', required: true },
    ],
  },
  {
    type: 'platform',
    label: 'Platforms',
    icon: Building2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    description: 'DeFi protocols and yield platforms',
    fields: [
      { key: 'name', label: 'Platform Name', placeholder: 'e.g. Aave', required: true },
    ],
  },
  {
    type: 'curator',
    label: 'Curators',
    icon: Users,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    description: 'Vault curators and risk managers',
    fields: [
      { key: 'name', label: 'Curator Name', placeholder: 'e.g. Gauntlet', required: true },
    ],
  },
];

// ─── Icon Upload Component ───────────────────────────────────
const IconUploader: React.FC<{
  currentUrl?: string;
  staticIcon?: string | null;
  folder: string;
  onUploaded: (url: string, path: string) => void;
}> = ({ currentUrl, staticIcon, folder, onUploaded }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File must be under 2MB');
      return;
    }
    try {
      setUploading(true);
      const result = await api.uploadIcon(file, folder);
      onUploaded(result.signedUrl, result.path);
      toast.success('Icon uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const displayIcon = currentUrl || staticIcon;

  return (
    <div
      className={`relative w-20 h-20 rounded-2xl border-2 border-dashed transition-all cursor-pointer group flex items-center justify-center overflow-hidden shrink-0 ${
        dragOver ? 'border-[#08a671] bg-[#08a671]/5 scale-105' : 'border-border hover:border-[#08a671]/50'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
    >
      {uploading ? (
        <div className="w-5 h-5 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
      ) : displayIcon ? (
        <span className="contents">
          <img src={displayIcon} alt="" className="w-12 h-12 object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="w-4 h-4 text-white" />
          </div>
        </span>
      ) : (
        <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-[#08a671] transition-colors">
          <ImageIcon className="w-5 h-5" />
          <span className="text-[8px] font-bold uppercase tracking-widest">Upload</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
};

// ─── Registry Item Card ──────────────────────────────────────
const RegistryCard: React.FC<{
  item: RegistryItem;
  tab: TabConfig;
  resolveIcon: (item: RegistryItem) => string | null;
  onSave: (id: string, data: Record<string, any>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}> = ({ item, tab, resolveIcon, onSave, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setFormData({
      name: item.name || '',
      ticker: item.ticker || '',
      aliases: Array.isArray(item.aliases) ? item.aliases.join(', ') : '',
      iconUrl: item.iconUrl || '',
      iconPath: item.iconPath || '',
      iconType: item.iconType || 'static',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: Record<string, any> = { ...formData };
      if (typeof payload.aliases === 'string') {
        payload.aliases = payload.aliases.split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean);
      }
      await onSave(item._id, payload);
      setEditing(false);
    } catch (err) {
      // handled by parent
    } finally {
      setSaving(false);
    }
  };

  const handleIconUploaded = (url: string, path: string) => {
    setFormData(prev => ({ ...prev, iconUrl: url, iconPath: path, iconType: 'custom' }));
  };

  const displayIcon = item.iconUrl || resolveIcon(item);
  const isDefault = item.iconType === 'static';

  if (editing) {
    return (
      <div className="bg-card rounded-2xl border-2 border-[#08a671]/30 p-5 space-y-4 shadow-lg shadow-[#08a671]/5">
        <div className="flex items-start gap-4">
          <IconUploader
            currentUrl={formData.iconUrl}
            staticIcon={resolveIcon(item)}
            folder={tab.type + 's'}
            onUploaded={handleIconUploaded}
          />
          <div className="flex-1 space-y-3">
            {tab.fields.map(field => (
              <div key={field.key} className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{field.label}</label>
                <input
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#08a671] text-white rounded-xl text-xs font-bold hover:bg-[#08a671]/90 transition-all disabled:opacity-50"
          >
            {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-4 hover:border-border/80 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
          {displayIcon ? (
            <img src={displayIcon} alt={item.name} className="w-8 h-8 object-contain" />
          ) : (
            <span className="text-lg font-bold text-muted-foreground">{(item.name || item._id || '?')[0].toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-foreground truncate">{item.name || item._id}</h4>
            {item.ticker && item.ticker !== item.name && (
              <span className="px-1.5 py-0.5 bg-muted rounded text-[9px] font-bold text-muted-foreground uppercase shrink-0">
                {item.ticker}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {isDefault && (
              <span className="text-[9px] font-bold text-[#08a671] uppercase tracking-wider">Default</span>
            )}
            {item.iconUrl && (
              <span className="text-[9px] font-bold text-purple-500 uppercase tracking-wider">Custom Icon</span>
            )}
            {item.aliases && item.aliases.length > 0 && (
              <span className="text-[9px] text-muted-foreground font-medium truncate">
                {item.aliases.join(', ')}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={startEdit}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Add New Item Form ───────────────────────────────────────
const AddItemForm: React.FC<{
  tab: TabConfig;
  onAdd: (id: string, data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}> = ({ tab, onAdd, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, any>>({ iconType: 'custom' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const idField = tab.type === 'asset' ? (formData.ticker || formData.name) : formData.name;
    if (!idField) {
      toast.error('Name is required');
      return;
    }
    try {
      setSaving(true);
      const payload: Record<string, any> = { ...formData };
      if (typeof payload.aliases === 'string') {
        payload.aliases = payload.aliases.split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean);
      }
      const id = idField.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-');
      await onAdd(id, payload);
      onCancel();
    } catch (err) {
      // handled in parent
    } finally {
      setSaving(false);
    }
  };

  const handleIconUploaded = (url: string, path: string) => {
    setFormData(prev => ({ ...prev, iconUrl: url, iconPath: path, iconType: 'custom' }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border-2 border-dashed border-[#08a671]/30 p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Plus className="w-4 h-4 text-[#08a671]" />
        <span className="text-sm font-bold text-foreground">New {tab.label.slice(0, -1)}</span>
      </div>

      <div className="flex items-start gap-4">
        <IconUploader
          currentUrl={formData.iconUrl}
          staticIcon={null}
          folder={tab.type + 's'}
          onUploaded={handleIconUploaded}
        />
        <div className="flex-1 space-y-3">
          {tab.fields.map(field => (
            <div key={field.key} className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {field.label} {field.required && <span className="text-red-400">*</span>}
              </label>
              <input
                value={formData[field.key] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2 bg-[#08a671] text-white rounded-xl text-xs font-bold hover:bg-[#08a671]/90 transition-all disabled:opacity-50"
        >
          {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-3 h-3" />}
          Add {tab.label.slice(0, -1)}
        </button>
      </div>
    </form>
  );
};

// ─── Main Control Room Component ─────────────────────────────
export const ControlRoom: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RegistryType>('network');
  const [registry, setRegistry] = useState<api.RegistryAll>({ networks: [], assets: [], platforms: [], curators: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [sectionTab, setSectionTab] = useState<SectionTab>('dashboard');
  const [backfilling, setBackfilling] = useState(false);

  // Get the global registry context — changes here propagate app-wide
  const { resolveAssetIcon, resolveNetworkIcon, refreshRegistry } = useRegistry();

  // Helper to resolve icon for a registry item using the global context
  const resolveItemIcon = useCallback((item: RegistryItem): string | null => {
    if (item._type === 'asset') {
      return resolveAssetIcon(item.ticker || item.name || item._id);
    }
    if (item._type === 'network') {
      return resolveNetworkIcon(item._id || item.name);
    }
    return null;
  }, [resolveAssetIcon, resolveNetworkIcon]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.fetchRegistryAll();
      setRegistry(data);
    } catch (err: any) {
      console.error('Failed to fetch registry:', err);
      toast.error('Failed to load registry data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // After any mutation, refresh BOTH the local list AND the global context
  const refreshAll = useCallback(async () => {
    await Promise.all([fetchData(), refreshRegistry()]);
  }, [fetchData, refreshRegistry]);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await api.seedRegistry();
      toast.success('Registry seeded with defaults');
      await refreshAll();
    } catch (err: any) {
      toast.error(err.message || 'Failed to seed registry');
    } finally {
      setSeeding(false);
    }
  };

  const handleBackfillUrls = async () => {
    if (!confirm('Backfill URL slugs for all Index rows? This writes the computed vault slug into the "url" column. Safe to run multiple times (skips already-filled rows).')) return;
    try {
      setBackfilling(true);
      const result = await api.backfillIndexUrls();
      if (result.updated === 0 && result.skipped > 0) {
        toast.success(`All ${result.total} rows already have URL slugs`);
      } else {
        toast.success(`Backfill complete: ${result.updated} updated, ${result.skipped} skipped, ${result.errors} errors (${result.total} total)`);
      }
      if (result.sample && result.sample.length > 0) {
        console.log('[Backfill] Sample slugs:', result.sample);
      }
    } catch (err: any) {
      toast.error(err.message || 'Backfill failed');
      console.error('[Backfill] Error:', err);
    } finally {
      setBackfilling(false);
    }
  };

  const handleSaveItem = async (id: string, data: Record<string, any>) => {
    try {
      await api.upsertRegistryItem(activeTab, id, data);
      toast.success(`${activeTab} updated`);
      await refreshAll();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
      throw err;
    }
  };

  const handleAddItem = async (id: string, data: Record<string, any>) => {
    try {
      await api.upsertRegistryItem(activeTab, id, data);
      toast.success(`New ${activeTab} added`);
      setShowAddForm(false);
      await refreshAll();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add');
      throw err;
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm(`Delete this ${activeTab}? This cannot be undone.`)) return;
    try {
      await api.deleteRegistryItem(activeTab, id);
      toast.success(`${activeTab} deleted`);
      await refreshAll();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const currentTab = TABS.find(t => t.type === activeTab)!;
  const currentItems = (() => {
    switch (activeTab) {
      case 'network': return registry.networks;
      case 'asset': return registry.assets;
      case 'platform': return registry.platforms;
      case 'curator': return registry.curators;
      default: return [];
    }
  })();

  const filteredItems = searchQuery
    ? currentItems.filter(item => {
        const q = searchQuery.toLowerCase();
        return (
          (item.name || '').toLowerCase().includes(q) ||
          (item._id || '').toLowerCase().includes(q) ||
          (item.ticker || '').toLowerCase().includes(q) ||
          (item.aliases || []).some((a: string) => a.includes(q))
        );
      })
    : currentItems;

  const totalItems = registry.networks.length + registry.assets.length + registry.platforms.length + registry.curators.length;
  const isEmpty = totalItems === 0 && !loading;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[17px] font-medium text-foreground leading-tight">Control Room</h1>
        <p className="text-[13px] text-foreground/80 font-normal leading-relaxed">
          Manage networks, assets, platforms, curators, and analytics
        </p>
      </div>

      {/* Section Tabs */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-2xl border border-border w-max md:w-fit">
          {/* ── Tracking & Engagement ── */}
          <button
            onClick={() => setSectionTab('dashboard')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'dashboard'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => setSectionTab('analytics')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'analytics'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Analytics
          </button>
          <button
            onClick={() => setSectionTab('clicks')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'clicks'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            Clicks
          </button>
          <button
            onClick={() => setSectionTab('searches')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'searches'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Searches
          </button>
          <button
            onClick={() => setSectionTab('traffic')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'traffic'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Traffic
          </button>
          <button
            onClick={() => setSectionTab('clients')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'clients'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Clients
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-border/80 mx-1 shrink-0" />

          {/* ── Configuration Tools ── */}
          <button
            onClick={() => setSectionTab('registry')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'registry'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Registry
          </button>
          <button
            onClick={() => setSectionTab('icons')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'icons'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Icons
          </button>
          <button
            onClick={() => setSectionTab('rules')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'rules'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Rules
          </button>
          <button
            onClick={() => setSectionTab('hidden')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'hidden'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            Hidden
          </button>
          <button
            onClick={() => setSectionTab('private-credit')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'private-credit'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            Private Credit
          </button>
          <button
            onClick={() => setSectionTab('serp')}
            className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionTab === 'serp'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            SERP View
          </button>
        </div>
      </div>

      {/* ═══ Dashboard Section ═══ */}
      {sectionTab === 'dashboard' && <DashboardPanel />}

      {/* ═══ Analytics Section ═══ */}
      {sectionTab === 'analytics' && <AnalyticsPanel />}

      {/* ═══ Clicks Section ═══ */}
      {sectionTab === 'clicks' && <ClicksPanel />}

      {/* ═══ Searches Section ═══ */}
      {sectionTab === 'searches' && <SearchesPanel />}

      {/* ═══ Traffic Section ═══ */}
      {sectionTab === 'traffic' && <TrafficPanel />}

      {/* ═══ Clients Section ═══ */}
      {sectionTab === 'clients' && <ClientsPanel />}

      {/* ═══ Hidden Products Section ═══ */}
      {sectionTab === 'hidden' && <HiddenProductsPanel />}

      {/* ═══ Private Credit Section ═══ */}
      {sectionTab === 'private-credit' && <PrivateCreditPanel />}

      {/* ═══ Icons Section ═══ */}
      {sectionTab === 'icons' && <IconsPanel />}

      {/* ═══ SERP View Section ═══ */}
      {sectionTab === 'serp' && <SerpViewPanel />}

      {/* ═══ Rules Section ═══ */}
      {sectionTab === 'rules' && <ControlRoomRules />}

      {/* ═══ Registry Section ═══ */}
      {sectionTab === 'registry' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TABS.map(tab => {
              const count = (() => {
                switch (tab.type) {
                  case 'network': return registry.networks.length;
                  case 'asset': return registry.assets.length;
                  case 'platform': return registry.platforms.length;
                  case 'curator': return registry.curators.length;
                }
              })();
              return (
                <button
                  key={tab.type}
                  onClick={() => { setActiveTab(tab.type); setShowAddForm(false); setSearchQuery(''); }}
                  className={`relative p-4 rounded-2xl border transition-all text-left group ${
                    activeTab === tab.type
                      ? 'border-foreground/20 bg-card shadow-sm'
                      : 'border-border bg-card/50 hover:bg-card hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl ${tab.bgColor} flex items-center justify-center`}>
                      <tab.icon className={`w-4 h-4 ${tab.color}`} />
                    </div>
                    {activeTab === tab.type && (
                      <div className="w-2 h-2 rounded-full bg-[#08a671]" />
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{tab.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{count}</p>
                </button>
              );
            })}
          </div>

          {/* Seed CTA — shown when registry is empty */}
          {isEmpty && (
            <div className="bg-card rounded-2xl border-2 border-dashed border-[#08a671]/30 p-8 text-center space-y-4">
              <div className="w-14 h-14 bg-[#08a671]/10 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-[#08a671]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Initialize Registry</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
                  Seed the registry with your current default networks and assets. This only needs to be done once — after that, manage everything from here.
                </p>
              </div>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#08a671] text-white rounded-xl font-bold hover:bg-[#08a671]/90 transition-all shadow-lg shadow-[#08a671]/20 disabled:opacity-50"
              >
                {seeding ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Seed Default Data
              </button>
            </div>
          )}

          {/* Tab Content */}
          {!isEmpty && (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Tab Header */}
              <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${currentTab.bgColor} flex items-center justify-center`}>
                    <currentTab.icon className={`w-5 h-5 ${currentTab.color}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{currentTab.label}</h2>
                    <p className="text-muted-foreground text-xs">{currentTab.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative flex-1 md:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={`Search ${currentTab.label.toLowerCase()}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671] outline-none transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Refresh */}
                  <button
                    onClick={refreshAll}
                    disabled={loading}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>

                  {/* Add Button */}
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      showAddForm
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-[#08a671] text-white hover:bg-[#08a671]/90 shadow-sm'
                    }`}
                  >
                    {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {showAddForm ? 'Cancel' : `Add ${currentTab.label.slice(0, -1)}`}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                {/* Add form */}
                {showAddForm && (
                  <AddItemForm
                    tab={currentTab}
                    onAdd={handleAddItem}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}

                {/* Loading */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-6 h-6 border-2 border-[#08a671]/30 border-t-[#08a671] rounded-full animate-spin" />
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Loading registry...</p>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    {searchQuery ? (
                      <div className="contents">
                        <Search className="w-8 h-8 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground text-sm">No {currentTab.label.toLowerCase()} matching "{searchQuery}"</p>
                      </div>
                    ) : (
                      <div className="contents">
                        <currentTab.icon className="w-8 h-8 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground text-sm font-medium">No {currentTab.label.toLowerCase()} registered yet</p>
                        <p className="text-muted-foreground text-xs mt-1">Click "Add {currentTab.label.slice(0, -1)}" to create one</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredItems.map((item) => (
                      <RegistryCard
                        key={item._id}
                        item={item}
                        tab={currentTab}
                        resolveIcon={resolveItemIcon}
                        onSave={handleSaveItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-[#08a671] rounded-full" />
                  {filteredItems.length} {currentTab.label.toLowerCase()} registered
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackfillUrls}
                    disabled={backfilling}
                    className="text-[9px] font-bold text-muted-foreground hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center gap-1.5"
                  >
                    {backfilling ? (
                      <div className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-500 rounded-full animate-spin" />
                    ) : (
                      <Link2 className="w-3 h-3" />
                    )}
                    Backfill URL Slugs
                  </button>
                  <button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="text-[9px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    Re-seed defaults
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Strategies by Platform — live count from Index */}
          <PlatformStrategiesTable />
        </div>
      )}
    </div>
  );
};