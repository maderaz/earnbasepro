'use client';
/**
 * ProductPageV3 — Vault product page client component.
 * Ported from src/app/components/ProductPageV3.tsx
 */
import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { DeFiProduct } from '@/lib/api';
import { getProductSlug } from '@/app/utils/slugify';
import { useRegistry } from '../hooks/useRegistry';
import { formatTVL } from '@/app/utils/formatters';
import { ArrowUpRight, ChevronRight, ChevronDown, ChevronLeft, ExternalLink } from 'lucide-react';

import { useVaultData } from './vault/useVaultData';
import { ApyChart, TvlChart } from './vault/VaultCharts';
import { VaultAnalytics } from './vault/VaultAnalytics';
import { KVRow } from './ui/KVRow';
import { EarningsCalculator } from './vault/EarningsCalculator';

const REF_TAG = 'ref=earnbase.finance';
const HISTORY_PAGE_SIZE = 7;

const Stat: React.FC<{ label: string; value: React.ReactNode; accent?: string }> = ({ label, value, accent }) => (
  <div className="lg:py-3 lg:border-b lg:border-[#eff0f4] dark:lg:border-border/20 lg:last:border-b-0">
    <span className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.06em] block mb-0.5">{label}</span>
    <div className={`text-[20px] lg:text-[22px] font-semibold tracking-tight leading-tight ${accent ?? 'text-foreground'}`}>{value}</div>
  </div>
);

const MetaRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-[6px]">
    <span className="text-[12px] font-medium text-muted-foreground/70">{label}</span>
    <span className="text-[13px] font-medium text-foreground">{value}</span>
  </div>
);

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#eff0f4] dark:border-border/30 last:border-b-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-start gap-4 py-3 text-left group" aria-expanded={open}>
        <span className="flex-1 text-[13px] font-medium text-foreground/75 group-hover:text-foreground transition-colors leading-relaxed pr-4">{question}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#a0a0b0] shrink-0 mt-0.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="pb-4 text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const Divider: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`py-6 border-t border-[#eff0f4] dark:border-border/20 ${className}`}>{children}</div>
);

interface Props {
  product: DeFiProduct;
  products: DeFiProduct[];
  isPrivateCredit?: boolean;
}

export const ProductPageV3: React.FC<Props> = ({ product, products, isPrivateCredit = false }) => {
  const { resolveAssetIcon } = useRegistry();
  const d = useVaultData(product, products, isPrivateCredit);

  const cc = {
    grid: '#dcdee3', tick: '#a0a0b0',
    tooltipBg: 'white', tooltipBorder: '#eff0f4', tooltipLabel: '#a0a0b0',
  };

  const [hTab, setHTab] = useState<'yield' | 'tvl'>('yield');
  const [hPage, setHPage] = useState(0);
  const hasTvl = d.allTvlChartData.length > 0;
  const [heroChart, setHeroChart] = useState<'apy' | 'tvl'>('apy');

  const hRows = useMemo(() => {
    if (hTab === 'yield')
      return [...d.allChartData].reverse().map(e => ({ date: e.fullDate, value: `${e.apy.toFixed(2)}%`, color: 'text-[#08a671]' }));
    return [...d.allTvlChartData].reverse().map(e => ({ date: e.fullDate, value: formatTVL(e.tvl), color: 'text-[#3b82f6]' }));
  }, [hTab, d.allChartData, d.allTvlChartData]);

  const pages = Math.max(1, Math.ceil(hRows.length / HISTORY_PAGE_SIZE));
  const slice = hRows.slice(hPage * HISTORY_PAGE_SIZE, (hPage + 1) * HISTORY_PAGE_SIZE);
  const switchTab = (t: 'yield' | 'tvl') => { setHTab(t); setHPage(0); };

  const hasCurator = !!product.curator && product.curator !== '-' && product.curator.trim() !== '';

  const platformOpps = useMemo(() => products
    .filter(p => p.platform_name === product.platform_name && p.id !== product.id && (p.spotAPY || 0) > 0.02)
    .sort((a, b) => b.spotAPY - a.spotAPY).slice(0, 4), [products, product]);

  const curatorOpps = useMemo(() => !hasCurator ? [] : products
    .filter(p => p.curator === product.curator && p.id !== product.id && (p.spotAPY || 0) > 0.02)
    .sort((a, b) => b.spotAPY - a.spotAPY).slice(0, 4), [products, product, hasCurator]);

  /* Sticky sub-header */
  const headerSentinelRef = useRef<HTMLDivElement>(null);
  const chartEndSentinelRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const headerEl = headerSentinelRef.current;
    const chartEl = chartEndSentinelRef.current;
    if (!headerEl || !chartEl) return;
    const isMobile = () => window.innerWidth < 640;
    const getEl = () => isMobile() ? chartEl : headerEl;
    const getMargin = () => isMobile() ? '0px 0px 0px 0px' : '200px 0px 0px 0px';
    let observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: getMargin() },
    );
    observer.observe(getEl());
    const onResize = () => {
      observer.disconnect();
      observer = new IntersectionObserver(
        ([entry]) => setShowStickyBar(!entry.isIntersecting),
        { threshold: 0, rootMargin: getMargin() },
      );
      observer.observe(getEl());
    };
    window.addEventListener('resize', onResize);
    return () => { observer.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);

  const slug = getProductSlug(product);
  const icon = resolveAssetIcon(product.ticker);

  return (
    <div className="animate-in fade-in duration-700">
      {/* Sticky sub-header */}
      <div className={`fixed top-14 left-0 right-0 z-40 transition-all duration-300 hidden sm:block ${showStickyBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-[#eff0f4] dark:border-border/30">
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8 h-12 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 shrink-0 overflow-hidden rounded-full bg-[#f5f5f7] ring-1 ring-border/10">
                {icon && <img src={icon} alt={product.ticker} className="w-full h-full object-cover" />}
              </div>
              <span className="text-[14px] font-semibold text-foreground truncate">{product.product_name}</span>
              <span className="text-[12px] text-muted-foreground/50 font-medium truncate hidden sm:inline">
                {product.platform_name}{hasCurator ? ` · ${product.curator}` : ''}
              </span>
            </div>
            {product.product_link && (
              <a href={`${product.product_link}${product.product_link.includes('?') ? '&' : '?'}${REF_TAG}`}
                target="_blank" rel="noopener noreferrer"
                className="relative flex items-center gap-2 px-4 py-2 bg-[#08a671] hover:bg-[#079963] rounded-[10px] text-[12px] font-semibold text-white transition-all shrink-0 shadow-[inset_0px_-4px_0px_0px_rgba(0,0,0,0.18)] pt-[6px] pb-[10px]">
                Open Product <ExternalLink className="w-3 h-3 text-white" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/50 uppercase tracking-[0.08em] min-w-0 pb-3">
        <Link href="/" className="hover:text-foreground/60 transition-colors shrink-0">Earnbase</Link>
        <ChevronRight className="w-3 h-3 opacity-30 shrink-0" />
        <Link href={`/${product.ticker.toLowerCase()}`} className="hover:text-foreground/60 transition-colors shrink-0">{product.ticker.toUpperCase()}</Link>
        <ChevronRight className="w-3 h-3 opacity-30 shrink-0" />
        <span className="text-muted-foreground/70 truncate max-w-[240px]">{product.product_name}</span>
      </nav>

      {/* Header: icon + name */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 shrink-0 overflow-hidden rounded-full bg-[#f5f5f7] dark:bg-white/10 ring-1 ring-border/10">
            {icon && <img src={icon} alt={product.ticker} className="w-full h-full object-cover" />}
          </div>
          <h1 className="text-[18px] sm:text-[22px] md:text-[26px] font-semibold text-foreground tracking-tight leading-none">
            {product.product_name}
          </h1>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="-mx-5 sm:mx-0 bg-white dark:bg-card sm:rounded-t-xl border-y sm:border sm:border-b-0 border-[#eff0f4] dark:border-border/20 overflow-hidden">
        {product.product_link && (
          <div className="sm:hidden px-5 pt-4 pb-1">
            <a href={`${product.product_link}${product.product_link.includes('?') ? '&' : '?'}${REF_TAG}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full pt-[10px] pb-[14px] bg-[#08a671] hover:bg-[#079963] rounded-[10px] text-[13px] font-semibold text-white transition-all shadow-[inset_0px_-4px_0px_0px_rgba(0,0,0,0.18)]">
              Open Product <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[10px] text-[#a0a0b0] text-center py-1.5 leading-snug">Opens external site. Rates may differ due to refresh timing.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]">
          {/* LEFT — chart */}
          <div className="p-5 lg:p-6 border-t lg:border-t-0 border-[#eff0f4] dark:border-border/20 flex flex-col order-2 lg:order-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex bg-[#f5f5f7] dark:bg-white/5 rounded-lg p-0.5">
                <button onClick={() => setHeroChart('apy')} className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${heroChart === 'apy' ? 'bg-white dark:bg-white/10 text-[#08a671] shadow-sm' : 'text-[#a0a0b0]'}`}>APY</button>
                <button onClick={() => setHeroChart('tvl')} className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all ${heroChart === 'tvl' ? 'bg-white dark:bg-white/10 text-[#3b82f6] shadow-sm' : 'text-[#a0a0b0]'}`}>TVL</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {heroChart === 'apy' ? (
                    <>
                      <button onClick={() => d.setTimeframe('30D')} className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${d.timeframe === '30D' ? 'text-[#08a671] bg-[#08a671]/8' : 'text-[#a0a0b0]'}`}>30D</button>
                      <button onClick={() => d.setTimeframe('ALL')} className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${d.timeframe === 'ALL' ? 'text-[#08a671] bg-[#08a671]/8' : 'text-[#a0a0b0]'}`}>ALL</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => d.setTvlTimeframe('30D')} className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${d.tvlTimeframe === '30D' ? 'text-[#3b82f6] bg-[#3b82f6]/8' : 'text-[#a0a0b0]'}`}>30D</button>
                      <button onClick={() => d.setTvlTimeframe('ALL')} className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${d.tvlTimeframe === 'ALL' ? 'text-[#3b82f6] bg-[#3b82f6]/8' : 'text-[#a0a0b0]'}`}>ALL</button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${heroChart === 'apy' ? 'bg-[#08a671]' : 'bg-[#3b82f6]'}`} />
                  <span className={`text-[10px] font-medium uppercase tracking-[0.06em] ${heroChart === 'apy' ? 'text-[#08a671]' : 'text-[#3b82f6]'}`}>Live</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-[168px]">
              {heroChart === 'apy' ? (
                <ApyChart chartData={d.chartData} timeframe={d.timeframe} setTimeframe={d.setTimeframe} chartColors={cc} isPrivateCredit={isPrivateCredit} fillHeight hideHeader />
              ) : (
                <TvlChart tvlChartData={d.tvlChartData} tvlTimeframe={d.tvlTimeframe} setTvlTimeframe={d.setTvlTimeframe} chartColors={cc} fillHeight hideHeader />
              )}
            </div>
            {/* Metadata — mobile only */}
            <div className="lg:hidden mt-4 pt-3 border-t border-[#eff0f4] dark:border-border/20">
              {d.marketStats && <MetaRow label={`${product.ticker.toUpperCase()} Rank`} value={`#${d.marketStats.rank} of ${d.marketStats.totalInAsset}`} />}
              <MetaRow label="Network" value={product.network} />
              <MetaRow label="Asset" value={product.ticker.toUpperCase()} />
              <MetaRow label="Platform" value={product.platform_name} />
              {hasCurator && <MetaRow label="Curator" value={product.curator} />}
            </div>
            <div ref={chartEndSentinelRef} className="h-0 w-full" aria-hidden="true" />
          </div>

          {/* RIGHT — stats */}
          <div className="p-5 lg:p-6 lg:border-l border-[#eff0f4] dark:border-border/20 order-1 lg:order-2">
            {product.product_link && (
              <div className="hidden lg:block pb-4 mb-1 border-b border-[#eff0f4] dark:border-border/20">
                <a href={`${product.product_link}${product.product_link.includes('?') ? '&' : '?'}${REF_TAG}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full pt-[10px] pb-[14px] bg-[#08a671] hover:bg-[#079963] rounded-[10px] text-[13px] font-semibold text-white transition-all shadow-[inset_0px_-4px_0px_0px_rgba(0,0,0,0.18)]">
                  Open Product <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <p className="text-[10px] text-[#a0a0b0] mt-2 text-center leading-snug">Opens external site. Rates may differ due to refresh timing.</p>
              </div>
            )}
            <div className="flex justify-between lg:block gap-4 lg:gap-0">
              <Stat label="24H APY" value={<span className="tabular-nums">{product.spotAPY.toFixed(2)}%</span>} accent="text-[#08a671]" />
              <Stat label="30D APY" value={<span className="tabular-nums">{product.monthlyAPY.toFixed(2)}%</span>} />
              <div className="text-right lg:text-left">
                <Stat label="TVL" value={formatTVL(product.tvl)} />
              </div>
            </div>
            <div className="hidden lg:block mt-2 pt-2 border-t border-[#eff0f4] dark:border-border/20">
              {d.marketStats && <MetaRow label={`${product.ticker.toUpperCase()} Rank`} value={`#${d.marketStats.rank} of ${d.marketStats.totalInAsset}`} />}
              <MetaRow label="Network" value={product.network} />
              <MetaRow label="Asset" value={product.ticker.toUpperCase()} />
              <MetaRow label="Platform" value={product.platform_name} />
              {hasCurator && <MetaRow label="Curator" value={product.curator} />}
            </div>
          </div>
        </div>
      </div>

      <div ref={headerSentinelRef} className="h-0 w-full" aria-hidden="true" />

      {/* REPORT — 2-col layout */}
      <div className="-mx-5 sm:mx-0 bg-white dark:bg-card rounded-t-lg sm:rounded-b-xl sm:rounded-t-none border-b sm:border-x sm:border-b border-[#eff0f4] dark:border-border/20 grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] overflow-hidden">

        {/* LEFT COLUMN */}
        <div className="px-5 lg:px-0 lg:pl-6 lg:pr-6 min-w-0 overflow-hidden order-2 lg:order-1">
          {/* Yield Overview */}
          <Divider className="!border-t-0 pt-6">
            <h2 className="text-[17px] font-medium text-foreground mb-3">Yield Overview</h2>
            <p className="text-[13px] text-foreground/80 font-normal leading-[1.7] max-w-4xl">
              {product.spotAPY > 0 ? (
                <span>
                  {product.product_name} is a {product.ticker} yield strategy on {product.platform_name}{hasCurator ? `, curated by ${product.curator}` : ` (${product.network})`}.{' '}
                  It currently generates <span className="text-[#08a671] font-medium">{product.spotAPY.toFixed(2)}%</span> APY (24h) with a 30-day average of {product.monthlyAPY.toFixed(2)}%.{' '}
                  The vault holds <span className="font-medium">{formatTVL(product.tvl)}</span> in total value locked.
                  APY is derived from the vault's on-chain exchange rate and does not include external incentives.
                </span>
              ) : (
                <span>
                  {product.product_name} is a {product.ticker} yield strategy on {product.platform_name}{hasCurator ? `, curated by ${product.curator}` : ` (${product.network})`}.
                  No yield data is available for the most recent period.
                </span>
              )}
            </p>
            <p className="text-[11px] font-medium text-[#a0a0b0] mt-2.5 tracking-wide">
              {hasCurator ? `Curated by ${product.curator}` : product.platform_name} · {product.network}
            </p>
          </Divider>

          {/* Analytics */}
          <Divider>
            <VaultAnalytics
              product={product}
              products={products}
              marketStats={d.marketStats}
              sustainabilityMetrics={d.sustainabilityMetrics}
              contextAnalysis={d.contextAnalysis}
              historyStats={d.historyStats}
              tvlStats={d.tvlStats}
              yieldTrajectory={d.yieldTrajectory}
              comparativeRankings={d.comparativeRankings}
              networkRankings={d.networkRankings}
              expandedApyStats={d.expandedApyStats}
              expandedTvlStats={d.expandedTvlStats}
              networkTvlRank={d.networkTvlRank}
              isPrivateCredit={isPrivateCredit}
            />
          </Divider>

          {/* History table */}
          <Divider>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[17px] font-medium text-foreground">History</h2>
              {hasTvl && (
                <div className="flex bg-[#f5f5f7] dark:bg-white/5 rounded-lg p-0.5">
                  <button onClick={() => switchTab('yield')} className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${hTab === 'yield' ? 'bg-white dark:bg-white/10 text-[#08a671] shadow-sm' : 'text-[#a0a0b0]'}`}>Yield</button>
                  <button onClick={() => switchTab('tvl')} className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all ${hTab === 'tvl' ? 'bg-white dark:bg-white/10 text-[#3b82f6] shadow-sm' : 'text-[#a0a0b0]'}`}>TVL</button>
                </div>
              )}
            </div>
            {slice.length > 0 ? (
              <span className="contents">
                {((hTab === 'yield' && d.historyStats) || (hTab === 'tvl' && d.tvlStats)) && (
                  <div className="flex items-center justify-between py-[11px] border-b border-[#eff0f4] dark:border-border/30 bg-[#08a671]/[0.03] -mx-5 lg:-mx-6 px-5 lg:px-6">
                    <span className="text-[13px] font-medium text-[#30313e] dark:text-foreground/80">30-Day Summary</span>
                    <span className={`text-[13px] font-medium tabular-nums text-right ${hTab === 'yield' ? 'text-[#08a671]' : 'text-[#3b82f6]'}`}>
                      {hTab === 'yield' && d.historyStats && `Avg: ${d.historyStats.avg.toFixed(2)}% | High: ${d.historyStats.max.toFixed(2)}% | Low: ${d.historyStats.min.toFixed(2)}%`}
                      {hTab === 'tvl' && d.tvlStats && `Avg: ${formatTVL(d.tvlStats.avg)} | High: ${formatTVL(d.tvlStats.max)} | Low: ${formatTVL(d.tvlStats.min)}`}
                    </span>
                  </div>
                )}
                {slice.map((r, i) => (
                  <KVRow key={`${hTab}-${hPage}-${i}`} label={r.date} value={r.value} valueColor={r.color} />
                ))}
              </span>
            ) : (
              <p className="py-6 text-center text-[13px] text-muted-foreground/50">No historical data available</p>
            )}
            {pages > 1 && (
              <div className="flex items-center justify-between pt-3">
                <button onClick={() => setHPage(p => Math.max(0, p - 1))} disabled={hPage === 0} className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground/50 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none">
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <span className="text-[11px] font-medium text-muted-foreground/50 tabular-nums">{hPage + 1} / {pages}</span>
                <button onClick={() => setHPage(p => Math.min(pages - 1, p + 1))} disabled={hPage >= pages - 1} className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground/50 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none">
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </Divider>

          {/* FAQ */}
          {d.faqItems.length > 0 && (() => {
            const cats = ['Yield & Performance', 'Liquidity & TVL', 'Strategy & Access'];
            const groups = cats.map(c => ({ c, items: d.faqItems.filter(f => f.category === c) })).filter(g => g.items.length > 0);
            return (
              <Divider>
                <h2 className="text-[17px] font-medium text-foreground mb-4">FAQ</h2>
                <div className="space-y-5 max-w-4xl">
                  {groups.map(g => (
                    <div key={g.c}>
                      <p className="text-[11px] font-medium text-muted-foreground/40 uppercase tracking-[0.08em] mb-1">{g.c}</p>
                      {g.items.map((it, i) => <FaqItem key={`${g.c}-${i}`} question={it.question} answer={it.answer} />)}
                    </div>
                  ))}
                </div>
              </Divider>
            );
          })()}

          {/* Earnings Calculator */}
          <Divider>
            <EarningsCalculator apy={product.spotAPY} ticker={product.ticker} isPrivateCredit={isPrivateCredit} />
          </Divider>

          {/* Disclaimer */}
          <Divider>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="text-[13px] text-foreground/70 font-normal max-w-lg leading-relaxed">
                This page provides informational data aggregated from on-chain sources and is not financial advice. Always verify data directly with {product.platform_name} before depositing.
              </p>
              {product.product_link && (
                <a href={`${product.product_link}${product.product_link.includes('?') ? '&' : '?'}${REF_TAG}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-[#08a671] hover:underline shrink-0">
                  Deposit Asset <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </Divider>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden lg:block lg:pr-6 lg:pl-6 lg:border-l border-[#eff0f4] dark:border-border/20 pt-6 order-1 lg:order-2">
          <div className="sticky top-6 space-y-6">
            {platformOpps.filter(o => o.ticker.toUpperCase() === product.ticker.toUpperCase()).length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.08em] mb-2.5">More on {product.platform_name}</p>
                <div className="space-y-0">
                  {platformOpps.filter(o => o.ticker.toUpperCase() === product.ticker.toUpperCase()).map(opp => {
                    const oppIcon = resolveAssetIcon(opp.ticker);
                    return (
                      <Link key={opp.id} href={`/vault/${getProductSlug(opp)}`} className="flex items-center gap-2 py-[5px] group">
                        <div className="w-4 h-4 shrink-0 rounded-full overflow-hidden bg-[#f5f5f7] ring-1 ring-border/5">
                          {oppIcon && <img src={oppIcon} alt={opp.ticker} className="w-full h-full object-cover" />}
                        </div>
                        <span className="flex-1 text-[11px] text-muted-foreground/50 group-hover:text-foreground/70 transition-colors truncate">{opp.product_name}</span>
                        <span className="text-[11px] font-medium text-[#08a671]/70 tabular-nums shrink-0">{opp.spotAPY.toFixed(2)}%</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            {hasCurator && curatorOpps.filter(o => o.ticker.toUpperCase() === product.ticker.toUpperCase()).length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.08em] mb-2.5">More by {product.curator}</p>
                <div className="space-y-0">
                  {curatorOpps.filter(o => o.ticker.toUpperCase() === product.ticker.toUpperCase()).map(opp => {
                    const oppIcon = resolveAssetIcon(opp.ticker);
                    return (
                      <Link key={opp.id} href={`/vault/${getProductSlug(opp)}`} className="flex items-center gap-2 py-[5px] group">
                        <div className="w-4 h-4 shrink-0 rounded-full overflow-hidden bg-[#f5f5f7] ring-1 ring-border/5">
                          {oppIcon && <img src={oppIcon} alt={opp.ticker} className="w-full h-full object-cover" />}
                        </div>
                        <span className="flex-1 text-[11px] text-muted-foreground/50 group-hover:text-foreground/70 transition-colors truncate">{opp.product_name}</span>
                        <span className="text-[11px] font-medium text-[#08a671]/70 tabular-nums shrink-0">{opp.spotAPY.toFixed(2)}%</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
