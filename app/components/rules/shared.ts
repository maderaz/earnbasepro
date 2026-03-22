'use client';

/**
 * Shared types and helpers for Control Room Rules.
 */
import type { DeFiProduct } from '@/lib/api';

export type RulePhase = 'idle' | 'scanning' | 'scanned' | 'running' | 'done';

/** Capitalize first letter of each word — e.g. "hyperithm" → "Hyperithm" */
export const capitalizeWords = (s: string) => s.replace(/\b\w/g, c => c.toUpperCase());

/** Build a fingerprint from the fields used to identify duplicates */
export const fingerprint = (p: DeFiProduct): string => {
  const name = (p.product_name || '').toLowerCase().trim();
  const spot = Number(p.spotAPY || 0).toFixed(4);
  const monthly = Number(p.monthlyAPY || 0).toFixed(4);
  const tvl = Number(p.tvl || 0).toFixed(2);
  return `${name}|${spot}|${monthly}|${tvl}`;
};

/** Human-readable label for a fingerprint group */
export const groupLabel = (p: DeFiProduct): string => `${p.product_name}`;

export interface DuplicateGroup {
  fingerprint: string;
  label: string;
  items: DeFiProduct[];
  keep: DeFiProduct;
  remove: DeFiProduct[];
}
