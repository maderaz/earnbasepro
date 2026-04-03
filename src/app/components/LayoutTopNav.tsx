import React from 'react';
import { Link, NavLink } from 'react-router';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '@/app/utils/useDarkMode';
import { slugify } from '@/app/utils/slugify';
import { useRegistry } from '@/app/contexts/RegistryContext';
import { EarnbaseLogo } from './ui/EarnbaseLogo';

const NAV_TICKERS = ['USDC', 'ETH', 'USDT', 'cbBTC', 'WBTC', 'EURC'] as const;

interface LayoutTopNavProps {
  children: React.ReactNode;
  tickers?: string[];
  tickerCounts?: Record<string, number>;
}

export const LayoutTopNav: React.FC<LayoutTopNavProps> = ({
  children,
  tickers = [],
  tickerCounts = {},
}) => {
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { resolveAssetIcon } = useRegistry();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-background font-sans text-foreground selection:bg-blue-100 dark:selection:bg-blue-900/40 flex flex-col transition-colors duration-300">
      {/* ── Top Navigation Bar ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-card border-b border-border/50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-14 px-5 lg:px-8">
          {/* Left: Logo + asset pills */}
          <div className="flex items-center gap-6 min-w-0">
            <Link to="/" className="shrink-0 self-center flex items-center translate-y-[3.5px]" aria-label="Earnbase -- go to Overview">
              <span className="dark:hidden block"><EarnbaseLogo height={22} variant="light" /></span>
              <span className="hidden dark:block"><EarnbaseLogo height={22} variant="dark" /></span>
            </Link>

            {/* Desktop asset links with icons */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {NAV_TICKERS.map((ticker) => {
                const icon = resolveAssetIcon(ticker);
                return (
                  <NavLink
                    key={ticker}
                    to={`/${slugify(ticker)}`}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                        isActive
                          ? 'bg-[#08a671]/8 text-[#08a671]'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`
                    }
                  >
                    {icon && <img src={icon} alt={ticker} className="w-4 h-4 object-contain" />}
                    <span>{ticker}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right: utilities */}
          <div className="flex items-center gap-1">
            {/* Live indicator — all sizes, with label */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 mr-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-[#08a671] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#08a671]" />
              </span>
              <span className="text-[10px] font-semibold text-[#08a671] uppercase tracking-wider">Live</span>
            </div>

            {/* Dark mode toggle — always visible */}
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

            {/* Dot pattern overlay — matches hero */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '18px 18px',
                maskImage: 'linear-gradient(to right, transparent 10%, black 50%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 10%, black 50%)',
                opacity: 0.10,
              }}
            />

            {/* ── Top: 1x4 Link columns ──── */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 lg:gap-14">
              {/* Assets */}
              <div>
                <h4 className="text-[13px] font-medium text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Assets</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'USDC Yields', slug: 'usdc' },
                    { label: 'ETH Yields', slug: 'eth' },
                    { label: 'USDT Yields', slug: 'usdt' },
                    { label: 'cbBTC Yields', slug: 'cbbtc' },
                    { label: 'WBTC Yields', slug: 'wbtc' },
                    { label: 'EURC Yields', slug: 'eurc' },
                  ].map(a => (
                    <li key={a.slug}>
                      <Link to={`/${a.slug}`} className="text-[13px] text-white/55 hover:text-white transition-colors">
                        {a.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Networks */}
              <div>
                <h4 className="text-[13px] font-medium text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Networks</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Ethereum', path: 'usdc/mainnet' },
                    { label: 'Base', path: 'usdc/base' },
                    { label: 'Arbitrum', path: 'usdc/arbitrum' },
                    { label: 'BNB Chain', path: 'usdc/bnb' },
                    { label: 'Sonic', path: 'usdc/sonic' },
                    { label: 'Avalanche', path: 'usdc/avalanche' },
                  ].map(n => (
                    <li key={n.path}>
                      <Link to={`/${n.path}`} className="text-[13px] text-white/55 hover:text-white transition-colors">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Projects */}
              <div>
                <h4 className="text-[13px] font-medium text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Projects</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Morpho', slug: 'morpho' },
                    { label: 'Euler', slug: 'euler' },
                    { label: 'Aave', slug: 'aave' },
                    { label: 'IPOR Fusion', slug: 'ipor-fusion' },
                    { label: 'Wildcat', slug: 'wildcat' },
                    { label: 'Yearn', slug: 'yearn' },
                  ].map(p => (
                    <li key={p.slug}>
                      <Link to={`/project/${p.slug}`} className="text-[13px] text-white/55 hover:text-white transition-colors">
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curators */}
              <div>
                <h4 className="text-[13px] font-medium text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Curators</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Gauntlet', slug: 'gauntlet' },
                    { label: 'Steakhouse', slug: 'steakhouse' },
                    { label: 'Re7', slug: 're7' },
                    { label: 'Clearstar', slug: 'clearstar' },
                    { label: 'MEV Capital', slug: 'mev-capital' },
                  ].map(c => (
                    <li key={c.slug}>
                      <Link to={`/curator/${c.slug}`} className="text-[13px] text-white/55 hover:text-white transition-colors">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Logo/description (full width) ──── */}
            <div className="relative z-10 mt-10">
              <EarnbaseLogo height={22} variant="dark" />
              <p className="text-[11px] text-white/55 leading-[1.7] mt-6 max-w-[520px]">
                Earnbase brings together yield opportunities from Aave, Morpho, Euler, Maple, Yearn, and dozens more — so you can compare rates across protocols and networks without checking each one separately. Track APY, TVL, sustainability scores, and performance history for 300+ strategies, updated daily.
              </p>
            </div>

            {/* ── Building skyline — dimmed, non-interactive ── */}
            <svg
              className="absolute bottom-0 right-0 hidden lg:block pointer-events-none"
              width="440"
              height="260"
              viewBox="0 0 440 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ opacity: 0.10 }}
            >
              {/* ── Building 1 + Token ── */}
              <g>
                <circle cx="30" cy="173" r="12" stroke="#fff" strokeWidth="1.2" fill="none" />
                <text x="30" y="178" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="serif">Ξ</text>
                <g stroke="#fff" strokeWidth="1.2">
                  <rect x="12" y="190" width="36" height="70" rx="1.5" />
                  <line x1="12" y1="210" x2="48" y2="210" />
                  <line x1="12" y1="230" x2="48" y2="230" />
                  <line x1="12" y1="250" x2="48" y2="250" />
                  <rect x="18" y="195" width="7" height="10" rx="0.5" />
                  <rect x="31" y="195" width="7" height="10" rx="0.5" />
                  <rect x="18" y="215" width="7" height="10" rx="0.5" />
                  <rect x="31" y="215" width="7" height="10" rx="0.5" />
                  <rect x="18" y="235" width="7" height="10" rx="0.5" />
                  <rect x="31" y="235" width="7" height="10" rx="0.5" />
                </g>
              </g>

              {/* ── Building 2 + Token ── */}
              <g>
                <circle cx="84" cy="66" r="13" stroke="#fff" strokeWidth="1.2" fill="none" />
                <text x="84" y="71" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="sans-serif">$</text>
                <g stroke="#fff" strokeWidth="1.2">
                  <rect x="58" y="90" width="52" height="170" rx="1.5" />
                  <line x1="58" y1="120" x2="110" y2="120" />
                  <line x1="58" y1="150" x2="110" y2="150" />
                  <line x1="58" y1="180" x2="110" y2="180" />
                  <line x1="58" y1="210" x2="110" y2="210" />
                  <line x1="58" y1="240" x2="110" y2="240" />
                  <rect x="65" y="96" width="8" height="12" rx="0.5" />
                  <rect x="79" y="96" width="8" height="12" rx="0.5" />
                  <rect x="93" y="96" width="8" height="12" rx="0.5" />
                  <rect x="65" y="126" width="8" height="12" rx="0.5" />
                  <rect x="79" y="126" width="8" height="12" rx="0.5" />
                  <rect x="93" y="126" width="8" height="12" rx="0.5" />
                  <rect x="65" y="156" width="8" height="12" rx="0.5" />
                  <rect x="79" y="156" width="8" height="12" rx="0.5" />
                  <rect x="93" y="156" width="8" height="12" rx="0.5" />
                  <rect x="65" y="186" width="8" height="12" rx="0.5" />
                  <rect x="79" y="186" width="8" height="12" rx="0.5" />
                  <rect x="65" y="216" width="8" height="12" rx="0.5" />
                  <rect x="79" y="216" width="8" height="12" rx="0.5" />
                </g>
              </g>

              {/* ── Building 3 + Token ── */}
              <g>
                <circle cx="142" cy="106" r="12" stroke="#fff" strokeWidth="1.2" fill="none" />
                <text x="142" y="111" textAnchor="middle" fill="#fff" fontSize="11">◇</text>
                <g stroke="#fff" strokeWidth="1.2">
                  <rect x="120" y="130" width="44" height="130" rx="1.5" />
                  <line x1="120" y1="158" x2="164" y2="158" />
                  <line x1="120" y1="186" x2="164" y2="186" />
                  <line x1="120" y1="214" x2="164" y2="214" />
                  <line x1="120" y1="242" x2="164" y2="242" />
                  <rect x="127" y="136" width="7" height="10" rx="0.5" />
                  <rect x="140" y="136" width="7" height="10" rx="0.5" />
                  <rect x="153" y="136" width="7" height="10" rx="0.5" />
                  <rect x="127" y="164" width="7" height="10" rx="0.5" />
                  <rect x="140" y="164" width="7" height="10" rx="0.5" />
                  <rect x="127" y="192" width="7" height="10" rx="0.5" />
                  <rect x="140" y="192" width="7" height="10" rx="0.5" />
                  <rect x="127" y="220" width="7" height="10" rx="0.5" />
                  <rect x="140" y="220" width="7" height="10" rx="0.5" />
                </g>
              </g>

              {/* ── Building 4 + Token ── */}
              <g>
                <circle cx="191" cy="158" r="12" stroke="#fff" strokeWidth="1.2" fill="none" />
                <text x="191" y="163" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="sans-serif">₿</text>
                <g stroke="#fff" strokeWidth="1.2">
                  <rect x="174" y="180" width="34" height="80" rx="1.5" />
                  <line x1="174" y1="204" x2="208" y2="204" />
                  <line x1="174" y1="228" x2="208" y2="228" />
                  <rect x="180" y="186" width="7" height="10" rx="0.5" />
                  <rect x="193" y="186" width="7" height="10" rx="0.5" />
                  <rect x="180" y="210" width="7" height="10" rx="0.5" />
                  <rect x="193" y="210" width="7" height="10" rx="0.5" />
                  <rect x="180" y="234" width="7" height="10" rx="0.5" />
                  <rect x="193" y="234" width="7" height="10" rx="0.5" />
                </g>
              </g>

              {/* ── Building 5 + Token ── */}
              <g>
                <circle cx="242" cy="84" r="13" stroke="#fff" strokeWidth="1.2" fill="none" />
                <text x="242" y="89" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="serif">Ξ</text>
                <g stroke="#fff" strokeWidth="1.2">
                  <rect x="218" y="108" width="48" height="152" rx="1.5" />
                  <line x1="218" y1="136" x2="266" y2="136" />
                  <line x1="218" y1="164" x2="266" y2="164" />
                  <line x1="218" y1="192" x2="266" y2="192" />
                  <line x1="218" y1="220" x2="266" y2="220" />
                  <line x1="218" y1="248" x2="266" y2="248" />
                  <rect x="225" y="114" width="8" height="12" rx="0.5" />
                  <rect x="239" y="114" width="8" height="12" rx="0.5" />
                  <rect x="253" y="114" width="8" height="12" rx="0.5" />
                  <rect x="225" y="142" width="8" height="12" rx="0.5" />
                  <rect x="239" y="142" width="8" height="12" rx="0.5" />
                  <rect x="225" y="170" width="8" height="12" rx="0.5" />
                  <rect x="239" y="170" width="8" height="12" rx="0.5" />
                  <rect x="225" y="198" width="8" height="12" rx="0.5" />
                  <rect x="239" y="198" width="8" height="12" rx="0.5" />
                  <rect x="225" y="226" width="8" height="12" rx="0.5" />
                </g>
              </g>

              {/* ── Building 6 + Token ── */}
              <g>
                <circle cx="295" cy="136" r="12" stroke="#fff" strokeWidth="1.2" fill="none" />
                <text x="295" y="141" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="sans-serif">$</text>
                <g stroke="#fff" strokeWidth="1.2">
                  <rect x="276" y="160" width="38" height="100" rx="1.5" />
                  <line x1="276" y1="186" x2="314" y2="186" />
                  <line x1="276" y1="212" x2="314" y2="212" />
                  <line x1="276" y1="238" x2="314" y2="238" />
                  <rect x="282" y="166" width="7" height="10" rx="0.5" />
                  <rect x="295" y="166" width="7" height="10" rx="0.5" />
                  <rect x="282" y="192" width="7" height="10" rx="0.5" />
                  <rect x="295" y="192" width="7" height="10" rx="0.5" />
                  <rect x="282" y="218" width="7" height="10" rx="0.5" />
                </g>
              </g>

              {/* ── Building 7 + Token ── */}
              <g>
                <circle cx="339" cy="183" r="11" stroke="#fff" strokeWidth="1.2" fill="none" />
                <text x="339" y="188" textAnchor="middle" fill="#fff" fontSize="10">◇</text>
                <g stroke="#fff" strokeWidth="1.2">
                  <rect x="324" y="210" width="30" height="50" rx="1.5" />
                  <line x1="324" y1="232" x2="354" y2="232" />
                  <rect x="330" y="216" width="6" height="10" rx="0.5" />
                  <rect x="342" y="216" width="6" height="10" rx="0.5" />
                  <rect x="330" y="238" width="6" height="10" rx="0.5" />
                  <rect x="342" y="238" width="6" height="10" rx="0.5" />
                </g>
              </g>

              {/* ── Building 8 + Token ── */}
              <g>
                <circle cx="376" cy="203" r="10" stroke="#fff" strokeWidth="1.2" fill="none" />
                <text x="376" y="208" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="serif">Ξ</text>
                <g stroke="#fff" strokeWidth="1.2">
                  <rect x="364" y="228" width="24" height="32" rx="1.5" />
                  <rect x="370" y="234" width="5" height="8" rx="0.5" />
                  <rect x="381" y="234" width="5" height="8" rx="0.5" />
                </g>
              </g>
            </svg>

            {/* ── Separator line ───────────────────────── */}
            <div className="relative z-10 mt-12 lg:mt-16 border-t border-white/15" />

            {/* ── Bottom bar: X left, links + copyright right ── */}
            <div className="relative z-10 mt-5 flex items-center justify-between">
              {/* X / Twitter icon — max left */}
              <a
                href="https://x.com/EarnbaseFinance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/45 hover:text-white transition-colors"
                aria-label="Earnbase on X"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Copyright + utility links — right */}
              <div className="flex items-center gap-3 text-[11px] text-white/45">
                <Link to="/studio" className="hover:text-white transition-colors">
                  Studio for Teams
                </Link>
                <span className="text-white/20">&middot;</span>
                <a href="https://files.earnbase.finance/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Sitemap
                </a>
                <span className="text-white/20">&middot;</span>
                <a href="https://files.earnbase.finance/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  LLMs.txt
                </a>
                <span className="text-white/20">&middot;</span>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
                <span className="text-white/20">&middot;</span>
                <span>&copy; Earnbase 2026</span>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};