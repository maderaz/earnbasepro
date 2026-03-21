/**
 * Asset & Network registry for Earnbase.
 */

import ethIcon from "figma:asset/79d89ea38949d0ec4530a587bd1083d16b1a0081.png";
import baseIcon from "figma:asset/6adbd1dac0fd6769119ab375131fa3ae8b6b6f78.png";
import arbitrumIcon from "figma:asset/e7cfce7b072890d842a2cf4185c63a58dca23dd0.png";
import bnbIcon from "figma:asset/6987e1ff6f7155bee46e0c1b5484a87432ba6b32.png";
import sonicIcon from "figma:asset/45500c541b2d75a11c5ee398a9bd1b54927c6e46.png";
import avalancheIcon from "figma:asset/5d16444bf4f3863cfe63b00a5268d0354e078f36.png";

import usdcLogo from "figma:asset/7a5bc425748ef3b216a5ba324f27779277f04522.png";
import usdtLogo from "figma:asset/0ea3cbe932e6c5fb633699cde8f38dc33891673c.png";
import eurcLogo from "figma:asset/98ffff7bddb76292b98afc1919e0e17d3f4a1bc3.png";
import wbtcLogo from "figma:asset/5997f9285efef3cdcc05c89c6f0466c09c4d0b15.png";
import btcLogo from "figma:asset/e9fbb66bb2353520ea2c4e9db68c42260b0da78f.png";

// ─── Asset Registry ─────────────────────────────────────────────
// Key: uppercase ticker (or substring match key)
// To add a new asset: just add one line here.
const ASSET_REGISTRY: Record<string, string> = {
  USDC: usdcLogo,
  USDT: usdtLogo,
  EURC: eurcLogo,
  WBTC: wbtcLogo,
  BTC:  btcLogo,
  ETH:  ethIcon,
};

// Order matters for substring matching (WBTC before BTC, etc.)
const ASSET_MATCH_ORDER = ['USDC', 'USDT', 'EURC', 'WBTC', 'BTC', 'ETH'];

export const getAssetIcon = (ticker: string): string | null => {
  const t = ticker.toUpperCase();
  // Exact match first
  if (ASSET_REGISTRY[t]) return ASSET_REGISTRY[t];
  // Substring match (preserves legacy behavior like "stUSDC" → USDC)
  for (const key of ASSET_MATCH_ORDER) {
    if (t.includes(key)) return ASSET_REGISTRY[key];
  }
  return null;
};

// ─── Network Registry ───────────────────────────────────────────
interface NetworkEntry {
  name: string;
  icon: string;
  aliases: string[];
}

const NETWORK_REGISTRY: NetworkEntry[] = [
  { name: 'Ethereum', icon: ethIcon,       aliases: ['eth', 'mainnet', 'ethereum'] },
  { name: 'Base',     icon: baseIcon,      aliases: ['base'] },
  { name: 'Arbitrum', icon: arbitrumIcon,   aliases: ['arbitrum', 'arb'] },
  { name: 'BNB Chain',icon: bnbIcon,       aliases: ['bnb', 'bsc', 'binance', 'bnb chain'] },
  { name: 'Sonic',    icon: sonicIcon,     aliases: ['sonic', 'fraxtal'] },
  { name: 'Avalanche',icon: avalancheIcon, aliases: ['avalanche', 'avax'] },
];

export const getNetworkIcon = (network: string): string => {
  const n = network.toLowerCase();
  for (const entry of NETWORK_REGISTRY) {
    if (entry.aliases.some(alias => n.includes(alias))) return entry.icon;
  }
  return ethIcon; // Default fallback
};

export const getNetworkName = (network: string): string => {
  const n = network.toLowerCase();
  for (const entry of NETWORK_REGISTRY) {
    if (entry.aliases.some(alias => n.includes(alias))) return entry.name;
  }
  return network;
};

/** All known networks — used by filters in TrackerTable and forms */
export const NETWORKS = NETWORK_REGISTRY.map(e => ({
  id: e.aliases[0],
  name: e.name,
  icon: e.icon,
}));

/** All known network names — used by AddProductPage form dropdown */
export const NETWORK_NAMES = NETWORK_REGISTRY.map(e => e.name);

export const matchesNetwork = (productNetwork: string, filterNetwork: string): boolean => {
  if (filterNetwork === 'all') return true;
  const n = productNetwork.toLowerCase();
  const entry = NETWORK_REGISTRY.find(e =>
    e.aliases[0] === filterNetwork || e.name.toLowerCase() === filterNetwork
  );
  if (entry) {
    return entry.aliases.some(alias => n.includes(alias));
  }
  return n.includes(filterNetwork.toLowerCase());
};

// Re-export for backward compat (can be removed once all refs updated)
export const networkAliases: Record<string, string[]> = Object.fromEntries(
  NETWORK_REGISTRY.map(e => [e.aliases[0], e.aliases])
);

// ─── Platform Color Hashing ─────────────────────────────────
// Deterministic color from platform name so the same platform
// always gets the same icon color across the whole app.
const PLATFORM_COLORS = [
  { bg: 'bg-blue-500/15', text: 'text-blue-600' },
  { bg: 'bg-purple-500/15', text: 'text-purple-600' },
  { bg: 'bg-amber-500/15', text: 'text-amber-600' },
  { bg: 'bg-rose-500/15', text: 'text-rose-600' },
  { bg: 'bg-teal-500/15', text: 'text-teal-600' },
  { bg: 'bg-indigo-500/15', text: 'text-indigo-600' },
  { bg: 'bg-orange-500/15', text: 'text-orange-600' },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-600' },
  { bg: 'bg-emerald-500/15', text: 'text-emerald-600' },
  { bg: 'bg-pink-500/15', text: 'text-pink-600' },
];

export const getPlatformColor = (name: string): { bg: string; text: string } => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLATFORM_COLORS[Math.abs(hash) % PLATFORM_COLORS.length];
};

export const getPlatformInitials = (name: string): string => {
  if (!name) return '?';
  // For short names (≤3 chars), use the first char
  if (name.length <= 3) return name[0].toUpperCase();
  // For multi-word, use initials of first two words
  const words = name.split(/[\s_-]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  // Single word: first two chars
  return name.slice(0, 2).toUpperCase();
};