/**
 * Click tracking routes — backed by `click_events` Supabase table.
 *
 * POST /clicks/track   → INSERT into click_events
 * GET  /clicks         → aggregated per-product (for Feed & Ranking tabs)
 * GET  /clicks/daily   → daily totals (for BarChart timeline)
 * GET  /clicks/log     → individual events paginated (for Log tab)
 * GET  /clicks/client-report?platform=Morpho → combined report for a single platform
 * GET  /clicks/analytics → aggregated analytics for insights dashboard
 */
import type { Hono } from "npm:hono";
import { getSupabase, fetchAllRows } from "./helpers.tsx";

const PREFIX = "/make-server-7b092b69";

// ── Bot detection ────────────────────────────────────────────

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

// ── UA Parser (lightweight, regex-based) ─────────────────────

function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "desktop";

  // Browser detection
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
  } else if (/MSIE|Trident/i.test(ua)) {
    browser = "IE";
  }

  // OS detection
  if (/Windows NT 10/i.test(ua)) os = "Windows 10+";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) {
    const m = ua.match(/Mac OS X ([\d_]+)/);
    os = `macOS ${m ? m[1].replace(/_/g, ".").split(".").slice(0, 2).join(".") : ""}`.trim();
  } else if (/CrOS/i.test(ua)) os = "Chrome OS";
  else if (/Linux/i.test(ua)) os = "Linux";
  else if (/Android/i.test(ua)) {
    const m = ua.match(/Android ([\d.]+)/);
    os = `Android ${m ? m[1].split(".")[0] : ""}`.trim();
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    const m = ua.match(/OS ([\d_]+)/);
    os = `iOS ${m ? m[1].replace(/_/g, ".").split(".").slice(0, 2).join(".") : ""}`.trim();
  }

  // Device detection
  if (/Mobi|Android.*Mobile|iPhone|iPod/i.test(ua)) device = "mobile";
  else if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) device = "tablet";
  else device = "desktop";

  return { browser, os, device };
}

// ── Geo extraction from headers ──────────────────────────────

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

  const country = h("cf-ipcountry") || h("x-country") || h("x-vercel-ip-country") || "";
  const region = h("x-vercel-ip-country-region") || h("cf-region") || "";
  const city = h("x-vercel-ip-city") || h("cf-ipcity") || "";

  return { ip, country, region, city };
}

/** Mask IP — last octet for IPv4, last segment for IPv6 */
function maskIp(ip: string): string {
  if (!ip) return "";
  if (ip.includes(".")) return ip.replace(/\.\d+$/, ".xxx");
  if (ip.includes(":")) return ip.replace(/:[^:]+$/, ":xxxx");
  return ip;
}

// ── Routes ───────────────────────────────────────────────────

export function registerClickRoutes(app: Hono) {

  /**
   * POST /clicks/track
   * Body: { slug, productName, platform, ticker, network, curator,
   *         productLink, apyAtClick, tvlAtClick, defillamaId,
   *         ts, meta }
   */
  app.post(`${PREFIX}/clicks/track`, async (c) => {
    try {
      const ua = c.req.header("user-agent");

      // Bot gate
      if (isBot(ua)) {
        return c.body(null, 204);
      }

      const body = await c.req.json();
      const {
        slug, productName, platform, ticker, network, curator,
        productLink, apyAtClick, tvlAtClick, defillamaId,
        ts, meta,
      } = body;

      if (!slug || typeof slug !== "string") {
        return c.json({ error: "Missing slug" }, 400);
      }

      // Liveness check: client must send a timestamp within last 30s
      if (!ts || typeof ts !== "number" || Math.abs(Date.now() - ts) > 30_000) {
        return c.body(null, 204);
      }

      const uaParsed = parseUserAgent(ua || "");
      const geo = extractGeo(c);
      const clientMeta = meta || {};

      const row = {
        slug,
        defillama_id:   defillamaId || "",
        product_name:   productName || slug,
        platform:       platform || "",
        ticker:         ticker || "",
        network:        network || "",
        curator:        curator || "",
        product_link:   productLink || "",
        apy_at_click:   typeof apyAtClick === "number" ? apyAtClick : null,
        tvl_at_click:   typeof tvlAtClick === "number" ? tvlAtClick : null,
        ip_masked:      maskIp(geo.ip),
        country_code:   geo.country,
        region:         geo.region,
        city:           geo.city,
        user_agent_raw: ua || "",
        browser:        uaParsed.browser,
        os:             uaParsed.os,
        device_type:    uaParsed.device,
        language:       clientMeta.language || "",
        timezone:       clientMeta.timezone || "",
        screen_width:   clientMeta.screenWidth || 0,
        screen_height:  clientMeta.screenHeight || 0,
        referrer:       clientMeta.referrer || "",
        page_url:       clientMeta.pageUrl || "",
        client_ts:      ts,
        is_bot:         false,
      };

      const supabase = getSupabase();
      const { error } = await supabase.from("click_events").insert(row);

      if (error) {
        console.log(`[Clicks] INSERT error: ${error.message}`);
        return c.json({ error: `Click tracking insert failed: ${error.message}` }, 500);
      }

      return c.json({ ok: true });
    } catch (err: any) {
      console.log(`[Clicks] Track error: ${err.message}`);
      return c.json({ error: `Click tracking failed: ${err.message}` }, 500);
    }
  });

  /**
   * GET /clicks
   * Returns aggregated click records per product, sorted by count desc.
   * Response shape matches the existing ClickRecord interface for backwards compat.
   */
  app.get(`${PREFIX}/clicks`, async (c) => {
    try {
      const data = await fetchAllRows("click_events",
        "slug, product_name, platform, ticker, network, curator, clicked_at",
        { order: { column: "clicked_at", ascending: false } }
      );

      // Aggregate in JS -- group by slug
      const map = new Map<string, {
        slug: string; productName: string; platform: string;
        ticker: string; network: string; curator: string;
        count: number; lastClickedAt: string; firstClickedAt: string;
      }>();

      for (const row of data) {
        const key = row.slug;
        const ts = row.clicked_at;
        const existing = map.get(key);
        if (existing) {
          existing.count += 1;
          if (ts > existing.lastClickedAt) existing.lastClickedAt = ts;
          if (ts < existing.firstClickedAt) existing.firstClickedAt = ts;
        } else {
          map.set(key, {
            slug: row.slug,
            productName: row.product_name,
            platform: row.platform,
            ticker: row.ticker,
            network: row.network,
            curator: row.curator || "",
            count: 1,
            lastClickedAt: ts,
            firstClickedAt: ts,
          });
        }
      }

      const sorted = [...map.values()].sort((a, b) => b.count - a.count);
      return c.json(sorted);
    } catch (err: any) {
      console.log(`[Clicks] Fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch clicks: ${err.message}` }, 500);
    }
  });

  /**
   * GET /clicks/log?limit=50&offset=0
   * Returns individual click events, newest first. Paginated.
   * Response: { events: ClickEvent[], total: number }
   * Field names are aliased to match existing frontend ClickEvent interface.
   */
  app.get(`${PREFIX}/clicks/log`, async (c) => {
    try {
      const limitParam = parseInt(c.req.query("limit") || "50", 10);
      const offsetParam = parseInt(c.req.query("offset") || "0", 10);
      const limit = Math.min(Math.max(1, limitParam), 500);
      const offset = Math.max(0, offsetParam);

      const supabase = getSupabase();

      // Get paginated events
      const { data, error, count } = await supabase
        .from("click_events")
        .select("*", { count: "exact" })
        .order("clicked_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.log(`[Clicks] Log query error: ${error.message}`);
        return c.json({ error: `Failed to fetch click log: ${error.message}` }, 500);
      }

      // Map to frontend ClickEvent shape (backwards compat)
      const events = (data || []).map((row: any) => ({
        id:          row.id,
        slug:        row.slug,
        productName: row.product_name,
        platform:    row.platform,
        ticker:      row.ticker,
        network:     row.network,
        curator:     row.curator || "",
        timestamp:   row.clicked_at,
        ip:          row.ip_masked || "",
        country:     row.country_code || "",
        region:      row.region || "",
        city:        row.city || "",
        browser:     row.browser || "",
        os:          row.os || "",
        device:      row.device_type || "desktop",
        language:    row.language || "",
        timezone:    row.timezone || "",
        screenWidth: row.screen_width || 0,
        screenHeight: row.screen_height || 0,
        referrer:    row.referrer || "",
        pageUrl:     row.page_url || "",
      }));

      return c.json({ events, total: count ?? events.length });
    } catch (err: any) {
      console.log(`[Clicks] Log fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch click log: ${err.message}` }, 500);
    }
  });

  /**
   * GET /clicks/daily
   * Returns daily click totals sorted by date asc (for timeline chart).
   * Gap-fills missing days with count=0.
   * Response: DailyClickRecord[]
   */
  app.get(`${PREFIX}/clicks/daily`, async (c) => {
    try {
      const data = await fetchAllRows("click_events", "clicked_at", {
        order: { column: "clicked_at", ascending: true },
      });

      if (data.length === 0) return c.json([]);

      // Group by date (YYYY-MM-DD)
      const dailyMap = new Map<string, number>();
      for (const row of data) {
        const date = row.clicked_at.slice(0, 10);
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
      }

      // Sort dates and fill gaps
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
      console.log(`[Clicks] Daily fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch daily clicks: ${err.message}` }, 500);
    }
  });

  /**
   * GET /clicks/client-report?platform=Morpho
   * Returns combined report for a single platform:
   *   { platform, totalClicks, products[], daily[] }
   * Used by the Clients tab in Control Room.
   */
  app.get(`${PREFIX}/clicks/client-report`, async (c) => {
    try {
      const platform = c.req.query("platform")?.trim();
      if (!platform) {
        return c.json({ error: "Missing ?platform= query parameter" }, 400);
      }

      const data = await fetchAllRows("click_events",
        "slug, product_name, ticker, network, curator, clicked_at",
        {
          order: { column: "clicked_at", ascending: true },
          ilike: { column: "platform", value: platform },
        }
      );

      if (data.length === 0) {
        return c.json({ platform, totalClicks: 0, products: [], daily: [] });
      }

      // ── Product breakdown ──
      const prodMap = new Map<string, {
        slug: string; productName: string; ticker: string;
        network: string; curator: string;
        count: number; lastClickedAt: string;
      }>();

      for (const row of data) {
        const key = row.slug;
        const ts = row.clicked_at;
        const existing = prodMap.get(key);
        if (existing) {
          existing.count += 1;
          if (ts > existing.lastClickedAt) existing.lastClickedAt = ts;
        } else {
          prodMap.set(key, {
            slug: row.slug,
            productName: row.product_name,
            ticker: row.ticker,
            network: row.network,
            curator: row.curator || "",
            count: 1,
            lastClickedAt: ts,
          });
        }
      }

      const products = [...prodMap.values()].sort((a, b) => b.count - a.count);

      // ── Daily timeline (gap-filled) ──
      const dailyMap = new Map<string, number>();
      for (const row of data) {
        const date = row.clicked_at.slice(0, 10);
        dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
      }

      const dates = [...dailyMap.keys()].sort();
      const daily: { date: string; count: number }[] = [];
      if (dates.length > 0) {
        const start = new Date(dates[0] + "T00:00:00Z");
        const end = new Date(dates[dates.length - 1] + "T00:00:00Z");
        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
          const ds = d.toISOString().slice(0, 10);
          daily.push({ date: ds, count: dailyMap.get(ds) || 0 });
        }
      }

      return c.json({
        platform,
        totalClicks: data.length,
        products,
        daily,
      });
    } catch (err: any) {
      console.log(`[Clicks] Client report error: ${err.message}`);
      return c.json({ error: `Client report failed: ${err.message}` }, 500);
    }
  });

  /**
   * GET /clicks/analytics
   * Returns aggregated analytics for insights dashboard:
   *   {
   *     deviceBreakdown: { desktop: number; mobile: number; tablet: number };
   *     referrerBreakdown: { google: number; bing: number; direct: number; other: number };
   *     dailyDeviceBreakdown: { date: string; desktop: number; mobile: number; tablet: number }[];
   *     totalClicks: number;
   *   }
   */
  app.get(`${PREFIX}/clicks/analytics`, async (c) => {
    try {
      const data = await fetchAllRows("click_events", "device_type, referrer, clicked_at", {
        order: { column: "clicked_at", ascending: true },
      });

      if (data.length === 0) {
        return c.json({
          deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
          referrerBreakdown: { google: 0, bing: 0, direct: 0, other: 0 },
          dailyDeviceBreakdown: [],
          totalClicks: 0,
        });
      }

      // ── Device breakdown ──
      const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
      const now = new Date();
      const cutoff24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      let clicks24h = 0;
      for (const row of data) {
        const device = row.device_type || "desktop";
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
        if (row.clicked_at >= cutoff24h) clicks24h += 1;
      }

      // ── Referrer breakdown (search engines) ──
      const referrerCounts = { google: 0, bing: 0, direct: 0, other: 0 };
      for (const row of data) {
        const ref = (row.referrer || "").toLowerCase();
        
        // Skip figma.site referrers (preview/iframe traffic)
        if (ref.includes("figma.site")) {
          continue;
        }
        
        if (ref.includes("google")) {
          referrerCounts.google += 1;
        } else if (ref.includes("bing")) {
          referrerCounts.bing += 1;
        } else if (ref === "" || ref === "direct") {
          referrerCounts.direct += 1;
        } else {
          referrerCounts.other += 1;
        }
      }

      // ── Daily device breakdown ──
      const dailyMap = new Map<string, { desktop: number; mobile: number; tablet: number }>();
      for (const row of data) {
        const date = row.clicked_at.slice(0, 10);
        const device = row.device_type || "desktop";
        const existing = dailyMap.get(date) || { desktop: 0, mobile: 0, tablet: 0 };
        existing[device as "desktop" | "mobile" | "tablet"] = (existing[device as "desktop" | "mobile" | "tablet"] || 0) + 1;
        dailyMap.set(date, existing);
      }

      // Sort dates and fill gaps
      const dates = [...dailyMap.keys()].sort();
      const dailyDeviceBreakdown: { date: string; desktop: number; mobile: number; tablet: number }[] = [];

      if (dates.length > 0) {
        const start = new Date(dates[0] + "T00:00:00Z");
        const end = new Date(dates[dates.length - 1] + "T00:00:00Z");

        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
          const ds = d.toISOString().slice(0, 10);
          const counts = dailyMap.get(ds) || { desktop: 0, mobile: 0, tablet: 0 };
          dailyDeviceBreakdown.push({ date: ds, ...counts });
        }
      }

      return c.json({
        deviceBreakdown: deviceCounts,
        referrerBreakdown: referrerCounts,
        dailyDeviceBreakdown,
        totalClicks: data.length,
        clicks24h,
      });
    } catch (err: any) {
      console.log(`[Clicks] Analytics fetch error: ${err.message}`);
      return c.json({ error: `Failed to fetch click analytics: ${err.message}` }, 500);
    }
  });

}