/**
 * BrandAssetsPage — /brand-assets
 * Press-kit page with downloadable logo variants, icon, color palette, and usage guidelines.
 */
import React, { useRef, useCallback } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { EarnbaseLogo } from './ui/EarnbaseLogo';
import { SEO } from './SEO';

/* ── Brand colors ────────────────────────────────── */
const COLORS = [
  { name: 'Earnbase Green', hex: '#08a671', use: 'Primary brand color' },
  { name: 'Green Light', hex: '#2ec48f', use: 'Highlights, top surfaces' },
  { name: 'Green Dark', hex: '#06895d', use: 'Shadows, depth' },
  { name: 'Ink', hex: '#0e0f11', use: 'Wordmark, headings (light mode)' },
  { name: 'Snow', hex: '#f0f0f0', use: 'Wordmark (dark mode)' },
  { name: 'Surface', hex: '#fafafa', use: 'Page background' },
];

/* ── SVG source strings ──────────────────────────── */
const ICON_SVG = (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="cg" x1="88" y1="128" x2="424" y2="384" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="white" stop-opacity="0.08"/>
      <stop offset="50%" stop-color="white" stop-opacity="0"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.12"/>
    </linearGradient>
  </defs>
  <ellipse cx="256" cy="384" rx="168" ry="72" fill="#06895d"/>
  <rect x="88" y="128" width="336" height="256" fill="#08a671"/>
  <rect x="88" y="128" width="336" height="256" fill="url(#cg)"/>
  <ellipse cx="256" cy="128" rx="168" ry="72" fill="#2ec48f"/>
  <ellipse cx="256" cy="128" rx="120" ry="48" fill="#08a671" opacity="0.35"/>
  <ellipse cx="256" cy="232" rx="168" ry="51" fill="none" stroke="#06895d" stroke-width="3" opacity="0.25"/>
  <ellipse cx="256" cy="320" rx="168" ry="56" fill="none" stroke="#06895d" stroke-width="3" opacity="0.18"/>
  <ellipse cx="256" cy="384" rx="168" ry="72" fill="none" stroke="#06895d" stroke-width="3" opacity="0.25"/>
  <ellipse cx="208" cy="115" rx="80" ry="24" fill="white" opacity="0.16"/>
</svg>`;

/* ── Concept B: Flat Token — solid base, no inner ring, no gloss ── */
const FLAT_ICON_SVG = (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512" fill="none">
  <ellipse cx="256" cy="384" rx="168" ry="72" fill="#08a671"/>
  <rect x="88" y="128" width="336" height="256" fill="#08a671"/>
  <ellipse cx="256" cy="232" rx="168" ry="51" fill="none" stroke="#06895d" stroke-width="2.5" opacity="0.2"/>
  <ellipse cx="256" cy="320" rx="168" ry="56" fill="none" stroke="#06895d" stroke-width="2.5" opacity="0.15"/>
  <ellipse cx="256" cy="384" rx="168" ry="72" fill="none" stroke="#06895d" stroke-width="2.5" opacity="0.2"/>
  <ellipse cx="256" cy="128" rx="168" ry="72" fill="#2ec48f"/>
</svg>`;

/* ── Concept C: Stacked Tokens — same silhouette, color-graded sections ── */
const STACKED_ICON_SVG = (size: number) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512" fill="none">
  <!-- Bottom section (darkest) -->
  <ellipse cx="256" cy="384" rx="168" ry="72" fill="#044d35"/>
  <rect x="88" y="320" width="336" height="64" fill="#055a3f"/>
  <ellipse cx="256" cy="320" rx="168" ry="56" fill="#06895d"/>
  <!-- Middle section -->
  <rect x="88" y="232" width="336" height="88" fill="#079565"/>
  <ellipse cx="256" cy="232" rx="168" ry="51" fill="#08a671"/>
  <!-- Top section (lightest) -->
  <rect x="88" y="128" width="336" height="104" fill="#0fb87f"/>
  <ellipse cx="256" cy="128" rx="168" ry="72" fill="#2ec48f"/>
</svg>`;

const LOGO_SVG = (variant: 'light' | 'dark') => {
  const textFill = variant === 'light' ? '#0e0f11' : '#f0f0f0';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="160" viewBox="0 0 720 160" fill="none">
  <defs>
    <linearGradient id="cg" x1="22" y1="32" x2="106" y2="96" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="white" stop-opacity="0.08"/>
      <stop offset="50%" stop-color="white" stop-opacity="0"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.12"/>
    </linearGradient>
  </defs>
  <!-- Icon -->
  <g transform="translate(16,0)">
    <ellipse cx="64" cy="120" rx="42" ry="18" fill="#06895d"/>
    <rect x="22" y="40" width="84" height="80" fill="#08a671"/>
    <rect x="22" y="40" width="84" height="80" fill="url(#cg)"/>
    <ellipse cx="64" cy="40" rx="42" ry="18" fill="#2ec48f"/>
    <ellipse cx="64" cy="40" rx="30" ry="12" fill="#08a671" opacity="0.35"/>
    <ellipse cx="64" cy="66" rx="42" ry="13" fill="none" stroke="#06895d" stroke-width="1.5" opacity="0.25"/>
    <ellipse cx="64" cy="88" rx="42" ry="14" fill="none" stroke="#06895d" stroke-width="1.5" opacity="0.18"/>
    <ellipse cx="64" cy="120" rx="42" ry="18" fill="none" stroke="#06895d" stroke-width="1.5" opacity="0.25"/>
    <ellipse cx="52" cy="37" rx="20" ry="6" fill="white" opacity="0.16"/>
  </g>
  <!-- Wordmark -->
  <text x="160" y="105" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700" font-size="72" letter-spacing="-3" fill="${textFill}">earnbase</text>
</svg>`;
};

/* ── Download helpers ────────────────────────────── */
function downloadSvg(svgStr: string, filename: string) {
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPng(svgStr: string, filename: string, pxSize: number) {
  const img = new Image();
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  img.onload = () => {
    const canvas = document.createElement('canvas');
    // Parse aspect ratio from viewBox
    const vbMatch = svgStr.match(/viewBox="0 0 (\d+) (\d+)"/);
    const vbW = vbMatch ? parseInt(vbMatch[1]) : pxSize;
    const vbH = vbMatch ? parseInt(vbMatch[2]) : pxSize;
    const ratio = vbW / vbH;
    canvas.width = pxSize;
    canvas.height = Math.round(pxSize / ratio);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((b) => {
      if (!b) return;
      const pngUrl = URL.createObjectURL(b);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

/* ── Copy hex helper ─────────────────────────────── */
function CopyHex({ hex }: { hex: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1 text-[12px] text-[#77808d] hover:text-[#08a671] transition-colors cursor-pointer font-mono"
      title="Copy hex"
    >
      {hex}
      {copied ? <Check className="w-3 h-3 text-[#08a671]" /> : <Copy className="w-3 h-3 opacity-40" />}
    </button>
  );
}

/* ── Main component ──────────────────────────────── */
export const BrandAssetsPage: React.FC = () => {
  const FONT = "'Plus Jakarta Sans', sans-serif";
  const FONT_HEAD = "'Space Grotesk', sans-serif";

  return (
    <div className="max-w-[1000px] mx-auto px-6 lg:px-8 py-16 space-y-20" style={{ fontFamily: FONT }}>
      <SEO
        title="Brand Assets | Earnbase"
        description="Download Earnbase logo, icon, and color palette in SVG and PNG formats."
        noindex
      />

      {/* ── Header ─────────────────────────────────── */}
      <header className="space-y-4">
        <h1
          className="text-[32px] sm:text-[40px] font-bold text-[#0e0f11] dark:text-white tracking-[-0.03em] leading-tight"
          style={{ fontFamily: FONT_HEAD }}
        >
          Brand Assets
        </h1>
        <p className="text-[15px] text-[#77808d] leading-relaxed max-w-[560px]">
          Official Earnbase logos, icon mark, and brand colors. All assets are vector-first and available for download in SVG and high-res PNG.
        </p>
      </header>

      {/* ── 1. Full Logo ───────────────────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-[20px] font-semibold text-[#0e0f11] dark:text-white tracking-[-0.02em]" style={{ fontFamily: FONT_HEAD }}>
            Logo
          </h2>
          <p className="text-[13px] text-[#99a0aa]">Icon + wordmark lockup. Do not separate or rearrange.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Light variant */}
          <AssetCard
            label="Light background"
            bg="bg-white border border-[#e6e8ea]"
            preview={<EarnbaseLogo height={36} variant="light" />}
            onSvg={() => downloadSvg(LOGO_SVG('light'), 'earnbase-logo-light.svg')}
            onPng={() => downloadPng(LOGO_SVG('light'), 'earnbase-logo-light.png', 2160)}
          />
          {/* Dark variant */}
          <AssetCard
            label="Dark background"
            bg="bg-[#0e0f11]"
            preview={<EarnbaseLogo height={36} variant="dark" />}
            onSvg={() => downloadSvg(LOGO_SVG('dark'), 'earnbase-logo-dark.svg')}
            onPng={() => downloadPng(LOGO_SVG('dark'), 'earnbase-logo-dark.png', 2160)}
          />
        </div>
      </section>

      {/* ── 2. Icon Mark ───────────────────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-[20px] font-semibold text-[#0e0f11] dark:text-white tracking-[-0.02em]" style={{ fontFamily: FONT_HEAD }}>
            Icon Mark
          </h2>
          <p className="text-[13px] text-[#99a0aa]">Standalone cylinder icon. Use as favicon, app icon, or avatar.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Standard */}
          <AssetCard
            label="On white"
            bg="bg-white border border-[#e6e8ea]"
            preview={<IconPreview size={64} />}
            onSvg={() => downloadSvg(ICON_SVG(512), 'earnbase-icon.svg')}
            onPng={() => downloadPng(ICON_SVG(512), 'earnbase-icon-512.png', 512)}
          />
          {/* On dark */}
          <AssetCard
            label="On dark"
            bg="bg-[#0e0f11]"
            preview={<IconPreview size={64} />}
            onSvg={() => downloadSvg(ICON_SVG(512), 'earnbase-icon.svg')}
            onPng={() => downloadPng(ICON_SVG(512), 'earnbase-icon-512.png', 512)}
          />
          {/* On green */}
          <AssetCard
            label="On brand green"
            bg="bg-[#08a671]"
            preview={<IconPreview size={64} />}
            onSvg={() => downloadSvg(ICON_SVG(512), 'earnbase-icon.svg')}
            onPng={() => downloadPng(ICON_SVG(1024), 'earnbase-icon-1024.png', 1024)}
          />
        </div>

        {/* Size grid */}
        <div className="flex items-end gap-6 pt-4">
          {[16, 24, 32, 48, 64, 96].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <IconPreview size={s} />
              <span className="text-[11px] text-[#aeb4bc] font-mono">{s}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2b. Concept: Flat Token ────────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[20px] font-semibold text-[#0e0f11] dark:text-white tracking-[-0.02em]" style={{ fontFamily: FONT_HEAD }}>
              Concept: Flat Token
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-[#f0faf6] text-[10px] font-bold text-[#08a671] uppercase tracking-[0.08em]">Draft</span>
          </div>
          <p className="text-[13px] text-[#99a0aa]">
            Simplified variant — solid single-color base, clean top lid, no inner ring or gloss. Reads as a stacked token / coin at small sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <AssetCard
            label="On white"
            bg="bg-white border border-[#e6e8ea]"
            preview={<FlatIconPreview size={72} />}
            onSvg={() => downloadSvg(FLAT_ICON_SVG(512), 'earnbase-icon-flat.svg')}
            onPng={() => downloadPng(FLAT_ICON_SVG(512), 'earnbase-icon-flat-512.png', 512)}
          />
          <AssetCard
            label="On dark"
            bg="bg-[#0e0f11]"
            preview={<FlatIconPreview size={72} />}
            onSvg={() => downloadSvg(FLAT_ICON_SVG(512), 'earnbase-icon-flat.svg')}
            onPng={() => downloadPng(FLAT_ICON_SVG(512), 'earnbase-icon-flat-512.png', 512)}
          />
          <AssetCard
            label="On brand green"
            bg="bg-[#08a671]"
            preview={<FlatIconPreview size={72} />}
            onSvg={() => downloadSvg(FLAT_ICON_SVG(512), 'earnbase-icon-flat.svg')}
            onPng={() => downloadPng(FLAT_ICON_SVG(1024), 'earnbase-icon-flat-1024.png', 1024)}
          />
        </div>

        {/* Side-by-side comparison */}
        <div className="rounded-2xl border border-[#e6e8ea] bg-white p-8">
          <p className="text-[11px] text-[#aeb4bc] font-semibold uppercase tracking-[0.06em] mb-6">Side-by-side comparison</p>
          <div className="flex items-center justify-center gap-16">
            <div className="flex flex-col items-center gap-3">
              <IconPreview size={80} />
              <span className="text-[12px] text-[#77808d] font-medium">Current (3D)</span>
            </div>
            <div className="w-px h-20 bg-[#e6e8ea]" />
            <div className="flex flex-col items-center gap-3">
              <FlatIconPreview size={80} />
              <span className="text-[12px] text-[#77808d] font-medium">Flat Token</span>
            </div>
          </div>
        </div>

        {/* Size grid for flat variant */}
        <div className="flex items-end gap-6 pt-2">
          {[16, 24, 32, 48, 64, 96].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <FlatIconPreview size={s} />
              <span className="text-[11px] text-[#aeb4bc] font-mono">{s}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2c. Concept: Stacked Tokens ────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[20px] font-semibold text-[#0e0f11] dark:text-white tracking-[-0.02em]" style={{ fontFamily: FONT_HEAD }}>
              Concept: Stacked Tokens
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-[#f0faf6] text-[10px] font-bold text-[#08a671] uppercase tracking-[0.08em]">Draft</span>
          </div>
          <p className="text-[13px] text-[#99a0aa]">
            Same silhouette as the current 3D icon — same rx, ry, same ring positions. Each section between rings gets its own shade, darkest at the bottom, lightest lid on top. Flat, no gradients or gloss.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <AssetCard
            label="On white"
            bg="bg-white border border-[#e6e8ea]"
            preview={<StackedIconPreview size={72} />}
            onSvg={() => downloadSvg(STACKED_ICON_SVG(512), 'earnbase-icon-stacked.svg')}
            onPng={() => downloadPng(STACKED_ICON_SVG(512), 'earnbase-icon-stacked-512.png', 512)}
          />
          <AssetCard
            label="On dark"
            bg="bg-[#0e0f11]"
            preview={<StackedIconPreview size={72} />}
            onSvg={() => downloadSvg(STACKED_ICON_SVG(512), 'earnbase-icon-stacked.svg')}
            onPng={() => downloadPng(STACKED_ICON_SVG(512), 'earnbase-icon-stacked-512.png', 512)}
          />
          <AssetCard
            label="On brand green"
            bg="bg-[#08a671]"
            preview={<StackedIconPreview size={72} />}
            onSvg={() => downloadSvg(STACKED_ICON_SVG(512), 'earnbase-icon-stacked.svg')}
            onPng={() => downloadPng(STACKED_ICON_SVG(1024), 'earnbase-icon-stacked-1024.png', 1024)}
          />
        </div>

        {/* Side-by-side comparison */}
        <div className="rounded-2xl border border-[#e6e8ea] bg-white p-8">
          <p className="text-[11px] text-[#aeb4bc] font-semibold uppercase tracking-[0.06em] mb-6">Side-by-side comparison</p>
          <div className="flex items-center justify-center gap-16">
            <div className="flex flex-col items-center gap-3">
              <IconPreview size={80} />
              <span className="text-[12px] text-[#77808d] font-medium">Current (3D)</span>
            </div>
            <div className="w-px h-20 bg-[#e6e8ea]" />
            <div className="flex flex-col items-center gap-3">
              <StackedIconPreview size={80} />
              <span className="text-[12px] text-[#77808d] font-medium">Stacked Tokens</span>
            </div>
          </div>
        </div>

        {/* Size grid for stacked variant */}
        <div className="flex items-end gap-6 pt-2">
          {[16, 24, 32, 48, 64, 96].map(s => (
            <div key={s} className="flex flex-col items-center gap-2">
              <StackedIconPreview size={s} />
              <span className="text-[11px] text-[#aeb4bc] font-mono">{s}px</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Color Palette ───────────────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-[20px] font-semibold text-[#0e0f11] dark:text-white tracking-[-0.02em]" style={{ fontFamily: FONT_HEAD }}>
            Color Palette
          </h2>
          <p className="text-[13px] text-[#99a0aa]">Core brand colors. Click hex to copy.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {COLORS.map(c => (
            <div key={c.hex} className="space-y-2.5">
              <div
                className="w-full aspect-square rounded-2xl shadow-sm border border-black/5"
                style={{ background: c.hex }}
              />
              <div>
                <p className="text-[13px] font-medium text-[#0e0f11] dark:text-white leading-tight">{c.name}</p>
                <CopyHex hex={c.hex} />
                <p className="text-[11px] text-[#aeb4bc] mt-0.5 leading-snug">{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Typography ──────────────────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-[20px] font-semibold text-[#0e0f11] dark:text-white tracking-[-0.02em]" style={{ fontFamily: FONT_HEAD }}>
            Typography
          </h2>
          <p className="text-[13px] text-[#99a0aa]">Two-font system for clarity and personality.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-[#e6e8ea] bg-white p-8 space-y-4">
            <p className="text-[11px] text-[#aeb4bc] font-semibold uppercase tracking-[0.06em]">Headings &amp; Numbers</p>
            <p
              className="text-[36px] font-bold text-[#0e0f11] tracking-[-0.04em] leading-none"
              style={{ fontFamily: FONT_HEAD }}
            >
              Space Grotesk
            </p>
            <p className="text-[13px] text-[#77808d]" style={{ fontFamily: FONT_HEAD }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 &nbsp; $22,847.53
            </p>
            <div className="flex gap-2">
              {[500, 600, 700].map(w => (
                <span
                  key={w}
                  className="px-3 py-1 rounded-lg bg-[#f5f6f7] text-[12px] text-[#77808d]"
                  style={{ fontFamily: FONT_HEAD, fontWeight: w }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e6e8ea] bg-white p-8 space-y-4">
            <p className="text-[11px] text-[#aeb4bc] font-semibold uppercase tracking-[0.06em]">Body &amp; UI</p>
            <p
              className="text-[36px] font-bold text-[#0e0f11] tracking-[-0.02em] leading-none"
              style={{ fontFamily: FONT }}
            >
              Plus Jakarta Sans
            </p>
            <p className="text-[13px] text-[#77808d]" style={{ fontFamily: FONT }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 &nbsp; Labels, buttons, body text
            </p>
            <div className="flex gap-2">
              {[400, 500, 600, 700].map(w => (
                <span
                  key={w}
                  className="px-3 py-1 rounded-lg bg-[#f5f6f7] text-[12px] text-[#77808d]"
                  style={{ fontFamily: FONT, fontWeight: w }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Usage Guidelines ────────────────────── */}
      <section className="space-y-6 pb-8">
        <div className="space-y-1">
          <h2 className="text-[20px] font-semibold text-[#0e0f11] dark:text-white tracking-[-0.02em]" style={{ fontFamily: FONT_HEAD }}>
            Usage Guidelines
          </h2>
        </div>
        <div className="rounded-2xl border border-[#e6e8ea] bg-white p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-[13px] text-[#444b55] leading-relaxed">
          <Guideline yes text="Use the logo lockup as provided — icon left, wordmark right." />
          <Guideline text="Do not rotate, skew, or add effects to the logo." />
          <Guideline yes text="Maintain minimum clear space equal to the icon height around the logo." />
          <Guideline text="Do not place the logo on busy or low-contrast backgrounds." />
          <Guideline yes text="Use the standalone icon mark for favicons and small sizes." />
          <Guideline text="Do not change the brand green or wordmark color." />
        </div>
      </section>
    </div>
  );
};

/* ── Sub-components ──────────────────────────────── */

function AssetCard({
  label,
  bg,
  preview,
  onSvg,
  onPng,
}: {
  label: string;
  bg: string;
  preview: React.ReactNode;
  onSvg: () => void;
  onPng: () => void;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#e6e8ea]">
      <div className={`${bg} flex items-center justify-center py-14 px-10`}>
        {preview}
      </div>
      <div className="bg-white flex items-center justify-between px-5 py-3 border-t border-[#e6e8ea]">
        <span className="text-[12px] text-[#77808d] font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <DownloadBtn label="SVG" onClick={onSvg} />
          <DownloadBtn label="PNG" onClick={onPng} />
        </div>
      </div>
    </div>
  );
}

function DownloadBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5f6f7] hover:bg-[#eef0f2] text-[12px] font-medium text-[#444b55] transition-colors cursor-pointer"
    >
      <Download className="w-3 h-3" />
      {label}
    </button>
  );
}

function IconPreview({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={`cg-${size}`} x1="88" y1="128" x2="424" y2="384" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity={0.08} />
          <stop offset="50%" stopColor="white" stopOpacity={0} />
          <stop offset="100%" stopColor="black" stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <ellipse cx={256} cy={384} rx={168} ry={72} fill="#06895d" />
      <rect x={88} y={128} width={336} height={256} fill="#08a671" />
      <rect x={88} y={128} width={336} height={256} fill={`url(#cg-${size})`} />
      <ellipse cx={256} cy={128} rx={168} ry={72} fill="#2ec48f" />
      <ellipse cx={256} cy={128} rx={120} ry={48} fill="#08a671" opacity={0.35} />
      <ellipse cx={256} cy={232} rx={168} ry={51} fill="none" stroke="#06895d" strokeWidth={3} opacity={0.25} />
      <ellipse cx={256} cy={320} rx={168} ry={56} fill="none" stroke="#06895d" strokeWidth={3} opacity={0.18} />
      <ellipse cx={256} cy={384} rx={168} ry={72} fill="none" stroke="#06895d" strokeWidth={3} opacity={0.25} />
      <ellipse cx={208} cy={115} rx={80} ry={24} fill="white" opacity={0.16} />
    </svg>
  );
}

function FlatIconPreview({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <ellipse cx={256} cy={384} rx={168} ry={72} fill="#08a671" />
      <rect x={88} y={128} width={336} height={256} fill="#08a671" />
      <ellipse cx={256} cy={232} rx={168} ry={51} fill="none" stroke="#06895d" strokeWidth={2.5} opacity={0.2} />
      <ellipse cx={256} cy={320} rx={168} ry={56} fill="none" stroke="#06895d" strokeWidth={2.5} opacity={0.15} />
      <ellipse cx={256} cy={384} rx={168} ry={72} fill="none" stroke="#06895d" strokeWidth={2.5} opacity={0.2} />
      <ellipse cx={256} cy={128} rx={168} ry={72} fill="#2ec48f" />
    </svg>
  );
}

function StackedIconPreview({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Bottom section (darkest) */}
      <ellipse cx={256} cy={384} rx={168} ry={72} fill="#044d35" />
      <rect x={88} y={320} width={336} height={64} fill="#055a3f" />
      <ellipse cx={256} cy={320} rx={168} ry={56} fill="#06895d" />
      {/* Middle section */}
      <rect x={88} y={232} width={336} height={88} fill="#079565" />
      <ellipse cx={256} cy={232} rx={168} ry={51} fill="#08a671" />
      {/* Top section (lightest) */}
      <rect x={88} y={128} width={336} height={104} fill="#0fb87f" />
      <ellipse cx={256} cy={128} rx={168} ry={72} fill="#2ec48f" />
    </svg>
  );
}

function Guideline({ text, yes }: { text: string; yes?: boolean }) {
  return (
    <div className="flex gap-2.5">
      <span className={`text-[14px] mt-0.5 flex-shrink-0 ${yes ? 'text-[#08a671]' : 'text-[#e05454]'}`}>
        {yes ? '✓' : '✗'}
      </span>
      <span>{text}</span>
    </div>
  );
}