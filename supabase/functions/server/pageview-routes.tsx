/**
 * Page view tracking routes — backed by `page_views` Supabase table.
 *
 * POST /pageviews/track       → INSERT into page_views
 * GET  /pageviews/daily       → daily totals (for BarChart timeline)
 * GET  /pageviews/top-pages   → aggregated by route, ranked by count
 * GET  /pageviews/referrers   → aggregated by referrer domain
 * GET  /pageviews/log         → individual events paginated
 * GET  /pageviews/visitors    → new vs returning visitor analysis
 * GET  /pageviews/recent-products?limit=5
 * GET  /pageviews/popular-products?limit=5
 */
import { getSupabase, fetchAllRows } from "./helpers.tsx";
import * as kv from "./kv_store.tsx";

const PREFIX = "/make-server-7b092b69";
const HIDDEN_VISITORS_KEY = "hidden_visitors";

// ── Bot detection (same patterns as clicks/searches) ─────────

const BOT_UA_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
  /headless/i, /phantom/i, /selenium/i, /puppeteer/i, /playwright/i,
  /wget/i, /curl/i, /python-requests/i, /axios/i, /node-fetch/i,
  /go-http-client/i, /java\//i, /libwww/i, /httpie/i,
  /googlebot/i, /bingbot/i, /yandexbot/i, /duckduckbot/i,
  /baiduspider/i, /sogou/i, /facebookexternalhit/i,
  /twitterbot/i, /linkedinbot/i, /discordbot/i,
  /applebot/i, /semrushbot/i, /ahrefsbot/i, /mj12bot/i,
  /dotbot/i, /petalbot/i, /bytespider/i,
];

function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.length < 10) return true;
  return BOT_UA_PATTERNS.some((p) => p.test(userAgent));
}

// ── UA Parser (lightweight) ──────────────────────────────────

function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "desktop";

  if (/Edg\//i.test(ua)) {
    const m = ua.match(/Edg\/([\d.]+)/);
    browser = `Edge ${m ? m[1].split(".")[0] : ""}`.trim();
  } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    const m = ua.match(/(?:OPR|Opera)\/([\d.]+)/);
    browser = `Opera ${m ? m[1].split(".")[0] : ""}`.trim();
  } else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) {
    const m = ua.match(/Chrome\/([\d.]+)/);
    browser = `Chrome ${m ? m[1].split(".")[0] : ""}`.trim();
  } else if (/Firefox\//i.test(ua)) {
    const m = ua.match(/Firefox\/([\d.]+)/);
    browser = `Firefox ${m ? m[1].split(".")[0] : ""}`.trim();
  } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    const m = ua.match(/Version\/([\d.]+)/);
    browser = `Safari ${m ? m[1].split(".")[0] : ""}`.trim();
  }

  if (/Windows NT 10/i.test(ua)) os = "Windows 10+";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) {
    const m = ua.match(/Mac OS X ([\d_]+)/);
    os = `macOS ${m ? m[1].replace(/_/g, ".").split(".").slice(0, 2).join(".") : ""}`.trim();
  } else if (/Android/i.test(ua)) {
    const m = ua.match(/Android ([\d.]+)/);
    os = `Android ${m ? m[1].split(".")[0] : ""}`.trim();
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    const m = ua.match(/OS ([\d_]+)/);
    os = `iOS ${m ? m[1].replace(/_/g, ".").split(".").slice(0, 2).join(".") : ""}`.trim();
  } else if (/Linux/i.test(ua)) os = "Linux";

  if (/Mobi|Android.*Mobile|iPhone|iPod/i.test(ua)) device = "mobile";
  else if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) device = "tablet";

  return { browser, os, device };
}

// ── Geo extraction ───────────────────────────────────────────

function extractGeo(c: any): { ip: string; country: string; region: string; city: string } {
  const h = (name: string): string => {
    try { return c.req.header(name) || ""; }
    catch { return ""; }
  };

  const ip =
    h("x-real-ip") ||
    h("x-forwarded-for")?.split(",")[0]?.trim() ||
    h("cf-connecting-ip") ||
    "";

  return {
    ip,
    country: h("cf-ipcountry") || h("x-country") || h("x-vercel-ip-country") || "",
    region: h("x-vercel-ip-country-region") || h("cf-region") || "",
    city: h("x-vercel-ip-city") || h("cf-ipcity") || "",
  };
}

function maskIp(ip: string): string {
  if (!ip) return "";
  if (ip.includes(".")) return ip.replace(/\.\d+$/, ".xxx");
  if (ip.includes(":")) return ip.replace(/:[^:]+$/, ":xxxx");
  return ip;
}

// ── Referrer domain extractor ────────────────────────────────

function extractDomain(referrer: string): string {
  if (!referrer) return "direct";
  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

// ── Route type classifier ────────────────────────────────────

function classifyRoute(route: string): string {
  if (route === "/") return "home";
  if (route.startsWith("/vault/")) return "vault";
  if (route === "/control-room" || route === "/add-product" || route === "/sitemap") return "internal";
  // /{ticker}/{network} or /{ticker}
  const segments = route.split("/").filter(Boolean);
  if (segments.length === 2) return "network";
  if (segments.length === 1) return "asset";
  return "other";
}

// ── Routes ───────────────────────────────────────────────────

export function registerPageViewRoutes(app: Hono) {

  /**
   * POST /pageviews/track
   * Body: { route, routeType?, tickerContext?, networkContext?, vaultSlug?, sessionId, ts, meta }
   */
  app.post(`${PREFIX}/pageviews/track`, async (c) => {
    try {
      const ua = c.req.header("user-agent");

      if (isBot(ua)) {
        return c.body(null, 204);
      }

      const body = await c.req.json();
      const {
        route, tickerContext, networkContext, vaultSlug,
        sessionId, ts, meta,
      } = body;

      if (!route || typeof route !== "string") {
        return c.json({ error: "Missing route" }, 400);
      }

      // Liveness check
      if (!ts || typeof ts !== "number" || Math.abs(Date.now() - ts) > 30_000) {
        return c.body(null, 204);
      }

      const uaParsed = parseUserAgent(ua || "");
      const geo = extractGeo(c);
      const clientMeta = meta || {};
      const referrer = clientMeta.referrer || "";

      const row = {
        route:            route,
        route_type:       classifyRoute(route),
        ticker_context:   tickerContext || "",
        network_context:  networkContext || "",
        vault_slug:       vaultSlug || "",
        session_id:       sessionId || "",
        referrer:         referrer,
        referrer_domain:  extractDomain(referrer),
        ip_masked:        maskIp(geo.ip),
        country_code:     geo.country,
        region:           geo.region,
        city:             geo.city,
        user_agent_raw:   ua || "",
        browser:          uaParsed.browser,
        os:               uaParsed.os,
        device_type:      uaParsed.device,
        language:         clientMeta.language || "",
        timezone:         clientMeta.timezone || "",
        screen_width:     clientMeta.screenWidth || 0,
        screen_height:    clientMeta.screenHeight || 0,
        is_bot:           false,
      };

      const supabase = getSupabase();
      const { error } = await supabase.from("page_views").insert(row);

      if (error) {
        console.log(`[PageViews] INSERT error: ${error.message}`);
        return c.json({ error: `Page view tracking insert failed: ${error.message}` }, 500);
      }

      return c.json({ ok: true });
    } catch (err: any) {
      console.log(`[PageViews] Track error: ${err.message}`);
      return c.json({ error: `Page view tracking failed: ${err.message}` }, 500);
    }
  });

  /**
   * GET /pageviews/daily
   * Daily page view totals, gap-filled. For timeline chart.
   */
  app.get(`${PREFIX}/pageviews/daily`, async (c) => {
    try {
      const data = await fetchAllRows("page_views", "viewed_at", {
        order: { column: "viewed_at", ascending: true },
      });

      if (data.length === 0) return c.json([]);

      const dailyMap = new Map<string, number>();
      for (const row of data) {
        const date = row.viewed_at.slice(0, 10);
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
      }

      const dates = [...dailyMap.keys()].sort();
      if (dates.length === 0) return c.json([]);

      const start = new Date(dates[0] + "T00:00:00Z");
      const end = new Date(dates[dates.length - 1] + "T00:00:00Z");
      const filled: { date: string; count: number }[] = [];

      for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        const ds = d.toISOString().slice(0, 10);
        filled.push({ date: ds, count: dailyMap.get(ds) || 0 });
      }

      return c.json(filled);
    } catch (err: any) {
      console.log(`[PageViews] Daily fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch daily page views: ${err.message}` }, 500);
    }
  });

  /**
   * GET /pageviews/top-pages?limit=30
   * Aggregated by route, ranked by count desc.
   */
  app.get(`${PREFIX}/pageviews/top-pages`, async (c) => {
    try {
      const limitParam = parseInt(c.req.query("limit") || "30", 10);
      const limit = Math.min(Math.max(1, limitParam), 200);

      const data = await fetchAllRows("page_views",
        "route, route_type, ticker_context, network_context, vault_slug, session_id, viewed_at",
        { order: { column: "viewed_at", ascending: false } }
      );

      if (data.length === 0) return c.json([]);

      // Aggregate by route
      const map = new Map<string, {
        route: string; routeType: string; tickerContext: string;
        networkContext: string; vaultSlug: string;
        count: number; uniqueSessions: Set<string>;
        lastViewedAt: string;
      }>();

      for (const row of data) {
        const key = row.route;
        const ts = row.viewed_at;
        const existing = map.get(key);
        if (existing) {
          existing.count += 1;
          if (row.session_id) existing.uniqueSessions.add(row.session_id);
          if (ts > existing.lastViewedAt) existing.lastViewedAt = ts;
        } else {
          const sessions = new Set<string>();
          if (row.session_id) sessions.add(row.session_id);
          map.set(key, {
            route: row.route,
            routeType: row.route_type,
            tickerContext: row.ticker_context || "",
            networkContext: row.network_context || "",
            vaultSlug: row.vault_slug || "",
            count: 1,
            uniqueSessions: sessions,
            lastViewedAt: ts,
          });
        }
      }

      const sorted = [...map.values()]
        .map(({ uniqueSessions, ...rest }) => ({
          ...rest,
          uniqueVisitors: uniqueSessions.size,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

      return c.json(sorted);
    } catch (err: any) {
      console.log(`[PageViews] Top pages fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch top pages: ${err.message}` }, 500);
    }
  });

  /**
   * GET /pageviews/referrers
   * Aggregated by referrer domain, ranked by count desc.
   */
  app.get(`${PREFIX}/pageviews/referrers`, async (c) => {
    try {
      const data = await fetchAllRows("page_views",
        "referrer_domain, session_id, viewed_at",
        { order: { column: "viewed_at", ascending: false } }
      );

      if (data.length === 0) return c.json([]);

      const map = new Map<string, {
        domain: string; count: number;
        uniqueSessions: Set<string>;
        lastSeenAt: string;
      }>();

      for (const row of data) {
        const domain = row.referrer_domain || "direct";
        const existing = map.get(domain);
        if (existing) {
          existing.count += 1;
          if (row.session_id) existing.uniqueSessions.add(row.session_id);
          if (row.viewed_at > existing.lastSeenAt) existing.lastSeenAt = row.viewed_at;
        } else {
          const sessions = new Set<string>();
          if (row.session_id) sessions.add(row.session_id);
          map.set(domain, {
            domain,
            count: 1,
            uniqueSessions: sessions,
            lastSeenAt: row.viewed_at,
          });
        }
      }

      const sorted = [...map.values()]
        .map(({ uniqueSessions, ...rest }) => ({
          ...rest,
          uniqueVisitors: uniqueSessions.size,
        }))
        .sort((a, b) => b.count - a.count);

      return c.json(sorted);
    } catch (err: any) {
      console.log(`[PageViews] Referrers fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch referrers: ${err.message}` }, 500);
    }
  });

  /**
   * GET /pageviews/log?limit=50&offset=0&source=search|ai|search,ai
   * Individual page view events, newest first.
   * `source` param filters by referrer_domain patterns (server-side).
   */
  app.get(`${PREFIX}/pageviews/log`, async (c) => {
    try {
      const limitParam = parseInt(c.req.query("limit") || "50", 10);
      const offsetParam = parseInt(c.req.query("offset") || "0", 10);
      const limit = Math.min(Math.max(1, limitParam), 500);
      const offset = Math.max(0, offsetParam);
      const sourceFilter = c.req.query("source") || "";

      const SEARCH_PATTERNS = [
        "google", "bing", "duckduckgo", "yahoo", "baidu", "yandex",
        "ecosia", "startpage", "brave", "qwant", "sogou", "naver",
      ];
      const AI_PATTERNS = [
        "chatgpt", "openai", "perplexity", "claude", "anthropic",
        "you.com", "phind", "copilot", "gemini", "bard", "poe", "kagi",
      ];

      const supabase = getSupabase();
      let query = supabase
        .from("page_views")
        .select("*", { count: "exact" })
        .order("viewed_at", { ascending: false });

      // Apply server-side referrer_domain filtering
      const sources = sourceFilter.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      const wantSearch = sources.includes("search");
      const wantAi = sources.includes("ai");

      if (wantSearch || wantAi) {
        const patterns: string[] = [];
        if (wantSearch) patterns.push(...SEARCH_PATTERNS);
        if (wantAi) patterns.push(...AI_PATTERNS);
        // Use ilike OR filters for referrer_domain
        const orClauses = patterns.map(p => `referrer_domain.ilike.%${p}%`).join(",");
        query = query.or(orClauses);
      }

      const { data, error, count } = await query.range(offset, offset + limit - 1);

      if (error) {
        console.log(`[PageViews] Log query error: ${error.message}`);
        return c.json({ error: `Failed to fetch page view log: ${error.message}` }, 500);
      }

      const events = (data || []).map((row: any) => ({
        id:              row.id,
        route:           row.route,
        routeType:       row.route_type,
        tickerContext:   row.ticker_context || "",
        networkContext:  row.network_context || "",
        vaultSlug:       row.vault_slug || "",
        sessionId:       row.session_id || "",
        referrer:        row.referrer || "",
        referrerDomain:  row.referrer_domain || "direct",
        timestamp:       row.viewed_at,
        ip:              row.ip_masked || "",
        country:         row.country_code || "",
        region:          row.region || "",
        city:            row.city || "",
        browser:         row.browser || "",
        os:              row.os || "",
        device:          row.device_type || "desktop",
        language:        row.language || "",
        timezone:        row.timezone || "",
        screenWidth:     row.screen_width || 0,
        screenHeight:    row.screen_height || 0,
      }));

      return c.json({ events, total: count ?? events.length });
    } catch (err: any) {
      console.log(`[PageViews] Log fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch page view log: ${err.message}` }, 500);
    }
  });

  /**
   * GET /pageviews/visitors
   * New vs Returning visitor analysis using a privacy-friendly fingerprint
   * built from ip_masked + browser + os + device_type + screen dimensions.
   *
   * Returns:
   *   summary  — totalUnique, newCount, returningCount, returnRate
   *   daily[]  — { date, newVisitors, returningVisitors, totalVisitors }
   */
  app.get(`${PREFIX}/pageviews/visitors`, async (c) => {
    try {
      const data = await fetchAllRows("page_views",
        "ip_masked, browser, os, device_type, screen_width, screen_height, viewed_at",
        {
          order: { column: "viewed_at", ascending: true },
          eq: { column: "is_bot", value: false },
        }
      );

      if (data.length === 0) {
        return c.json({
          summary: { totalUnique: 0, newCount: 0, returningCount: 0, returnRate: 0 },
          daily: [],
        });
      }

      // Build fingerprint → first-seen-date map
      const firstSeenMap = new Map<string, string>(); // fingerprint → YYYY-MM-DD
      const dailyVisitors = new Map<string, { newSet: Set<string>; retSet: Set<string> }>();

      for (const row of data) {
        const fp = `${row.ip_masked}|${row.browser}|${row.os}|${row.device_type}|${row.screen_width}x${row.screen_height}`;
        const date = row.viewed_at.slice(0, 10);

        if (!firstSeenMap.has(fp)) {
          firstSeenMap.set(fp, date);
        }

        if (!dailyVisitors.has(date)) {
          dailyVisitors.set(date, { newSet: new Set(), retSet: new Set() });
        }

        const dayBucket = dailyVisitors.get(date)!;
        const isNew = firstSeenMap.get(fp) === date;

        if (isNew) {
          dayBucket.newSet.add(fp);
        } else {
          dayBucket.retSet.add(fp);
        }
      }

      // Summary
      const totalUnique = firstSeenMap.size;
      // A visitor is "returning" if they appear on more than one distinct day
      const daysByFp = new Map<string, Set<string>>();
      for (const row of data) {
        const fp = `${row.ip_masked}|${row.browser}|${row.os}|${row.device_type}|${row.screen_width}x${row.screen_height}`;
        const date = row.viewed_at.slice(0, 10);
        if (!daysByFp.has(fp)) daysByFp.set(fp, new Set());
        daysByFp.get(fp)!.add(date);
      }
      let returningCount = 0;
      for (const [, days] of daysByFp) {
        if (days.size > 1) returningCount++;
      }
      const newCount = totalUnique - returningCount;
      const returnRate = totalUnique > 0 ? Math.round((returningCount / totalUnique) * 100) : 0;

      // Gap-fill daily
      const sortedDates = [...dailyVisitors.keys()].sort();
      const filled: { date: string; newVisitors: number; returningVisitors: number; totalVisitors: number }[] = [];

      if (sortedDates.length > 0) {
        const start = new Date(sortedDates[0] + "T00:00:00Z");
        const end = new Date(sortedDates[sortedDates.length - 1] + "T00:00:00Z");
        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
          const ds = d.toISOString().slice(0, 10);
          const bucket = dailyVisitors.get(ds);
          const nv = bucket ? bucket.newSet.size : 0;
          const rv = bucket ? bucket.retSet.size : 0;
          filled.push({ date: ds, newVisitors: nv, returningVisitors: rv, totalVisitors: nv + rv });
        }
      }

      return c.json({
        summary: { totalUnique, newCount, returningCount, returnRate },
        daily: filled,
      });
    } catch (err: any) {
      console.log(`[PageViews] Visitors fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch visitor insights: ${err.message}` }, 500);
    }
  });

  /**
   * GET /pageviews/recent-products?limit=5
   * Returns the most recently viewed vault/product pages (deduplicated by vault_slug).
   * Response: { slug, route, viewedAt }[]
   */
  app.get(`${PREFIX}/pageviews/recent-products`, async (c) => {
    try {
      const limitParam = parseInt(c.req.query("limit") || "5", 10);
      const limit = Math.min(Math.max(1, limitParam), 20);

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("page_views")
        .select("vault_slug, route, viewed_at")
        .eq("route_type", "vault")
        .neq("vault_slug", "")
        .eq("is_bot", false)
        .order("viewed_at", { ascending: false })
        .limit(200);

      if (error) {
        console.log(`[PageViews] Recent products query error: ${error.message}`);
        return c.json({ error: `Failed to fetch recent products: ${error.message}` }, 500);
      }

      // Deduplicate by vault_slug, keep most recent
      const seen = new Set<string>();
      const results: { slug: string; route: string; viewedAt: string }[] = [];
      for (const row of (data || [])) {
        if (seen.has(row.vault_slug)) continue;
        seen.add(row.vault_slug);
        results.push({ slug: row.vault_slug, route: row.route, viewedAt: row.viewed_at });
        if (results.length >= limit) break;
      }

      return c.json(results);
    } catch (err: any) {
      console.log(`[PageViews] Recent products error: ${err.message}`);
      return c.json({ error: `Failed to fetch recent products: ${err.message}` }, 500);
    }
  });

  /**
   * GET /pageviews/popular-products?limit=5
   * Returns the most viewed vault/product pages in the past 30 days, ranked by view count.
   * Deduplicates by ticker_context so the result shows diverse assets.
   * Response: { slug, route, views, uniqueVisitors, ticker }[]
   */
  app.get(`${PREFIX}/pageviews/popular-products`, async (c) => {
    try {
      const limitParam = parseInt(c.req.query("limit") || "5", 10);
      const limit = Math.min(Math.max(1, limitParam), 20);

      // Rolling 30 days
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("page_views")
        .select("vault_slug, route, ticker_context, session_id, viewed_at")
        .eq("route_type", "vault")
        .neq("vault_slug", "")
        .eq("is_bot", false)
        .gte("viewed_at", thirtyDaysAgo)
        .order("viewed_at", { ascending: false });

      if (error) {
        console.log(`[PageViews] Popular products query error: ${error.message}`);
        return c.json({ error: `Failed to fetch popular products: ${error.message}` }, 500);
      }

      // Aggregate by vault_slug
      const map = new Map<string, { slug: string; route: string; ticker: string; views: number; sessions: Set<string> }>();
      for (const row of (data || [])) {
        const key = row.vault_slug;
        const existing = map.get(key);
        if (existing) {
          existing.views += 1;
          if (row.session_id) existing.sessions.add(row.session_id);
        } else {
          const sessions = new Set<string>();
          if (row.session_id) sessions.add(row.session_id);
          map.set(key, { slug: key, route: row.route, ticker: row.ticker_context || "", views: 1, sessions });
        }
      }

      // Sort by views desc, then pick top per unique ticker
      const sorted = [...map.values()].sort((a, b) => b.views - a.views);
      const seenTickers = new Set<string>();
      const results: { slug: string; route: string; ticker: string; views: number; uniqueVisitors: number }[] = [];

      for (const item of sorted) {
        const tk = item.ticker.toUpperCase() || item.slug; // fallback key
        if (seenTickers.has(tk)) continue;
        seenTickers.add(tk);
        results.push({
          slug: item.slug,
          route: item.route,
          ticker: item.ticker,
          views: item.views,
          uniqueVisitors: item.sessions.size,
        });
        if (results.length >= limit) break;
      }

      return c.json(results);
    } catch (err: any) {
      console.log(`[PageViews] Popular products error: ${err.message}`);
      return c.json({ error: `Failed to fetch popular products: ${err.message}` }, 500);
    }
  });

  // ── Hidden Visitors (fingerprint-based blocklist) ──────────

  /**
   * GET /pageviews/hidden-visitors
   * Returns array of { fingerprint, label, hiddenAt }
   */
  app.get(`${PREFIX}/pageviews/hidden-visitors`, async (c) => {
    try {
      const raw = await kv.get(HIDDEN_VISITORS_KEY);
      const list = Array.isArray(raw) ? raw : [];
      return c.json(list);
    } catch (err: any) {
      console.log(`[HiddenVisitors] GET error: ${err.message}`);
      return c.json({ error: err.message }, 500);
    }
  });

  /**
   * POST /pageviews/hidden-visitors
   * Body: { fingerprint, label }
   * Adds a visitor fingerprint to the hidden list.
   */
  app.post(`${PREFIX}/pageviews/hidden-visitors`, async (c) => {
    try {
      const body = await c.req.json();
      const { fingerprint, label } = body;
      if (!fingerprint || typeof fingerprint !== 'string') {
        return c.json({ error: 'Missing fingerprint' }, 400);
      }
      const raw = await kv.get(HIDDEN_VISITORS_KEY).catch(() => null);
      const list: { fingerprint: string; label: string; hiddenAt: string }[] = Array.isArray(raw) ? raw : [];
      // Avoid duplicates
      if (list.some(item => item.fingerprint === fingerprint)) {
        return c.json({ success: true, message: 'Already hidden', list });
      }
      list.push({ fingerprint, label: label || fingerprint, hiddenAt: new Date().toISOString() });
      await kv.set(HIDDEN_VISITORS_KEY, list);
      console.log(`[HiddenVisitors] Added: ${label || fingerprint}`);
      return c.json({ success: true, list });
    } catch (err: any) {
      console.log(`[HiddenVisitors] POST error: ${err.message}`);
      return c.json({ error: err.message }, 500);
    }
  });

  /**
   * DELETE /pageviews/hidden-visitors
   * Body: { fingerprint }
   * Removes a visitor fingerprint from the hidden list.
   */
  app.delete(`${PREFIX}/pageviews/hidden-visitors`, async (c) => {
    try {
      const body = await c.req.json();
      const { fingerprint } = body;
      if (!fingerprint) return c.json({ error: 'Missing fingerprint' }, 400);
      const raw = await kv.get(HIDDEN_VISITORS_KEY).catch(() => null);
      let list: { fingerprint: string; label: string; hiddenAt: string }[] = Array.isArray(raw) ? raw : [];
      list = list.filter(item => item.fingerprint !== fingerprint);
      await kv.set(HIDDEN_VISITORS_KEY, list);
      console.log(`[HiddenVisitors] Removed: ${fingerprint}`);
      return c.json({ success: true, list });
    } catch (err: any) {
      console.log(`[HiddenVisitors] DELETE error: ${err.message}`);
      return c.json({ error: err.message }, 500);
    }
  });
}