import svgPaths from "./svg-7vipu4d3jb";
import imgVbUsdc from "figma:asset/ded3489d012dfc9cc5a2e85c2aef508492877de3.png";

function VbUsdc() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="vbUSDC">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgVbUsdc} />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 size-[40px]" data-name="Container">
      <VbUsdc />
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,255,255,0.7)] content-stretch flex items-center relative rounded-[29826200px] shrink-0 size-[40px]" data-name="Overlay">
      <Container1 />
    </div>
  );
}

function Strong() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Strong">
      <div className="flex flex-col font-['Source_Code_Pro:Black',sans-serif] font-black justify-center leading-[0] relative shrink-0 text-[#171717] text-[32px] whitespace-nowrap">
        <p className="leading-[40px]">vbUSDC</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p6204c00} fill="var(--fill-0, #525252)" id="Vector" />
          <path d={svgPaths.p2ed0d400} fill="var(--fill-0, #525252)" id="Vector_2" />
          <path d={svgPaths.p2ecefe40} fill="var(--fill-0, #525252)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function LinkViewVaultOnBlockExplorer() {
  return (
    <div className="content-stretch flex flex-col h-[28px] items-start pt-[12px] relative shrink-0" data-name="Link - View vault on block explorer">
      <Svg />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Strong />
      <LinkViewVaultOnBlockExplorer />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container3 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <Overlay />
      <Container2 />
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative">
        <div className="flex flex-col font-['Source_Code_Pro:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-[rgba(23,23,23,0.7)] text-center whitespace-nowrap">
          <p className="leading-[16px]">Katana</p>
        </div>
      </div>
    </div>
  );
}

function ButtonKatana() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center px-[4.889px] py-[2.889px] relative rounded-[8px] shrink-0" data-name="Button - Katana">
      <div aria-hidden="true" className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container6 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Container">
      <ButtonKatana />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative">
        <div className="flex flex-col font-['Source_Code_Pro:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-[rgba(23,23,23,0.7)] text-center whitespace-nowrap">
          <p className="leading-[16px]">Stablecoin</p>
        </div>
      </div>
    </div>
  );
}

function ButtonStablecoin() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center px-[4.889px] py-[2.889px] relative rounded-[8px] shrink-0" data-name="Button - Stablecoin">
      <div aria-hidden="true" className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container8 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Container">
      <ButtonStablecoin />
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative">
        <div className="flex flex-col font-['Source_Code_Pro:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-[rgba(23,23,23,0.7)] text-center whitespace-nowrap">
          <p className="leading-[16px]">Single Asset</p>
        </div>
      </div>
    </div>
  );
}

function ButtonSingleAsset() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center px-[4.889px] py-[2.889px] relative rounded-[8px] shrink-0" data-name="Button - Single Asset">
      <div aria-hidden="true" className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container10 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Container">
      <ButtonSingleAsset />
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative">
        <div className="flex flex-col font-['Source_Code_Pro:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[12px] text-[rgba(23,23,23,0.7)] text-center whitespace-nowrap">
          <p className="leading-[16px]">Allocator</p>
        </div>
      </div>
    </div>
  );
}

function ButtonAllocator() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center px-[4.889px] py-[2.889px] relative rounded-[8px] shrink-0" data-name="Button - Allocator">
      <div aria-hidden="true" className="absolute border border-[#e6e6e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container12 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Container">
      <ButtonAllocator />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-center flex flex-wrap gap-[0px_4px] items-center pt-[4px] relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container7 />
      <Container9 />
      <Container11 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pt-[16px] px-[4px] relative size-full" data-name="Frame">
      <Container />
      <Container4 />
    </div>
  );
}