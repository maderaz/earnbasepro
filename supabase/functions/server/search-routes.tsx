/**
 * Search tracking routes — backed by `search_events` Supabase table.
 *
 * POST /searches/track   → INSERT into search_events
 * GET  /searches         → aggregated per-query ranking
 * GET  /searches/daily   → daily totals (for BarChart timeline)
 * GET  /searches/log     → individual events paginated (for Log tab)
 */
import type { Hono } from "npm:hono";
import { getSupabase, fetchAllRows } from "./helpers.tsx";

const PREFIX = "/make-server-7b092b69";

// ── Bot detection (reuse same patterns as clicks) ────────────

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

// ── Routes ───────────────────────────────────────────────────

export function registerSearchRoutes(app: Hono) {

  /**
   * POST /searches/track
   * Body: { query, resultsCount, pageContext, tickerContext, networkContext, ts, meta }
   */
  app.post(`${PREFIX}/searches/track`, async (c) => {
    try {
      const ua = c.req.header("user-agent");

      if (isBot(ua)) {
        return c.body(null, 204);
      }

      const body = await c.req.json();
      const {
        query, resultsCount, pageContext, tickerContext, networkContext,
        ts, meta,
      } = body;

      if (!query || typeof query !== "string" || query.trim().length < 2) {
        return c.json({ error: "Missing or too short query" }, 400);
      }

      // Liveness: client timestamp within 30s
      if (!ts || typeof ts !== "number" || Math.abs(Date.now() - ts) > 30_000) {
        return c.body(null, 204);
      }

      const uaParsed = parseUserAgent(ua || "");
      const geo = extractGeo(c);
      const clientMeta = meta || {};

      const row = {
        query:           query.trim().toLowerCase(),
        query_raw:       query.trim(),
        results_count:   typeof resultsCount === "number" ? resultsCount : 0,
        page_context:    pageContext || "/",
        ticker_context:  tickerContext || "",
        network_context: networkContext || "",
        ip_masked:       maskIp(geo.ip),
        country_code:    geo.country,
        region:          geo.region,
        city:            geo.city,
        user_agent_raw:  ua || "",
        browser:         uaParsed.browser,
        os:              uaParsed.os,
        device_type:     uaParsed.device,
        language:        clientMeta.language || "",
        timezone:        clientMeta.timezone || "",
        screen_width:    clientMeta.screenWidth || 0,
        screen_height:   clientMeta.screenHeight || 0,
        referrer:        clientMeta.referrer || "",
        is_bot:          false,
      };

      const supabase = getSupabase();
      const { error } = await supabase.from("search_events").insert(row);

      if (error) {
        console.log(`[Searches] INSERT error: ${error.message}`);
        return c.json({ error: `Search tracking insert failed: ${error.message}` }, 500);
      }

      return c.json({ ok: true });
    } catch (err: any) {
      console.log(`[Searches] Track error: ${err.message}`);
      return c.json({ error: `Search tracking failed: ${err.message}` }, 500);
    }
  });

  /**
   * GET /searches
   * Aggregated search queries ranked by frequency.
   */
  app.get(`${PREFIX}/searches`, async (c) => {
    try {
      const data = await fetchAllRows("search_events",
        "query, query_raw, results_count, searched_at",
        { order: { column: "searched_at", ascending: false } }
      );

      // Aggregate by normalized query
      const map = new Map<string, {
        query: string; queryRaw: string; count: number;
        avgResults: number; totalResults: number;
        lastSearchedAt: string; firstSearchedAt: string;
      }>();

      for (const row of (data || [])) {
        const key = row.query;
        const ts = row.searched_at;
        const existing = map.get(key);
        if (existing) {
          existing.count += 1;
          existing.totalResults += row.results_count || 0;
          existing.avgResults = Math.round(existing.totalResults / existing.count);
          if (ts > existing.lastSearchedAt) {
            existing.lastSearchedAt = ts;
            existing.queryRaw = row.query_raw; // keep most recent casing
          }
          if (ts < existing.firstSearchedAt) existing.firstSearchedAt = ts;
        } else {
          map.set(key, {
            query: row.query,
            queryRaw: row.query_raw || row.query,
            count: 1,
            totalResults: row.results_count || 0,
            avgResults: row.results_count || 0,
            lastSearchedAt: ts,
            firstSearchedAt: ts,
          });
        }
      }

      const sorted = [...map.values()].sort((a, b) => b.count - a.count);
      return c.json(sorted);
    } catch (err: any) {
      console.log(`[Searches] Fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch searches: ${err.message}` }, 500);
    }
  });

  /**
   * GET /searches/log?limit=50&offset=0
   * Individual search events, newest first.
   */
  app.get(`${PREFIX}/searches/log`, async (c) => {
    try {
      const limitParam = parseInt(c.req.query("limit") || "50", 10);
      const offsetParam = parseInt(c.req.query("offset") || "0", 10);
      const limit = Math.min(Math.max(1, limitParam), 500);
      const offset = Math.max(0, offsetParam);

      const supabase = getSupabase();
      const { data, error, count } = await supabase
        .from("search_events")
        .select("*", { count: "exact" })
        .order("searched_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.log(`[Searches] Log query error: ${error.message}`);
        return c.json({ error: `Failed to fetch search log: ${error.message}` }, 500);
      }

      const events = (data || []).map((row: any) => ({
        id:             row.id,
        query:          row.query,
        queryRaw:       row.query_raw || row.query,
        resultsCount:   row.results_count || 0,
        pageContext:    row.page_context || "/",
        tickerContext:  row.ticker_context || "",
        networkContext: row.network_context || "",
        timestamp:      row.searched_at,
        ip:             row.ip_masked || "",
        country:        row.country_code || "",
        region:         row.region || "",
        city:           row.city || "",
        browser:        row.browser || "",
        os:             row.os || "",
        device:         row.device_type || "desktop",
        language:       row.language || "",
        timezone:       row.timezone || "",
        screenWidth:    row.screen_width || 0,
        screenHeight:   row.screen_height || 0,
        referrer:       row.referrer || "",
      }));

      return c.json({ events, total: count ?? events.length });
    } catch (err: any) {
      console.log(`[Searches] Log fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch search log: ${err.message}` }, 500);
    }
  });

  /**
   * GET /searches/daily
   * Daily search totals, gap-filled. For timeline chart.
   */
  app.get(`${PREFIX}/searches/daily`, async (c) => {
    try {
      const data = await fetchAllRows("search_events", "searched_at", {
        order: { column: "searched_at", ascending: true },
      });

      if (data.length === 0) return c.json([]);

      const dailyMap = new Map<string, number>();
      for (const row of data) {
        const date = row.searched_at.slice(0, 10);
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
      console.log(`[Searches] Daily fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch daily searches: ${err.message}` }, 500);
    }
  });
}