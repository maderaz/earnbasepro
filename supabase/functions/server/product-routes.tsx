/**
 * Product routes — Pools CRUD, Index Shield correction, Hidden Products.
 */
import { getSupabase, getIndexLookup, applyIndexShield, RULE5_EXCLUSIONS_KEY, generateVaultSlug } from "./helpers.tsx";
import * as kv from "./kv_store.tsx";

const HIDDEN_PRODUCTS_KEY = 'hidden_products';
const PRIVATE_CREDIT_KEY = 'private_credit_products';
const DISPLAY_SETTINGS_KEY = 'display_settings';

export interface DisplaySettings {
  assetMinTvl: number;      // 0 = no minimum
  homeMinTvl: number;       // 0 = no minimum — separate threshold for homepage
  showZeroApy: boolean;     // false = hide 0.00% APY products on asset pages
}

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  assetMinTvl: 0,
  homeMinTvl: 0,
  showZeroApy: false,
};

export function registerProductRoutes(app: any) {

  // ── GET /pools — Products + Index Shield correction ─────────
  app.get("/make-server-7b092b69/pools", async (c: any) => {
    try {
      const supabase = getSupabase();
      const [{ data, error }, indexMap] = await Promise.all([supabase.from('Products').select('*'), getIndexLookup()]);
      if (error) return c.json({ error: error.message }, 400);

      let shieldApplied = 0;
      const mappedData = (data || []).map((item: any) => {
        const rawHistory = item.dailyApyHistory || item.daily_apy_history || item.dailyapyhistory || item.spotApy30dHistory || item.spot_apy_history || item.spot_apy_30d_history || item.apy_history || item.apyHistory || [];
        let historyArray: number[] = [];
        if (Array.isArray(rawHistory)) historyArray = rawHistory;
        else if (typeof rawHistory === 'string') { try { const p = JSON.parse(rawHistory); if (Array.isArray(p)) historyArray = p; } catch { if (rawHistory.includes(',')) historyArray = rawHistory.split(',').map((v: string) => parseFloat(v.trim())); } }
        const finalHistory = historyArray.map((v: any) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; });

        const rawTvlHistory = item.tvlHistory || item.tvl_history || item.tvlhistory || item.TvlHistory || [];
        let tvlHistoryArray: number[] = [];
        if (Array.isArray(rawTvlHistory)) tvlHistoryArray = rawTvlHistory;
        else if (typeof rawTvlHistory === 'string') { try { const p = JSON.parse(rawTvlHistory); if (Array.isArray(p)) tvlHistoryArray = p; } catch { if (rawTvlHistory.includes(',')) tvlHistoryArray = rawTvlHistory.split(',').map((v: string) => parseFloat(v.trim())); } }
        const finalTvlHistory = tvlHistoryArray.map((v: any) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; });

        const rawName = item.productName || item.product_name || item.product_link || 'Untitled';
        const rawCurator = item.curator || '-';
        const rawPlatform = item.platform || item.platform_name || item.platformName || 'Unknown';
        const corrected = applyIndexShield(item, indexMap);
        if (corrected.product_name !== rawName || corrected.curator !== rawCurator || corrected.platform_name !== rawPlatform) shieldApplied++;

        return {
          ...item, id: item.id,
          ticker: item.vault || item.ticker || item.asset || 'N/A',
          network: item.network || 'Mainnet',
          platform_name: corrected.platform_name,
          product_name: corrected.product_name,
          curator: corrected.curator,
          url: corrected.url,
          vault_address: corrected.vault_address,
          product_link: item.productLink || item.product_link || item.link || '#',
          spotAPY: parseFloat(item.dailyApy || item.dailyAPY || item.spotApy || item.spotAPY || 0),
          weeklyAPY: parseFloat(item.weeklyApy || item.weeklyAPY || 0),
          monthlyAPY: parseFloat(item.monthlyApy || item.monthlyAPY || item.monhlyAPY || 0),
          tvl: parseFloat(item.tvl || 0),
          dailyApyHistory: finalHistory, spotApy30dHistory: finalHistory,
          tvlHistory: finalTvlHistory,
        };
      });

      if (shieldApplied > 0) console.log(`[Index Shield] Corrected ${shieldApplied}/${mappedData.length} products`);
      
      // Read hidden products and rule5 exclusions in parallel
      let hiddenIds: number[] = [];
      let rule5Ids: number[] = [];
      let privateCreditIds: (number | string)[] = [];
      try {
        const [hiddenRaw, rule5Raw, pcRaw] = await Promise.all([
          kv.get(HIDDEN_PRODUCTS_KEY).catch(() => []),
          kv.get(RULE5_EXCLUSIONS_KEY).catch(() => null),
          kv.get(PRIVATE_CREDIT_KEY).catch(() => []),
        ]);
        hiddenIds = Array.isArray(hiddenRaw) ? hiddenRaw : [];
        rule5Ids = rule5Raw?.ids || [];
        // Robustly extract private credit IDs — handle plain array, wrapped object, or stringified JSON
        if (Array.isArray(pcRaw)) {
          privateCreditIds = pcRaw;
        } else if (pcRaw && typeof pcRaw === 'object' && Array.isArray((pcRaw as any).ids)) {
          privateCreditIds = (pcRaw as any).ids;
        } else if (typeof pcRaw === 'string') {
          try { const parsed = JSON.parse(pcRaw); privateCreditIds = Array.isArray(parsed) ? parsed : (parsed?.ids || []); } catch { privateCreditIds = []; }
        }
      } catch (err: any) {
        console.log(`[Pools] Warning — KV read for hidden/rule5/privateCredit failed: ${err.message}`);
      }

      if (privateCreditIds.length > 0) {
        console.log(`[Pools] Bundling ${privateCreditIds.length} private credit IDs: [${privateCreditIds.slice(0, 5).join(', ')}${privateCreditIds.length > 5 ? '...' : ''}]`);
      }

      // Filter out hidden products unless ?includeHidden=true
      const includeHidden = c.req.query('includeHidden') === 'true';
      let finalProducts = mappedData;
      if (!includeHidden && hiddenIds.length > 0) {
        const hiddenSet = new Set(hiddenIds);
        finalProducts = mappedData.filter((p: any) => !hiddenSet.has(p.id));
        console.log(`[Hidden Products] Filtered out ${mappedData.length - finalProducts.length} hidden products`);
      }

      // Return products + rule5 exclusion IDs + private credit IDs bundled together
      return c.json({ products: finalProducts, rule5Exclusions: rule5Ids, privateCreditIds });
    } catch (err: any) { return c.json({ error: err.message }, 500); }
  });

  // ── POST /pools ─────────────────────────────────────────────
  app.post("/make-server-7b092b69/pools", async (c: any) => {
    try {
      const supabase = getSupabase();
      const body = await c.req.json();
      let existingProduct = null;
      if (body.id) { const { data } = await supabase.from('Products').select('*').eq('id', body.id).single(); existingProduct = data; }

      const insertObj: any = {
        vault: body.vault, ticker: body.vault, network: body.network,
        platform: body.platform, platform_name: body.platform,
        productName: body.productName, product_name: body.productName,
        curator: body.curator,
        product_link: body.product_link, productLink: body.product_link,
        defillama_link: body.defillama_link, defillamaId: body.defillama_link,
        spotApy: body.spotApy || (existingProduct ? (existingProduct.spotApy || existingProduct.dailyApy) : 0),
        spotAPY: body.spotApy || (existingProduct ? (existingProduct.spotAPY || existingProduct.dailyApy) : 0),
        dailyApy: body.spotApy || (existingProduct ? (existingProduct.dailyApy || existingProduct.spotApy) : 0),
        weeklyApy: body.weeklyApy || (existingProduct ? existingProduct.weeklyApy : 0),
        weeklyAPY: body.weeklyApy || (existingProduct ? existingProduct.weeklyAPY : 0),
        monthlyApy: body.monthlyApy || (existingProduct ? existingProduct.monthlyApy : 0),
        monthlyAPY: body.monthlyApy || (existingProduct ? existingProduct.monthlyAPY : 0),
        tvl: body.tvl || (existingProduct ? existingProduct.tvl : 0),
        dailyApyHistory: existingProduct?.dailyApyHistory || body.dailyApyHistory || [],
      };
      if (body.id) insertObj.id = body.id;
      const { data, error } = await supabase.from('Products').upsert([insertObj], { onConflict: 'id' }).select();
      if (error) return c.json({ error: error.message }, 400);
      return c.json({ success: true, data });
    } catch (err: any) { return c.json({ error: err.message }, 500); }
  });

  // ── DELETE /pools/:id ───────────────────────────────────────
  app.delete("/make-server-7b092b69/pools/:id", async (c: any) => {
    try {
      const supabase = getSupabase();
      const id = c.req.param('id');
      console.log(`[Products DELETE] Removing product id=${id}`);
      const { error } = await supabase.from('Products').delete().eq('id', id);
      if (error) throw error;
      return c.json({ success: true });
    } catch (err: any) { return c.json({ error: err.message }, 500); }
  });

  // ── POST /index-product ─────────────────────────────────────
  app.post("/make-server-7b092b69/index-product", async (c: any) => {
    try {
      const supabase = getSupabase();
      const body = await c.req.json();
      const { data: sampleRow } = await supabase.from('Index').select('*').limit(1);
      const keys = sampleRow && sampleRow.length > 0 ? Object.keys(sampleRow[0]) : [];
      const { data: maxIdData } = await supabase.from('Index').select('id').order('id', { ascending: false }).limit(1);
      const lastId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id : 300;
      const nextId = Math.max(300, lastId) + 1;
      let trimmedDefillamaID = body.defillama_link || '';
      if (trimmedDefillamaID.includes('/pool/')) trimmedDefillamaID = trimmedDefillamaID.split('/pool/').pop()?.split('?')[0] || '';

      // Auto-generate url slug from the same fields used for vault routing
      const autoSlug = generateVaultSlug(
        body.ticker || '',
        body.productName || '',
        body.platform || '',
        body.curator || null,
        body.network || ''
      );

      const insertData: any = { id: nextId };
      if (keys.includes('ticker') || keys.length === 0) insertData.ticker = body.ticker;
      if (keys.includes('network') || keys.length === 0) insertData.network = body.network;
      if (keys.includes('platform') || keys.length === 0) insertData.platform = body.platform;
      if (keys.includes('productName')) insertData.productName = body.productName;
      else if (keys.includes('product_name')) insertData.product_name = body.productName;
      if (keys.includes('curator') || keys.length === 0) insertData.curator = body.curator || null;
      if (keys.includes('productLink')) insertData.productLink = body.productLink;
      else if (keys.includes('product_link')) insertData.product_link = body.productLink;
      if (keys.includes('defillamaId')) insertData.defillamaId = trimmedDefillamaID;
      else if (keys.includes('defillamaID')) insertData.defillamaID = trimmedDefillamaID;
      else if (keys.includes('defillama_id')) insertData.defillama_id = trimmedDefillamaID;
      if (keys.includes('sponsored')) insertData.sponsored = false;
      // Vault address (optional)
      if (body.vault_address) insertData.vault_address = body.vault_address;
      // Always set url slug
      insertData.url = autoSlug;

      const { data, error } = await supabase.from('Index').insert([insertData]).select();
      if (error) return c.json({ error: error.message }, 400);
      console.log(`[Index Product] Created id=${nextId} with url slug: ${autoSlug}`);
      return c.json({ success: true, data });
    } catch (err: any) { return c.json({ error: err.message }, 500); }
  });

  // ── GET /index-products (pending) ───────────────────────────
  app.get("/make-server-7b092b69/index-products", async (c: any) => {
    try {
      const supabase = getSupabase();
      const { data: liveProducts, error: prodError } = await supabase.from('Products').select('*');
      if (prodError) throw prodError;
      const liveDefillamaIds = new Set<string>();
      for (const p of (liveProducts || [])) { const did = (p.defillamaId || p.defillamaID || p.defillama_id || p.defillama_link || '').toString().toLowerCase().trim(); if (did) liveDefillamaIds.add(did); }
      const { data: indexData, error: indexError } = await supabase.from('Index').select('*').order('id', { ascending: false });
      if (indexError) throw indexError;
      const pending = (indexData || []).filter(item => { const did = (item.defillamaId || item.defillamaID || item.defillama_id || item.defillama_link || '').toString().toLowerCase().trim(); if (!did) return true; return !liveDefillamaIds.has(did); });
      console.log(`[Pending Inclusion] Index: ${indexData?.length}, Pending: ${pending.length}`);
      return c.json(pending);
    } catch (err: any) { console.log(`[Pending Inclusion ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // ── GET /index-products-all ─────────────────────────────────
  app.get("/make-server-7b092b69/index-products-all", async (c: any) => {
    try { const supabase = getSupabase(); const { data, error } = await supabase.from('Index').select('*').order('id', { ascending: false }); if (error) throw error; return c.json(data || []); } catch (err: any) { return c.json({ error: err.message }, 500); }
  });

  // ── POST /sync-index ────────────────────────────────────────
  app.post("/make-server-7b092b69/sync-index", async (c: any) => {
    try { const supabase = getSupabase(); const { data, error } = await supabase.from('Index').select('*'); if (error) throw error; if (!data || data.length === 0) return c.json({ message: "Empty" }); const { error: ie } = await supabase.from('Index_duplicate').upsert(data); if (ie) throw ie; return c.json({ success: true, count: data.length }); } catch (err: any) { return c.json({ error: err.message }, 500); }
  });

  // ── PUT /index-product/:id ──────────────────────────────────
  app.put("/make-server-7b092b69/index-product/:id", async (c: any) => {
    try {
      const supabase = getSupabase();
      const id = c.req.param('id');
      const body = await c.req.json();

      // Frozen URL policy: once a url slug exists, it never changes.
      // Only generate a slug for rows that have no url yet.
      const slugFields = ['ticker', 'productName', 'product_name', 'platform', 'curator', 'network'];
      const hasSluggableChange = slugFields.some(f => body[f] !== undefined);

      if (hasSluggableChange) {
        const { data: currentRow } = await supabase.from('Index').select('*').eq('id', id).single();
        if (currentRow) {
          const existingUrl = (currentRow.url || '').trim();
          if (!existingUrl) {
            // No url yet — freeze it based on the ORIGINAL row state (pre-edit),
            // so the slug matches what the frontend was already generating dynamically.
            // Using post-edit data here would create a brand-new URL and break existing links.
            const ticker = currentRow.ticker || currentRow.vault || '';
            const productName = currentRow.productName || currentRow.product_name || '';
            const platform = currentRow.platform || currentRow.platform_name || currentRow.platformName || '';
            const curatorVal = (currentRow.curator || '').trim();
            const curator = curatorVal && curatorVal !== '-' ? curatorVal : null;
            const network = currentRow.network || '';
            body.url = generateVaultSlug(ticker, productName, platform, curator, network);
            console.log(`[Index Product] Freezing initial url for id=${id} from PRE-EDIT state: ${body.url}`);
          } else {
            // URL is frozen -- never overwrite
            delete body.url;
            console.log(`[Index Product] Slug-relevant fields updated for id=${id} but url is frozen: ${existingUrl}`);
          }
        }
      }

      const { data, error } = await supabase.from('Index').update(body).eq('id', id).select();
      if (error) throw error;
      return c.json({ success: true, data });
    } catch (err: any) { return c.json({ error: err.message }, 500); }
  });

  // ── DELETE /index-product/:id ───────────────────────────────
  app.delete("/make-server-7b092b69/index-product/:id", async (c: any) => {
    try { const supabase = getSupabase(); const id = c.req.param('id'); const { error } = await supabase.from('Index').delete().eq('id', id); if (error) throw error; return c.json({ success: true }); } catch (err: any) { return c.json({ error: err.message }, 500); }
  });

  // ── POST /sync-products ─────────────────────────────────────
  app.post("/make-server-7b092b69/sync-products", async (c: any) => {
    try { const supabase = getSupabase(); const { data, error } = await supabase.from('Products').select('*'); if (error) throw error; if (data) { const { error: ie } = await supabase.from('Products_duplicate').upsert(data); if (ie) throw ie; } return c.json({ success: true, count: data?.length || 0 }); } catch (err: any) { return c.json({ error: err.message }, 500); }
  });

  // ── GET /summary-counts ─────────────────────────────────────
  app.get("/make-server-7b092b69/summary-counts", async (c: any) => {
    try {
      const supabase = getSupabase();
      const { count: productsCount, error: pError } = await supabase.from('Products').select('*', { count: 'exact', head: true });
      const { count: indexCount, error: iError } = await supabase.from('Index').select('*', { count: 'exact', head: true });
      if (pError || iError) throw new Error(`Database error: ${pError?.message || iError?.message}`);

      const { data: liveProducts, error: lpError } = await supabase.from('Products').select('*');
      if (lpError) throw lpError;
      const { data: indexData, error: idxError } = await supabase.from('Index').select('*');
      if (idxError) throw idxError;

      const liveDefillamaIds = new Set<string>();
      for (const p of (liveProducts || [])) { const did = (p.defillamaId || p.defillamaID || p.defillama_id || p.defillama_link || '').toString().toLowerCase().trim(); if (did) liveDefillamaIds.add(did); }
      const actualMissing = (indexData || []).filter(item => { const did = (item.defillamaId || item.defillamaID || item.defillama_id || item.defillama_link || '').toString().toLowerCase().trim(); if (!did) return true; return !liveDefillamaIds.has(did); }).length;

      return c.json({ assets: productsCount || 0, index: indexCount || 0, diff: actualMissing });
    } catch (err: any) { console.log(`[Summary ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // ── GET /hidden-products — fetch hidden product IDs ─────────
  app.get("/make-server-7b092b69/hidden-products", async (c: any) => {
    try {
      const ids: number[] = (await kv.get(HIDDEN_PRODUCTS_KEY)) || [];
      return c.json({ ids });
    } catch (err: any) {
      console.log(`[Hidden Products GET] Error: ${err.message}`);
      return c.json({ error: err.message }, 500);
    }
  });

  // ── PUT /hidden-products — update hidden product IDs ────────
  app.put("/make-server-7b092b69/hidden-products", async (c: any) => {
    try {
      const body = await c.req.json();
      const ids: number[] = Array.isArray(body.ids) ? body.ids.map(Number).filter((n: number) => !isNaN(n)) : [];
      await kv.set(HIDDEN_PRODUCTS_KEY, ids);
      console.log(`[Hidden Products] Updated — ${ids.length} products hidden`);
      return c.json({ success: true, count: ids.length, ids });
    } catch (err: any) {
      console.log(`[Hidden Products PUT] Error: ${err.message}`);
      return c.json({ error: err.message }, 500);
    }
  });

  // ── GET /private-credit — fetch private credit product IDs ──
  app.get("/make-server-7b092b69/private-credit", async (c: any) => {
    try {
      const raw = await kv.get(PRIVATE_CREDIT_KEY);
      // Robustly extract IDs regardless of stored format
      let ids: (number | string)[] = [];
      if (Array.isArray(raw)) {
        ids = raw;
      } else if (raw && typeof raw === 'object' && Array.isArray(raw.ids)) {
        ids = raw.ids;
      } else if (typeof raw === 'string') {
        try { const parsed = JSON.parse(raw); ids = Array.isArray(parsed) ? parsed : (parsed?.ids || []); } catch { ids = []; }
      }
      console.log(`[Private Credit GET] Returning ${ids.length} IDs`);
      return c.json({ ids });
    } catch (err: any) {
      console.log(`[Private Credit GET] Error: ${err.message}`);
      return c.json({ error: err.message }, 500);
    }
  });

  // ── PUT /private-credit — update private credit product IDs ─
  app.put("/make-server-7b092b69/private-credit", async (c: any) => {
    try {
      const body = await c.req.json();
      // Accept both numeric and string IDs — preserve original type
      const ids: (number | string)[] = Array.isArray(body.ids)
        ? body.ids.map((id: any) => {
            const n = Number(id);
            // If it cleanly converts to a finite number, store as number; otherwise keep as string
            return Number.isFinite(n) && String(n) === String(id) ? n : String(id);
          }).filter((v: any) => v !== '' && v !== null && v !== undefined)
        : [];
      await kv.set(PRIVATE_CREDIT_KEY, ids);
      console.log(`[Private Credit] Updated — ${ids.length} products tagged, IDs: [${ids.slice(0, 5).join(', ')}${ids.length > 5 ? '...' : ''}]`);
      return c.json({ success: true, count: ids.length, ids });
    } catch (err: any) {
      console.log(`[Private Credit PUT] Error: ${err.message}`);
      return c.json({ error: err.message }, 500);
    }
  });

  // ── POST /backfill-index-urls — one-time slug backfill ──────
  app.post("/make-server-7b092b69/backfill-index-urls", async (c: any) => {
    try {
      const supabase = getSupabase();
      const { data: rows, error } = await supabase.from('Index').select('*');
      if (error) throw error;
      if (!rows || rows.length === 0) return c.json({ success: true, message: 'No rows to backfill', updated: 0 });

      let updated = 0;
      let skipped = 0;
      let frozen = 0;
      let errors = 0;
      const report: { id: number; slug: string }[] = [];

      // Process in chunks of 20 to avoid overwhelming the API
      const CHUNK_SIZE = 20;
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        const chunk = rows.slice(i, i + CHUNK_SIZE);
        const promises = chunk.map(async (row: any) => {
          try {
            // Frozen URL policy: never overwrite an existing url
            const existingUrl = (row.url || '').trim();
            if (existingUrl) {
              frozen++;
              return;
            }

            const ticker = (row.ticker || row.vault || '').toString().trim();
            const productName = (row.productName || row.product_name || '').toString().trim();
            const platform = (row.platform || row.platform_name || row.platformName || '').toString().trim();
            const curator = (row.curator || '').toString().trim() || null;
            const network = (row.network || '').toString().trim() || 'Mainnet';

            if (!ticker && !productName) {
              skipped++;
              return;
            }

            const slug = generateVaultSlug(ticker, productName, platform, curator, network);

            const { error: updateError } = await supabase.from('Index').update({ url: slug }).eq('id', row.id);
            if (updateError) {
              console.log(`[Backfill] Error updating id=${row.id}: ${updateError.message}`);
              errors++;
            } else {
              updated++;
              report.push({ id: row.id, slug });
            }
          } catch (e: any) {
            console.log(`[Backfill] Exception for id=${row.id}: ${e.message}`);
            errors++;
          }
        });
        await Promise.all(promises);
      }

      console.log(`[Backfill Index URLs] Done — updated: ${updated}, frozen: ${frozen}, skipped: ${skipped}, errors: ${errors}, total: ${rows.length}`);
      return c.json({
        success: true,
        total: rows.length,
        updated,
        frozen,
        skipped,
        errors,
        sample: report.slice(0, 10),
      });
    } catch (err: any) {
      console.log(`[Backfill Index URLs ERROR] ${err.message}`);
      return c.json({ error: err.message }, 500);
    }
  });

  // ── GET /display-settings — fetch asset page display settings ──
  app.get("/make-server-7b092b69/display-settings", async (c: any) => {
    try {
      const raw = await kv.get(DISPLAY_SETTINGS_KEY);
      const settings: DisplaySettings = { ...DEFAULT_DISPLAY_SETTINGS, ...(raw && typeof raw === 'object' ? raw : {}) };
      return c.json(settings);
    } catch (err: any) {
      console.log(`[Display Settings GET] Error: ${err.message}`);
      return c.json({ error: err.message }, 500);
    }
  });

  // ── PUT /display-settings — update asset page display settings ─
  app.put("/make-server-7b092b69/display-settings", async (c: any) => {
    try {
      const body = await c.req.json();
      const current = (await kv.get(DISPLAY_SETTINGS_KEY).catch(() => null)) || {};
      const settings: DisplaySettings = {
        ...DEFAULT_DISPLAY_SETTINGS,
        ...(current && typeof current === 'object' ? current : {}),
        ...(body && typeof body === 'object' ? body : {}),
      };
      // Validate
      settings.assetMinTvl = Math.max(0, Number(settings.assetMinTvl) || 0);
      settings.homeMinTvl = Math.max(0, Number(settings.homeMinTvl) || 0);
      settings.showZeroApy = Boolean(settings.showZeroApy);
      await kv.set(DISPLAY_SETTINGS_KEY, settings);
      console.log(`[Display Settings] Updated — minTvl: ${settings.assetMinTvl}, homeMinTvl: ${settings.homeMinTvl}, showZeroApy: ${settings.showZeroApy}`);
      return c.json({ success: true, ...settings });
    } catch (err: any) {
      console.log(`[Display Settings PUT] Error: ${err.message}`);
      return c.json({ error: err.message }, 500);
    }
  });
}