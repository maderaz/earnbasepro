# Earnbase — AI Builder Brief

> Hand this document to any AI to rebuild the core of the app from scratch.
> Assumes: TVL, spot APY, 30d APY, and sharePrice history data are already available via API.

---

## 1. What This App Is

**Earnbase** is a DeFi yield aggregator and comparison tool. It tracks **on-chain yield only** — no token rewards, no points, no liquidity mining. Every APY figure comes from the change in a vault's share price (exchange rate) over time, annualised.

**The core value proposition:** a user can come to Earnbase and answer "where is the best place to earn yield on my USDC right now?" with a single ranked table, filtered by network, sorted by APY or TVL, with 30-day history to verify the yield is real and stable.

**What it is NOT:**
- Not a yield aggregator that auto-routes funds
- Not a wallet or trading interface
- Not a rewards tracker
- Not a generalised DeFi dashboard

**Users:** DeFi yield farmers, DAO treasuries, institutional allocators, and curious retail — all looking for credible, unbiased yield data.

---

## 2. Supported Assets & Networks

### Assets (VALID_TICKERS)
```
usdc | eth | usdt | eurc | wbtc | cbbtc
```
These are the only tickers that get public pages. Everything else is filtered out at the route level.

### Networks
```
Ethereum (mainnet) | Base | Arbitrum | BNB Chain | Avalanche | Sonic
```
URL slugs: `ethereum` (or `mainnet`), `base`, `arbitrum`, `bnb`, `avalanche`, `sonic`

**Important slug rule:** Products with `network = "Mainnet"` map to slug `mainnet`. Products with `network = "Ethereum"` or `network = "Ethereum Mainnet"` map to slug `ethereum`. Both pages exist. Both serve content.

---

## 3. Data Model

```typescript
interface DeFiProduct {
  id: string | number;
  ticker: string;              // "usdc", "eth", "usdt", etc.
  network: string;             // "Ethereum", "Base", "Arbitrum Mainnet", etc.
  platform_name: string;       // Protocol name: "Morpho", "Euler", "Aave", etc.
  product_name: string;        // Human name: "Morpho USDC Prime"
  curator: string;             // Risk manager: "Gauntlet", "Steakhouse", or "-" if none
  product_link: string;        // External URL to the vault's native interface
  url?: string;                // Pre-computed slug (use this if present)
  vault_address?: string;
  spotAPY: number;             // 24-hour annualised APY (%)
  weeklyAPY?: number;          // 7-day average APY
  monthlyAPY: number;          // 30-day average APY
  tvl: number;                 // Total Value Locked in USD
  dailyApyHistory?: number[];  // Array of daily APY snapshots (strip before hydration)
  tvlHistory?: number[];       // Array of daily TVL snapshots (strip before hydration)
}
```

**Key derived values:**
- `sharePrice` history → compute `dailyApyHistory` (daily % change × 365)
- `sustainabilityScore` (0–100): measures 30-day APY volatility. High = consistent yield. Low = erratic or declining.

**Dead vault condition:** `tvl < 5000 AND monthlyAPY === 0` → treat as inactive, noindex, show minimal page.

---

## 4. Slug Generation

Every vault gets a unique URL slug. Rule:

```
slug = [ticker]-[product_name]-[platform_name]-[curator?]-[network]
     → lowercase, spaces→hyphens, strip non-alphanumeric, deduplicate adjacent words
```

If the product has a `url` field, use that directly (it's pre-computed and collision-free).

Examples:
- `usdc-morpho-prime-gauntlet-base`
- `eth-euler-prime-ethereum`
- `usdt-aave-v3-arbitrum`

**Vault URL:** `/vault/{slug}`

---

## 5. URL Architecture — 7 Public Routes

```
/                           → Homepage (all assets, all networks)
/{ticker}                   → Asset Hub (e.g. /usdc, /eth)
/{ticker}/{network}         → Network Filter (e.g. /usdc/base, /eth/arbitrum)
/vault/{slug}               → Single Vault Page
/project/{platform-slug}    → Protocol Page (e.g. /project/morpho)
/curator/{curator-slug}     → Curator Page (e.g. /curator/gauntlet)
/about                      → Methodology + Disclaimers
```

**Guard rails:**
- `/{ticker}` — only renders if ticker is in VALID_TICKERS, else 404
- `/project/{slug}` — only renders if platform has ≥ 2 products
- `/curator/{slug}` — only renders if curator has ≥ 4 products
- `/vault/{slug}` — dead vault (TVL <$5k AND 30d APY = 0) → noindex + minimal page

---

## 6. Page Hierarchy & Purpose

| Page | Primary Job | SEO Goal |
|------|-------------|----------|
| `/` | Discovery — show everything, let user filter | Rank for "defi yield comparison", "best defi apy" |
| `/{ticker}` | Asset hub — all strategies for one asset | Rank for "usdc yield", "best eth yield" |
| `/{ticker}/{network}` | Network filter — asset on one chain | Rank for "usdc yield on base", "eth yield arbitrum" |
| `/vault/{slug}` | Product detail — one strategy deep-dive | Rank for "[Protocol] [Asset] APY", specific vault names |
| `/project/{slug}` | Protocol aggregation — all vaults from one platform | Rank for "morpho yield strategies", "aave rates" |
| `/curator/{slug}` | Curator aggregation — all vaults from one risk manager | Rank for "gauntlet vaults", "steakhouse yields" |
| `/about` | Trust + methodology | E-E-A-T signal, AI citation source |

---

## 7. SEO Architecture

### Core Principle
Every public page is **server-rendered** with real data in the HTML. The interactive JS layer enhances but never replaces the crawlable content. Google and AI crawlers read the SSR HTML, not the hydrated React tree.

### Title Formula Rules

Titles must be ≤ 60 characters. If they exceed 60, drop modifiers in order until they fit.

| Page | Primary Title Pattern | Fallback |
|------|-----------------------|----------|
| Homepage | `Compare DeFi Yields Across Protocols \| Earnbase` | — |
| Asset Hub | `Compare {N} {TICKER} Yield Strategies \| Earnbase` | Drop N if too long |
| Network Filter | `Compare {N} {TICKER} Yields on {Network} \| Earnbase` | Drop N |
| Vault | `{ProductName} – {APY}% APY \| Earnbase` | Drop APY if below threshold |
| Project | `Compare {N} Yield Strategies on {Platform} \| Earnbase` | Drop N |
| Curator | `Compare {N} Strategies Curated by {Curator} \| Earnbase` | Drop N |
| About | `About Earnbase \| DeFi Yield Data Aggregator` | — |

**APY-in-title thresholds** (show APY in vault title only if above floor):
```
USDC / USDT / EURC  → ≥ 0.5%
ETH                 → ≥ 1.0%
WBTC / cbBTC        → ≥ 0.3%
```
Below the floor = APY is basically 0, skip it. It's noise.

### Description Formula Rules

Descriptions must be 100–155 characters. Pack the most useful data first.

| Page | Description Pattern |
|------|---------------------|
| Homepage | `Track {N}+ DeFi yield strategies across USDC, ETH, USDT, EURC, WBTC and cbBTC. On-chain APY only — no token rewards.` |
| Asset Hub | `Compare {N} {TICKER} yield strategies across {networkCount} networks. Spot APY: {topAPY}%. Updated daily. On-chain rates only.` |
| Network Filter | `{N} {TICKER} yield strategies on {Network}. Best rate: {topAPY}% ({topProtocol}). Compare APY, TVL, and history.` |
| Vault | `{ProductName} on {Platform} ({Network}) — {spotAPY}% APY, {30dAPY}% 30d avg. TVL: {tvl}. Compare with {N}+ {TICKER} strategies.` |
| Project | `Compare {N} yield strategies on {Platform} across {tickers}. Live APY, TVL, and history — updated daily.` |
| Curator | `Compare {N} strategies curated by {Curator} across {tickers}. Live APY and TVL data.` |

### JSON-LD Schema — Required Per Page

Every page must output a `<script type="application/ld+json">` block. Minimum required schemas:

**All pages:**
- `WebPage` — with `name`, `url`, `description`, `dateModified: new Date().toISOString()`
- `BreadcrumbList` — matching the visual breadcrumb

**Homepage only:**
- `WebSite` — with `SearchAction` pointing to `/?q={search_term_string}`
- `Organization`
- `FAQPage` (3–5 evergreen questions about the platform)

**Asset Hub + Network Filter:**
- `ItemList` — top 10 products as `ListItem` with `url` and `name`
- `FAQPage` — 5 questions, asset/network-specific answers using live data

**Vault Page:**
- `FinancialProduct` — with `interestRate: spotAPY`, `name`, `url`, `description`
- `FAQPage` — 4 questions using live APY, TVL, curator data

**Project + Curator Pages:**
- `ItemList` — all their strategies
- `FAQPage` — 4 questions about the entity

### FAQPage Content Rules

Questions must be **data-driven and page-specific**. Never use placeholder text.

For vault pages, the 4 required questions:
1. `What is the current APY for {ProductName}?` → answer includes spot + 30d APY
2. `How much TVL is in {ProductName}?` → answer includes formatted TVL
3. `Does {ProductName} yield include token rewards?` → always "No. On-chain only."
4. If has curator: `Who curates {ProductName}?` → curator role + strategy description
4. If no curator: `Which network is {ProductName} on?` → network context

For asset hub pages, 6 questions minimum:
1. How is APY calculated for {TICKER}?
2. What are the risks of high-yield {TICKER} strategies?
3. How many {TICKER} strategies does Earnbase track?
4. What is a good APY for {TICKER} right now? (use live topAPY data)
5. Can I compare {TICKER} across networks?
6. Does Earnbase charge fees?
Plus 1–2 asset-specific questions (e.g. for ETH: staking vs lending distinction).

### noindex Rules

Apply `robots: { index: false, follow: true }` when:
- Vault page AND `tvl < 5000 AND monthlyAPY === 0` (dead vault)
- Never noindex asset hubs, network filters, project pages, curator pages

### Canonical URL Rules

Every page must declare its canonical. Pattern:
```
https://earnbase.finance/{path}
```
No trailing slash. Always the "real" URL, not the redirected-from URL.

### Sitemap Rules

Include in sitemap:
- All asset hubs (priority 0.9, daily)
- All network filter pages — **except those that redirect** (priority 0.8, daily)
- All vault pages — **except dead vaults** (priority 0.7, daily)
- Project pages with ≥ 2 products (priority 0.8, weekly)
- Curator pages with ≥ 4 products (priority 0.8, weekly)
- Homepage (priority 1.0, weekly), About (priority 0.3, monthly)

**Never put in sitemap:** pages that 3XX redirect. If a destination URL is already in the sitemap, the redirecting URL must be excluded.

### Robots.txt Rules

Explicitly list AI crawlers by name:
```
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Claude-User
User-agent: Claude-SearchBot
User-agent: Google-Extended
User-agent: PerplexityBot
Allow: /
Disallow: /control-room
Disallow: /studio

User-agent: *
Allow: /
Disallow: /control-room
Disallow: /studio
```

### llms.txt Rules

Not a link list. Write **self-contained content units (SCUs)** of 60–180 words each. Each SCU answers one question completely without requiring the reader to follow links. AI systems extract SCUs for citations.

Required SCUs:
1. What Earnbase does (platform summary)
2. Why APY figures differ from other sources (methodology)
3. How to interpret the sustainability score
4. Risk disclaimer

---

## 8. Rendering Architecture

### The Split

Every public page has two layers:

```
1. SSR Layer (crawlable, zero JS required)
   → Rendered at request time on the server
   → Contains: data table (top 20), breadcrumb, FAQ section, structured data JSON-LD
   → Visible to Google, Bing, AI crawlers, and users with JS disabled

2. Client Layer (interactive, hydrates over SSR)
   → Full sortable/filterable table
   → Charts (APY history, TVL history)
   → Network/TVL filter controls
   → Hides SSR layer via useEffect on mount
```

### SSR Layer Contents Per Page Type

| Page | SSR contains |
|------|-------------|
| Asset Hub | Top 20 table by APY, network filter chips, FAQ section, breadcrumb |
| Network Filter | Top 20 for that network, yield explainer (2 paragraphs), best-yield answer, FAQ |
| Vault | Hero card (APY, TVL, 30d APY, asset), FAQ, alternatives table (top 10 same-ticker), cross-platform links (top 6 other-asset same-platform) |
| Project | Stats cards, full strategy table, FAQ |
| Curator | Stats cards, full strategy table, FAQ |

### Hydration Payload Rules

**Strip history arrays before passing to client.** `dailyApyHistory` and `tvlHistory` are large and only needed for charts. The client receives lean product objects:

```typescript
const lean = products.map(({ dailyApyHistory: _a, tvlHistory: _t, ...rest }) => rest);
```

**Pass only relevant products to each page's client component:**
- Asset Hub → only same-ticker products (not all 300+)
- Network Filter → only same-ticker products
- Vault → only same-ticker products (for peer comparison)
- Project → only that project's products
- Curator → only that curator's products

This reduces hydration payload from ~600KB (all products) to 50–150KB (relevant subset).

### Rendering Mode Per Page

| Page | Mode | Why |
|------|------|-----|
| Homepage | `force-dynamic` | Data changes constantly; always fresh |
| Asset Hub | `force-dynamic` | APY rankings shift daily |
| Network Filter | `force-dynamic` | Same |
| Vault | `revalidate = 300` (ISR, 5 min) | Individual vault APY is stable enough for cache |
| Project | `force-dynamic` | Protocol product count changes |
| Curator | `force-dynamic` | Curator product assignments change |
| About | `revalidate = 3600` (1 hour) | Static content |

---

## 9. Content Architecture

### Internal Linking Rules

Every vault page must link outward in three directions:
1. **Same asset, different protocol** — "Compare with other USDC strategies" table (up to 10 rows, sorted by APY)
2. **Same platform, different asset** — "More Morpho strategies" grid (up to 6 cards)
3. **Breadcrumb** — Home → {TICKER} → {NETWORK} → {PRODUCT}

This ensures every vault page passes PageRank to:
- The asset hub (breadcrumb link + alternatives table link)
- The network filter page (breadcrumb)
- Peer vault pages (alternatives table)
- The platform page (cross-asset grid)

### Platform & Curator Page Thresholds

| Entity | Minimum products for a page |
|--------|-----------------------------|
| Platform (protocol) | ≥ 2 |
| Curator (risk manager) | ≥ 4 |

Below threshold: the entity has no dedicated page. Links to it from vault pages skip the entity link (no broken links).

### Asset-Specific Context

Each asset has associated editorial context baked into the SEO content layer:

- **USDC/USDT/EURC** → stablecoin, pegged to fiat, yields above 10% involve leverage or private credit
- **ETH** → native staking baseline ~3–4%; above = restaking/leverage/LP risk
- **WBTC/cbBTC** → wrapped Bitcoin, yields lower than stablecoins, custodian counterparty risk

### Network-Specific Context

Each network has a one-sentence descriptor used in FAQ answers and yield explainers:

```
Ethereum → "largest DeFi ecosystem by TVL, deep protocol diversity, higher gas"
Base     → "Coinbase's L2, low gas, rapidly growing DeFi liquidity"
Arbitrum → "mature Ethereum L2, established protocols, lower gas"
Avalanche → "high-throughput L1, mix of native and cross-chain protocols"
BNB Chain → "high-throughput EVM chain, established protocols, low fees"
Sonic    → "newer network, emerging DeFi, shorter track records"
```

---

## 10. Redirect Rules

Use **308 permanent redirects** (preserve method + body). Never 301 for API routes.

Required redirects:
- `/usdt/ethereum` → `/usdt` (no USDT products on "ethereum" network slug)
- `/eurc/ethereum` → `/eurc` (same)
- Any old vault URL format → `/vault/{slug}`
- Garbage URLs (`/%24`, `/%26`, etc.) → `/`

**Redirecting URLs must never appear in the sitemap.**

---

## 11. What NOT to Do (Lessons Learned)

These are real mistakes made in this codebase. Don't repeat them.

### Data
- **Don't pass all 300+ products to every client component.** Filter to relevant products before serialising as props. All-products payload inflates HTML to 600KB+, triggering Ahrefs "HTML too large" flags.
- **Don't pass history arrays in hydration payload.** Strip `dailyApyHistory` and `tvlHistory` before JSON serialising props. Only fetch them when needed for chart components.

### SEO
- **Don't rely on `document.referrer` for multi-page session attribution.** It doesn't update on SPA navigation. Use a `sessionStorage` flag to capture the entry referrer once per session.
- **Don't let dead vaults (TVL ≈ 0, APY = 0) get indexed.** They're thin content. Apply noindex + serve a minimal redirect page pointing to the asset hub.
- **Don't put redirecting URLs in the sitemap.** Ahrefs and Google flag these as errors. If a URL redirects, exclude it. The destination is already in the sitemap.
- **Don't omit `og:type` from OpenGraph metadata.** Next.js does not add it automatically. Every page needs `openGraph: { type: 'website', ... }` explicitly.
- **Don't make H1 optional.** Every public page needs exactly one H1. Network filter pages previously had no H1 — this is an Ahrefs/crawl quality issue.

### Architecture
- **Don't use `aria-hidden="true"` on crawlable SSR content.** It hides content from screen readers and sends mixed signals to AI systems. Use `sr-only` (visually hidden but accessible) or just show the content.
- **Don't use the same SSR skeleton for both the "no JS" and "JS loaded" states.** The SSR layer should be valid standalone content, not a placeholder. When JS loads, the client layer replaces it with the interactive version.
- **Don't generate project/curator pages with fewer than 2/4 products.** They'll be thin pages with almost no content. The threshold prevents this.
- **Don't hardcode `document.referrer` per page view in analytics.** First-touch attribution must be captured on session start only.

---

## 12. Tech Stack (Recommended)

```
Framework:  Next.js 14+ App Router (SSR + ISR + force-dynamic per route)
Language:   TypeScript (strict)
Styling:    Tailwind CSS 4+
Data:       Supabase (or any Postgres with REST API)
Deployment: Vercel (or any edge-capable platform)
```

**Required Next.js features:**
- `generateMetadata()` per route — for dynamic title/description/OG
- `generateStaticParams()` is NOT used — all routes are dynamic (data changes daily)
- `app/sitemap.ts` — programmatic sitemap from live data
- `metadataBase` in root layout — resolves relative OG image URLs

---

## 13. File Structure

```
app/
  layout.tsx                    ← root layout, metadataBase, nav, footer
  page.tsx                      ← homepage
  sitemap.ts                    ← programmatic sitemap
  [ticker]/
    page.tsx                    ← asset hub
    [network]/
      page.tsx                  ← network filter
      network-hub-client.tsx    ← client wrapper for network filter
  vault/
    [slug]/
      page.tsx                  ← single vault page
      vault-client.tsx          ← interactive charts + comparison
  project/
    [slug]/
      page.tsx                  ← protocol page
  curator/
    [curatorSlug]/
      page.tsx                  ← curator page
  about/
    page.tsx
  components/
    Layout.tsx                  ← nav + footer wrapper
    AssetHubPage.tsx            ← interactive table (client)
    NetworkSEOContent.tsx       ← editorial content below network table
    AssetSEOContent.tsx         ← editorial content below asset table

src/lib/
  api.ts                        ← data fetching (fetchPools, DeFiProduct type)
  seo.ts                        ← all SEO functions (titles, descriptions, JSON-LD)
  assetSEOData.ts               ← asset-specific FAQ content + risk context
  networkSEOData.ts             ← network-specific FAQ content + yield explainers
  constants.ts                  ← VALID_TICKERS

public/
  robots.txt
  llms.txt
  {indexnow-key}.txt            ← IndexNow verification file
```

