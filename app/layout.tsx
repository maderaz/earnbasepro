import type { Metadata } from 'next';
import { Layout } from './components/Layout';
import { PageViewTracker } from './components/PageViewTracker';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://earnbase.finance'),
  title: {
    default: 'Compare DeFi Yields Across Protocols | Earnbase',
    template: '%s',
  },
  description: 'Track and compare 300+ DeFi yield strategies across USDC, ETH, USDT, and more. On-chain APY data from Morpho, Euler, Aave, and 25+ protocols — updated daily.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Earnbase',
    images: [{ url: '/FEATURED%20IMG.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@EarnbaseFinance',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  other: {
    'content-language': 'en',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3f7359" />
        <link rel="llms-txt" href="/llms.txt" />
        <link rel="llms-full-txt" href="/llms-full.txt" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="K7Y/vLlOIVE0pT/X/C8ADA" async />
      </head>
      <body className="bg-background text-foreground antialiased">
        <PageViewTracker />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
