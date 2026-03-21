/**
 * Shared TypeScript interfaces for Earnbase.
 * Single source of truth — all components import from here.
 */

export interface DeFiProduct {
  id: string | number;
  ticker: string;
  network: string;
  platform_name: string;
  product_name: string;
  curator: string;
  product_link: string;
  url?: string;
  vault_address?: string;
  spotAPY: number;
  weeklyAPY?: number;
  monthlyAPY: number;
  tvl: number;
  dailyApyHistory?: number[];
  tvlHistory?: number[];
}

/** @deprecated Use DeFiProduct instead */
export type USDCProduct = DeFiProduct;