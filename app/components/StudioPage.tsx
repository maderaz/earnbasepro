'use client';

/**
 * StudioPage — /studio (noindex)
 * Two-column layout: left = 1:1 capturable frame, right = asset picker + save.
 * The phone mockup inside the frame rises from the bottom edge.
 */
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { Download, RefreshCw, Check, X, ChevronDown, Shield } from 'lucide-react';

import { EarnbaseLogo } from './ui/EarnbaseLogo';
import { formatAPY } from '@/app/utils/formatters';
import { useRegistry } from '../hooks/useRegistry';
import type { DeFiProduct } from '@/lib/api';

/* ── Constants ────────────────────────────────────────────── */
const GREEN = '#08a671';
const GREEN_DARK = '#067a56';
const MUTED = '#6b7280';
const RANK_LIMIT = 10;
const FRAME = 1080;
const PHONE_W = 680;
const PHONE_BORDER = 10;
const PHONE_RADIUS = 56;
const PHONE_MIN_H = 980;

const CHECKERBOARD = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23e5e7eb'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23e5e7eb'/%3E%3Crect x='10' width='10' height='10' fill='%23fff'/%3E%3Crect y='10' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E")`;

const DEFAULT_BG = '#4ba475';

type BgMode = 'default' | 'transparent' | 'custom';

const TVL_STEPS = [
  { label: 'All', value: 0 },
  { label: '>$100K', value: 100_000 },
  { label: '>$1M', value: 1_000_000 },
  { label: '>$10M', value: 10_000_000 },
  { label: '>$100M', value: 100_000_000 },
];

/* Known private-credit platforms (always excluded when toggle is on) */
const PC_PLATFORMS = ['wildcat'];

/* ── APY timeframe ────────────────────────────────────────── */
type ApyTimeframe = '24h' | '7d' | '30d' | '90d';
const APY_TIMEFRAMES: { key: ApyTimeframe; label: string }[] = [
  { key: '24h', label: '24h' },
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: '90d', label: '90d' },
];

/* ── APY highlight mode ───────────────────────────────────── */
type ApyHighlight = 'allGreen' | 'top3';
const APY_HIGHLIGHTS: { key: ApyHighlight; label: string }[] = [
  { key: 'allGreen', label: 'All green' },
  { key: 'top3', label: 'Top 3 only' },
];

/** Resolve APY value for a given timeframe. Falls back to spotAPY. */
function getApy(p: DeFiProduct, tf: ApyTimeframe): number {
  switch (tf) {
    case '24h':
      return p.spotAPY ?? 0;
    case '7d':
      return p.weeklyAPY ?? p.spotAPY ?? 0;
    case '30d':
      return p.monthlyAPY ?? p.spotAPY ?? 0;
    case '90d': {
      const hist = Array.isArray(p.dailyApyHistory) ? p.dailyApyHistory : [];
      const valid = hist.slice(-90).filter((v) => typeof v === 'number' && v > 0);
      if (valid.length >= 7) return valid.reduce((s, v) => s + v, 0) / valid.length;
      // fallback chain: 30d → 7d → spot
      return p.monthlyAPY ?? p.weeklyAPY ?? p.spotAPY ?? 0;
    }
  }
}

/* ── Ranking row inside phone ─────────────────────────────── */
const RankRow: React.FC<{
  rank: number;
  product: DeFiProduct;
  assetIcon: string | null;
  isLast: boolean;
  apyValue: number;
  apyHighlight: ApyHighlight;
  large?: boolean;
}> = ({ rank, product, assetIcon, isLast, apyValue, apyHighlight, large }) => {
  let apyColor: string;
  switch (apyHighlight) {
    case 'allGreen':
      apyColor = '#16a34a';
      break;
    case 'top3':
      apyColor = rank <= 3 ? '#16a34a' : '#6b7280';
      break;
  }

  const badgeSize = large ? 64 : 40;
  const iconSize = large ? 68 : 44;
  const nameFontSize = large ? 24 : 18;
  const nameLineHeight = large ? '30px' : '23px';
  const platformFontSize = large ? 17 : 14;
  const apyFontSize = large ? 30 : 21;
  const paddingV = large ? 42 : 14;
  const gap = large ? 22 : 16;
  const badgeRadius = large ? 18 : 12;
  const badgeFontSize = large ? 24 : 17;
  const apyMinW = large ? 110 : 76;
  const platformMargin = large ? 6 : 3;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap,
        padding: `${paddingV}px 28px`,
        borderBottom: isLast ? 'none' : '1px solid #f0f1f3',
        fontFamily: "'Inter', 'SF Pro Text', system-ui, sans-serif",
      }}
    >
      {/* Rank badge */}
      <span
        style={{
          width: badgeSize,
          height: badgeSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: badgeRadius,
          fontWeight: 700,
          fontSize: badgeFontSize,
          color: rank <= 3 ? 'white' : MUTED,
          background:
            rank === 1 ? GREEN : rank === 2 ? '#0b9e6a' : rank === 3 ? '#34d399' : '#f3f4f6',
          flexShrink: 0,
        }}
      >
        {rank}
      </span>

      {/* Asset icon */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#f0f1f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {assetIcon ? (
          <img src={assetIcon} alt="" width={iconSize} height={iconSize} style={{ objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: large ? 14 : 11, fontWeight: 700, color: '#6b7280' }}>
            {product.ticker?.slice(0, 4)}
          </span>
        )}
      </div>

      {/* Name + platform */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            color: '#111827',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: nameFontSize,
            lineHeight: nameLineHeight,
          }}
        >
          {product.product_name}
        </div>
        <div style={{ color: MUTED, fontSize: platformFontSize, marginTop: platformMargin }}>
          {product.platform_name}
          {product.curator?.trim() && product.curator.trim() !== '-' ? ` \u00b7 ${product.curator.trim()}` : ''}
        </div>
      </div>

      {/* APY */}
      <span
        style={{
          fontWeight: 700,
          color: apyColor,
          fontSize: apyFontSize,
          minWidth: apyMinW,
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {formatAPY(apyValue)}
      </span>
    </div>
  );
};

/* ── Main StudioPage ──────────────────────────────────────── */
interface StudioPageProps {
  products: DeFiProduct[];
  loading: boolean;
  allTickers: string[];
  privateCreditIds?: (number | string)[];
  onRefresh?: () => Promise<void> | void;
}

/** Tickers we show in the picker (order matters — most popular first) */
const PREFERRED_ORDER = ['USDC', 'ETH', 'USDT', 'CBBTC', 'WBTC', 'DAI', 'SOL'];

export const StudioPage: React.FC<StudioPageProps> = ({ products, loading, allTickers, privateCreditIds = [], onRefresh }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const curatorDropdownRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [scale, setScale] = useState(1);
  const [selectedTicker, setSelectedTicker] = useState('USDC');
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null);
  const [filterCurator, setFilterCurator] = useState<string | null>(null);
  const [filterNetwork, setFilterNetwork] = useState<string | null>(null);
  const [minTvlStep, setMinTvlStep] = useState(0);
  const [excludePC, setExcludePC] = useState(true);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [curatorOpen, setCuratorOpen] = useState(false);
  const [apyTimeframe, setApyTimeframe] = useState<ApyTimeframe>('24h');
  const [apyHighlight, setApyHighlight] = useState<ApyHighlight>('allGreen');
  const [bgMode, setBgMode] = useState<BgMode>('default');
  const [bgColor, setBgColor] = useState(DEFAULT_BG);
  const [rankLimit, setRankLimit] = useState<5 | 10>(10);
  const { resolveAssetIcon } = useRegistry();

  const assetIcon = useMemo(
    () => resolveAssetIcon(selectedTicker),
    [resolveAssetIcon, selectedTicker],
  );

  // Available tickers sorted by preferred order then by count
  const availableTickers = useMemo(() => {
    const set = new Set(allTickers.map((t) => t.toUpperCase()));
    const ordered: string[] = [];
    for (const t of PREFERRED_ORDER) {
      if (set.has(t)) {
        ordered.push(t);
        set.delete(t);
      }
    }
    const rest = [...set].sort();
    return [...ordered, ...rest];
  }, [allTickers]);

  // Derive unique platforms and networks
  const { platforms, networks, curators } = useMemo(() => {
    const tickerProducts = products.filter(
      (p) => p.ticker?.toUpperCase() === selectedTicker && p.spotAPY > 0,
    );
    const platCount = new Map<string, number>();
    const netSet = new Set<string>();
    const curatorCount = new Map<string, number>();
    for (const p of tickerProducts) {
      if (p.platform_name) platCount.set(p.platform_name, (platCount.get(p.platform_name) || 0) + 1);
      if (p.network) netSet.add(p.network);
      if (p.curator) curatorCount.set(p.curator, (curatorCount.get(p.curator) || 0) + 1);
    }
    const platforms = [...platCount.entries()]
      .filter(([, count]) => count >= 5)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
    const curators = [...curatorCount.entries()]
      .filter(([, count]) => count >= 5)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
    return {
      platforms,
      networks: [...netSet].sort(),
      curators,
    };
  }, [products, selectedTicker]);

  // Reset filters
  useEffect(() => {
    setFilterPlatform(null);
    setFilterCurator(null);
    setFilterNetwork(null);
    setMinTvlStep(0);
    setExcludePC(true);
    setApyTimeframe('24h');
    setApyHighlight('allGreen');
    setBgMode('default');
    setBgColor(DEFAULT_BG);
  }, [selectedTicker]);

  // Close platform dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (platformDropdownRef.current && !platformDropdownRef.current.contains(e.target as Node)) {
        setPlatformOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close curator dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (curatorDropdownRef.current && !curatorDropdownRef.current.contains(e.target as Node)) {
        setCuratorOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Responsive scaling
  useEffect(() => {
    const update = () => {
      if (leftColRef.current) {
        const available = leftColRef.current.clientWidth;
        setScale(Math.min(1, available / FRAME));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Filtered + sorted products
  const minTvl = TVL_STEPS[minTvlStep].value;
  const topProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.ticker?.toUpperCase() !== selectedTicker) return false;
        if (p.spotAPY <= 0) return false;
        if (filterPlatform && p.platform_name !== filterPlatform) return false;
        if (filterCurator && p.curator !== filterCurator) return false;
        if (filterNetwork && p.network !== filterNetwork) return false;
        if (minTvl > 0 && (p.tvl ?? 0) < minTvl) return false;
        if (excludePC && PC_PLATFORMS.includes(p.platform_name?.toLowerCase() || '')) return false;
        if (excludePC && privateCreditIds.includes(p.id)) return false;
        return true;
      })
      .sort((a, b) => getApy(b, apyTimeframe) - getApy(a, apyTimeframe))
      .slice(0, rankLimit);
  }, [products, selectedTicker, filterPlatform, filterCurator, filterNetwork, minTvl, excludePC, privateCreditIds, apyTimeframe, rankLimit]);

  const dateStr = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const handleExport = useCallback(async () => {
    if (!frameRef.current || exporting) return;
    setExporting(true);
    try {
      const url = await toPng(frameRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        width: FRAME,
        height: FRAME,
        style: { transform: 'scale(1)', transformOrigin: 'top left' },
        ...(bgMode === 'transparent' ? { backgroundColor: 'transparent' } : {}),
      });
      const a = document.createElement('a');
      a.download = `earnbase-${selectedTicker.toLowerCase()}-ranking-${new Date().toISOString().slice(0, 10)}.png`;
      a.href = url;
      a.click();
    } catch (err) {
      console.error('[Studio] Export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [exporting, selectedTicker, bgMode]);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh || refreshing) return;
    setRefreshing(true);
    try {
      await onRefresh();
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('[Studio] Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing]);

  const isReady = !loading && topProducts.length > 0;

  // Dynamic phone width — wider for Top 5 to fill more of the frame
  const phoneW = rankLimit === 5 ? 750 : PHONE_W;

  // Build dynamic mockup title
  const mockupTitle = useMemo(() => {
    let title = `${selectedTicker} Ranking`;
    if (filterCurator) {
      title += ` by ${filterCurator}`;
    } else if (filterPlatform) {
      title += ` on ${filterPlatform}`;
    }
    // Append network context
    if (filterNetwork) {
      title += ` \u00b7 ${filterNetwork}`;
    } else if (networks.length > 1) {
      title += ' \u00b7 All Networks';
    }
    return title;
  }, [selectedTicker, filterCurator, filterPlatform, filterNetwork, networks.length]);

  return (
    <>
      <div className="min-h-screen bg-[#f5f7fa] dark:bg-[#0b0f15]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">

          {/* ── Header ──────────────────────────────────────── */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-[22px] sm:text-[26px] font-semibold text-foreground tracking-tight">
              Create Your Yield Graphics
            </h1>
            <p className="mt-2 text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed max-w-[640px]">
              Pick an asset, apply your filters, and export a ready-to-post 1080x1080 image. Use it on X, LinkedIn, Telegram, or anywhere your community hangs out.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* ── LEFT: 1:1 frame ──────────────────────────────── */}
            <div ref={leftColRef} className="flex-1 min-w-0">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  boxShadow: bgMode === 'transparent' ? 'none' : '0 4px 40px rgba(0,0,0,0.10)',
                  width: FRAME * scale,
                  aspectRatio: '1 / 1',
                  ...(bgMode === 'transparent' ? { backgroundImage: CHECKERBOARD, backgroundSize: '20px 20px' } : {}),
                }}
              >
                <div
                  ref={frameRef}
                  style={{
                    width: FRAME,
                    height: FRAME,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    background: bgMode === 'transparent' ? 'transparent' : bgColor,
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: "'Inter', 'SF Pro Text', system-ui, sans-serif",
                  }}
                >
                  {/* Decorative circles */}
                  {bgMode !== 'transparent' && (
                    <>
                      <div
                        style={{
                          position: 'absolute',
                          top: -140,
                          right: -140,
                          width: 480,
                          height: 480,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.06)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 200,
                          left: -100,
                          width: 320,
                          height: 320,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.035)',
                        }}
                      />
                    </>
                  )}

                  {/* ── Phone mockup ── */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: phoneW,
                    }}
                  >
                    <div
                      style={{
                        width: phoneW,
                        minHeight: PHONE_MIN_H,
                        borderRadius: `${PHONE_RADIUS}px ${PHONE_RADIUS}px 0 0`,
                        border: `${PHONE_BORDER}px solid #1a1a1a`,
                        borderBottom: 'none',
                        background: '#ffffff',
                        boxShadow:
                          '0 12px 60px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Notch */}
                      <div
                        style={{
                          width: 140,
                          height: 28,
                          borderRadius: '0 0 20px 20px',
                          background: '#1a1a1a',
                          margin: '0 auto',
                        }}
                      />

                      {/* Screen content */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Logo + date */}
                        <div
                          style={{
                            padding: '24px 32px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <EarnbaseLogo height={32} variant="light" />
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: '#9ca3af',
                              fontFamily: "'Inter', 'SF Pro Text', system-ui, sans-serif",
                            }}
                          >
                            {minTvlStep > 0 && (
                              <>
                                <span style={{ fontWeight: 600, color: '#6b7280' }}>
                                  {TVL_STEPS[minTvlStep].label}
                                </span>
                                <span style={{ color: '#d1d5db', margin: '0 6px' }}>&middot;</span>
                              </>
                            )}
                            {dateStr}
                          </span>
                        </div>

                        {/* Section title */}
                        <div style={{ padding: '0 32px 14px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div
                              style={{
                                fontSize: 26,
                                fontWeight: 700,
                                color: '#111827',
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {mockupTitle}
                            </div>
                            <div
                              style={{
                                background: `${GREEN}14`,
                                color: GREEN,
                                fontSize: 13,
                                fontWeight: 600,
                                padding: '5px 12px',
                                borderRadius: 8,
                              }}
                            >
                              Live
                            </div>
                          </div>
                        </div>

                        {/* Column headers */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: rankLimit === 5 ? 22 : 16,
                            padding: '10px 28px',
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            fontFamily: "'Inter', 'SF Pro Text', system-ui, sans-serif",
                          }}
                        >
                          <span style={{ width: rankLimit === 5 ? 64 : 40, textAlign: 'center' }}>#</span>
                          <span style={{ width: rankLimit === 5 ? 68 : 44 }} />
                          <span style={{ flex: 1 }}>Product</span>
                          <span style={{ minWidth: rankLimit === 5 ? 110 : 76, textAlign: 'right' }}>APY {apyTimeframe !== '24h' ? apyTimeframe.toUpperCase() : ''}</span>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: '#f0f1f3', margin: '0 32px' }} />

                        {/* Ranking rows */}
                        <div>
                          {isReady
                            ? topProducts.map((p, i) => (
                                <RankRow
                                  key={p.id}
                                  rank={i + 1}
                                  product={p}
                                  assetIcon={assetIcon}
                                  isLast={i === topProducts.length - 1}
                                  apyValue={getApy(p, apyTimeframe)}
                                  apyHighlight={apyHighlight}
                                  large={rankLimit === 5}
                                />
                              ))
                            : Array.from({ length: rankLimit }).map((_, i) => {
                                const isLarge = rankLimit === 5;
                                const skelBadge = isLarge ? 64 : 40;
                                const skelIcon = isLarge ? 68 : 44;
                                const skelPad = isLarge ? 42 : 14;
                                const skelGap = isLarge ? 22 : 16;
                                return (
                                <div
                                  key={i}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: skelGap,
                                    padding: `${skelPad}px 28px`,
                                    borderBottom:
                                      i === rankLimit - 1 ? 'none' : '1px solid #f0f1f3',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: skelBadge,
                                      height: skelBadge,
                                      borderRadius: isLarge ? 16 : 12,
                                      background: '#e5e7eb',
                                    }}
                                  />
                                  <div
                                    style={{
                                      width: skelIcon,
                                      height: skelIcon,
                                      borderRadius: '50%',
                                      background: '#e5e7eb',
                                    }}
                                  />
                                  <div style={{ flex: 1 }}>
                                    <div
                                      style={{
                                        width: '65%',
                                        height: isLarge ? 20 : 16,
                                        borderRadius: 4,
                                        background: '#e5e7eb',
                                        marginBottom: isLarge ? 8 : 6,
                                      }}
                                    />
                                    <div
                                      style={{
                                        width: '40%',
                                        height: isLarge ? 14 : 12,
                                        borderRadius: 3,
                                        background: '#f3f4f6',
                                      }}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      width: isLarge ? 90 : 72,
                                      height: isLarge ? 22 : 18,
                                      borderRadius: 4,
                                      background: '#e5e7eb',
                                    }}
                                  />
                                </div>
                                );
                              })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Controls panel ────────────────────────── */}
            <div className="lg:w-[320px] shrink-0 space-y-6">
              {/* Rank limit toggle */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Layout
                </label>
                <div className="flex gap-1.5">
                  {([5, 10] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => setRankLimit(n)}
                      className={`flex-1 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all border ${
                        rankLimit === n
                          ? 'bg-[#08a671]/10 border-[#08a671]/40 text-[#08a671]'
                          : 'bg-white dark:bg-white/5 border-border/60 text-muted-foreground hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      Top {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset picker */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Asset
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto pr-1">
                  {availableTickers.map((ticker) => {
                    const icon = resolveAssetIcon(ticker);
                    const isActive = ticker === selectedTicker;
                    return (
                      <button
                        key={ticker}
                        onClick={() => setSelectedTicker(ticker)}
                        className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all border ${
                          isActive
                            ? 'bg-[#08a671]/10 border-[#08a671]/40 text-[#08a671] dark:bg-[#08a671]/15 dark:border-[#08a671]/50'
                            : 'bg-white dark:bg-white/5 border-border/60 text-foreground hover:border-border hover:bg-muted/30'
                        }`}
                      >
                        {icon ? (
                          <img
                            src={icon}
                            alt=""
                            className="w-5 h-5 rounded-full object-contain shrink-0"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <span className="text-[7px] font-bold text-muted-foreground">
                              {ticker[0]}
                            </span>
                          </div>
                        )}
                        <span className="truncate">{ticker}</span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 absolute top-1.5 right-1.5 text-[#08a671]" />
                        )}
                      </button>
                    );
                  })}
                  {availableTickers.length === 0 && (
                    <p className="col-span-3 text-center text-[12px] text-muted-foreground/60 py-4">
                      No matching assets
                    </p>
                  )}
                </div>
              </div>

              {/* APY Timeframe */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  APY Timeframe
                </label>
                <div className="flex gap-1.5">
                  {APY_TIMEFRAMES.map((tf) => (
                    <button
                      key={tf.key}
                      onClick={() => setApyTimeframe(tf.key)}
                      className={`flex-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
                        apyTimeframe === tf.key
                          ? 'bg-[#08a671]/10 border-[#08a671]/40 text-[#08a671]'
                          : 'bg-white dark:bg-white/5 border-border/60 text-muted-foreground hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* APY Highlight */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  APY Highlight
                </label>
                <div className="flex gap-1.5">
                  {APY_HIGHLIGHTS.map((h) => (
                    <button
                      key={h.key}
                      onClick={() => setApyHighlight(h.key)}
                      className={`flex-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
                        apyHighlight === h.key
                          ? 'bg-[#08a671]/10 border-[#08a671]/40 text-[#08a671]'
                          : 'bg-white dark:bg-white/5 border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform dropdown */}
              {platforms.length > 0 && (
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Platform
                  </label>
                  <div ref={platformDropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setPlatformOpen((v) => !v)}
                      className={`w-full flex items-center justify-between pl-3 pr-3 py-2.5 rounded-xl border text-[13px] font-medium transition-all cursor-pointer ${
                        platformOpen
                          ? 'border-[#08a671]/40 ring-2 ring-[#08a671]/30 bg-white dark:bg-white/5'
                          : 'border-border/60 bg-white dark:bg-white/5 hover:border-border'
                      } text-foreground`}
                    >
                      <span className={filterPlatform ? 'text-foreground' : 'text-muted-foreground'}>
                        {filterPlatform ?? 'All Platforms'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground/50 transition-transform ${platformOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {platformOpen && (
                      <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border/60 bg-white dark:bg-[#1a1e27] shadow-lg max-h-[220px] overflow-y-auto py-1">
                        <button
                          type="button"
                          onClick={() => { setFilterPlatform(null); setPlatformOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-colors ${
                            !filterPlatform
                              ? 'text-[#08a671] bg-[#08a671]/5'
                              : 'text-foreground hover:bg-muted/30'
                          }`}
                        >
                          <span>All Platforms</span>
                          {!filterPlatform && <Check className="w-3.5 h-3.5 text-[#08a671]" />}
                        </button>
                        {platforms.map((p) => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => { setFilterPlatform(p.name); setPlatformOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-colors ${
                              filterPlatform === p.name
                                ? 'text-[#08a671] bg-[#08a671]/5'
                                : 'text-foreground hover:bg-muted/30'
                            }`}
                          >
                            <span>
                              {p.name} <span className="text-muted-foreground/50">({p.count})</span>
                            </span>
                            {filterPlatform === p.name && <Check className="w-3.5 h-3.5 text-[#08a671]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Curator dropdown */}
              {curators.length > 0 && (
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Curator
                  </label>
                  <div ref={curatorDropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setCuratorOpen((v) => !v)}
                      className={`w-full flex items-center justify-between pl-3 pr-3 py-2.5 rounded-xl border text-[13px] font-medium transition-all cursor-pointer ${
                        curatorOpen
                          ? 'border-[#08a671]/40 ring-2 ring-[#08a671]/30 bg-white dark:bg-white/5'
                          : 'border-border/60 bg-white dark:bg-white/5 hover:border-border'
                      } text-foreground`}
                    >
                      <span className={filterCurator ? 'text-foreground' : 'text-muted-foreground'}>
                        {filterCurator ?? 'All Curators'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground/50 transition-transform ${curatorOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {curatorOpen && (
                      <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border/60 bg-white dark:bg-[#1a1e27] shadow-lg max-h-[220px] overflow-y-auto py-1">
                        <button
                          type="button"
                          onClick={() => { setFilterCurator(null); setCuratorOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-colors ${
                            !filterCurator
                              ? 'text-[#08a671] bg-[#08a671]/5'
                              : 'text-foreground hover:bg-muted/30'
                          }`}
                        >
                          <span>All Curators</span>
                          {!filterCurator && <Check className="w-3.5 h-3.5 text-[#08a671]" />}
                        </button>
                        {curators.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => { setFilterCurator(c.name); setCuratorOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-colors ${
                              filterCurator === c.name
                                ? 'text-[#08a671] bg-[#08a671]/5'
                                : 'text-foreground hover:bg-muted/30'
                            }`}
                          >
                            <span>
                              {c.name} <span className="text-muted-foreground/50">({c.count})</span>
                            </span>
                            {filterCurator === c.name && <Check className="w-3.5 h-3.5 text-[#08a671]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Network filter */}
              {networks.length > 1 && (
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Network
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setFilterNetwork(null)}
                      className={`px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
                        !filterNetwork
                          ? 'bg-[#08a671]/10 border-[#08a671]/40 text-[#08a671]'
                          : 'bg-white dark:bg-white/5 border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                      }`}
                    >
                      All
                    </button>
                    {networks.map((n) => (
                      <button
                        key={n}
                        onClick={() => setFilterNetwork(filterNetwork === n ? null : n)}
                        className={`px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
                          filterNetwork === n
                            ? 'bg-[#08a671]/10 border-[#08a671]/40 text-[#08a671]'
                            : 'bg-white dark:bg-white/5 border-border/60 text-muted-foreground hover:border-border hover:text-foreground'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Min TVL slider */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Min TVL
                </label>
                <div className="space-y-2.5">
                  <input
                    type="range"
                    min={0}
                    max={TVL_STEPS.length - 1}
                    step={1}
                    value={minTvlStep}
                    onChange={(e) => setMinTvlStep(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border/60 accent-[#08a671] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#08a671] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                  />
                  <div className="flex justify-between">
                    {TVL_STEPS.map((step, i) => (
                      <button
                        key={step.label}
                        onClick={() => setMinTvlStep(i)}
                        className={`text-[10px] font-medium transition-colors ${
                          i === minTvlStep
                            ? 'text-[#08a671]'
                            : 'text-muted-foreground/50 hover:text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exclude Private Credit toggle */}
              <button
                type="button"
                onClick={() => setExcludePC((v) => !v)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-[13px] font-medium transition-all ${
                  excludePC
                    ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400'
                    : 'bg-white dark:bg-white/5 border-border/60 text-muted-foreground hover:border-border'
                }`}
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">Exclude Private Credit</span>
                <div
                  className={`w-8 h-[18px] rounded-full relative transition-colors ${
                    excludePC ? 'bg-amber-500' : 'bg-border'
                  }`}
                >
                  <div
                    className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${
                      excludePC ? 'left-[15px]' : 'left-[2px]'
                    }`}
                  />
                </div>
              </button>

              {/* Background */}
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Background
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Transparent swatch */}
                  <button
                    type="button"
                    onClick={() => setBgMode('transparent')}
                    title="Transparent"
                    className={`w-8 h-8 rounded-lg border-2 transition-all overflow-hidden ${
                      bgMode === 'transparent'
                        ? 'border-[#08a671] ring-2 ring-[#08a671]/30 scale-110'
                        : 'border-border/60 hover:border-border hover:scale-105'
                    }`}
                    style={{
                      backgroundImage: CHECKERBOARD,
                      backgroundSize: '10px 10px',
                    }}
                  />
                  {/* Default swatch */}
                  <button
                    type="button"
                    onClick={() => { setBgMode('default'); setBgColor(DEFAULT_BG); }}
                    title="Default"
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      bgMode === 'default'
                        ? 'border-[#08a671] ring-2 ring-[#08a671]/30 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ background: DEFAULT_BG }}
                  />
                  {/* Custom color input */}
                  <div className="relative">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => { setBgMode('custom'); setBgColor(e.target.value); }}
                      className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
                      title="Custom color"
                    />
                    <div
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${bgMode === 'custom'
                          ? 'border-[#08a671] ring-2 ring-[#08a671]/30 scale-110'
                          : 'border-border/60 hover:border-border hover:scale-105'
                      }`}
                      style={{
                        background: bgMode === 'custom'
                          ? bgColor
                          : 'conic-gradient(from 0deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
                      }}
                    />
                  </div>
                </div>
                {/* Show hex value for custom colors */}
                {bgMode === 'custom' && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: bgColor }} />
                    <span className="text-[11px] font-mono text-muted-foreground">{bgColor.toUpperCase()}</span>
                  </div>
                )}
                {bgMode === 'transparent' && (
                  <p className="mt-1.5 text-[11px] text-violet-500 dark:text-violet-400 font-medium">Transparent — PNG will have no background</p>
                )}
              </div>

              {/* Reset to default */}
              <button
                type="button"
                onClick={() => {
                  setFilterPlatform(null);
                  setFilterCurator(null);
                  setFilterNetwork(null);
                  setMinTvlStep(0);
                  setExcludePC(true);
                  setApyTimeframe('24h');
                  setApyHighlight('allGreen');
                  setBgMode('default');
                  setBgColor(DEFAULT_BG);
                }}
                className="w-full text-center text-[12px] font-medium text-muted-foreground/60 hover:text-muted-foreground transition-colors py-1"
              >
                Reset to default
              </button>

              {/* Active filters summary */}
              {(filterPlatform || filterCurator || filterNetwork || minTvlStep > 0) && (
                <div className="flex items-center gap-2 flex-wrap">
                  {filterPlatform && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#08a671]/10 text-[#08a671] text-[11px] font-medium">
                      {filterPlatform}
                      <button onClick={() => setFilterPlatform(null)} className="hover:text-[#067a56]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filterCurator && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#08a671]/10 text-[#08a671] text-[11px] font-medium">
                      {filterCurator}
                      <button onClick={() => setFilterCurator(null)} className="hover:text-[#067a56]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filterNetwork && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#08a671]/10 text-[#08a671] text-[11px] font-medium">
                      {filterNetwork}
                      <button onClick={() => setFilterNetwork(null)} className="hover:text-[#067a56]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {minTvlStep > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#08a671]/10 text-[#08a671] text-[11px] font-medium">
                      TVL {TVL_STEPS[minTvlStep].label}
                      <button onClick={() => setMinTvlStep(0)} className="hover:text-[#067a56]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => { setFilterPlatform(null); setFilterCurator(null); setFilterNetwork(null); setMinTvlStep(0); }}
                    className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Save button */}
              <button
                onClick={handleExport}
                disabled={!isReady || exporting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#08a671] text-white rounded-xl text-[14px] font-semibold hover:bg-[#079963] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[inset_0px_-3px_0px_0px_rgba(0,0,0,0.18)]"
              >
                {exporting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4.5 h-4.5" />
                )}
                {exporting ? 'Exporting...' : 'Save as PNG'}
              </button>

              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border/60 bg-white dark:bg-white/5 text-[13px] font-medium text-foreground hover:bg-muted/30 hover:border-border active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>

              {/* Last refreshed */}
              {lastRefreshed && (
                <p className="text-[11px] text-muted-foreground/50 text-center">
                  Updated at {lastRefreshed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}

              {/* Info */}
              <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                Exports a 2160 &times; 2160 px image (2x for retina). Ideal for Instagram, X/Twitter, and LinkedIn posts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};