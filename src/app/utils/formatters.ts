/**
 * Shared formatting utilities for Earnbase.
 * Used across TrackerTable, ProductDetails, AssetGrid, etc.
 */

export const formatTVL = (val: number): string => {
  if (!val || val <= 0) return '$0';
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
  return `$${val.toLocaleString()}`;
};

export const formatAPY = (val: number | undefined): string => {
  if (val === undefined || val === null || isNaN(val)) return '-';
  if (val <= 0) return '<0.01%';
  return `${val.toFixed(2)}%`;
};

/**
 * Returns true when formatAPY would render this value as "0.00%" or "<0.01%"
 * on the UI — i.e. the number exists but is too small to display a meaningful yield.
 * Used by display-settings filter to hide zero-display-APY products.
 */
export const displaysAsZeroAPY = (val: number | undefined): boolean => {
  if (val === undefined || val === null || isNaN(val)) return false; // "-" is not "0.00%"
  return val < 0.005; // toFixed(2) rounds anything below 0.005 to "0.00"
};

export const formatPercent = (val: number, decimals = 1): string => {
  return `${Math.abs(val).toFixed(decimals)}%`;
};

/**
 * 5-tier trend color based on magnitude of % change.
 * Near-zero → gray, positive → green,
 * negative graduates amber → orange → red.
 */
export const trendColor = (pct: number): string => {
  const abs = Math.abs(pct);
  if (abs < 1) return 'text-[#a0a0b0]';                        // ~flat
  if (pct > 0) return 'text-[#08a671]';                         // positive
  if (abs < 5) return 'text-amber-500 dark:text-amber-400';    // mild negative
  if (abs < 15) return 'text-orange-500 dark:text-orange-400';  // moderate negative
  return 'text-red-500';                                         // severe negative
};