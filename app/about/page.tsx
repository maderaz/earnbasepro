import type { Metadata } from 'next';
import { fetchPools } from '@/lib/api';
import { aboutPageSEO, BASE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic'; // always fetch fresh, AbortSignal.timeout(8000) in api.ts prevents hangs

export async function generateMetadata(): Promise<Metadata> {
  let products: Awaited<ReturnType<typeof fetchPools>>['products'] = [];
  try { ({ products } = await fetchPools()); } catch { /* network unavailable */ }
  const seo = aboutPageSEO(products.length);
  const pageUrl = `${BASE_URL}/about`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: pageUrl },
    openGraph: { title: seo.title, description: seo.description, url: pageUrl },
    twitter: { title: seo.title, description: seo.description },
  };
}

export default async function AboutPage() {
  let products: Awaited<ReturnType<typeof fetchPools>>['products'] = [];
  try { ({ products } = await fetchPools()); } catch { /* network unavailable */ }
  const seo = aboutPageSEO(products.length);

  const assetCount = new Set(products.map(p => (p.ticker || '').toUpperCase())).size;
  const networkCount = new Set(products.map(p => p.network)).size;
  const platformCount = new Set(products.map(p => (p.platform_name || '').trim())).size;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.structuredData) }} />

      <div className="max-w-3xl space-y-12">
        <nav className="text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <span className="mx-1">/</span>
          <span className="text-foreground">About</span>
        </nav>

        <h1 className="text-2xl font-semibold text-foreground">About Earnbase</h1>

        {/* What Earnbase Does */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">What Earnbase Does</h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Earnbase is an independent DeFi yield data aggregator. It tracks {products.length}+ yield strategies
            across {assetCount} assets, {networkCount} networks, and {platformCount}+ protocols — including
            Morpho, Euler, Aave, IPOR Fusion, Yearn, Fluid, and more.
          </p>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Earnbase does not hold funds, execute transactions, or provide financial advice.
            It is a data layer — a lens for comparing DeFi yields across protocols and networks.
          </p>
        </section>

        {/* Methodology */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Methodology</h2>

          <div className="space-y-3">
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">APY is derived from on-chain exchange rates only.</strong>{' '}
              Each strategy's APY is calculated from the change in share price or exchange rate
              over a given period (24h, 7d, 30d). This reflects actual yield earned by depositors.
            </p>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">External incentives are excluded.</strong>{' '}
              Token rewards, points programs, liquidity mining bonuses, and other off-chain incentives
              are not included in APY figures. This is the core differentiator of Earnbase's methodology.
            </p>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Sustainability scoring (0–100) measures yield consistency.</strong>{' '}
              The sustainability score reflects how stable a strategy's APY has been over the past 30 days.
              A score of 100 means the yield has been perfectly consistent; lower scores indicate volatility.
            </p>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Rankings are relative, not absolute.</strong>{' '}
              Earnbase ranks strategies by APY within their asset class. A "top" USDC strategy
              is compared against other USDC strategies — not against ETH or BTC yields.
            </p>
          </div>
        </section>

        {/* What Earnbase Is Not */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">What Earnbase Is Not</h2>

          <div className="space-y-3">
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Not a financial advisor.</strong>{' '}
              Earnbase provides data for informational purposes only. Nothing on this site constitutes
              financial advice, investment recommendations, or solicitation.
            </p>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Not an audit or security assessment.</strong>{' '}
              Listing a strategy on Earnbase does not imply endorsement, audit, or security review.
              Users should conduct their own due diligence before depositing into any protocol.
            </p>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Not affiliated with tracked protocols.</strong>{' '}
              Earnbase operates independently. It is not affiliated with, sponsored by, or endorsed
              by any of the protocols, curators, or platforms it tracks.
            </p>
          </div>
        </section>

        <section className="pt-8 border-t border-border">
          <a href="/" className="text-sm text-[#08a671] font-medium hover:underline">
            ← Back to Home
          </a>
        </section>
      </div>
    </>
  );
}
