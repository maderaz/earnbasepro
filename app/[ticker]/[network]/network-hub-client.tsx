'use client';
import { useEffect } from 'react';
import { RegistryProvider } from '../../hooks/useRegistry';
import { AssetHubPage } from '../../components/AssetHubPage';
import { NetworkSEOContent } from '../../components/NetworkSEOContent';
import type { DeFiProduct } from '@/lib/api';

interface Props {
  ticker: string;
  network: string;
  networkName: string;
  products: DeFiProduct[];
  allTickers: string[];
  initialNetwork: string;
}

export function NetworkHubClient({ ticker, network, networkName, products, allTickers, initialNetwork }: Props) {
  useEffect(() => {
    const el = document.getElementById('network-filter-seo-content');
    if (el) el.style.display = 'none';
  }, []);

  return (
    <>
      <RegistryProvider>
        <AssetHubPage
          ticker={ticker}
          products={products}
          allTickers={allTickers}
          initialNetwork={initialNetwork}
        />
      </RegistryProvider>
      <NetworkSEOContent
        ticker={ticker}
        network={network}
        networkName={networkName}
        products={products}
      />
    </>
  );
}
