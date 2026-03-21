'use client';

/**
 * HeroSection — Full green hero banner with headline, CTA, illustration, and protocol logos.
 * Ported from src/app/components/HeroSection.tsx — figma:asset/ imports replaced with text labels.
 */
import React from 'react';
import { useRouter } from 'next/navigation';
import { HeroIllustration } from './HeroIllustration';
import type { DeFiProduct } from '@/lib/api';

const FONT = "'Plus Jakarta Sans', sans-serif";

const PROTOCOL_LOGOS = ['Euler', 'Aave', 'Fusion', 'Yearn', 'Lagoon'] as const;

interface Props {
  products: DeFiProduct[];
}

export const HeroSection: React.FC<Props> = ({ products }) => {
  const router = useRouter();

  return (
    <section className="rounded-3xl overflow-hidden relative" style={{ background: '#08a671' }}>
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        maskImage: 'linear-gradient(to right, transparent 15%, black 60%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 15%, black 60%)',
        opacity: 0.12,
      }} />

      {/* Copy */}
      <div className="relative flex flex-col items-center text-center px-8 sm:px-14 lg:px-20 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-0">
        <h1
          className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-white leading-[1.08] tracking-[-0.04em]"
          style={{ fontFamily: FONT }}
        >
          <span className="sm:hidden uppercase">Find the Best<br />Yield to Earn</span>
          <span className="hidden sm:inline uppercase">Find the Best Yield to Earn</span>
        </h1>

        <p
          className="mt-5 sm:mt-6 text-[15px] sm:text-[17px] text-white/65 leading-[1.6] max-w-[440px] font-medium tracking-[-0.01em]"
          style={{ fontFamily: FONT }}
        >
          Compare {products.length || '300+'} yield strategies across USDC, ETH, USDT, and more. Updated every day.
        </p>

        <div className="mt-9 sm:mt-10">
          <button
            onClick={() => router.push('/usdc')}
            className="group relative inline-flex items-center justify-center font-semibold text-[15px] text-white px-7 py-3.5 rounded-xl cursor-pointer"
            style={{ fontFamily: FONT, background: '#1a1d23', letterSpacing: '-0.01em' }}
          >
            <span
              className="absolute inset-0 rounded-xl pointer-events-none transition-shadow duration-150 group-hover:shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.35)] group-active:shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.35)]"
              style={{ boxShadow: 'inset 0 -3px 0 0 rgba(0,0,0,0.35)' }}
            />
            <span className="relative z-10 transition-transform duration-150 group-hover:translate-y-[1px] group-active:translate-y-[2px]">
              Explore Products
            </span>
          </button>
        </div>
      </div>

      {/* Illustration */}
      <div className="relative w-full overflow-hidden" style={{ marginTop: '-10px' }}>
        <HeroIllustration className="w-full h-auto max-h-[160px] sm:max-h-[260px] lg:max-h-[320px]" />
      </div>

      {/* Protocol logos bar — text labels (figma assets not available in Next.js) */}
      <div className="relative border-t border-white/10 py-5">
        <div className="hidden sm:flex items-center justify-center gap-10 lg:gap-14 opacity-50 px-14 lg:px-20">
          {PROTOCOL_LOGOS.map(name => (
            <span key={name} style={{ fontFamily: FONT, fontWeight: 600, fontSize: 13, color: '#fff', letterSpacing: '-0.01em' }}>
              {name}
            </span>
          ))}
        </div>
        {/* Mobile: scrolling row */}
        <div className="sm:hidden opacity-50 overflow-hidden">
          <div className="flex items-center gap-10 w-max animate-[marquee_20s_linear_infinite]">
            {[...PROTOCOL_LOGOS, ...PROTOCOL_LOGOS].map((name, i) => (
              <span key={`${name}-${i}`} style={{ fontFamily: FONT, fontWeight: 600, fontSize: 12, color: '#fff' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
