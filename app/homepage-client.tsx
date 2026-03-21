'use client';

/**
 * HomepageClient — Full interactive homepage UI.
 * On mount, hides the SSR skeleton (#homepage-seo-content) and renders the
 * polished interactive components in its place.
 */

import { useEffect } from 'react';
import { RegistryProvider } from './hooks/useRegistry';
import { HeroSection } from './components/HeroSection';
import { TrackerTable } from './components/TrackerTable';
import { TopDeFiYields, HomepageContent } from './components/HomepageContent';
import type { DeFiProduct, DisplaySettings } from '@/lib/api';

interface Props {
  initialProducts: DeFiProduct[];
  tickers: string[];
  tickerCounts: Record<string, number>;
  displaySettings: DisplaySettings;
}

export function HomepageClient({ initialProducts, tickers }: Props) {
  // Hide SSR skeleton once client JS is ready
  useEffect(() => {
    const el = document.getElementById('homepage-seo-content');
    if (el) el.style.display = 'none';
  }, []);

  return (
    <RegistryProvider>
      <div className="space-y-10 lg:space-y-14">
        <HeroSection products={initialProducts} />
        <TopDeFiYields products={initialProducts} />
        <TrackerTable products={initialProducts} allTickers={tickers} />
        <HomepageContent products={initialProducts} />
      </div>
    </RegistryProvider>
  );
}
