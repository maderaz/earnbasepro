'use client';
import { useEffect } from 'react';
import { NetworkSEOContent } from '../../components/NetworkSEOContent';
import type { DeFiProduct } from '@/lib/api';

interface Props {
  ticker: string;
  network: string;
  networkName: string;
  products: DeFiProduct[];
}

export function NetworkFilterClient({ ticker, network, networkName, products }: Props) {
  useEffect(() => {
    const el = document.getElementById('network-filter-seo-content');
    if (el) el.style.display = 'none';
  }, []);

  return (
    <NetworkSEOContent
      ticker={ticker}
      network={network}
      networkName={networkName}
      products={products}
    />
  );
}
