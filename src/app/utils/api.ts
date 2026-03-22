/** Centralized API client for Earnbase. */
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7b092b69`;

const defaultHeaders = (): Record<string, string> => ({
  'Authorization': `Bearer ${publicAnonKey}`,
  'apikey': publicAnonKey,
  'Content-Type': 'application/json',
});

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error (${response.status})`);
  }

  return response.json();
}

// ─── Products (Live Assets) ─────────────────────────────────────
export interface PoolsResponse {
  products: any[];
  rule5Exclusions: number[];
  privateCreditIds: (number | string)[];
}

export const fetchPools = async (): Promise<PoolsResponse> => {
  const res = await request<PoolsResponse | any[]>('/pools');
  // Handle both new bundled format and legacy array format
  if (Array.isArray(res)) {
    return { products: res, rule5Exclusions: [], privateCreditIds: [] };
  }
  return {
    products: res.products || [],
    rule5Exclusions: res.rule5Exclusions || [],
    privateCreditIds: res.privateCreditIds || [],
  };
};

export const createPool = (body: Record<string, any>) =>
  request('/pools', { method: 'POST', body: JSON.stringify(body) });

export const deleteProduct = (id: string | number) =>
  request(`/pools/${id}`, { method: 'DELETE' });

export const extractCurator = (curatorName: string, dryRun: boolean = true, excludeIds?: { table: string; id: number }[]) =>
  request<{
    dryRun: boolean;
    curatorName: string;
    productsCount?: number;
    indexCount?: number;
    productsUpdated?: number;
    indexUpdated?: number;
    changes: {
      table: string;
      id: number;
      oldProductName: string;
      newProductName: string;
      oldCurator: string;
      newCurator: string;
      platform: string;
      network: string;
      ticker: string;
    }[];
  }>('/extract-curator', {
    method: 'POST',
    body: JSON.stringify({ curatorName, dryRun, excludeIds }),
  });

/** Fetch all products including hidden ones (for Control Room) */
export const fetchPoolsIncludingHidden = async (): Promise<any[]> => {
  const res = await request<PoolsResponse | any[]>('/pools?includeHidden=true');
  if (Array.isArray(res)) return res;
  return res.products || [];
};

// ─── Index (Manual Entries) ─────────────────────────────────────
export const fetchPendingProducts = () => request<any[]>('/index-products');

export const fetchAllIndexProducts = () => request<any[]>('/index-products-all');

export const createIndexProduct = (body: Record<string, any>) =>
  request('/index-product', { method: 'POST', body: JSON.stringify(body) });

export const updateIndexProduct = (id: number, body: Record<string, any>) =>
  request(`/index-product/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteIndexProduct = (id: number) =>
  request(`/index-product/${id}`, { method: 'DELETE' });

// ─── Summary & Sync ────────────────────────────────────────────
export const fetchSummaryCounts = () =>
  request<{ assets: number; index: number; diff: number }>('/summary-counts');

export const syncIndex = () =>
  request('/sync-index', { method: 'POST' });

export const syncProducts = () =>
  request('/sync-products', { method: 'POST' });

// ─── Backfill Index URL Slugs ───────────────────────────────────
export interface BackfillUrlResult {
  success: boolean;
  total: number;
  updated: number;
  skipped: number;
  errors: number;
  sample: { id: number; slug: string }[];
  message?: string;
}

export const backfillIndexUrls = () =>
  request<BackfillUrlResult>('/backfill-index-urls', { method: 'POST' });

// ─── Sync Names: Index → Products (Control Room Rule #4) ────────
export interface NameMismatch {
  productsId: number;
  indexId: number;
  defillamaId: string;
  ticker: string;
  network: string;
  platform: string;
  oldProductName: string;
  newProductName: string;
  oldCurator: string;
  newCurator: string;
  oldPlatform: string;
  newPlatform: string;
  nameChanged: boolean;
  curatorChanged: boolean;
  platformChanged: boolean;
}

export const syncNamesFromIndex = (dryRun: boolean = true) =>
  request<{
    dryRun: boolean;
    productsCount?: number;
    indexCount?: number;
    matchedCount?: number;
    mismatchCount?: number;
    updated?: number;
    errors?: number;
    total?: number;
    mismatches: NameMismatch[];
  }>('/sync-names-from-index', {
    method: 'POST',
    body: JSON.stringify({ dryRun }),
  });

// ─── Consolidation (Control Room) ────────────────────────────────
export interface UniqueFieldValue {
  name: string;
  products: number;
  index: number;
  total: number;
}

export interface ConsolidateChange {
  table: string;
  id: number;
  field: string;
  oldValue: string;
  newValue: string;
  productName: string;
  ticker: string;
  network: string;
}

export const fetchUniqueValues = (field: 'platform_name' | 'curator') =>
  request<UniqueFieldValue[]>(`/unique-values/${field}`);

export const consolidateNames = (
  field: 'platform_name' | 'curator',
  sourceNames: string[],
  targetName: string,
  dryRun: boolean = true,
) =>
  request<{
    dryRun: boolean;
    field: string;
    targetName: string;
    productsCount?: number;
    indexCount?: number;
    productsUpdated?: number;
    indexUpdated?: number;
    changes: ConsolidateChange[];
  }>('/consolidate-names', {
    method: 'POST',
    body: JSON.stringify({ field, sourceNames, targetName, dryRun }),
  });

// ─── Registry (Control Room) ────────────────────────────────────
export type RegistryType = 'network' | 'asset' | 'platform' | 'curator';

export interface RegistryItem {
  _type: RegistryType;
  _id: string;
  name: string;
  id?: string;
  ticker?: string;
  aliases?: string[];
  iconType?: 'static' | 'custom';
  iconUrl?: string;
  iconPath?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface RegistryAll {
  networks: RegistryItem[];
  assets: RegistryItem[];
  platforms: RegistryItem[];
  curators: RegistryItem[];
}

export const fetchRegistryAll = () =>
  request<RegistryAll>('/registry');

export const fetchRegistryType = (type: RegistryType) =>
  request<RegistryItem[]>(`/registry/${type}`);

export const upsertRegistryItem = (type: RegistryType, id: string, body: Record<string, any>) =>
  request(`/registry/${type}/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteRegistryItem = (type: RegistryType, id: string) =>
  request(`/registry/${type}/${id}`, { method: 'DELETE' });

export const seedRegistry = () =>
  request('/registry/seed', { method: 'POST' });

export const uploadIcon = async (file: File, folder: string): Promise<{ path: string; signedUrl: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const url = `${BASE_URL}/registry/upload-icon`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'apikey': publicAnonKey,
      // Do NOT set Content-Type — browser will set multipart boundary
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed (${response.status})`);
  }

  return response.json();
};

// ─── Rule #5: Yield Micro-Deviation Exclusions ──────────────────
export const fetchRule5Exclusions = () =>
  request<{ ids: number[]; updatedAt: string | null }>('/rule5-exclusions');

export const updateRule5Exclusions = (ids: number[]) =>
  request<{ success: boolean; ids: number[]; updatedAt: string; count: number }>(
    '/rule5-exclusions',
    { method: 'PUT', body: JSON.stringify({ ids }) }
  );

// ─── Display Settings (Asset Page Rules) ────────────────────────

export interface DisplaySettings {
  assetMinTvl: number;
  homeMinTvl: number;
  showZeroApy: boolean;
}

export const fetchDisplaySettings = () =>
  request<DisplaySettings>('/display-settings');

export const updateDisplaySettings = (settings: Partial<DisplaySettings>) =>
  request<DisplaySettings & { success: boolean }>(
    '/display-settings',
    { method: 'PUT', body: JSON.stringify(settings) }
  );

// ─── Click Tracking ─────────────────────────────────────────────

export interface ClickRecord {
  slug: string;
  productName: string;
  platform: string;
  ticker: string;
  network: string;
  curator: string;
  count: number;
  lastClickedAt: string;
  firstClickedAt: string;
}

export interface DailyClickRecord {
  date: string;   // YYYY-MM-DD
  count: number;
}

/** Individual click event with full user/device details */
export interface ClickEvent {
  id: string;
  slug: string;
  productName: string;
  platform: string;
  ticker: string;
  network: string;
  curator: string;
  timestamp: string;
  // User details
  ip: string;
  country: string;
  region: string;
  city: string;
  browser: string;
  os: string;
  device: string;       // desktop | mobile | tablet
  language: string;
  timezone: string;
  screenWidth: number;
  screenHeight: number;
  referrer: string;
  pageUrl: string;
}

/** Collect client-side metadata for click enrichment */
function collectClientMeta() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    screenWidth: window.screen?.width || 0,
    screenHeight: window.screen?.height || 0,
    referrer: document.referrer || '',
    pageUrl: window.location.href || '',
  };
}

export const trackClick = (data: {
  slug: string;
  productName: string;
  platform: string;
  ticker: string;
  network: string;
  curator?: string;
  productLink?: string;
  apyAtClick?: number;
  tvlAtClick?: number;
  defillamaId?: string;
}) =>
  request('/clicks/track', {
    method: 'POST',
    body: JSON.stringify({ ...data, ts: Date.now(), meta: collectClientMeta() }),
  }).catch((err) => {
    // Fire-and-forget — don't break UX if tracking fails
    console.warn('[Click tracking] Failed:', err.message);
  });

export const fetchClicks = () =>
  request<ClickRecord[]>('/clicks');

export const fetchDailyClicks = () =>
  request<DailyClickRecord[]>('/clicks/daily');

export const fetchClickLog = (limit: number = 200, offset: number = 0) =>
  request<{ events: ClickEvent[]; total: number }>(`/clicks/log?limit=${limit}&offset=${offset}`);

// ─── Search Tracking ────────────────────────────────────────────

export interface SearchRecord {
  query: string;
  queryRaw: string;
  count: number;
  avgResults: number;
  lastSearchedAt: string;
  firstSearchedAt: string;
}

export interface DailySearchRecord {
  date: string;   // YYYY-MM-DD
  count: number;
}

export interface SearchEvent {
  id: string;
  query: string;
  queryRaw: string;
  resultsCount: number;
  pageContext: string;
  tickerContext: string;
  networkContext: string;
  timestamp: string;
  ip: string;
  country: string;
  region: string;
  city: string;
  browser: string;
  os: string;
  device: string;
  language: string;
  timezone: string;
  screenWidth: number;
  screenHeight: number;
  referrer: string;
}

export const trackSearch = (data: {
  query: string;
  resultsCount: number;
  pageContext: string;
  tickerContext?: string;
  networkContext?: string;
}) =>
  request('/searches/track', {
    method: 'POST',
    body: JSON.stringify({ ...data, ts: Date.now(), meta: collectClientMeta() }),
  }).catch((err) => {
    console.warn('[Search tracking] Failed:', err.message);
  });

export const fetchSearches = () =>
  request<SearchRecord[]>('/searches');

export const fetchDailySearches = () =>
  request<DailySearchRecord[]>('/searches/daily');

export const fetchSearchLog = (limit: number = 200, offset: number = 0) =>
  request<{ events: SearchEvent[]; total: number }>(`/searches/log?limit=${limit}&offset=${offset}`);

// ─── Client Reports (Control Room → Clients tab) ───────────────

export interface ClientReportProduct {
  slug: string;
  productName: string;
  ticker: string;
  network: string;
  curator: string;
  count: number;
  lastClickedAt: string;
}

export interface ClientReport {
  platform: string;
  totalClicks: number;
  products: ClientReportProduct[];
  daily: DailyClickRecord[];
}

export const fetchClientReport = (platform: string) =>
  request<ClientReport>(`/clicks/client-report?platform=${encodeURIComponent(platform)}`);

// ─── Click Analytics ────────────────────────────────────────────

export interface ClickAnalytics {
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  referrerBreakdown: {
    google: number;
    bing: number;
    direct: number;
    other: number;
  };
  dailyDeviceBreakdown: {
    date: string;
    desktop: number;
    mobile: number;
    tablet: number;
  }[];
  totalClicks: number;
  clicks24h?: number;
}

export const fetchClickAnalytics = () =>
  request<ClickAnalytics>('/clicks/analytics');

// ─── Page View Tracking ─────────────────────────────────────────

export interface PageViewEvent {
  id: string;
  route: string;
  routeType: string;
  tickerContext: string;
  networkContext: string;
  vaultSlug: string;
  sessionId: string;
  referrer: string;
  referrerDomain: string;
  timestamp: string;
  ip: string;
  country: string;
  region: string;
  city: string;
  browser: string;
  os: string;
  device: string;
  language: string;
  timezone: string;
  screenWidth: number;
  screenHeight: number;
}

export interface DailyPageViewRecord {
  date: string;   // YYYY-MM-DD
  count: number;
}

export interface TopPageRecord {
  route: string;
  routeType: string;
  tickerContext: string;
  networkContext: string;
  vaultSlug: string;
  count: number;
  uniqueVisitors: number;
  lastViewedAt: string;
}

export interface ReferrerRecord {
  domain: string;
  count: number;
  uniqueVisitors: number;
  lastSeenAt: string;
}

/** Get or create a stable anonymous session ID */
function getSessionId(): string {
  const KEY = 'earnbase_session_id';
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

export const trackPageView = (data: {
  route: string;
  tickerContext?: string;
  networkContext?: string;
  vaultSlug?: string;
}) =>
  request('/pageviews/track', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      sessionId: getSessionId(),
      ts: Date.now(),
      meta: collectClientMeta(),
    }),
  }).catch((err) => {
    // Fire-and-forget — don't break UX if tracking fails
    console.warn('[Page view tracking] Failed:', err.message);
  });

export const fetchDailyPageViews = () =>
  request<DailyPageViewRecord[]>('/pageviews/daily');

export const fetchTopPages = (limit: number = 30) =>
  request<TopPageRecord[]>(`/pageviews/top-pages?limit=${limit}`);

export const fetchReferrers = () =>
  request<ReferrerRecord[]>('/pageviews/referrers');

export const fetchPageViewLog = (limit: number = 200, offset: number = 0, source?: string) =>
  request<{ events: PageViewEvent[]; total: number }>(`/pageviews/log?limit=${limit}&offset=${offset}${source ? `&source=${source}` : ''}`);

// ── Visitor Insights ─────────────────────────────────────────

export interface VisitorSummary {
  totalUnique: number;
  newCount: number;
  returningCount: number;
  returnRate: number;   // 0-100
}

export interface DailyVisitorRecord {
  date: string;           // YYYY-MM-DD
  newVisitors: number;
  returningVisitors: number;
  totalVisitors: number;
}

export interface VisitorInsights {
  summary: VisitorSummary;
  daily: DailyVisitorRecord[];
}

export const fetchVisitorInsights = () =>
  request<VisitorInsights>('/pageviews/visitors');

// ─── Hidden Visitors (fingerprint-based) ────────────────────────

export interface HiddenVisitor {
  fingerprint: string;
  label: string;
  hiddenAt: string;
}

export const fetchHiddenVisitors = () =>
  request<HiddenVisitor[]>('/pageviews/hidden-visitors');

export const addHiddenVisitor = (fingerprint: string, label: string) =>
  request<{ success: boolean; list: HiddenVisitor[] }>(
    '/pageviews/hidden-visitors',
    { method: 'POST', body: JSON.stringify({ fingerprint, label }) }
  );

export const removeHiddenVisitor = (fingerprint: string) =>
  request<{ success: boolean; list: HiddenVisitor[] }>(
    '/pageviews/hidden-visitors',
    { method: 'DELETE', body: JSON.stringify({ fingerprint }) }
  );

// ─── Hidden Products (Control Room) ─────────────────────────────

export const fetchHiddenProducts = () =>
  request<{ ids: number[] }>('/hidden-products');

export const updateHiddenProducts = (ids: number[]) =>
  request<{ success: boolean; count: number; ids: number[] }>(
    '/hidden-products',
    { method: 'PUT', body: JSON.stringify({ ids }) }
  );

// ─── Private Credit Products (Control Room) ─────────────────────

export const fetchPrivateCreditProducts = () =>
  request<{ ids: (number | string)[] }>('/private-credit');

export const updatePrivateCreditProducts = (ids: (number | string)[]) =>
  request<{ success: boolean; count: number; ids: (number | string)[] }>(
    '/private-credit',
    { method: 'PUT', body: JSON.stringify({ ids }) }
  );