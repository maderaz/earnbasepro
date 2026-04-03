'use client';

/**
 * Registry context for Next.js — provides icon resolution for assets, networks, and platforms.
 * Fetches from the Supabase registry API on mount; text-initial fallbacks while loading.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SUPABASE_ANON_KEY, SUPABASE_API_URL } from '@/lib/supabase-config';

const ANON_KEY = SUPABASE_ANON_KEY;
const BASE_URL = SUPABASE_API_URL;

// Static network config — used for name resolution and matchesNetwork logic
const NETWORK_CONFIG: { id: string; name: string; aliases: string[] }[] = [
  { id: 'ethereum', name: 'Ethereum', aliases: ['eth', 'mainnet', 'ethereum'] },
  { id: 'base', name: 'Base', aliases: ['base'] },
  { id: 'arbitrum', name: 'Arbitrum', aliases: ['arbitrum', 'arb'] },
  { id: 'bnb', name: 'BNB Chain', aliases: ['bnb', 'bsc', 'binance', 'bnb chain'] },
  { id: 'sonic', name: 'Sonic', aliases: ['sonic', 'fraxtal'] },
  { id: 'avalanche', name: 'Avalanche', aliases: ['avalanche', 'avax'] },
];

interface RegistryItem {
  _id?: string;
  name?: string;
  ticker?: string;
  aliases?: string[];
  iconUrl?: string;
}

export interface NetworkOption {
  id: string;
  name: string;
  icon: string | null;
}

interface RegistryContextType {
  resolveAssetIcon: (ticker: string) => string | null;
  resolveNetworkIcon: (network: string) => string | null;
  resolveNetworkName: (network: string) => string;
  matchesNetwork: (productNetwork: string, filterNetwork: string) => boolean;
  getAllNetworks: () => NetworkOption[];
  refreshRegistry: () => Promise<void>;
}

const defaultMatchesNetwork = (productNetwork: string, filterNetwork: string): boolean => {
  if (filterNetwork === 'all') return true;
  const n = productNetwork.toLowerCase();
  const cfg = NETWORK_CONFIG.find(c => c.id === filterNetwork || c.name.toLowerCase() === filterNetwork);
  if (cfg) return cfg.aliases.some(a => n.includes(a));
  return n.includes(filterNetwork.toLowerCase());
};

const RegistryContext = createContext<RegistryContextType>({
  resolveAssetIcon: () => null,
  resolveNetworkIcon: () => null,
  resolveNetworkName: (n) => n,
  matchesNetwork: defaultMatchesNetwork,
  getAllNetworks: () => NETWORK_CONFIG.map(n => ({ id: n.id, name: n.name, icon: null })),
  refreshRegistry: async () => {},
});

export function RegistryProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<RegistryItem[]>([]);
  const [networks, setNetworks] = useState<RegistryItem[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/registry`, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Content-Type': 'application/json',
      },
    })
      .then(r => r.json())
      .then(data => {
        if (data.assets) setAssets(data.assets);
        if (data.networks) setNetworks(data.networks);
      })
      .catch(() => {}); // graceful — text fallbacks remain
  }, []);

  const assetIconMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of assets) {
      if (!item.iconUrl) continue;
      if (item._id) map.set(item._id.toLowerCase(), item.iconUrl);
      if (item.ticker) map.set(item.ticker.toLowerCase(), item.iconUrl);
      if (item.name) map.set(item.name.toLowerCase(), item.iconUrl);
    }
    return map;
  }, [assets]);

  const networkIconMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of networks) {
      if (!item.iconUrl) continue;
      if (item._id) map.set(item._id.toLowerCase(), item.iconUrl);
      if (item.name) map.set(item.name.toLowerCase(), item.iconUrl);
      if (item.aliases) {
        for (const alias of item.aliases) map.set(alias.toLowerCase(), item.iconUrl);
      }
    }
    return map;
  }, [networks]);

  const resolveAssetIcon = useCallback((ticker: string): string | null => {
    const t = ticker.toLowerCase();
    if (assetIconMap.has(t)) return assetIconMap.get(t)!;
    for (const [key, url] of assetIconMap) {
      if (t.includes(key) || key.includes(t)) return url;
    }
    return null;
  }, [assetIconMap]);

  const resolveNetworkIcon = useCallback((network: string): string | null => {
    const n = network.toLowerCase();
    if (networkIconMap.has(n)) return networkIconMap.get(n)!;
    // Try static aliases
    for (const cfg of NETWORK_CONFIG) {
      if (cfg.aliases.some(a => n.includes(a))) {
        for (const alias of cfg.aliases) {
          if (networkIconMap.has(alias)) return networkIconMap.get(alias)!;
        }
        if (networkIconMap.has(cfg.name.toLowerCase())) return networkIconMap.get(cfg.name.toLowerCase())!;
        if (networkIconMap.has(cfg.id)) return networkIconMap.get(cfg.id)!;
      }
    }
    return null;
  }, [networkIconMap]);

  const resolveNetworkName = useCallback((network: string): string => {
    const n = network.toLowerCase();
    for (const cfg of NETWORK_CONFIG) {
      if (cfg.aliases.some(a => n.includes(a))) return cfg.name;
    }
    return network;
  }, []);

  const matchesNetwork = useCallback((productNetwork: string, filterNetwork: string): boolean => {
    return defaultMatchesNetwork(productNetwork, filterNetwork);
  }, []);

  const getAllNetworks = useCallback((): NetworkOption[] => {
    return NETWORK_CONFIG.map(cfg => ({
      id: cfg.id,
      name: cfg.name,
      icon: resolveNetworkIcon(cfg.id),
    }));
  }, [resolveNetworkIcon]);

  const refreshRegistry = useCallback(async (): Promise<void> => {
    try {
      const r = await fetch(`${BASE_URL}/registry`, {
        headers: { 'Authorization': `Bearer ${ANON_KEY}`, 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
      });
      const data = await r.json();
      if (data.assets) setAssets(data.assets);
      if (data.networks) setNetworks(data.networks);
    } catch {}
  }, []);

  const value = useMemo(() => ({
    resolveAssetIcon,
    resolveNetworkIcon,
    resolveNetworkName,
    matchesNetwork,
    getAllNetworks,
    refreshRegistry,
  }), [resolveAssetIcon, resolveNetworkIcon, resolveNetworkName, matchesNetwork, getAllNetworks, refreshRegistry]);

  return <RegistryContext.Provider value={value}>{children}</RegistryContext.Provider>;
}

export function useRegistry() {
  return useContext(RegistryContext);
}
