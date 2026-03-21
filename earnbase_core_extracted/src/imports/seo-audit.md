# Earnbase SEO Audit — Full Route & Link Map

Generated: March 3, 2026

---

## 1. Complete Route Map

### Public Pages (indexable)

| # | Route Pattern | Component | SEO `<title>` | `<meta description>` | JSON-LD | OG Image | Canonical | noindex | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `/` | Dashboard (Homepage) | `Find & Compare the Best DeFi Yields \| Earnbase` | Dynamic (strategy count) | WebSite + WebPage + ItemList | `og?type=hub&ticker=DeFi` | `/` | No | OK |
| 2 | `/:ticker` (e.g. `/usdc`) | TickerView -> AssetPageV2 | `Best {TICKER} Yield -- DeFi Strategies by APY \| Earnbase` | Dynamic | WebPage + BreadcrumbList + ItemList + FAQPage | `og?type=hub&ticker=USDC` | `/{ticker}` | No | OK |
| 3 | `/:ticker/:network` (e.g. `/usdc/base`) | TickerView -> AssetPageV2 | `{TICKER} Yield on {Network} -- Compare APY Rates \| Earnbase` | Dynamic | WebPage + BreadcrumbList + ItemList + FAQPage | `og?type=network&ticker=...&network=...` | `/{ticker}/{network}` | No | OK |
| 4 | `/vault/:slug` | ProductPageV3 | Dynamic (product name + APY) | Dynamic | WebPage + BreadcrumbList + FinancialProduct + FAQPage | `og?type=vault&slug=...` | `/vault/{slug}` | No | OK (see issue #6) |
| 5 | `/project/:slug` | ProjectPage | `{Project} Yields -- Compare {N} Strategies \| Earnbase` | Dynamic (ticker list) | WebPage + BreadcrumbList + ItemList + FAQPage | **MISSING** | `/project/{slug}` | No | Issue #5 |
| 6 | `/sitemap` | SitemapPage | `Sitemap -- All DeFi Vault Pages \| Earnbase` | Dynamic (page count) | WebPage + BreadcrumbList + ItemList | None | `/sitemap` | No | Issue #1 |

### Internal/Admin Pages (noindex)

| # | Route Pattern | Component | noindex | Status |
|---|---|---|---|---|
| 7 | `/add-product` | AddProductPage | Yes | OK |
| 8 | `/control-room` | ControlRoom (password-gated) | Yes | OK |
| 9 | `/brand-assets` | BrandAssetsPage | Yes | OK |

### Dev/Test Pages (NOT noindexed -- ISSUES)

| # | Route Pattern | Component | noindex | Status |
|---|---|---|---|---|
| 10 | `/eth2` | AssetPageV2 (defaults to ETH) | **No** | Issue #2 |
| 11 | `/pp1` | ProductPageV2 | **No SEO at all** | Issue #3 |
| 12 | `/pp2` | ProductPageV3 (auto-picks highest-TVL) | **No** | Issue #4 |

---

## 2. SEO Issues Found

### Issue #1: `/sitemap` route is dead (CRITICAL)

**Problem:** `/sitemap` is listed in `LEGACY_REDIRECTS` (line 33 of `App.tsx`) redirecting to `/`. The redirect runs at module load via `window.location.replace()` before React mounts, so the `<Route path="/sitemap">` (line 337) is **unreachable**. Users/crawlers visiting `/sitemap` are silently redirected to homepage.

**Impact:** SitemapPage is completely inaccessible. Its SEO content and structured data never render. Sitemap link in XML sitemap (`files.earnbase.finance/sitemap.xml`) likely points to `/sitemap` which redirects away.

**Fix:** Remove `"/sitemap": "/"` from LEGACY_REDIRECTS, or remove the Route if the sitemap page is intentionally deprecated.

---

### Issue #2: `/eth2` is indexable with duplicate content (MEDIUM)

**Problem:** Dev/test page at `/eth2` renders `AssetPageV2` with no URL ticker param, defaulting to `TICKER = 'ETH'`. It produces the exact same SEO output as `/eth` (same title, same description, same structured data). No `noindex` is set.

**Impact:** If crawled, creates a duplicate content issue with `/eth`. Canonical URL would be `/eth2` (auto-generated), which is wrong.

**Fix:** Add `noindex` to the SEO component, or remove the route entirely.

---

### Issue #3: `/pp1` has ZERO SEO tags (HIGH)

**Problem:** Dev/test page at `/pp1` renders `ProductPageV2` which contains **no SEO component at all** -- no `<title>`, no `<meta description>`, no structured data, no `noindex`. When visited, it inherits whatever meta tags were set by the previous page navigation.

**Impact:** If crawled, the page has no title, no description, and is indexable. Could show up in search results with inherited/stale meta data.

**Fix:** Either add `<SEO title="..." description="..." noindex />` inline in `App.tsx`, or remove the route.

---

### Issue #4: `/pp2` is indexable with duplicate content (MEDIUM)

**Problem:** Dev/test page at `/pp2` renders `ProductPageV3` which auto-picks the highest-TVL product. It generates full SEO (title, description, structured data, OG image) for whichever vault it picks -- creating an exact duplicate of that vault's `/vault/:slug` page. No `noindex` is set.

**Impact:** Duplicate content with a real vault page. Canonical URL would be `/pp2`, which is wrong.

**Fix:** Add `noindex` to the SEO component, or remove the route entirely.

---

### Issue #5: `/project/:slug` missing OG image (LOW)

**Problem:** ProjectPage renders `<SEO ... />` without the `ogImage` prop. All other public pages (homepage, hub, network, vault) pass an OG image URL. Project pages will have no `og:image` meta tag, resulting in no image preview when shared on social media.

**Impact:** Social sharing of project page URLs shows no image preview (Twitter, Slack, Discord, etc.).

**Fix:** Add `ogImage={ogImageUrl.home()}` to use the default Earnbase OG image (as spec states: "use the same default Earnbase OG image used on hub pages").

---

### Issue #6: `/vault/:slug` -- no SEO on 404 state (MEDIUM)

**Problem:** When ProductPageV3 can't find a matching product (unknown slug, not loading), it shows a "No products available" message **without any SEO component**. No `noindex`, no title, no description. The page retains whatever meta tags were set by the previous navigation.

**Impact:** If a search engine crawls an old/deleted vault URL, it finds an indexable page with stale/wrong meta tags. This is partially mitigated by `LEGACY_REDIRECTS` for known dead products, but any future product removals would create this issue.

**Fix:** Add `<SEO title="Vault Not Found | Earnbase" description="..." noindex />` to the not-found state in ProductPageV3.

---

### Issue #7: No catch-all `*` route (LOW-MEDIUM)

**Problem:** There is no `<Route path="*" element={<NotFound />} />` in the router. Unknown URLs like `/asdfgh` match `/:ticker` and render AssetPageV2 with `TICKER = 'ASDFGH'`. This produces:
- Title: `Best ASDFGH Yield -- DeFi Strategies by APY | Earnbase`
- Empty table with 0 strategies
- Indexable page (no noindex)

**Impact:** Any random URL produces a thin indexable page with a nonsensical title. Search engines could discover these via crawl errors or external links.

**Fix:** Add a catch-all `*` route that renders a proper 404 page with `noindex`. Alternatively, add logic in AssetPageV2 to detect when `tickerProducts.length === 0` and no valid ticker match exists, then render a 404 with noindex.

---

### Issue #8: SitemapPage doesn't include `/project/` pages (MEDIUM)

**Problem:** `SitemapPage.tsx` builds its hierarchy from `buildHierarchy()` which only generates Asset Hub, Network Filter, and Vault links. No `/project/:slug` pages are included in the HTML sitemap or its JSON-LD ItemList.

**Impact:** Project pages are not discoverable via the sitemap page. The Cloudflare Worker `sitemap.xml` also likely lacks project pages (noted in user's task list).

**Fix:** Add a "Projects" section to SitemapPage listing all qualifying project pages.

---

### Issue #9: `robots` meta tag lifecycle (MINOR)

**Problem (now fixed):** Previously, the SEO component only set `robots` to `noindex, nofollow` when `noindex=true`, and removed the tag entirely when `noindex=false`. This meant indexable pages had no explicit `robots` directive. The recent fix now explicitly sets `index, follow` for non-noindex pages.

**Status:** Fixed in this session.

---

## 3. All Internal Links in the Project

### Navigation Links (in Layout/LayoutTopNav)

| Link | Target | Type | Location |
|---|---|---|---|
| Logo | `/` | `<Link>` | LayoutTopNav.tsx |
| Sitemap | `https://files.earnbase.finance/sitemap.xml` | `<a>` external | LayoutTopNav.tsx footer, Layout.tsx footer |
| LLMs.txt | `https://files.earnbase.finance/llms.txt` | `<a>` external | LayoutTopNav.tsx footer, Layout.tsx footer |
| X (Twitter) | External | `<a>` external | LayoutTopNav.tsx footer |

### Page-Generated Internal Links

| Source Page | Link Target Pattern | Link Type |
|---|---|---|
| Homepage (HeroSection) | None outbound | -- |
| Homepage (TopDeFiYields) | `/vault/{slug}` | `<Link>` |
| Homepage (AssetGrid) | `/{ticker}` | `<Link>` |
| Homepage (HomepageContent) | `/vault/{slug}` (top yields) | `<Link>` |
| Homepage (HomepageContent) | `/project/{slug}` (Explore by Project) | `<Link>` |
| Homepage (TrendingProducts) | `/vault/{slug}` | `<Link>` |
| AssetPageV2 (hub/network) | `/vault/{slug}` (table rows) | click navigate |
| AssetPageV2 (hub) | `/{ticker}/{network}` (network pills) | click navigate |
| AssetPageV2 (hub) | `/{ticker}` (cross-links) | `<Link>` |
| ProductPageV3 (vault) | `/` (breadcrumb) | `<Link>` |
| ProductPageV3 (vault) | `/{ticker}` (breadcrumb) | `<Link>` |
| ProductPageV3 (vault) | `/{ticker}/{network}` (breadcrumb) | `<Link>` |
| ProductPageV3 (vault) | `/project/{slug}` (sidebar Platform row) | `<Link>` |
| ProductPageV3 (vault) | `/project/{slug}` (Yield Overview text) | `<Link>` |
| ProductPageV3 (vault) | `/project/{slug}` (MORE ON... sidebar) | `<Link>` |
| ProductPageV3 (vault) | `/vault/{slug}` (related vaults sidebar) | `<Link>` |
| ProductPageV3 (vault) | External product URL | `<a>` (Open Product button) |
| ProjectPage | `/vault/{slug}` (product tables) | click navigate |
| ProjectPage | `/` (404 back link) | `<Link>` |
| SitemapPage | `/{ticker}` | `<Link>` |
| SitemapPage | `/{ticker}/{network}` | `<Link>` |
| SitemapPage | `/vault/{slug}` | `<Link>` |

### Legacy Redirects (LEGACY_REDIRECTS in App.tsx)

72 entries total. Categories:

| Category | Count | Example |
|---|---|---|
| Garbage URLs (`/$`, `/&`) -> `/` | 2 | `/$` -> `/` |
| `/sitemap` -> `/` | 1 | `/sitemap` -> `/` |
| Uppercase ticker hubs | 6 | `/ETH` -> `/eth` |
| Uppercase ticker/network | 9 | `/ETH/Base` -> `/eth/base` |
| Invalid network slugs | 6 | `/cbbtc/eth` -> `/cbbtc` |
| Old network slug | 1 | `/usdc/bnb-chain` -> `/usdc/bnb` |
| Old format `/{ticker}/{network}/{product}` | 16 | `/usdc/mainnet/morpho-...` -> `/vault/...` |
| Old vault slugs (missing network suffix) | 29 | `/vault/eth-weth-lend-fluid` -> `/vault/eth-weth-lend-fluid-mainnet` |
| Dead products -> hub page | 2 | `/vault/cbbtc-wintermute-...` -> `/cbbtc` |

---

## 4. Project Pages URL Map

All 20 projects with hardcoded descriptions in `ProjectPage.tsx`. Pages are dynamically generated when `strategyCount >= MIN_STRATEGIES (2)`:

| # | Slug | Display Name | URL |
|---|---|---|---|
| 1 | morpho | Morpho | `/project/morpho` |
| 2 | euler | Euler | `/project/euler` |
| 3 | aave | Aave | `/project/aave` |
| 4 | ipor-fusion | IPOR Fusion | `/project/ipor-fusion` |
| 5 | harvest | Harvest | `/project/harvest` |
| 6 | yearn | Yearn | `/project/yearn` |
| 7 | lagoon | Lagoon | `/project/lagoon` |
| 8 | fluid | Fluid | `/project/fluid` |
| 9 | beefy | Beefy | `/project/beefy` |
| 10 | gearbox | Gearbox | `/project/gearbox` |
| 11 | wildcat | Wildcat | `/project/wildcat` |
| 12 | spark | Spark | `/project/spark` |
| 13 | yo | YO | `/project/yo` |
| 14 | compound | Compound | `/project/compound` |
| 15 | yearn-v2 | Yearn V2 | `/project/yearn-v2` |
| 16 | moonwell | Moonwell | `/project/moonwell` |
| 17 | extrafi | ExtraFi | `/project/extrafi` |
| 18 | tokemak | Tokemak | `/project/tokemak` |
| 19 | silo | Silo | `/project/silo` |
| 20 | arcadia | Arcadia | `/project/arcadia` |

---

## 5. Asset Hub Pages (dynamic, based on product data)

Known tickers from the codebase:

| Ticker | Hub URL | Example Network URLs |
|---|---|---|
| USDC | `/usdc` | `/usdc/mainnet`, `/usdc/base`, `/usdc/arbitrum`, `/usdc/avalanche`, `/usdc/bnb` |
| ETH | `/eth` | `/eth/mainnet`, `/eth/base`, `/eth/arbitrum` |
| USDT | `/usdt` | `/usdt/mainnet` |
| WBTC | `/wbtc` | `/wbtc/mainnet`, `/wbtc/arbitrum` |
| cbBTC | `/cbbtc` | `/cbbtc/base` |
| EURC | `/eurc` | `/eurc/mainnet`, `/eurc/base` |

---

## 6. Summary of Recommended Fixes (Priority Order)

| Priority | Issue | Fix |
|---|---|---|
| **P0** | #1 `/sitemap` dead route | ~~Remove from LEGACY_REDIRECTS~~ DONE |
| **P1** | #3 `/pp1` no SEO at all | ~~Add noindex SEO or remove route~~ DONE (noindex added) |
| **P1** | #2 `/eth2` duplicate content | ~~Add noindex or remove route~~ DONE (noindex added) |
| **P1** | #4 `/pp2` duplicate content | ~~Add noindex or remove route~~ DONE (noindex added) |
| **P1** | #6 Vault 404 no noindex | ~~Add noindex SEO to not-found state~~ DONE |
| **P2** | #7 No catch-all route | ~~Add `*` route with 404 page + noindex~~ DONE |
| **P2** | #7b `/:ticker` catches junk URLs | ~~Ticker validation in AssetPageV2~~ DONE (whitelist: usdc, eth, usdt, eurc, wbtc, cbbtc) |
| **P2** | #8 Sitemap missing projects | ~~Add project pages to SitemapPage~~ DONE |
| **P2** | #5 Project pages no OG image | ~~Add `ogImage={ogImageUrl.home()}`~~ DONE |
| **P3** | #9 Robots meta lifecycle | Already fixed |

---

*End of audit.*