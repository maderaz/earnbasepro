/**
 * Pure data functions extracted from app/components/AssetSEOContent.tsx.
 * No React hooks — safe to import in Server Components.
 */

import { matchesNetwork, NETWORKS } from '@/lib/assets';
import { formatAPY } from '@/app/utils/formatters';
import type { DeFiProduct } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────

export interface AssetHubVars {
  ticker: string;
  T: string;
  count: number;
  networkCount: number;
  networkList: string;
  networkListWithCounts: string;
  platformCount: number;
  topPlatforms: string;
  topAPY: string;
  topProductName: string;
  topPlatform: string;
  topNetwork: string;
  topAPYRounded: number;
  riskCtx: string;
  apyCtx: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// ── Helpers ───────────────────────────────────────────────────

function formatListWithAnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

const RISK_CONTEXT: Record<string, string> = {
  USDC: 'is a stablecoin pegged to a fiat currency',
  USDT: 'is a stablecoin pegged to a fiat currency',
  EURC: 'is a stablecoin pegged to a fiat currency',
  ETH: 'is a blue-chip crypto asset',
  WBTC: 'is an ERC-20 token backed by Bitcoin held in custody',
  CBBTC: "is Coinbase's wrapped Bitcoin token",
};

const APY_CONTEXT: Record<string, string> = {
  USDC: 'Rates above 8-10% typically involve more complex strategies such as leveraged looping or private credit, which carry additional risk.',
  USDT: 'Rates above 8-10% typically involve more complex strategies such as leveraged looping or private credit, which carry additional risk.',
  EURC: 'Rates above 8-10% typically involve more complex strategies such as leveraged looping or private credit, which carry additional risk.',
  ETH: 'Native staking yields around 3-4% serve as a baseline. Rates above that involve restaking, leveraged strategies, or liquidity provision, each with additional risk.',
  WBTC: 'BTC-denominated yield strategies typically offer lower APY than stablecoin strategies, reflecting the different risk and demand dynamics.',
  CBBTC: 'BTC-denominated yield strategies typically offer lower APY than stablecoin strategies, reflecting the different risk and demand dynamics.',
};

const TICKER_EXTRA_FAQ: Record<string, FaqItem[]> = {
  USDC: [
    {
      question: 'What is the difference between USDC Prime and Frontier vaults?',
      answer: 'Prime vaults lend against blue-chip collateral like wstETH and typically offer lower but more stable APY. Frontier vaults accept a broader range of collateral assets, which increases yield but also introduces more collateral risk. The tier name reflects the curator\'s own risk assessment.',
    },
    {
      question: 'Why do USDC rates differ between Ethereum and Base?',
      answer: 'Borrowing demand and liquidity supply vary by network. Base often has thinner USDC supply relative to demand, pushing rates higher. Ethereum Mainnet has deeper liquidity, which generally compresses rates. The same vault from the same curator can produce different APY on each network.',
    },
    {
      question: 'What does the sustainability score mean for USDC strategies?',
      answer: 'The sustainability score measures how consistent a strategy\'s yield has been over the past 30 days on a scale of 0 to 100. A score above 90 means very stable returns. A score below 50 indicates significant rate volatility. It helps distinguish reliably productive strategies from those with spiking rates.',
    },
    {
      question: 'Are USDC yields on Earnbase inclusive of token rewards?',
      answer: 'No. All APY figures on Earnbase reflect on-chain vault performance only. External incentives like governance token rewards, points programs, and liquidity mining emissions are excluded. This means rates shown here may appear lower than on other aggregators that include temporary incentives.',
    },
  ],
  ETH: [
    {
      question: 'What is the difference between staking yield and lending yield on ETH?',
      answer: 'Staking yield comes from Ethereum\'s proof-of-stake consensus, earned by validators for securing the network. Lending yield comes from borrowers paying interest to use deposited ETH. Some strategies combine both by lending liquid staking tokens like wstETH, earning staking rewards plus borrowing interest simultaneously.',
    },
    {
      question: 'Why is ETH APY shown in ETH terms, not dollars?',
      answer: 'ETH yield strategies produce more ETH, not more dollars. A 5% APY means 5% more ETH over a year. The dollar value of that return depends on ETH\'s price, which can move significantly. This is fundamentally different from stablecoin yields where APY directly represents dollar returns.',
    },
    {
      question: 'Which ETH strategies on Earnbase carry leverage risk?',
      answer: 'Leveraged strategies include IPOR Fusion looping vaults and Gearbox leveraged positions. These amplify yield by recursively borrowing and re-depositing, but they also carry liquidation risk during sharp price movements. Non-leveraged strategies like Aave lending or Morpho curated vaults do not use leverage.',
    },
    {
      question: 'How does ETH borrowing demand affect yield?',
      answer: 'ETH lending rates rise when more traders want to borrow ETH for short positions, leverage, or arbitrage. During volatile markets, borrowing demand spikes and rates increase. During quiet periods, demand drops and rates compress. This makes ETH lending APY inherently more cyclical than stablecoin lending.',
    },
  ],
  USDT: [
    {
      question: 'Why does USDT sometimes offer higher APY than USDC on the same protocol?',
      answer: 'USDT and USDC serve different borrower bases. USDT is more heavily used in perpetual futures and CeFi-DeFi arbitrage, creating demand spikes that push lending rates above USDC. This premium is not guaranteed and reverses when USDT borrowing demand drops.',
    },
    {
      question: 'Are there fewer USDT strategies than USDC on Earnbase?',
      answer: 'Yes. Most DeFi vault curators prioritize USDC as their primary stablecoin, which means fewer curated USDT vaults exist. However, the smaller selection makes comparison simpler, and the strategies that do exist represent where institutional capital has concentrated.',
    },
    {
      question: 'What is the Smokehouse USDT vault?',
      answer: 'Smokehouse is a higher-yield vault variant curated by Steakhouse Financial on Morpho. It accepts a broader range of collateral than Steakhouse\'s standard USDT vault, targeting elevated APY with correspondingly wider risk exposure. The name distinguishes it from Steakhouse\'s more conservative offerings.',
    },
    {
      question: 'Does USDT carry different risks than USDC in DeFi?',
      answer: 'The smart contract and protocol risks are similar, but the stablecoin issuer risk differs. USDT is issued by Tether with reserves that include various financial assets, while USDC is issued by Circle with reserves in cash and short-term U.S. Treasuries. Each depositor evaluates this issuer-level difference according to their own risk tolerance.',
    },
  ],
  EURC: [
    {
      question: 'What is EURC and how is it different from USDC?',
      answer: 'EURC is a euro-pegged stablecoin issued by Circle, the same company behind USDC. While USDC tracks the U.S. dollar, EURC tracks the euro. Yields on EURC are denominated in euros, which eliminates EUR/USD exchange rate exposure for euro-based investors.',
    },
    {
      question: 'Why are most EURC strategies on Base?',
      answer: 'Base has emerged as the primary network for EURC DeFi activity. Multiple protocols including Morpho, Euler, Moonwell, and Fluid support EURC on Base, creating a competitive yield environment. Ethereum Mainnet hosts some EURC vaults with larger TVL but fewer protocol options.',
    },
    {
      question: 'Are EURC yields lower than USDC yields?',
      answer: 'Not necessarily. EURC yields fluctuate based on euro borrowing demand, which comes from different sources than dollar borrowing. Because EURC supply in DeFi is thinner than USDC, individual large positions can move rates significantly in either direction. Some periods show EURC rates above comparable USDC rates.',
    },
    {
      question: 'Does earning EURC yield protect against dollar weakness?',
      answer: 'For euro-based investors, yes. Earning yield in EURC means returns are denominated in euros. A European depositor earning USDC yield also carries EUR/USD exchange rate exposure, meaning dollar depreciation can reduce the purchasing power of their returns. EURC yields avoid this currency mismatch.',
    },
  ],
  WBTC: [
    {
      question: 'Is WBTC yield paid in Bitcoin or dollars?',
      answer: 'WBTC yield is denominated in WBTC, which tracks Bitcoin\'s price. A 4% APY means 4% more WBTC over a year. The dollar value of that return depends entirely on Bitcoin\'s price. During a bull market, the dollar value of WBTC yield is amplified. During a bear market, it can be partially offset by price declines.',
    },
    {
      question: 'Why are WBTC lending rates typically lower than stablecoin rates?',
      answer: 'Borrowing demand for Bitcoin in DeFi is structurally smaller than for stablecoins. Fewer strategies require borrowing BTC compared to the constant demand for borrowed USDC or USDT. Lower borrowing demand means lenders earn less interest. However, WBTC yield compounds on top of Bitcoin\'s own price performance.',
    },
    {
      question: 'What is the difference between WBTC and cbBTC?',
      answer: 'Both are wrapped Bitcoin tokens on Ethereum, but they use different custodians. WBTC is custodied by BitGo through a multi-party system. cbBTC is custodied directly by Coinbase. WBTC has deeper liquidity on Ethereum Mainnet, while cbBTC is more prevalent on Base. Their yields differ because they operate in separate liquidity pools with different borrowing demand.',
    },
    {
      question: 'Can I earn WBTC yield without leverage risk?',
      answer: 'Yes. Standard lending on Aave, Morpho curated vaults, and Spark provides WBTC yield from borrower interest without any leverage. Leveraged strategies like IPOR Fusion looping vaults amplify returns but carry liquidation risk. The strategy description on each vault page indicates whether leverage is involved.',
    },
  ],
  CBBTC: [
    {
      question: 'Why does cbBTC have so many strategies on Base?',
      answer: 'cbBTC is Coinbase\'s wrapped Bitcoin token and was designed with Base as its primary DeFi network. Multiple protocols on Base including Morpho, Euler, Moonwell, YO, ExtraFi, and Arcadia all support cbBTC, creating one of the most competitive yield environments for any single asset on a single network.',
    },
    {
      question: 'How do cbBTC yields compare to WBTC yields?',
      answer: 'cbBTC yields on Base often exceed WBTC yields on Mainnet for equivalent strategy types because cbBTC supply is thinner relative to borrowing demand. The same curator applying the same risk framework to both assets typically produces higher cbBTC APY due to these supply-demand differences. However, WBTC strategies on Mainnet benefit from deeper liquidity and longer track records.',
    },
    {
      question: 'Is cbBTC safe to use in DeFi?',
      answer: 'cbBTC carries the same categories of risk as any DeFi asset: smart contract risk from the protocols it is deposited into, oracle risk, and custodian risk from Coinbase holding the underlying Bitcoin. Earnbase does not audit or endorse any protocol. Each depositor should evaluate these risks independently before participating.',
    },
    {
      question: 'What is a cbBTC autocompounder?',
      answer: 'An autocompounder automatically reinvests earned yield back into the same strategy, compounding returns without manual action. On Earnbase, cbBTC autocompounders from Harvest and Beefy layer on top of underlying lending protocols like Moonwell or Arcadia. The APY shown already reflects the compounding effect.',
    },
  ],
};

// ── Core Functions ─────────────────────────────────────────────

export function computeAssetHubVars(ticker: string, products: DeFiProduct[]): AssetHubVars {
  const T = ticker.toUpperCase();
  const tickerProducts = products.filter(p => p && (p.ticker || '').toUpperCase() === T);
  const count = tickerProducts.length;

  const netCounts = new Map<string, { name: string; count: number }>();
  for (const p of tickerProducts) {
    const netId = (p.network || '').toLowerCase();
    const entry = NETWORKS.find(n => matchesNetwork(netId, n.id));
    const name = entry ? entry.name : p.network;
    const key = entry ? entry.id : netId;
    const existing = netCounts.get(key);
    if (existing) existing.count++;
    else netCounts.set(key, { name, count: 1 });
  }
  const networksSorted = [...netCounts.values()].sort((a, b) => b.count - a.count);
  const networkCount = networksSorted.length;
  const networkList = formatListWithAnd(networksSorted.map(n => n.name));
  const networkListWithCounts = formatListWithAnd(
    networksSorted.map((n, i) => i === 0 ? `${n.name} (${n.count} strategies)` : `${n.name} (${n.count})`)
  );

  const platformCounts = new Map<string, number>();
  for (const p of tickerProducts) {
    const name = p.platform_name || 'Unknown';
    platformCounts.set(name, (platformCounts.get(name) || 0) + 1);
  }
  const platformCount = platformCounts.size;
  const topPlatformEntries = [...platformCounts.entries()].sort(([, a], [, b]) => b - a).slice(0, 3);
  const topPlatforms = formatListWithAnd(topPlatformEntries.map(([name, c]) => `${name} (${c})`));

  const sorted = [...tickerProducts].sort((a, b) => (b.spotAPY || 0) - (a.spotAPY || 0));
  const top = sorted[0];
  const topAPY = top ? formatAPY(top.spotAPY) : '-';
  const topProductName = top ? top.product_name : '-';
  const topPlatform = top ? top.platform_name : '-';
  const topNetwork = top ? top.network : '-';
  const topAPYRounded = top ? Math.floor(top.spotAPY || 0) : 0;

  const riskCtx = RISK_CONTEXT[T] || 'is a digital asset';
  const apyCtx = APY_CONTEXT[T] || 'Higher rates typically involve more complex strategies which carry additional risk.';

  return {
    ticker, T, count, networkCount, networkList, networkListWithCounts,
    platformCount, topPlatforms, topAPY, topProductName, topPlatform,
    topNetwork, topAPYRounded, riskCtx, apyCtx,
  };
}

export function buildAssetHubFaq(v: AssetHubVars): FaqItem[] {
  const base: FaqItem[] = [
    {
      question: `How does Earnbase calculate ${v.T} APY?`,
      answer: `Earnbase derives APY from each vault's on-chain exchange rate. This measures the actual growth of deposited ${v.T} over time, based on the vault's smart contract data. Unlike some aggregators, Earnbase does not include external reward incentives, points programs, or token emissions in the displayed APY. The rates shown reflect native vault performance only.`,
    },
    {
      question: `What are the risks of high-yield ${v.T} strategies?`,
      answer: `While ${v.T} ${v.riskCtx}, the protocols generating yield carry smart contract risk. Higher APYs may indicate newer protocols, lower liquidity, or more aggressive lending parameters. Each listing on Earnbase includes TVL and a yield sustainability score to help assess risk. Always verify directly with the protocol before depositing.`,
    },
    {
      question: `How many ${v.T} strategies does Earnbase track?`,
      answer: `Earnbase currently tracks ${v.count} ${v.T} yield strategies across ${v.networkCount} networks from ${v.platformCount} platforms. The largest coverage is on ${v.topPlatforms}. New strategies are added as they meet inclusion criteria.`,
    },
    {
      question: `What is a good APY for ${v.T}?`,
      answer: `${v.T} APY varies significantly across platforms and networks. On Earnbase, tracked strategies range from under 1% to over ${v.topAPYRounded}%. ${v.apyCtx} The average APY across all tracked ${v.T} strategies provides a useful benchmark, shown on each vault's detail page.`,
    },
    {
      question: `Can I compare ${v.T} yields across different networks?`,
      answer: `Yes. Earnbase tracks ${v.T} strategies on ${v.networkListWithCounts}. Use the network filter tabs above the table to compare APY rates on a specific chain. Each network has different gas costs, bridge requirements, and liquidity depth.`,
    },
    {
      question: 'Does Earnbase charge fees?',
      answer: 'No. Earnbase is a free yield data aggregator. There are no fees for using the tracker or accessing yield data. Earnbase does not hold or manage funds. Links to individual vaults direct you to the protocol\'s own interface where you can deposit or withdraw.',
    },
  ];

  const extra = TICKER_EXTRA_FAQ[v.T];
  if (extra) base.push(...extra);

  return base;
}
