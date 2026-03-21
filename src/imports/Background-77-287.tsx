import svgPaths from "./svg-e3ojqstwan";
import { imgGroup } from "./svg-t9pf0";

function Svg() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path d={svgPaths.p9d32fc0} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.55" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative">
        <Svg />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="opacity-55 relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[3.23px] relative">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[18px] not-italic relative shrink-0 text-[#1a1c21] text-[11.1px] tracking-[-0.16px] whitespace-nowrap">
          <p className="mb-0">API‑Preise gelten nur für das API‑Produkt. Chat und Agenten (mit enthaltenen Modellen) verursachen keine nutzungsbasierten Kosten. Die Preise basieren auf</p>
          <p>den USD‑Tarifen der Anbieter zuzüglich 10 % Langdock‑Aufschlag. Alle Preise zzgl. MwSt.</p>
        </div>
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[rgba(26,28,33,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="content-stretch flex gap-[12px] items-start p-[12.667px] relative w-full">
        <Margin />
        <Container />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px opacity-55 relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13.7px] tracking-[-0.16px] w-full">
        <p className="leading-[19.6px] whitespace-pre-wrap">Modell</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-[12px] relative w-full">
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px opacity-55 relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13.2px] tracking-[-0.16px] w-full">
        <p className="leading-[19.6px] whitespace-pre-wrap">Input Tokens</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-[12px] relative w-full">
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px opacity-55 relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13.2px] tracking-[-0.16px] w-full">
        <p className="leading-[19.6px] whitespace-pre-wrap">Output Tokens</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-[12px] relative w-full">
          <Container7 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px opacity-55 relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13.6px] tracking-[-0.16px] w-full">
        <p className="leading-[19.6px] whitespace-pre-wrap">Regionen</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-[12px] relative w-full">
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex items-start justify-center pb-[0.667px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(26,28,33,0.1)] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <Container2 />
      <Container4 />
      <Container6 />
      <Container8 />
    </div>
  );
}

function Component6953E6De77Dd499570Bfb38AOpenaiSvg1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="6953e6de77dd499570bfb38a_openai.svg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="6953e6de77dd499570bfb38a_openai.svg">
          <path d={svgPaths.p27290e00} fill="var(--fill-0, #2F2F2F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Component6953E6De77Dd499570Bfb38AOpenaiSvgFill() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="6953e6de77dd499570bfb38a_openai.svg fill">
      <Component6953E6De77Dd499570Bfb38AOpenaiSvg1 />
    </div>
  );
}

function Component6953E6De77Dd499570Bfb38AOpenaiSvg() {
  return (
    <div className="max-w-[24px] relative shrink-0 size-[16px]" data-name="6953e6de77dd499570bfb38a_openai.svg">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] overflow-clip relative rounded-[inherit] size-full">
        <Component6953E6De77Dd499570Bfb38AOpenaiSvgFill />
      </div>
    </div>
  );
}

function Border1() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[800px] shrink-0 size-[24px]" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[rgba(26,28,33,0.1)] border-solid inset-0 pointer-events-none rounded-[800px]" />
      <Component6953E6De77Dd499570Bfb38AOpenaiSvg />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[12.7px] tracking-[-0.16px] whitespace-nowrap">
        <p className="leading-[19.6px]">GPT-5.2</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center p-[12px] relative w-full">
          <Border1 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13.1px] tracking-[-0.16px] w-full">
        <p className="leading-[19.6px] whitespace-pre-wrap">€1.64 / 1M tokens</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[14.22px] pt-[14.19px] px-[12px] relative w-full">
          <Container13 />
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13px] tracking-[-0.16px] w-full">
        <p className="leading-[19.6px] whitespace-pre-wrap">€13.09 / 1M tokens</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[14.22px] pt-[14.19px] px-[12px] relative w-full">
          <Container15 />
        </div>
      </div>
    </div>
  );
}

function Component6953E80Edf98Fa245891D732GlobeSvg1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="6953e80edf98fa245891d732_globe.svg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="6953e80edf98fa245891d732_globe.svg">
          <path d={svgPaths.pbdcc2c0} id="Vector" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.39996 6H13.6" id="Vector_2" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.39996 10H13.6" id="Vector_3" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p37f95700} id="Vector_4" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3a68ef00} id="Vector_5" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Component6953E80Edf98Fa245891D732GlobeSvgFill() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="6953e80edf98fa245891d732_globe.svg fill">
      <Component6953E80Edf98Fa245891D732GlobeSvg1 />
    </div>
  );
}

function Component6953E80Edf98Fa245891D732GlobeSvg() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[16px] overflow-clip relative shrink-0 size-[16px]" data-name="6953e80edf98fa245891d732_globe.svg">
      <Component6953E80Edf98Fa245891D732GlobeSvgFill />
    </div>
  );
}

function Listitem1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 size-[16px]" data-name="Listitem">
      <Component6953E80Edf98Fa245891D732GlobeSvg />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[3.13%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.5px_-0.5px] mask-size-[16px_16px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Group">
          <path d={svgPaths.p105ee640} fill="var(--fill-0, #0050D3)" id="Vector" />
          <path d={svgPaths.p249394f0} fill="var(--fill-0, #F4B929)" id="Vector_2" />
          <path d={svgPaths.p3fef43f0} fill="var(--fill-0, #F4B929)" id="Vector_3" />
          <path d={svgPaths.p313f6400} fill="var(--fill-0, #F4B929)" id="Vector_4" />
          <path d={svgPaths.pb5c72c0} fill="var(--fill-0, #F4B929)" id="Vector_5" />
          <path d={svgPaths.pdee980} fill="var(--fill-0, #F4B929)" id="Vector_6" />
          <path d={svgPaths.p122c2d00} fill="var(--fill-0, #F4B929)" id="Vector_7" />
          <path d={svgPaths.p21ecc00} fill="var(--fill-0, #F4B929)" id="Vector_8" />
          <path d={svgPaths.p1ab12832} fill="var(--fill-0, #F4B929)" id="Vector_9" />
          <path d={svgPaths.p3edf6a40} fill="var(--fill-0, #F4B929)" id="Vector_10" />
          <path d={svgPaths.p212b9e00} fill="var(--fill-0, #F4B929)" id="Vector_11" />
          <path d={svgPaths.p1c363c40} fill="var(--fill-0, #F4B929)" id="Vector_12" />
          <path d={svgPaths.p25537c80} fill="var(--fill-0, #F4B929)" id="Vector_13" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Component6953E7F46998Eabcbb8126EdEuSvg1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="6953e7f46998eabcbb8126ed_eu.svg">
      <ClipPathGroup />
    </div>
  );
}

function Component6953E7F46998Eabcbb8126EdEuSvgFill() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="6953e7f46998eabcbb8126ed_eu.svg fill">
      <Component6953E7F46998Eabcbb8126EdEuSvg1 />
    </div>
  );
}

function Component6953E7F46998Eabcbb8126EdEuSvg() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[16px] overflow-clip relative shrink-0 size-[16px]" data-name="6953e7f46998eabcbb8126ed_eu.svg">
      <Component6953E7F46998Eabcbb8126EdEuSvgFill />
    </div>
  );
}

function Listitem2() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 size-[16px]" data-name="Listitem">
      <Component6953E7F46998Eabcbb8126EdEuSvg />
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="List">
      <Listitem1 />
      <Listitem2 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <List1 />
    </div>
  );
}

function Container16() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[12px] py-[16px] relative w-full">
          <Container17 />
        </div>
      </div>
    </div>
  );
}

function Listitem() {
  return (
    <div className="content-stretch flex items-start justify-center pb-[0.667px] relative shrink-0 w-full" data-name="Listitem">
      <div aria-hidden="true" className="absolute border-[rgba(26,28,33,0.1)] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <Container10 />
      <Container12 />
      <Container14 />
      <Container16 />
    </div>
  );
}

function Component6953E6De77Dd499570Bfb38AOpenaiSvg3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="6953e6de77dd499570bfb38a_openai.svg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="6953e6de77dd499570bfb38a_openai.svg">
          <path d={svgPaths.p27290e00} fill="var(--fill-0, #2F2F2F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Component6953E6De77Dd499570Bfb38AOpenaiSvgFill1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="6953e6de77dd499570bfb38a_openai.svg fill">
      <Component6953E6De77Dd499570Bfb38AOpenaiSvg3 />
    </div>
  );
}

function Component6953E6De77Dd499570Bfb38AOpenaiSvg2() {
  return (
    <div className="max-w-[24px] relative shrink-0 size-[16px]" data-name="6953e6de77dd499570bfb38a_openai.svg">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] overflow-clip relative rounded-[inherit] size-full">
        <Component6953E6De77Dd499570Bfb38AOpenaiSvgFill1 />
      </div>
    </div>
  );
}

function Border2() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[800px] shrink-0 size-[24px]" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[rgba(26,28,33,0.1)] border-solid inset-0 pointer-events-none rounded-[800px]" />
      <Component6953E6De77Dd499570Bfb38AOpenaiSvg2 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[12.7px] tracking-[-0.16px] whitespace-nowrap">
        <p className="leading-[19.6px]">GPT-5</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center p-[12px] relative w-full">
          <Border2 />
          <Container19 />
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[12.9px] tracking-[-0.16px] w-full">
        <p className="leading-[19.6px] whitespace-pre-wrap">€1.17 / 1M tokens</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[14.21px] pt-[14.2px] px-[12px] relative w-full">
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13.1px] tracking-[-0.16px] w-full">
        <p className="leading-[19.6px] whitespace-pre-wrap">€9.35 / 1M tokens</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[14.21px] pt-[14.2px] px-[12px] relative w-full">
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[3.13%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.5px_-0.5px] mask-size-[16px_16px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Group">
          <path d={svgPaths.p105ee640} fill="var(--fill-0, #0050D3)" id="Vector" />
          <path d={svgPaths.p249394f0} fill="var(--fill-0, #F4B929)" id="Vector_2" />
          <path d={svgPaths.p3fef43f0} fill="var(--fill-0, #F4B929)" id="Vector_3" />
          <path d={svgPaths.p313f6400} fill="var(--fill-0, #F4B929)" id="Vector_4" />
          <path d={svgPaths.pb5c72c0} fill="var(--fill-0, #F4B929)" id="Vector_5" />
          <path d={svgPaths.pdee980} fill="var(--fill-0, #F4B929)" id="Vector_6" />
          <path d={svgPaths.p122c2d00} fill="var(--fill-0, #F4B929)" id="Vector_7" />
          <path d={svgPaths.p21ecc00} fill="var(--fill-0, #F4B929)" id="Vector_8" />
          <path d={svgPaths.p1ab12832} fill="var(--fill-0, #F4B929)" id="Vector_9" />
          <path d={svgPaths.p3edf6a40} fill="var(--fill-0, #F4B929)" id="Vector_10" />
          <path d={svgPaths.p212b9e00} fill="var(--fill-0, #F4B929)" id="Vector_11" />
          <path d={svgPaths.p1c363c40} fill="var(--fill-0, #F4B929)" id="Vector_12" />
          <path d={svgPaths.p25537c80} fill="var(--fill-0, #F4B929)" id="Vector_13" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function Component6953E7F46998Eabcbb8126EdEuSvg3() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="6953e7f46998eabcbb8126ed_eu.svg">
      <ClipPathGroup1 />
    </div>
  );
}

function Component6953E7F46998Eabcbb8126EdEuSvgFill1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="6953e7f46998eabcbb8126ed_eu.svg fill">
      <Component6953E7F46998Eabcbb8126EdEuSvg3 />
    </div>
  );
}

function Component6953E7F46998Eabcbb8126EdEuSvg2() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[16px] overflow-clip relative shrink-0 size-[16px]" data-name="6953e7f46998eabcbb8126ed_eu.svg">
      <Component6953E7F46998Eabcbb8126EdEuSvgFill1 />
    </div>
  );
}

function Listitem4() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 size-[16px]" data-name="Listitem">
      <Component6953E7F46998Eabcbb8126EdEuSvg2 />
    </div>
  );
}

function Component6953E80Edf98Fa245891D732GlobeSvg3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="6953e80edf98fa245891d732_globe.svg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="6953e80edf98fa245891d732_globe.svg">
          <path d={svgPaths.pbdcc2c0} id="Vector" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.39996 6H13.6" id="Vector_2" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.39996 10H13.6" id="Vector_3" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p37f95700} id="Vector_4" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3a68ef00} id="Vector_5" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Component6953E80Edf98Fa245891D732GlobeSvgFill1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="6953e80edf98fa245891d732_globe.svg fill">
      <Component6953E80Edf98Fa245891D732GlobeSvg3 />
    </div>
  );
}

function Component6953E80Edf98Fa245891D732GlobeSvg2() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[16px] overflow-clip relative shrink-0 size-[16px]" data-name="6953e80edf98fa245891d732_globe.svg">
      <Component6953E80Edf98Fa245891D732GlobeSvgFill1 />
    </div>
  );
}

function Listitem5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 size-[16px]" data-name="Listitem">
      <Component6953E80Edf98Fa245891D732GlobeSvg2 />
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="List">
      <Listitem4 />
      <Listitem5 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <List2 />
    </div>
  );
}

function Container24() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[12px] py-[16px] relative w-full">
          <Container25 />
        </div>
      </div>
    </div>
  );
}

function Listitem3() {
  return (
    <div className="content-stretch flex items-start justify-center pb-[0.667px] relative shrink-0 w-full" data-name="Listitem">
      <div aria-hidden="true" className="absolute border-[rgba(26,28,33,0.1)] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <Container18 />
      <Container20 />
      <Container22 />
      <Container24 />
    </div>
  );
}

function Component6953E6Abfd97D7D434E1A97CGoogleSvg1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="6953e6abfd97d7d434e1a97c_google.svg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="6953e6abfd97d7d434e1a97c_google.svg">
          <path d={svgPaths.p1970ae00} fill="var(--fill-0, #4285F4)" id="Vector" />
          <path d={svgPaths.p37260a50} fill="var(--fill-0, #34A853)" id="Vector_2" />
          <path d={svgPaths.p39d8ed70} fill="var(--fill-0, #FBBC05)" id="Vector_3" />
          <path d={svgPaths.p26c55e70} fill="var(--fill-0, #EA4335)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Component6953E6Abfd97D7D434E1A97CGoogleSvgFill() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="6953e6abfd97d7d434e1a97c_google.svg fill">
      <Component6953E6Abfd97D7D434E1A97CGoogleSvg1 />
    </div>
  );
}

function Component6953E6Abfd97D7D434E1A97CGoogleSvg() {
  return (
    <div className="max-w-[24px] relative shrink-0 size-[16px]" data-name="6953e6abfd97d7d434e1a97c_google.svg">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] overflow-clip relative rounded-[inherit] size-full">
        <Component6953E6Abfd97D7D434E1A97CGoogleSvgFill />
      </div>
    </div>
  );
}

function Border3() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[800px] shrink-0 size-[24px]" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[rgba(26,28,33,0.1)] border-solid inset-0 pointer-events-none rounded-[800px]" />
      <Component6953E6Abfd97D7D434E1A97CGoogleSvg />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13.3px] tracking-[-0.16px] whitespace-nowrap">
        <p className="leading-[19.6px]">Gemini 3 Pro Preview</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center p-[12px] relative w-full">
          <Border3 />
          <Container27 />
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13.1px] tracking-[-0.16px] w-full">
        <p className="leading-[19.6px] whitespace-pre-wrap">€2.34 / 1M tokens</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[14.21px] pt-[14.2px] px-[12px] relative w-full">
          <Container29 />
        </div>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13px] tracking-[-0.16px] w-full">
        <p className="leading-[19.6px] whitespace-pre-wrap">€14.03 / 1M tokens</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[14.21px] pt-[14.2px] px-[12px] relative w-full">
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function Component6953E80Edf98Fa245891D732GlobeSvg5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="6953e80edf98fa245891d732_globe.svg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="6953e80edf98fa245891d732_globe.svg">
          <path d={svgPaths.pbdcc2c0} id="Vector" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.39996 6H13.6" id="Vector_2" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M2.39996 10H13.6" id="Vector_3" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p37f95700} id="Vector_4" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3a68ef00} id="Vector_5" stroke="var(--stroke-0, #818285)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Component6953E80Edf98Fa245891D732GlobeSvgFill2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="6953e80edf98fa245891d732_globe.svg fill">
      <Component6953E80Edf98Fa245891D732GlobeSvg5 />
    </div>
  );
}

function Component6953E80Edf98Fa245891D732GlobeSvg4() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[16px] overflow-clip relative shrink-0 size-[16px]" data-name="6953e80edf98fa245891d732_globe.svg">
      <Component6953E80Edf98Fa245891D732GlobeSvgFill2 />
    </div>
  );
}

function Listitem7() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 size-[16px]" data-name="Listitem">
      <Component6953E80Edf98Fa245891D732GlobeSvg4 />
    </div>
  );
}

function List3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="List">
      <Listitem7 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <List3 />
    </div>
  );
}

function Container32() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[12px] py-[16px] relative w-full">
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function Listitem6() {
  return (
    <div className="content-stretch flex items-start justify-center pb-[0.667px] relative shrink-0 w-full" data-name="Listitem">
      <div aria-hidden="true" className="absolute border-[rgba(26,28,33,0.1)] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <Container26 />
      <Container28 />
      <Container30 />
      <Container32 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="List">
      <Listitem />
      <Listitem3 />
      <Listitem6 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <HorizontalBorder />
      <List />
    </div>
  );
}

function Link() {
  return (
    <div className="relative rounded-[800px] shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border border-[rgba(26,28,33,0.1)] border-solid inset-0 pointer-events-none rounded-[800px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[18.667px] py-[10.667px] relative w-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1a1c21] text-[13.1px] text-center tracking-[-0.16px] whitespace-nowrap">
            <p className="leading-[21px]">Alle Modelle (40+)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Background() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start p-[24px] relative rounded-[12px] size-full" data-name="Background">
      <Border />
      <Container1 />
      <Link />
    </div>
  );
}