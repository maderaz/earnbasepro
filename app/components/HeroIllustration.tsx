'use client';

/**
 * HeroIllustration — Interactive wireframe SVG with hoverable buildings + floating tokens.
 * White strokes on transparent — designed for green (#08a671) background.
 */
import React, { useState, useCallback } from 'react';

const FONT = "'Plus Jakarta Sans', sans-serif";

interface Bar { id: number; x: number; y: number; w: number; h: number; baseOpacity: number }

const BARS: Bar[] = [
  { id: 1, x: 90,  y: 230, w: 52, h: 110, baseOpacity: 0.5  },
  { id: 2, x: 170, y: 180, w: 58, h: 160, baseOpacity: 0.55 },
  { id: 3, x: 268, y: 170, w: 55, h: 170, baseOpacity: 0.4  },
  { id: 4, x: 365, y: 150, w: 55, h: 190, baseOpacity: 0.5  },
  { id: 5, x: 450, y: 210, w: 48, h: 130, baseOpacity: 0.45 },
  { id: 6, x: 530, y: 120, w: 62, h: 220, baseOpacity: 0.55 },
  { id: 7, x: 625, y: 190, w: 52, h: 150, baseOpacity: 0.45 },
  { id: 8, x: 710, y: 250, w: 46, h: 90,  baseOpacity: 0.4  },
  { id: 9, x: 783, y: 80,  w: 70, h: 260, baseOpacity: 0.7  },
];

export const HeroIllustration: React.FC<{ className?: string }> = ({ className }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const onEnter = useCallback((id: number) => setHovered(id), []);
  const onLeave = useCallback(() => setHovered(null), []);

  const barOp = (bar: Bar) => hovered === bar.id ? Math.min(1, bar.baseOpacity + 0.45) : bar.baseOpacity;
  const tokOp = (barId: number, base: number) => hovered === barId ? Math.min(1, base + 0.45) : base;
  const bobCls = (barId: number) => hovered === barId ? 'hero-token-bob' : '';

  return (
    <svg viewBox="0 0 960 340" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} preserveAspectRatio="xMidYMax meet">
      <style>{`
        @keyframes tokenBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .hero-token-bob { animation: tokenBob 0.8s ease-in-out infinite; }
      `}</style>

      <g opacity="0.12" stroke="#fff" strokeWidth="0.8">
        <line x1="0" y1="340" x2="960" y2="340" /><line x1="0" y1="320" x2="960" y2="320" />
        <line x1="0" y1="300" x2="960" y2="300" />
        {[80,160,240,320,400,480,560,640,720,800,880].map(x => <line key={x} x1={x} y1="260" x2={x} y2="340" />)}
      </g>

      <g opacity={barOp(BARS[0])} stroke="#fff" strokeWidth="1.2" style={{ transition: 'opacity 0.25s ease' }}>
        <rect x="90" y="230" width="52" height="110" rx="2" />
        <line x1="90" y1="260" x2="142" y2="260" /><line x1="90" y1="290" x2="142" y2="290" /><line x1="90" y1="310" x2="142" y2="310" />
        <rect x="97" y="238" width="8" height="12" rx="1" /><rect x="112" y="238" width="8" height="12" rx="1" /><rect x="127" y="238" width="8" height="12" rx="1" />
        <rect x="97" y="268" width="8" height="12" rx="1" /><rect x="112" y="268" width="8" height="12" rx="1" /><rect x="127" y="268" width="8" height="12" rx="1" />
      </g>

      <g opacity={barOp(BARS[1])} stroke="#fff" strokeWidth="1.2" style={{ transition: 'opacity 0.25s ease' }}>
        <rect x="170" y="180" width="58" height="160" rx="2" />
        <line x1="170" y1="210" x2="228" y2="210" /><line x1="170" y1="240" x2="228" y2="240" /><line x1="170" y1="270" x2="228" y2="270" /><line x1="170" y1="300" x2="228" y2="300" />
        <rect x="177" y="188" width="10" height="14" rx="1" /><rect x="194" y="188" width="10" height="14" rx="1" /><rect x="211" y="188" width="10" height="14" rx="1" />
        <rect x="177" y="218" width="10" height="14" rx="1" /><rect x="194" y="218" width="10" height="14" rx="1" /><rect x="211" y="218" width="10" height="14" rx="1" />
        <rect x="177" y="248" width="10" height="14" rx="1" /><rect x="194" y="248" width="10" height="14" rx="1" /><rect x="211" y="248" width="10" height="14" rx="1" />
      </g>

      <g opacity={barOp(BARS[2])} stroke="#fff" strokeWidth="1.2" style={{ transition: 'opacity 0.25s ease' }}>
        <rect x="268" y="170" width="55" height="170" rx="2" />
        <line x1="268" y1="200" x2="323" y2="200" /><line x1="268" y1="230" x2="323" y2="230" /><line x1="268" y1="260" x2="323" y2="260" /><line x1="268" y1="290" x2="323" y2="290" /><line x1="268" y1="320" x2="323" y2="320" />
        <rect x="275" y="178" width="9" height="14" rx="1" /><rect x="291" y="178" width="9" height="14" rx="1" /><rect x="307" y="178" width="9" height="14" rx="1" />
      </g>

      <g opacity={barOp(BARS[3])} stroke="#fff" strokeWidth="1.2" style={{ transition: 'opacity 0.25s ease' }}>
        <rect x="365" y="150" width="55" height="190" rx="2" />
        <line x1="365" y1="180" x2="420" y2="180" /><line x1="365" y1="210" x2="420" y2="210" /><line x1="365" y1="240" x2="420" y2="240" /><line x1="365" y1="270" x2="420" y2="270" /><line x1="365" y1="300" x2="420" y2="300" />
        <rect x="372" y="158" width="9" height="14" rx="1" /><rect x="388" y="158" width="9" height="14" rx="1" /><rect x="404" y="158" width="9" height="14" rx="1" />
        <rect x="372" y="188" width="9" height="14" rx="1" /><rect x="388" y="188" width="9" height="14" rx="1" /><rect x="404" y="188" width="9" height="14" rx="1" />
      </g>

      <g opacity={barOp(BARS[4])} stroke="#fff" strokeWidth="1.2" style={{ transition: 'opacity 0.25s ease' }}>
        <rect x="450" y="210" width="48" height="130" rx="2" />
        <line x1="450" y1="240" x2="498" y2="240" /><line x1="450" y1="270" x2="498" y2="270" /><line x1="450" y1="300" x2="498" y2="300" />
        <rect x="456" y="218" width="8" height="14" rx="1" /><rect x="470" y="218" width="8" height="14" rx="1" /><rect x="484" y="218" width="8" height="14" rx="1" />
      </g>

      <g opacity={barOp(BARS[5])} stroke="#fff" strokeWidth="1.2" style={{ transition: 'opacity 0.25s ease' }}>
        <rect x="530" y="120" width="62" height="220" rx="2" />
        <line x1="530" y1="155" x2="592" y2="155" /><line x1="530" y1="190" x2="592" y2="190" /><line x1="530" y1="225" x2="592" y2="225" /><line x1="530" y1="260" x2="592" y2="260" /><line x1="530" y1="295" x2="592" y2="295" />
        <line x1="530" y1="120" x2="592" y2="155" opacity="0.35" /><line x1="592" y1="120" x2="530" y2="155" opacity="0.35" />
        <rect x="538" y="197" width="10" height="18" rx="1" /><rect x="556" y="197" width="10" height="18" rx="1" /><rect x="574" y="197" width="10" height="18" rx="1" />
        <rect x="538" y="232" width="10" height="18" rx="1" /><rect x="556" y="232" width="10" height="18" rx="1" /><rect x="574" y="232" width="10" height="18" rx="1" />
      </g>

      <g opacity={barOp(BARS[6])} stroke="#fff" strokeWidth="1.2" style={{ transition: 'opacity 0.25s ease' }}>
        <rect x="625" y="190" width="52" height="150" rx="2" />
        <line x1="625" y1="220" x2="677" y2="220" /><line x1="625" y1="250" x2="677" y2="250" /><line x1="625" y1="280" x2="677" y2="280" /><line x1="625" y1="310" x2="677" y2="310" />
        <rect x="632" y="198" width="8" height="14" rx="1" /><rect x="647" y="198" width="8" height="14" rx="1" /><rect x="662" y="198" width="8" height="14" rx="1" />
      </g>

      <g opacity={barOp(BARS[7])} stroke="#fff" strokeWidth="1.2" style={{ transition: 'opacity 0.25s ease' }}>
        <rect x="710" y="250" width="46" height="90" rx="2" />
        <line x1="710" y1="280" x2="756" y2="280" /><line x1="710" y1="310" x2="756" y2="310" />
        <rect x="720" y="258" width="8" height="14" rx="1" /><rect x="738" y="258" width="8" height="14" rx="1" />
      </g>

      <g opacity={barOp(BARS[8])} stroke="#fff" strokeWidth="1.2" style={{ transition: 'opacity 0.25s ease' }}>
        <rect x="783" y="80" width="70" height="260" rx="2" />
        <line x1="783" y1="115" x2="853" y2="115" /><line x1="783" y1="150" x2="853" y2="150" /><line x1="783" y1="185" x2="853" y2="185" /><line x1="783" y1="220" x2="853" y2="220" /><line x1="783" y1="255" x2="853" y2="255" /><line x1="783" y1="290" x2="853" y2="290" />
        <line x1="783" y1="80" x2="853" y2="115" opacity="0.4" /><line x1="853" y1="80" x2="783" y2="115" opacity="0.4" />
        <rect x="792" y="192" width="12" height="18" rx="1" /><rect x="812" y="192" width="12" height="18" rx="1" /><rect x="832" y="192" width="12" height="18" rx="1" />
        <rect x="792" y="227" width="12" height="18" rx="1" /><rect x="812" y="227" width="12" height="18" rx="1" /><rect x="832" y="227" width="12" height="18" rx="1" />
        <rect x="792" y="262" width="12" height="18" rx="1" /><rect x="812" y="262" width="12" height="18" rx="1" /><rect x="832" y="262" width="12" height="18" rx="1" />
      </g>

      {/* Token coins */}
      <g opacity={tokOp(1,0.45)} className={bobCls(1)} style={{ transition: 'opacity 0.25s ease', transformOrigin: '116px 200px' }}>
        <circle cx="116" cy="200" r="16" stroke="#fff" strokeWidth="1.3" fill="none" />
        <text x="116" y="200" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="13" fontWeight="600" fontFamily={FONT}>Ξ</text>
      </g>
      <g opacity={tokOp(2,0.5)} className={bobCls(2)} style={{ transition: 'opacity 0.25s ease', transformOrigin: '199px 152px' }}>
        <circle cx="199" cy="152" r="16" stroke="#fff" strokeWidth="1.3" fill="none" />
        <text x="199" y="152" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="13" fontWeight="600" fontFamily={FONT}>$</text>
      </g>
      <g opacity={tokOp(3,0.4)} className={bobCls(3)} style={{ transition: 'opacity 0.25s ease', transformOrigin: '295px 140px' }}>
        <circle cx="295" cy="140" r="18" stroke="#fff" strokeWidth="1.3" fill="none" />
        <path d="M295,130 L302,140 L295,144 L288,140 Z" stroke="#fff" strokeWidth="0.9" fill="none" />
        <path d="M295,144 L302,140 L295,150 L288,140 Z" stroke="#fff" strokeWidth="0.9" fill="none" opacity="0.5" />
      </g>
      <g opacity={tokOp(4,0.45)} className={bobCls(4)} style={{ transition: 'opacity 0.25s ease', transformOrigin: '392px 120px' }}>
        <circle cx="392" cy="120" r="16" stroke="#fff" strokeWidth="1.3" fill="none" />
        <text x="392" y="120" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="13" fontWeight="700" fontFamily={FONT}>₿</text>
      </g>
      <g opacity={tokOp(5,0.4)} className={bobCls(5)} style={{ transition: 'opacity 0.25s ease', transformOrigin: '474px 180px' }}>
        <circle cx="474" cy="180" r="16" stroke="#fff" strokeWidth="1.3" fill="none" />
        <text x="474" y="180" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="13" fontWeight="600" fontFamily={FONT}>Ξ</text>
      </g>
      <g opacity={tokOp(6,0.55)} className={bobCls(6)} style={{ transition: 'opacity 0.25s ease', transformOrigin: '561px 90px' }}>
        <circle cx="561" cy="90" r="17" stroke="#fff" strokeWidth="1.3" fill="none" />
        <text x="561" y="91" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="13" fontWeight="700" fontFamily={FONT}>$</text>
      </g>
      <g opacity={tokOp(7,0.4)} className={bobCls(7)} style={{ transition: 'opacity 0.25s ease', transformOrigin: '651px 162px' }}>
        <circle cx="651" cy="162" r="18" stroke="#fff" strokeWidth="1.3" fill="none" />
        <path d="M651,152 L658,162 L651,166 L644,162 Z" stroke="#fff" strokeWidth="0.9" fill="none" />
        <path d="M651,166 L658,162 L651,172 L644,162 Z" stroke="#fff" strokeWidth="0.9" fill="none" opacity="0.5" />
      </g>
      <g opacity={tokOp(8,0.35)} className={bobCls(8)} style={{ transition: 'opacity 0.25s ease', transformOrigin: '733px 220px' }}>
        <circle cx="733" cy="220" r="16" stroke="#fff" strokeWidth="1.3" fill="none" />
        <text x="733" y="220" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="13" fontWeight="600" fontFamily={FONT}>Ξ</text>
      </g>
      <g opacity={tokOp(9,0.6)} className={bobCls(9)} style={{ transition: 'opacity 0.25s ease', transformOrigin: '818px 52px' }}>
        <circle cx="818" cy="52" r="16" stroke="#fff" strokeWidth="1.3" fill="none" />
        <text x="818" y="52" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="13" fontWeight="600" fontFamily={FONT}>$</text>
      </g>

      {/* Invisible hover zones */}
      {BARS.map(bar => (
        <rect key={bar.id} x={bar.x - 6} y={Math.min(bar.y, bar.y - 60) - 30}
          width={bar.w + 12} height={bar.h + 90} fill="transparent"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => onEnter(bar.id)} onMouseLeave={onLeave} />
      ))}
    </svg>
  );
};
