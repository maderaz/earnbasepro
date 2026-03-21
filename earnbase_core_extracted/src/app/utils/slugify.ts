export const slugify = (str: string | undefined): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generates a vault slug per the Earnbase URL Architecture Spec.
 * Pattern: {ticker}-{productName}-{platform}[-{curator}]-{network}
 * Network is always LAST. Duplicate words are removed globally.
 */
export const generateVaultSlug = (
  ticker: string,
  productName: string,
  platform: string,
  curator?: string | null,
  network?: string | null
): string => {
  const slugifyPart = (text: string): string =>
    text
      .toLowerCase()
      .trim()
      .replace(/\[.*?\]/g, '')       // remove [brackets]
      .replace(/\(.*?\)/g, '')       // remove (parens)
      .replace(/[^a-z0-9]+/g, '-')   // non-alnum → hyphen
      .replace(/-+/g, '-')           // collapse hyphens
      .replace(/^-|-$/g, '');        // trim

  const parts = [
    slugifyPart(ticker),
    slugifyPart(productName),
    slugifyPart(platform),
  ];

  if (curator && curator !== '-' && curator.trim() !== '') {
    parts.push(slugifyPart(curator));
  }

  if (network && network.trim() !== '') {
    parts.push(slugifyPart(network));
  }

  // Join all parts then remove duplicate words
  const allWords = parts.join('-').split('-');
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const word of allWords) {
    if (word && !seen.has(word)) {
      deduped.push(word);
      seen.add(word);
    }
  }

  return deduped.join('-');
};

/**
 * Returns the stable slug for a product.
 * Prefers the frozen `url` from the Index table; falls back to dynamic generation.
 */
export const getProductSlug = (p: {
  url?: string | null;
  ticker: string;
  product_name: string;
  platform_name: string;
  curator?: string | null;
  network?: string | null;
}): string => {
  if (p.url) return p.url;
  const curator = p.curator && p.curator !== '-' ? p.curator : null;
  return generateVaultSlug(p.ticker, p.product_name, p.platform_name, curator, p.network);
};