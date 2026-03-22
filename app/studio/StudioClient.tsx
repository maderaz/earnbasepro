'use client';

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/app/utils/api';
import { RegistryProvider } from '../hooks/useRegistry';
import { StudioPage } from '../components/StudioPage';
import type { DeFiProduct } from '@/lib/api';

export function StudioClient() {
  const [products, setProducts] = useState<DeFiProduct[]>([]);
  const [allTickers, setAllTickers] = useState<string[]>([]);
  const [privateCreditIds, setPrivateCreditIds] = useState<(number | string)[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [poolsRes, pcRes] = await Promise.all([
        api.fetchPools(),
        api.fetchPrivateCreditProducts().catch(() => ({ ids: [] })),
      ]);
      setProducts(poolsRes.products);
      setAllTickers([...new Set(poolsRes.products.map((p: DeFiProduct) => (p.ticker || '').toUpperCase()).filter(Boolean))]);
      setPrivateCreditIds(pcRes.ids || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <RegistryProvider>
      <StudioPage
        products={products}
        loading={loading}
        allTickers={allTickers}
        privateCreditIds={privateCreditIds}
        onRefresh={fetchData}
      />
    </RegistryProvider>
  );
}
