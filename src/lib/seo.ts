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
    },
    {
      '@type': 'WebPage',
      name: 'Compare DeFi Yields Across Protocols',
      url: BASE_URL,
      description,
      isPartOf: EARNBASE_WEBSITE,
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

  return {
    title,
    description,
    structuredData: { '@context': 'https://schema.org', '@graph': graph },
    ogImage: OG_IMAGE_URL,
  };
}
