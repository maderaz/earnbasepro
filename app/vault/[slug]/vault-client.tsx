'use client';
import { useEffect } from 'react';
import { RegistryProvider } from '../../hooks/useRegistry';
import { ProductPageV3 } from '../../components/ProductPageV3';
import type { DeFiProduct } from '@/lib/api';

interface Props {
  product: DeFiProduct;
  products: DeFiProduct[];
  isPrivateCredit?: boolean;
}

export function VaultClient({ product, products, isPrivateCredit = false }: Props) {
  useEffect(() => {
    const el = document.getElementById('vault-seo-content');
    if (el) el.style.display = 'none';
  }, []);

  return (
    <RegistryProvider>
      <ProductPageV3 product={product} products={products} isPrivateCredit={isPrivateCredit} />
    </RegistryProvider>
  );
}
