import svgPaths from "./svg-xk6orncbwl";
import imgBannerEuUkRowPng from "figma:asset/d6979d98aaadad94ad34b5dc9ec4545c6cc52a70.png";

function Svg() {
  return (
    <div className="absolute left-0 size-[64px] top-0" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
        <g clipPath="url(#clip0_183_42)" id="SVG">
          <path d={svgPaths.p1f8bd832} fill="var(--fill-0, #9898FF)" id="Vector" />
          <path d={svgPaths.p85d7000} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p27aa7480} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p1094b700} fill="var(--fill-0, white)" id="Vector_4" />
        </g>
        <defs>
          <clipPath id="clip0_183_42">
            <rect fill="white" height="64" width="64" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="h-[22px] relative shrink-0 w-[16px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 22">
        <g clipPath="url(#clip0_183_48)" id="SVG">
          <path d={svgPaths.pb169100} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p2f4eaf00} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_183_48">
            <rect fill="white" height="22" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.09px] whitespace-nowrap">
        <p className="leading-[16.8px]">Early Access on iOS</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#9898ff] content-stretch flex gap-[12px] h-[48px] items-center justify-center left-0 px-[24px] rounded-[50px] top-[258px]" data-name="Button">
      <Svg1 />
      <Container1 />
    </div>
  );
}

function Container() {
  return (
    <div className="-translate-y-1/2 absolute h-[306px] left-[100px] top-1/2 w-[383.61px]" data-name="Container">
      <Svg />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[54px] justify-center leading-[0] left-0 not-italic text-[#211d1d] text-[38.1px] top-[114.4px] tracking-[-0.8px] w-[383.81px]">
        <p className="leading-[54px] whitespace-pre-wrap">Savings for everyone.</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[72px] justify-center leading-[36px] left-0 not-italic text-[#636161] text-[24px] top-[185.6px] tracking-[-0.47px] w-[349.08px] whitespace-pre-wrap">
        <p className="mb-0">A completely new Savings App,</p>
        <p>powered by Aave.</p>
      </div>
      <Button />
    </div>
  );
}

function BannerEuUkRowPng() {
  return (
    <div className="-translate-y-1/2 absolute h-[485.49px] left-[561px] top-[calc(50%+84.96px)] w-[325px]" data-name="banner-eu-uk-row.png">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgBannerEuUkRowPng} />
      </div>
    </div>
  );
}

export default function Section() {
  return (
    <div className="bg-[rgba(152,150,255,0.1)] overflow-clip relative rounded-[16px] size-full" data-name="Section">
      <Container />
      <BannerEuUkRowPng />
    </div>
  );
}