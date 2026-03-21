/**
 * Skeletons — Reusable skeleton loading primitives.
 *
 * Every piece matches the exact dimensions of the real content it replaces
 * so there's zero layout shift when data loads.
 *
 * Style: subtle gray bars with CSS `animate-pulse` (1.5s ease-in-out infinite).
 * Uses Tailwind's `bg-muted` to respect light/dark mode.
 */
import React from 'react';

// ── Primitives ────────────────────────────────────────────────

/** Inline bar skeleton — matches a text span. */
export const Bar: React.FC<{ w?: string; h?: string; className?: string }> = ({
  w = 'w-20',
  h = 'h-3',
  className = '',
}) => (
  <div className={`${w} ${h} bg-muted rounded animate-pulse ${className}`} />
);

/** Circle skeleton — matches an avatar or icon. */
export const Circle: React.FC<{ size?: string; className?: string }> = ({
  size = 'w-7 h-7',
  className = '',
}) => (
  <div className={`${size} rounded-full bg-muted animate-pulse shrink-0 ${className}`} />
);

// ── Composite Blocks ──────────────────────────────────────────

/** Key-value row skeleton — matches KVRow component (label left, value right). */
export const KVRowSkeleton: React.FC<{ noBorder?: boolean }> = ({ noBorder }) => (
  <div className={`flex items-center justify-between py-[11px] ${noBorder ? '' : 'border-b border-[#eff0f4] dark:border-border/30'}`}>
    <Bar w="w-24" h="h-3" />
    <Bar w="w-16" h="h-3" />
  </div>
);

/** Big stat skeleton — label + large number. */
export const StatSkeleton: React.FC = () => (
  <div className="lg:py-3 lg:border-b lg:border-[#eff0f4] lg:dark:border-border/20 lg:last:border-b-0">
    <Bar w="w-14" h="h-2.5" className="mb-2" />
    <Bar w="w-24" h="h-5" />
  </div>
);

/** Chart area skeleton — gray rectangle with faint grid lines. */
export const ChartSkeleton: React.FC<{ height?: string; className?: string }> = ({
  height = 'h-[280px]',
  className = '',
}) => (
  <div className={`${height} bg-muted/30 rounded-xl animate-pulse relative overflow-hidden ${className}`}>
    {/* Faint horizontal grid lines */}
    <div className="absolute inset-x-0 top-[20%] border-t border-muted/40" />
    <div className="absolute inset-x-0 top-[40%] border-t border-muted/40" />
    <div className="absolute inset-x-0 top-[60%] border-t border-muted/40" />
    <div className="absolute inset-x-0 top-[80%] border-t border-muted/40" />
  </div>
);

/** Analytics section skeleton — section heading + KV rows. */
export const AnalyticsSectionSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div>
    <Bar w="w-40" h="h-3.5" className="mb-4" />
    <div className="border border-border/40 rounded-lg px-4">
      {Array.from({ length: rows }).map((_, i) => (
        <KVRowSkeleton key={i} noBorder={i === rows - 1} />
      ))}
    </div>
  </div>
);

// ── Page-Level Skeletons ──────────────────────────────────────

/**
 * VaultPageSkeleton — matches ProductPageV3 layout structure:
 * hero header, chart tabs, 2-col layout with analytics.
 * SEO meta renders from slug data — this is purely visual.
 */
export const VaultPageSkeleton: React.FC = () => (
  <div className="animate-in fade-in duration-500 space-y-6">
    {/* Hero: icon + title + subtitle */}
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Circle size="w-9 h-9" />
        <div className="space-y-2">
          <Bar w="w-56" h="h-5" />
          <Bar w="w-36" h="h-3" />
        </div>
      </div>
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3">
      <StatSkeleton />
      <StatSkeleton />
      <StatSkeleton />
      <StatSkeleton />
    </div>

    {/* Chart tabs + chart */}
    <div className="space-y-3">
      <div className="flex gap-2">
        <Bar w="w-16" h="h-7" className="rounded-lg" />
        <Bar w="w-16" h="h-7" className="rounded-lg" />
      </div>
      <ChartSkeleton height="h-[300px]" />
    </div>

    {/* 2-col: sidebar analytics + main content */}
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      {/* Sidebar */}
      <div className="space-y-6">
        <AnalyticsSectionSkeleton rows={5} />
        <AnalyticsSectionSkeleton rows={4} />
      </div>
      {/* Main content: history table + more analytics */}
      <div className="space-y-6">
        <AnalyticsSectionSkeleton rows={6} />
        <AnalyticsSectionSkeleton rows={4} />
      </div>
    </div>
  </div>
);

/**
 * ListPageSkeleton — matches ProjectPage / CuratorPage layout:
 * H1 heading, description, stats bar, product table.
 */
export const ListPageSkeleton: React.FC = () => (
  <div className="animate-in fade-in duration-500 space-y-6">
    {/* H1 + description */}
    <header className="space-y-3">
      <Bar w="w-64" h="h-5" />
      <Bar w="w-full max-w-lg" h="h-3" />
      <Bar w="w-full max-w-md" h="h-3" />
    </header>

    {/* Stats bar */}
    <div className="flex gap-6">
      <div className="space-y-1.5">
        <Bar w="w-16" h="h-2.5" />
        <Bar w="w-10" h="h-4" />
      </div>
      <div className="space-y-1.5">
        <Bar w="w-16" h="h-2.5" />
        <Bar w="w-10" h="h-4" />
      </div>
      <div className="space-y-1.5">
        <Bar w="w-16" h="h-2.5" />
        <Bar w="w-10" h="h-4" />
      </div>
    </div>

    {/* Table */}
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border/50">
            <th className="hidden md:table-cell pl-5 pr-1 py-3 w-[44px]"><Bar w="w-3" h="h-2.5" /></th>
            <th className="pl-4 md:pl-3 pr-2 py-3"><Bar w="w-16" h="h-2.5" /></th>
            <th className="pl-1 pr-3 py-3 text-right"><Bar w="w-10" h="h-2.5" className="ml-auto" /></th>
            <th className="hidden sm:table-cell px-4 py-3 text-right"><Bar w="w-8" h="h-2.5" className="ml-auto" /></th>
            <th className="hidden lg:table-cell py-3 pr-5 w-[110px]" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, i) => (
            <tr key={`sk-${i}`} className="border-b border-border/30 last:border-b-0 animate-pulse">
              <td className="hidden md:table-cell pl-5 pr-1 py-[14px]"><Bar w="w-4" /></td>
              <td className="pl-4 md:pl-3 pr-2 py-[14px]">
                <div className="flex items-center gap-2.5">
                  <Circle size="w-6 h-6 sm:w-7 sm:h-7" />
                  <div className="space-y-1.5">
                    <Bar w="w-28" />
                    <Bar w="w-20" h="h-2.5" />
                  </div>
                </div>
              </td>
              <td className="pl-1 pr-3 py-[14px]"><Bar w="w-14" h="h-3.5" className="ml-auto" /></td>
              <td className="hidden sm:table-cell px-4 py-[14px]"><Bar w="w-16" className="ml-auto" /></td>
              <td className="hidden lg:table-cell py-[14px] pr-5"><Bar w="w-[72px]" h="h-7" className="rounded-full" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/**
 * HomepageSectionSkeleton — placeholder for homepage content sections
 * (TopDeFiYields, YieldCalculator, TrendingProducts).
 */
export const HomepageSectionSkeleton: React.FC<{ title?: string }> = ({ title }) => (
  <section className="animate-pulse">
    {title ? (
      <h2 className="text-[17px] sm:text-[18px] font-semibold text-[#0e0f11]/50 dark:text-foreground/50 uppercase tracking-[0.08em] leading-tight text-center mb-10">
        {title}
      </h2>
    ) : (
      <Bar w="w-48" h="h-4" className="mx-auto mb-10" />
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Circle size="w-8 h-8" />
            <Bar w="w-20" h="h-3.5" />
          </div>
          <Bar w="w-full" h="h-3" />
          <div className="flex justify-between">
            <Bar w="w-16" h="h-4" />
            <Bar w="w-12" h="h-4" />
          </div>
        </div>
      ))}
    </div>
  </section>
);
