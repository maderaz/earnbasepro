import type { Metadata } from 'next';
import { fetchPools } from '@/lib/api';
import { curatorPageSEO, BASE_URL, getProductSlug, formatTVLCompact } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface Props { params: Promise<{ curatorSlug: string }> }

function slugToName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function nameToSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { curatorSlug } = await params;
  const { products } = await fetchPools();
  const curatorName = slugToName(curatorSlug);
  const filtered = products.filter(p =>
    p.curator && nameToSlug(p.curator.trim()) === curatorSlug
  );

  if (filtered.length < 4) {
    return { title: `${curatorName} | Earnbase` };
  }

  const tickers = [...new Set(filtered.map(p => p.ticker.toUpperCase()))].sort();
  const sorted = [...filtered].sort((a, b) => b.spotAPY - a.spotAPY);
  const seo = curatorPageSEO(curatorName, curatorSlug, filtered.length, tickers, sorted);
  const pageUrl = `${BASE_URL}/curator/${curatorSlug}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: pageUrl },
    openGraph: { title: seo.title, description: seo.description, url: pageUrl },
    twitter: { title: seo.title, description: seo.description },
  };
}

export default async function CuratorPage({ params }: Props) {
  const { curatorSlug } = await params;
  const { products } = await fetchPools();
  const curatorName = slugToName(curatorSlug);
  const filtered = products.filter(p =>
    p.curator && nameToSlug(p.curator.trim()) === curatorSlug
  );

  if (filtered.length < 4) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-32 text-center">
        <h1 className="text-xl font-medium">Curator Not Found</h1>
        <p className="text-muted-foreground mt-2">This curator page doesn't exist on Earnbase.</p>
        <a href="/" className="inline-block mt-4 px-5 py-2.5 bg-[#08a671] text-white rounded-xl text-sm font-semibold">Back to Home</a>
      </main>
    );
  }

  const tickers = [...new Set(filtered.map(p => p.ticker.toUpperCase()))].sort();
  const sorted = [...filtered].sort((a, b) => b.spotAPY - a.spotAPY);
  const networks = [...new Set(filtered.map(p => p.network))];
  const platforms = [...new Set(filtered.map(p => p.platform_name))];
  const seo = curatorPageSEO(curatorName, curatorSlug, filtered.length, tickers, sorted);

  const topProduct = sorted[0];
  const faqItems = [
    { question: `What is the highest APY curated by ${curatorName}?`, answer: `The highest-yielding strategy curated by ${curatorName} is ${topProduct.product_name} with ${topProduct.spotAPY.toFixed(2)}% APY on ${topProduct.ticker.toUpperCase()} (${topProduct.network}).` },
    { question: `How many strategies does ${curatorName} curate on Earnbase?`, answer: `${curatorName} curates ${filtered.length} yield strategies across ${tickers.join(', ')}.` },
    { question: `What assets does ${curatorName} support?`, answer: `${curatorName} curates strategies for ${tickers.join(', ')} across ${networks.join(', ')}.` },
    { question: `Which platforms does ${curatorName} operate on?`, answer: `${curatorName} operates on ${platforms.join(', ')}.` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.structuredData) }} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <nav className="text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <span className="mx-1">/</span>
          <span className="text-foreground">{curatorName}</span>
        </nav>

        <section>
          <h1 className="text-2xl font-semibold text-foreground">
            Strategies Curated by {curatorName}
          </h1>
          <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed max-w-2xl">
            Compare {filtered.length} yield strategies curated by {curatorName} across {tickers.join(', ')}.
            Live APY, TVL, and performance data — updated daily.
          </p>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground">Strategies</p>
            <p className="text-lg font-bold">{filtered.length}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground">Assets</p>
            <p className="text-lg font-bold">{tickers.length}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground">Networks</p>
            <p className="text-lg font-bold">{networks.length}</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground">Top APY</p>
            <p className="text-lg font-bold text-[#08a671]">{topProduct.spotAPY.toFixed(2)}%</p>
          </div>
        </div>

        {/* Table */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">All {curatorName} Strategies</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Strategy</th>
                  <th className="py-3 pr-4 font-medium">Asset</th>
                  <th className="py-3 pr-4 font-medium">Network</th>
                  <th className="py-3 pr-4 font-medium">Platform</th>
                  <th className="py-3 pr-4 font-medium text-right">APY</th>
                  <th className="py-3 font-medium text-right">TVL</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => (
                  <tr key={p.id || i} className="border-b border-border/50">
                    <td className="py-3 pr-4">
                      <a href={`/vault/${getProductSlug(p)}`} className="text-foreground font-medium hover:text-[#08a671]">
                        {p.product_name}
                      </a>
                    </td>
                    <td className="py-3 pr-4">
                      <a href={`/${p.ticker.toLowerCase()}`} className="text-[#08a671] font-medium">{p.ticker.toUpperCase()}</a>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{p.network}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{p.platform_name}</td>
                    <td className="py-3 pr-4 text-right font-medium">{p.spotAPY.toFixed(2)}%</td>
                    <td className="py-3 text-right text-muted-foreground">{formatTVLCompact(p.tvl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-card">
                <h3 className="text-sm font-semibold text-foreground">{faq.question}</h3>
                <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
