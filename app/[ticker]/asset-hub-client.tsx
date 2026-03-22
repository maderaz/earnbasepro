'use client';
import { useEffect } from 'react';
import { RegistryProvider } from '../hooks/useRegistry';
import { AssetHubPage } from '../components/AssetHubPage';
import type { DeFiProduct } from '@/lib/api';

interface Props {
  ticker: string;
  products: DeFiProduct[];
  allTickers: string[];
}

export function AssetHubClient({ ticker, products, allTickers }: Props) {
  useEffect(() => {
    const el = document.getElementById('asset-hub-seo-content');
    if (el) el.style.display = 'none';
  }, []);

  return (
    <RegistryProvider>
      <AssetHubPage ticker={ticker} products={products} allTickers={allTickers} />
    </RegistryProvider>
  );
}
