'use client';

/**
 * Client-side interactive shell for the homepage.
 * The server component renders the full SEO HTML above this.
 * This component will eventually mount the full interactive UI
 * (sorting, filtering, charts, dark mode toggle, etc.)
 *
 * Phase 1: Placeholder — just receives data props for future use.
 * Phase 3: Will port the full Dashboard, TrackerTable, AssetGrid, etc.
 */

import type { DeFiProduct, DisplaySettings } from '@/lib/api';

interface Props {
  initialProducts: DeFiProduct[];
  tickers: string[];
  tickerCounts: Record<string, number>;
  displaySettings: DisplaySettings;
}

export function HomepageClient({ initialProducts, tickers, tickerCounts, displaySettings }: Props) {
  // Phase 1: No interactive UI yet — all content is in the Server Component above.
  // Phase 3 will mount the full interactive dashboard here.
  return null;
}
