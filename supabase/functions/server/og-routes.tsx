/**
 * OG Image routes - Dynamic Open Graph image generation.
 * Uses satori (JSX -> SVG) + @resvg/resvg-wasm (SVG -> PNG).
 *
 * Routes:
 *   GET /api/og?type=hub&ticker=USDC
 *   GET /api/og?type=network&ticker=USDC&network=ethereum
 *   GET /api/og?type=vault&slug=usdc-lend-fluid-mainnet
 */
import { getSupabase, extractDefillamaId, getIndexLookup, applyIndexShield } from "./helpers.tsx";

// ── Lazy imports (loaded on first request) ───────────────────

let satori: any = null;
let Resvg: any = null;
let initWasm: any = null;

async function loadSatori() {
  if (satori) return;
  const mod = await import("npm:satori@0.10.14");
  satori = mod.default || mod;
}

async function loadResvg() {
  if (Resvg) return;
  const mod = await import("npm:@resvg/resvg-wasm@2.6.2");
  Resvg = mod.Resvg;
  initWasm = mod.initWasm;
}

// ── Font + WASM caching ──────────────────────────────────────

let fontRegular: ArrayBuffer | null = null;
let fontBold: ArrayBuffer | null = null;
let wasmReady = false;

async function ensureFonts(): Promise<void> {
  if (fontRegular && fontBold) return;
  console.log("[OG] Fetching Inter font from Google Fonts...");
  // Fetch CSS from Google Fonts API to get the correct font file URLs
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
    { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" } }
  ).then((r) => r.text());

  // Parse font URLs from CSS - one per weight
  const blocks = css.split("@font-face");
  const urls: Record<string, string> = {};
  for (const block of blocks) {
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/src:\s*url\(([^)]+\.woff2)\)/);
    if (weightMatch && urlMatch) {
      urls[weightMatch[1]] = urlMatch[1];
    }
  }

  const [r, b] = await Promise.all([
    fetch(urls["400"] || "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50KnMa2JL7SUc.woff2").then((r) => r.arrayBuffer()),
    fetch(urls["700"] || "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50KnMa25L7SUc.woff2").then((r) => r.arrayBuffer()),
  ]);
  fontRegular = r;
  fontBold = b;
  console.log(`[OG] Fonts loaded (400: ${r.byteLength}B, 700: ${b.byteLength}B)`);
}

async function ensureWasm(): Promise<void> {
  if (wasmReady) return;
  console.log("[OG] Initializing resvg WASM...");
  try {
    const wasmBinary = await fetch(
      "https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm"
    ).then((r) => r.arrayBuffer());
    await initWasm(wasmBinary);
    wasmReady = true;
    console.log("[OG] resvg WASM ready");
  } catch (err: any) {
    // If already initialized (e.g. hot reload), ignore
    if (err.message?.includes("already been initialized")) {
      wasmReady = true;
      console.log("[OG] resvg WASM was already initialized");
    } else {
      throw err;
    }
  }
}

// ── TVL formatting ───────────────────────────────────────────

function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(1)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(1)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(0)}K`;
  return `$${tvl.toFixed(0)}`;
}

// ── Satori element helpers ───────────────────────────────────
// Satori uses plain objects, not JSX. Every container needs display:'flex'.

const el = (
  type: string,
  style: Record<string, any>,
  ...children: any[]
): any => ({
  type,
  props: {
    style: { display: "flex", ...style },
    children: children.length === 1 ? children[0] : children,
  },
});

const text = (
  type: string,
  style: Record<string, any>,
  content: string
): any => ({
  type,
  props: { style, children: content },
});

// ── Shared layout pieces ─────────────────────────────────────

function topBar() {
  return el("div", { width: "100%", height: "4px", backgroundColor: "#ffffff" });
}

function bottomBar() {
  return el(
    "div",
    {
      width: "100%",
      height: "50px",
      backgroundColor: "#067a55",
      alignItems: "center",
      paddingLeft: "60px",
    },
    text("div", { fontSize: "16px", fontWeight: 500, color: "rgba(255,255,255,0.6)" }, "earnbase.finance \u00B7 On-chain yield data, updated daily")
  );
}

function logo() {
  return text("div", {
    fontSize: "22px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "0.12em",
  }, "EARNBASE");
}

function tickerBadge(ticker: string) {
  return el(
    "div",
    { marginTop: "20px" },
    el(
      "div",
      {
        backgroundColor: "#067a55",
        borderRadius: "22px",
        padding: "8px 20px",
        fontSize: "20px",
        fontWeight: 700,
        color: "#ffffff",
      },
      ticker
    )
  );
}

// ── Template: Vault ──────────────────────────────────────────

function vaultTemplate(data: {
  ticker: string;
  name: string;
  platform: string;
  network: string;
  apy: string;
  tvl: string;
}) {
  const displayName = data.name.length > 30 ? data.name.slice(0, 28) + "..." : data.name;
  return el(
    "div",
    {
      width: "1200px",
      height: "630px",
      flexDirection: "column",
      backgroundColor: "#08a671",
      fontFamily: "Inter",
    },
    topBar(),
    el(
      "div",
      { flexDirection: "column", padding: "30px 60px", flex: 1 },
      logo(),
      tickerBadge(data.ticker),
      text("div", { fontSize: "48px", fontWeight: 700, color: "#ffffff", marginTop: "24px" }, displayName),
      text("div", { fontSize: "24px", fontWeight: 400, color: "rgba(255,255,255,0.7)", marginTop: "8px" }, `on ${data.platform} \u00B7 ${data.network}`),
      text("div", { fontSize: "96px", fontWeight: 700, color: "#ffffff", marginTop: "32px", lineHeight: 1 }, `${data.apy}%`),
      text("div", { fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", marginTop: "8px" }, "ON-CHAIN APY"),
      text("div", { fontSize: "24px", fontWeight: 700, color: "rgba(255,255,255,0.7)", marginTop: "24px" }, `TVL: ${data.tvl}`)
    ),
    bottomBar()
  );
}

// ── Template: Asset Hub ──────────────────────────────────────

function hubTemplate(data: {
  ticker: string;
  count: number;
  networkCount: number;
}) {
  return el(
    "div",
    {
      width: "1200px",
      height: "630px",
      flexDirection: "column",
      backgroundColor: "#08a671",
      fontFamily: "Inter",
    },
    topBar(),
    el(
      "div",
      { flexDirection: "column", padding: "30px 60px", flex: 1 },
      logo(),
      text("div", { fontSize: "80px", fontWeight: 700, color: "#ffffff", marginTop: "50px" }, `Best ${data.ticker} Yield`),
      text("div", { fontSize: "32px", fontWeight: 700, color: "#ffffff", marginTop: "24px" }, `${data.count} strategies tracked`),
      text("div", { fontSize: "24px", fontWeight: 400, color: "rgba(255,255,255,0.7)", marginTop: "12px" }, `across ${data.networkCount} network${data.networkCount === 1 ? "" : "s"}`),
      text("div", { fontSize: "24px", fontWeight: 400, color: "rgba(255,255,255,0.7)", marginTop: "60px" }, "Compare on-chain APY rates and TVL"),
      text("div", { fontSize: "24px", fontWeight: 400, color: "rgba(255,255,255,0.7)", marginTop: "4px" }, "across DeFi protocols")
    ),
    bottomBar()
  );
}

// ── Template: Network filter ─────────────────────────────────

function networkTemplate(data: {
  ticker: string;
  network: string;
  count: number;
}) {
  return el(
    "div",
    {
      width: "1200px",
      height: "630px",
      flexDirection: "column",
      backgroundColor: "#08a671",
      fontFamily: "Inter",
    },
    topBar(),
    el(
      "div",
      { flexDirection: "column", padding: "30px 60px", flex: 1 },
      logo(),
      text("div", { fontSize: "72px", fontWeight: 700, color: "#ffffff", marginTop: "50px" }, `${data.ticker} on ${data.network}`),
      text("div", { fontSize: "32px", fontWeight: 700, color: "#ffffff", marginTop: "24px" }, `${data.count} strategies tracked`),
      text("div", { fontSize: "24px", fontWeight: 400, color: "rgba(255,255,255,0.7)", marginTop: "60px" }, "Compare on-chain APY rates and TVL")
    ),
    bottomBar()
  );
}

// ── Fallback template (generic branding) ─────────────────────

function fallbackTemplate() {
  return el(
    "div",
    {
      width: "1200px",
      height: "630px",
      flexDirection: "column",
      backgroundColor: "#08a671",
      fontFamily: "Inter",
    },
    topBar(),
    el(
      "div",
      { flexDirection: "column", padding: "30px 60px", flex: 1, justifyContent: "center" },
      logo(),
      text("div", { fontSize: "64px", fontWeight: 700, color: "#ffffff", marginTop: "40px" }, "Track & Compare"),
      text("div", { fontSize: "64px", fontWeight: 700, color: "#ffffff", marginTop: "4px" }, "DeFi Yields"),
      text("div", { fontSize: "24px", fontWeight: 400, color: "rgba(255,255,255,0.7)", marginTop: "32px" }, "On-chain APY and TVL data, updated daily")
    ),
    bottomBar()
  );
}

// ── Data fetching ────────────────────────────────────────────

async function fetchVaultData(slug: string) {
  const supabase = getSupabase();
  // 1. Find Index row by url slug
  const { data: indexRows, error: idxErr } = await supabase
    .from("Index")
    .select("*")
    .eq("url", slug)
    .limit(1);

  if (idxErr || !indexRows || indexRows.length === 0) {
    console.log(`[OG] Vault not found for slug="${slug}": ${idxErr?.message || "no rows"}`);
    return null;
  }
  const indexRow = indexRows[0];
  const ticker = (indexRow.ticker || indexRow.vault || "").toUpperCase();
  const productName = indexRow.productName || indexRow.product_name || "Untitled";
  const platform = indexRow.platform || indexRow.platform_name || "Unknown";
  const network = indexRow.network || "Mainnet";

  // 2. Find Products row by defillamaId
  const did = extractDefillamaId(indexRow);
  let spotAPY = 0;
  let tvl = 0;

  if (did) {
    // Try multiple column names for defillamaId
    for (const col of ["defillamaId", "defillamaID", "defillama_id"]) {
      const { data: prodRows } = await supabase
        .from("Products")
        .select("*")
        .eq(col, did)
        .limit(1);
      if (prodRows && prodRows.length > 0) {
        const p = prodRows[0];
        spotAPY = parseFloat(p.dailyApy || p.dailyAPY || p.spotApy || p.spotAPY || 0);
        tvl = parseFloat(p.tvl || 0);
        break;
      }
    }
  }

  return {
    ticker,
    name: productName,
    platform,
    network,
    apy: spotAPY.toFixed(2),
    tvl: formatTVL(tvl),
  };
}

async function fetchHubData(ticker: string) {
  const supabase = getSupabase();
  // Get Index + Products data for this ticker
  const indexLookup = await getIndexLookup();
  const { data: products, error } = await supabase.from("Products").select("*");
  if (error || !products) {
    console.log(`[OG] Hub data fetch error: ${error?.message}`);
    return { ticker: ticker.toUpperCase(), count: 0, networkCount: 0 };
  }

  const t = ticker.toLowerCase();
  const matched = products.filter((p: any) => {
    const corrected = applyIndexShield(p, indexLookup);
    const pTicker = (p.vault || p.ticker || p.asset || "").toLowerCase();
    return pTicker === t;
  });

  const networks = new Set(matched.map((p: any) => (p.network || "mainnet").toLowerCase()));
  return {
    ticker: ticker.toUpperCase(),
    count: matched.length,
    networkCount: networks.size,
  };
}

async function fetchNetworkData(ticker: string, network: string) {
  const supabase = getSupabase();
  const { data: products, error } = await supabase.from("Products").select("*");
  if (error || !products) {
    console.log(`[OG] Network data fetch error: ${error?.message}`);
    return { ticker: ticker.toUpperCase(), network, count: 0 };
  }

  const t = ticker.toLowerCase();
  const n = network.toLowerCase();
  const matched = products.filter((p: any) => {
    const pTicker = (p.vault || p.ticker || p.asset || "").toLowerCase();
    const pNetwork = (p.network || "mainnet").toLowerCase();
    return pTicker === t && (pNetwork === n || pNetwork.includes(n) || n.includes(pNetwork));
  });

  // Capitalize network name
  const networkName = network.charAt(0).toUpperCase() + network.slice(1);
  return {
    ticker: ticker.toUpperCase(),
    network: networkName,
    count: matched.length,
  };
}

// ── SVG -> PNG render pipeline ───────────────────────────────

async function renderPng(element: any): Promise<Uint8Array> {
  await Promise.all([loadSatori(), loadResvg()]);
  await Promise.all([ensureFonts(), ensureWasm()]);

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: fontRegular!, weight: 400, style: "normal" as const },
      { name: "Inter", data: fontBold!, weight: 700, style: "normal" as const },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

// ── Route registration ───────────────────────────────────────

export function registerOGRoutes(app: any) {
  app.get("/make-server-7b092b69/api/og", async (c: any) => {
    const type = c.req.query("type") || "hub";
    const ticker = c.req.query("ticker") || "";
    const network = c.req.query("network") || "";
    const slug = c.req.query("slug") || "";

    console.log(`[OG] Generating image: type=${type}, ticker=${ticker}, network=${network}, slug=${slug}`);

    try {
      let element: any;

      switch (type) {
        case "vault": {
          if (!slug) return c.json({ error: "Missing slug parameter" }, 400);
          const data = await fetchVaultData(slug);
          element = data ? vaultTemplate(data) : fallbackTemplate();
          break;
        }
        case "network":
        case "net": {
          if (!ticker || !network) return c.json({ error: "Missing ticker or network parameter" }, 400);
          const data = await fetchNetworkData(ticker, network);
          element = networkTemplate(data);
          break;
        }
        case "hub":
        default: {
          if (!ticker) return c.json({ error: "Missing ticker parameter" }, 400);
          const data = await fetchHubData(ticker);
          element = hubTemplate(data);
          break;
        }
      }

      const png = await renderPng(element);

      return new Response(png, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err: any) {
      console.log(`[OG] Error generating image: ${err.message}\n${err.stack}`);
      return c.json({ error: `OG image generation failed: ${err.message}` }, 500);
    }
  });
}
