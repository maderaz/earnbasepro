/**
 * Shared server helpers — Supabase client, Index Shield, slug generation.
 */
import { createClient } from "npm:@supabase/supabase-js";

// ── Supabase Client ──────────────────────────────────────────

export const getSupabase = () => {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key);
};

// ── Icons Bucket ─────────────────────────────────────────────

export const ICONS_BUCKET = 'make-7b092b69-icons';

let bucketReady = false;
export const ensureBucket = async () => {
  if (bucketReady) return;
  try {
    const supabase = getSupabase();
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b: any) => b.name === ICONS_BUCKET);
    if (!exists) {
      await supabase.storage.createBucket(ICONS_BUCKET, { public: false });
      console.log(`[Registry] Created storage bucket: ${ICONS_BUCKET}`);
    }
    bucketReady = true;
  } catch (err: any) {
    console.log(`[Registry] Bucket setup warning: ${err.message}`);
  }
};

// ── Index Shield ─────────────────────────────────────────────

/** Extract defillamaId from any row shape */
export const extractDefillamaId = (row: any): string =>
  (row.defillamaId || row.defillamaID || row.defillama_id || row.defillama_link || '')
    .toString().toLowerCase().trim();

let indexCache: { map: Map<string, any>; ts: number } | null = null;
const INDEX_CACHE_TTL_MS = 60_000;

export const getIndexLookup = async (): Promise<Map<string, any>> => {
  const now = Date.now();
  if (indexCache && now - indexCache.ts < INDEX_CACHE_TTL_MS) return indexCache.map;

  const supabase = getSupabase();
  const { data, error } = await supabase.from('Index').select('*');
  if (error) {
    console.log(`[Index Shield] WARNING — Index fetch failed: ${error.message}`);
    return indexCache?.map || new Map();
  }

  const map = new Map<string, any>();
  for (const row of (data || [])) { const did = extractDefillamaId(row); if (did) map.set(did, row); }
  indexCache = { map, ts: now };
  console.log(`[Index Shield] Refreshed Index cache — ${map.size} entries`);
  return map;
};

export const applyIndexShield = (
  item: any,
  indexMap: Map<string, any>
): { product_name: string; curator: string; platform_name: string; url: string | null; vault_address: string | null } => {
  const did = extractDefillamaId(item);
  const defaults = {
    product_name: item.productName || item.product_name || item.product_link || 'Untitled',
    curator: item.curator || '-',
    platform_name: item.platform || item.platform_name || item.platformName || 'Unknown',
    url: null as string | null,
    vault_address: null as string | null,
  };
  if (!did) return defaults;
  const indexRow = indexMap.get(did);
  if (!indexRow) return defaults;

  const iName = (indexRow.productName || indexRow.product_name || '').trim();
  const iCurator = (indexRow.curator || '').trim();
  const iPlatform = (indexRow.platform || indexRow.platform_name || indexRow.platformName || '').trim();
  const iUrl = (indexRow.url || '').trim() || null;
  const iVaultAddress = (indexRow.vault_address || '').trim() || null;

  return {
    product_name: iName || defaults.product_name,
    curator: iCurator || defaults.curator,
    platform_name: iPlatform || defaults.platform_name,
    url: iUrl,
    vault_address: iVaultAddress,
  };
};

// ── Vault Slug Generation ────────────────────────────────────

export const generateVaultSlug = (
  ticker: string, productName: string, platform: string,
  curator?: string | null, network?: string | null
): string => {
  const slugifyPart = (text: string): string =>
    text.toLowerCase().trim()
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const parts = [slugifyPart(ticker), slugifyPart(productName), slugifyPart(platform)];
  if (curator && curator !== '-' && curator.trim() !== '') parts.push(slugifyPart(curator));
  if (network && network.trim() !== '') parts.push(slugifyPart(network));

  // Deduplicate words
  const allWords = parts.join('-').split('-');
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const word of allWords) {
    if (word && !seen.has(word)) { deduped.push(word); seen.add(word); }
  }
  return deduped.join('-');
};

// ── Rule #5 KV Key ───────────────────────────────────────────

export const RULE5_EXCLUSIONS_KEY = 'rule5:exclusions';

// Paginated fetch -- Supabase PostgREST limits results to 1000 rows by default.
// This helper fetches all rows by paginating through the table in batches.
export async function fetchAllRows<T = any>(
  table: string,
  select: string,
  options?: {
    order?: { column: string; ascending?: boolean };
    eq?: { column: string; value: any };
    ilike?: { column: string; value: string };
  }
): Promise<T[]> {
  const supabase = getSupabase();
  const BATCH = 1000;
  const all: T[] = [];
  let offset = 0;

  while (true) {
    let q = supabase.from(table).select(select).range(offset, offset + BATCH - 1);
    if (options?.order) q = q.order(options.order.column, { ascending: options.order.ascending ?? true });
    if (options?.eq) q = q.eq(options.eq.column, options.eq.value);
    if (options?.ilike) q = q.ilike(options.ilike.column, options.ilike.value);
    const { data, error } = await q;
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...(data as T[]));
    if (data.length < BATCH) break;
    offset += BATCH;
  }
  return all;
}