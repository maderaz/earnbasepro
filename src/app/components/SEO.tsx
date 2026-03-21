import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { getProductSlug } from '@/app/utils/slugify';
import { LEGACY_REDIRECTS } from '@/app/legacyRedirects';
import faviconImage from 'figma:asset/8419730ece5e766d6710b2882043dde843ca912e.png';
import ogFallbackImage from 'figma:asset/18a1f3d5b19b2e3aaa9754639c3816ea25177179.png';

const BASE_URL = 'https://earnbase.finance';
const LOGO_URL = `${BASE_URL}/logo.png`;

/**
 * Static OG image — used globally on every page type.
 * The previous dynamic endpoint (Supabase Edge Function /api/og) returned 401
 * for social crawlers, so we replaced it with a single pre-rendered asset.
 */
export const OG_IMAGE_URL: string = ogFallbackImage;

/**
 * @deprecated — kept as no-op stubs so existing call-sites don't break during
 * transition. Every method now returns the same static fallback image.
 */
export const ogImageUrl = {
  hub: (_ticker?: string) => OG_IMAGE_URL,
  network: (_ticker?: string, _network?: string) => OG_IMAGE_URL,
  vault: (_slug?: string) => OG_IMAGE_URL,
  home: () => OG_IMAGE_URL,
};

/** Reusable Organization node — referenced across all @graph blocks */
const EARNBASE_ORG = {
  '@type': 'Organization',
  name: 'Earnbase',
  url: BASE_URL,
  logo: { '@type': 'ImageObject', url: LOGO_URL },
} as const;

/** Reusable WebSite node — referenced via isPartOf on every WebPage */
const EARNBASE_WEBSITE = {
  '@type': 'WebSite',
  name: 'Earnbase',
  url: BASE_URL,
} as const;

// Favicon Setup
/** Initialize favicon links once on app load */
const initializeFavicon = () => {
  // Standard favicon
  let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    favicon.setAttribute('type', 'image/png');
    document.head.appendChild(favicon);
  }
  favicon.setAttribute('href', faviconImage);

  // Apple Touch Icon
  let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
  if (!appleTouchIcon) {
    appleTouchIcon = document.createElement('link');
    appleTouchIcon.setAttribute('rel', 'apple-touch-icon');
    document.head.appendChild(appleTouchIcon);
  }
  appleTouchIcon.setAttribute('href', faviconImage);

  // Theme color for mobile browsers
  let themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!themeColor) {
    themeColor = document.createElement('meta');
    themeColor.setAttribute('name', 'theme-color');
    document.head.appendChild(themeColor);
  }
  themeColor.setAttribute('content', '#3f7359');

  // LLMs.txt discovery link
  let llmsTxt = document.querySelector('link[rel="llms-txt"]') as HTMLLinkElement | null;
  if (!llmsTxt) {
    llmsTxt = document.createElement('link');
    llmsTxt.setAttribute('rel', 'llms-txt');
    document.head.appendChild(llmsTxt);
  }
  llmsTxt.setAttribute('href', 'https://files.earnbase.finance/llms.txt');
};

// SEO Head Component
interface SEOProps {
  title: string;
  description: string;
  /** Single JSON-LD object (typically a @graph block) or array of objects */
  structuredData?: object | object[];
  /** If true, adds <meta name="robots" content="noindex, nofollow"> */
  noindex?: boolean;
  /** OG image URL (dynamic, from og-image endpoint) */
  ogImage?: string;
}

/** SEO Head Component — manages title, meta, OG, JSON-LD, canonical, favicon. */
export const SEO: React.FC<SEOProps> = ({ title, description, structuredData, noindex, ogImage }) => {
  const { pathname } = useLocation();
  /**
   * Canonical URL: if the current pathname is a legacy redirect source,
   * point canonical to the redirect target so Google consolidates signals
   * even when the client-side JS redirect isn't followed.
   */
  const redirectTarget = LEGACY_REDIRECTS[pathname];
  const canonicalUrl = redirectTarget
    ? `${BASE_URL}${redirectTarget}`
    : `${BASE_URL}${pathname === '/' ? '' : pathname}`;

  // ── Favicon (one-time setup) ──────────────────────────────
  useEffect(() => {
    initializeFavicon();
  }, []);

  // ── Document language — always English ─────────────────────
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  // ── Title ──────────────────────────────────────────────────
  useEffect(() => {
    document.title = title;
  }, [title]);

  // ── Meta tags ──────────────────────────────────────────────
  useEffect(() => {
    const tags: Record<string, string> = {
      description,
      'og:title': title,
      'og:description': description,
      'og:type': 'website',
      'og:url': canonicalUrl,
      'og:locale': 'en_US',
      'og:site_name': 'Earnbase',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'content-language': 'en',
    };

    // OG image tags — always use static fallback if no explicit ogImage provided
    const resolvedOgImage = ogImage || OG_IMAGE_URL;
    tags['og:image'] = resolvedOgImage;
    tags['og:image:width'] = '1200';
    tags['og:image:height'] = '630';
    tags['twitter:image'] = resolvedOgImage;

    for (const [key, value] of Object.entries(tags)) {
      const isOg = key.startsWith('og:');
      const attr = isOg ? 'property' : 'name';

      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    }
  }, [title, description, canonicalUrl, ogImage]);

  // ── Canonical ──────────────────────────────────────────────
  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }, [canonicalUrl]);

  // ── Structured Data (JSON-LD) ──────────────────────────────
  useEffect(() => {
    // Clean up previously injected blocks
    const existing = document.querySelectorAll('script[data-seo-ld]');
    existing.forEach(el => el.remove());

    if (!structuredData) return;

    const items = Array.isArray(structuredData) ? structuredData : [structuredData];
    items.forEach((data, idx) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-ld', String(idx));
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    return () => {
      const scripts = document.querySelectorAll('script[data-seo-ld]');
      scripts.forEach(el => el.remove());
    };
  }, [structuredData]);

  // ── Noindex ────────────────────────────────────────────────
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');
  }, [noindex]);

  return null; // Head-only component
};

/** Format APY with 2 decimal places */
const formatAPY = (apy: number): string => apy.toFixed(2) + '%';

/** Format APY as raw number string (no % sign) — for title tags */
const formatAPYRaw = (apy: number): string => apy.toFixed(2);

const TITLE_LIMIT = 60;

/** Build title with brand fallback: if primary > 60 chars, drop " | Earnbase" */
const buildTitle = (primary: string, withoutBrand: string): string => {
  if (primary.length <= TITLE_LIMIT) return primary;
  if (withoutBrand.length <= TITLE_LIMIT) return withoutBrand;
  // Absolute last resort — should never happen with well-formed data
  console.warn(`[SEO] Title exceeds ${TITLE_LIMIT} chars even without brand: "${withoutBrand}"`);
  return withoutBrand;
};

/** Build vault title with cascading fallbacks — APY is the click magnet, drop brand before APY */
const buildVaultTitle = (fullName: string, shortName: string, apyRaw: string | null, slug: string): string => {
  const candidates: string[] = [];

  if (apyRaw) {
    candidates.push(`${fullName} - ${apyRaw}% APY | Earnbase`);   // f1
    candidates.push(`${shortName} - ${apyRaw}% APY | Earnbase`);  // f2
    candidates.push(`${fullName} - ${apyRaw}% APY`);               // f3: drop brand, keep APY
    candidates.push(`${shortName} - ${apyRaw}% APY`);              // f4: shorter name + no brand
  }

  candidates.push(`${fullName} | Earnbase`);                        // f5: no APY fallback
  candidates.push(`${shortName} | Earnbase`);                       // f6: no APY, short name

  const result = candidates.find(t => t.length <= TITLE_LIMIT);
  if (result) return result;

  // Data problem — log and return last candidate
  const last = candidates[candidates.length - 1];
  console.warn(`[SEO] Vault title exceeds ${TITLE_LIMIT} chars (${last.length}): "${last}" — fix product name for slug "${slug}"`);
  return last;
};

const APY_THRESHOLDS: Record<string, number> = {
  USDC: 0.50, USDT: 0.50, EURC: 0.50,
  ETH: 1.00,
  WBTC: 0.25, cbBTC: 0.25,
};
const DEFAULT_APY_THRESHOLD = 0.50;

const shouldShowAPY = (ticker: string, spotAPY: number): boolean =>
  spotAPY >= (APY_THRESHOLDS[ticker.toUpperCase()] ?? DEFAULT_APY_THRESHOLD);

/** Format TVL in compact format */
const formatTVLCompact = (tvl: number): string => {
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(1)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(1)}K`;
  return `$${tvl.toFixed(0)}`;
};

// Minimal product shape for SEO helpers — avoids circular import of DeFiProduct
interface SEOProduct {
  ticker: string;
  network: string;
  platform_name: string;
  product_name: string;
  curator: string;
  spotAPY: number;
  tvl: number;
}

// Page Type 1: Homepage
export const homepageSEO = (tickers?: string[], totalStrategies?: number) => {
  const title = 'Compare DeFi Yields Across Protocols | Earnbase';
  const count = totalStrategies && totalStrategies > 0 ? `${totalStrategies}+` : '300+';
  const description =
    `Track and compare ${count} DeFi yield strategies across USDC, ETH, USDT, and more. On-chain APY data from Morpho, Euler, Aave, and 25+ protocols — updated daily.`;

  const graph: any[] = [
    {
      '@type': 'WebSite',
      name: 'Earnbase',
      url: BASE_URL,
      description,
      publisher: EARNBASE_ORG,
    },
    {
      '@type': 'WebPage',
      name: 'Compare DeFi Yields Across Protocols',
      url: BASE_URL,
      description,
      isPartOf: EARNBASE_WEBSITE,
    },
  ];

  // ItemList — asset hubs for crawler discovery
  if (tickers && tickers.length > 0) {
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

  return {
    title,
    description,
    structuredData: { '@context': 'https://schema.org', '@graph': graph },
  };
};

// Page Type 2: Asset Hub  /{ticker}
export const assetHubSEO = (
  ticker: string,
  count: number,
  topAPY: number,
  networkCount: number,
  topProducts?: SEOProduct[],
  faqItems?: { question: string; answer: string }[]
) => {
  const T = ticker.toUpperCase();
  const pageUrl = `${BASE_URL}/${ticker.toLowerCase()}`;

  // Title: "Compare {N} {T} Yield Strategies | Earnbase" — drop brand if >60
  const title = buildTitle(
    `Compare ${count} ${T} Yield Strategies | Earnbase`,
    `Compare ${count} ${T} Yield Strategies`
  );
  
  // Description: "Earnbase tracks {count}+ {TICKER} yield strategies across {networkCount} networks. Compare on-chain APY rates and TVL — updated daily." (max 150 chars)
  const description = `Earnbase tracks ${count}+ ${T} yield strategies across ${networkCount} network${networkCount === 1 ? '' : 's'}. Compare on-chain APY rates and TVL — updated daily.`;

  const graph: any[] = [
    {
      '@type': 'WebPage',
      name: title.replace(' | Earnbase', ''),
      url: pageUrl,
      description,
      isPartOf: EARNBASE_WEBSITE,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: T },
      ],
    },
  ];

  // ItemList — top 10 vaults for rich snippets / AI Overviews
  if (topProducts && topProducts.length > 0) {
    const items = topProducts.slice(0, 10).map((p, i) => {
      const slug = getProductSlug(p);
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: `${p.product_name} (${p.platform_name})`,
        url: `${BASE_URL}/vault/${slug}`,
      };
    });

    graph.push({
      '@type': 'ItemList',
      name: `Top ${T} DeFi Vaults by APY`,
      numberOfItems: items.length,
      itemListElement: items,
    });
  }

  // FAQPage schema — 6 dynamic questions for AI Overviews
  if (faqItems && faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return {
    title,
    description,
    structuredData: { '@context': 'https://schema.org', '@graph': graph },
  };
};

// Page Type 3: Network Filter  /{ticker}/{network}
export const networkFilterSEO = (
  ticker: string,
  networkName: string,
  count: number,
  topAPY: number,
  topProducts?: SEOProduct[],
  faqSchema?: { question: string; answer: string }[]
) => {
  const T = ticker.toUpperCase();
  const networkSlug = networkName.toLowerCase().replace(/\s+/g, '-');
  const pageUrl = `${BASE_URL}/${ticker.toLowerCase()}/${networkSlug}`;

  // Title: "Compare {N} {T} Yields on {Network} | Earnbase" — drop brand if >60
  const title = buildTitle(
    `Compare ${count} ${T} Yields on ${networkName} | Earnbase`,
    `Compare ${count} ${T} Yields on ${networkName}`
  );

  // Description: "{count} {TICKER} strategies tracked on {Network}. Compare on-chain APY rates, TVL, and yield history side by side on Earnbase." (max 150 chars)
  const description = `${count} ${T} strategies tracked on ${networkName}. Compare on-chain APY rates, TVL, and yield history side by side on Earnbase.`;

  const graph: any[] = [
    {
      '@type': 'WebPage',
      name: title.replace(' | Earnbase', ''),
      url: pageUrl,
      description,
      isPartOf: EARNBASE_WEBSITE,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: T, item: `${BASE_URL}/${ticker.toLowerCase()}` },
        { '@type': 'ListItem', position: 3, name: networkName },
      ],
    },
  ];

  // ItemList — top 10 vaults on this network
  if (topProducts && topProducts.length > 0) {
    const items = topProducts.slice(0, 10).map((p, i) => {
      const slug = getProductSlug(p);
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: `${p.product_name} (${p.platform_name})`,
        url: `${BASE_URL}/vault/${slug}`,
      };
    });

    graph.push({
      '@type': 'ItemList',
      name: `Top ${T} Vaults on ${networkName}`,
      numberOfItems: items.length,
      itemListElement: items,
    });
  }

  // FAQPage schema -- network-specific FAQ
  if (faqSchema && faqSchema.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqSchema.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return {
    title,
    description,
    structuredData: { '@context': 'https://schema.org', '@graph': graph },
  };
};

// Page Type 4: Vault Product  /vault/{slug}
export interface VaultSEOResult {
  title: string;
  description: string;
  /** Call with FAQ items to get the final single @graph block */
  buildStructuredData: (faqItems?: { question: string; answer: string }[]) => object;
}

export const vaultProductSEO = (
  productName: string,
  platform: string,
  ticker: string,
  network: string,
  currentAPY: number,
  tvl: string,
  slug: string,
  curator?: string | null,
  hubCount?: number
): VaultSEOResult => {
  const T = ticker.toUpperCase();
  const networkSlug = network.toLowerCase().replace(/\s+/g, '-');
  const pageUrl = `${BASE_URL}/vault/${slug}`;

  const apy = formatAPY(currentAPY);
  const showAPY = shouldShowAPY(T, currentAPY);
  const hasCurator = curator && curator !== '-' && curator !== '';
  const hc = hubCount || 0;

  const fullName = productName;
  const shortName = fullName.replace(/\s*\(.*?\)\s*/g, '').trim();

  // Title — cascading fallback: APY is the click magnet, drop brand before APY, never truncate with "..."
  const apyRaw = showAPY ? formatAPYRaw(currentAPY) : null;
  const title = buildVaultTitle(fullName, shortName, apyRaw, slug);

  // Description
  let description = '';

  if (showAPY) {
    const base = hasCurator
      ? `${productName} on ${platform} (${curator}): ${apy} on-chain ${T} APY on ${network}.`
      : `${productName} on ${platform}: ${apy} on-chain ${T} APY on ${network}.`;
    const full = `${base} Compare with ${hc}+ ${T} strategies on Earnbase.`;
    const short = `${base} Compare ${hc}+ strategies on Earnbase.`;
    if (full.length <= 155) {
      description = full;
    } else if (short.length <= 155) {
      description = short;
    } else {
      description = base;
    }
  } else {
    const full = `${productName} on ${platform} — ${T} yield strategy on ${network}. Compare with ${hc}+ ${T} strategies on Earnbase.`;
    const short = `${productName} on ${platform} — ${T} yield on ${network}. Compare ${hc}+ strategies on Earnbase.`;
    if (full.length <= 155) {
      description = full;
    } else if (short.length <= 155) {
      description = short;
    } else {
      description = `${productName} on ${platform} — ${T} yield strategy on ${network}.`;
    }
  }

  const buildStructuredData = (faqItems?: { question: string; answer: string }[]): object => {
    // FinancialProduct description: omit APY number when below threshold
    const fpDesc = showAPY
      ? (hasCurator
          ? `${productName} on ${platform}, curated by ${curator}: ${apy} on-chain APY on ${T} (${network}). TVL: ${tvl}. Yield data tracked daily on Earnbase.`
          : `${productName} on ${platform} generates ${apy} on-chain APY on ${T} (${network}). TVL: ${tvl}. Yield data tracked daily on Earnbase.`)
      : (hasCurator
          ? `${productName} on ${platform}, curated by ${curator}: ${T} yield strategy on ${network}. TVL: ${tvl}. Yield data tracked daily on Earnbase.`
          : `${productName} on ${platform}: ${T} yield strategy on ${network}. TVL: ${tvl}. Yield data tracked daily on Earnbase.`);

    const graph: any[] = [
      {
        '@type': 'WebPage',
        name: title.replace(' | Earnbase', ''),
        url: pageUrl,
        description,
        isPartOf: EARNBASE_WEBSITE,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: T, item: `${BASE_URL}/${ticker.toLowerCase()}` },
          {
            '@type': 'ListItem',
            position: 3,
            name: network,
            item: `${BASE_URL}/${ticker.toLowerCase()}/${networkSlug}`,
          },
          { '@type': 'ListItem', position: 4, name: `${productName} (${platform})` },
        ],
      },
      {
        '@type': 'FinancialProduct',
        name: productName,
        description: fpDesc,
        provider: {
          '@type': 'Organization',
          name: platform,
        },
        ...(hasCurator
          ? { broker: { '@type': 'Organization', name: curator } }
          : {}),
        url: pageUrl,
        category: 'DeFi Vault',
        interestRate: {
          '@type': 'QuantitativeValue',
          value: currentAPY.toFixed(2),
          unitText: 'PERCENT',
          name: '24h APY',
        },
        amount: {
          '@type': 'MonetaryAmount',
          currency: T,
          value: tvl,
          name: 'Total Value Locked',
        },
      },
    ];

    if (faqItems && faqItems.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      });
    }

    return { '@context': 'https://schema.org', '@graph': graph };
  };

  return { title, description, buildStructuredData };
};

// Page Type 5: Project Page  /project/{slug}
export const projectPageSEO = (
  projectName: string,
  slug: string,
  strategyCount: number,
  tickerList: string[],
  networkCount: number,
  topProducts?: SEOProduct[],
  faqItems?: { question: string; answer: string }[]
) => {
  const pageUrl = `${BASE_URL}/project/${slug}`;

  // Format ticker list with "and" before the last item
  const tickerStr = tickerList.length > 2
    ? tickerList.slice(0, -1).join(', ') + ', and ' + tickerList[tickerList.length - 1]
    : tickerList.join(' and ');

  // Title: "Compare {N} Yield Strategies on {Project} | Earnbase" — drop brand if >60
  const title = buildTitle(
    `Compare ${strategyCount} Yield Strategies on ${projectName} | Earnbase`,
    `Compare ${strategyCount} Yield Strategies on ${projectName}`
  );

  // Description: "Compare {strategyCount} {Project} yield strategies across {tickerList}. Live APY rates, TVL, sustainability scores, and performance history — updated daily."
  const description = `Compare ${strategyCount} ${projectName} yield strategies across ${tickerStr}. Live APY rates, TVL, sustainability scores, and performance history — updated daily.`;

  const graph: any[] = [
    {
      '@type': 'WebPage',
      name: title.replace(' | Earnbase', ''),
      description,
      url: pageUrl,
      isPartOf: EARNBASE_WEBSITE,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Earnbase', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: `${projectName} Yields`, item: pageUrl },
      ],
    },
  ];

  if (topProducts && topProducts.length > 0) {
    const items = topProducts.slice(0, 10).map((p, i) => {
      const vaultSlug = getProductSlug(p);
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: `${p.product_name} (${p.platform_name})`,
        url: `${BASE_URL}/vault/${vaultSlug}`,
      };
    });
    graph.push({
      '@type': 'ItemList',
      name: `Top ${projectName} Vaults by APY`,
      numberOfItems: items.length,
      itemListElement: items,
    });
  }

  if (faqItems && faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return {
    title,
    description,
    structuredData: { '@context': 'https://schema.org', '@graph': graph },
  };
};

// Page Type 6: Curator Page  /curator/{slug}
export const curatorPageSEO = (
  curatorName: string,
  slug: string,
  strategyCount: number,
  tickerList: string[],
  networkCount: number,
  topProducts?: SEOProduct[],
  faqItems?: { question: string; answer: string }[]
) => {
  const pageUrl = `${BASE_URL}/curator/${slug}`;

  // Format ticker list with "and" before the last item
  const tickerStr = tickerList.length > 2
    ? tickerList.slice(0, -1).join(', ') + ', and ' + tickerList[tickerList.length - 1]
    : tickerList.join(' and ');

  // Title: "Compare {N} Strategies Curated by {Curator} | Earnbase" — drop brand if >60
  const title = buildTitle(
    `Compare ${strategyCount} Strategies Curated by ${curatorName} | Earnbase`,
    `Compare ${strategyCount} Strategies Curated by ${curatorName}`
  );

  // Description
  const description = `Compare ${strategyCount} yield strategies curated by ${curatorName} across ${tickerStr}. Live APY, TVL, and performance data — updated daily on Earnbase.`;

  const graph: any[] = [
    {
      '@type': 'WebPage',
      name: title.replace(' | Earnbase', ''),
      description,
      url: pageUrl,
      isPartOf: EARNBASE_WEBSITE,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Earnbase', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: `${curatorName} Yields`, item: pageUrl },
      ],
    },
  ];

  if (topProducts && topProducts.length > 0) {
    const items = topProducts.slice(0, 10).map((p, i) => {
      const vaultSlug = getProductSlug(p);
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: `${p.product_name} (${p.platform_name})`,
        url: `${BASE_URL}/vault/${vaultSlug}`,
      };
    });
    graph.push({
      '@type': 'ItemList',
      name: `Top ${curatorName} Curated Vaults by APY`,
      numberOfItems: items.length,
      itemListElement: items,
    });
  }

  if (faqItems && faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return {
    title,
    description,
    structuredData: { '@context': 'https://schema.org', '@graph': graph },
  };
};