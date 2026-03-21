/**
 * Rule routes — Extract Curator, Consolidate Names, Sync Index → Products,
 * Unique Values, Rule #5 Exclusions, Sitemap.
 */
import * as kv from "./kv_store.tsx";
import { getSupabase, getIndexLookup, applyIndexShield, generateVaultSlug, RULE5_EXCLUSIONS_KEY } from "./helpers.tsx";

export function registerRuleRoutes(app: any) {

  // EXTRACT CURATOR -- Rule #2
  app.post("/make-server-7b092b69/extract-curator", async (c: any) => {
    try {
      const supabase = getSupabase();
      const { curatorName, dryRun = true, excludeIds = [] } = await c.req.json();
      if (!curatorName || typeof curatorName !== 'string' || !curatorName.trim()) return c.json({ error: 'curatorName is required' }, 400);

      const curator = curatorName.trim();
      const prefixPattern = `${curator}%`;
      const parenPattern = `%(${curator})%`;

      const detectProductNameCol = async (table: string): Promise<string | null> => {
        const { error: e1 } = await supabase.from(table).select('productName').limit(1);
        if (!e1) return 'productName';
        const { error: e2 } = await supabase.from(table).select('product_name').limit(1);
        if (!e2) return 'product_name';
        return null;
      };

      const productsCol = await detectProductNameCol('Products');
      const indexCol = await detectProductNameCol('Index');
      console.log(`[Extract Curator] Detected columns — Products: ${productsCol}, Index: ${indexCol}`);

      const searchTable = async (table: string, col: string): Promise<any[]> => {
        const { data: prefixData, error: e1 } = await supabase.from(table).select('*').ilike(col, prefixPattern);
        if (e1) throw new Error(`${table} prefix search failed: ${e1.message}`);
        const { data: parenData, error: e2 } = await supabase.from(table).select('*').ilike(col, parenPattern);
        if (e2) throw new Error(`${table} parentheses search failed: ${e2.message}`);
        const seen = new Set<number>(); const merged: any[] = [];
        for (const row of [...(prefixData || []), ...(parenData || [])]) { if (!seen.has(row.id)) { seen.add(row.id); merged.push(row); } }
        return merged;
      };

      let productsRows: any[] = []; if (productsCol) productsRows = await searchTable('Products', productsCol);
      let indexRows: any[] = []; if (indexCol) indexRows = await searchTable('Index', indexCol);

      const stripCurator = (name: string): string => {
        const escaped = curator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        let result = name;
        result = result.replace(new RegExp(`\\s*\\(${escaped}\\)`, 'i'), '');
        result = result.replace(new RegExp(`^${escaped}\\s+`, 'i'), '');
        return result.replace(/^[-–—·:\s]+|[-–—·:\s]+$/g, '').trim();
      };

      const productsChanges = (productsRows || []).map((row: any) => {
        const oldName = row.productName || row.product_name || '';
        return { table: 'Products', id: row.id, oldProductName: oldName, newProductName: stripCurator(oldName), oldCurator: row.curator || '-', newCurator: curator, platform: row.platform || row.platform_name || '', network: row.network || '', ticker: row.vault || row.ticker || '' };
      });
      const indexChanges = (indexRows || []).map((row: any) => {
        const oldName = row.productName || row.product_name || '';
        return { table: 'Index', id: row.id, oldProductName: oldName, newProductName: stripCurator(oldName), oldCurator: row.curator || '-', newCurator: curator, platform: row.platform || row.platform_name || '', network: row.network || '', ticker: row.vault || row.ticker || '' };
      });
      const allChanges = [...productsChanges, ...indexChanges];

      if (dryRun) return c.json({ dryRun: true, curatorName: curator, productsFound: productsChanges.length, indexFound: indexChanges.length, changes: allChanges });

      const excludeSet = new Set((excludeIds || []).map((e: any) => `${e.table}:${e.id}`));
      const filteredProductsChanges = productsChanges.filter((ch: any) => !excludeSet.has(`${ch.table}:${ch.id}`));
      const filteredIndexChanges = indexChanges.filter((ch: any) => !excludeSet.has(`${ch.table}:${ch.id}`));

      let productsUpdated = 0, indexUpdated = 0;
      for (const ch of filteredProductsChanges) {
        const updatePayload: any = { curator: ch.newCurator }; if (productsCol) updatePayload[productsCol] = ch.newProductName;
        const { error } = await supabase.from('Products').update(updatePayload).eq('id', ch.id);
        if (error) console.log(`[Extract Curator ERROR] Products id=${ch.id}: ${error.message}`); else productsUpdated++;
      }
      for (const ch of filteredIndexChanges) {
        const updatePayload: any = { curator: ch.newCurator }; if (indexCol) updatePayload[indexCol] = ch.newProductName;
        const { error } = await supabase.from('Index').update(updatePayload).eq('id', ch.id);
        if (error) console.log(`[Extract Curator ERROR] Index id=${ch.id}: ${error.message}`); else indexUpdated++;
      }
      return c.json({ dryRun: false, curatorName: curator, productsUpdated, indexUpdated, changes: allChanges });
    } catch (err: any) { console.log(`[Extract Curator ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // CONSOLIDATE NAMES -- Rule #3
  app.post("/make-server-7b092b69/consolidate-names", async (c: any) => {
    try {
      const supabase = getSupabase();
      const { field, sourceNames, targetName, dryRun = true } = await c.req.json();
      if (!field || !['platform_name', 'curator'].includes(field)) return c.json({ error: 'Invalid field' }, 400);
      if (!Array.isArray(sourceNames) || sourceNames.length === 0) return c.json({ error: 'sourceNames required' }, 400);
      if (!targetName || !targetName.trim()) return c.json({ error: 'targetName required' }, 400);

      const canonical = targetName.trim();
      const names = sourceNames.map((n: string) => n.trim()).filter(Boolean);

      const detectColumns = async (table: string): Promise<string[]> => {
        if (field === 'curator') return ['curator'];
        const cols: string[] = [];
        for (const col of ['platform', 'platform_name', 'platformName']) { const { error } = await supabase.from(table).select(col).limit(1); if (!error) cols.push(col); }
        return cols;
      };

      const productsCols = await detectColumns('Products');
      const indexCols = await detectColumns('Index');

      const searchTable = async (table: string, cols: string[]): Promise<any[]> => {
        if (cols.length === 0) return [];
        const allRows: any[] = []; const seen = new Set<number>();
        for (const col of cols) { for (const name of names) { const { data } = await supabase.from(table).select('*').ilike(col, name); for (const row of (data || [])) { if (!seen.has(row.id)) { seen.add(row.id); allRows.push(row); } } } }
        return allRows;
      };

      const productsRows = await searchTable('Products', productsCols);
      const indexRows = await searchTable('Index', indexCols);

      const buildChanges = (rows: any[], table: string) => rows.map((row: any) => ({
        table, id: row.id, field,
        oldValue: field === 'curator' ? (row.curator || '-') : (row.platform || row.platform_name || row.platformName || 'Unknown'),
        newValue: canonical,
        productName: row.productName || row.product_name || 'Untitled',
        ticker: row.vault || row.ticker || '', network: row.network || '',
      }));

      const allChanges = [...buildChanges(productsRows, 'Products'), ...buildChanges(indexRows, 'Index')];
      if (dryRun) return c.json({ dryRun: true, field, targetName: canonical, changes: allChanges });

      let productsUpdated = 0, indexUpdated = 0;
      for (const ch of buildChanges(productsRows, 'Products')) {
        const payload: Record<string, string> = {}; for (const col of productsCols) payload[col] = canonical;
        const { error } = await supabase.from('Products').update(payload).eq('id', ch.id);
        if (!error) productsUpdated++;
      }
      for (const ch of buildChanges(indexRows, 'Index')) {
        const payload: Record<string, string> = {}; for (const col of indexCols) payload[col] = canonical;
        const { error } = await supabase.from('Index').update(payload).eq('id', ch.id);
        if (!error) indexUpdated++;
      }
      return c.json({ dryRun: false, field, targetName: canonical, productsUpdated, indexUpdated, changes: allChanges });
    } catch (err: any) { console.log(`[Consolidate ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // SYNC NAMES FROM INDEX -> PRODUCTS -- Rule #4
  app.post("/make-server-7b092b69/sync-names-from-index", async (c: any) => {
    try {
      const supabase = getSupabase();
      const { dryRun = true } = await c.req.json();
      const [{ data: productsData, error: pErr }, { data: indexData, error: iErr }] = await Promise.all([supabase.from('Products').select('*'), supabase.from('Index').select('*')]);
      if (pErr) throw new Error(`Products fetch failed: ${pErr.message}`);
      if (iErr) throw new Error(`Index fetch failed: ${iErr.message}`);

      const sampleProduct = (productsData && productsData.length > 0) ? Object.keys(productsData[0]) : [];
      const productsNameCols = ['productName', 'product_name'].filter(c => sampleProduct.includes(c));
      const productsCuratorCols = ['curator'].filter(c => sampleProduct.includes(c));
      const productsPlatformCols = ['platform', 'platform_name', 'platformName'].filter(c => sampleProduct.includes(c));

      const getDefillamaId = (row: any): string => (row.defillamaId || row.defillamaID || row.defillama_id || row.defillama_link || '').toString().toLowerCase().trim();
      const getProductName = (row: any): string => (row.productName || row.product_name || '').trim();
      const getCurator = (row: any): string => (row.curator || '').trim();
      const getPlatform = (row: any): string => (row.platform || row.platform_name || row.platformName || '').trim();

      const indexByDid = new Map<string, any>();
      for (const row of (indexData || [])) { const did = getDefillamaId(row); if (did) indexByDid.set(did, row); }

      const mismatches: any[] = [];
      for (const pRow of (productsData || [])) {
        const did = getDefillamaId(pRow); if (!did) continue;
        const iRow = indexByDid.get(did); if (!iRow) continue;
        const pName = getProductName(pRow), iName = getProductName(iRow);
        const pCurator = getCurator(pRow), iCurator = getCurator(iRow);
        const pPlatform = getPlatform(pRow), iPlatform = getPlatform(iRow);
        const nameChanged = pName !== iName && iName !== '';
        const curatorChanged = pCurator !== iCurator && iCurator !== '';
        const platformChanged = pPlatform !== iPlatform && iPlatform !== '';
        if (nameChanged || curatorChanged || platformChanged) {
          mismatches.push({ productsId: pRow.id, indexId: iRow.id, defillamaId: did, ticker: pRow.vault || pRow.ticker || '', network: pRow.network || '', platform: pPlatform,
            oldProductName: pName, newProductName: nameChanged ? iName : pName, oldCurator: pCurator || '-', newCurator: curatorChanged ? iCurator : pCurator || '-',
            oldPlatform: pPlatform || '-', newPlatform: platformChanged ? iPlatform : pPlatform || '-', nameChanged, curatorChanged, platformChanged });
        }
      }

      if (dryRun) return c.json({ dryRun: true, productsCount: productsData?.length || 0, indexCount: indexData?.length || 0, matchedCount: indexByDid.size, mismatchCount: mismatches.length, mismatches });

      let updated = 0, errors = 0, firstError = '';
      for (const m of mismatches) {
        const payload: Record<string, string> = {};
        if (m.nameChanged && productsNameCols.length > 0) for (const col of productsNameCols) payload[col] = m.newProductName;
        if (m.curatorChanged && productsCuratorCols.length > 0) payload['curator'] = m.newCurator;
        if (m.platformChanged && productsPlatformCols.length > 0) for (const col of productsPlatformCols) payload[col] = m.newPlatform;
        if (Object.keys(payload).length === 0) continue;
        const { error } = await supabase.from('Products').update(payload).eq('id', m.productsId);
        if (error) { if (!firstError) firstError = `Products id=${m.productsId}: ${error.message}`; errors++; } else updated++;
      }
      return c.json({ dryRun: false, updated, errors, total: mismatches.length, firstError: firstError || null, mismatches });
    } catch (err: any) { console.log(`[Sync Names ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // UNIQUE VALUES
  app.get("/make-server-7b092b69/unique-values/:field", async (c: any) => {
    try {
      const supabase = getSupabase();
      const field = c.req.param('field');
      if (!['platform_name', 'curator'].includes(field)) return c.json({ error: 'Invalid field' }, 400);
      const selectCols = field === 'curator' ? 'id,curator' : 'id,platform,platform_name,platformName';
      const { data: productsData, error: pErr } = await supabase.from('Products').select(selectCols);
      if (pErr) throw new Error(`Products query failed: ${pErr.message}`);
      const { data: indexData, error: iErr } = await supabase.from('Index').select(selectCols);
      if (iErr) throw new Error(`Index query failed: ${iErr.message}`);

      const counts = new Map<string, { products: number; index: number }>();
      const getValue = (row: any): string => field === 'curator' ? (row.curator || '-').trim() : (row.platform || row.platform_name || row.platformName || 'Unknown').trim();
      for (const row of (productsData || [])) { const val = getValue(row); const entry = counts.get(val) || { products: 0, index: 0 }; entry.products++; counts.set(val, entry); }
      for (const row of (indexData || [])) { const val = getValue(row); const entry = counts.get(val) || { products: 0, index: 0 }; entry.index++; counts.set(val, entry); }

      const result = Array.from(counts.entries()).map(([name, c]) => ({ name, products: c.products, index: c.index, total: c.products + c.index })).sort((a, b) => b.total - a.total);
      return c.json(result);
    } catch (err: any) { console.log(`[Unique Values ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // SITEMAP.XML
  app.get("/make-server-7b092b69/sitemap.xml", async (c: any) => {
    try {
      const supabase = getSupabase();
      const BASE_URL = 'https://earnbase.finance';
      const today = new Date().toISOString().split('T')[0];
      const [{ data: products, error }, indexMap] = await Promise.all([supabase.from('Products').select('*'), getIndexLookup()]);
      if (error) throw new Error(`Products fetch failed: ${error.message}`);

      const tickerSet = new Set<string>(); const networkSet = new Set<string>();
      const vaultUrls: { url: string; priority: string }[] = [];
      for (const p of (products || [])) {
        const ticker = (p.vault || p.ticker || '').toLowerCase().trim();
        const network = (p.network || '').trim();
        const networkSlug = network.toLowerCase().replace(/\s+/g, '-');
        const corrected = applyIndexShield(p, indexMap);
        if (ticker) { tickerSet.add(ticker); if (networkSlug) networkSet.add(`${ticker}/${networkSlug}`); }
        if (ticker && corrected.product_name && corrected.platform_name) {
          const slug = generateVaultSlug(ticker, corrected.product_name, corrected.platform_name, corrected.curator && corrected.curator !== '-' ? corrected.curator : null, network);
          vaultUrls.push({ url: `${BASE_URL}/vault/${slug}`, priority: '0.6' });
        }
      }

      const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      xml += `  <url>\n    <loc>${BASE_URL}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
      for (const ticker of Array.from(tickerSet).sort()) xml += `  <url>\n    <loc>${escapeXml(`${BASE_URL}/${ticker}`)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      for (const path of Array.from(networkSet).sort()) xml += `  <url>\n    <loc>${escapeXml(`${BASE_URL}/${path}`)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      const seenSlugs = new Set<string>();
      for (const v of vaultUrls) { if (seenSlugs.has(v.url)) continue; seenSlugs.add(v.url); xml += `  <url>\n    <loc>${escapeXml(v.url)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${v.priority}</priority>\n  </url>\n`; }
      xml += '</urlset>';

      console.log(`[Sitemap] Generated: ${1 + tickerSet.size + networkSet.size + seenSlugs.size} URLs`);
      return new Response(xml, { status: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
    } catch (err: any) { console.log(`[Sitemap ERROR] ${err.message}`); return new Response(`<!-- Error: ${err.message} -->`, { status: 500, headers: { 'Content-Type': 'application/xml' } }); }
  });

  // RULE #5 — Yield Micro-Deviation Exclusions
  app.get("/make-server-7b092b69/rule5-exclusions", async (c: any) => {
    try { const data = await kv.get(RULE5_EXCLUSIONS_KEY); return c.json({ ids: data?.ids || [], updatedAt: data?.updatedAt || null }); }
    catch (err: any) { console.log(`[Rule5 GET ERROR] ${err.message}`); return c.json({ ids: [], updatedAt: null }); }
  });

  app.put("/make-server-7b092b69/rule5-exclusions", async (c: any) => {
    try {
      const { ids } = await c.req.json();
      if (!Array.isArray(ids)) return c.json({ error: 'ids must be an array' }, 400);
      const uniqueIds = [...new Set(ids.map((id: any) => Number(id)).filter((n: number) => !isNaN(n) && n > 0))];
      const payload = { ids: uniqueIds, updatedAt: new Date().toISOString(), count: uniqueIds.length };
      await kv.set(RULE5_EXCLUSIONS_KEY, payload);
      console.log(`[Rule5 Exclusions] Saved ${uniqueIds.length} exclusion(s)`);
      return c.json({ success: true, ...payload });
    } catch (err: any) { console.log(`[Rule5 PUT ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });
}