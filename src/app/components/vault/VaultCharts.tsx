/**
 * VaultCharts — APY + TVL AreaCharts. Flat, no wrapper boxes.
 * Y-axis hidden by default, fades in on hover (mirrored inside chart area).
 */
import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { formatTVL } from '@/app/utils/formatters';
import type { ChartEntry, TvlChartEntry } from './useVaultData';

interface ChartColors {
  grid: string; tick: string;
  tooltipBg: string; tooltipBorder: string; tooltipLabel: string;
}

/**
 * Compute a Y-axis domain with breathing room so lines sit
 * near the vertical centre instead of hugging ceiling / floor.
 *  – Adds proportional padding above & below the data range
 *  – Falls back to ±30 % of the midpoint when the data range is tiny
 *  – Never goes below 0 (for both APY % and TVL $)
 */
function paddedDomain(values: number[]): [number, number] {
  const clean = values.filter(v => Number.isFinite(v));
  if (clean.length === 0) return [0, 1];
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const range = max - min;
  const mid = (min + max) / 2;
  // Use the larger of: 50 % of the data range, or 30 % of the midpoint (min 0.5 for very small numbers)
  const pad = Math.max(range * 0.5, mid * 0.3, 0.5);
  return [Math.max(0, min - pad), max + pad];
}

/** Generate N evenly-spaced tick values across the domain so every grid line renders. */
function evenTicks(domain: [number, number], count: number = 5): number[] {
  const [lo, hi] = domain;
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo === hi) {
    const mid = Number.isFinite(lo) ? lo : 0;
    // Spread ticks around mid, each guaranteed unique via integer offset
    return Array.from({ length: count }, (_, i) => {
      const offset = i - Math.floor(count / 2);
      return parseFloat((mid + offset * 0.5).toFixed(6));
    });
  }
  const step = (hi - lo) / (count - 1);
  const ticks = Array.from({ length: count }, (_, i) =>
    parseFloat((lo + step * i).toFixed(6)),
  );
  // Deduplicate using string keys so floating-point values that print
  // identically (and therefore produce the same Recharts element key) are
  // collapsed into a single entry.
  const seen = new Set<string>();
  const unique: number[] = [];
  for (const t of ticks) {
    const k = String(t);
    if (!seen.has(k)) {
      seen.add(k);
      unique.push(t);
    }
  }
  return unique;
}

// ── Custom Tooltips (CoinGecko / Token Terminal style) ────────

// ── Crosshair Cursor (TradingView style) ──────────────────────

interface CrosshairCursorProps {
  points?: { x: number; y: number }[];
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  color: string;
}

const CrosshairCursor: React.FC<CrosshairCursorProps> = ({ points, width, height, top, left, color }) => {
  if (!points || !points[0]) return null;
  const { x, y } = points[0];
  const chartLeft = left ?? 0;
  const chartTop = top ?? 0;
  const chartWidth = width ?? 0;
  const chartHeight = height ?? 0;

  return (
    <g>
      {/* Vertical line */}
      <line
        x1={x} y1={chartTop}
        x2={x} y2={chartTop + chartHeight}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.35}
      />
      {/* Horizontal line */}
      <line
        x1={chartLeft} y1={y}
        x2={chartLeft + chartWidth} y2={y}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.35}
      />
    </g>
  );
};

function formatFullDate(raw: string): string {
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return raw; }
}

interface ApyTooltipProps {
  active?: boolean;
  payload?: any[];
  chartData: ChartEntry[];
  colors: ChartColors;
}

const ApyTooltip: React.FC<ApyTooltipProps> = ({ active, payload, chartData, colors }) => {
  if (!active || !payload || !payload[0]) return null;
  const entry = payload[0].payload as ChartEntry;
  const apy = entry.apy;
  const idx = chartData.findIndex(d => d.fullDate === entry.fullDate && d.apy === entry.apy);
  const prev = idx > 0 ? chartData[idx - 1].apy : null;
  const delta = prev !== null ? apy - prev : null;
  const deltaPct = prev !== null && prev !== 0 ? ((apy - prev) / prev) * 100 : null;

  return (
    <div
      style={{
        backgroundColor: colors.tooltipBg,
        border: `1px solid ${colors.tooltipBorder}`,
      }}
      className="rounded-lg shadow-lg shadow-black/[0.08] dark:shadow-black/30 px-3.5 py-3 min-w-[180px] pointer-events-none"
    >
      {/* Date */}
      <p className="text-[10px] font-medium tracking-wide uppercase mb-2" style={{ color: colors.tooltipLabel }}>
        {formatFullDate(entry.fullDate)}
      </p>

      {/* Main value */}
      <div className="flex items-baseline gap-2">
        <span className="text-[20px] font-semibold tabular-nums text-[#08a671] leading-none tracking-tight">
          {apy.toFixed(2)}%
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.tooltipLabel }}>
          APY
        </span>
      </div>

      {/* Delta row */}
      {delta !== null && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t" style={{ borderColor: colors.tooltipBorder }}>
          {delta > 0.005 ? (
            <TrendingUp className="w-3 h-3 text-[#08a671]" />
          ) : delta < -0.005 ? (
            <TrendingDown className="w-3 h-3 text-[#ef4444]" />
          ) : (
            <Minus className="w-3 h-3" style={{ color: colors.tooltipLabel }} />
          )}
          <span className={`text-[11px] font-medium tabular-nums ${
            delta > 0.005 ? 'text-[#08a671]' : delta < -0.005 ? 'text-[#ef4444]' : 'text-[#a0a0b0]'
          }`}>
            {delta > 0 ? '+' : ''}{delta.toFixed(2)}pp
          </span>
          {deltaPct !== null && (
            <span className="text-[10px] tabular-nums" style={{ color: colors.tooltipLabel }}>
              ({deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)}%)
            </span>
          )}
          <span className="text-[10px]" style={{ color: colors.tooltipLabel }}>vs prev day</span>
        </div>
      )}
    </div>
  );
};

interface TvlTooltipProps {
  active?: boolean;
  payload?: any[];
  chartData: TvlChartEntry[];
  colors: ChartColors;
}

const TvlTooltip: React.FC<TvlTooltipProps> = ({ active, payload, chartData, colors }) => {
  if (!active || !payload || !payload[0]) return null;
  const entry = payload[0].payload as TvlChartEntry;
  const tvl = entry.tvl;
  const idx = chartData.findIndex(d => d.fullDate === entry.fullDate && d.tvl === entry.tvl);
  const prev = idx > 0 ? chartData[idx - 1].tvl : null;
  const delta = prev !== null ? tvl - prev : null;
  const deltaPct = prev !== null && prev !== 0 ? ((tvl - prev) / prev) * 100 : null;

  return (
    <div
      style={{
        backgroundColor: colors.tooltipBg,
        border: `1px solid ${colors.tooltipBorder}`,
      }}
      className="rounded-lg shadow-lg shadow-black/[0.08] dark:shadow-black/30 px-3.5 py-3 min-w-[180px] pointer-events-none"
    >
      {/* Date */}
      <p className="text-[10px] font-medium tracking-wide uppercase mb-2" style={{ color: colors.tooltipLabel }}>
        {formatFullDate(entry.fullDate)}
      </p>

      {/* Main value */}
      <div className="flex items-baseline gap-2">
        <span className="text-[20px] font-semibold tabular-nums text-[#3b82f6] leading-none tracking-tight">
          {formatTVL(tvl)}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: colors.tooltipLabel }}>
          TVL
        </span>
      </div>

      {/* Delta row */}
      {delta !== null && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t" style={{ borderColor: colors.tooltipBorder }}>
          {delta > 0 ? (
            <TrendingUp className="w-3 h-3 text-[#08a671]" />
          ) : delta < 0 ? (
            <TrendingDown className="w-3 h-3 text-[#ef4444]" />
          ) : (
            <Minus className="w-3 h-3" style={{ color: colors.tooltipLabel }} />
          )}
          <span className={`text-[11px] font-medium tabular-nums ${
            delta > 0 ? 'text-[#08a671]' : delta < 0 ? 'text-[#ef4444]' : 'text-[#a0a0b0]'
          }`}>
            {delta > 0 ? '+' : ''}{formatTVL(Math.abs(delta))}
          </span>
          {deltaPct !== null && (
            <span className="text-[10px] tabular-nums" style={{ color: colors.tooltipLabel }}>
              ({deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(2)}%)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ── APY Chart ─────────────────────────────────────────────────

interface ApyChartProps {
  chartData: ChartEntry[];
  timeframe: '30D' | 'ALL';
  setTimeframe: (v: '30D' | 'ALL') => void;
  chartColors: ChartColors;
  isPrivateCredit?: boolean;
  fillHeight?: boolean;
  hideHeader?: boolean;
}

export const ApyChart: React.FC<ApyChartProps> = ({ chartData, timeframe, setTimeframe, chartColors, isPrivateCredit = false, fillHeight = false, hideHeader = false }) => {
  const apyDomain = paddedDomain(chartData.map(d => d.apy));
  const apyTicks = evenTicks(apyDomain, 5);
  const uid = React.useId().replace(/:/g, '');
  const gradientId = `colorApySheet_${uid}`;
  const xInterval = typeof window !== 'undefined' && window.innerWidth < 640
    ? Math.max(Math.floor(chartData.length / 4), 7)
    : Math.max(Math.floor(chartData.length / 7), 4);

  return (
  <div className={fillHeight ? 'flex flex-col h-full' : 'space-y-4'}>
    {!hideHeader && (
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground">Yield Performance</h2>
        <div className="flex items-center gap-3">
          {isPrivateCredit && (
            <span className="text-[11px] font-medium text-[#3b82f6] hidden sm:inline">Fixed rate, yield does not fluctuate</span>
          )}
          <div className="flex gap-0.5">
            <button onClick={() => setTimeframe('30D')} className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors ${timeframe === '30D' ? 'text-[#08a671] bg-[#08a671]/8' : 'text-[#a0a0b0] hover:text-[#30313e] dark:hover:text-foreground/70'}`}>30D</button>
            <button onClick={() => setTimeframe('ALL')} className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors ${timeframe === 'ALL' ? 'text-[#08a671] bg-[#08a671]/8' : 'text-[#a0a0b0] hover:text-[#30313e] dark:hover:text-foreground/70'}`}>ALL</button>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#08a671] animate-pulse" />
            <span className="text-[10px] font-medium text-[#08a671] uppercase tracking-[0.06em]">Live</span>
          </div>
        </div>
      </div>
    )}

    <div className={`group/chart ${fillHeight ? 'flex-1 min-h-[120px]' : 'h-[144px] md:h-[168px]'} min-w-0 -mx-3 [&_.recharts-yAxis]:opacity-0 [&_.recharts-yAxis]:transition-opacity [&_.recharts-yAxis]:duration-300 hover:[&_.recharts-yAxis]:opacity-100`}>
      {chartData.length > 0 ? (
        <>
        {/* Gradient defined outside the chart so Recharts' internal <defs> doesn't clash */}
        <svg width={0} height={0} style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#08a671" stopOpacity={0.06}/>
              <stop offset="95%" stopColor="#08a671" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </svg>
        <ResponsiveContainer width="100%" height="100%" minHeight={fillHeight ? undefined : 144}>
          <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 16, bottom: 0 }}>
            <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
            <XAxis key="xaxis" dataKey="fullDate" axisLine={false} tickLine={false} tick={{fill: chartColors.tick, fontSize: 10, fontWeight: 500}} dy={10} interval={xInterval} padding={{ left: 16, right: 16 }} tickFormatter={(v) => { const d = new Date(v); return isNaN(d.getTime()) ? v : d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }); }} />
            <YAxis key="yaxis" axisLine={false} tickLine={false} mirror tick={{fill: chartColors.tick, fontSize: 10, fontWeight: 500}} tickFormatter={(val) => `${val.toFixed(1)}%`} width={0} domain={apyDomain} ticks={apyTicks} />
            <RechartsTooltip
              key="tooltip"
              content={<ApyTooltip chartData={chartData} colors={chartColors} />}
              cursor={<CrosshairCursor color={chartColors.grid} />}
              isAnimationActive={false}
            />
            <Area key="area" type="monotone" dataKey="apy" stroke="#08a671" strokeWidth={2} fillOpacity={1} fill={`url(#${gradientId})`} activeDot={{ r: 4, fill: '#08a671', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-[13px] text-[#a0a0b0] font-normal">
          History data pending...
        </div>
      )}
    </div>
  </div>
  );
};

// ── TVL Chart ─────────────────────────────────────────────────

interface TvlChartProps {
  tvlChartData: TvlChartEntry[];
  tvlTimeframe: '30D' | 'ALL';
  setTvlTimeframe: (v: '30D' | 'ALL') => void;
  chartColors: ChartColors;
  fillHeight?: boolean;
  hideHeader?: boolean;
}

export const TvlChart: React.FC<TvlChartProps> = ({ tvlChartData, tvlTimeframe, setTvlTimeframe, chartColors, fillHeight = false, hideHeader = false }) => {
  const tvlDomain = paddedDomain(tvlChartData.map(d => d.tvl));
  const tvlTicks = evenTicks(tvlDomain, 5);
  const uid = React.useId().replace(/:/g, '');
  const tvlGradientId = `colorTvlSheet_${uid}`;
  const xInterval = typeof window !== 'undefined' && window.innerWidth < 640
    ? Math.max(Math.floor(tvlChartData.length / 4), 7)
    : Math.max(Math.floor(tvlChartData.length / 7), 4);

  return (
  <div className={fillHeight ? 'flex flex-col h-full' : 'space-y-4'}>
    {!hideHeader && (
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground">Liquidity Tracker</h2>
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            <button onClick={() => setTvlTimeframe('30D')} className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors ${tvlTimeframe === '30D' ? 'text-[#3b82f6] bg-[#3b82f6]/8' : 'text-[#a0a0b0] hover:text-[#30313e] dark:hover:text-foreground/70'}`}>30D</button>
            <button onClick={() => setTvlTimeframe('ALL')} className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors ${tvlTimeframe === 'ALL' ? 'text-[#3b82f6] bg-[#3b82f6]/8' : 'text-[#a0a0b0] hover:text-[#30313e] dark:hover:text-foreground/70'}`}>ALL</button>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3 h-3 text-[#3b82f6]" />
            <span className="text-[10px] font-medium text-[#3b82f6] uppercase tracking-[0.06em]">TVL</span>
          </div>
        </div>
      </div>
    )}

    <div className={`group/chart ${fillHeight ? 'flex-1 min-h-[120px]' : 'h-[144px] md:h-[168px]'} min-w-0 -mx-3 [&_.recharts-yAxis]:opacity-0 [&_.recharts-yAxis]:transition-opacity [&_.recharts-yAxis]:duration-300 hover:[&_.recharts-yAxis]:opacity-100`}>
      {tvlChartData.length > 0 ? (
        <>
        {/* Gradient defined outside the chart so Recharts' internal <defs> doesn't clash */}
        <svg width={0} height={0} style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id={tvlGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.06}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </svg>
        <ResponsiveContainer width="100%" height="100%" minHeight={fillHeight ? undefined : 144}>
          <AreaChart data={tvlChartData} margin={{ left: 0, right: 0, top: 16, bottom: 0 }}>
            <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
            <XAxis key="xaxis" dataKey="fullDate" axisLine={false} tickLine={false} tick={{fill: chartColors.tick, fontSize: 10, fontWeight: 500}} dy={10} interval={xInterval} padding={{ left: 16, right: 16 }} tickFormatter={(v) => { const d = new Date(v); return isNaN(d.getTime()) ? v : d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }); }} />
            <YAxis key="yaxis" axisLine={false} tickLine={false} mirror tick={{fill: chartColors.tick, fontSize: 10, fontWeight: 500}} tickFormatter={(val) => formatTVL(val)} width={0} domain={tvlDomain} ticks={tvlTicks} />
            <RechartsTooltip
              key="tooltip"
              content={<TvlTooltip chartData={tvlChartData} colors={chartColors} />}
              cursor={<CrosshairCursor color={chartColors.grid} />}
              isAnimationActive={false}
            />
            <Area key="area" type="monotone" dataKey="tvl" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill={`url(#${tvlGradientId})`} activeDot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-[13px] text-[#a0a0b0] font-normal">
          TVL history data pending...
        </div>
      )}
    </div>
  </div>
  );
};