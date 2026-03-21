/**
 * HeroSection — Minimal hero inspired by Polymarket's crisp UI.
 * Inter font, tight tracking, 3D-depth CTA, clean bordered cards.
 */
import React from 'react';
import { useNavigate } from 'react-router';
import type { DeFiProduct } from '@/app/utils/types';
import { HeroIllustration } from './HeroIllustration';

import logoEuler from 'figma:asset/347e59f899e9dc45af6f2abaae6ce391c90035bb.png';
import logoWildcat from 'figma:asset/92b77df2512568e000513933976237403c64c8d9.png';
import logoAave from 'figma:asset/f2fc5301bfcaff717b0aee084068e1db50944de6.png';
import logoFusion from 'figma:asset/3fb6cda5ae4fb7036c5b6c399e1aa50c681f008f.png';
import logoYearn from 'figma:asset/fd2ee3d0d35ab7aa99b9b326fb8b71893be253b1.png';
import logoLagoon from 'figma:asset/fdda2f3e504425c4a90eb281becab8a4c8984255.png';

const FONT = "'Plus Jakarta Sans', sans-serif";

interface Props {
  products: DeFiProduct[];
  totalNetworks?: number; // kept for backward compat, unused
}

export const HeroSection: React.FC<Props> = ({ products }) => {
  const navigate = useNavigate();

  return (
    <section
      className="rounded-3xl overflow-hidden relative"
      style={{ background: '#08a671' }}
    >
      {/* Dot pattern overlay — fades in from right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage: 'linear-gradient(to right, transparent 15%, black 60%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 15%, black 60%)',
          opacity: 0.12,
        }}
      />

      {/* ── Centered copy ─────────────────────────────── */}
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
            onClick={() => navigate('/usdc')}
            className="group relative inline-flex items-center justify-center font-semibold text-[15px] text-white px-7 py-3.5 rounded-xl cursor-pointer"
            style={{
              fontFamily: FONT,
              background: '#1a1d23',
              letterSpacing: '-0.01em',
            }}
          >
            {/* 3D depth shadow layer */}
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

      {/* ── Wireframe illustration ── */}
      <div className="relative w-full overflow-hidden" style={{ marginTop: '-10px' }}>
        <HeroIllustration className="w-full h-auto max-h-[160px] sm:max-h-[260px] lg:max-h-[320px]" />
      </div>

      {/* ── Protocol logos bar ────────────────────────── */}
      {(() => {
        const logos = [
          { src: logoEuler, alt: 'Euler', h: 20 },
          // Wildcat temporarily hidden
          { src: logoAave, alt: 'Aave', h: 16 },
          { src: logoFusion, alt: 'Fusion', h: 23 },
          { src: logoYearn, alt: 'Yearn', h: 20 },
          { src: logoLagoon, alt: 'Lagoon', h: 20, hDesktop: 17 },
        ];
        return (
          <div className="relative border-t border-white/10 py-5 overflow-hidden">
            {/* Desktop — static centered */}
            <div className="hidden sm:flex items-center justify-center gap-14 lg:gap-16 opacity-50 px-14 lg:px-20">
              {logos.map(logo => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  style={{ height: logo.hDesktop ?? logo.h, width: 'auto' }}
                  className="object-contain"
                />
              ))}
            </div>

            {/* Mobile — marquee scrolling left-to-right, 30% smaller */}
            <div className="sm:hidden opacity-50">
              <div
                className="flex items-center gap-10 w-max animate-[marquee_20s_linear_infinite]"
              >
                {[...logos, ...logos].map((logo, i) => (
                  <img
                    key={`${logo.alt}-${i}`}
                    src={logo.src}
                    alt={logo.alt}
                    style={{ height: Math.round(logo.h * 0.7), width: 'auto' }}
                    className="object-contain"
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};