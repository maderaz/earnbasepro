/**
 * Rule #6 — Display Settings
 * Global min TVL (separate for asset pages & homepage) and zero-APY visibility toggle.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Save, CheckCircle2, SlidersHorizontal, Home, Layers } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '@/app/utils/api';

const TVL_PRESETS = [
  { label: 'No minimum', value: 0 },
  { label: '$1K', value: 1_000 },
  { label: '$10K', value: 10_000 },
  { label: '$50K', value: 50_000 },
  { label: '$100K', value: 100_000 },
  { label: '$500K', value: 500_000 },
  { label: '$1M', value: 1_000_000 },
  { label: '$10M', value: 10_000_000 },
];

function formatTvlLabel(v: number): string {
  if (v === 0) return 'No minimum';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(v % 1_000 === 0 ? 0 : 1)}K`;
  return `$${v.toLocaleString()}`;
}

/** Reusable TVL preset selector + custom input */
const TvlSelector: React.FC<{
  value: number;
  onChange: (v: number) => void;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string; // e.g. 'violet' or 'emerald'
}> = ({ value, onChange, label, description, icon, accentColor }) => {
  // Build dynamic class strings based on accent color
  const activeClass =
    accentColor === 'emerald'
      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400'
      : 'bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700/50 text-violet-700 dark:text-violet-400';
  const focusClass =
    accentColor === 'emerald'
      ? 'focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30'
      : 'focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30';
  const badgeClass =
    accentColor === 'emerald'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-violet-600 dark:text-violet-400';

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      </div>
      <p className="text-[11px] text-muted-foreground/70 mb-3">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {TVL_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
              value === preset.value
                ? activeClass
                : 'bg-white dark:bg-white/5 border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      {/* Custom input */}
      <div className="mt-2.5 flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground">Custom:</span>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground/50">$</span>
          <input
            type="number"
            min={0}
            step={1000}
            value={value}
            onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
            className={`w-[140px] pl-5 pr-3 py-1.5 rounded-lg border border-border/60 bg-white dark:bg-white/5 text-[12px] font-medium text-foreground ${focusClass} outline-none transition-all`}
          />
        </div>
        {value > 0 && (
          <span className={`text-[11px] font-medium ${badgeClass}`}>
            {formatTvlLabel(value)}
          </span>
        )}
      </div>
    </div>
  );
};

export const AssetDisplayRule: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Settings state
  const [assetMinTvl, setAssetMinTvl] = useState(0);
  const [homeMinTvl, setHomeMinTvl] = useState(0);
  const [showZeroApy, setShowZeroApy] = useState(false);

  // Track "dirty" state
  const [serverAssetMinTvl, setServerAssetMinTvl] = useState(0);
  const [serverHomeMinTvl, setServerHomeMinTvl] = useState(0);
  const [serverShowZeroApy, setServerShowZeroApy] = useState(false);

  const isDirty =
    assetMinTvl !== serverAssetMinTvl ||
    homeMinTvl !== serverHomeMinTvl ||
    showZeroApy !== serverShowZeroApy;

  // Load current settings
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const settings = await api.fetchDisplaySettings();
        setAssetMinTvl(settings.assetMinTvl ?? 0);
        setHomeMinTvl(settings.homeMinTvl ?? 0);
        setShowZeroApy(settings.showZeroApy ?? false);
        setServerAssetMinTvl(settings.assetMinTvl ?? 0);
        setServerHomeMinTvl(settings.homeMinTvl ?? 0);
        setServerShowZeroApy(settings.showZeroApy ?? false);
      } catch (err: any) {
        console.error('[Display Settings] Load failed:', err);
        toast.error('Failed to load display settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      await api.updateDisplaySettings({ assetMinTvl, homeMinTvl, showZeroApy });
      setServerAssetMinTvl(assetMinTvl);
      setServerHomeMinTvl(homeMinTvl);
      setServerShowZeroApy(showZeroApy);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success('Display settings saved');
    } catch (err: any) {
      console.error('[Display Settings] Save failed:', err);
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }, [assetMinTvl, homeMinTvl, showZeroApy]);

  return (
    <div className="rounded-xl border border-border/60 bg-white dark:bg-white/[0.02] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-muted/20">
        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-semibold text-foreground">Display Settings</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Global TVL thresholds and APY visibility for homepage and asset pages
          </p>
        </div>
        {isDirty && !saving && (
          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Unsaved
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-5">
        {loading ? (
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground py-3">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading settings...
          </div>
        ) : (
          <>
            {/* Asset Pages Min TVL */}
            <TvlSelector
              value={assetMinTvl}
              onChange={setAssetMinTvl}
              label="Asset Pages — Minimum TVL"
              description="Products below this TVL are hidden on all /ticker and /ticker/network pages. Does not affect Control Room, Studio, or hub pages."
              icon={<Layers className="w-3.5 h-3.5 text-violet-500" />}
              accentColor="violet"
            />

            {/* Divider */}
            <div className="h-px bg-border/40" />

            {/* Homepage Min TVL */}
            <TvlSelector
              value={homeMinTvl}
              onChange={setHomeMinTvl}
              label="Homepage — Minimum TVL"
              description="Products below this TVL are hidden from Top Yields, Yield Calculator, Trending, Explore Assets, and all homepage sections. Does not affect asset pages, vault pages, or hub pages."
              icon={<Home className="w-3.5 h-3.5 text-emerald-500" />}
              accentColor="emerald"
            />

            {/* Divider */}
            <div className="h-px bg-border/40" />

            {/* Show Zero APY toggle */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setShowZeroApy(!showZeroApy)}
                className={`mt-0.5 w-9 h-5 rounded-full relative transition-colors shrink-0 ${
                  showZeroApy ? 'bg-[#08a671]' : 'bg-border'
                }`}
              >
                <div
                  className={`absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${
                    showZeroApy ? 'left-[17px]' : 'left-[3px]'
                  }`}
                />
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-foreground">
                  Show 0.00% APY products
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                  When OFF, products displaying 0.00% APY (or less) in either column are hidden on homepage, asset pages, and vault sidebar recommendations. Platform and curator hub pages are not affected.
                  Currently <span className="font-semibold text-foreground">{showZeroApy ? 'showing' : 'hiding'}</span> zero-APY products.
                </p>
              </div>
            </div>

            {/* Save button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || saving}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                saved
                  ? 'bg-[#08a671]/10 text-[#08a671] border border-[#08a671]/30'
                  : isDirty
                    ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm'
                    : 'bg-muted/40 text-muted-foreground/50 border border-border/40 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {saving ? 'Saving...' : saved ? 'Saved' : 'Save Settings'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};