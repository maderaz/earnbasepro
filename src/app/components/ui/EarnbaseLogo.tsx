/**
 * EarnbaseLogo — pure SVG/CSS logo.
 * Green 3D database cylinder icon + "earnbase" wordmark in Space Grotesk.
 */
import React from 'react';

interface Props {
  height?: number;
  /** 'light' = dark text, 'dark' = white text */
  variant?: 'light' | 'dark';
  className?: string;
}

const GREEN = '#08a671';
const GREEN_DARK = '#06895d';
const GREEN_LIGHT = '#2ec48f';

export const EarnbaseLogo: React.FC<Props> = ({
  height = 24,
  variant = 'light',
  className = '',
}) => {
  const iconSize = height;
  const textColor = variant === 'light' ? '#0e0f11' : '#f0f0f0';

  return (
    <span
      className={`inline-flex items-center gap-[0.45em] ${className}`}
      style={{ lineHeight: 1 }}
      aria-label="Earnbase"
    >
      {/* Database cylinder icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 block"
        style={{ display: 'block' }}
      >
        {/* Bottom ellipse shadow */}
        <ellipse cx="16" cy="24" rx="10.5" ry="4.5" fill={GREEN_DARK} />
        {/* Cylinder body */}
        <rect x="5.5" y="8" width="21" height="16" rx="0" fill={GREEN} />
        {/* Body side gradient overlay for 3D feel */}
        <rect x="5.5" y="8" width="21" height="16" fill="url(#cylGrad)" />
        {/* Top ellipse */}
        <ellipse cx="16" cy="8" rx="10.5" ry="4.5" fill={GREEN_LIGHT} />
        {/* Top ellipse inner ring */}
        <ellipse cx="16" cy="8" rx="7.5" ry="3" fill={GREEN} opacity="0.35" />
        {/* Middle data row lines */}
        <ellipse cx="16" cy="14.5" rx="10.5" ry="3.2" fill="none" stroke={GREEN_DARK} strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="16" cy="20" rx="10.5" ry="3.5" fill="none" stroke={GREEN_DARK} strokeWidth="0.5" opacity="0.2" />
        {/* Bottom ellipse */}
        <ellipse cx="16" cy="24" rx="10.5" ry="4.5" fill="none" stroke={GREEN_DARK} strokeWidth="0.5" opacity="0.3" />
        {/* Glossy highlight */}
        <ellipse cx="13" cy="7.2" rx="5" ry="1.5" fill="white" opacity="0.18" />
        <defs>
          <linearGradient id="cylGrad" x1="5.5" y1="8" x2="26.5" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.08" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.12" />
          </linearGradient>
        </defs>
      </svg>

      {/* Wordmark */}
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: height * 0.72,
          letterSpacing: '-0.04em',
          color: textColor,
          lineHeight: 1,
          display: 'block',
        }}
      >
        earnbase
      </span>
    </span>
  );
};