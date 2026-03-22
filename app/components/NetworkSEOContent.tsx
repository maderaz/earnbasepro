'use client';
/**
 * NetworkSEOContent — Port of src/app/components/NetworkSEOContent.tsx
 * Renders SEO content sections for /[ticker]/[network] pages.
 */
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { matchesNetwork } from '@/app/utils/assets';
import { formatAPY } from '@/app/utils/formatters';
import { slugify, getProductSlug } from '@/app/utils/slugify';
import type { DeFiProduct } from '@/lib/api';
import { ChevronRight, ChevronDown } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────

function formatListWithAnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

const NETWORK_CONTEXT: Record<string, string> = {
  ethereum: 'is the largest DeFi ecosystem by total value locked, with deep protocol diversity and established lending markets',
  base: "is Coinbase's Layer 2 with low gas costs and a rapidly growing DeFi ecosystem",
  arbitrum: 'is an Ethereum Layer 2 with mature DeFi liquidity and lower gas costs than Mainnet',
  avalanche: 'is a high-throughput Layer 1 with low fees and a mix of native and cross-chain protocols',
  bnb: 'is a high-throughput EVM-compatible network with low fees and established DeFi protocols',
  sonic: 'is a newer network with emerging DeFi opportunities and growing protocol deployments',
};

const NETWORK_RISK_NOTE: Record<string, string> = {
  ethereum: 'Ethereum Mainnet protocols tend to have longer track records and deeper audits, but higher gas costs can reduce net returns on smaller positions.',
  base: "As a Layer 2, Base inherits Ethereum's security, but some protocols on Base are newer and may have shorter audit histories.",
  arbitrum: "Arbitrum inherits Ethereum's security as a Layer 2. Protocols range from established cross-chain deployments to newer native projects.",
  avalanche: 'Avalanche protocols include both battle-tested cross-chain deployments and native projects with varying audit histories.',
  bnb: 'BNB Chain protocols range from established platforms like Venus to newer deployments with varying audit coverage.',
  sonic: 'As a newer network, Sonic protocols tend to have shorter track records. Higher APYs may reflect early-stage liquidity dynamics and carry additional risk.',
};

function resolveNetworkKey(network: string): string {
  const n = network.toLowerCase();
  if (n.includes('mainnet') || n.includes('ethereum') || n.includes('eth')) return 'ethereum';
  if (n.includes('base')) return 'base';
  if (n.includes('arbitrum') || n.includes('arb')) return 'arbitrum';
  if (n.includes('avalanche') || n.includes('avax')) return 'avalanche';
  if (n.includes('bnb') || n.includes('bsc') || n.includes('binance')) return 'bnb';
  if (n.includes('sonic')) return 'sonic';
  return n;
}

const NETWORK_YIELD_EXPLAINERS: Record<string, (T: string) => string[]> = {
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

function getNetworkYieldContent(T: string, networkKey: string, networkName: string): [string, string] {
  const fn = NETWORK_YIELD_EXPLAINERS[networkKey];
  if (fn) {
    const paras = fn(T);
    return [paras[0] || '', paras[1] || ''];
  }
  return [
    `${networkName} is a blockchain network with DeFi yield opportunities. ${T} strategies on ${networkName} include lending, curated vaults, and other yield-generating protocols tracked by Earnbase.`,
    `Each strategy listed on Earnbase includes on-chain APY data, TVL, and historical performance to help compare yield opportunities on ${networkName}.`,
  ];
}

// ── UI Primitives ─────────────────────────────────────────────

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

interface FaqItemProps {
  question: string;
  answer: string;
  linkText?: string;
  linkHref?: string;
  linkSuffix?: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, linkText, linkHref, linkSuffix }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#eff0f4] dark:border-border/30 last:border-b-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-start gap-4 py-3 text-left group" aria-expanded={isOpen}>
        <span className="flex-1 text-[13px] font-medium text-foreground/75 group-hover:text-foreground transition-colors leading-relaxed pr-4">{question}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#a0a0b0] shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="pb-4 text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed">
          {answer}
          {linkText && linkHref && (
            <span className="contents">
              <Link href={linkHref} className="text-[#08a671] hover:underline">{linkText}</Link>{linkSuffix || ''}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────

interface Props {
  ticker: string;
  network: string;
  networkName: string;
  products: DeFiProduct[];
}

export const NetworkSEOContent: React.FC<Props> = ({ ticker, network, networkName, products }) => {
  const T = ticker.toUpperCase();
  const networkKey = resolveNetworkKey(network);
  const tickerSlug = slugify(ticker);

  const filtered = useMemo(
    () => products.filter(p => p && (p.ticker || '').toUpperCase() === T && matchesNetwork(p.network, network)),
    [products, T, network],
  );

  const vars = useMemo(() => {
    const platformCounts = new Map<string, number>();
    for (const p of filtered) {
      const name = p.platform_name || 'Unknown';
      platformCounts.set(name, (platformCounts.get(name) || 0) + 1);
    }
    const platformCount = platformCounts.size;
    const topPlatforms = formatListWithAnd(
      [...platformCounts.entries()].sort(([, a], [, b]) => b - a).slice(0, 3).map(([name, c]) => `${name} (${c})`),
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
  }, [filtered, products, T, networkKey]);

  const [yieldPara1, yieldPara2] = useMemo(
    () => getNetworkYieldContent(T, networkKey, networkName),
    [T, networkKey, networkName],
  );

  const topVaults = useMemo(
    () => filtered.sort((a, b) => (b.spotAPY || 0) - (a.spotAPY || 0)).slice(0, 3).map(p => ({
      name: p.product_name,
      platform: p.platform_name,
      curator: p.curator && p.curator !== '-' ? p.curator : null,
      apy: p.spotAPY,
      slug: getProductSlug(p),
    })),
    [filtered],
  );

  const faq = useMemo(() => {
    const v = { T, networkName, networkKey, tickerSlug, ...vars };
    return [
      {
        question: `How does Earnbase calculate ${T} APY on ${networkName}?`,
        answer: `Earnbase derives APY from each vault's on-chain exchange rate on the ${networkName} network. This measures the actual growth of deposited ${T} over time, based on the vault's smart contract data. The rates shown do not include external reward incentives, points programs, or token emissions — only native vault performance.`,
      },
      {
        question: `How many ${T} strategies are on ${networkName}?`,
        answer: `Earnbase currently tracks ${vars.count} ${T} yield strategies on ${networkName} from ${vars.platformCount} platforms. The largest coverage is on ${vars.topPlatforms}. For ${T} strategies on other networks, see the `,
        linkText: `full ${T} yield tracker`,
        linkHref: `/${tickerSlug}`,
        linkSuffix: ` which covers ${vars.hubCount} strategies across ${vars.hubNetworkCount} networks.`,
      },
      {
        question: `What are the risks of ${T} yields on ${networkName}?`,
        answer: `${T} yield strategies on ${networkName} carry smart contract risk from the underlying protocols. ${vars.networkRiskNote} Each listing on Earnbase includes TVL and a yield sustainability score to help assess risk. Always verify directly with the protocol before depositing.`,
      },
      {
        question: `How does ${T} yield on ${networkName} compare to other networks?`,
        answer: `${T} yield varies across networks due to differences in liquidity, borrowing demand, and protocol maturity. Earnbase tracks ${T} on ${vars.hubNetworkCount} networks total. Use the parent `,
        linkText: `${T} yield tracker`,
        linkHref: `/${tickerSlug}`,
        linkSuffix: ` to compare average APY and strategy count across all supported networks.`,
      },
      {
        question: 'Does Earnbase charge fees?',
        answer: 'No. Earnbase is a free yield data aggregator. There are no fees for using the tracker or accessing yield data. Earnbase does not hold or manage funds.',
      },
    ];
  }, [T, networkName, tickerSlug, vars]);

  if (vars.count === 0) return null;

  return (
    <div className="mt-12 sm:mt-16">
      <div className="bg-white dark:bg-card sm:rounded-[10px] border-y sm:border border-[#eff0f4] dark:border-border/20">

        {/* Intro */}
        <div className="px-5 md:px-10 pt-6 md:pt-8 pb-6">
          <div className="space-y-4">
            <Prose>
              Earnbase tracks {vars.count} {T} yield strategies on {networkName} across {vars.platformCount} platform{vars.platformCount === 1 ? '' : 's'} including {vars.topPlatforms}. APY data is derived from each vault&apos;s on-chain exchange rate and does not include external reward incentives, points, or token emissions. Data updates daily.
            </Prose>
            <Prose>
              {networkName} {vars.networkContext}. Each listing includes 24h, 7d, and 30d APY, total value locked (TVL), yield sustainability score, and historical performance. Looking for {T} yields on other networks?{' '}
              <Link href={`/${tickerSlug}`} className="text-[#08a671] hover:underline">
                Earnbase tracks {vars.hubCount} {T} strategies across {vars.hubNetworkCount} networks total
              </Link>.
            </Prose>
          </div>
        </div>

        {/* How yields work */}
        <Section>
          <SectionH2>How {T} Yields Work on {networkName}</SectionH2>
          <div className="space-y-4">
            <Prose>{yieldPara1}</Prose>
            <Prose>{yieldPara2}</Prose>
          </div>
        </Section>

        {/* Best yield answer */}
        <Section>
          <SectionH2>What is the best {T} yield on {networkName} right now?</SectionH2>
          <Prose>
            The highest on-chain {T} APY on {networkName} currently tracked on Earnbase is {vars.topAPY}, offered by {vars.topProductName} on {vars.topPlatform}. This rate reflects the vault&apos;s native exchange rate and excludes external incentives. The top {T} strategies on {networkName} by APY are listed below.
          </Prose>
        </Section>

        {/* Top strategies */}
        {topVaults.length > 0 && (
          <Section>
            <h3 className="text-[17px] font-medium text-[#141414] dark:text-foreground mb-1">
              Top {T} Strategies on {networkName} by APY
            </h3>
            {topVaults.map(vault => (
              <Link
                key={vault.slug}
                href={`/vault/${vault.slug}`}
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
              <Link href={`/${tickerSlug}/${slugify(network)}`} className="text-[13px] font-medium text-[#08a671] hover:underline">
                View all {T} strategies on {networkName} <ChevronRight className="w-3.5 h-3.5 inline" />
              </Link>
            </div>
          </Section>
        )}

        {/* FAQ */}
        <Section>
          <SectionH2>Common Questions about {T} Yields on {networkName}</SectionH2>
          <div>
            {faq.map((item, idx) => (
              <FaqItem
                key={idx}
                question={item.question}
                answer={item.answer}
                linkText={(item as any).linkText}
                linkHref={(item as any).linkHref}
                linkSuffix={(item as any).linkSuffix}
              />
            ))}
          </div>
        </Section>

        {/* Disclaimer */}
        <Section>
          <Prose>
            This page provides informational data aggregated from on-chain sources and is not financial advice. Yield rates reflect each vault&apos;s on-chain exchange rate and update daily. Smart contract risk, liquidity risk, and asset de-peg risk may apply. Always verify data directly with the respective platform before depositing.
          </Prose>
        </Section>

      </div>
    </div>
  );
};
