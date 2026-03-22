'use client';
import { useEffect } from 'react';
import { RegistryProvider } from '@/app/hooks/useRegistry';
import { ProjectPage } from '@/app/components/ProjectPage';
import type { DeFiProduct } from '@/lib/api';

interface Props {
  slug: string;
  products: DeFiProduct[];
}

export function ProjectClient({ slug, products }: Props) {
  useEffect(() => {
    const el = document.getElementById('project-seo-content');
    if (el) el.style.display = 'none';
  }, []);

  return (
    <RegistryProvider>
      <ProjectPage slug={slug} products={products} />
    </RegistryProvider>
  );
}
