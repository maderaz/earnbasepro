/**
 * Registry routes — CRUD for Networks, Assets, Platforms, Curators.
 */
import * as kv from "./kv_store.tsx";
import { getSupabase, ensureBucket, ICONS_BUCKET } from "./helpers.tsx";

type RegistryType = 'network' | 'asset' | 'platform' | 'curator';

const registryKey = (type: RegistryType, id: string) =>
  `registry:${type}:${id.toLowerCase().trim()}`;

const getRegistryItems = async (type: RegistryType) => {
  const items = await kv.getByPrefix(`registry:${type}:`);
  return items || [];
};

export function registerRegistryRoutes(app: any) {
  // GET ALL registry data in one call
  app.get("/make-server-7b092b69/registry", async (c: any) => {
    try {
      const [networks, assets, platforms, curators] = await Promise.all([
        getRegistryItems('network'), getRegistryItems('asset'),
        getRegistryItems('platform'), getRegistryItems('curator'),
      ]);
      return c.json({ networks, assets, platforms, curators });
    } catch (err: any) { console.log(`[Registry ALL ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // Seed defaults
  app.post("/make-server-7b092b69/registry/seed", async (c: any) => {
    try {
      const existing = await kv.getByPrefix('registry:');
      if (existing && existing.length > 0) return c.json({ message: 'Registry already seeded', count: existing.length });

      const now = new Date().toISOString();
      const keys: string[] = [];
      const values: any[] = [];

      const defaultNetworks = [
        { id: 'ethereum', name: 'Ethereum', aliases: ['eth', 'mainnet', 'ethereum'], iconType: 'static' },
        { id: 'base', name: 'Base', aliases: ['base'], iconType: 'static' },
        { id: 'arbitrum', name: 'Arbitrum', aliases: ['arbitrum', 'arb'], iconType: 'static' },
        { id: 'bnb', name: 'BNB Chain', aliases: ['bnb', 'bsc', 'binance', 'bnb chain'], iconType: 'static' },
        { id: 'sonic', name: 'Sonic', aliases: ['sonic', 'fraxtal'], iconType: 'static' },
        { id: 'avalanche', name: 'Avalanche', aliases: ['avalanche', 'avax'], iconType: 'static' },
      ];
      for (const n of defaultNetworks) { keys.push(registryKey('network', n.id)); values.push({ ...n, _type: 'network', _id: n.id, updatedAt: now }); }

      const defaultAssets = [
        { id: 'usdc', ticker: 'USDC', name: 'USD Coin', iconType: 'static' },
        { id: 'usdt', ticker: 'USDT', name: 'Tether USD', iconType: 'static' },
        { id: 'eurc', ticker: 'EURC', name: 'Euro Coin', iconType: 'static' },
        { id: 'wbtc', ticker: 'WBTC', name: 'Wrapped Bitcoin', iconType: 'static' },
        { id: 'btc', ticker: 'BTC', name: 'Bitcoin', iconType: 'static' },
        { id: 'eth', ticker: 'ETH', name: 'Ethereum', iconType: 'static' },
      ];
      for (const a of defaultAssets) { keys.push(registryKey('asset', a.id)); values.push({ ...a, _type: 'asset', _id: a.id, updatedAt: now }); }

      await kv.mset(keys, values);
      return c.json({ success: true, seeded: keys.length });
    } catch (err: any) { console.log(`[Registry Seed ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // Upload icon
  app.post("/make-server-7b092b69/registry/upload-icon", async (c: any) => {
    try {
      await ensureBucket();
      const supabase = getSupabase();
      const formData = await c.req.formData();
      const file = formData.get('file') as File;
      const folder = (formData.get('folder') as string) || 'misc';
      if (!file) return c.json({ error: 'No file provided' }, 400);

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
      const path = `${folder}/${Date.now()}-${safeName}`;
      const arrayBuf = await file.arrayBuffer();
      const { data, error } = await supabase.storage.from(ICONS_BUCKET).upload(path, arrayBuf, { contentType: file.type || 'image/png', upsert: true });
      if (error) throw error;
      const { data: signedData, error: signError } = await supabase.storage.from(ICONS_BUCKET).createSignedUrl(path, 60 * 60 * 24 * 365);
      if (signError) throw signError;
      return c.json({ success: true, path, signedUrl: signedData?.signedUrl });
    } catch (err: any) { console.log(`[Registry Upload ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // GET items of a type
  app.get("/make-server-7b092b69/registry/:type", async (c: any) => {
    try {
      const type = c.req.param('type') as RegistryType;
      if (!['network', 'asset', 'platform', 'curator'].includes(type)) return c.json({ error: 'Invalid registry type' }, 400);
      return c.json(await getRegistryItems(type));
    } catch (err: any) { console.log(`[Registry GET ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // PUT upsert
  app.put("/make-server-7b092b69/registry/:type/:id", async (c: any) => {
    try {
      const type = c.req.param('type') as RegistryType;
      const id = c.req.param('id');
      if (!['network', 'asset', 'platform', 'curator'].includes(type)) return c.json({ error: 'Invalid registry type' }, 400);
      const body = await c.req.json();
      const payload = { ...body, _type: type, _id: id.toLowerCase().trim(), updatedAt: new Date().toISOString() };
      await kv.set(registryKey(type, id), payload);
      return c.json({ success: true, data: payload });
    } catch (err: any) { console.log(`[Registry PUT ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });

  // DELETE
  app.delete("/make-server-7b092b69/registry/:type/:id", async (c: any) => {
    try {
      const type = c.req.param('type') as RegistryType;
      const id = c.req.param('id');
      if (!['network', 'asset', 'platform', 'curator'].includes(type)) return c.json({ error: 'Invalid registry type' }, 400);
      await kv.del(registryKey(type, id));
      return c.json({ success: true });
    } catch (err: any) { console.log(`[Registry DELETE ERROR] ${err.message}`); return c.json({ error: err.message }, 500); }
  });
}
