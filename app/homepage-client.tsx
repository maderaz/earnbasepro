'use client';

/**
 * HomepageClient — Full interactive homepage UI.
 * The SSR skeleton (#homepage-seo-content) is visually hidden via sr-only CSS from
 * the start — no JS toggling, no flash.
 */

import { RegistryProvider } from './hooks/useRegistry';
import { HeroSection } from './components/HeroSection';
import { TrackerTable } from './components/TrackerTable';
import { HomepageContent } from './components/HomepageContent';
import type { DeFiProduct, DisplaySettings } from '@/lib/api';

interface Props {
  initialProducts: DeFiProduct[];
  tickers: string[];
  tickerCounts: Record<string, number>;
  displaySettings: DisplaySettings;
  totalProductCount: number;
}

export function HomepageClient({ initialProducts, tickers, totalProductCount }: Props) {
  return (
    <RegistryProvider>
      <div className="space-y-10 lg:space-y-14">
        <HeroSection products={initialProducts} totalCount={totalProductCount} />
        <TrackerTable products={initialProducts} allTickers={tickers} />
        <HomepageContent products={initialProducts} />
      </div>
    </RegistryProvider>
  );
}
