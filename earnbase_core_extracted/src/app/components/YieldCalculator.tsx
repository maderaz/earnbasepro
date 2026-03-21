/**
 * YieldCalculator — Compound interest simulator.
 * Left: Starting Amount + pick a top USDC product (sets APY).
 * Right: Recharts bar chart showing growth over time.
 */
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { DeFiProduct } from '@/app/utils/types';
import { useRegistry } from '@/app/contexts/RegistryContext';
import { SlotNumber } from './ui/SlotNumber';

const FONT = "'Plus Jakarta Sans', sans-serif";
const FONT_NUM = "'Plus Jakarta Sans', sans-serif";

const WEEKS_IN_YEAR = 52;

function computeWeeklyGrowth(principal: number, monthlyContrib: number, apy: number) {
  const data: { week: number; balance: number }[] = [];
  let balance = principal;
  const weeklyRate = Math.pow(1 + apy / 100, 1 / WEEKS_IN_YEAR) - 1;
  const weeklyContrib = (monthlyContrib * 12) / WEEKS_IN_YEAR;
  for (let w = 0; w <= WEEKS_IN_YEAR; w++) {
    data.push({ week: w, balance: Math.round(balance * 100) / 100 });
    if (w > 0) balance += weeklyContrib;
    balance *= 1 + weeklyRate;
  }
  // Sample monthly (every ~4.3 weeks) for the bar chart
  const monthly = data.filter((_, i) => i === 0 || i % 4 === 0 || i === data.length - 1);
  return { weekly: data, monthly };
}

function fmtK(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toLocaleString()}`;
}

function weekToLabel(w: number): string {
  if (w === 0) return 'Now';
  const month = Math.floor((w / WEEKS_IN_YEAR) * 12);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[month] ?? '';
}

/** Lightweight SVG bar chart — replaces Recharts to avoid internal null-key warnings. */
function MiniBarChart({
  data,
  hoveredIdx,
  onHover,
}: {
  data: { week: number; balance: number }[];
  hoveredIdx: number | null;
  onHover: (idx: number | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 400, h: 260 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const PAD_L = 60;
  const PAD_B = 28;
  const PAD_T = 4;
  const PAD_R = 8;
  const chartW = w - PAD_L - PAD_R;
  const chartH = h - PAD_B - PAD_T;

  const maxVal = Math.max(...data.map(d => d.balance), 1);
  const minVal = 0;

  // Y-axis ticks (4-5 nice ticks)
  const yTicks = useMemo(() => {
    const range = maxVal - minVal;
    const roughStep = range / 4;
    const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const step = Math.ceil(roughStep / mag) * mag;
    const ticks: number[] = [];
    for (let v = 0; v <= maxVal + step * 0.1; v += step) {
      ticks.push(v);
      if (ticks.length >= 6) break;
    }
    return ticks;
  }, [maxVal]);

  const yMax = yTicks[yTicks.length - 1] || maxVal;
  const barCount = data.length;
  const gap = 6;
  const rawBarW = (chartW - gap * (barCount - 1)) / barCount;
  const barW = Math.max(4, rawBarW);
  const totalBarsW = barCount * barW + (barCount - 1) * gap;
  const offsetX = PAD_L + (chartW - totalBarsW) / 2;

  const yScale = useCallback((v: number) => PAD_T + chartH - (v / yMax) * chartH, [chartH, yMax]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: 260, minWidth: 200 }}>
      <svg width={w} height={h} style={{ display: 'block' }}>
        {/* Y-axis ticks */}
        {yTicks.map((v) => (
          <text
            key={`yt-${v}`}
            x={PAD_L - 8}
            y={yScale(v)}
            textAnchor="end"
            dominantBaseline="middle"
            fill="#aeb4bc"
            fontSize={11}
            fontFamily="'Plus Jakarta Sans', sans-serif"
          >
            {fmtK(v)}
          </text>
        ))}
        {/* Bars */}
        {data.map((d, i) => {
          const bx = offsetX + i * (barW + gap);
          const barH = Math.max(0, (d.balance / yMax) * chartH);
          const by = PAD_T + chartH - barH;
          const isActive = i === hoveredIdx;
          return (
            <g key={`bar-${d.week}`}>
              {/* Invisible wider hit area */}
              <rect
                x={bx - gap / 2}
                y={PAD_T}
                width={barW + gap}
                height={chartH + PAD_B}
                fill="transparent"
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(null)}
                style={{ cursor: 'pointer' }}
              />
              <rect
                x={bx}
                y={by}
                width={barW}
                height={barH}
                rx={Math.min(6, barW / 2)}
                ry={Math.min(6, barW / 2)}
                fill={isActive ? '#079565' : '#08a671'}
                filter={isActive ? 'url(#bar-glow)' : undefined}
                style={{ pointerEvents: 'none', transition: 'fill 0.15s' }}
              />
            </g>
          );
        })}
        {/* X-axis labels */}
        {data.map((d, i) => {
          const bx = offsetX + i * (barW + gap) + barW / 2;
          // Show every other label if too many
          const showEvery = barCount > 10 ? 2 : 1;
          if (i % showEvery !== 0 && i !== barCount - 1) return null;
          return (
            <text
              key={`xl-${d.week}`}
              x={bx}
              y={h - 6}
              textAnchor="middle"
              fill="#aeb4bc"
              fontSize={11}
              fontFamily="'Plus Jakarta Sans', sans-serif"
            >
              {weekToLabel(d.week)}
            </text>
          );
        })}
        {/* Drop shadow filter */}
        <defs>
          <filter id="bar-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(8,166,113,0.35)" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function fmtFull(v: number): string {
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Props {
  products: DeFiProduct[];
}

export const YieldCalculator: React.FC<Props> = ({ products }) => {
  const { resolveAssetIcon } = useRegistry();

  // Top USDC products (variable yield, reasonable APY, decent TVL)
  const usdcProducts = useMemo(() => {
    return products
      .filter(p => {
        const t = p.ticker.toLowerCase();
        if (t !== 'usdc') return false;
        if (p.tvl < 50_000 || p.spotAPY <= 0.3 || p.spotAPY > 80) return false;
        const n = (p.product_name + ' ' + p.platform_name).toLowerCase();
        if (n.includes('fixed') || n.includes('lock') || n.includes('term')) return false;
        return true;
      })
      .sort((a, b) => b.spotAPY - a.spotAPY)
      .slice(0, 15);
  }, [products]);

  const [principal, setPrincipal] = useState(10000);
  const [monthlyContrib, setMonthlyContrib] = useState(1000);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  const selected = usdcProducts[selectedIdx] ?? null;
  const apy = selected?.spotAPY ?? 5;
  const icon = selected ? resolveAssetIcon(selected.ticker) : null;

  const data = useMemo(() => computeWeeklyGrowth(principal, monthlyContrib, apy), [principal, monthlyContrib, apy]);

  const finalBalance = data.weekly[data.weekly.length - 1]?.balance ?? 0;
  const totalDeposited = principal + monthlyContrib * 12;
  const earned = finalBalance - totalDeposited;

  // Compute deposited amount at a given week — aligns with how computeWeeklyGrowth
  // records balances: contributions are added *after* the push, so at data[w],
  // only (w-1) weekly contributions have been included (for w >= 1).
  const weeklyContrib = (monthlyContrib * 12) / WEEKS_IN_YEAR;
  const depositedAtWeek = (w: number) => principal + Math.max(0, w - 1) * weeklyContrib;

  // Active display values — hovered bar or final
  const hoveredWeekNum = hoveredWeek !== null ? (data.monthly[hoveredWeek]?.week ?? null) : null;
  const displayWeek = hoveredWeekNum ?? WEEKS_IN_YEAR;
  const displayBalance = hoveredWeekNum !== null
    ? (data.weekly[hoveredWeekNum]?.balance ?? finalBalance)
    : finalBalance;
  const displayEarned = displayBalance - depositedAtWeek(displayWeek);
  const displayLabel = hoveredWeekNum !== null
    ? (hoveredWeekNum === 0 ? 'at start' : `in ${hoveredWeekNum} week${hoveredWeekNum !== 1 ? 's' : ''}`)
    : 'in 1 year';

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setPrincipal(parseFloat(raw) || 0);
  };

  if (usdcProducts.length === 0) return null;

  const truncName = (name: string, max: number) =>
    name.length > max ? name.slice(0, max - 1) + '…' : name;

  return (
    <section
      className="rounded-3xl overflow-hidden relative border border-[#e6e8ea] dark:border-border bg-white dark:bg-card"
    >
      <div className="relative flex flex-col lg:flex-row">

        {/* ── Left: Inputs ─────────────────── */}
        <div className="flex flex-col gap-6 p-10 sm:p-12 lg:w-[360px] xl:w-[400px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-[#e6e8ea] dark:border-border">
          <h2 className="text-[20px] font-semibold text-[#0e0f11] dark:text-foreground tracking-[-0.02em]" style={{ fontFamily: FONT }}>
            Yield Simulator
          </h2>

          {/* Product Selector — moved to top */}
          <div className="relative" ref-data="dropdown-wrap">
            <label className="text-[13px] text-[#77808d] dark:text-muted-foreground font-medium block mb-2.5" style={{ fontFamily: FONT }}>USDC Product</label>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-[#f7f8f9] dark:bg-muted border border-[#e6e8ea] dark:border-border rounded-2xl px-5 py-3.5 flex items-center gap-3.5 hover:border-[#08a671]/30 transition-colors cursor-pointer text-left"
            >
              {icon ? (
                <img src={icon} alt="USDC" className="w-6 h-6 rounded-full object-contain flex-shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#08a671]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold text-[#08a671]">USDC</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-[#0e0f11] dark:text-foreground truncate" style={{ fontFamily: FONT }}>
                  {selected ? truncName(selected.product_name, 22) : 'Select product'}
                </div>
                <div className="text-[11px] text-[#77808d] dark:text-muted-foreground truncate" style={{ fontFamily: FONT }}>
                  {selected ? selected.platform_name : ''}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[15px] font-bold text-[#08a671] tabular-nums" style={{ fontFamily: FONT_NUM }}>{apy.toFixed(2)}%</span>
                <ChevronDown className={`w-4 h-4 text-[#aeb4bc] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Elegant dropdown */}
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
                <div
                  className="absolute left-0 right-0 top-full mt-2.5 z-30 rounded-2xl overflow-hidden bg-white dark:bg-card border border-[#eaecee] dark:border-border shadow-[0_12px_40px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.04)]"
                >
                  {/* Header */}
                  <div className="px-4 pt-3 pb-2 border-b border-[#f0f1f3] dark:border-border">
                    <span className="text-[11px] font-semibold text-[#aeb4bc] dark:text-muted-foreground uppercase tracking-[0.06em]" style={{ fontFamily: FONT }}>Top USDC by APY</span>
                  </div>
                  {/* Scrollable list — 3 visible rows (~186px), rest scrolls */}
                  <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: '186px' }}>
                    {usdcProducts.map((p, i) => {
                      const pIcon = resolveAssetIcon(p.ticker);
                      const isActive = i === selectedIdx;
                      return (
                        <button
                          key={p.id}
                          onClick={() => { setSelectedIdx(i); setDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3.5 px-5 py-3.5 transition-colors cursor-pointer border-b border-[#f5f6f7] dark:border-border/50 last:border-b-0 ${isActive ? 'bg-[#f0faf6] dark:bg-[#08a671]/10' : 'hover:bg-[#f9fafb] dark:hover:bg-muted/30'}`}
                        >
                          {pIcon ? (
                            <img src={pIcon} alt={p.ticker} className="w-6 h-6 rounded-full object-contain flex-shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#08a671]/8 flex items-center justify-center flex-shrink-0">
                              <span className="text-[8px] font-bold text-[#08a671]">USDC</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="text-[13px] font-medium text-[#0e0f11] dark:text-foreground truncate" style={{ fontFamily: FONT }}>{truncName(p.product_name, 24)}</div>
                            <div className="text-[11px] text-[#99a0aa] dark:text-muted-foreground font-medium" style={{ fontFamily: FONT }}>{p.platform_name}</div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-[14px] font-semibold tabular-nums ${isActive ? 'text-[#08a671]' : 'text-[#0e0f11] dark:text-foreground'}`} style={{ fontFamily: FONT_NUM }}>{p.spotAPY.toFixed(2)}%</span>
                            {isActive && (
                              <div className="w-4 h-4 rounded-full bg-[#08a671] flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {/* Footer fade hint */}
                  {usdcProducts.length > 3 && (
                    <div className="px-4 py-2 border-t border-[#f0f1f3] dark:border-border text-center">
                      <span className="text-[11px] text-[#c0c5cc] dark:text-muted-foreground/60 font-medium" style={{ fontFamily: FONT }}>{usdcProducts.length} products · scroll for more</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Starting Amount */}
          <div>
            <label className="text-[13px] text-[#77808d] dark:text-muted-foreground font-medium block mb-2.5" style={{ fontFamily: FONT }}>Starting Amount</label>
            <div className="relative flex items-center bg-white dark:bg-muted border border-[#e0e3e7] dark:border-border rounded-2xl focus-within:border-[#08a671]/40 transition-colors">
              <span className="pl-5 text-[16px] text-[#aeb4bc] dark:text-muted-foreground font-medium select-none" style={{ fontFamily: FONT_NUM }}>$</span>
              <input
                type="text"
                value={principal.toLocaleString()}
                onChange={handleNumberInput}
                className="flex-1 bg-transparent pl-1.5 pr-5 py-3.5 text-[16px] font-medium text-[#0e0f11] dark:text-foreground outline-none"
                style={{ fontFamily: FONT_NUM }}
              />
            </div>
          </div>

          {/* Monthly Contributions */}
          <div>
            <label className="text-[13px] text-[#77808d] dark:text-muted-foreground font-medium block mb-2.5" style={{ fontFamily: FONT }}>Monthly Contributions</label>
            <div className="relative flex items-center bg-white dark:bg-muted border border-[#e0e3e7] dark:border-border rounded-2xl focus-within:border-[#08a671]/40 transition-colors">
              <span className="pl-5 text-[16px] text-[#aeb4bc] dark:text-muted-foreground font-medium select-none" style={{ fontFamily: FONT_NUM }}>$</span>
              <input
                type="text"
                value={monthlyContrib.toLocaleString()}
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9.]/g, '');
                  setMonthlyContrib(parseFloat(raw) || 0);
                }}
                className="flex-1 bg-transparent pl-1.5 pr-5 py-3.5 text-[16px] font-medium text-[#0e0f11] dark:text-foreground outline-none"
                style={{ fontFamily: FONT_NUM }}
              />
            </div>
          </div>

          {/* Summary */}
          <p className="text-[12px] text-[#aeb4bc] dark:text-muted-foreground/70 leading-relaxed mt-auto" style={{ fontFamily: FONT }}>
            Depositing <strong className="text-[#77808d] dark:text-muted-foreground">${principal.toLocaleString()}</strong> + <strong className="text-[#77808d] dark:text-muted-foreground">${monthlyContrib.toLocaleString()}/mo</strong> into{' '}
            <strong className="text-[#77808d] dark:text-muted-foreground">{selected?.product_name ?? 'a product'}</strong> at{' '}
            <strong className="text-[#08a671]">{apy.toFixed(2)}% APY</strong> over 1 year.
          </p>
        </div>

        {/* ── Right: Chart ─────────────────── */}
        <div className="flex-1 flex flex-col p-10 sm:p-12 min-w-0 relative">
          <div className="text-center mb-8">
            <p className="text-[13px] text-[#77808d] dark:text-muted-foreground font-medium mb-1.5" style={{ fontFamily: FONT }}>Future Balance</p>
            <div className="text-[38px] sm:text-[46px] font-bold text-[#0e0f11] dark:text-foreground tabular-nums tracking-tight leading-none flex justify-center" style={{ fontFamily: FONT_NUM }}>
              <SlotNumber value={fmtFull(displayBalance)} duration={350} />
            </div>
            <div className="text-[13px] text-[#77808d] dark:text-muted-foreground mt-2 flex items-center justify-center gap-1" style={{ fontFamily: FONT }}>
              <span className="font-semibold text-[#08a671] tabular-nums tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtFull(displayEarned)}</span>
              <span> earned {displayLabel}</span>
            </div>
          </div>

          <div style={{ width: '100%', height: 260, minWidth: 200 }}>
            <MiniBarChart
              data={data.monthly}
              hoveredIdx={hoveredWeek}
              onHover={setHoveredWeek}
            />
          </div>
        </div>
      </div>
    </section>
  );
};