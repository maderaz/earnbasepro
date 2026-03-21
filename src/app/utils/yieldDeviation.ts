/**
 * Rule #5 — Yield Micro-Deviation
 *
 * Adds a deterministic +0.00–0.01% surplus deviation to every product's
 * APY fields, producing unique "fingerprinted" values across the board.
 *
 * Excluded:
 *   ▸ Products whose spotAPY ≤ 0.01% (too small to deviate).
 *   ▸ Products whose ID is in the manual exclusion set (persisted in KV).
 *
 * The deviation is:
 *   ▸ Deterministic — same product ID always gets the same offset.
 *   ▸ Tiny — max +0.01 percentage points (invisible in practice).
 *   ▸ Uniform per product — applies the same delta to spotAPY,
 *     weeklyAPY, monthlyAPY, and every entry in dailyApyHistory.
 *   ▸ Future-proof — new data inflows get the same per-product offset.
 *
 * Backward/forward safe: deviation is never persisted to DB.
 * Excluding a product immediately restores raw APY values across
 * charts, tables, SEO meta, and JSON-LD schema.
 */

import type { DeFiProduct } from '@/app/utils/types';

// ── Seeded PRNG (deterministic per product) ──────────────────
// Simple sin-hash that maps an integer seed to a float in [0, 1).
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// ── Core: compute the deviation offset for a given product ID ─
const MAX_DEVIATION = 0.01; // percentage points

export const getDeviation = (productId: string | number): number => {
  const numId = typeof productId === 'string' ? parseInt(productId, 10) || 0 : productId;
  return seededRandom(numId) * MAX_DEVIATION;
};

// ── Apply deviation to a single product ──────────────────────
const deviateProduct = (product: DeFiProduct, exclusionSet: Set<number>): DeFiProduct => {
  const numId = typeof product.id === 'string' ? parseInt(product.id, 10) || 0 : Number(product.id);

  // Skip manually excluded products — raw data flows through
  if (exclusionSet.has(numId)) return product;

  const spot = product.spotAPY ?? 0;

  // Skip products at or below 0.01% — deviation would be meaningless
  if (spot <= 0.01) return product;

  const delta = getDeviation(product.id);

  // Clone and shift APY fields
  const deviated: DeFiProduct = {
    ...product,
    spotAPY: parseFloat((spot + delta).toFixed(4)),
    weeklyAPY: product.weeklyAPY != null
      ? parseFloat(((product.weeklyAPY ?? 0) + delta).toFixed(4))
      : product.weeklyAPY,
    monthlyAPY: parseFloat(((product.monthlyAPY ?? 0) + delta).toFixed(4)),
  };

  // Shift every entry in dailyApyHistory (preserves chart shape)
  if (Array.isArray(product.dailyApyHistory) && product.dailyApyHistory.length > 0) {
    deviated.dailyApyHistory = product.dailyApyHistory.map(v => {
      const n = typeof v === 'number' ? v : parseFloat(String(v));
      if (isNaN(n) || n <= 0) return v; // skip zeroes/nulls
      return parseFloat((n + delta).toFixed(4));
    });
  }

  return deviated;
};

// ── Public: apply deviation to the full product array ─────────
// exclusionIds: array of product IDs to skip (persisted from KV)
export const applyYieldDeviation = (
  products: DeFiProduct[],
  exclusionIds: number[] = []
): DeFiProduct[] => {
  const exclusionSet = new Set(exclusionIds);
  if (exclusionSet.size > 0) {
    console.log(`[Rule5] Applying deviation to ${products.length} products, ${exclusionSet.size} excluded`);
  }
  return products.map(p => deviateProduct(p, exclusionSet));
};