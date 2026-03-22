'use client';

/**
 * HomepageContent — Feature showcase cards, stats bar, and project grid.
 * Ported from src/app/components/HomepageContent.tsx.
 */
import React, { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useRegistry } from '../hooks/useRegistry';
import { formatTVL } from '@/app/utils/formatters';
import { getProductSlug } from '@/app/utils/slugify';
import type { DeFiProduct } from '@/lib/api';

const FONT = "'Plus Jakarta Sans', sans-serif";

const TOP_PROJECTS = [
  { slug: 'morpho', name: 'Morpho' },
  { slug: 'euler', name: 'Euler' },
  { slug: 'aave', name: 'Aave' },
  { slug: 'ipor-fusion', name: 'IPOR Fusion' },
  { slug: 'harvest', name: 'Harvest' },
  { slug: 'yearn', name: 'Yearn' },
  { slug: 'lagoon', name: 'Lagoon' },
  { slug: 'fluid', name: 'Fluid' },
] as const;

interface Props {
  products: DeFiProduct[];
}

// ── Top DeFi Yields ───────────────────────────────────────────

const cleanName = (name: string) => name.replace(/\s*\(.*?\)\s*/g, '').trim();

const topPerAsset = (products: DeFiProduct[]) => {
  const map = new Map<string, DeFiProduct>();
  for (const p of products) {
    if (!p || p.tvl < 10_000) continue;
    const t = p.ticker.toUpperCase();
    const current = map.get(t);
    if (!current || p.spotAPY > current.spotAPY) map.set(t, p);
  }
  const order = ['USDC', 'ETH', 'USDT', 'CBBTC', 'WBTC', 'EURC'];
  return order.filter(t => map.has(t)).map(t => map.get(t)!);
};

export const TopDeFiYields: React.FC<Props> = ({ products }) => {
  const { resolveAssetIcon } = useRegistry();
  const tops = useMemo(() => topPerAsset(products), [products]);

  if (products.length === 0) return null;

  return (
    <section id="top-defi-yields">
      <div className="text-center mb-10">
        <h2
          className="text-[17px] sm:text-[18px] font-semibold text-[#0e0f11]/50 dark:text-foreground/50 uppercase tracking-[0.08em] leading-tight"
          style={{ fontFamily: FONT }}
        >
          Top DeFi Yields Right Now
        </h2>
        <p
          className="text-[15px] text-[#636161] dark:text-muted-foreground font-normal mt-3 max-w-[520px] mx-auto leading-relaxed"
          style={{ fontFamily: FONT }}
        >
          The highest-performing strategy for each major asset, updated daily from on-chain data.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e6e8ea] dark:border-border overflow-hidden bg-white dark:bg-card divide-y divide-[#f0f1f3] dark:divide-border/50">
        {tops.slice(0, 6).map(p => {
          const icon = resolveAssetIcon(p.ticker);
          const slug = getProductSlug(p);
          const hasCurator = p.curator && p.curator !== '-' && p.curator.trim() !== '';
          return (
            <Link
              key={p.id}
              href={`/vault/${slug}`}
              className="group flex items-center gap-4 sm:gap-5 px-5 sm:px-7 py-4 sm:py-5 hover:bg-[#f9faf9] dark:hover:bg-muted/30 transition-colors"
              style={{ fontFamily: FONT }}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                {icon ? (
                  <img src={icon} alt={p.ticker} className="w-10 h-10 object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#f0faf6] dark:bg-[#08a671]/10 flex items-center justify-center border border-[#e6e8ea] dark:border-border">
                    <span className="text-[11px] font-bold text-[#08a671]">{p.ticker[0]}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-[#0e0f11] dark:text-foreground tracking-[-0.01em]">
                    {p.ticker.toUpperCase()}
                  </span>
                </div>
                <p className="text-[13px] text-[#77808d] dark:text-muted-foreground font-medium truncate mt-0.5">
                  {cleanName(p.product_name)} · {p.platform_name}{hasCurator ? ` · ${p.curator}` : ''}
                </p>
              </div>
              <div className="text-right shrink-0 flex items-center gap-3">
                <div>
                  <span className="text-[22px] sm:text-[26px] font-bold text-[#08a671] tabular-nums tracking-[-0.03em] leading-none">
                    {p.spotAPY.toFixed(2)}%
                  </span>
                  <span className="text-[11px] text-[#aeb4bc] dark:text-muted-foreground/60 font-medium ml-1">APY</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#d0d5dd] dark:text-muted-foreground/30 group-hover:text-[#08a671] transition-colors hidden sm:block" />
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-[11px] text-[#b0b5bd] dark:text-muted-foreground/50 font-normal mt-4 leading-relaxed text-center">
        All rates reflect on-chain exchange rates only, excluding external incentives. Rates are variable and update daily.
      </p>
    </section>
  );
};

// ── Mini UI Previews ──────────────────────────────────────────

const MiniChartPreview = () => (
  <div className="bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]" style={{ fontFamily: FONT }}>
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-[11px] text-[#99a0aa] font-medium">30-Day APY</div>
        <div className="text-[20px] font-bold text-[#0e0f11] tracking-tight tabular-nums">8.42%</div>
      </div>
      <div className="bg-[#08a671]/10 rounded-full px-2.5 py-1">
        <span className="text-[10px] font-semibold text-[#08a671]">+1.2% vs avg</span>
      </div>
    </div>
    <svg viewBox="0 0 280 80" className="w-full h-[80px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartFill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#08a671" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#08a671" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,60 C20,55 40,50 60,42 C80,34 100,38 120,30 C140,22 160,28 180,20 C200,12 220,18 240,10 C260,6 270,8 280,5"
        fill="none" stroke="#08a671" strokeWidth="2" />
      <path d="M0,60 C20,55 40,50 60,42 C80,34 100,38 120,30 C140,22 160,28 180,20 C200,12 220,18 240,10 C260,6 270,8 280,5 L280,80 L0,80 Z"
        fill="url(#chartFill2)" />
    </svg>
    <div className="flex justify-between mt-2">
      {['Mar 1', 'Mar 8', 'Mar 15', 'Mar 22', 'Mar 29'].map(d => (
        <span key={d} className="text-[9px] text-[#c0c5cc]">{d}</span>
      ))}
    </div>
  </div>
);

const MiniVaultPreview = () => (
  <div className="bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]" style={{ fontFamily: FONT }}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-[#2775ca] flex items-center justify-center">
        <span className="text-[10px] font-bold text-white">$</span>
      </div>
      <div>
        <div className="text-[13px] font-semibold text-[#0e0f11]">Flagship USDC</div>
        <div className="text-[10px] text-[#99a0aa]">Morpho · Ethereum</div>
      </div>
    </div>
    <div className="flex items-end justify-between mb-4">
      <div>
        <div className="text-[10px] text-[#99a0aa] mb-0.5">Current APY</div>
        <div className="text-[24px] font-bold text-[#08a671] tabular-nums tracking-tight leading-none">8.42%</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-[#99a0aa] mb-0.5">TVL</div>
        <div className="text-[14px] font-semibold text-[#0e0f11] tabular-nums">$142M</div>
      </div>
    </div>
    <button
      className="w-full py-2.5 rounded-[10px] text-[13px] font-semibold text-white cursor-default"
      style={{ background: '#08a671', boxShadow: 'inset 0px -3px 0px 0px rgba(0,0,0,0.18)' }}
    >
      Open Product
    </button>
  </div>
);

// ── Main HomepageContent ──────────────────────────────────────

export const HomepageContent: React.FC<Props> = ({ products }) => {
  const { resolveAssetIcon } = useRegistry();

  const platformCount = useMemo(() => {
    const s = new Set<string>();
    products.forEach(p => { if (p?.platform_name) s.add(p.platform_name); });
    return s.size;
  }, [products]);

  const totalTVL = useMemo(
    () => products.reduce((s, p) => s + (p?.tvl || 0), 0),
    [products]
  );

  const assetRanking = useMemo(() => {
    const map = new Map<string, { strategies: number; protocols: Set<string>; bestAPY: number }>();
    for (const p of products) {
      if (!p || p.tvl < 10_000) continue;
      const t = p.ticker.toUpperCase();
      let entry = map.get(t);
      if (!entry) {
        entry = { strategies: 0, protocols: new Set(), bestAPY: 0 };
        map.set(t, entry);
      }
      entry.strategies++;
      if (p.platform_name) entry.protocols.add(p.platform_name);
      if (p.spotAPY > entry.bestAPY) entry.bestAPY = p.spotAPY;
    }
    return [...map.entries()]
      .sort((a, b) => b[1].strategies - a[1].strategies)
      .slice(0, 5)
      .map(([ticker, d], i) => ({
        rank: i + 1, ticker,
        strategies: d.strategies,
        protocols: d.protocols.size,
        apy: d.bestAPY,
      }));
  }, [products]);

  const projectCards = useMemo(() => {
    return TOP_PROJECTS.map(proj => {
      const prods = products.filter(p =>
        (p.platform_name || '').trim().toLowerCase().replace(/\s+/g, '-') === proj.slug
      );
      const topAPY = prods.length > 0 ? Math.max(...prods.map(p => p.spotAPY || 0)) : 0;
      return { ...proj, strategyCount: prods.length, topAPY };
    }).filter(p => p.strategyCount > 0);
  }, [products]);

  if (products.length === 0) return null;

  return (
    <div className="space-y-14">

      {/* Feature showcase */}
      <section>
        <h2
          className="text-[17px] sm:text-[18px] font-semibold text-[#0e0f11]/50 dark:text-foreground/50 uppercase tracking-[0.08em] leading-tight text-center mb-10"
          style={{ fontFamily: FONT }}
        >
          Everything You Need to Compare Yields
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card 1: Performance */}
          <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(8,166,113,0.88)' }}>
            <div className="p-5 sm:p-7 flex-1 flex items-center">
              <div className="w-full"><MiniChartPreview /></div>
            </div>
            <div className="px-7 sm:px-8 pb-7 sm:pb-8 pt-2">
              <h3 className="text-[17px] font-semibold text-white leading-snug tracking-[-0.02em]" style={{ fontFamily: FONT }}>
                30-day yield history for every strategy
              </h3>
              <p className="text-[14px] text-white/65 leading-[1.6] mt-2" style={{ fontFamily: FONT }}>
                Daily data points, weekly breakdowns, and trend charts so you can spot consistency before you deposit.
              </p>
            </div>
          </div>

          {/* Card 2: Compare — asset ranking mini-table */}
          <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(8,166,113,0.82)' }}>
            <div className="p-5 sm:p-7 flex-1 flex items-center">
              <div className="w-full">
                <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden" style={{ fontFamily: FONT }}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#eef0f2]">
                        <th className="pl-4 pr-1 py-2.5 text-[9px] font-semibold text-[#99a0aa] uppercase tracking-[0.12em] w-[28px]">#</th>
                        <th className="pl-2 pr-1 py-2.5 text-[9px] font-semibold text-[#99a0aa] uppercase tracking-[0.12em]">Asset</th>
                        <th className="px-2 py-2.5 text-[9px] font-semibold text-[#99a0aa] uppercase tracking-[0.12em] text-right">Strategies</th>
                        <th className="px-2 py-2.5 text-[9px] font-semibold text-[#99a0aa] uppercase tracking-[0.12em] text-right">Protocols</th>
                        <th className="px-2 py-2.5 text-[9px] font-semibold text-[#99a0aa] uppercase tracking-[0.12em] text-right">Best APY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f5f6f7]">
                      {assetRanking.map(row => {
                        const icon = resolveAssetIcon(row.ticker);
                        return (
                          <tr key={row.ticker}>
                            <td className="pl-4 pr-1 py-2.5 text-[10px] text-[#b0b5bd]">{row.rank}</td>
                            <td className="pl-2 pr-1 py-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                  {icon ? (
                                    <img src={icon} alt={row.ticker} className="w-5 h-5 object-contain" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-[#f0f1f3] flex items-center justify-center">
                                      <span className="text-[7px] font-bold text-[#77808d]">{row.ticker[0]}</span>
                                    </div>
                                  )}
                                </div>
                                <span className="text-[11px] font-semibold text-[#0e0f11]">{row.ticker}</span>
                              </div>
                            </td>
                            <td className="px-2 py-2.5 text-[11px] font-medium text-[#0e0f11] text-right">{row.strategies}</td>
                            <td className="px-2 py-2.5 text-[11px] font-medium text-[#77808d] text-right">{row.protocols}</td>
                            <td className="px-2 py-2.5 text-[11px] font-semibold text-[#08a671] text-right tabular-nums">{row.apy.toFixed(2)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="px-7 sm:px-8 pb-7 sm:pb-8 pt-2">
              <h3 className="text-[17px] font-semibold text-white leading-snug tracking-[-0.02em]" style={{ fontFamily: FONT }}>
                Sort by APY, TVL, or protocol
              </h3>
              <p className="text-[14px] text-white/65 leading-[1.6] mt-2" style={{ fontFamily: FONT }}>
                {products.length}+ strategies across {platformCount}+ protocols — filter down to exactly what you need.
              </p>
            </div>
          </div>

          {/* Card 3: Direct deposit */}
          <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(8,166,113,0.75)' }}>
            <div className="p-5 sm:p-7 flex-1 flex items-center justify-center">
              <div className="w-full max-w-[280px]"><MiniVaultPreview /></div>
            </div>
            <div className="px-7 sm:px-8 pb-7 sm:pb-8 pt-2">
              <h3 className="text-[17px] font-semibold text-white leading-snug tracking-[-0.02em]" style={{ fontFamily: FONT }}>
                One click from comparison to deposit
              </h3>
              <p className="text-[14px] text-white/65 leading-[1.6] mt-2" style={{ fontFamily: FONT }}>
                Every strategy page links directly to the protocol — no middlemen, no detours.
              </p>
            </div>
          </div>

          {/* Card 4: Multi-chain */}
          <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(8,166,113,0.70)' }}>
            <div className="p-5 sm:p-7 flex-1 flex items-center">
              <div className="w-full">
                <div className="grid grid-cols-3 gap-5">
                  {['Ethereum', 'Base', 'Arbitrum', 'BNB Chain', 'Sonic', 'Avalanche'].map(c => (
                    <div key={c} className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-[11px] font-bold text-white">{c[0]}</span>
                      </div>
                      <span className="text-[11px] font-medium text-white/80">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-7 sm:px-8 pb-7 sm:pb-8 pt-2">
              <h3 className="text-[17px] font-semibold text-white leading-snug tracking-[-0.02em]" style={{ fontFamily: FONT }}>
                6 chains tracked from a single dashboard
              </h3>
              <p className="text-[14px] text-white/65 leading-[1.6] mt-2" style={{ fontFamily: FONT }}>
                Ethereum, Base, Arbitrum, BNB Chain, Sonic, and Avalanche — all indexed and normalized in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="rounded-2xl bg-[#f7f8f9] dark:bg-card py-10 px-6 sm:px-10"
        style={{ fontFamily: FONT }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 lg:gap-24">
          {[
            { value: `${products.length}+`, label: 'Yield Strategies Tracked' },
            { value: `${platformCount}+`, label: 'Protocols Monitored' },
            { value: formatTVL(totalTVL), label: 'Total TVL Tracked' },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-10 sm:gap-16 lg:gap-24">
              {i > 0 && <div className="hidden sm:block w-px h-12 bg-[#e0e3e7] dark:bg-border" />}
              <div className="flex flex-col items-center text-center">
                <span
                  className="text-[32px] sm:text-[36px] font-bold text-[#0e0f11] dark:text-foreground tracking-[-0.04em] leading-none tabular-nums"
                  style={{ fontFamily: FONT }}
                >
                  {s.value}
                </span>
                <span className="text-[12px] sm:text-[13px] text-[#77808d] dark:text-muted-foreground font-medium mt-2">
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore by Project */}
      {projectCards.length > 0 && (
        <section>
          <div className="text-center mb-10">
            <h2
              className="text-[17px] sm:text-[18px] font-semibold text-[#0e0f11]/50 dark:text-foreground/50 uppercase tracking-[0.08em] leading-tight"
              style={{ fontFamily: FONT }}
            >
              Explore by Project
            </h2>
            <p
              className="text-[15px] text-[#636161] dark:text-muted-foreground font-normal mt-3 max-w-[520px] mx-auto leading-relaxed"
              style={{ fontFamily: FONT }}
            >
              Compare yield strategies across the top DeFi protocols tracked on Earnbase.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {projectCards.map(proj => (
              <Link
                key={proj.slug}
                href={`/project/${proj.slug}`}
                className="group rounded-xl border border-[#e6e8ea] dark:border-border bg-white dark:bg-card hover:border-[#08a671]/30 hover:shadow-md transition-all px-4 py-4 flex flex-col gap-1.5"
                style={{ fontFamily: FONT }}
              >
                <span className="text-[15px] font-semibold text-[#0e0f11] dark:text-foreground group-hover:text-[#08a671] transition-colors">
                  {proj.name}
                </span>
                <span className="text-[12px] text-[#77808d] dark:text-muted-foreground font-medium leading-snug">
                  {proj.strategyCount} strategies · Best: {proj.topAPY.toFixed(2)}% APY
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
