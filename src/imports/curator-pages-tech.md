# Earnbase — Curator Pages: Part 1 (Technical)

## Instruction for Figma AI

Create `/curator/{slug}` pages. These follow the same structure as `/project/{slug}` pages but filter by curator instead of platform.

Implement in order. Complete and test each task before starting next.

---

## Curator Slug Logic

```javascript
function curatorToSlug(curatorName) {
  return curatorName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
```

Examples:
- "Gauntlet" → `gauntlet`
- "Steakhouse" → `steakhouse`
- "MEV Capital" → `mev-capital`
- "9Summits" → `9summits`
- "TAU Labs" → `tau-labs`
- "kpk" → `kpk`
- "B.Protocol" → `bprotocol`
- "K3 Capital" → `k3-capital`
- "Edge Capital" → `edge-capital`

---

## Qualifying Curators

Only curators with **4 or more strategies** get a dedicated page. Below 4 → too thin, no page.

Do NOT hardcode the list. Compute dynamically:

```javascript
const curatorCounts = {};
allProducts.forEach(p => {
  if (p.curator && p.curator.trim()) {
    const normalized = p.curator.trim();
    curatorCounts[normalized] = (curatorCounts[normalized] || 0) + 1;
  }
});

const MIN_CURATOR_STRATEGIES = 4;
const qualifyingCurators = Object.entries(curatorCounts)
  .filter(([_, count]) => count >= MIN_CURATOR_STRATEGIES)
  .map(([name]) => name);
```

**Important: Normalize curator names with trailing spaces.**

Some curator names have trailing spaces in the data (e.g., "Gauntlet " vs "Gauntlet", "Steakhouse " vs "Steakhouse"). Merge these:

```javascript
function normalizeCurator(name) {
  return name ? name.trim() : null;
}

// When filtering products for a curator page:
const curatorProducts = allProducts.filter(p =>
  normalizeCurator(p.curator) === normalizeCurator(curatorName)
);
```

With current data, qualifying curators (4+) are: Gauntlet (36), Steakhouse (17), Re7 (13), Clearstar (8), MEV Capital (7), Apostro (6), 9Summits (4), kpk (4), Wintermute (4), Yearn (4).

Curators with 3 strategies (Reservoir, Tulipa, TAU Labs, Hyperithm) do NOT get pages yet. If they add more products in the future, pages will appear automatically because the threshold is dynamic.

---

## Task 1: Routing + Page Shell + 404

Add route: `<Route path="/curator/:curatorSlug" element={<CuratorPage />} />`

Place it BEFORE the catch-all `*` route.

**CuratorPage component:**

```javascript
function CuratorPage() {
  const { curatorSlug } = useParams();
  const { products, loading } = useProducts(); // your existing data hook

  if (loading) return <LoadingSpinner />;

  // Find matching curator
  const curatorMap = {};
  products.forEach(p => {
    const normalized = normalizeCurator(p.curator);
    if (!normalized) return;
    const slug = curatorToSlug(normalized);
    if (!curatorMap[slug]) curatorMap[slug] = normalized;
  });

  const curatorName = curatorMap[curatorSlug];
  if (!curatorName) {
    return (
      <>
        <SEO title="Curator Not Found | Earnbase" noindex />
        {/* Same 404 UI as catch-all route */}
      </>
    );
  }

  const curatorProducts = products.filter(p =>
    normalizeCurator(p.curator) === curatorName
  );

  if (curatorProducts.length < MIN_CURATOR_STRATEGIES) {
    return (
      <>
        <SEO title="Curator Not Found | Earnbase" noindex />
        {/* Same 404 UI — not enough products for a page */}
      </>
    );
  }

  // Render page...
}
```

**Test:** `/curator/gauntlet` shows content. `/curator/banana` shows 404 with noindex.

---

## Task 2: H1, Intro, Stats Row

**H1:**
```
{CuratorName} Yields — Compare APY Across {tickerCount} Assets
```

**Intro:**
```
Earnbase tracks {strategyCount} yield strategies curated by {CuratorName} across {platformCount} platforms and {networkCount} networks. Compare APY rates for {tickerList} — updated daily.
```

**Stats row:** 3 numbers horizontal:
- `{strategyCount}` Strategies Tracked
- `{platformCount}` Platforms
- `{networkCount}` Networks

**Data:**
```javascript
const tickers = [...new Set(curatorProducts.map(p => p.ticker.toUpperCase()))];
const tickerCount = tickers.length;
const tickerList = tickers.length > 2
  ? tickers.slice(0, -1).join(', ') + ', and ' + tickers[tickers.length - 1]
  : tickers.join(' and ');
const platformCount = [...new Set(curatorProducts.map(p => p.platform))].length;
const networkCount = [...new Set(curatorProducts.map(p => p.network))].length;
```

---

## Task 3: Product Table with Ticker Sections

Same layout as project pages: group products by ticker, each section with heading "{TICKER} · {count} strategies".

Each section contains a table: Product Name, Platform, Network, APY 24h, APY 30d, TVL, Explore button.

Sort within section by 24h APY descending. Table rows link to `/vault/{slug}`.

**Platform column:** if platform has a project page (use the PROJECT_SLUGS check from project pages), make it a link to `/project/{platformSlug}`. Otherwise plain text.

---

## Task 4: Asset Cards Section

Heading: `TRACKED ASSETS BY {CURATOR_NAME} — JUMP TO`

Same pattern as project pages: mini-cards per ticker, showing count + best APY. Cards anchor-link to the ticker section below.

---

## Task 5: About Section

Heading: `About {CuratorName}`

Content: Use `CURATOR_DESCRIPTIONS[curatorSlug]` from Part 2.

Below the description, add dynamic stat line:
```
Earnbase tracks {strategyCount} strategies curated by {CuratorName} across {platformList}.
```

Where `platformList` is the names of platforms this curator operates on (e.g., "Morpho and Euler" or "Morpho, Euler, and Gearbox").

---

## Task 6: FAQ Section with Schema

4 dynamic questions:

1. **What is the highest APY curated by {CuratorName}?**
   → "The highest yield curated by {CuratorName} is {topAPY}% APY on {topProductName} ({topTicker} on {topNetwork}). Rates are variable and update daily."

2. **How many strategies does {CuratorName} curate on Earnbase?**
   → "Earnbase tracks {strategyCount} strategies curated by {CuratorName} across {platformCount} platforms and {networkCount} networks."

3. **What assets does {CuratorName} support?**
   → "{CuratorName} curates yield strategies for {tickerList}. Each asset has strategies with different risk profiles and APY rates."

4. **Which platforms does {CuratorName} operate on?**
   → "{CuratorName} operates on {platformList}. Different platforms offer different risk architectures and yield mechanics."

Add FAQPage JSON-LD schema (same pattern as project pages).

---

## Task 7: SEO Meta Tags

**Title:** `{CuratorName} Yields — Compare {strategyCount} Strategies | Earnbase`

**Description:** `Compare {strategyCount} yield strategies curated by {CuratorName} across {tickerList}. Live APY, TVL, and performance data — updated daily on Earnbase.`

**Canonical:** `https://earnbase.finance/curator/{slug}`

**OG tags:** Same pattern as project pages. Use default Earnbase OG image.

**WebPage schema** with breadcrumb:
```
Earnbase > {CuratorName} Yields
```

**Robots:** `index, follow`

---

## Task 8: Internal Links

**From vault pages:**
In the sidebar stats, the row showing `Curator: Gauntlet` — make the curator name a link to `/curator/{curatorSlug}`, but ONLY if the curator has a page (4+ strategies). If fewer → plain text.

Same check as platform links:
```javascript
const curatorSlug = curatorToSlug(normalizeCurator(product.curator));
const curatorProducts = allProducts.filter(p =>
  normalizeCurator(p.curator) === normalizeCurator(product.curator)
);
const hasCuratorPage = curatorProducts.length >= MIN_CURATOR_STRATEGIES;
```

**Do NOT change:**
- The "Open Product" button
- The "MORE ON {CURATOR}" sidebar section
- Any other existing links

**Test:** Visit `/vault/usdc-prime-morpho-gauntlet-mainnet` → "Curator: Gauntlet" should be a clickable link to `/curator/gauntlet`.

---

## Do NOT Touch

- Project pages (`/project/`)
- Hub pages (`/{ticker}`)
- Network pages (`/{ticker}/{network}`)
- Vault pages (other than adding curator link in sidebar)
- Homepage (curator links on homepage are a separate future task)
- Footer
- Navigation

---

End of Part 1.