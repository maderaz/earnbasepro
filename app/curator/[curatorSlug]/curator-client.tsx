'use client';
import { useEffect } from 'react';
import { RegistryProvider } from '@/app/hooks/useRegistry';
import { CuratorPage } from '@/app/components/CuratorPage';
import type { DeFiProduct } from '@/lib/api';

interface Props {
  curatorSlug: string;
  products: DeFiProduct[];
}

export function CuratorClient({ curatorSlug, products }: Props) {
  useEffect(() => {
    const el = document.getElementById('curator-seo-content');
    if (el) el.style.display = 'none';
  }, []);

  return (
    <RegistryProvider>
      <CuratorPage curatorSlug={curatorSlug} products={products} />
    </RegistryProvider>
  );
}
