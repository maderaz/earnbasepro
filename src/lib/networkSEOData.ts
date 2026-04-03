/**
 * Pure data functions extracted from app/components/NetworkSEOContent.tsx.
 * No React hooks — safe to import in Server Components.
 */

import { matchesNetwork } from '@/lib/assets';
import { formatAPY } from '@/app/utils/formatters';
import type { DeFiProduct } from '@/lib/api';

export interface FaqItem {
  question: string;
  answer: string;
  linkText?: string;
  linkHref?: string;
  linkSuffix?: string;
}

// ── Helpers ───────────────────────────────────────────────────

function formatListWithAnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

export const NETWORK_CONTEXT: Record<string, string> = {
  ethereum: 'is the largest DeFi ecosystem by total value locked, with deep protocol diversity and established lending markets',
  base: "is Coinbase's Layer 2 with low gas costs and a rapidly growing DeFi ecosystem",
  arbitrum: 'is an Ethereum Layer 2 with mature DeFi liquidity and lower gas costs than Mainnet',
  avalanche: 'is a high-throughput Layer 1 with low fees and a mix of native and cross-chain protocols',
  bnb: 'is a high-throughput EVM-compatible network with low fees and established DeFi protocols',
  sonic: 'is a newer network with emerging DeFi opportunities and growing protocol deployments',
};

export const NETWORK_RISK_NOTE: Record<string, string> = {
  ethereum: 'Ethereum Mainnet protocols tend to have longer track records and deeper audits, but higher gas costs can reduce net returns on smaller positions.',
  base: "As a Layer 2, Base inherits Ethereum's security, but some protocols on Base are newer and may have shorter audit histories.",
  arbitrum: "Arbitrum inherits Ethereum's security as a Layer 2. Protocols range from established cross-chain deployments to newer native projects.",
  avalanche: 'Avalanche protocols include both battle-tested cross-chain deployments and native projects with varying audit histories.',
  bnb: 'BNB Chain protocols range from established platforms like Venus to newer deployments with varying audit coverage.',
  sonic: 'As a newer network, Sonic protocols tend to have shorter track records. Higher APYs may reflect early-stage liquidity dynamics and carry additional risk.',
};

export const NETWORK_YIELD_EXPLAINERS: Record<string, (T: string) => [string, string]> = {
  ethereum: (T: string) => [
    `Ethereum Mainnet is the largest DeFi ecosystem by total value locked. ${T} yield strategies on Ethereum benefit from deep liquidity, established protocols, and the widest selection of lending markets and curated vaults. Gas costs on Mainnet are higher than on L2 networks, which means strategies with smaller deposits may see a larger share of returns consumed by transaction fees.`,
    `Most ${T} strategies on Ethereum use protocols like Morpho, Euler, and Aave, which have extensive audit histories. Curated vaults managed by firms like Gauntlet and Steakhouse optimize allocation across multiple lending markets to target higher returns.`,
  ],
  base: (T: string) => [
    `Base is Coinbase's Layer 2 network built on the OP Stack. It offers significantly lower gas costs than Ethereum Mainnet while inheriting Ethereum's security through its rollup architecture. ${T} strategies on Base benefit from growing DeFi adoption and an expanding protocol ecosystem.`,
    `Yield sources on Base include lending protocols, curated vaults on Morpho, and autocompounder strategies from Harvest and Yearn. Lower transaction costs make Base particularly attractive for smaller depositors and strategies that involve frequent rebalancing.`,
  ],
  arbitrum: (T: string) => [
    `Arbitrum is an Ethereum Layer 2 using optimistic rollup technology. It offers lower gas costs and faster transaction times than Ethereum Mainnet while inheriting its security. Arbitrum has a mature DeFi ecosystem with significant TVL across lending and vault protocols.`,
    `${T} strategies on Arbitrum span lending markets on Morpho and Euler, along with specialized vault strategies. The network's established liquidity depth and protocol diversity make it a competitive environment for yield generation.`,
  ],
  avalanche: (T: string) => [
    `Avalanche is a high-throughput Layer 1 blockchain with low transaction fees. Its DeFi ecosystem includes both native protocols like Benqi and cross-chain deployments of major platforms like Euler and Aave.`,
    `${T} yield strategies on Avalanche tend to be fewer in number compared to Ethereum or Base, but benefit from lower gas costs and, in some cases, unique yield opportunities from protocols native to the Avalanche ecosystem.`,
  ],
  bnb: (T: string) => [
    `BNB Chain (formerly Binance Smart Chain) is a high-throughput EVM-compatible network with low transaction fees. Its DeFi ecosystem includes established protocols like Venus alongside cross-chain deployments of Euler and Kinza.`,
    `${T} yield strategies on BNB Chain benefit from low gas costs and strong retail adoption. The network's protocol ecosystem is smaller than Ethereum's but offers competitive rates, particularly for stablecoin lending.`,
  ],
  sonic: (T: string) => [
    `Sonic is a newer DeFi network with a growing ecosystem. ${T} yield strategies on Sonic are still developing, with early protocol deployments from Silo, Beefy, and Euler providing initial yield opportunities.`,
    `As a newer network, Sonic strategies may offer higher APYs reflecting the early-stage liquidity dynamics, but with fewer battle-tested protocols compared to established networks like Ethereum and Base.`,
  ],
};

export function resolveNetworkKey(network: string): string {
  const n = network.toLowerCase();
  if (n.includes('mainnet') || n.includes('ethereum') || n.includes('eth')) return 'ethereum';
  if (n.includes('base')) return 'base';
  if (n.includes('arbitrum') || n.includes('arb')) return 'arbitrum';
  if (n.includes('avalanche') || n.includes('avax')) return 'avalanche';
  if (n.includes('bnb') || n.includes('bsc') || n.includes('binance')) return 'bnb';
  if (n.includes('sonic')) return 'sonic';
  return n;
}

export function getNetworkYieldExplainer(T: string, networkKey: string, networkName: string): [string, string] {
  const fn = NETWORK_YIELD_EXPLAINERS[networkKey];
  if (fn) return fn(T);
  return [
    `${networkName} is a blockchain network with DeFi yield opportunities. ${T} strategies on ${networkName} include lending, curated vaults, and other yield-generating protocols tracked by Earnbase.`,
    `Each strategy listed on Earnbase includes on-chain APY data, TVL, and historical performance to help compare yield opportunities on ${networkName}.`,
  ];
}

export interface NetworkSEOVars {
  count: number;
  platformCount: number;
  topPlatforms: string;
  topAPY: string;
  topProductName: string;
  topPlatform: string;
  hubCount: number;
  hubNetworkCount: number;
  networkContext: string;
  networkRiskNote: string;
}

export function computeNetworkSEOVars(
  ticker: string,
  network: string,
  networkKey: string,
  products: DeFiProduct[]
): NetworkSEOVars {
  const T = ticker.toUpperCase();
  const filtered = products.filter(
    p => p && (p.ticker || '').toUpperCase() === T && matchesNetwork(p.network, network)
  );

  const platformCounts = new Map<string, number>();
  for (const p of filtered) {
    const name = p.platform_name || 'Unknown';
    platformCounts.set(name, (platformCounts.get(name) || 0) + 1);
  }
  const platformCount = platformCounts.size;
  const topPlatforms = formatListWithAnd(
    [...platformCounts.entries()].sort(([, a], [, b]) => b - a).slice(0, 3).map(([name, c]) => `${name} (${c})`)
  );

  const sorted = [...filtered].sort((a, b) => (b.spotAPY || 0) - (a.spotAPY || 0));
  const top = sorted[0];

  const hubProducts = products.filter(p => p && (p.ticker || '').toUpperCase() === T);
  const hubNetworkCount = new Set(hubProducts.map(p => (p.network || '').toLowerCase())).size;

  return {
    count: filtered.length,
    platformCount,
    topPlatforms,
    topAPY: top ? formatAPY(top.spotAPY) : '-',
    topProductName: top ? top.product_name : '-',
    topPlatform: top ? top.platform_name : '-',
    hubCount: hubProducts.length,
    hubNetworkCount,
    networkContext: NETWORK_CONTEXT[networkKey] || 'offers DeFi yield opportunities tracked by Earnbase',
    networkRiskNote: NETWORK_RISK_NOTE[networkKey] || 'Protocol risk varies — always check audit history and TVL depth before depositing.',
  };
}

export function buildNetworkFaq(
  T: string,
  networkName: string,
  tickerSlug: string,
  vars: NetworkSEOVars
): FaqItem[] {
  return [
    {
      question: `How does Earnbase calculate ${T} APY on ${networkName}?`,
      answer: `Earnbase derives APY from each vault's on-chain exchange rate on the ${networkName} network. This measures the actual growth of deposited ${T} over time, based on the vault's smart contract data. The rates shown do not include external reward incentives, points programs, or token emissions — only native vault performance.`,
    },
    {
      question: `How many ${T} strategies are on ${networkName}?`,
      answer: `Earnbase currently tracks ${vars.count} ${T} yield strategies on ${networkName} from ${vars.platformCount} platforms. The largest coverage is on ${vars.topPlatforms}. For ${T} strategies on other networks, see the full ${T} yield tracker at /${tickerSlug}, which covers ${vars.hubCount} strategies across ${vars.hubNetworkCount} networks.`,
    },
    {
      question: `What are the risks of ${T} yields on ${networkName}?`,
      answer: `${T} yield strategies on ${networkName} carry smart contract risk from the underlying protocols. ${vars.networkRiskNote} Each listing on Earnbase includes TVL and a yield sustainability score to help assess risk. Always verify directly with the protocol before depositing.`,
    },
    {
      question: `How does ${T} yield on ${networkName} compare to other networks?`,
      answer: `${T} yield varies across networks due to differences in liquidity, borrowing demand, and protocol maturity. Earnbase tracks ${T} on ${vars.hubNetworkCount} networks total. Use the parent ${T} yield tracker at /${tickerSlug} to compare average APY and strategy count across all supported networks.`,
    },
    {
      question: 'Does Earnbase charge fees?',
      answer: 'No. Earnbase is a free yield data aggregator. There are no fees for using the tracker or accessing yield data. Earnbase does not hold or manage funds.',
    },
  ];
}
