import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { LayoutTopNav } from "./components/LayoutTopNav";
import { TrackerTable, DeFiProduct } from "@/app/components/TrackerTable";
import { AssetGrid } from "@/app/components/AssetGrid";
import { AddProductPage } from "@/app/components/AddProductPage";
import { AssetSEOContent } from "@/app/components/AssetSEOContent";
import { ControlRoom } from "./components/ControlRoom";
import { PasswordGate } from "./components/PasswordGate";
import { SitemapPage } from "./components/SitemapPage";
import { SEO, homepageSEO, ogImageUrl } from "./components/SEO";
import { AssetPageV2 } from "./components/AssetPageV2";
import { ProductPageV3 } from "./components/ProductPageV3";
import { RegistryProvider } from "@/app/contexts/RegistryContext";
import * as api from "@/app/utils/api";
import { applyYieldDeviation } from "@/app/utils/yieldDeviation";
import { displaysAsZeroAPY } from "@/app/utils/formatters";
import { usePageViewTracker } from "@/app/hooks/usePageViewTracker";
import { Database } from 'lucide-react';
import { HomepageContent, TopDeFiYields } from "./components/HomepageContent";
import { HeroSection } from "./components/HeroSection";
import { YieldCalculator } from "./components/YieldCalculator";
import { TrendingProducts } from "./components/TrendingProducts";
import { BrandAssetsPage } from "./components/BrandAssetsPage";
import { ProjectPage } from "./components/ProjectPage";
import { CuratorPage } from "./components/CuratorPage";
import { AboutPage } from "./components/AboutPage";
import { StudioPage } from "./components/StudioPage";
import { HomepageSectionSkeleton } from "./components/ui/Skeletons";
/**
 * CRITICAL: legacyRedirects MUST be the first app-level import.
 * Its module-level IIFE calls window.location.replace() BEFORE React mounts.
 * `isRedirecting` lets us short-circuit rendering → zero flash on redirect URLs.
 */
import { isRedirecting } from "./legacyRedirects";

// Set default title immediately to prevent "Earnbase Core" from the hosting
// platform's index.html leaking into Google's index during loading states.
if (typeof document !== 'undefined' && document.title !== 'Earnbase') {
  document.title = 'Earnbase';
}

const Dashboard: React.FC<{
  products: DeFiProduct[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  tickers: string[];
  tickerCounts: Record<string, number>;
  filterTicker?: string;
  displaySettings?: api.DisplaySettings;
}> = ({ products, loading, error, onRefresh, tickers, tickerCounts, filterTicker, displaySettings }) => {
  const displayProducts = filterTicker 
    ? products.filter(p => p && (p.ticker || '').toLowerCase() === filterTicker.toLowerCase())
    : products;

  // Homepage-filtered products: apply homeMinTvl + zero-APY display settings
  const homeProducts = useMemo(() => {
    let filtered = products;
    const minTvl = displaySettings?.homeMinTvl ?? 0;
    if (minTvl > 0) {
      filtered = filtered.filter(p => (p.tvl ?? 0) >= minTvl);
    }
    if (!displaySettings?.showZeroApy) {
      filtered = filtered.filter(p => !displaysAsZeroAPY(p.spotAPY) && !displaysAsZeroAPY(p.monthlyAPY));
    }
    return filtered;
  }, [products, displaySettings?.homeMinTvl, displaySettings?.showZeroApy]);

  const homeSeo = homepageSEO(tickers, products.length);

  // Dynamic counts for homepage intro
  const totalNetworks = useMemo(() => {
    const s = new Set<string>();
    products.forEach(p => { if (p?.network) s.add(p.network); });
    return s.size;
  }, [products]);

  return (
    <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
      <SEO
        title={homeSeo.title}
        description={homeSeo.description}
        structuredData={homeSeo.structuredData}
        ogImage={ogImageUrl.home()}
      />
      <div className="space-y-16">
        {/* Hero section on homepage, standard header on filtered view */}
        {filterTicker ? (
          <header className="space-y-2">
            <h1 className="text-[17px] font-medium text-[#141414] dark:text-foreground leading-tight w-full">
              <span className="contents">Best <span className="text-[#08a671]">{filterTicker.toUpperCase()}</span> Yields</span>
            </h1>
            <p className="text-[13px] text-[#09090b] dark:text-foreground/80 font-normal leading-relaxed w-full">
              {`Discover the highest-performing yield opportunities for ${filterTicker.toUpperCase()} across the entire DeFi ecosystem. Monitor real-time rates, TVL, and historical trends to maximize your on-chain returns.`}
            </p>
          </header>
        ) : (
          <HeroSection products={products} totalNetworks={totalNetworks} />
        )}
        
        {/* Top DeFi Yields — homepage only, above calculator */}
        {!filterTicker && homeProducts.length > 0 && <TopDeFiYields products={homeProducts} />}
        {!filterTicker && loading && products.length === 0 && (
          <HomepageSectionSkeleton title="Top DeFi Yields Right Now" />
        )}

        {/* Yield calculator — homepage only */}
        {!filterTicker && <YieldCalculator products={homeProducts} />}

        {/* Trending products — real pageview data */}
        {!filterTicker && homeProducts.length > 0 && <TrendingProducts products={homeProducts} />}
        {!filterTicker && loading && products.length === 0 && (
          <HomepageSectionSkeleton title="Trending Products" />
        )}
        
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-3 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
            <p>{error}</p>
            <button onClick={onRefresh} className="underline font-bold ml-auto">Retry</button>
          </div>
        )}
        
        <div className="space-y-8">
          {products.length === 0 && !loading ? (
            <div className="p-12 border-2 border-dashed border-border rounded-xl text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold">No Assets Found</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                No active yield opportunities found in the database yet. New products are being indexed — check back soon.
              </p>
            </div>
          ) : filterTicker ? (
            <TrackerTable products={displayProducts} loading={loading} allTickers={tickers} />
          ) : (
            <section id="explore-assets">
              <h2 className="text-[17px] font-medium text-foreground mb-4">Explore Assets</h2>
              <AssetGrid products={homeProducts} loading={loading} />
            </section>
          )}
        </div>

        {filterTicker && <AssetSEOContent ticker={filterTicker} products={products} />}

        {/* Homepage-only content sections — SEO enrichment */}
        {!filterTicker && homeProducts.length > 0 && (
          <HomepageContent products={homeProducts} />
        )}
      </div>
    </LayoutTopNav>
  );
};

const TickerView = ({ products, loading, tickers, tickerCounts, displaySettings }: any) => {
  return (
    <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
      <AssetPageV2 products={products} loading={loading} allTickers={tickers} displaySettings={displaySettings} />
    </LayoutTopNav>
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Invisible component that tracks page views on every route change */
function PageViewTracker() {
  usePageViewTracker();
  return null;
}

export default function App() {
  // Short-circuit: if a legacy redirect is in progress, render nothing.
  // window.location.replace() is async — without this guard React would
  // mount the full tree and paint a frame before the browser navigates away.
  if (isRedirecting) return null;

  const [products, setProducts] = useState<DeFiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [privateCreditIds, setPrivateCreditIds] = useState<(number | string)[]>([]);
  const [displaySettings, setDisplaySettings] = useState<api.DisplaySettings>({ assetMinTvl: 0, homeMinTvl: 0, showZeroApy: false });

  // Memoize derived data — prevents recalculation on every render
  const tickerCounts = useMemo(() => {
    return products.reduce((acc, p) => {
      if (p) {
        const t = (p.ticker || 'N/A').toUpperCase();
        acc[t] = (acc[t] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const tickers = useMemo(() => {
    return Object.keys(tickerCounts).sort((a, b) => {
      const countDiff = tickerCounts[b] - tickerCounts[a];
      if (countDiff !== 0) return countDiff;
      return a.localeCompare(b);
    });
  }, [tickerCounts]);

  // Stable fetch callback — won't trigger re-renders in children
  const fetchPools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Single atomic fetch: products + Rule #5 exclusion list + private credit IDs bundled from server
      const { products: data, rule5Exclusions: exclusionIds, privateCreditIds: pcIds } = await api.fetchPools();
      setPrivateCreditIds(pcIds);
      if (pcIds.length > 0) {
        console.log(`[PrivateCredit] Loaded ${pcIds.length} tagged product(s) from server:`, pcIds);
      }
      // Rule #5: Apply deterministic +0–0.01% micro-deviation (respecting exclusions)
      setProducts(applyYieldDeviation(data, exclusionIds));
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  // Load display settings (fire-and-forget, non-blocking)
  useEffect(() => {
    api.fetchDisplaySettings()
      .then((s) => setDisplaySettings(s))
      .catch((err) => console.warn('[DisplaySettings] Load failed:', err.message));
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageViewTracker />
      <RegistryProvider>
      <Routes>
        <Route 
          path="/" 
          element={
            <Dashboard 
              products={products} 
              loading={loading} 
              error={error} 
              onRefresh={fetchPools} 
              tickers={tickers}
              tickerCounts={tickerCounts}
              displaySettings={displaySettings}
            />
          } 
        />
        <Route 
          path="/add-product" 
          element={
            <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
              <SEO title="List Yield | Earnbase" description="Internal yield management tool." noindex />
              <AddProductPage />
            </LayoutTopNav>
          } 
        />
        <Route 
          path="/control-room" 
          element={
            <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
              <SEO title="Control Room | Earnbase" description="Internal admin panel." noindex />
              <PasswordGate password="earnpassword">
                <ControlRoom />
              </PasswordGate>
            </LayoutTopNav>
          } 
        />
        <Route 
          path="/sitemap" 
          element={
            <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
              <SitemapPage products={products} loading={loading} />
            </LayoutTopNav>
          } 
        />
        <Route 
          path="/brand-assets" 
          element={
            <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
              <BrandAssetsPage />
            </LayoutTopNav>
          } 
        />
        <Route 
          path="/project/:slug" 
          element={
            <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
              <ProjectPage products={products} loading={loading} error={error} />
            </LayoutTopNav>
          } 
        />
        <Route 
          path="/curator/:curatorSlug" 
          element={
            <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
              <CuratorPage products={products} loading={loading} error={error} />
            </LayoutTopNav>
          } 
        />
        <Route 
          path="/about" 
          element={
            <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
              <AboutPage products={products} loading={loading} />
            </LayoutTopNav>
          } 
        />
        <Route 
          path="/studio" 
          element={
            <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
              <StudioPage products={products} loading={loading} allTickers={tickers} privateCreditIds={privateCreditIds} onRefresh={fetchPools} />
            </LayoutTopNav>
          } 
        />
        <Route 
          path="/:ticker" 
          element={
            <TickerView 
              products={products} 
              loading={loading}
              tickers={tickers}
              tickerCounts={tickerCounts}
              displaySettings={displaySettings}
            />
          } 
        />
        <Route 
          path="/:ticker/:network" 
          element={
            <TickerView 
              products={products} 
              loading={loading}
              tickers={tickers}
              tickerCounts={tickerCounts}
              displaySettings={displaySettings}
            />
          } 
        />
        <Route 
          path="/vault/:slug" 
          element={
            <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
              <ProductPageV3 products={products} loading={loading} privateCreditIds={privateCreditIds} displaySettings={displaySettings} />
            </LayoutTopNav>
          } 
        />
        <Route 
          path="*" 
          element={
            <LayoutTopNav tickers={tickers} tickerCounts={tickerCounts}>
              <SEO title="Page Not Found | Earnbase" description="The page you are looking for does not exist." noindex />
              <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Database className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <div>
                  <h1 className="text-[17px] font-medium text-foreground">Page Not Found</h1>
                  <p className="text-[13px] text-muted-foreground mt-1">This page doesn't exist on Earnbase.</p>
                </div>
                <a
                  href="/"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-xs font-semibold hover:bg-[#08a671]/90 transition-all"
                >
                  Back to Home
                </a>
              </div>
            </LayoutTopNav>
          } 
        />
      </Routes>
      </RegistryProvider>
    </BrowserRouter>
  );
}