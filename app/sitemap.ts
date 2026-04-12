import type { MetadataRoute } from 'next';
import { fetchPools } from '@/lib/api';
import { BASE_URL, getProductSlug } from '@/lib/seo';
import { VALID_TICKERS } from '@/lib/constants';

function nameToSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function networkToSlug(network: string): string {
  const n = network.toLowerCase().replace(/\s+/g, '-');
  // Pure "Mainnet" products → /ticker/mainnet (matchNetwork: 'mainnet' === 'mainnet')
  // "Ethereum Mainnet" and "Ethereum" products → /ticker/ethereum (matchNetwork: startsWith)
  if (n === 'mainnet') return 'mainnet';
  if (n.includes('mainnet') || n === 'ethereum') return 'ethereum';
  if (n.includes('base')) return 'base';
  if (n.includes('arbitrum')) return 'arbitrum';
  if (n.includes('avalanche') || n.includes('avax')) return 'avalanche';
  if (n.includes('bnb') || n.includes('bsc') || n.includes('binance')) return 'bnb';
  if (n.includes('sonic')) return 'sonic';
  return n;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const assetHubUrls: MetadataRoute.Sitemap = VALID_TICKERS.map(ticker => ({
    url: `${BASE_URL}/${ticker}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  let products: Awaited<ReturnType<typeof fetchPools>>['products'] = [];
  try {
    ({ products } = await fetchPools());
  } catch {
    return [...staticUrls, ...assetHubUrls];
  }

  // Network filter pages: /{ticker}/{network}
  const networkKeys = new Set<string>();
  const networkUrls: MetadataRoute.Sitemap = [];

  function addNetworkUrl(ticker: string, netSlug: string) {
    const key = `${ticker}/${netSlug}`;
    if (!networkKeys.has(key)) {
      networkKeys.add(key);
      networkUrls.push({
        url: `${BASE_URL}/${ticker}/${netSlug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }

  for (const p of products) {
    const ticker = (p.ticker || '').toLowerCase();
    if (!VALID_TICKERS.includes(ticker)) continue;
    const netSlug = networkToSlug(p.network || '');
    if (!netSlug) continue;
    addNetworkUrl(ticker, netSlug);
  }

  // Vault pages: /vault/{slug}
  // Exclude dead vaults (noindex condition) and slugs with explicit hub redirects
  // in next.config.mjs — those return 308 and should never appear in the sitemap.
  const REDIRECTED_VAULT_SLUGS = new Set([
    'cbbtc-wintermute-trading-wildcat-mainnet',
    'usdt-clearstar-boring-morpho-ethereum',
  ]);
  const vaultUrls: MetadataRoute.Sitemap = products
    .filter(p =>
      VALID_TICKERS.includes((p.ticker || '').toLowerCase()) &&
      !((p.tvl ?? 0) < 5000 && (p.monthlyAPY ?? 0) === 0) &&
      !REDIRECTED_VAULT_SLUGS.has(getProductSlug(p))
    )
    .map(p => ({
      url: `${BASE_URL}/vault/${getProductSlug(p)}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    }));

  // Project pages: /project/{slug} — platform_name with ≥2 products
  const projectCounts = new Map<string, number>();
  for (const p of products) {
    const slug = nameToSlug((p.platform_name || '').trim());
    if (slug) projectCounts.set(slug, (projectCounts.get(slug) || 0) + 1);
  }
  const projectUrls: MetadataRoute.Sitemap = [];
  for (const [slug, count] of projectCounts.entries()) {
    if (count >= 2) {
      projectUrls.push({
        url: `${BASE_URL}/project/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Curator pages: /curator/{slug} — curator field with ≥4 products
  const curatorCounts = new Map<string, number>();
  for (const p of products) {
    if (!p.curator || p.curator === '-' || !p.curator.trim()) continue;
    const slug = nameToSlug(p.curator.trim());
    if (slug) curatorCounts.set(slug, (curatorCounts.get(slug) || 0) + 1);
  }
  const curatorUrls: MetadataRoute.Sitemap = [];
  for (const [slug, count] of curatorCounts.entries()) {
    if (count >= 4) {
      curatorUrls.push({
        url: `${BASE_URL}/curator/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return [
    ...staticUrls,
    ...assetHubUrls,
    ...networkUrls,
    ...vaultUrls,
    ...projectUrls,
    ...curatorUrls,
  ];
}
