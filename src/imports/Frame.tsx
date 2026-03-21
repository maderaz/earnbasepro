import svgPaths from "./svg-rah5sff3bu";
import { imgGroup } from "./svg-ndd4w";

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#141414] text-[20px] w-full">
        <p className="leading-[32px] whitespace-pre-wrap">Parameters</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Market Address</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.73px] relative" data-name="Container">
      <Container5 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container4 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[84.5px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.33px] text-[#30313e] text-[13px] text-right top-[9.77px] w-[84.83px]">
        <p className="leading-[20px] whitespace-pre-wrap">0xf5d3...8f97</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.p25f84500} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p1784a780} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ButtonCopied() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button - Copied">
      <Svg />
    </div>
  );
}

function Svg1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.p1fa94f00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p39bce5f0} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button">
      <Svg1 />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0" data-name="Link">
      <Button />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <ButtonCopied />
      <Link />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative self-stretch shrink-0" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin />
      <Container6 />
    </div>
  );
}

function Separator() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Underlying Asset</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #BEBECE)" id="Vector_2" />
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

function Frame1() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup />
    </div>
  );
}

function SvgTheErc20TokenUsedForAllTransactionsInTheMarketSuchAsWrappedEtherWethOrUsdc() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - The ERC-20 token used for all transactions in the market, such as Wrapped Ether (WETH) or USDC.">
      <Frame1 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container11 />
      <SvgTheErc20TokenUsedForAllTransactionsInTheMarketSuchAsWrappedEtherWethOrUsdc />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container10 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[165.78px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-1.23px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[167.01px]">
        <p className="leading-[20px] whitespace-pre-wrap">Tether USD (0xdac1...1ec7)</p>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.p25f84500} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p1784a780} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ButtonCopied1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button - Copied">
      <Svg2 />
    </div>
  );
}

function Svg3() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.p1fa94f00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p39bce5f0} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button">
      <Svg3 />
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0" data-name="Link">
      <Button1 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <ButtonCopied1 />
      <Link1 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative self-stretch shrink-0" data-name="Container">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin1 />
      <Container12 />
    </div>
  );
}

function Separator1() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin1() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator1 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Market Token</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container17 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container16 />
    </div>
  );
}

function HyperithmWildcatTetherUsd() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[185px]" data-name="Hyperithm Wildcat Tether USD">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[0.64px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[184.363px]">
        <p className="leading-[20px] whitespace-pre-wrap">Hyperithm Wildcat Tether U…</p>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.p25f84500} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p1784a780} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ButtonCopied2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button - Copied">
      <Svg4 />
    </div>
  );
}

function Svg5() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.p1fa94f00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p39bce5f0} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button">
      <Svg5 />
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0" data-name="Link">
      <Button2 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <ButtonCopied2 />
      <Link2 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative self-stretch shrink-0" data-name="Container">
      <HyperithmWildcatTetherUsd />
      <Container19 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin2 />
      <Container18 />
    </div>
  );
}

function Separator2() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin2() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator2 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Market Token Symbol</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container22 />
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container21 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[118.32px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.38px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[118.703px]">
        <p className="leading-[20px] whitespace-pre-wrap">hyperWildcatUSDT</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container24 />
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative w-full">
        <Margin3 />
        <Container23 />
      </div>
    </div>
  );
}

function Separator3() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin3() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator3 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Max. Borrowing Capacity</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #BEBECE)" id="Vector_2" />
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

function Frame2() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup1 />
    </div>
  );
}

function SvgTheMaximumLimitOfFundsThatBorrowersCanAccessInTheMarket() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - The maximum limit of funds that borrowers can access in the market.">
      <Frame2 />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[6.01px] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container27 />
      <SvgTheMaximumLimitOfFundsThatBorrowersCanAccessInTheMarket />
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container26 />
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[109.57px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.37px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[109.94px]">
        <p className="leading-[20px] whitespace-pre-wrap">10,000,000 USDT</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container29 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative w-full">
        <Margin4 />
        <Container28 />
      </div>
    </div>
  );
}

function Separator4() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin4() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator4 />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Total Interest Accrued</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.73px] relative" data-name="Container">
      <Container32 />
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container31 />
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[128.07px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.4px] text-[#30313e] text-[13px] text-right top-[9.77px] w-[128.469px]">
        <p className="leading-[20px] whitespace-pre-wrap">95,446.28688 USDT</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container34 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between relative w-full">
        <Margin5 />
        <Container33 />
      </div>
    </div>
  );
}

function Separator5() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin5() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator5 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Minimum Deposit</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container37 />
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container36 />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[33.14px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.3px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[33.44px]">
        <p className="leading-[20px] whitespace-pre-wrap">None</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container39 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin6 />
      <Container38 />
    </div>
  );
}

function Separator6() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin6() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator6 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Market Type</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container42 />
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container41 />
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[68.75px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.31px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[69.056px]">
        <p className="leading-[20px] whitespace-pre-wrap">Open Term</p>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #D7A820)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #D7A820)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup2() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup2 />
    </div>
  );
}

function SvgWithdrawalRequestsArePossibleAtAnyTime() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - Withdrawal requests are possible at any time.">
      <Frame3 />
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container44 />
      <SvgWithdrawalRequestsArePossibleAtAnyTime />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin7 />
      <Container43 />
    </div>
  );
}

function Separator7() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin7() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator7 />
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Deposit Access</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container47 />
    </div>
  );
}

function Margin8() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container46 />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[63.17px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.78px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[63.953px]">
        <p className="leading-[20px] whitespace-pre-wrap">Restricted</p>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #D7A820)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #D7A820)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup3() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group3 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup3 />
    </div>
  );
}

function SvgLendersMustMeetSpecificCriteriaToLendToThisMarket() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - Lenders must meet specific criteria to lend to this market.">
      <Frame4 />
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex gap-[3.99px] items-center pr-[4.01px] relative self-stretch shrink-0" data-name="Container">
      <Container49 />
      <SvgLendersMustMeetSpecificCriteriaToLendToThisMarket />
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin8 />
      <Container48 />
    </div>
  );
}

function Separator8() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin8() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator8 />
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Withdrawal Access</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container52 />
    </div>
  );
}

function Margin9() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container51 />
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[63.17px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.78px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[63.953px]">
        <p className="leading-[20px] whitespace-pre-wrap">Restricted</p>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #D7A820)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #D7A820)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup4() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group4 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup4 />
    </div>
  );
}

function SvgLendersWhoHaveNotDirectlyDepositedMustMeetSpecificCriteriaToWithdraw() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - Lenders who have not directly deposited must meet specific criteria to withdraw.">
      <Frame5 />
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex gap-[3.99px] items-center pr-[4.01px] relative self-stretch shrink-0" data-name="Container">
      <Container54 />
      <SvgLendersWhoHaveNotDirectlyDepositedMustMeetSpecificCriteriaToWithdraw />
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin9 />
      <Container53 />
    </div>
  );
}

function Separator9() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin9() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator9 />
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Policy (Hook Instance) Address</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.73px] relative" data-name="Container">
      <Container57 />
    </div>
  );
}

function Margin10() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container56 />
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[85.5px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.86px] text-[#30313e] text-[13px] text-right top-[9.77px] w-[86.36px]">
        <p className="leading-[20px] whitespace-pre-wrap">0x758e...acfe</p>
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.p25f84500} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p1784a780} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ButtonCopied3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button - Copied">
      <Svg6 />
    </div>
  );
}

function Svg7() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path clipRule="evenodd" d={svgPaths.p1fa94f00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p39bce5f0} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Button">
      <Svg7 />
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0" data-name="Link">
      <Button3 />
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <ButtonCopied3 />
      <Link3 />
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative self-stretch shrink-0" data-name="Container">
      <Container59 />
      <Container60 />
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin10 />
      <Container58 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative self-stretch" data-name="Container">
      <Container3 />
      <SeparatorMargin />
      <Container9 />
      <SeparatorMargin1 />
      <Container15 />
      <SeparatorMargin2 />
      <Container20 />
      <SeparatorMargin3 />
      <Container25 />
      <SeparatorMargin4 />
      <Container30 />
      <SeparatorMargin5 />
      <Container35 />
      <SeparatorMargin6 />
      <Container40 />
      <SeparatorMargin7 />
      <Container45 />
      <SeparatorMargin8 />
      <Container50 />
      <SeparatorMargin9 />
      <Container55 />
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Minimum Reserve Ratio</p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #BEBECE)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup5() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group5 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup5 />
    </div>
  );
}

function SvgARequiredPercentageOfMarketFundsThatMustRemainLiquidAndUnavailableForBorrowing() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - A required percentage of market funds that must remain liquid and unavailable for borrowing.">
      <Frame6 />
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-h-px min-w-px pb-[0.73px] relative" data-name="Container">
      <Container64 />
      <SvgARequiredPercentageOfMarketFundsThatMustRemainLiquidAndUnavailableForBorrowing />
    </div>
  );
}

function Margin11() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container63 />
    </div>
  );
}

function Container66() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[21.31px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.33px] text-[#30313e] text-[13px] text-right top-[9.77px] w-[21.637px]">
        <p className="leading-[20px] whitespace-pre-wrap">0%</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container66 />
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin11 />
      <Container65 />
    </div>
  );
}

function Separator10() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin10() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator10 />
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Base Lender APR</p>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #BEBECE)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup6() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup6 />
    </div>
  );
}

function SvgTheFixedAnnualPercentageRateExcludingAnyProtocolFeesThatBorrowersPayToLendersForAssetsWithinTheMarket() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - The fixed annual percentage rate (excluding any protocol fees) that borrowers pay to lenders for assets within the market.">
      <Frame7 />
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container69 />
      <SvgTheFixedAnnualPercentageRateExcludingAnyProtocolFeesThatBorrowersPayToLendersForAssetsWithinTheMarket />
    </div>
  );
}

function Margin12() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container68 />
    </div>
  );
}

function Container71() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[26.32px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.36px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[26.678px]">
        <p className="leading-[20px] whitespace-pre-wrap">12%</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container71 />
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin12 />
      <Container70 />
    </div>
  );
}

function Separator11() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin11() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator11 />
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Protocol Fee APR</p>
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #BEBECE)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup7() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group7 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup7 />
    </div>
  );
}

function SvgAnAdditionalAprThatAccruesToTheProtocolBySlowlyIncreasingRequiredReservesDerivedByTheFeeConfigurationOfTheProtocolAsAPercentageOfTheCurrentBaseApr() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - An additional APR that accrues to the protocol by slowly increasing required reserves. Derived by the fee configuration of the protocol as a percentage of the current base APR.">
      <Frame8 />
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[5.99px] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container74 />
      <SvgAnAdditionalAprThatAccruesToTheProtocolBySlowlyIncreasingRequiredReservesDerivedByTheFeeConfigurationOfTheProtocolAsAPercentageOfTheCurrentBaseApr />
    </div>
  );
}

function Margin13() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container73 />
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[32.74px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.4px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[33.138px]">
        <p className="leading-[20px] whitespace-pre-wrap">0.6%</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container76 />
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin13 />
      <Container75 />
    </div>
  );
}

function Separator12() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin12() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator12 />
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Effective Lender APR</p>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #BEBECE)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup8() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group8 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup8 />
    </div>
  );
}

function SvgTheCurrentInterestRateBeingPaidToLendersTheBaseAprPlusPenaltyAprIfApplicable() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - The current interest rate being paid to lenders: the base APR plus penalty APR if applicable.">
      <Frame9 />
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[5.99px] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container79 />
      <SvgTheCurrentInterestRateBeingPaidToLendersTheBaseAprPlusPenaltyAprIfApplicable />
    </div>
  );
}

function Margin14() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container78 />
    </div>
  );
}

function Container81() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[26.32px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.36px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[26.678px]">
        <p className="leading-[20px] whitespace-pre-wrap">12%</p>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container81 />
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin14 />
      <Container80 />
    </div>
  );
}

function Separator13() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin13() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator13 />
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Penalty APR</p>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #BEBECE)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup9() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group9 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup9 />
    </div>
  );
}

function SvgAnAdditionalInterestRateChargedIfTheMarketRemainsDelinquentFailingToMaintainRequiredReservesAfterTheGracePeriodHasElapsed() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - An additional interest rate charged if the market remains delinquent—failing to maintain required reserves—after the grace period has elapsed.">
      <Frame10 />
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container84 />
      <SvgAnAdditionalInterestRateChargedIfTheMarketRemainsDelinquentFailingToMaintainRequiredReservesAfterTheGracePeriodHasElapsed />
    </div>
  );
}

function Margin15() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container83 />
    </div>
  );
}

function Container86() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[20.75px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.32px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[21.073px]">
        <p className="leading-[20px] whitespace-pre-wrap">5%</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container86 />
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin15 />
      <Container85 />
    </div>
  );
}

function Separator14() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin14() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator14 />
    </div>
  );
}

function Container89() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Maximum Grace Period</p>
      </div>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #BEBECE)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup10() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group10 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup10 />
    </div>
  );
}

function SvgTheDurationBorrowersHaveToResolveReserveDeficienciesOrCorrectDelinquencyInTheMarketBeforePenaltiesTakeEffect() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - The duration borrowers have to resolve reserve deficiencies or correct delinquency in the market before penalties take effect.">
      <Frame11 />
    </div>
  );
}

function Container88() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-h-px min-w-px pb-[0.73px] relative" data-name="Container">
      <Container89 />
      <SvgTheDurationBorrowersHaveToResolveReserveDeficienciesOrCorrectDelinquencyInTheMarketBeforePenaltiesTakeEffect />
    </div>
  );
}

function Margin16() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container88 />
    </div>
  );
}

function Container91() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[60.74px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.76px] text-[#30313e] text-[13px] text-right top-[9.77px] w-[61.5px]">
        <p className="leading-[20px] whitespace-pre-wrap">168 hours</p>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container91 />
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin16 />
      <Container90 />
    </div>
  );
}

function Separator15() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin15() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator15 />
    </div>
  );
}

function Container94() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Available Grace Period</p>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #BEBECE)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup11() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group11 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup11 />
    </div>
  );
}

function SvgThePortionOfTheGracePeriodLeftForBorrowersToFixNonComplianceIssuesSuchAsRestoringReserves() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - The portion of the grace period left for borrowers to fix non-compliance issues, such as restoring reserves.">
      <Frame12 />
    </div>
  );
}

function Container93() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container94 />
      <SvgThePortionOfTheGracePeriodLeftForBorrowersToFixNonComplianceIssuesSuchAsRestoringReserves />
    </div>
  );
}

function Margin17() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container93 />
    </div>
  );
}

function Container96() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[60.74px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.76px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[61.5px]">
        <p className="leading-[20px] whitespace-pre-wrap">168 hours</p>
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container96 />
    </div>
  );
}

function Container92() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin17 />
      <Container95 />
    </div>
  );
}

function Separator16() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin16() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator16 />
    </div>
  );
}

function Container99() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Withdrawal Cycle Duration</p>
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #BEBECE)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #BEBECE)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup12() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group12 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup12 />
    </div>
  );
}

function SvgAFixedPeriodDuringWhichWithdrawalRequestsAreGroupedAndProcessed() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - A fixed period during which withdrawal requests are grouped and processed.">
      <Frame13 />
    </div>
  );
}

function Container98() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container99 />
      <SvgAFixedPeriodDuringWhichWithdrawalRequestsAreGroupedAndProcessed />
    </div>
  );
}

function Margin18() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container98 />
    </div>
  );
}

function Container101() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[60.74px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.76px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[61.5px]">
        <p className="leading-[20px] whitespace-pre-wrap">168 hours</p>
      </div>
    </div>
  );
}

function Container100() {
  return (
    <div className="content-stretch flex items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container101 />
    </div>
  );
}

function Container97() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin18 />
      <Container100 />
    </div>
  );
}

function Separator17() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin17() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator17 />
    </div>
  );
}

function Container104() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Transfer Access</p>
      </div>
    </div>
  );
}

function Container103() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container104 />
    </div>
  );
}

function Margin19() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container103 />
    </div>
  );
}

function Container106() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[63.17px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.78px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[63.953px]">
        <p className="leading-[20px] whitespace-pre-wrap">Restricted</p>
      </div>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #D7A820)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #D7A820)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup13() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group13 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup13 />
    </div>
  );
}

function SvgTheMarketTokenCanOnlyBeTransferredToAddressesThatMeetSpecificCriteria() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - The market token can only be transferred to addresses that meet specific criteria.">
      <Frame14 />
    </div>
  );
}

function Container105() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container106 />
      <SvgTheMarketTokenCanOnlyBeTransferredToAddressesThatMeetSpecificCriteria />
    </div>
  );
}

function Container102() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin19 />
      <Container105 />
    </div>
  );
}

function Separator18() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin18() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator18 />
    </div>
  );
}

function Container109() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Fixed Term Closure Permitted</p>
      </div>
    </div>
  );
}

function Container108() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.72px] relative" data-name="Container">
      <Container109 />
    </div>
  );
}

function Margin20() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container108 />
    </div>
  );
}

function Container111() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[23.54px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.34px] text-[#30313e] text-[13px] text-right top-[9.78px] w-[23.881px]">
        <p className="leading-[20px] whitespace-pre-wrap">N/A</p>
      </div>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #D7A820)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #D7A820)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup14() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group14 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup14 />
    </div>
  );
}

function SvgMarketIsOpenTermMarketCanBeTerminatedAtAnyTime() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - Market is Open Term, market can be terminated at any time.">
      <Frame15 />
    </div>
  );
}

function Container110() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container111 />
      <SvgMarketIsOpenTermMarketCanBeTerminatedAtAnyTime />
    </div>
  );
}

function Container107() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin20 />
      <Container110 />
    </div>
  );
}

function Separator19() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="Separator">
      <div aria-hidden="true" className="absolute border-[#eff0f4] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function SeparatorMargin19() {
  return (
    <div className="content-stretch flex flex-col h-[25px] items-start py-[12px] relative shrink-0 w-full" data-name="Separator:margin">
      <Separator19 />
    </div>
  );
}

function Container114() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0b0] text-[13px] whitespace-nowrap">
        <p className="leading-[20px]">Fixed Term Maturity Reduction Permitted</p>
      </div>
    </div>
  );
}

function Container113() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px pb-[0.73px] relative" data-name="Container">
      <Container114 />
    </div>
  );
}

function Margin21() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pb-[2px] relative self-stretch shrink-0" data-name="Margin">
      <Container113 />
    </div>
  );
}

function Container116() {
  return (
    <div className="h-[20.01px] max-w-[185px] overflow-clip relative shrink-0 w-[23.54px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] not-italic right-[-0.34px] text-[#30313e] text-[13px] text-right top-[9.77px] w-[23.881px]">
        <p className="leading-[20px] whitespace-pre-wrap">N/A</p>
      </div>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[12px_12px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.pa39ea00} fill="var(--fill-0, #D7A820)" fillRule="evenodd" id="Vector" />
          <path d={svgPaths.p20cf9370} fill="var(--fill-0, #D7A820)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup15() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group15 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Frame">
      <ClipPathGroup15 />
    </div>
  );
}

function SvgNoMaturityToReduceInAnOpenTermSetting() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="SVG - No maturity to reduce in an Open Term setting.">
      <Frame16 />
    </div>
  );
}

function Container115() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pr-[4px] relative self-stretch shrink-0" data-name="Container">
      <Container116 />
      <SvgNoMaturityToReduceInAnOpenTermSetting />
    </div>
  );
}

function Container112() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Margin21 />
      <Container115 />
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative self-stretch" data-name="Container">
      <Container62 />
      <SeparatorMargin10 />
      <Container67 />
      <SeparatorMargin11 />
      <Container72 />
      <SeparatorMargin12 />
      <Container77 />
      <SeparatorMargin13 />
      <Container82 />
      <SeparatorMargin14 />
      <Container87 />
      <SeparatorMargin15 />
      <Container92 />
      <SeparatorMargin16 />
      <Container97 />
      <SeparatorMargin17 />
      <Container102 />
      <SeparatorMargin18 />
      <Container107 />
      <SeparatorMargin19 />
      <Container112 />
    </div>
  );
}

function Container1() {
  return (
    <div className="min-h-[492.1499938964844px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[56.13px] items-start min-h-[inherit] relative w-full">
        <Container2 />
        <Container61 />
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative size-full" data-name="Frame">
      <Container />
      <Container1 />
    </div>
  );
}