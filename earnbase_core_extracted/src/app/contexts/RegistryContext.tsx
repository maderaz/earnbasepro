/**
 * RegistryContext — the bridge between Control Room (KV store) and the rest of the app.
 *
 * On mount, loads all registry data (networks, assets, platforms, curators) from
 * the server. Provides resolver functions that check dynamic/custom icons first,
 * then fall back to static build-time imports from assets.ts.
 *
 * Usage in any component:
 *   const { resolveAssetIcon, resolveNetworkIcon, resolvePlatformIcon } = useRegistry();
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '@/app/utils/api';
import type { RegistryAll, RegistryItem } from '@/app/utils/api';
import {
  getAssetIcon as staticAssetIcon,
  getNetworkIcon as staticNetworkIcon,
  getNetworkName as staticNetworkName,
  matchesNetwork as staticMatchesNetwork,
  NETWORKS as STATIC_NETWORKS,
  getPlatformColor,
  getPlatformInitials,
} from '@/app/utils/assets';

// ─── Types ───────────────────────────────────────────────────
export interface PlatformIconInfo {
  url: string | null;
  initials: string;
  color: { bg: string; text: string };
}

export interface CuratorIconInfo {
  url: string | null;
  initials: string;
}

interface NetworkOption {
  id: string;
  name: string;
  icon: string | null;
}

interface RegistryContextType {
  registry: RegistryAll;
  loaded: boolean;
  resolveAssetIcon: (ticker: string) => string | null;
  resolveNetworkIcon: (network: string) => string;
  resolveNetworkName: (network: string) => string;
  matchesNetwork: (productNetwork: string, filterNetwork: string) => boolean;
  getAllNetworks: () => NetworkOption[];
  getAllNetworkNames: () => string[];
  resolvePlatformIcon: (name: string) => PlatformIconInfo;
  resolveCuratorIcon: (name: string) => CuratorIconInfo;
  refreshRegistry: () => Promise<void>;
}

const defaultContext: RegistryContextType = {
  registry: { networks: [], assets: [], platforms: [], curators: [] },
  loaded: false,
  resolveAssetIcon: staticAssetIcon,
  resolveNetworkIcon: staticNetworkIcon,
  resolveNetworkName: staticNetworkName,
  matchesNetwork: staticMatchesNetwork,
  getAllNetworks: () => STATIC_NETWORKS.map(n => ({ ...n, icon: n.icon as string | null })),
  getAllNetworkNames: () => STATIC_NETWORKS.map(n => n.name),
  resolvePlatformIcon: (name) => ({
    url: null,
    initials: getPlatformInitials(name),
    color: getPlatformColor(name),
  }),
  resolveCuratorIcon: (name) => ({
    url: null,
    initials: name ? name[0].toUpperCase() : '?',
  }),
  refreshRegistry: async () => {},
};

const RegistryContext = createContext<RegistryContextType>(defaultContext);

// ─── Provider ────────────────────────────────────────────────
export const RegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registry, setRegistry] = useState<RegistryAll>({
    networks: [], assets: [], platforms: [], curators: [],
  });
  const [loaded, setLoaded] = useState(false);

  const fetchRegistry = useCallback(async () => {
    try {
      const data = await api.fetchRegistryAll();
      setRegistry(data);
      setLoaded(true);
    } catch (err) {
      console.warn('[RegistryContext] Failed to load registry, using static defaults:', err);
      setLoaded(true); // Still mark as loaded so app doesn't wait forever
    }
  }, []);

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  // ─── Build lookup maps (memoized) ───────────────────────────
  const assetIconMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of registry.assets) {
      if (item.iconUrl) {
        // Map by _id, ticker, and name (all lowercased)
        if (item._id) map.set(item._id.toLowerCase(), item.iconUrl);
        if (item.ticker) map.set(item.ticker.toLowerCase(), item.iconUrl);
        if (item.name) map.set(item.name.toLowerCase(), item.iconUrl);
      }
    }
    return map;
  }, [registry.assets]);

  const networkIconMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of registry.networks) {
      if (item.iconUrl) {
        if (item._id) map.set(item._id.toLowerCase(), item.iconUrl);
        if (item.name) map.set(item.name.toLowerCase(), item.iconUrl);
        // Also map all aliases
        if (item.aliases) {
          for (const alias of item.aliases) {
            map.set(alias.toLowerCase(), item.iconUrl);
          }
        }
      }
    }
    return map;
  }, [registry.networks]);

  const platformIconMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of registry.platforms) {
      if (item.iconUrl) {
        if (item._id) map.set(item._id.toLowerCase(), item.iconUrl);
        if (item.name) map.set(item.name.toLowerCase(), item.iconUrl);
      }
    }
    return map;
  }, [registry.platforms]);

  const curatorIconMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of registry.curators) {
      if (item.iconUrl) {
        if (item._id) map.set(item._id.toLowerCase(), item.iconUrl);
        if (item.name) map.set(item.name.toLowerCase(), item.iconUrl);
      }
    }
    return map;
  }, [registry.curators]);

  // ─── Resolver functions ─────────────────────────────────────
  const resolveAssetIcon = useCallback((ticker: string): string | null => {
    const key = ticker.toLowerCase().trim();
    // 1. Check dynamic custom icon first
    const custom = assetIconMap.get(key);
    if (custom) return custom;
    // 2. Check substring matches in dynamic registry (e.g. "stUSDC" → "usdc")
    for (const [mapKey, url] of assetIconMap) {
      if (key.includes(mapKey)) return url;
    }
    // 3. Fall back to static build-time icon
    return staticAssetIcon(ticker);
  }, [assetIconMap]);

  const resolveNetworkIcon = useCallback((network: string): string => {
    const key = network.toLowerCase().trim();
    // 1. Check dynamic custom icon first
    const custom = networkIconMap.get(key);
    if (custom) return custom;
    // 2. Substring match
    for (const [mapKey, url] of networkIconMap) {
      if (key.includes(mapKey)) return url;
    }
    // 3. Fall back to static
    return staticNetworkIcon(network);
  }, [networkIconMap]);

  // ─── Network name resolution (dynamic registry → static fallback) ─
  const networkNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of registry.networks) {
      const name = item.name || item._id;
      if (item._id) map.set(item._id.toLowerCase(), name);
      if (item.name) map.set(item.name.toLowerCase(), name);
      if (item.aliases) {
        for (const alias of item.aliases) {
          map.set(alias.toLowerCase(), name);
        }
      }
    }
    return map;
  }, [registry.networks]);

  const resolveNetworkName = useCallback((network: string): string => {
    const key = network.toLowerCase().trim();
    // 1. Exact match in dynamic registry
    const dynamic = networkNameMap.get(key);
    if (dynamic) return dynamic;
    // 2. Substring match in dynamic registry
    for (const [mapKey, name] of networkNameMap) {
      if (key.includes(mapKey)) return name;
    }
    // 3. Static fallback
    return staticNetworkName(network);
  }, [networkNameMap]);

  // ─── Dynamic matchesNetwork (checks dynamic aliases first) ──
  const matchesNetwork = useCallback((productNetwork: string, filterNetwork: string): boolean => {
    if (filterNetwork === 'all') return true;
    const n = productNetwork.toLowerCase();
    // Check dynamic registry for the filter entry
    const entry = registry.networks.find(e =>
      e._id?.toLowerCase() === filterNetwork ||
      e.name?.toLowerCase() === filterNetwork ||
      (e.aliases || []).some((a: string) => a.toLowerCase() === filterNetwork)
    );
    if (entry) {
      const aliases = (entry.aliases || []).map((a: string) => a.toLowerCase());
      if (aliases.some(alias => n.includes(alias))) return true;
      if (n.includes(entry._id?.toLowerCase() || '')) return true;
      if (n.includes(entry.name?.toLowerCase() || '')) return true;
    }
    // Fall back to static
    return staticMatchesNetwork(productNetwork, filterNetwork);
  }, [registry.networks]);

  // ─── Merged network list (dynamic registry + static, deduped) ──
  const getAllNetworks = useCallback((): NetworkOption[] => {
    const seen = new Set<string>();
    const result: NetworkOption[] = [];
    // Dynamic registry entries first
    for (const item of registry.networks) {
      const id = item._id?.toLowerCase() || item.name?.toLowerCase() || '';
      if (!id || seen.has(id)) continue;
      seen.add(id);
      result.push({
        id,
        name: item.name || item._id || id,
        icon: resolveNetworkIcon(id),
      });
    }
    // Then static entries that aren't already present
    for (const sn of STATIC_NETWORKS) {
      if (!seen.has(sn.id)) {
        seen.add(sn.id);
        result.push({ id: sn.id, name: sn.name, icon: sn.icon });
      }
    }
    return result;
  }, [registry.networks, resolveNetworkIcon]);

  const getAllNetworkNames = useCallback((): string[] => {
    return getAllNetworks().map(n => n.name);
  }, [getAllNetworks]);

  const resolvePlatformIcon = useCallback((name: string): PlatformIconInfo => {
    const key = name.toLowerCase().trim();
    const custom = platformIconMap.get(key);
    return {
      url: custom || null,
      initials: getPlatformInitials(name),
      color: getPlatformColor(name),
    };
  }, [platformIconMap]);

  const resolveCuratorIcon = useCallback((name: string): CuratorIconInfo => {
    const key = name.toLowerCase().trim();
    const custom = curatorIconMap.get(key);
    return {
      url: custom || null,
      initials: name ? name[0].toUpperCase() : '?',
    };
  }, [curatorIconMap]);

  const contextValue = useMemo<RegistryContextType>(() => ({
    registry,
    loaded,
    resolveAssetIcon,
    resolveNetworkIcon,
    resolveNetworkName,
    matchesNetwork,
    getAllNetworks,
    getAllNetworkNames,
    resolvePlatformIcon,
    resolveCuratorIcon,
    refreshRegistry: fetchRegistry,
  }), [registry, loaded, resolveAssetIcon, resolveNetworkIcon, resolveNetworkName, matchesNetwork, getAllNetworks, getAllNetworkNames, resolvePlatformIcon, resolveCuratorIcon, fetchRegistry]);

  return (
    <RegistryContext.Provider value={contextValue}>
      {children}
    </RegistryContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────
export const useRegistry = () => useContext(RegistryContext);