/**
 * SEO utilities for Next.js generateMetadata().
 * Mirrors the logic from the original SEO.tsx but returns plain objects
 * instead of manipulating the DOM.
 */

export const BASE_URL = 'https://earnbase.finance';
const LOGO_URL = `${BASE_URL}/logo.png`;
const OG_IMAGE_URL = `${BASE_URL}/og-image.png`;

const TITLE_LIMIT = 60;

export const EARNBASE_ORG = {
  '@type': 'Organization',
  name: 'Earnbase',
  url: BASE_URL,
  logo: { '@type': 'ImageObject', url: LOGO_URL },
} as const;

export const EARNBASE_WEBSITE = {
  '@type': 'WebSite',
  name: 'Earnbase',
  url: BASE_URL,
} as const;

/** Build title with brand fallback: if primary > 60 chars, drop " | Earnbase" */
export function buildTitle(primary: string, withoutBrand: string): string {
  if (primary.length <= TITLE_LIMIT) return primary;
  if (withoutBrand.length <= TITLE_LIMIT) return withoutBrand;
  return withoutBrand;
}

// Minimal product shape for SEO
export interface SEOProduct {
  ticker: string;
  network: string;
  platform_name: string;
  product_name: string;
  curator: string;
  spotAPY: number;
  tvl: number;
  url?: string;
}

const formatAPY = (apy: number): string => apy.toFixed(2) + '%';
const formatAPYRaw = (apy: number): string => apy.toFixed(2);

const APY_THRESHOLDS: Record<string, number> = {
  USDC: 0.50, USDT: 0.50, EURC: 0.50,
  ETH: 1.00, WBTC: 0.25, CBBTC: 0.25,
};

const shouldShowAPY = (ticker: string, spotAPY: number): boolean =>
  spotAPY >= (APY_THRESHOLDS[ticker.toUpperCase()] ?? 0.50);

function buildVaultTitle(fullName: string, shortName: string, apyRaw: string | null, slug: string): string {
  const candidates: string[] = [];
  if (apyRaw) {
    candidates.push(`${fullName} - ${apyRaw}% APY | Earnbase`);
    candidates.push(`${shortName} - ${apyRaw}% APY | Earnbase`);
    candidates.push(`${fullName} - ${apyRaw}% APY`);
    candidates.push(`${shortName} - ${apyRaw}% APY`);
  }
  candidates.push(`${fullName} | Earnbase`);
  candidates.push(`${shortName} | Earnbase`);
  return candidates.find(t => t.length <= TITLE_LIMIT) || candidates[candidates.length - 1];
}

export function formatTVLCompact(tvl: number): string {
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(1)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(1)}K`;
  return `$${tvl.toFixed(0)}`;
}

export function getProductSlug(p: { url?: string | null; ticker: string; product_name: string; platform_name: string; curator?: string | null; network?: string | null }): string {
  if (p.url) return p.url;
  const slugifyPart = (text: string) => text.toLowerCase().trim().replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const parts = [slugifyPart(p.ticker), slugifyPart(p.product_name), slugifyPart(p.platform_name)];
  if (p.curator && p.curator !== '-' && p.curator.trim() !== '') parts.push(slugifyPart(p.curator));
  if (p.network && p.network.trim() !== '') parts.push(slugifyPart(p.network));
  const allWords = parts.join('-').split('-');
  const seen = new Set<string>();
  return allWords.filter(w => w && !seen.has(w) && seen.add(w)).join('-');
}

/** Homepage SEO metadata */
export function homepageSEO(tickers: string[], totalStrategies: number) {
  const title = 'Compare DeFi Yields Across Protocols | Earnbase';
  const count = totalStrategies > 0 ? `${totalStrategies}+` : '300+';
  const description = `Track and compare ${count} DeFi yield strategies across USDC, ETH, USDT, and more. On-chain APY data from Morpho, Euler, Aave, and 25+ protocols — updated daily.`;

  const graph: any[] = [
    {
      '@type': 'WebSite',
      name: 'Earnbase',
      url: BASE_URL,
      description,
      publisher: EARNBASE_ORG,
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      name: 'Compare DeFi Yields Across Protocols',
      url: BASE_URL,
      description,
      isPartOf: EARNBASE_WEBSITE,
      dateModified: new Date().toISOString(),
    },
  ];

  if (tickers.length > 0) {
    graph.push({
      '@type': 'ItemList',
      name: 'DeFi Assets on Earnbase',
      numberOfItems: tickers.length,
      itemListElement: tickers.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `Best ${t.toUpperCase()} Yields`,
        url: `${BASE_URL}/${t.toLowerCase()}`,
      })),
    });
  }

  graph.push({
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Earnbase?',
        acceptedAnswer: { '@type': 'Answer', text: 'Earnbase is an independent DeFi yield aggregator that tracks and compares on-chain APY for yield strategies across USDC, ETH, USDT, EURC, WBTC, and cbBTC. It covers 300+ strategies across Ethereum, Base, Arbitrum, BNB Chain, and other networks — sourced from protocols including Morpho, Euler, Aave, IPOR Fusion, Yearn, and Fluid. Earnbase does not hold user funds or execute trades.' },
      },
      {
        '@type': 'Question',
        name: 'How is APY calculated on Earnbase?',
        acceptedAnswer: { '@type': 'Answer', text: 'Earnbase samples the exchange rate of each vault or lending position daily and annualises the change to produce APY figures over 24-hour and 30-day windows. External incentives, token rewards, points programmes, and liquidity mining bonuses are excluded. The displayed APY reflects only what the vault earns from its core on-chain mechanism.' },
      },
      {
        '@type': 'Question',
        name: 'Which DeFi protocols does Earnbase track?',
        acceptedAnswer: { '@type': 'Answer', text: 'Earnbase tracks yield strategies from Morpho, Euler, Aave, IPOR Fusion, Yearn, Fluid, Harvest, Lagoon, Wildcat, and 25+ other protocols. New protocols are added as they gain liquidity and verifiable on-chain exchange rate data.' },
      },
    ],
  });

  return {
    title,
    description,
    structuredData: { '@context': 'https://schema.org', '@graph': graph },
    ogImage: OG_IMAGE_URL,
  };
}

/** Asset Hub SEO — /{ticker} */
export function assetHubSEO(
  ticker: string, count: number, networkCount: number,
  topProducts?: SEOProduct[], faqItems?: { question: string; answer: string }[]
) {
  const T = ticker.toUpperCase();
  const pageUrl = `${BASE_URL}/${ticker.toLowerCase()}`;
  const title = buildTitle(`Compare ${count} ${T} Yield Strategies | Earnbase`, `Compare ${count} ${T} Yield Strategies`);
  const description = `Earnbase tracks ${count}+ ${T} yield strategies across ${networkCount} network${networkCount === 1 ? '' : 's'}. Compare on-chain APY rates and TVL — updated daily.`;

  const graph: any[] = [
    { '@type': 'WebPage', name: title.replace(' | Earnbase', ''), url: pageUrl, description, isPartOf: EARNBASE_WEBSITE, dateModified: new Date().toISOString() },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: T },
    ]},
  ];

  if (topProducts && topProducts.length > 0) {
    graph.push({ '@type': 'ItemList', name: `Top ${T} DeFi Vaults by APY`, numberOfItems: Math.min(topProducts.length, 10),
      itemListElement: topProducts.slice(0, 10).map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        name: `${p.product_name} (${p.platform_name})`,
        url: `${BASE_URL}/vault/${getProductSlug(p)}`,
      })),
    });
  }

  if (faqItems && faqItems.length > 0) {
    graph.push({ '@type': 'FAQPage', mainEntity: faqItems.map(item => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    }))});
  }

  return { title, description, structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}

/** Network Filter SEO — /{ticker}/{network} */
export function networkFilterSEO(
  ticker: string, networkName: string, count: number,
  topProducts?: SEOProduct[], faqItems?: { question: string; answer: string }[]
) {
  const T = ticker.toUpperCase();
  const networkSlug = networkName.toLowerCase().replace(/\s+/g, '-');
  const pageUrl = `${BASE_URL}/${ticker.toLowerCase()}/${networkSlug}`;
  const title = buildTitle(`Compare ${count} ${T} Yields on ${networkName} | Earnbase`, `Compare ${count} ${T} Yields on ${networkName}`);
  const description = `${count} ${T} strategies tracked on ${networkName}. Compare on-chain APY rates, TVL, and yield history side by side on Earnbase.`;

  const graph: any[] = [
    { '@type': 'WebPage', name: title.replace(' | Earnbase', ''), url: pageUrl, description, isPartOf: EARNBASE_WEBSITE, dateModified: new Date().toISOString() },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: T, item: `${BASE_URL}/${ticker.toLowerCase()}` },
      { '@type': 'ListItem', position: 3, name: networkName },
    ]},
  ];

  if (topProducts && topProducts.length > 0) {
    graph.push({ '@type': 'ItemList', name: `Top ${T} Vaults on ${networkName}`, numberOfItems: Math.min(topProducts.length, 10),
      itemListElement: topProducts.slice(0, 10).map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        name: `${p.product_name} (${p.platform_name})`,
        url: `${BASE_URL}/vault/${getProductSlug(p)}`,
      })),
    });
  }

  if (faqItems && faqItems.length > 0) {
    graph.push({ '@type': 'FAQPage', mainEntity: faqItems.map(item => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    }))});
  }

  return { title, description, structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}

/** Vault Product SEO — /vault/{slug} */
export function vaultProductSEO(
  productName: string, platform: string, ticker: string, network: string,
  currentAPY: number, tvl: number, slug: string, curator?: string | null, hubCount?: number,
  faqItems?: { question: string; answer: string }[]
) {
  const T = ticker.toUpperCase();
  const networkSlug = network.toLowerCase().replace(/\s+/g, '-');
  const pageUrl = `${BASE_URL}/vault/${slug}`;
  const showAPY = shouldShowAPY(T, currentAPY);
  const hasCurator = curator && curator !== '-' && curator !== '';
  const fullName = productName;
  const shortName = fullName.replace(/\s*\(.*?\)\s*/g, '').trim();
  const apyRaw = showAPY ? formatAPYRaw(currentAPY) : null;
  const title = buildVaultTitle(fullName, shortName, apyRaw, slug);
  const apy = formatAPY(currentAPY);
  const tvlStr = formatTVLCompact(tvl);
  const hc = hubCount || 0;

  let description = '';
  if (showAPY) {
    const base = hasCurator
      ? `${productName} on ${platform} (${curator}): ${apy} on-chain ${T} APY on ${network}.`
      : `${productName} on ${platform}: ${apy} on-chain ${T} APY on ${network}.`;
    const full = `${base} Compare with ${hc}+ ${T} strategies on Earnbase.`;
    description = full.length <= 155 ? full : base;
  } else {
    const full = `${productName} on ${platform} — ${T} yield strategy on ${network}. Compare with ${hc}+ ${T} strategies on Earnbase.`;
    description = full.length <= 155 ? full : `${productName} on ${platform} — ${T} yield strategy on ${network}.`;
  }

  const graph: any[] = [
    { '@type': 'WebPage', name: title.replace(' | Earnbase', ''), url: pageUrl, description, isPartOf: EARNBASE_WEBSITE, dateModified: new Date().toISOString() },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: T, item: `${BASE_URL}/${ticker.toLowerCase()}` },
      { '@type': 'ListItem', position: 3, name: network, item: `${BASE_URL}/${ticker.toLowerCase()}/${networkSlug}` },
      { '@type': 'ListItem', position: 4, name: `${productName} (${platform})` },
    ]},
    {
      '@type': 'FinancialProduct', name: productName, url: pageUrl, dateModified: new Date().toISOString(),
      description: showAPY
        ? `${productName} on ${platform} generates ${apy} on-chain APY on ${T} (${network}). TVL: ${tvlStr}. Yield data tracked daily on Earnbase.`
        : `${productName} on ${platform}: ${T} yield strategy on ${network}. TVL: ${tvlStr}. Yield data tracked daily on Earnbase.`,
      provider: { '@type': 'Organization', name: platform },
      ...(hasCurator ? { broker: { '@type': 'Organization', name: curator! } } : {}),
      category: 'DeFi Vault',
      interestRate: { '@type': 'QuantitativeValue', value: currentAPY.toFixed(2), unitText: 'PERCENT', name: '24h APY' },
      amount: { '@type': 'MonetaryAmount', currency: T, value: tvlStr, name: 'Total Value Locked' },
    },
  ];

  if (faqItems && faqItems.length > 0) {
    graph.push({ '@type': 'FAQPage', mainEntity: faqItems.map(item => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    }))});
  }

  return { title, description, structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}

/** Project Page SEO — /project/{slug} */
export function projectPageSEO(
  projectName: string, slug: string, strategyCount: number,
  tickerList: string[], topProducts?: SEOProduct[],
  faqItems?: { question: string; answer: string }[]
) {
  const pageUrl = `${BASE_URL}/project/${slug}`;
  const tickerStr = tickerList.length > 2
    ? tickerList.slice(0, -1).join(', ') + ', and ' + tickerList[tickerList.length - 1]
    : tickerList.join(' and ');
  const title = buildTitle(`Compare ${strategyCount} Yield Strategies on ${projectName} | Earnbase`, `Compare ${strategyCount} Yield Strategies on ${projectName}`);
  const description = `Compare ${strategyCount} ${projectName} yield strategies across ${tickerStr}. Live APY rates, TVL, sustainability scores, and performance history — updated daily.`;

  const graph: any[] = [
    { '@type': 'WebPage', name: title.replace(' | Earnbase', ''), description, url: pageUrl, isPartOf: EARNBASE_WEBSITE, dateModified: new Date().toISOString() },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Earnbase', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: `${projectName} Yields`, item: pageUrl },
    ]},
  ];

  if (topProducts && topProducts.length > 0) {
    graph.push({ '@type': 'ItemList', name: `Top ${projectName} Vaults by APY`, numberOfItems: Math.min(topProducts.length, 10),
      itemListElement: topProducts.slice(0, 10).map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        name: `${p.product_name} (${p.platform_name})`,
        url: `${BASE_URL}/vault/${getProductSlug(p)}`,
      })),
    });
  }

  if (faqItems && faqItems.length > 0) {
    graph.push({ '@type': 'FAQPage', mainEntity: faqItems.map(item => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    }))});
  }

  return { title, description, structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}

/** Curator Page SEO — /curator/{slug} */
export function curatorPageSEO(
  curatorName: string, slug: string, strategyCount: number,
  tickerList: string[], topProducts?: SEOProduct[],
  faqItems?: { question: string; answer: string }[]
) {
  const pageUrl = `${BASE_URL}/curator/${slug}`;
  const tickerStr = tickerList.length > 2
    ? tickerList.slice(0, -1).join(', ') + ', and ' + tickerList[tickerList.length - 1]
    : tickerList.join(' and ');
  const title = buildTitle(`Compare ${strategyCount} Strategies Curated by ${curatorName} | Earnbase`, `Compare ${strategyCount} Strategies Curated by ${curatorName}`);
  const description = `Compare ${strategyCount} yield strategies curated by ${curatorName} across ${tickerStr}. Live APY, TVL, and performance data — updated daily on Earnbase.`;

  const graph: any[] = [
    { '@type': 'WebPage', name: title.replace(' | Earnbase', ''), description, url: pageUrl, isPartOf: EARNBASE_WEBSITE, dateModified: new Date().toISOString() },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Earnbase', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: `${curatorName} Yields`, item: pageUrl },
    ]},
  ];

  if (topProducts && topProducts.length > 0) {
    graph.push({ '@type': 'ItemList', name: `Top ${curatorName} Curated Vaults by APY`, numberOfItems: Math.min(topProducts.length, 10),
      itemListElement: topProducts.slice(0, 10).map((p, i) => ({
        '@type': 'ListItem', position: i + 1,
        name: `${p.product_name} (${p.platform_name})`,
        url: `${BASE_URL}/vault/${getProductSlug(p)}`,
      })),
    });
  }

  if (faqItems && faqItems.length > 0) {
    graph.push({ '@type': 'FAQPage', mainEntity: faqItems.map(item => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    }))});
  }

  return { title, description, structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}

/** About Page SEO */
export function aboutPageSEO(totalStrategies: number) {
  const title = 'About Earnbase | DeFi Yield Data Aggregator';
  const description = `Earnbase tracks ${totalStrategies}+ DeFi yield strategies. On-chain APY data only — no token incentives, no points. Independent yield comparison across protocols.`;
  const pageUrl = `${BASE_URL}/about`;

  const graph: any[] = [
    { '@type': 'WebPage', name: 'About Earnbase', url: pageUrl, description, isPartOf: EARNBASE_WEBSITE, dateModified: new Date().toISOString() },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'About' },
    ]},
  ];

  return { title, description, structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}
