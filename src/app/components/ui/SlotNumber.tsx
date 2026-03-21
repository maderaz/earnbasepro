/**
 * SlotNumber — Casino slot-machine style digit roller.
 * Each character position gets its own rolling column of 0-9.
 * Digits animate vertically via CSS transform; non-digits render statically.
 */
import React, { memo } from 'react';

const DIGITS = '0123456789';

/** Fixed widths per character class — keeps columns rock-steady */
const WIDTH_DIGIT = '0.62em';
const WIDTH_NARROW = '0.32em'; // . , 
const WIDTH_DOLLAR = '0.56em';

function charWidth(c: string): string {
  if (/\d/.test(c)) return WIDTH_DIGIT;
  if (c === '.' || c === ',') return WIDTH_NARROW;
  if (c === '$') return WIDTH_DOLLAR;
  return 'auto';
}

interface SlotDigitProps {
  char: string;
  duration: number;
}

const SlotDigit = memo<SlotDigitProps>(({ char, duration }) => {
  const isDigit = /\d/.test(char);
  const w = charWidth(char);

  if (!isDigit) {
    return (
      <span
        className="inline-block text-center align-top"
        style={{ height: '1.1em', lineHeight: '1.1em', width: w }}
      >
        {char}
      </span>
    );
  }

  const idx = parseInt(char, 10);
  const offset = -idx * 1.1; // em

  return (
    <span
      className="inline-block overflow-hidden align-top"
      style={{ height: '1.1em', width: w }}
    >
      <span
        className="inline-flex flex-col"
        style={{
          transform: `translateY(${offset}em)`,
          transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          willChange: 'transform',
        }}
      >
        {DIGITS.split('').map(d => (
          <span
            key={d}
            className="block text-center"
            style={{ height: '1.1em', lineHeight: '1.1em' }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
});

SlotDigit.displayName = 'SlotDigit';

interface SlotNumberProps {
  value: string;
  className?: string;
  style?: React.CSSProperties;
  /** Duration in ms — default 400 */
  duration?: number;
}

export const SlotNumber: React.FC<SlotNumberProps> = ({
  value,
  className = '',
  style,
  duration = 400,
}) => {
  // Pad to a stable length so columns don't pop in/out.
  // Find max length we expect and pad from the left with spaces.
  const chars = value.split('');

  return (
    <span
      className={`inline-flex ${className}`}
      style={{ fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums', ...style }}
      aria-label={value}
    >
      {chars.map((char, i) => (
        <SlotDigit
          key={i}
          char={char}
          duration={duration + i * 15}
        />
      ))}
    </span>
  );
};