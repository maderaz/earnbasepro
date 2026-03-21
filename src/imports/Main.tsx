import svgPaths from "./svg-5sphgk8nd6";
import imgLogoPng from "figma:asset/fd8f54cab23f8f4980041f4e74607cac0c7ab880.png";
import imgLogoPng1 from "figma:asset/e293d5d8d7db112a6eb2ff75af49c9ba75d96812.png";
import imgLogoPng2 from "figma:asset/46a65baa1b536f4785a9a5d9a4df0316c5b480e3.png";
import imgLogoPng3 from "figma:asset/8c443b28303afe073383f92dcc13b823a934710c.png";
import imgLogoPng4 from "figma:asset/805281212362da93ed0aa356821aa90934f44957.png";
import imgEthereumEthQ42025ActivityAndFinancialReport from "figma:asset/4de74dd5952e5a3cdd9af3ba25035124b1ef0ebf.png";
import imgEthereumVsSolanaAComparisonOfKeyMetrics from "figma:asset/1a0d6d0a3529b90f170927417c2b00dcf92d755c.png";
import imgTheBlock from "figma:asset/fda1b7d9824eaa9c260cde9e8560217b55510555.png";
import imgCointelegraph from "figma:asset/e6bd93e52066678362ec36c837a2d067552f505f.png";
import imgCoindesk from "figma:asset/41f6a1c24716d400bb161f05bd9c0069d9a2ff0e.png";
import { imgGroup } from "./svg-cs0t6";

function ItemLink() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Item → Link">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[16px]">Projects</p>
      </div>
    </div>
  );
}

function ItemSvg() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Item → SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Item â SVG">
          <path d={svgPaths.p21048200} fill="var(--fill-0, #737373)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path d={svgPaths.p2f4dd980} fill="var(--fill-0, #737373)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="absolute left-[1.4px] size-[11.2px] top-[1.4px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="SVG" opacity="0">
          <path d={svgPaths.p7741100} fill="var(--fill-0, #737373)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <Svg />
        <Svg1 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[-6px] p-px rounded-[8px] size-[32px] top-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container5 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="h-[32px] relative shrink-0 w-[26px]" data-name="Margin">
      <Button />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[7.99px] items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="leading-[16px]">Ethereum</p>
      </div>
      <Margin1 />
    </div>
  );
}

function Item() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Item">
      <Container4 />
    </div>
  );
}

function OrderedListBreadcrumbs() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Ordered List - Breadcrumbs">
      <ItemLink />
      <ItemSvg />
      <Item />
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="SVG">
          <path d={svgPaths.p1a9c3180} fill="var(--fill-0, #065F46)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(110,231,183,0.2)] relative rounded-[12px] shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[6px] py-px relative">
        <Svg2 />
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#065f46] text-[12px] whitespace-nowrap">
          <p className="leading-[20px]">Fresh</p>
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Latest: Feb 20, 2026</p>
        </div>
      </div>
    </div>
  );
}

function LinkViewChainStatusDetailsForEthereum() {
  return (
    <div className="content-stretch flex gap-[6px] h-[32px] items-center justify-center p-[6.593px] relative rounded-[8px] shrink-0" data-name="Link - View chain status details for ethereum">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Overlay />
      <Container6 />
    </div>
  );
}

function LinkViewChainStatusDetailsForEthereumMargin() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-[189.31px]" data-name="Link - View chain status details for ethereum:margin">
      <LinkViewChainStatusDetailsForEthereum />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <OrderedListBreadcrumbs />
      <LinkViewChainStatusDetailsForEthereumMargin />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start py-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container3 />
    </div>
  );
}

function LogoPng() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="logo.png">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgLogoPng} />
      </div>
    </div>
  );
}

function ImgAvatar() {
  return (
    <div className="bg-[rgba(23,23,23,0.1)] content-stretch flex items-center justify-center overflow-clip relative rounded-[9999px] shrink-0 size-[32px]" data-name="Img - Avatar">
      <LogoPng />
    </div>
  );
}

function ImgAvatarMargin() {
  return (
    <div className="absolute content-stretch flex flex-col h-[34px] items-start left-0 pt-[2px] top-0 w-[32px]" data-name="Img - Avatar:margin">
      <ImgAvatar />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.515px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[27px] tracking-[-0.75px] whitespace-nowrap">
        <p className="leading-[36px]">ETH</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[30px] tracking-[-0.75px] whitespace-nowrap">
        <p className="leading-[36px]">Ethereum</p>
      </div>
      <Container12 />
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p31bad480} fill="var(--fill-0, #06B6D4)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Button">
      <Svg3 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Button1 />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Blockchains (L1)</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-wrap items-start relative shrink-0 w-full" data-name="Container">
      <Link />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col items-start left-[44px] top-[-0.51px]" data-name="Container">
      <Container10 />
      <Container13 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[56px] relative shrink-0 w-[253.7px]" data-name="Container">
      <ImgAvatarMargin />
      <Container9 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <Container8 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[20px] relative shrink-0 w-full" data-name="Margin">
      <Container7 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Margin />
      <Margin2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[1560px] relative shrink-0 w-full" data-name="Container">
      <Container2 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center left-0 px-[180px] right-0 top-0" data-name="Container">
      <Container1 />
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex items-center pb-[12.963px] pt-[10px] relative self-stretch shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#262626] border-b-[2.963px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[0px] whitespace-nowrap">
        <p className="leading-[21px] text-[14px]">Overview</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex items-center pb-[12.963px] pt-[10px] relative self-stretch shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-[2.963px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[21px]">Ecosystem</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex items-center pb-[12.963px] pt-[10px] relative self-stretch shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-[2.963px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[21px]">Metrics</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex items-center pb-[12.963px] pt-[10px] relative self-stretch shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-[2.963px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[21px]">Financial statement</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
          <p className="leading-[21px]">Datasets</p>
        </div>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path d={svgPaths.p1d643b80} fill="var(--fill-0, #737373)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonMenu() {
  return (
    <div className="content-stretch flex gap-[6px] items-center pb-[12.96px] pt-[10px] relative shrink-0" data-name="Button menu">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-[2.963px] border-solid inset-0 pointer-events-none" />
      <Container17 />
      <Svg4 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[16px] items-start overflow-auto relative shrink-0 w-[1576px]" data-name="Container">
      <Link1 />
      <Link2 />
      <Link3 />
      <Link4 />
      <ButtonMenu />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[1560px] relative shrink-0 w-full" data-name="Container">
      <Container16 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center left-0 px-[180px] right-0 top-[148px]" data-name="Container">
      <Container15 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Price</p>
      </div>
      <div className="bg-[#10b981] rounded-[9999px] shrink-0 size-[6px]" data-name="Background" />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.71px] items-start left-0 top-0" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] uppercase whitespace-nowrap">
        <p className="leading-[32px]">$</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.71px] items-start left-[28.81px] top-0" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] uppercase whitespace-nowrap">
        <p className="leading-[32px]">,</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.71px] items-start left-[86.44px] top-0" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] uppercase whitespace-nowrap">
        <p className="leading-[32px]">.</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.7px] items-center left-0 right-[0.01px] top-0" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">0</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.71px] items-center left-0 right-[0.01px] top-[28.79px]" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">1</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute h-[287.96px] left-0 top-[-28.79px] w-[14.41px]" data-name="Container">
      <Container31 />
      <Container32 />
      <div className="absolute h-[28.8px] left-0 right-[0.01px] top-[57.59px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-[0.01px] top-[86.39px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-[0.01px] top-[115.18px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-[0.01px] top-[143.98px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-[0.01px] top-[172.77px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-[0.01px] top-[201.57px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-[0.01px] top-[230.37px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-[0.01px] top-[259.16px]" data-name="Rectangle" />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[28.8px] left-[14.41px] overflow-clip top-0 w-[14.41px]" data-name="Container">
      <Container30 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.7px] items-center left-0 right-0 top-[230.37px]" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">8</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.71px] items-center left-0 right-0 top-[259.16px]" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">9</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute h-[287.96px] left-0 top-[-259.16px] w-[14.41px]" data-name="Container">
      <div className="absolute h-[28.79px] left-0 right-0 top-0" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[28.79px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[57.59px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-0 top-[86.39px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[115.18px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-0 top-[143.98px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[172.77px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[201.57px]" data-name="Rectangle" />
      <Container35 />
      <Container36 />
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute h-[28.8px] left-[43.22px] overflow-clip top-0 w-[14.41px]" data-name="Container">
      <Container34 />
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.7px] items-center left-0 right-0 top-[201.58px]" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">7</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.71px] items-center left-0 right-0 top-[230.37px]" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">8</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute h-[287.96px] left-0 top-[-230.37px] w-[14.41px]" data-name="Container">
      <div className="absolute h-[28.8px] left-0 right-0 top-0" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[28.8px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-0 top-[57.6px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[86.39px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-0 top-[115.19px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[143.98px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[172.78px]" data-name="Rectangle" />
      <Container39 />
      <Container40 />
      <div className="absolute h-[28.8px] left-0 right-0 top-[259.17px]" data-name="Rectangle" />
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute h-[28.8px] left-[57.63px] overflow-clip top-0 w-[14.41px]" data-name="Container">
      <Container38 />
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.71px] items-center left-0 right-0 top-0" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">0</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute h-[287.96px] left-0 top-0 w-[14.41px]" data-name="Container">
      <Container43 />
      <div className="absolute h-[28.8px] left-0 right-0 top-[28.8px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[57.6px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[86.39px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[115.19px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[143.98px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[172.78px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[201.58px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[230.37px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[259.17px]" data-name="Rectangle" />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[28.8px] left-[72.04px] overflow-clip top-0 w-[14.41px]" data-name="Container">
      <Container42 />
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.7px] items-center left-0 right-0 top-[230.37px]" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">8</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.71px] items-center left-0 right-0 top-[259.16px]" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">9</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute h-[287.96px] left-0 top-[-259.16px] w-[14.41px]" data-name="Container">
      <div className="absolute h-[28.79px] left-0 right-0 top-0" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[28.79px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[57.59px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-0 top-[86.39px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[115.18px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-0 top-[143.98px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[172.77px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[201.57px]" data-name="Rectangle" />
      <Container46 />
      <Container47 />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute h-[28.8px] left-[100.85px] overflow-clip top-0 w-[14.41px]" data-name="Container">
      <Container45 />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.7px] items-center left-0 right-0 top-[28.8px]" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">1</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute content-stretch flex flex-col h-[31.71px] items-center left-0 right-0 top-[57.59px]" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[24px] text-center uppercase whitespace-nowrap">
        <p className="leading-[32px]">2</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute h-[287.96px] left-0 top-[-57.59px] w-[14.41px]" data-name="Container">
      <div className="absolute h-[28.8px] left-0 right-0 top-0" data-name="Rectangle" />
      <Container50 />
      <Container51 />
      <div className="absolute h-[28.8px] left-0 right-0 top-[86.39px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-0 top-[115.19px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[143.98px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-0 top-[172.78px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[201.57px]" data-name="Rectangle" />
      <div className="absolute h-[28.8px] left-0 right-0 top-[230.37px]" data-name="Rectangle" />
      <div className="absolute h-[28.79px] left-0 right-0 top-[259.17px]" data-name="Rectangle" />
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute h-[28.8px] left-[115.26px] overflow-clip top-0 w-[14.41px]" data-name="Container">
      <Container49 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[28.8px] relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container27 />
      <Container28 />
      <Container29 />
      <Container33 />
      <Container37 />
      <Container41 />
      <Container44 />
      <Container48 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Container25 />
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container23 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Key metrics</p>
      </div>
    </div>
  );
}

function LabelMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Label:margin">
      <Label />
    </div>
  );
}

function Link5() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Fully diluted market cap</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="absolute content-stretch flex items-center left-0 pb-[8.593px] pr-[8px] pt-[8px] right-[141.67px] top-0" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Link5 />
    </div>
  );
}

function Container53() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] text-right whitespace-nowrap">
          <p className="leading-[20px]">$237.5 B</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="absolute content-stretch flex items-center justify-end left-[178.33px] pb-[8.593px] pt-[8px] px-[8px] right-[66.93px] top-0" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Container53 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative">
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#dc2626] text-[12px] tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[18px]">-</p>
        </div>
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="content-stretch flex items-center px-[6.593px] py-px relative rounded-[12px] self-stretch shrink-0" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[rgba(38,38,38,0.07)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Margin4 />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#dc2626] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[18px]">33.3%</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative">
        <Border />
      </div>
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="absolute content-stretch flex items-center left-[253.07px] pb-[8.593px] pt-[8px] right-0 top-0" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Button2 />
    </div>
  );
}

function Link6() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[31.94px] relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[20px] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
          <p className="mb-0">Token trading volume</p>
          <p>(30d)</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder3() {
  return (
    <div className="absolute content-stretch flex items-center left-0 pb-[8.593px] pr-[8px] pt-[8px] right-[141.67px] top-[36.59px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Link6 />
    </div>
  );
}

function Container54() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] text-right whitespace-nowrap">
          <p className="leading-[20px]">$919.6 B</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder4() {
  return (
    <div className="absolute content-stretch flex items-center justify-end left-[178.33px] pb-[18.59px] pt-[18px] px-[8px] right-[66.93px] top-[36.59px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Container54 />
    </div>
  );
}

function Margin5() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative">
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#059669] text-[12px] tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[18px]">+</p>
        </div>
      </div>
    </div>
  );
}

function Border1() {
  return (
    <div className="content-stretch flex items-center px-[6.593px] py-px relative rounded-[12px] self-stretch shrink-0" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[rgba(38,38,38,0.07)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Margin5 />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#059669] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[18px]">47.5%</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative">
        <Border1 />
      </div>
    </div>
  );
}

function HorizontalBorder5() {
  return (
    <div className="absolute content-stretch flex items-center left-[253.07px] pb-[18.59px] pt-[17.595px] right-0 top-[36.59px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Button3 />
    </div>
  );
}

function Link7() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Fees (30d)</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder6() {
  return (
    <div className="absolute content-stretch flex items-center left-0 pb-[8.593px] pr-[8px] pt-[8px] right-[141.67px] top-[93.18px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Link7 />
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] text-right whitespace-nowrap">
          <p className="leading-[20px]">$18.6 M</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder7() {
  return (
    <div className="absolute content-stretch flex items-center justify-end left-[178.33px] pb-[8.593px] pt-[8px] px-[8px] right-[66.93px] top-[93.18px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Container55 />
    </div>
  );
}

function Margin6() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative">
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#059669] text-[12px] tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[18px]">+</p>
        </div>
      </div>
    </div>
  );
}

function Border2() {
  return (
    <div className="content-stretch flex items-center px-[6.593px] py-px relative rounded-[12px] self-stretch shrink-0" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[rgba(38,38,38,0.07)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Margin6 />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#059669] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[18px]">74.4%</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative">
        <Border2 />
      </div>
    </div>
  );
}

function HorizontalBorder8() {
  return (
    <div className="absolute content-stretch flex items-center left-[253.07px] pb-[8.593px] pt-[8px] right-0 top-[93.18px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Button4 />
    </div>
  );
}

function Link8() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Revenue (30d)</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder9() {
  return (
    <div className="absolute content-stretch flex items-center left-0 pb-[8.593px] pr-[8px] pt-[8px] right-[141.67px] top-[129.78px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Link8 />
    </div>
  );
}

function Container56() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] text-right whitespace-nowrap">
          <p className="leading-[20px]">$4.7 M</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder10() {
  return (
    <div className="absolute content-stretch flex items-center justify-end left-[178.33px] pb-[8.593px] pt-[8px] px-[8px] right-[66.93px] top-[129.78px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Container56 />
    </div>
  );
}

function Margin7() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative">
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#059669] text-[12px] tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[18px]">+</p>
        </div>
      </div>
    </div>
  );
}

function Border3() {
  return (
    <div className="content-stretch flex items-center px-[6.593px] py-px relative rounded-[12px] self-stretch shrink-0" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[rgba(38,38,38,0.07)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Margin7 />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#059669] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[18px]">194.2%</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative">
        <Border3 />
      </div>
    </div>
  );
}

function HorizontalBorder11() {
  return (
    <div className="absolute content-stretch flex items-center left-[253.07px] pb-[8.593px] pt-[8px] right-0 top-[129.78px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Button5 />
    </div>
  );
}

function Link9() {
  return (
    <div className="relative shrink-0" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[59.17px] relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[20px] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
          <p className="mb-0">Active addresses</p>
          <p>(monthly)</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder12() {
  return (
    <div className="absolute content-stretch flex items-center left-0 pb-[8.593px] pr-[8px] pt-[8px] right-[141.67px] top-[166.37px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Link9 />
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] text-right whitespace-nowrap">
          <p className="leading-[20px]">14.4 M</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder13() {
  return (
    <div className="absolute content-stretch flex items-center justify-end left-[178.33px] pb-[18.59px] pt-[18px] px-[8px] right-[66.93px] top-[166.37px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Container57 />
    </div>
  );
}

function Margin8() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-px relative">
        <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#059669] text-[12px] tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[18px]">+</p>
        </div>
      </div>
    </div>
  );
}

function Border4() {
  return (
    <div className="content-stretch flex items-center px-[6.593px] py-px relative rounded-[12px] self-stretch shrink-0" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[rgba(38,38,38,0.07)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Margin8 />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#059669] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[18px]">2.9%</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative">
        <Border4 />
      </div>
    </div>
  );
}

function HorizontalBorder14() {
  return (
    <div className="absolute content-stretch flex items-center left-[253.07px] pb-[18.59px] pt-[17.595px] right-0 top-[166.37px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <Button6 />
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[222.96px] relative shrink-0 w-full" data-name="Container">
      <HorizontalBorder />
      <HorizontalBorder1 />
      <HorizontalBorder2 />
      <HorizontalBorder3 />
      <HorizontalBorder4 />
      <HorizontalBorder5 />
      <HorizontalBorder6 />
      <HorizontalBorder7 />
      <HorizontalBorder8 />
      <HorizontalBorder9 />
      <HorizontalBorder10 />
      <HorizontalBorder11 />
      <HorizontalBorder12 />
      <HorizontalBorder13 />
      <HorizontalBorder14 />
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Link:margin">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1d4ed8] text-[14px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Explore all metrics</p>
      </div>
    </div>
  );
}

function LinkMarginAlignFlexStart() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link:margin:align-flex-start">
      <LinkMargin />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Margin3 />
      <LabelMargin />
      <Container52 />
      <LinkMarginAlignFlexStart />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Label">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Products</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Label1 />
    </div>
  );
}

function LogoPng1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="logo.png">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgLogoPng} />
      </div>
    </div>
  );
}

function ImgAvatar1() {
  return (
    <div className="bg-[rgba(23,23,23,0.1)] content-stretch flex items-center justify-center overflow-clip relative rounded-[9999px] shrink-0 size-[16px]" data-name="Img - Avatar">
      <LogoPng1 />
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Ethereum Beacon Chain</p>
      </div>
    </div>
  );
}

function Link10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <ImgAvatar1 />
          <Container60 />
        </div>
      </div>
    </div>
  );
}

function Border5() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Border">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <Link10 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(38,38,38,0.07)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col gap-[5.59px] items-start relative shrink-0 w-full" data-name="Container">
      <Container59 />
      <Border5 />
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[20px] relative shrink-0 text-[#737373] text-[14px] w-full whitespace-pre-wrap">
        <p className="mb-0">Ethereum is a smart contract platform for</p>
        <p className="mb-0">decentralized applications (a blockchain).</p>
        <p className="mb-0">Ethereum was founded by Vitalik Buterin,</p>
        <p className="mb-0">Anthony Di Iorio, Mihai Alisie, etc. and launched in</p>
        <p>2015.</p>
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_132_2569)" id="SVG">
          <path d={svgPaths.p328ffa40} fill="var(--fill-0, #0A0A0A)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_132_2569">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function LinkViewEthereumGovernanceLink() {
  return (
    <div className="bg-[rgba(23,23,23,0.04)] content-stretch flex items-center justify-center p-px relative rounded-[8px] shrink-0 size-[24px]" data-name="Link - View Ethereum Governance link">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Svg5 />
    </div>
  );
}

function Item1() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Item">
      <LinkViewEthereumGovernanceLink />
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_132_2566)" id="SVG">
          <path d={svgPaths.p31aad300} fill="var(--fill-0, #0A0A0A)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_132_2566">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function LinkViewEthereumGithubLink() {
  return (
    <div className="bg-[rgba(23,23,23,0.04)] content-stretch flex items-center justify-center p-px relative rounded-[8px] shrink-0 size-[24px]" data-name="Link - View Ethereum Github link">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Svg6 />
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Item">
      <LinkViewEthereumGithubLink />
    </div>
  );
}

function Svg7() {
  return (
    <div className="h-[14px] relative shrink-0 w-[12px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 14">
        <g id="SVG">
          <path d={svgPaths.p11c70700} fill="var(--fill-0, #0A0A0A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function LinkViewEthereumTwitterLink() {
  return (
    <div className="bg-[rgba(23,23,23,0.04)] content-stretch flex items-center justify-center p-px relative rounded-[8px] shrink-0 size-[24px]" data-name="Link - View Ethereum Twitter link">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Svg7 />
    </div>
  );
}

function Item3() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Item">
      <LinkViewEthereumTwitterLink />
    </div>
  );
}

function Svg8() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_132_2550)" id="SVG">
          <path d={svgPaths.pf86f300} fill="var(--fill-0, #0A0A0A)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_132_2550">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function LinkViewEthereumEtherscanLink() {
  return (
    <div className="bg-[rgba(23,23,23,0.04)] content-stretch flex items-center justify-center p-px relative rounded-[8px] shrink-0 size-[24px]" data-name="Link - View Ethereum Etherscan link">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Svg8 />
    </div>
  );
}

function Item4() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Item">
      <LinkViewEthereumEtherscanLink />
    </div>
  );
}

function Svg9() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_132_2555)" id="SVG">
          <path d={svgPaths.p3a59f400} fill="var(--fill-0, #0A0A0A)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_132_2555">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function LinkViewEthereumWebsiteLink() {
  return (
    <div className="bg-[rgba(23,23,23,0.04)] content-stretch flex items-center justify-center p-px relative rounded-[8px] shrink-0 size-[24px]" data-name="Link - View Ethereum Website link">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Svg9 />
    </div>
  );
}

function Item5() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Item">
      <LinkViewEthereumWebsiteLink />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="List">
      <Item1 />
      <Item2 />
      <Item3 />
      <Item4 />
      <Item5 />
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="Button">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1d4ed8] text-[14px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Learn more</p>
      </div>
    </div>
  );
}

function ButtonAlignFlexStart() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Button:align-flex-start">
      <Button7 />
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Container62 />
      <List />
      <ButtonAlignFlexStart />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Label">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Similar projects</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Label2 />
    </div>
  );
}

function LogoPng2() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="logo.png">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgLogoPng1} />
      </div>
    </div>
  );
}

function ImgAvatar2() {
  return (
    <div className="bg-[rgba(23,23,23,0.1)] relative rounded-[9999px] shrink-0 size-[16px]" data-name="Img - Avatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <LogoPng2 />
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Bitcoin</p>
        </div>
      </div>
    </div>
  );
}

function Link11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pb-[8.593px] pt-[8px] px-[8px] relative w-full">
          <ImgAvatar2 />
          <Container65 />
        </div>
      </div>
    </div>
  );
}

function LogoPng3() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="logo.png">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgLogoPng2} />
      </div>
    </div>
  );
}

function ImgAvatar3() {
  return (
    <div className="bg-[rgba(23,23,23,0.1)] relative rounded-[9999px] shrink-0 size-[16px]" data-name="Img - Avatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <LogoPng3 />
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">XRP</p>
        </div>
      </div>
    </div>
  );
}

function Link12() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pb-[8.593px] pt-[8px] px-[8px] relative w-full">
          <ImgAvatar3 />
          <Container66 />
        </div>
      </div>
    </div>
  );
}

function LogoPng4() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="logo.png">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgLogoPng3} />
      </div>
    </div>
  );
}

function ImgAvatar4() {
  return (
    <div className="bg-[rgba(23,23,23,0.1)] relative rounded-[9999px] shrink-0 size-[16px]" data-name="Img - Avatar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <LogoPng4 />
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">BNB Chain</p>
        </div>
      </div>
    </div>
  );
}

function Link13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-[rgba(38,38,38,0.07)] border-b-[0.593px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pb-[8.593px] pt-[8px] px-[8px] relative w-full">
          <ImgAvatar4 />
          <Container67 />
        </div>
      </div>
    </div>
  );
}

function LogoPng5() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="logo.png">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgLogoPng4} />
      </div>
    </div>
  );
}

function ImgAvatar5() {
  return (
    <div className="bg-[rgba(23,23,23,0.1)] content-stretch flex items-center justify-center overflow-clip relative rounded-[9999px] shrink-0 size-[16px]" data-name="Img - Avatar">
      <LogoPng5 />
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Solana</p>
      </div>
    </div>
  );
}

function Link14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <ImgAvatar5 />
          <Container68 />
        </div>
      </div>
    </div>
  );
}

function Border6() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Border">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <Link11 />
        <Link12 />
        <Link13 />
        <Link14 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(38,38,38,0.07)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col gap-[5.59px] items-start relative shrink-0 w-full" data-name="Container">
      <Container64 />
      <Border6 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative self-stretch shrink-0 w-[320px]" data-name="Container">
      <Container22 />
      <Container58 />
      <Container61 />
      <Container63 />
    </div>
  );
}

function Svg10() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path d={svgPaths.p1d643b80} fill="var(--fill-0, #0A0A0A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="content-stretch flex gap-[8px] h-[38px] items-center justify-center p-[8.593px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[18px] text-center tracking-[-0.45px] whitespace-nowrap">
        <p className="leading-[28px]">Active addresses (monthly)</p>
      </div>
      <Svg10 />
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Button8 />
    </div>
  );
}

function Svg11() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path d={svgPaths.p1d643b80} fill="var(--fill-0, #0A0A0A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonMenu1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[38px] items-center justify-center mr-[-0.01px] pl-[16.593px] pr-[14.593px] py-[8.593px] relative rounded-[8px] shrink-0" data-name="Button menu">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Last 3 years</p>
      </div>
      <Svg11 />
    </div>
  );
}

function Svg12() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path d={svgPaths.p1d643b80} fill="var(--fill-0, #0A0A0A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonMenu2() {
  return (
    <div className="content-stretch flex gap-[7.99px] h-[38px] items-center justify-center mr-[-0.01px] pl-[16.593px] pr-[14.593px] py-[8.593px] relative rounded-[8px] shrink-0" data-name="Button menu">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Weekly</p>
      </div>
      <Svg12 />
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0" data-name="Container">
      <ButtonMenu1 />
      <ButtonMenu2 />
    </div>
  );
}

function Svg13() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path d={svgPaths.p38669e80} fill="var(--fill-0, #0A0A0A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonMenuActions() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[8px] shrink-0 size-[38px]" data-name="Button menu - Actions">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Svg13 />
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex gap-px items-end relative shrink-0" data-name="Container">
      <Container74 />
      <ButtonMenuActions />
    </div>
  );
}

function Margin10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[266.25px]" data-name="Margin">
      <Container73 />
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[-10px] right-0 top-[-8px]" data-name="Container">
      <Container72 />
      <Margin10 />
    </div>
  );
}

function Margin9() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Margin">
      <Container71 />
    </div>
  );
}

function Margin12() {
  return (
    <div className="h-[10px] relative shrink-0 w-[8px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[2px] relative size-full">
        <div className="bg-[#30b584] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[-1px]" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[14px]">Ethereum</p>
      </div>
    </div>
  );
}

function Margin13() {
  return (
    <div className="h-[13px] relative shrink-0 w-full" data-name="Margin">
      <Container78 />
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist_Mono:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[20px] tracking-[-0.5px] w-full">
        <p className="leading-[28px] whitespace-pre-wrap">14.4 M</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Margin13 />
      <Container79 />
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[12px] w-full">
        <p className="leading-[12px] whitespace-pre-wrap">Latest</p>
      </div>
    </div>
  );
}

function Margin14() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2px] relative shrink-0 w-full" data-name="Margin">
      <Container80 />
    </div>
  );
}

function Container76() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <Container77 />
        <Margin14 />
      </div>
    </div>
  );
}

function Border7() {
  return (
    <div className="content-stretch flex gap-[8px] items-start p-px relative shrink-0" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <Margin12 />
      <Container76 />
    </div>
  );
}

function Img() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13.6px] pr-[19.59px] pt-[13.59px] relative self-stretch shrink-0" data-name="Img">
      <Border7 />
    </div>
  );
}

function Svg14() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="SVG">
          <path d={svgPaths.p86b90a0} fill="var(--fill-0, #737373)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container82() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[12px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Svg14 />
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start min-w-[120px] pb-[35.6px] pl-[14.59px] pr-[34.54px] pt-[12.59px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(38,38,38,0.07)] border-dashed inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Add metric</p>
      </div>
      <Container82 />
    </div>
  );
}

function Svg15() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="SVG">
          <path d={svgPaths.ped6a300} fill="var(--fill-0, #737373)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container83() {
  return (
    <div className="relative rounded-[9999px] shrink-0 size-[12px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Svg15 />
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start min-w-[120px] pb-[35.6px] pl-[14.593px] pr-[16.593px] pt-[12.59px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(38,38,38,0.07)] border-dashed inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Compare with</p>
      </div>
      <Container83 />
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative self-stretch shrink-0" data-name="Container">
      <Button9 />
      <Button10 />
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-start left-0 overflow-auto right-0 top-[4px]" data-name="Container">
      <Img />
      <Container81 />
    </div>
  );
}

function Margin11() {
  return (
    <div className="h-[76.19px] relative shrink-0 w-full" data-name="Margin">
      <Container75 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[10%_4.46%_8.8%_10.12%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 982.998 203">
        <g id="Group">
          <g id="Vector" />
          <g id="Vector_2" />
          <g id="Vector_3" />
          <g id="Vector_4" />
          <g id="Vector_5" />
          <g id="Vector_6" />
          <g id="Vector_7" />
          <g id="Vector_8" />
          <g id="Vector_9" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[9.8%_0.42%_8.6%_4%]" data-name="Group">
      <div className="absolute inset-[-0.25%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1100 205">
          <g id="Group">
            <path d="M0 204.5H1100" id="Vector" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
            <path d="M0 153.5H1100" id="Vector_2" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
            <path d="M0 103.5H1100" id="Vector_3" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
            <path d="M9.91821e-05 52.5H1100" id="Vector_4" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
            <path d="M9.91821e-05 0.5H1100" id="Vector_5" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[91.2%_0.42%_4.8%_4%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1100 10">
        <g id="Group">
          <path d="M70.4998 0V10" id="Vector" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
          <path d="M193.5 0V10" id="Vector_2" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
          <path d="M316.499 0V10" id="Vector_3" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
          <path d="M438.499 0V10" id="Vector_4" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
          <path d="M562.499 0V10" id="Vector_5" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
          <path d="M685.499 0V10" id="Vector_6" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
          <path d="M806.498 0V10" id="Vector_7" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
          <path d="M930.498 0V10" id="Vector_8" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
          <path d="M1053.5 0V10" id="Vector_9" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
          <path d="M0 0.5H1100" id="Vector_10" stroke="var(--stroke-0, #262626)" strokeOpacity="0.04" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[10%_96%_8.8%_4%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0 203">
        <g id="Group">
          <g id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[29.47%_0.42%_26.83%_4%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-48.685px] mask-size-[1099.998px_203px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-0.92%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1102 111.233">
          <g id="Group">
            <path d={svgPaths.p3e962c80} id="Vector" stroke="var(--stroke-0, #30B584)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <g id="Vector_2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[10%_0.42%_8.8%_4%]" data-name="Clip path group">
      <Group5 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[10%_0.42%_8.8%_4%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents font-['Inter:Regular',sans-serif] font-normal inset-[94.4%_2.27%_-0.4%_7.87%] leading-[normal] not-italic text-[#737373] text-[12px] text-center" data-name="Group">
      <p className="absolute inset-[94.4%_66.26%_-0.4%_29.4%]">01/01/24</p>
      <p className="absolute inset-[94.4%_34.22%_-0.4%_61.43%]">01/01/25</p>
      <p className="absolute inset-[94.4%_2.27%_-0.4%_93.38%]">01/01/26</p>
      <p className="absolute inset-[94.4%_87.62%_-0.4%_7.87%]">05/01/23</p>
      <p className="absolute inset-[94.4%_76.85%_-0.4%_18.63%]">09/01/23</p>
      <p className="absolute inset-[94.4%_55.58%_-0.4%_39.9%]">05/01/24</p>
      <p className="absolute inset-[94.4%_44.81%_-0.4%_50.67%]">09/01/24</p>
      <p className="absolute inset-[94.4%_23.67%_-0.4%_71.89%]">05/01/25</p>
      <p className="absolute inset-[94.4%_12.86%_-0.4%_82.62%]">09/01/25</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents font-['Inter:Regular',sans-serif] font-normal inset-[6.8%_97.31%_6%_0.17%] leading-[normal] not-italic text-[#737373] text-[12px] text-right" data-name="Group">
      <p className="absolute inset-[88%_97.31%_6%_2%]">0</p>
      <p className="absolute inset-[67.6%_97.31%_26.4%_0.78%]">5 m</p>
      <p className="absolute inset-[47.6%_97.31%_46.4%_0.35%]">10 m</p>
      <p className="absolute inset-[27.2%_97.31%_66.8%_0.35%]">15 m</p>
      <p className="absolute inset-[6.8%_97.31%_87.2%_0.17%]">20 m</p>
    </div>
  );
}

function Img1() {
  return (
    <div className="absolute h-[250px] left-[-5px] overflow-clip top-0 w-[1150.81px]" data-name="Img">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Vector" />
      </svg>
      <div className="absolute inset-[10%_0.42%_8.8%_4%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[10%_0.42%_8.8%_4%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Vector" />
        </svg>
      </div>
      <Group />
      <Group1 />
      <Group2 />
      <Group3 />
      <Group4 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[8.4%_50.04%_84%_49.96%] leading-[normal] not-italic text-[#333] text-[16px] text-center">&nbsp;</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[10.8%_50.04%_83.2%_49.96%] leading-[normal] not-italic text-[#666] text-[12px] text-center">&nbsp;</p>
      <p className="absolute bottom-[-6%] font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[0.43%] not-italic right-[99.57%] text-[#666] text-[12px] top-full">&nbsp;</p>
      <Group6 />
      <Group7 />
    </div>
  );
}

function Svg16() {
  return (
    <div className="-translate-y-1/2 absolute h-[70px] left-[36.97%] opacity-40 overflow-clip right-[36.97%] top-1/2" data-name="SVG">
      <div className="absolute inset-[27.74%_78.7%_27.84%_0]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 63.8947 31.0923">
          <path d={svgPaths.p2fee43f0} fill="var(--fill-0, #737373)" fillOpacity="0.4" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[27.74%_0.02%_27.84%_21.22%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 236.286 31.0927">
          <path d={svgPaths.p39582500} fill="var(--fill-0, #737373)" fillOpacity="0.4" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Container">
      <Img1 />
      <Svg16 />
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex flex-col h-[250px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container85 />
    </div>
  );
}

function Margin15() {
  return (
    <div className="content-stretch flex flex-col h-[282px] items-start pt-[32px] relative shrink-0 w-full" data-name="Margin">
      <Container84 />
    </div>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[22.63px] relative w-full">
        <Margin9 />
        <Margin11 />
        <Margin15 />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-white min-h-[460px] relative rounded-[16px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(38,38,38,0.07)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center min-h-[inherit] p-[24.593px] relative w-full">
          <Container70 />
        </div>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[16px] tracking-[-0.4px] w-full">
        <p className="leading-[24px] whitespace-pre-wrap">Analyst coverage</p>
      </div>
    </div>
  );
}

function EthereumEthQ42025ActivityAndFinancialReport() {
  return (
    <div className="max-w-[588px] relative rounded-[4px] shrink-0 size-[20px]" data-name="Ethereum (ETH): Q4 2025 Activity and Financial Report">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[4px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgEthereumEthQ42025ActivityAndFinancialReport} />
      </div>
    </div>
  );
}

function ImgEthereumEthQ42025ActivityAndFinancialReportMargin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[596px] p-[4px] relative shrink-0 size-[28px]" data-name="Img - Ethereum (ETH): Q4 2025 Activity and Financial Report  :margin">
      <EthereumEthQ42025ActivityAndFinancialReport />
    </div>
  );
}

function Container91() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Ethereum (ETH): Q4 2025 Activity and Financial Report</p>
      </div>
    </div>
  );
}

function Container92() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[20px] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="mb-0">The key takeaways on Ethereum (ETH) in Q4 2025. A concise and fast-read report</p>
        <p>analyzing financial performance, institutional dynamics (ETFs vs. treasuries), on-…</p>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="content-stretch flex flex-col items-start min-w-[532px] relative self-stretch shrink-0" data-name="Container">
      <Container91 />
      <Container92 />
    </div>
  );
}

function Link15() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="content-stretch flex gap-[12px] items-start p-[8px] relative w-full">
        <ImgEthereumEthQ42025ActivityAndFinancialReportMargin />
        <Container90 />
      </div>
    </div>
  );
}

function EthereumVsSolanaAComparisonOfKeyMetrics() {
  return (
    <div className="max-w-[588px] relative rounded-[4px] shrink-0 size-[20px]" data-name="Ethereum vs. Solana | A comparison of key metrics">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[4px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgEthereumVsSolanaAComparisonOfKeyMetrics} />
      </div>
    </div>
  );
}

function ImgEthereumVsSolanaAComparisonOfKeyMetricsMargin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[596px] p-[4px] relative shrink-0 size-[28px]" data-name="Img - Ethereum vs. Solana | A comparison of key metrics:margin">
      <EthereumVsSolanaAComparisonOfKeyMetrics />
    </div>
  );
}

function Container94() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Ethereum vs. Solana | A comparison of key metrics</p>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">{`Key financial, usage, and valuation metrics for Ethereum & Solana`}</p>
      </div>
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <Container94 />
      <Container95 />
    </div>
  );
}

function Link16() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="content-stretch flex gap-[12px] items-start p-[8px] relative w-full">
        <ImgEthereumVsSolanaAComparisonOfKeyMetricsMargin />
        <Container93 />
      </div>
    </div>
  );
}

function TheSilentWinnersOf2025PaxosSteakhouseFinancial() {
  return (
    <div className="max-w-[588px] relative rounded-[4px] shrink-0 size-[20px]" data-name="The silent winners of 2025: Paxos & Steakhouse Financial">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[4px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgEthereumVsSolanaAComparisonOfKeyMetrics} />
      </div>
    </div>
  );
}

function ImgTheSilentWinnersOf2025PaxosSteakhouseFinancialMargin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[596px] p-[4px] relative shrink-0 size-[28px]" data-name="Img - The silent winners of 2025: Paxos & Steakhouse Financial:margin">
      <TheSilentWinnersOf2025PaxosSteakhouseFinancial />
    </div>
  );
}

function Container97() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">{`The silent winners of 2025: Paxos & Steakhouse Financial`}</p>
      </div>
    </div>
  );
}

function Container98() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">The Snapshot | January 15, 2026</p>
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <Container97 />
      <Container98 />
    </div>
  );
}

function Link17() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="content-stretch flex gap-[12px] items-start p-[8px] relative w-full">
        <ImgTheSilentWinnersOf2025PaxosSteakhouseFinancialMargin />
        <Container96 />
      </div>
    </div>
  );
}

function DoesEthereumHaveAStablecoinMoat() {
  return (
    <div className="max-w-[588px] relative rounded-[4px] shrink-0 size-[20px]" data-name="Does Ethereum have a stablecoin moat?">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[4px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgEthereumVsSolanaAComparisonOfKeyMetrics} />
      </div>
    </div>
  );
}

function ImgDoesEthereumHaveAStablecoinMoatMargin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[596px] p-[4px] relative shrink-0 size-[28px]" data-name="Img - Does Ethereum have a stablecoin moat?:margin">
      <DoesEthereumHaveAStablecoinMoat />
    </div>
  );
}

function Container100() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Does Ethereum have a stablecoin moat?</p>
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">The Snapshot | January 8, 2026</p>
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <Container100 />
      <Container101 />
    </div>
  );
}

function Link18() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="content-stretch flex gap-[12px] items-start p-[8px] relative w-full">
        <ImgDoesEthereumHaveAStablecoinMoatMargin />
        <Container99 />
      </div>
    </div>
  );
}

function Link19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative self-stretch" data-name="Link">
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#1d4ed8] text-[14px]">
        <p className="leading-[20px] whitespace-pre-wrap">Explore all related coverage</p>
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <Link19 />
    </div>
  );
}

function Margin16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="content-stretch flex flex-col items-start pl-[48px] py-[16px] relative w-full">
        <Container102 />
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="content-stretch flex flex-col gap-px items-start relative shrink-0 w-full" data-name="Container">
      <Link15 />
      <Link16 />
      <Link17 />
      <Link18 />
      <Margin16 />
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start max-w-[600px] min-h-px min-w-px relative self-stretch" data-name="Container">
      <Container88 />
      <Container89 />
    </div>
  );
}

function Container104() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[16px] tracking-[-0.4px] w-full">
        <p className="leading-[24px] whitespace-pre-wrap">In the news</p>
      </div>
    </div>
  );
}

function TheBlock() {
  return (
    <div className="max-w-[588px] relative rounded-[4px] shrink-0 size-[20px]" data-name="The Block">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[4px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgTheBlock} />
      </div>
    </div>
  );
}

function ImgTheBlockMargin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[596px] p-[4px] relative shrink-0 size-[28px]" data-name="Img - The Block:margin">
      <TheBlock />
    </div>
  );
}

function Container107() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">BNP Paribas taps Ethereum for new money market fund tokenization pilot</p>
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">The Block</p>
      </div>
    </div>
  );
}

function Container110() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">•</p>
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">1d ago</p>
      </div>
    </div>
  );
}

function Container108() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Container">
      <Container109 />
      <Container110 />
      <Container111 />
    </div>
  );
}

function Container106() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <Container107 />
      <Container108 />
    </div>
  );
}

function Link20() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="content-stretch flex gap-[12px] items-start p-[8px] relative w-full">
        <ImgTheBlockMargin />
        <Container106 />
      </div>
    </div>
  );
}

function TheBlock1() {
  return (
    <div className="max-w-[588px] relative rounded-[4px] shrink-0 size-[20px]" data-name="The Block">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[4px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgTheBlock} />
      </div>
    </div>
  );
}

function ImgTheBlockMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[596px] p-[4px] relative shrink-0 size-[28px]" data-name="Img - The Block:margin">
      <TheBlock1 />
    </div>
  );
}

function Container113() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[20px] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="mb-0">{`Vitalik Buterin is building a ‘cypherpunk principled non-ugly Ethereum' as devs`}</p>
        <p>officially add FOCIL to upgrade roadmap</p>
      </div>
    </div>
  );
}

function Container115() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">The Block</p>
      </div>
    </div>
  );
}

function Container116() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">•</p>
      </div>
    </div>
  );
}

function Container117() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">1d ago</p>
      </div>
    </div>
  );
}

function Container114() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Container">
      <Container115 />
      <Container116 />
      <Container117 />
    </div>
  );
}

function Container112() {
  return (
    <div className="content-stretch flex flex-col items-start min-w-[532px] relative self-stretch shrink-0" data-name="Container">
      <Container113 />
      <Container114 />
    </div>
  );
}

function Link21() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="content-stretch flex gap-[12px] items-start p-[8px] relative w-full">
        <ImgTheBlockMargin1 />
        <Container112 />
      </div>
    </div>
  );
}

function Cointelegraph() {
  return (
    <div className="max-w-[588px] relative rounded-[4px] shrink-0 size-[20px]" data-name="Cointelegraph">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[4px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgCointelegraph} />
      </div>
    </div>
  );
}

function ImgCointelegraphMargin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[596px] p-[4px] relative shrink-0 size-[28px]" data-name="Img - Cointelegraph:margin">
      <Cointelegraph />
    </div>
  );
}

function Container119() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Price predictions 2/20: BTC, ETH, XRP, BNB, SOL, DOGE, BCH, ADA, HYPE, XMR</p>
      </div>
    </div>
  );
}

function Container121() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Cointelegraph</p>
      </div>
    </div>
  );
}

function Container122() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">•</p>
      </div>
    </div>
  );
}

function Container123() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">1d ago</p>
      </div>
    </div>
  );
}

function Container120() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Container">
      <Container121 />
      <Container122 />
      <Container123 />
    </div>
  );
}

function Container118() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <Container119 />
      <Container120 />
    </div>
  );
}

function Link22() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="content-stretch flex gap-[12px] items-start p-[8px] relative w-full">
        <ImgCointelegraphMargin />
        <Container118 />
      </div>
    </div>
  );
}

function Coindesk() {
  return (
    <div className="max-w-[588px] relative rounded-[4px] shrink-0 size-[20px]" data-name="Coindesk">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[4px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgCoindesk} />
      </div>
    </div>
  );
}

function ImgCoindeskMargin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[596px] p-[4px] relative shrink-0 size-[28px]" data-name="Img - Coindesk:margin">
      <Coindesk />
    </div>
  );
}

function Container125() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Dual South Korean listings send Ethereum layer-2 token AZTEC surging 82%</p>
      </div>
    </div>
  );
}

function Container127() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Coindesk</p>
      </div>
    </div>
  );
}

function Container128() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">•</p>
      </div>
    </div>
  );
}

function Container129() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#737373] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">1d ago</p>
      </div>
    </div>
  );
}

function Container126() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full" data-name="Container">
      <Container127 />
      <Container128 />
      <Container129 />
    </div>
  );
}

function Container124() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <Container125 />
      <Container126 />
    </div>
  );
}

function Link23() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="content-stretch flex gap-[12px] items-start p-[8px] relative w-full">
        <ImgCoindeskMargin />
        <Container124 />
      </div>
    </div>
  );
}

function Container105() {
  return (
    <div className="content-stretch flex flex-col gap-px items-start relative shrink-0 w-full" data-name="Container">
      <Link20 />
      <Link21 />
      <Link22 />
      <Link23 />
    </div>
  );
}

function Button11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1d4ed8] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">See all</p>
      </div>
    </div>
  );
}

function Container130() {
  return (
    <div className="content-stretch flex items-start pt-[3.78px] relative shrink-0 w-[540px]" data-name="Container">
      <Button11 />
    </div>
  );
}

function Container103() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-end max-w-[600px] min-h-px min-w-px relative self-stretch" data-name="Container">
      <Container104 />
      <Container105 />
      <Container130 />
    </div>
  );
}

function Container86() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container87 />
      <Container103 />
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[40px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <BackgroundBorder />
      <Container86 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <Container21 />
      <Container69 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[1560px] relative shrink-0 w-full" data-name="Container">
      <Container20 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-center left-0 px-[180px] right-0 top-[224.96px]" data-name="Container">
      <Container19 />
    </div>
  );
}

export default function Main() {
  return (
    <div className="relative size-full" data-name="Main">
      <Container />
      <Container14 />
      <div className="absolute bg-[rgba(38,38,38,0.07)] h-px left-0 right-0 top-[191.96px]" data-name="Horizontal Divider" />
      <Container18 />
    </div>
  );
}