/**
 * Server-side Supabase API client for Next.js Server Components.
 * Mirrors the client-side api.ts but runs on the server during SSR/SSG.
 */

const PROJECT_ID = 'bkjppldzhqhcsqrdqvsn';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJranBwbGR6aHFoY3NxcmRxdnNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMzEwNzUsImV4cCI6MjA4NDgwNzA3NX0.D-WETIJOLhGhaBT3p5kYbfD_6vWmTpvatpA15lSSb4c';

const BASE_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/make-server-7b092b69`;

async function request<T = any>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Authorization': `Bearer ${ANON_KEY}`,
      'apikey': ANON_KEY,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

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

export interface PoolsResponse {
  products: DeFiProduct[];
  rule5Exclusions: number[];
  privateCreditIds: (number | string)[];
}

export interface DisplaySettings {
  assetMinTvl: number;
  homeMinTvl: number;
  showZeroApy: boolean;
}

export async function fetchPools(): Promise<PoolsResponse> {
  const res = await request<PoolsResponse | DeFiProduct[]>('/pools');
  if (Array.isArray(res)) {
    return { products: res, rule5Exclusions: [], privateCreditIds: [] };
  }
  return {
    products: res.products || [],
    rule5Exclusions: res.rule5Exclusions || [],
    privateCreditIds: res.privateCreditIds || [],
  };
}

export async function fetchDisplaySettings(): Promise<DisplaySettings> {
  try {
    return await request<DisplaySettings>('/display-settings');
  } catch {
    return { assetMinTvl: 0, homeMinTvl: 0, showZeroApy: false };
  }
}

export interface RegistryItem {
  _type?: string;
  _id?: string;
  name?: string;
  ticker?: string;
  aliases?: string[];
  iconUrl?: string;
}

export interface RegistryAll {
  networks: RegistryItem[];
  assets: RegistryItem[];
  platforms: RegistryItem[];
  curators: RegistryItem[];
}

export async function fetchRegistry(): Promise<RegistryAll> {
  try {
    return await request<RegistryAll>('/registry');
  } catch {
    return { networks: [], assets: [], platforms: [], curators: [] };
  }
}
