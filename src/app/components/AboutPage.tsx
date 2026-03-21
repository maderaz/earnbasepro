import React, { useMemo } from 'react';
import { SEO } from '@/app/components/SEO';
import type { DeFiProduct } from '@/app/utils/types';

const BASE_URL = 'https://earnbase.finance';

const EARNBASE_WEBSITE = {
  '@type': 'WebSite',
  name: 'Earnbase',
  url: BASE_URL,
} as const;

interface AboutPageProps {
  products: DeFiProduct[];
  loading: boolean;
}

export const AboutPage: React.FC<AboutPageProps> = ({ products, loading }) => {
  const counts = useMemo(() => {
    const tickers = new Set<string>();
    const networks = new Set<string>();
    const platforms = new Set<string>();
    for (const p of products) {
      if (!p) continue;
      if (p.ticker) tickers.add(p.ticker.toUpperCase());
      if (p.network) networks.add(p.network.toLowerCase());
      if (p.platform_name) platforms.add(p.platform_name);
    }
    return {
      tickerCount: tickers.size,
      networkCount: networks.size,
      strategyCount: products.length,
      platformCount: platforms.size,
    };
  }, [products]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'About Earnbase',
        description: 'Independent DeFi yield data aggregator tracking on-chain APY across 300+ strategies.',
        url: `${BASE_URL}/about`,
        isPartOf: EARNBASE_WEBSITE,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Earnbase', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/about` },
        ],
      },
    ],
  };

  return (
    <>
      <SEO
        title="About Earnbase | DeFi Yield Data Aggregator"
        description="Earnbase is an independent DeFi yield aggregator. Learn how we track APY across 300+ strategies, our methodology for excluding external incentives, and what makes our data different."
        structuredData={structuredData}
      />

      <div className="max-w-[720px] mx-auto px-5 md:px-6 py-12 sm:py-16">
        {/* H1 */}
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#141414] dark:text-foreground tracking-tight mb-10 sm:mb-12">
          About Earnbase
        </h1>

        {/* Section 1: What Earnbase Does */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-[18px] sm:text-[20px] font-medium text-[#141414] dark:text-foreground mb-4">
            What Earnbase Does
          </h2>
          <div className="space-y-5" style={{ lineHeight: '1.65' }}>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              Earnbase is an independent yield data aggregator for decentralized finance. It tracks yield-generating strategies across DeFi protocols and presents them in a single, comparable format. The goal is straightforward: make it possible to see what different vaults, lending pools, and staking positions actually earn, side by side, with consistent methodology, across assets, networks, and protocols.
            </p>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              {!loading && counts.strategyCount > 0 ? (
                <>Earnbase currently covers {counts.tickerCount} assets across {counts.networkCount} networks, tracking {counts.strategyCount} strategies on {counts.platformCount} platforms. Each strategy is tracked individually with its own APY history, TVL, sustainability score, and market ranking. Data updates daily.</>
              ) : (
                <>Earnbase covers multiple assets across networks and protocols, tracking hundreds of strategies on dozens of platforms. Each strategy is tracked individually with its own APY history, TVL, sustainability score, and market ranking. Data updates daily.</>
              )}
            </p>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              Earnbase does not hold, manage, or custody any funds. It does not execute transactions or interact with user wallets. It is a data layer, a lens for comparing DeFi yield opportunities, not a platform for accessing them.
            </p>
          </div>
        </section>

        {/* Section 2: Methodology */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-[18px] sm:text-[20px] font-medium text-[#141414] dark:text-foreground mb-4">
            Methodology
          </h2>
          <div className="space-y-5" style={{ lineHeight: '1.65' }}>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              Yield data in DeFi is inconsistent. Different protocols calculate APY differently, some include external incentives, others don't, and comparing numbers across platforms often means comparing apples to oranges. Earnbase exists to solve this by applying a single, transparent methodology across every strategy it tracks.
            </p>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              <strong className="font-semibold text-[#141414] dark:text-foreground">APY is derived from on-chain exchange rates.</strong> Every vault and lending position has an exchange rate: the ratio between shares issued to depositors and underlying assets held. As a strategy earns yield, this exchange rate increases. Earnbase samples each strategy's exchange rate daily and annualizes the percentage change to produce APY figures over 24-hour, 7-day, and 30-day windows.
            </p>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              <strong className="font-semibold text-[#141414] dark:text-foreground">External incentives are excluded.</strong> Many DeFi interfaces display yield numbers that include token rewards, points programs, liquidity mining emissions, and referral bonuses. These incentives are temporary: they can change or disappear without notice. Earnbase intentionally strips them out. The APY shown on Earnbase reflects what a strategy earns from its core mechanism: lending interest, staking rewards, or trading fees generated by the vault itself. Nothing else.
            </p>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              <strong className="font-semibold text-[#141414] dark:text-foreground">Sustainability scoring measures consistency.</strong> Each strategy receives a score from 0 to 100 based on how stable its on-chain exchange rate has been over the past 30 days. A score above 90 indicates very consistent returns with low variance. A score below 50 signals significant yield volatility. This score helps distinguish between strategies that reliably produce yield and those where headline APY is driven by temporary spikes.
            </p>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              <strong className="font-semibold text-[#141414] dark:text-foreground">Rankings are relative, not absolute.</strong> Each strategy is ranked against other strategies for the same asset. A USDC vault ranked #3 means there are two USDC strategies currently producing higher on-chain APY, not that the vault is objectively the third best. Rankings shift daily as rates change.
            </p>
          </div>
        </section>

        {/* Section 3: What Earnbase Is Not */}
        <section>
          <h2 className="text-[18px] sm:text-[20px] font-medium text-[#141414] dark:text-foreground mb-4">
            What Earnbase Is Not
          </h2>
          <div className="space-y-5" style={{ lineHeight: '1.65' }}>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              Earnbase is not a financial advisor. Nothing on the site constitutes investment advice, a recommendation, or an endorsement of any protocol, strategy, or asset. DeFi yield strategies carry real risks including smart contract vulnerabilities, oracle failures, liquidation events, collateral devaluation, and curator mismanagement. Higher APY generally correlates with higher risk, and past performance does not predict future results.
            </p>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              Earnbase is not an audit or security assessment service. Tracking a strategy on Earnbase does not imply that its smart contracts have been audited, that its curator is trustworthy, or that its underlying protocol is safe. Depositors should always verify protocol security, understand the specific risks of each strategy, and never deposit more than they can afford to lose.
            </p>
            <p className="text-[13.5px] text-[#09090b] dark:text-foreground/80 font-normal">
              Earnbase is not affiliated with any protocol, curator, or network it tracks. It receives no compensation from listed projects and does not accept payment for inclusion, ranking, or favorable presentation. The data is derived from publicly available on-chain information and is presented as-is.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};