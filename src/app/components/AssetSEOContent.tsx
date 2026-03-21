import React, { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { slugify, getProductSlug } from '@/app/utils/slugify';
import { matchesNetwork, NETWORKS } from '@/app/utils/assets';
import { formatAPY, formatTVL } from '@/app/utils/formatters';
import type { DeFiProduct } from '@/app/utils/types';
import { ChevronRight, ChevronDown } from 'lucide-react';

// Shared Computed Variables
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

// ── Extra FAQ per ticker (USDC / ETH / USDT) ──────────────────
const TICKER_EXTRA_FAQ: Record<string, Array<{ question: string; answer: string }>> = {
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

// FAQ builder (exported for JSON-LD schema in FilteredCategoryPage)
export function buildAssetHubFaq(v: AssetHubVars) {
  const base = {
    visible: [
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
    ],
    schema: [
      {
        question: `How does Earnbase calculate ${v.T} APY?`,
        answer: `Earnbase derives APY from each vault's on-chain exchange rate. This measures actual vault growth and does not include external reward incentives, points, or token emissions.`,
      },
      {
        question: `What are the risks of high-yield ${v.T} strategies?`,
        answer: `While ${v.T} ${v.riskCtx}, protocols generating yield carry smart contract risk. Higher APYs may indicate newer protocols, lower liquidity, or more aggressive parameters. Each listing includes TVL and a sustainability score.`,
      },
      {
        question: `How many ${v.T} strategies does Earnbase track?`,
        answer: `Earnbase tracks ${v.count} ${v.T} yield strategies across ${v.networkCount} networks from ${v.platformCount} platforms including ${v.topPlatforms}.`,
      },
      {
        question: `What is a good APY for ${v.T}?`,
        answer: `${v.T} APY on Earnbase ranges from under 1% to over ${v.topAPYRounded}%. ${v.apyCtx}`,
      },
      {
        question: `Can I compare ${v.T} yields across different networks?`,
        answer: `Yes. Earnbase tracks ${v.T} strategies on ${v.networkListWithCounts}. Use network filter tabs to compare APY rates per chain.`,
      },
      {
        question: 'Does Earnbase charge fees?',
        answer: 'No. Earnbase is a free yield data aggregator with no fees. Earnbase does not hold or manage funds.',
      },
    ],
  };

  // Append ticker-specific long-tail FAQ items (USDC/ETH/USDT get +4 each)
  const extra = TICKER_EXTRA_FAQ[v.T];
  if (extra) {
    base.visible.push(...extra);
    base.schema.push(...extra);
  }

  return base;
}

// Static Content: "How Earnbase Tracks {TICKER} Yields" — 3 variants: A/B/C
function getMethodologyContent(T: string): string[] {
  const variant = ({ USDC: 'A', USDT: 'A', EURC: 'A', ETH: 'B', WBTC: 'C', CBBTC: 'C' } as Record<string, string>)[T] || 'A';

  if (variant === 'B') {
    return [
      `Earnbase monitors yield by reading each vault's on-chain exchange rate: the ratio between shares issued and ETH (or ETH-derivative) held. As a vault earns interest through staking rewards, restaking returns, or lending income, its exchange rate increases. Earnbase samples this rate daily and annualizes the change to produce an APY figure.`,
      `This method captures the vault's native performance only. It excludes external incentives such as governance token rewards, points programs, restaking points, and referral bonuses that some aggregators fold into their displayed APY. The result is a conservative but verifiable yield figure. For liquid staking tokens like wstETH, weETH, and rsETH, the displayed APY reflects the combined staking and protocol return embedded in the token's exchange rate.`,
      `Each strategy is also assigned a yield sustainability score (0-100) based on how stable the on-chain rate has been over the past 30 days. A score of 90+ indicates consistent returns; a score below 50 suggests significant volatility. This score, along with TVL, APY trend, and capital flow data, is available on each vault's detail page.`,
    ];
  }

  if (variant === 'C') {
    return [
      `Earnbase monitors yield by reading each vault's on-chain exchange rate: the ratio between shares issued and ${T} held. As a vault earns interest through lending, liquidity provision, or other DeFi strategies, its exchange rate increases. Earnbase samples this rate daily and annualizes the change to produce an APY figure.`,
      `This method captures the vault's native performance only. It excludes external incentives such as governance token rewards, points programs, and referral bonuses that some aggregators fold into their displayed APY. The result is a conservative but verifiable yield figure that reflects what a depositor actually earns from the vault's core strategy. ${T} yield strategies typically offer lower APY than stablecoin strategies due to lower borrowing demand for BTC-denominated assets.`,
      `Each strategy is also assigned a yield sustainability score (0-100) based on how stable the on-chain rate has been over the past 30 days. A score of 90+ indicates consistent returns; a score below 50 suggests significant volatility. This score, along with TVL, APY trend, and capital flow data, is available on each vault's detail page.`,
    ];
  }

  // Variant A (stablecoins + default)
  return [
    `Earnbase monitors yield by reading each vault's on-chain exchange rate: the ratio between shares issued and ${T} held. As a vault earns interest, its exchange rate increases. Earnbase samples this rate daily and annualizes the change to produce an APY figure.`,
    `This method captures the vault's native performance only. It excludes external incentives such as governance token rewards, points programs, liquidity mining emissions, and referral bonuses that some aggregators fold into their displayed APY. The result is a conservative but verifiable yield figure that reflects what a depositor actually earns from the vault's core strategy.`,
    `Each strategy is also assigned a yield sustainability score (0-100) based on how stable the on-chain rate has been over the past 30 days. A score of 90+ indicates consistent returns; a score below 50 suggests significant volatility. This score, along with TVL, APY trend, and capital flow data, is available on each vault's detail page.`,
  ];
}

// Static Content: "Understanding {TICKER} Yield Sources" — 6 variants + default
function getYieldSourcesContent(T: string): string[] {
  const variant = ({ USDC: 'A', USDT: 'B', ETH: 'C', WBTC: 'D', CBBTC: 'E', EURC: 'F' } as Record<string, string>)[T];

  if (variant === 'A') return [
    'USDC yield in DeFi comes from several distinct sources, each with a different risk profile.',
    'Lending protocols like Aave and Compound allow depositors to earn interest from borrowers. Rates fluctuate with borrowing demand: when demand is high, rates rise; when it drops, rates fall. These are typically the most liquid and battle-tested strategies.',
    'Curated vaults on platforms like Morpho and Euler add a management layer. A curator selects which markets to allocate USDC deposits to, aiming for higher returns than a single lending pool. Curators like Gauntlet, Steakhouse, and Re7 optimize across multiple positions. These vaults may offer higher APY but introduce curator risk alongside smart contract risk.',
    'Leveraged looping strategies borrow against deposited USDC to re-deposit and earn yield on a larger position. Products labeled "Leveraged Looping" or similar on Earnbase use this approach. While these can produce significantly higher APY, they amplify both gains and losses and carry liquidation risk.',
    'Private credit products provide fixed-rate yields backed by a borrower\'s contractual obligation rather than DeFi market mechanics. These are marked with "Private Credit" on Earnbase. The APY is stable but the primary risk shifts from smart contract risk to counterparty risk: the borrower\'s ability to repay.',
    'Each strategy page on Earnbase shows the yield source type, sustainability score, and historical performance to help you assess which risk-return profile fits your goals.',
  ];

  if (variant === 'B') return [
    'USDT yield in DeFi comes from several distinct sources, each with a different risk profile.',
    'Lending protocols like Aave and Fluid allow depositors to earn interest from borrowers. Rates fluctuate with borrowing demand. These are typically the most liquid strategies available for USDT.',
    'Curated vaults on platforms like Morpho and Euler add a management layer. Curators like Gauntlet, Steakhouse, and B.Protocol optimize USDT allocation across multiple lending markets. These vaults may offer higher APY but introduce curator risk alongside smart contract risk.',
    'Leveraged looping strategies borrow against deposited USDT to amplify yield exposure. While these can produce significantly higher APY, they carry liquidation risk and are more complex than simple lending positions.',
    'Private credit products provide fixed-rate yields backed by a borrower\'s contractual obligation. The APY is stable but the primary risk shifts to counterparty risk.',
    'Each strategy page on Earnbase shows the yield source type, sustainability score, and historical performance to help you assess which risk-return profile fits your goals.',
  ];

  if (variant === 'C') return [
    'ETH yield in DeFi comes from several distinct sources, each with a different risk profile.',
    'Staking and liquid staking generate yield from Ethereum\'s proof-of-stake consensus mechanism. Protocols like Lido (wstETH), EtherFi (weETH), and Kelp (rsETH) issue liquid staking tokens that accrue staking rewards automatically. Baseline staking yield is typically 3-4% APY.',
    'Restaking through protocols like EigenLayer and Renzo allows staked ETH to secure additional networks, earning supplemental yield on top of base staking rewards. Earnbase tracks the combined on-chain return of restaking tokens, not projected future rewards.',
    'Lending protocols like Aave, Fluid, and Compound allow ETH holders to earn interest from borrowers. Rates fluctuate with borrowing demand. These strategies are typically lower-yielding than leveraged positions but carry less complexity.',
    'Curated vaults on platforms like Morpho and Euler add a management layer. Curators like Gauntlet, MEV Capital, and Steakhouse optimize ETH allocation across lending, staking, and other positions.',
    'Leveraged strategies borrow against deposited ETH to amplify exposure. Products using leveraged looping or autopool strategies can produce significantly higher APY but amplify both gains and losses and carry liquidation risk.',
    'Each strategy page on Earnbase shows the yield source type, sustainability score, and historical performance to help you assess which risk-return profile fits your goals.',
  ];

  if (variant === 'D') return [
    'WBTC (Wrapped Bitcoin) is an ERC-20 token backed 1:1 by Bitcoin held in custody, allowing BTC holders to access Ethereum DeFi yields. WBTC yield comes from several sources.',
    'Lending protocols like Aave and Morpho allow WBTC depositors to earn interest from borrowers who use WBTC as collateral or borrow it for short positions. BTC borrowing demand tends to be lower than stablecoin demand, which is reflected in generally lower APYs.',
    'Curated vaults on Morpho and Euler add a management layer, with curators like Gauntlet, MEV Capital, and Re7 optimizing allocation across multiple lending markets.',
    'Leveraged looping strategies borrow against deposited WBTC to amplify yield exposure. While these can produce higher APY, they carry liquidation risk and are more complex than simple lending positions.',
    'Each strategy page on Earnbase shows the yield source type, sustainability score, and historical performance to help you assess which risk-return profile fits your goals.',
  ];

  if (variant === 'E') return [
    'cbBTC (Coinbase Wrapped Bitcoin) is Coinbase\'s wrapped BTC token, providing an alternative to WBTC with Coinbase as the custodian. The cbBTC yield ecosystem is growing, primarily on Base and Ethereum Mainnet.',
    'Lending protocols allow cbBTC depositors to earn interest from borrowers. As a newer wrapped BTC token, cbBTC has growing but still developing DeFi integrations.',
    'Curated vaults on platforms like Morpho and Euler optimize cbBTC deposits across multiple lending markets, managed by curators like Gauntlet, MEV Capital, and Re7.',
    'Private credit products offer fixed-rate yields backed by a borrower\'s contractual obligation, with the primary risk being counterparty risk rather than smart contract risk.',
    'As cbBTC adoption grows, new yield sources and integrations are expected to expand the range of available strategies. Each strategy page on Earnbase shows the yield source type, sustainability score, and historical performance.',
  ];

  if (variant === 'F') return [
    'EURC (Euro Coin) is a euro-denominated stablecoin, offering DeFi yield opportunities denominated in euros rather than US dollars. The EURC yield ecosystem is smaller than USDC or USDT, reflecting the euro stablecoin market\'s earlier stage of development.',
    'Lending protocols like Aave and Moonwell allow EURC depositors to earn interest from borrowers. Rates depend on EURC borrowing demand, which tends to be lower than USD-denominated stablecoins.',
    'Curated vaults on Morpho, managed by curators like Gauntlet and Steakhouse, optimize across available EURC lending markets on Ethereum Mainnet and Base.',
    'As the euro stablecoin ecosystem matures, new yield sources and platforms are expected to expand EURC opportunities. Each strategy page on Earnbase shows the yield source type, sustainability score, and historical performance.',
  ];

  // Default for future tickers
  return [
    `${T} yield in DeFi comes from several sources. Lending protocols allow depositors to earn interest from borrowers. Rates fluctuate with borrowing demand. Curated vaults add a management layer, with curators optimizing allocation across multiple lending markets. Some strategies use leverage to amplify returns, which also amplifies risk. Each strategy page on Earnbase shows the yield source type, sustainability score, and historical performance.`,
  ];
}

// About {Asset} Yields — 3 H3 subsections per ticker, replaces old methodology + landscape + yield sources
interface AboutSubsection { title: string; paragraphs: string[]; }
interface AboutContent { subsections: AboutSubsection[]; statLine: string; }

function getAboutContent(T: string, v: AssetHubVars): AboutContent | null {
  if (T === 'USDC') return {
    subsections: [
      {
        title: 'How USDC Yield Works in DeFi',
        paragraphs: [
          'USDC is a dollar-pegged stablecoin issued by Circle with reserves held in cash and short-term U.S. Treasuries. In DeFi, USDC generates yield primarily through lending, where depositors supply USDC to a protocol, borrowers pay interest on it, and that interest flows back to depositors as yield. Because USDC maintains a stable $1 peg, the APY you see represents real dollar-denominated returns without the price volatility that affects assets like ETH or BTC.',
          `The range of USDC yields across DeFi is wide. Conservative lending on blue-chip protocols like Aave or Compound typically produces lower single-digit APY driven purely by borrowing demand. Curated Morpho vaults managed by firms like Gauntlet or Steakhouse allocate deposits across multiple isolated lending markets, often capturing higher rates by accepting a broader range of collateral. At the upper end, leveraged looping strategies on IPOR Fusion amplify yield by recursively borrowing and re-depositing USDC, which increases returns but also introduces liquidation risk. Earnbase currently tracks ${v.count} USDC strategies spanning this full spectrum.`,
        ],
      },
      {
        title: 'What Drives USDC Rate Differences',
        paragraphs: [
          `USDC rates vary across protocols, networks, and strategies because of three factors: borrowing demand, collateral risk, and strategy complexity. A Morpho vault that lends against blue-chip collateral like wstETH will typically offer lower APY than one that accepts more volatile or newer collateral types. The same vault deployed on Base may produce different yields than on Ethereum Mainnet because borrowing demand and liquidity conditions differ by network. Across the ${v.networkCount} networks tracked on Earnbase, these dynamics produce a meaningful spread.`,
          'Curators play a significant role in USDC yield. On Morpho, curators like Gauntlet, Steakhouse, and Re7 each manage dozens of USDC vaults with different risk profiles. Prime, Core, and Frontier tiers offer progressively higher APY with correspondingly broader collateral exposure. Comparing the same curator\'s Prime vault against their Frontier vault reveals the market price of incremental risk. Across protocols, architectural differences matter too: Euler\'s isolated lending markets, Fluid\'s smart collateral, and Aave\'s pooled model each produce different rate dynamics even when serving the same USDC borrowing demand.',
        ],
      },
      {
        title: 'Comparing USDC Yields on Earnbase',
        paragraphs: [
          'Earnbase tracks USDC strategies across multiple protocols and networks with one important distinction: all APY figures reflect on-chain vault performance only. External incentives like token rewards, points programs, and liquidity mining emissions are excluded. This matters because many DeFi interfaces show inflated APY that includes temporary incentives which can disappear overnight. The rates on Earnbase represent what the vault\'s core strategy actually earns from lending activity.',
          'When comparing USDC yields, the sustainability score helps distinguish between strategies with consistent returns and those with volatile rate swings. A vault showing 12% APY with a sustainability score of 30 tells a different story than one at 8% with a score of 90. TVL is another signal: large deposits in a lending vault compress rates through supply-demand dynamics, so the highest-TVL vaults rarely show the highest APY. Sorting by 30-day APY rather than 24-hour APY gives a more reliable picture, since daily rates can spike temporarily due to liquidation events or sudden borrowing demand.',
        ],
      },
    ],
    statLine: `Earnbase tracks ${v.count} USDC yield strategies across ${v.networkCount} networks and ${v.platformCount} platforms, updated daily.`,
  };

  if (T === 'ETH') return {
    subsections: [
      {
        title: 'Sources of ETH Yield',
        paragraphs: [
          'ETH generates yield through fundamentally different mechanisms than stablecoins. The base layer of ETH yield comes from Ethereum\'s proof-of-stake consensus: validators earn staking rewards for proposing and attesting blocks, currently producing a baseline APY that fluctuates with network activity and the total amount of ETH staked. Liquid staking protocols like Lido (stETH), Coinbase (cbETH), and Rocket Pool (rETH) make these staking rewards accessible without running validator infrastructure, issuing liquid tokens that represent staked ETH plus accumulated rewards.',
          `On top of staking yield, DeFi lending adds a second layer. Protocols like Aave, Morpho, Fluid, and Euler let users deposit ETH (typically as WETH) into lending pools where borrowers pay interest. These borrowers are often leveraged traders or yield farmers who need ETH as collateral or for short positions, and their demand fluctuates with market conditions. During volatile markets, ETH borrowing demand spikes and lending rates rise. During quiet periods, rates compress. This cyclical dynamic means ETH lending APY is inherently less stable than stablecoin lending. Earnbase tracks ${v.count} ETH strategies across ${v.networkCount} networks that span both categories.`,
        ],
      },
      {
        title: 'ETH Yield Strategies Compared',
        paragraphs: [
          'The simplest ETH yield comes from holding a liquid staking token. stETH appreciates against ETH at roughly the staking rate with minimal additional smart contract risk beyond the staking protocol itself. One step up, lending WETH on Aave or Compound earns borrowing interest on plain WETH (which doesn\'t stake), while lending wstETH earns staking rewards plus borrowing interest simultaneously.',
          'Curated vaults add active management to the mix. On Morpho, curators like Gauntlet manage ETH vaults across risk tiers: their WETH Prime vaults stick to blue-chip collateral markets while Ecosystem vaults accept a wider range of assets as collateral. The choice between these tiers reflects a tradeoff between yield and collateral quality that each depositor evaluates differently. On Gearbox, kpk curates leveraged ETH vaults that amplify yield through controlled borrowing. These produce higher APY but carry liquidation risk if market conditions move sharply. IPOR Fusion strategies take a different approach entirely, using leveraged looping of staked ETH derivatives to stack staking yield on top of lending yield.',
        ],
      },
      {
        title: 'Reading ETH Yields on Earnbase',
        paragraphs: [
          'ETH yields on Earnbase require more careful interpretation than stablecoin yields because the underlying asset itself is volatile. A vault showing 5% APY on ETH means 5% more ETH over a year, but the dollar value of that ETH depends entirely on ETH\'s price. This is fundamentally different from USDC where 5% APY means 5% more dollars.',
          'Earnbase excludes external incentives from all displayed APY, which is especially relevant for ETH strategies. Many protocols offer token incentives on ETH deposits (ARB rewards on Arbitrum, OP on Optimism) that temporarily inflate apparent yields. The rates shown here reflect what the strategy earns from its core mechanism: staking rewards, lending interest, or trading fees, without these overlays. For ETH strategies specifically, comparing the 30-day APY against the current Ethereum staking rate gives a useful benchmark. Any vault consistently producing APY significantly above the base staking rate is taking on additional risk through lending, leverage, or collateral exposure that goes beyond vanilla staking.',
        ],
      },
    ],
    statLine: `Earnbase tracks ${v.count} ETH yield strategies across ${v.networkCount} networks and ${v.platformCount} platforms, updated daily.`,
  };

  if (T === 'USDT') return {
    subsections: [
      {
        title: 'USDT Yield in DeFi Lending',
        paragraphs: [
          'USDT is the most widely traded stablecoin by volume, issued by Tether with reserves that include U.S. Treasuries, cash equivalents, and other financial assets. In DeFi lending markets, USDT often commands different interest rates than USDC despite both tracking the dollar. This rate divergence exists because USDT and USDC serve partially different borrower bases. USDT is more heavily used in perpetual futures markets and CeFi-DeFi arbitrage, creating pockets of borrowing demand that don\'t always align with USDC markets.',
          `USDT yield strategies on Earnbase span the same protocol types as USDC: lending pools on Aave and Compound, curated Morpho vaults, IPOR Fusion strategies, and Gearbox leveraged positions, but with generally fewer options. Most DeFi vault curators prioritize USDC as their primary stablecoin asset, which means the USDT curator landscape is thinner. Steakhouse, Gauntlet, and Re7 all manage USDT vaults on Morpho, and B.Protocol curates a flagship USDT vault, but the overall selection is narrower than what exists for USDC. Earnbase currently tracks ${v.count} USDT strategies across ${v.networkCount} networks.`,
        ],
      },
      {
        title: 'USDT vs USDC Rate Dynamics',
        paragraphs: [
          'Comparing USDT and USDC yields side by side reveals structural differences in how each stablecoin is used within DeFi. USDT lending rates on the same protocol can run higher or lower than USDC depending on relative borrowing demand. When USDT trades at a slight premium on centralized exchanges, arbitrageurs borrow USDT in DeFi to sell elsewhere, pushing DeFi lending rates up. When market stress causes USDT to trade at a discount, borrowing demand drops and rates fall faster than USDC.',
          'This dynamic means USDT strategies can occasionally offer a yield premium over equivalent USDC strategies on the same protocol and network. However, this premium reflects a combination of genuine rate differences and the distinct risk profile that USDT carries relative to USDC. Depositors evaluating USDT yields should consider both the headline APY and the sustainability score. USDT rates tend to be more volatile than USDC rates on the same protocol because USDT borrowing demand is more sensitive to market conditions.',
        ],
      },
      {
        title: 'Evaluating USDT Strategies on Earnbase',
        paragraphs: [
          `The USDT strategy set on Earnbase is more concentrated than USDC, which actually simplifies comparison. With fewer curators and ${v.platformCount} platforms offering USDT vaults, the differences between available strategies become clearer. Steakhouse's USDT vaults on Morpho follow the same conservative curation framework as their USDC vaults, while the Smokehouse-branded strategies target higher yields. Gauntlet's USDT Prime vault sits at the conservative end of their risk spectrum. On Yearn and Compound, USDT strategies involve single-protocol lending without curator overlay.`,
          'Because the USDT strategy universe is smaller, individual vault changes have a more visible impact on the available yield range. A new USDT vault launching on Morpho or an existing curator adjusting their USDT allocation can noticeably shift the top-APY picture. Sorting by 30-day APY rather than 24-hour rate smooths out these shifts and provides a more stable comparison basis. The TVL column is particularly informative for USDT: the largest USDT vaults by TVL represent where sophisticated capital is concentrating, which itself is a signal about which strategies institutional depositors consider acceptable.',
        ],
      },
    ],
    statLine: `Earnbase tracks ${v.count} USDT yield strategies across ${v.networkCount} networks and ${v.platformCount} platforms, updated daily.`,
  };

  if (T === 'EURC') return {
    subsections: [
      {
        title: 'Euro-Denominated Yield in DeFi',
        paragraphs: [
          'EURC is a euro-pegged stablecoin issued by Circle, the same company behind USDC. It holds a 1:1 peg to the euro with reserves in euro-denominated cash and equivalents. EURC represents a relatively new asset class in DeFi. While dollar stablecoins dominate lending markets, euro-denominated yield opportunities have expanded significantly as protocols deploy on networks like Base where EURC liquidity has grown.',
          'The fundamental yield mechanic for EURC mirrors USDC: depositors supply EURC to lending protocols, borrowers pay interest, and that interest accrues to depositors. However, EURC borrowing demand comes from different sources than dollar stablecoins. Euro-denominated borrowers include European institutions hedging currency exposure, traders arbitraging EUR/USD rates across DeFi and CeFi, and protocols building euro-native products. This borrower base is smaller but growing, which means EURC rates can be more volatile than USDC as individual large borrowing positions have outsized impact on utilization.',
        ],
      },
      {
        title: 'Where EURC Yield Lives',
        paragraphs: [
          `EURC yield strategies are concentrated on fewer protocols than dollar stablecoins, which reflects the asset's earlier stage of DeFi adoption. Morpho hosts curated EURC vaults managed by Gauntlet and Steakhouse, both on Ethereum Mainnet and Base. Euler offers EURC vaults on Base. Aave provides pooled EURC lending on both Mainnet and Base. Beyond curated vaults, Moonwell offers EURC lending on Base, and ExtraFi and Fluid provide additional Base-native options.`,
          `Base has emerged as the primary network for EURC yield activity. The majority of EURC strategies tracked on Earnbase are deployed on Base, reflecting the network's role as a hub for newer stablecoin ecosystems. Ethereum Mainnet hosts the more established EURC vaults from Gauntlet and Aave, typically with larger TVL and more stable rates. Comparing the same curator's EURC vault across Mainnet and Base reveals how network-level liquidity differences translate into rate differences. Base vaults often show higher APY due to thinner supply relative to borrowing demand.`,
        ],
      },
      {
        title: 'EURC Yields for Euro-Based Investors',
        paragraphs: [
          'For investors whose base currency is the euro, EURC yields eliminate the currency risk inherent in earning dollar-denominated yield on USDC or USDT. A European depositor earning 5% APY on USDC also carries EUR/USD exchange rate exposure. If the dollar weakens against the euro, some or all of that yield can be erased in purchasing power terms. EURC yields, while typically fewer in number and sometimes lower in headline APY, deliver returns denominated in the same currency the depositor spends.',
          `Earnbase tracks EURC strategies with the same methodology applied to all assets: APY reflects on-chain vault performance only, excluding external token incentives. For EURC specifically, this distinction matters because several protocols offer incentive programs to bootstrap euro liquidity. These temporary rewards can make EURC yields appear artificially high on other aggregators. The rates on Earnbase show the sustainable lending yield that remains after incentive programs end, which provides a clearer picture of long-term euro-denominated DeFi returns.`,
        ],
      },
    ],
    statLine: `Earnbase tracks ${v.count} EURC yield strategies across ${v.networkCount} networks and ${v.platformCount} platforms, updated daily.`,
  };

  if (T === 'WBTC') return {
    subsections: [
      {
        title: 'How WBTC Generates Yield',
        paragraphs: [
          'WBTC (Wrapped Bitcoin) is an ERC-20 token backed 1:1 by Bitcoin, custodied by BitGo. It brings Bitcoin\'s value into the Ethereum DeFi ecosystem, allowing BTC holders to earn yield without selling their Bitcoin exposure. Unlike stablecoins where yield represents a dollar return, WBTC yield means accumulating more Bitcoin-denominated value. A 4% APY on WBTC means 4% more WBTC over a year, with the dollar value depending entirely on Bitcoin\'s price.',
          `WBTC yield comes primarily from lending. Borrowers take out WBTC loans on protocols like Aave, Morpho, and Spark to gain short exposure, to use as collateral in other strategies, or to bridge between Bitcoin and DeFi positions. Because WBTC has deep liquidity on Ethereum Mainnet and moderate liquidity on Arbitrum, lending rates reflect borrowing demand across these networks. WBTC lending rates tend to be lower than stablecoin rates because borrowing demand for BTC is structurally smaller. Fewer DeFi strategies require borrowing Bitcoin compared to the constant demand for borrowed stablecoins.`,
        ],
      },
      {
        title: 'WBTC Strategy Landscape',
        paragraphs: [
          `The WBTC yield landscape on Earnbase spans lending pools, curated vaults, and leveraged strategies. On Aave, WBTC lending is straightforward single-protocol exposure with pooled risk. Morpho offers curated WBTC vaults: Gauntlet manages Core and Vault Bridge strategies on Mainnet, Re7 operates a WBTC vault, and MEV Capital curates a Pendle-integrated WBTC strategy. Spark provides a lending market for WBTC with MakerDAO ecosystem integration.`,
          'Beyond vanilla lending, IPOR Fusion hosts leveraged BTC yield strategies curated by Reservoir that use recursive looping to amplify returns. Gearbox offers WBTC lending through leveraged pools. These higher-yield strategies come with leverage risk. During sharp BTC price movements, leveraged WBTC positions can face liquidation, which is a different risk profile than simple lending where the main concern is borrower default against posted collateral.',
          `WBTC strategies are concentrated on Ethereum Mainnet and Arbitrum. Mainnet hosts the largest TVL and most curated options, while Arbitrum provides access through Aave, Dolomite, and Euler. The Mainnet concentration reflects where WBTC liquidity historically lives. Unlike USDC which has spread aggressively across L2s, WBTC DeFi activity remains anchored on Ethereum's base layer.`,
        ],
      },
      {
        title: 'Evaluating WBTC Yields',
        paragraphs: [
          'When comparing WBTC yields, the context differs from stablecoins in an important way. A WBTC vault showing 3% APY during a BTC bull market represents a meaningful return because the underlying asset is already appreciating in dollar terms. The yield compounds on top of price gains. During bear markets, that same 3% APY provides a partial buffer against price declines. This asymmetry means WBTC yield strategies serve a different purpose than stablecoin strategies: they optimize Bitcoin exposure rather than generating dollar income.',
          'Earnbase\'s methodology of excluding external incentives is particularly relevant for WBTC. Several protocols offer token rewards specifically to attract Bitcoin liquidity. These can make headline yields appear double or triple the actual lending rate. The APY shown on Earnbase reflects what WBTC lending markets genuinely earn from borrower interest, providing a baseline for evaluating whether a WBTC yield strategy adds enough return to justify the smart contract risk of deploying Bitcoin into DeFi rather than holding it directly.',
        ],
      },
    ],
    statLine: `Earnbase tracks ${v.count} WBTC yield strategies across ${v.networkCount} networks and ${v.platformCount} platforms, updated daily.`,
  };

  if (T === 'CBBTC') return {
    subsections: [
      {
        title: 'cbBTC and the Base Ecosystem',
        paragraphs: [
          'cbBTC is Coinbase\'s wrapped Bitcoin token, launched as a competitor to WBTC with a distinct custodial model. Coinbase itself holds the underlying Bitcoin rather than the multi-party custody system used by WBTC. cbBTC has found its primary DeFi home on Base, Coinbase\'s L2 network, where it benefits from native integration with the broader Coinbase ecosystem. This Base-first distribution means cbBTC yield opportunities are heavily concentrated on one network, creating a different landscape than WBTC which spans Mainnet and Arbitrum more evenly.',
          `cbBTC generates yield through the same mechanism as WBTC: lending to borrowers who need Bitcoin exposure within DeFi. On Base, cbBTC lending is available across a wide range of protocols: Moonwell, Morpho, Euler, YO, ExtraFi, Arcadia, and others all support cbBTC deposits. This protocol diversity within a single network is notable. Base has become the most competitive environment for cbBTC yield, with multiple protocols and curators competing for the same Bitcoin liquidity.`,
        ],
      },
      {
        title: 'cbBTC vs WBTC Yield Comparison',
        paragraphs: [
          'cbBTC and WBTC represent the same underlying asset, Bitcoin, but their yield profiles diverge because they operate in different liquidity environments. WBTC has deeper Mainnet liquidity and a longer DeFi track record, which generally means more stable rates and higher TVL per vault. cbBTC has stronger Base-native liquidity and benefits from Coinbase integration, which attracts borrowers and lenders who already operate within the Coinbase ecosystem.',
          'In practice, cbBTC yields on Base often exceed WBTC yields on Mainnet for the same protocol type because Base\'s cbBTC supply is thinner relative to demand. A Gauntlet Core vault for cbBTC on Base may show higher APY than the equivalent WBTC Core vault on Mainnet simply because less cbBTC is deposited, pushing utilization and rates higher. However, this higher yield comes with the trade-off of operating on a newer network with a younger liquidity profile. Comparing cbBTC and WBTC side by side on Earnbase reveals these structural differences. The same curator applying the same risk framework to both assets produces different yields because the underlying market dynamics differ.',
        ],
      },
      {
        title: 'Navigating cbBTC Strategies',
        paragraphs: [
          `The cbBTC strategy set on Earnbase is one of the most diverse for any single asset on a single network. On Base alone, cbBTC is available through Morpho curated vaults from Gauntlet, Re7, and MEV Capital; Euler vaults; Moonwell lending; YO core vaults; Arcadia lending pools; ExtraFi; and multiple Harvest and Beefy autocompounders. Mainnet options include Aave lending, Morpho curated vaults, Euler Prime, and Wildcat private credit via Wintermute.`,
          `This density of options means cbBTC depositors face a genuine selection problem. There are enough strategies that simply sorting by highest APY is insufficient. The curator, protocol architecture, and collateral exposure all matter. A Gauntlet Core cbBTC vault on Morpho has a fundamentally different risk profile than a cbBTC autocompounder on Beefy that layers on top of Moonwell, even if both show similar headline APY. The sustainability score and TVL columns help differentiate: larger TVL and higher sustainability scores generally indicate strategies where sophisticated capital has already done due diligence, while smaller, newer vaults may offer higher rates with less proven track records.`,
        ],
      },
    ],
    statLine: `Earnbase tracks ${v.count} cbBTC yield strategies across ${v.networkCount} networks and ${v.platformCount} platforms, updated daily.`,
  };

  return null; // Other tickers keep old sections
}

// Dynamic: Yield Landscape + Network rows
interface YieldLandscape {
  avgAPY: string;
  bestNetworkName: string;
  bestNetworkCount: number;
  bestNetworkAvg: string;
  topTVLPlatformName: string;
  topTVLPlatformVal: string;
  above10: number;
  between5and10: number;
  below5: number;
}

interface NetworkRow {
  networkName: string;
  networkSlug: string;
  count: number;
  avgApy: string;
  totalTvl: string;
  topStratName: string;
  topStratApy: string;
  topStratSlug: string;
}

function computeLandscapeAndNetworks(
  T: string,
  tickerSlug: string,
  products: DeFiProduct[]
): { landscape: YieldLandscape | null; networkRows: NetworkRow[] } {
  const tickerProducts = products.filter(p => p && (p.ticker || '').toUpperCase() === T);
  if (tickerProducts.length === 0) return { landscape: null, networkRows: [] };

  // Group by canonical network
  const netMap = new Map<string, { name: string; products: DeFiProduct[] }>();
  for (const p of tickerProducts) {
    const netId = (p.network || '').toLowerCase();
    const entry = NETWORKS.find(n => matchesNetwork(netId, n.id));
    const name = entry ? entry.name : p.network;
    const key = entry ? entry.id : netId;
    const existing = netMap.get(key);
    if (existing) existing.products.push(p);
    else netMap.set(key, { name, products: [p] });
  }

  // Landscape stats
  const totalAPY = tickerProducts.reduce((s, p) => s + (p.spotAPY || 0), 0);
  const avgAPY = (totalAPY / tickerProducts.length).toFixed(2);

  const networkAvgs = [...netMap.entries()].map(([, v]) => {
    const avg = v.products.reduce((s, p) => s + (p.spotAPY || 0), 0) / v.products.length;
    return { name: v.name, avg: parseFloat(avg.toFixed(2)), count: v.products.length };
  }).sort((a, b) => b.avg - a.avg);
  const best = networkAvgs[0];

  // Platform TVL
  const platformTVL = new Map<string, number>();
  for (const p of tickerProducts) {
    const name = p.platform_name || 'Unknown';
    platformTVL.set(name, (platformTVL.get(name) || 0) + (p.tvl || 0));
  }
  const topTVLEntry = [...platformTVL.entries()].sort(([, a], [, b]) => b - a)[0];

  const above10 = tickerProducts.filter(p => (p.spotAPY || 0) > 10).length;
  const between5and10 = tickerProducts.filter(p => (p.spotAPY || 0) >= 5 && (p.spotAPY || 0) <= 10).length;
  const below5 = tickerProducts.filter(p => (p.spotAPY || 0) < 5).length;

  const landscape: YieldLandscape = {
    avgAPY,
    bestNetworkName: best?.name || '-',
    bestNetworkCount: best?.count || 0,
    bestNetworkAvg: best ? best.avg.toFixed(2) : '0',
    topTVLPlatformName: topTVLEntry ? topTVLEntry[0] : '-',
    topTVLPlatformVal: topTVLEntry ? formatTVL(topTVLEntry[1]) : '$0',
    above10,
    between5and10,
    below5,
  };

  // Network rows sorted by count desc
  const networkRows: NetworkRow[] = [...netMap.entries()]
    .sort(([, a], [, b]) => b.products.length - a.products.length)
    .map(([, v]) => {
      const avg = v.products.reduce((s, p) => s + (p.spotAPY || 0), 0) / v.products.length;
      const totalTvl = v.products.reduce((s, p) => s + (p.tvl || 0), 0);
      const topStrat = [...v.products].sort((a, b) => (b.spotAPY || 0) - (a.spotAPY || 0))[0];
      return {
        networkName: v.name,
        networkSlug: slugify(v.name),
        count: v.products.length,
        avgApy: avg.toFixed(2),
        totalTvl: formatTVL(totalTvl),
        topStratName: topStrat?.product_name || '-',
        topStratApy: topStrat ? formatAPY(topStrat.spotAPY) : '-',
        topStratSlug: topStrat
          ? getProductSlug(topStrat)
          : '',
      };
    });

  return { landscape, networkRows };
}

// FAQ Accordion Item
const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#eff0f4] dark:border-border/30 last:border-b-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-start gap-4 py-3 text-left group" aria-expanded={isOpen}>
        <span className="flex-1 text-[13px] font-medium text-foreground/75 group-hover:text-foreground transition-colors leading-relaxed pr-4">{question}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#a0a0b0] shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="pb-4 text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

// Shared section wrapper
const Section: React.FC<{ children: React.ReactNode; first?: boolean }> = ({ children, first }) => (
  <div className={`px-5 md:px-10 py-6 ${first ? '' : 'border-t border-[#eff0f4] dark:border-border/20'}`}>
    {children}
  </div>
);

const SectionH2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-4">{children}</h2>
);

const Prose: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed">{children}</p>
);

// Main Component
interface AssetSEOContentProps {
  ticker: string;
  products?: DeFiProduct[];
}

export const AssetSEOContent: React.FC<AssetSEOContentProps> = ({ ticker, products = [] }) => {
  const v = useMemo(() => computeAssetHubVars(ticker, products), [ticker, products]);
  const faq = useMemo(() => buildAssetHubFaq(v), [v]);
  const methodologyParas = useMemo(() => getMethodologyContent(v.T), [v.T]);
  const yieldSourceParas = useMemo(() => getYieldSourcesContent(v.T), [v.T]);
  const { landscape, networkRows } = useMemo(
    () => computeLandscapeAndNetworks(v.T, slugify(ticker), products),
    [v.T, ticker, products]
  );

  const topVaults = useMemo(() => {
    return [...products]
      .filter(p => p && (p.ticker || '').toUpperCase() === v.T)
      .sort((a, b) => (b.spotAPY || 0) - (a.spotAPY || 0))
      .slice(0, 5)
      .map(p => ({
        name: p.product_name,
        platform: p.platform_name,
        curator: p.curator && p.curator !== '-' ? p.curator : null,
        apy: p.spotAPY,
        network: p.network,
        slug: getProductSlug(p),
      }));
  }, [products, v.T]);

  const tickerSlug = slugify(ticker);

  const aboutContent = useMemo(() => getAboutContent(v.T, v), [v.T, v]);

  return (
    <div className="mt-12 sm:mt-16 -mx-5 sm:mx-0">
      <div className="bg-white dark:bg-card rounded-t-lg sm:rounded-[10px] border-y sm:border border-[#eff0f4] dark:border-border/20">

        {/* 1. Editorial intro */}
        <div className="px-5 md:px-10 pt-6 md:pt-8 pb-6">
          <div className="space-y-4">
            <Prose>
              Earnbase tracks {v.count} {v.T} yield strategies across {v.networkCount} networks: {v.networkList}. APY data is derived from each vault's on-chain exchange rate and does not include external reward incentives, points, or token emissions. Data updates daily.
            </Prose>
            <Prose>
              Strategies span {v.platformCount} platforms including {v.topPlatforms}. Each listing includes 24h, 7d, and 30d APY, total value locked (TVL), yield sustainability score, and historical performance data. Filter by network or sort by APY to find the strategy that fits your risk profile.
            </Prose>
          </div>
        </div>

        {/* 2. How Earnbase Tracks {TICKER} Yields */}
        {/* 3. {TICKER} Yield Landscape */}
        {/* 4. Understanding {TICKER} Yield Sources */}
        {/* 5. Answer Capsule */}
        {/* For USDC/ETH/USDT: new "About {Asset} Yields" with 3 H3 subsections */}
        {/* For other tickers: legacy sections */}
        {aboutContent ? (
          <Section>
            <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-12">
              {/* Left: About content */}
              <div>
                <SectionH2>About {v.T} Yields</SectionH2>
                {aboutContent.subsections.map((sub, si) => (
                  <div key={si} className={si > 0 ? 'mt-8' : ''}>
                    <h3 className="text-[15px] font-medium text-[#141414] dark:text-foreground mb-3">{sub.title}</h3>
                    <div className="space-y-4" style={{ lineHeight: '1.65' }}>
                      {sub.paragraphs.map((p, pi) => <Prose key={pi}>{p}</Prose>)}
                    </div>
                  </div>
                ))}
                <p className="mt-6 text-[12px] text-[#a0a0b0] dark:text-foreground/40 font-medium">{aboutContent.statLine}</p>
              </div>

              {/* Right: FAQ (sticky on desktop) */}
              <div className="mt-10 lg:mt-0 lg:sticky lg:top-6 lg:self-start">
                <SectionH2>Common Questions</SectionH2>
                <div>
                  {faq.visible.map((item, idx) => (
                    <FaqItem key={idx} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </div>
            </div>
          </Section>
        ) : (
          <>
            <Section>
              <SectionH2>How Earnbase Tracks {v.T} Yields</SectionH2>
              <div className="space-y-4">
                {methodologyParas.map((p, i) => <Prose key={i}>{p}</Prose>)}
              </div>
            </Section>

            {landscape && (
              <Section>
                <SectionH2>{v.T} Yield Landscape</SectionH2>
                <div className="space-y-4">
                  <Prose>
                    Across all {v.count} tracked strategies, the average {v.T} APY is {landscape.avgAPY}%. The highest average yields are on {landscape.bestNetworkName}, where {landscape.bestNetworkCount} strategies average {landscape.bestNetworkAvg}% APY. By total value locked, {landscape.topTVLPlatformName} holds the most {v.T} deposits at {landscape.topTVLPlatformVal}.
                  </Prose>
                  <Prose>
                    Of all tracked strategies, {landscape.above10} currently yield above 10%, {landscape.between5and10} yield between 5-10%, and {landscape.below5} yield below 5%. Use the table below to sort by APY, TVL, or network and compare strategies side by side.
                  </Prose>
                </div>
              </Section>
            )}

            <Section>
              <SectionH2>Understanding {v.T} Yield Sources</SectionH2>
              <div className="space-y-4">
                {yieldSourceParas.map((p, i) => <Prose key={i}>{p}</Prose>)}
              </div>
            </Section>

            {v.count > 0 && (
              <Section>
                <SectionH2>What is the best {v.T} yield right now?</SectionH2>
                <Prose>
                  The highest on-chain {v.T} APY currently tracked on Earnbase is {v.topAPY}, offered by {v.topProductName} on {v.topPlatform} ({v.topNetwork} network). This rate reflects the vault's native exchange rate and excludes external incentives. The top {Math.min(topVaults.length, 3)} {v.T} strategies by APY are listed below.
                </Prose>
              </Section>
            )}
          </>
        )}

        {/* 6. Top Strategies */}
        {topVaults.length > 0 && (
          <Section>
            <h3 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-1">
              Top {v.T} Strategies by APY
            </h3>
            {topVaults.map(vault => (
              <Link
                key={vault.slug}
                to={`/vault/${vault.slug}`}
                className="flex items-center justify-between py-[11px] border-b border-[#eff0f4] dark:border-border/30 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[13px] font-medium text-[#30313e] dark:text-foreground/80 truncate group-hover:text-[#08a671] transition-colors">{vault.name}</span>
                  <span className="text-[13px] font-normal text-[#a0a0b0] shrink-0">{vault.platform}</span>
                  {vault.curator && <span className="text-[13px] font-normal text-[#a0a0b0] shrink-0 hidden sm:inline">· {vault.curator}</span>}
                </div>
                <span className="text-[13px] font-medium text-[#08a671] tabular-nums shrink-0">{formatAPY(vault.apy)}</span>
              </Link>
            ))}
            <div className="pt-3">
              <Link to={`/${tickerSlug}`} className="text-[13px] font-medium text-[#08a671] hover:underline">
                <span className="contents">Browse all {v.T} strategies <ChevronRight className="w-3.5 h-3.5 inline" /></span>
              </Link>
            </div>
          </Section>
        )}

        {/* 7. {TICKER} Yields by Network (comparison table) */}
        {networkRows.length > 0 && (
          <Section>
            <SectionH2>
              {networkRows.length === 1
                ? <span className="contents">{v.T} Yields on {networkRows[0].networkName}</span>
                : <span className="contents">{v.T} Yields by Network</span>
              }
            </SectionH2>
            <Prose>Compare {v.T} yield performance across networks. Average APY and strategy counts update daily.</Prose>
            <div className="mt-4 overflow-x-auto -mx-5 md:-mx-10 px-5 md:px-10">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#eff0f4] dark:border-border/30">
                    <th className="pb-2 text-[11px] font-semibold text-[#a0a0b0] uppercase tracking-wider">Network</th>
                    <th className="pb-2 text-[11px] font-semibold text-[#a0a0b0] uppercase tracking-wider text-right">Strategies</th>
                    <th className="pb-2 text-[11px] font-semibold text-[#a0a0b0] uppercase tracking-wider text-right">Avg APY</th>
                    <th className="pb-2 text-[11px] font-semibold text-[#a0a0b0] uppercase tracking-wider text-right hidden sm:table-cell">Total TVL</th>
                    <th className="pb-2 text-[11px] font-semibold text-[#a0a0b0] uppercase tracking-wider text-right hidden md:table-cell">Top Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {networkRows.map(row => (
                    <tr key={row.networkSlug} className="border-b border-[#eff0f4] dark:border-border/20 last:border-b-0">
                      <td className="py-2.5">
                        <Link
                          to={`/${tickerSlug}/${row.networkSlug}`}
                          className="text-[13px] font-medium text-[#30313e] dark:text-foreground/80 hover:text-[#08a671] transition-colors"
                        >
                          {row.networkName}
                        </Link>
                      </td>
                      <td className="py-2.5 text-[13px] text-[#09090b] dark:text-foreground/80 tabular-nums text-right">{row.count}</td>
                      <td className="py-2.5 text-[13px] font-medium text-[#08a671] tabular-nums text-right">{row.avgApy}%</td>
                      <td className="py-2.5 text-[13px] text-[#09090b] dark:text-foreground/80 tabular-nums text-right hidden sm:table-cell">{row.totalTvl}</td>
                      <td className="py-2.5 text-right hidden md:table-cell">
                        {row.topStratSlug ? (
                          <Link
                            to={`/vault/${row.topStratSlug}`}
                            className="text-[13px] text-[#30313e] dark:text-foreground/80 hover:text-[#08a671] transition-colors"
                          >
                            {row.topStratName} ({row.topStratApy})
                          </Link>
                        ) : (
                          <span className="text-[13px] text-[#a0a0b0]">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* 8. FAQ */}
        {!aboutContent && (
          <Section>
            <SectionH2>Common Questions about {v.T} Yields</SectionH2>
            <div>
              {faq.visible.map((item, idx) => (
                <FaqItem key={idx} question={item.question} answer={item.answer} />
              ))}
            </div>
          </Section>
        )}

        {/* 9. Disclaimer */}
        <Section>
          <Prose>
            This page provides informational data aggregated from on-chain sources and is not financial advice. Yield rates reflect each vault's on-chain exchange rate and update daily. Smart contract risk, liquidity risk, and asset de-peg risk may apply. Always verify data directly with the respective platform before depositing.
          </Prose>
        </Section>

      </div>
    </div>
  );
};