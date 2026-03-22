'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';

const GREEN = '#08a671';
const GREEN_DARK = '#06895d';
const GREEN_LIGHT = '#2ec48f';

const NAV_TICKERS = ['USDC', 'ETH', 'USDT', 'cbBTC', 'WBTC', 'EURC'] as const;

function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    } catch {}
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch {}
    }
  };

  return { isDark, toggle };
}

function EarnbaseLogo({ height = 24, variant = 'light' }: { height?: number; variant?: 'light' | 'dark' }) {
  const textColor = variant === 'light' ? '#0e0f11' : '#f0f0f0';
  return (
    <span className="inline-flex items-center gap-[0.45em]" style={{ lineHeight: 1 }} aria-label="Earnbase">
      <svg width={height} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 block">
        <ellipse cx="16" cy="24" rx="10.5" ry="4.5" fill={GREEN_DARK} />
        <rect x="5.5" y="8" width="21" height="16" rx="0" fill={GREEN} />
        <rect x="5.5" y="8" width="21" height="16" fill="url(#cylGrad)" />
        <ellipse cx="16" cy="8" rx="10.5" ry="4.5" fill={GREEN_LIGHT} />
        <ellipse cx="16" cy="8" rx="7.5" ry="3" fill={GREEN} opacity="0.35" />
        <ellipse cx="16" cy="14.5" rx="10.5" ry="3.2" fill="none" stroke={GREEN_DARK} strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="16" cy="20" rx="10.5" ry="3.5" fill="none" stroke={GREEN_DARK} strokeWidth="0.5" opacity="0.2" />
        <ellipse cx="16" cy="24" rx="10.5" ry="4.5" fill="none" stroke={GREEN_DARK} strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="13" cy="7.2" rx="5" ry="1.5" fill="white" opacity="0.18" />
        <defs>
          <linearGradient id="cylGrad" x1="5.5" y1="8" x2="26.5" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.08" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.12" />
          </linearGradient>
        </defs>
      </svg>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: height * 0.72, letterSpacing: '-0.04em', color: textColor, lineHeight: 1, display: 'block' }}>
        earnbase
      </span>
    </span>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-background font-sans text-foreground selection:bg-blue-100 dark:selection:bg-blue-900/40 flex flex-col transition-colors duration-300">
      {/* ── Top Navigation Bar ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-card border-b border-border/50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-14 px-5 lg:px-8">
          {/* Left: Logo + asset pills */}
          <div className="flex items-center gap-6 min-w-0">
            <Link href="/" className="shrink-0 self-center flex items-center translate-y-[3.5px]" aria-label="Earnbase — go to Overview">
              <span className="dark:hidden block"><EarnbaseLogo height={22} variant="light" /></span>
              <span className="hidden dark:block"><EarnbaseLogo height={22} variant="dark" /></span>
            </Link>

            {/* Desktop asset links */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_TICKERS.map((ticker) => {
                const slug = ticker.toLowerCase();
                const isActive = pathname === `/${slug}` || pathname.startsWith(`/${slug}/`);
                return (
                  <Link
                    key={ticker}
                    href={`/${slug}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#08a671]/8 text-[#08a671]'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span>{ticker}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: utilities */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 mr-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-[#08a671] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#08a671]" />
              </span>
              <span className="text-[10px] font-semibold text-[#08a671] uppercase tracking-wider">Live</span>
            </div>

            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-[14px] h-[14px]" /> : <Moon className="w-[14px] h-[14px]" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1 w-full">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-8 lg:py-10">
          {children}
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="w-full">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 pb-6 pt-2">
          <div className="relative rounded-2xl px-8 sm:px-10 lg:px-12 pt-10 lg:pt-12 pb-8 lg:pb-10 overflow-hidden" style={{ background: '#08a671' }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '18px 18px',
              maskImage: 'linear-gradient(to right, transparent 10%, black 50%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 10%, black 50%)',
              opacity: 0.10,
            }} />

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">
              <div>
                <h4 className="text-[13px] font-medium text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Assets</h4>
                <ul className="space-y-2.5">
                  {[{ label: 'USDC Yields', slug: 'usdc' }, { label: 'ETH Yields', slug: 'eth' }, { label: 'USDT Yields', slug: 'usdt' }, { label: 'cbBTC Yields', slug: 'cbbtc' }, { label: 'WBTC Yields', slug: 'wbtc' }, { label: 'EURC Yields', slug: 'eurc' }].map(a => (
                    <li key={a.slug}><Link href={`/${a.slug}`} className="text-[13px] text-white/55 hover:text-white transition-colors">{a.label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[13px] font-medium text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Networks</h4>
                <ul className="space-y-2.5">
                  {[{ label: 'Ethereum', path: 'usdc/mainnet' }, { label: 'Base', path: 'usdc/base' }, { label: 'Arbitrum', path: 'usdc/arbitrum' }, { label: 'BNB Chain', path: 'usdc/bnb' }, { label: 'Sonic', path: 'usdc/sonic' }, { label: 'Avalanche', path: 'usdc/avalanche' }].map(n => (
                    <li key={n.path}><Link href={`/${n.path}`} className="text-[13px] text-white/55 hover:text-white transition-colors">{n.label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[13px] font-medium text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Projects</h4>
                <ul className="space-y-2.5">
                  {[{ label: 'Morpho', slug: 'morpho' }, { label: 'Euler', slug: 'euler' }, { label: 'Aave', slug: 'aave' }, { label: 'IPOR Fusion', slug: 'ipor-fusion' }, { label: 'Wildcat', slug: 'wildcat' }, { label: 'Yearn', slug: 'yearn' }].map(p => (
                    <li key={p.slug}><Link href={`/project/${p.slug}`} className="text-[13px] text-white/55 hover:text-white transition-colors">{p.label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[13px] font-medium text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Curators</h4>
                <ul className="space-y-2.5">
                  {[{ label: 'Gauntlet', slug: 'gauntlet' }, { label: 'Steakhouse', slug: 'steakhouse' }, { label: 'Re7', slug: 're7' }, { label: 'Clearstar', slug: 'clearstar' }, { label: 'MEV Capital', slug: 'mev-capital' }, { label: 'Apostro', slug: 'apostro' }].map(c => (
                    <li key={c.slug}><Link href={`/curator/${c.slug}`} className="text-[13px] text-white/55 hover:text-white transition-colors">{c.label}</Link></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <EarnbaseLogo height={22} variant="dark" />
              <p className="text-[11px] text-white/55 leading-[1.7] mt-6 max-w-[520px]">
                Earnbase brings together yield opportunities from Aave, Morpho, Euler, Maple, Yearn, and dozens more — so you can compare rates across protocols and networks without checking each one separately. Track APY, TVL, sustainability scores, and performance history for 300+ strategies, updated daily.
              </p>
            </div>

            <div className="relative z-10 mt-12 lg:mt-16 border-t border-white/15" />

            <div className="relative z-10 mt-5 flex items-center justify-between">
              <a href="https://x.com/EarnbaseFinance" target="_blank" rel="noopener noreferrer" className="text-white/45 hover:text-white transition-colors" aria-label="Earnbase on X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <div className="flex items-center gap-3 text-[11px] text-white/45">
                <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
                <span className="text-white/20">&middot;</span>
                <a href="/llms.txt" className="hover:text-white transition-colors">LLMs.txt</a>
                <span className="text-white/20">&middot;</span>
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
                <span className="text-white/20">&middot;</span>
                <span>&copy; Earnbase 2026</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
