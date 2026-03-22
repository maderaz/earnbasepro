/**
 * Next.js-safe version of src/app/utils/assets.ts.
 * Identical logic but without figma:asset/* imports that break the bundler.
 */

// ─── Network Registry ───────────────────────────────────────────
interface NetworkEntry {
  name: string;
  aliases: string[];
}

const NETWORK_REGISTRY: NetworkEntry[] = [
  { name: 'Ethereum',  aliases: ['eth', 'mainnet', 'ethereum'] },
  { name: 'Base',      aliases: ['base'] },
  { name: 'Arbitrum',  aliases: ['arbitrum', 'arb'] },
  { name: 'BNB Chain', aliases: ['bnb', 'bsc', 'binance', 'bnb chain'] },
  { name: 'Sonic',     aliases: ['sonic', 'fraxtal'] },
  { name: 'Avalanche', aliases: ['avalanche', 'avax'] },
];

/** All known networks — id/name only (no icons, safe for Next.js) */
export const NETWORKS = NETWORK_REGISTRY.map(e => ({
  id: e.aliases[0],
  name: e.name,
}));

export const matchesNetwork = (productNetwork: string, filterNetwork: string): boolean => {
  if (filterNetwork === 'all') return true;
  const n = productNetwork.toLowerCase();
  const entry = NETWORK_REGISTRY.find(
    e => e.aliases[0] === filterNetwork || e.name.toLowerCase() === filterNetwork
  );
  if (entry) return entry.aliases.some(alias => n.includes(alias));
  return n.includes(filterNetwork.toLowerCase());
};

export const getNetworkName = (network: string): string => {
  const n = network.toLowerCase();
  for (const entry of NETWORK_REGISTRY) {
    if (entry.aliases.some(alias => n.includes(alias))) return entry.name;
  }
  return network;
};
