# DeFi Yield Product Admin Panel -- Full Build Brief

> **Audience:** A separate Figma Make instance building this from zero.
> You have access to a shared Supabase project (database + edge functions). You know nothing about the public-facing frontend. Your job is to build a standalone **admin panel** for managing a curated index of DeFi yield products.

---

## 1. What This System Is

You are building the back-office for a yield aggregator that tracks DeFi lending/staking products across multiple blockchains. The data pipeline is:

```
Admin (you) --> Index table (source of truth)
                    |
            External script (not yours) reads Index,
            fetches live APY/TVL from DeFiLlama API,
            writes to Products table
                    |
            Public frontend reads Products table
```

**Your admin panel manages the Index table.** You also read from Products (read-only) to show live APY/TVL data and detect pending-inclusion status.

---

## 2. Supabase Tables

### 2.1 `Index` (you manage this)

| Column          | Type         | Notes                                                                                            |
| --------------- | ------------ | ------------------------------------------------------------------------------------------------ |
| `id`            | integer      | Auto-incremented manually (find MAX + 1)                                                         |
| `ticker`        | text         | Asset symbol, e.g. `ETH`, `USDC`, `WBTC`                                                         |
| `network`       | text         | Blockchain name, e.g. `Ethereum`, `Base`, `Arbitrum`                                             |
| `platform`      | text         | DeFi protocol, e.g. `Aave`, `Morpho`, `Pendle`                                                   |
| `productName`   | text         | Human-readable product name, e.g. `Core USDC`, `Prime ETH`                                       |
| `curator`       | text or null | Optional vault curator, e.g. `Steakhouse`, `Gauntlet`, `MEV Capital`                             |
| `defillamaId`   | text         | UUID from DeFiLlama yields API (e.g. `a]b1c2d3-e4f5-...`). This is the **join key** to Products. |
| `productLink`   | text         | Official product URL (https://app.aave.com/...)                                                  |
| `url`           | text         | **Frozen URL slug** (see section 4). Once set, NEVER changes.                                    |
| `vault_address` | text or null | On-chain contract address, `0x...`                                                               |
| `sponsored`     | boolean      | Default false                                                                                    |

> **IMPORTANT:** The column naming is inconsistent across tables. The Index table may use `productName` (camelCase) or `product_name` (snake_case) depending on which columns exist. Always introspect with a sample query first. Same for `defillamaId` vs `defillamaID` vs `defillama_id`.

### 2.2 `Products` (read-only for you)

Populated by an external DeFiLlama sync script. Contains live yield data:

| Column                             | Notes                               |
| ---------------------------------- | ----------------------------------- |
| `id`                               | integer                             |
| `vault` / `ticker`                 | Asset ticker                        |
| `network`                          | Chain                               |
| `platform` / `platform_name`       | Protocol                            |
| `productName` / `product_name`     | Name                                |
| `curator`                          | Curator                             |
| `defillamaId` / `defillamaID`      | Join key to Index                   |
| `dailyApy` / `spotApy` / `spotAPY` | 24h APY (float)                     |
| `weeklyApy` / `weeklyAPY`          | 7d APY                              |
| `monthlyApy` / `monthlyAPY`        | 30d APY                             |
| `tvl`                              | Total value locked (float, USD)     |
| `dailyApyHistory`                  | JSON array of historical APY values |
| `tvlHistory`                       | JSON array of historical TVL values |
| `productLink` / `product_link`     | Product URL                         |

### 2.3 `Index_duplicate` / `Products_duplicate`

Mirror/backup tables. The "Sync from Production" action copies Index -> Index_duplicate and Products -> Products_duplicate using upsert.

### 2.4 `kv_store_7b092b69` (KV store)

Used for lightweight key-value data:

- `hidden_products` -- array of product IDs to hide from public frontend
- `private_credit_products` -- array of product IDs tagged as private credit
- `rule5:exclusions` -- array of product IDs excluded from a display rule

---

## 3. Server API (Hono on Deno, Supabase Edge Functions)

All routes are prefixed with `/make-server-{YOUR_ID}`. Use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from env. CORS must be fully open. Use Hono's `cors` from `npm:hono/cors` and `logger` from `npm:hono/logger`.

### 3.1 Index CRUD

#### `POST /index-product`

Create a new Index entry.

- Auto-increment ID: query `MAX(id)` from Index, use `MAX(id) + 1` (minimum 300).
- Auto-generate `url` slug (see section 4).
- Trim DeFiLlama link: if the value contains `/pool/`, extract just the UUID after it.
- Introspect column names from a sample row before inserting.

Request body:

```json
{
  "ticker": "ETH",
  "network": "Ethereum",
  "platform": "Aave",
  "productName": "Core ETH",
  "curator": "Gauntlet",
  "productLink": "https://app.aave.com/...",
  "defillama_link": "https://defillama.com/yields/pool/abc-123",
  "vault_address": "0x..."
}
```

#### `GET /index-products`

Returns **pending** products only (in Index but not yet in Products). Logic:

1. Fetch all Products, build a Set of their defillamaIds.
2. Fetch all Index rows.
3. Return Index rows whose defillamaId is NOT in the Products set (or has no defillamaId).

#### `GET /index-products-all`

Returns ALL Index rows, ordered by `id DESC`.

#### `PUT /index-product/:id`

Update an Index row. **Must implement Frozen URL Policy** (section 4):

- If the update touches slug-relevant fields (`ticker`, `productName`, `platform`, `curator`, `network`):
  - Fetch the current row.
  - If `url` is already set and non-empty: **delete `url` from the update body** (never overwrite).
  - If `url` is empty/null: generate a new slug and set it.
- Then apply the update.

#### `DELETE /index-product/:id`

Delete an Index row by ID.

### 3.2 Products (read-only queries, write for sync)

#### `GET /pools`

Returns all Products with **Index Shield** correction applied (see section 5). Also returns `rule5Exclusions` and `privateCreditIds` arrays from KV store. Supports `?includeHidden=true` query param.

Response:

```json
{
  "products": [...],
  "rule5Exclusions": [1, 2, 3],
  "privateCreditIds": [4, 5]
}
```

#### `POST /pools`

Upsert a product into the Products table. Used when manually promoting an Index entry.

#### `DELETE /pools/:id`

Delete a product from Products.

### 3.3 Summary & Sync

#### `GET /summary-counts`

Returns:

```json
{
  "assets": 245,    // Products count
  "index": 260,     // Index count
  "diff": 15        // Pending inclusion (in Index but missing from Products)
}
```

#### `POST /sync-index`

Copy all Index rows to `Index_duplicate` (backup).

#### `POST /sync-products`

Copy all Products rows to `Products_duplicate` (backup).

### 3.4 Backfill

#### `POST /backfill-index-urls`

One-time utility. Iterates ALL Index rows:

- If `url` is already set: skip (frozen).
- If `url` is empty: generate slug from fields and write it.
- Processes in chunks of 20.
- Returns report: `{ total, updated, frozen, skipped, errors, sample }`.

### 3.5 Hidden Products

#### `GET /hidden-products`

Returns `{ ids: [1, 2, 3] }` from KV.

#### `PUT /hidden-products`

Body: `{ ids: [1, 2, 3] }`. Saves to KV.

### 3.6 Private Credit

#### `GET /private-credit`

Returns `{ ids: [...] }` from KV. Handle multiple stored formats (plain array, `{ ids: [...] }`, stringified JSON).

#### `PUT /private-credit`

Body: `{ ids: [...] }`. Accepts both numeric and string IDs.

---

## 4. Frozen URL Policy (CRITICAL)

Every product gets a permanent URL slug stored in the `url` column of the Index table. The pattern:

```
{ticker}-{productName}-{platform}[-{curator}]-{network}
```

### Slug Generation Algorithm

```
function generateVaultSlug(ticker, productName, platform, curator?, network?):
  1. slugifyPart(text):
     - lowercase, trim
     - remove [bracketed] and (parenthesized) content
     - replace non-alphanumeric with hyphens
     - collapse multiple hyphens
     - trim leading/trailing hyphens

  2. parts = [slugifyPart(ticker), slugifyPart(productName), slugifyPart(platform)]
  3. if curator exists and is not "-" or empty: parts.push(slugifyPart(curator))
  4. if network exists: parts.push(slugifyPart(network))
  5. join all parts with "-", split into words
  6. DEDUPLICATE: remove repeated words (keep first occurrence)
  7. return deduped.join("-")
```

Example: `ETH`, `Prime ETH`, `Lido`, `Steakhouse`, `Ethereum`
-> `eth-prime-lido-steakhouse-ethereum` (second "eth" deduplicated from "prime eth")

### The Frozen Rule

- When creating a new Index entry: always auto-generate the slug and store in `url`.
- When updating an Index entry:
  - If `url` already has a value: **NEVER overwrite it**, even if the product name, platform, or other fields change.
  - If `url` is empty/null: generate it from the (potentially updated) fields.
- The public frontend uses this slug for permanent URLs. Changing it would break links, SEO, bookmarks.
- The edit panel should display a **frozen URL indicator** (lock icon, blue badge) when a url exists, showing it is immutable.

---

## 5. Index Shield

The Index table is the **source of truth** for product metadata. When reading from Products, apply corrections:

For each Product row:

1. Extract its `defillamaId`.
2. Look up the matching Index row by `defillamaId`.
3. If found, override the Product's `product_name`, `curator`, `platform_name`, `url`, and `vault_address` with values from Index.

This ensures that manual corrections in the Index always win over whatever DeFiLlama provided.

---

## 6. UI Screens to Build

### 6.1 Password Gate

The entire admin panel must be behind a simple password wall.

- Single password input, no username.
- Store unlock state in `sessionStorage` (clears on tab close).
- Key: `earnbase:cr-unlocked`, value: `'1'`.

### 6.2 Dashboard / Summary Banner

Three stat cards at the top:

- **Live Assets**: count from Products table (green icon)
- **Total in Index**: count from Index table (blue icon)
- **Pending Inclusion**: difference (amber icon). If > 0, show pulsing "SYNC NEEDED" badge.

### 6.3 Add Product Form (Tab 1: "Add Product")

Left side (7/12 columns): form. Right side (5/12): Pending Inclusion list.

**Form fields:**

| Field                 | Type            | Required | Notes                                                  |
| --------------------- | --------------- | -------- | ------------------------------------------------------ |
| Ticker                | Select dropdown | Yes      | Populated from unique tickers in Products table        |
| Network               | Select dropdown | Yes      | Fixed list (see section 7)                             |
| Platform              | ComboInput      | Yes      | Hybrid input with autocomplete from existing platforms |
| Curator               | ComboInput      | No       | Same hybrid input, from existing curators              |
| Product Name          | Text input      | Yes      | e.g. "Core USDC"                                       |
| DeFiLlama Yield Link  | Text input      | No       | Full URL or just UUID                                  |
| Official Product Link | Text input      | Yes      | https://...                                            |
| Vault Address         | Text input      | No       | 0x... (monospace font)                                 |

**ComboInput** is a custom component: text input that shows a filtered dropdown of existing values on focus/type. User can pick a suggestion OR type a new value freely. It is not a locked select.

**Live Slug Preview**: below the form, show the auto-generated URL slug in real-time as the user types, formatted as `/vault/{slug}`.

**Pending Inclusion Panel** (right side): shows Index entries that have no matching Products row. Each item shows: ID badge, platform: product name, network, ticker. Status: "AWAITING SYNC". Footer text: "Sequence: Index (Manual) -> Script -> Products (Live)".

### 6.4 Index Management Table (Tab 2: "List Yield")

Full-width table of ALL Index entries.

**Columns:** `# (ID) | Asset (icon + ticker) | Product (name + curator + platform sub-line) | APY (from Products join) | TVL (from Products join) | Network (badge) | URL Slug (mono) | chevron`

- APY and TVL are looked up by joining on defillamaId to the Products table. Show "-" if no match.
- APY and TVL columns are sortable (3-state: desc -> asc -> none).
- Full-text search across ticker, product name, platform, network, curator, and ID.
- Counter badge showing "X matches" or "X total".

**Click to expand** a row into an inline edit panel:

**Edit Panel fields:**

- Product Name (text input)
- Platform (ComboInput with suggestions)
- Curator (ComboInput with suggestions)
- Network (select dropdown)
- DeFiLlama ID (text input + copy button + external link to DeFiLlama)
- Product Link (text input + copy button + external link)
- Vault Address (text input, monospace)

**Frozen URL display** in edit panel:

- If `url` is set: show blue badge with lock icon: "URL is frozen: /vault/{url}" (links to production URL).
- If `url` is empty: show gray link: "View Product Page /vault/{generated-slug}".
- The `url` field itself is NOT directly editable (it is frozen once set).

**Actions in edit panel:**

- Save Changes (green pill button)
- Cancel (gray pill button)
- Delete (red, right-aligned, opens confirmation modal)

**Delete Confirmation Modal:**

- Warns with product name, asks "Delete from Index?"
- Cancel / Delete Record buttons
- "This action cannot be undone."

### 6.5 Sync from Production

Button at the bottom of the management table: "Sync from Production".

- Opens confirmation modal.
- Calls `POST /sync-index` + `POST /sync-products` in sequence.
- Creates backups in duplicate tables.

### 6.6 Hidden Products Panel

Toggle individual products visible/hidden from the public frontend.

- Fetch ALL products (including hidden via `?includeHidden=true`).
- Fetch hidden IDs from `GET /hidden-products`.
- Show a searchable, sortable table with eye/eye-off toggle per row.
- "Unsaved changes" indicator when toggles differ from saved state.
- Save button calls `PUT /hidden-products` with the full array of hidden IDs.

### 6.7 Private Credit Panel

Tag products as "private credit" (a category label).

- Similar to Hidden Products but uses `GET/PUT /private-credit`.
- Toggle per product, search, save.

### 6.8 Backfill URL Slugs

A utility button (can live in a settings/tools area):

- Calls `POST /backfill-index-urls`.
- Shows results: total rows, updated, frozen (skipped because already had URL), skipped (no data), errors.
- Show sample of generated slugs.

---

## 7. Network List

Fixed list of supported networks for dropdown selectors:

```
Ethereum, Base, Arbitrum, BNB Chain, Sonic, Avalanche, Polygon, Optimism, Mantle, Scroll, Linea, Mode, Blast, zkSync Era, Gnosis, Fantom, Moonbeam, Celo, Cronos, Aurora, Boba, Metis, Fraxtal, Kava, Sei, Sui, Aptos, Solana, Berachain
```

---

## 8. Field Mapping Chaos (handle gracefully)

The Supabase tables have inconsistent column names due to legacy migrations. Your code must handle all variants:

| Logical Field | Possible Column Names                                          |
| ------------- | -------------------------------------------------------------- |
| Product name  | `productName`, `product_name`                                  |
| Platform      | `platform`, `platform_name`, `platformName`                    |
| DeFiLlama ID  | `defillamaId`, `defillamaID`, `defillama_id`, `defillama_link` |
| APY (24h)     | `dailyApy`, `dailyAPY`, `spotApy`, `spotAPY`                   |
| APY (7d)      | `weeklyApy`, `weeklyAPY`                                       |
| APY (30d)     | `monthlyApy`, `monthlyAPY`, `monhlyAPY` (yes, typo)            |
| Ticker        | `vault`, `ticker`, `asset`                                     |
| Product link  | `productLink`, `product_link`, `link`                          |

Always try multiple variants with `||` fallback chains.

---

## 9. Design & Style Notes

- **Tech stack**: React + Tailwind CSS + react-router (NOT react-router-dom).
- **Accent color**: `#08a671` (green). Use for primary buttons, active states, APY text.
- **Shape system**: rounded-2xl for cards, rounded-full (pill) for buttons and badges, rounded-xl for inputs.
- **Typography**: text-sm for body, text-xs for labels, text-[10px] for micro-labels. Labels are uppercase, tracking-wider, font-bold, text-muted-foreground.
- **Input style**: `bg-background border border-border rounded-[24px]` with `focus:ring-2 focus:ring-[#08a671]/20 focus:border-[#08a671]`.
- **Buttons**: pill-shaped (`rounded-full`), `text-xs font-bold`, green for primary, gray for secondary, red for destructive.
- **Tables**: inside `bg-card rounded-[24px] border border-border shadow-sm overflow-hidden`. Thin row dividers `divide-y divide-border/50`. Hover `hover:bg-muted/30`.
- **Toast notifications**: use `sonner` library. `toast.success()` for success, `toast.error()` for errors.
- **Dark mode**: support via Tailwind's dark: prefix. Toggle stored in localStorage.
- **No em dashes** anywhere in the UI. Use hyphens or commas.
- **Monospace** for: DeFiLlama IDs, vault addresses, URL slugs.
- **ComboInput** for Platform and Curator fields (never a locked select).

---

## 10. Auth / Environment Variables

The server uses:

- `SUPABASE_URL` -- Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` -- full-access service role key (NEVER expose to frontend)
- `SUPABASE_ANON_KEY` -- public anon key (used in frontend Authorization header)

Frontend requests use:

```
Authorization: Bearer {SUPABASE_ANON_KEY}
```

---

## 11. Pagination Warning

Supabase PostgREST limits responses to 1000 rows by default. If tables grow beyond 1000, you need paginated fetching:

```typescript
async function fetchAllRows(table, select, options?) {
  const BATCH = 1000;
  const all = [];
  let offset = 0;
  while (true) {
    const { data } = await supabase
      .from(table)
      .select(select)
      .range(offset, offset + BATCH - 1);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < BATCH) break;
    offset += BATCH;
  }
  return all;
}
```

Apply this to ALL endpoints that read from Index or Products.

---

## 12. Summary of All API Routes to Implement

| Method | Route                  | Purpose                                |
| ------ | ---------------------- | -------------------------------------- |
| GET    | `/health`              | Health check                           |
| POST   | `/index-product`       | Create Index entry                     |
| GET    | `/index-products`      | Pending products (not yet in Products) |
| GET    | `/index-products-all`  | All Index entries                      |
| PUT    | `/index-product/:id`   | Update Index entry (Frozen URL!)       |
| DELETE | `/index-product/:id`   | Delete Index entry                     |
| GET    | `/pools`               | All Products (with Index Shield)       |
| POST   | `/pools`               | Upsert Product                         |
| DELETE | `/pools/:id`           | Delete Product                         |
| GET    | `/summary-counts`      | Stats: assets, index, diff             |
| POST   | `/sync-index`          | Backup Index to duplicate              |
| POST   | `/sync-products`       | Backup Products to duplicate           |
| POST   | `/backfill-index-urls` | Generate slugs for rows missing url    |
| GET    | `/hidden-products`     | Get hidden product IDs                 |
| PUT    | `/hidden-products`     | Update hidden product IDs              |
| GET    | `/private-credit`      | Get private credit IDs                 |
| PUT    | `/private-credit`      | Update private credit IDs              |

---

## 13. Format Helpers

```typescript
function formatAPY(value: number): string {
  if (value === null || value === undefined || isNaN(value))
    return "-";
  return value.toFixed(2) + "%";
}

function formatTVL(value: number): string {
  if (!value || isNaN(value)) return "-";
  if (value >= 1_000_000_000)
    return "$" + (value / 1_000_000_000).toFixed(2) + "B";
  if (value >= 1_000_000)
    return "$" + (value / 1_000_000).toFixed(2) + "M";
  if (value >= 1_000)
    return "$" + (value / 1_000).toFixed(1) + "K";
  return "$" + value.toFixed(0);
}
```

---

## 14. Non-Goals (do NOT build these)

- Public-facing pages (asset pages, vault pages, homepage)
- SEO or sitemap generation
- Click tracking, search tracking, traffic analytics
- Registry management (network/asset/platform/curator icon uploads)
- Display rules engine (Rule #1-5)
- Name consolidation or curator extraction tools

Focus exclusively on: **Index CRUD, Products read, slug management, hidden/private-credit toggles, sync/backup, and the password gate.**