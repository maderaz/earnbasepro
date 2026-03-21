import svgPaths from "./svg-nojxkilpp3";

function Radio() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center pb-[0.665px] relative shrink-0" data-name="Radio">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[16px] text-center tracking-[-0.18px] whitespace-nowrap">
        <p className="leading-[20px]">Buy</p>
      </div>
      <div className="absolute bg-[#0e0f11] bottom-[-9px] h-[2px] left-0 right-0" data-name="Horizontal Divider" />
    </div>
  );
}

function Radio1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center pb-[0.665px] relative shrink-0" data-name="Radio">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#77808d] text-[16px] text-center tracking-[-0.18px] whitespace-nowrap">
        <p className="leading-[20px]">Sell</p>
      </div>
    </div>
  );
}

function Radiogroup() {
  return (
    <div className="relative shrink-0" data-name="Radiogroup">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start relative">
        <Radio />
        <Radio1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[0.665px] relative shrink-0" data-name="Container">
      <div className="capitalize flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[14px] text-center tracking-[-0.09px] whitespace-nowrap">
        <p className="leading-[20px]">Limit</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px overflow-clip relative w-[12px]" data-name="Frame">
      <div className="absolute inset-[35.42%_14.58%_29.17%_14.58%]" data-name="Vector">
        <div className="absolute inset-[-17.65%_-8.82%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 5.75">
            <path d="M0.75 0.75L5 5L9.25 0.75" id="Vector" stroke="var(--stroke-0, #0E0F11)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center overflow-clip relative shrink-0 size-[12px]" data-name="SVG">
      <Frame1 />
    </div>
  );
}

function SvgMargin() {
  return (
    <div className="content-stretch flex flex-col h-[12px] items-start pl-[4px] relative shrink-0 w-[16px]" data-name="SVG:margin">
      <Svg />
    </div>
  );
}

function ButtonMenuSideSelection() {
  return (
    <div className="relative shrink-0 w-[90px]" data-name="Button menu - side selection">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center justify-end relative w-full">
        <Container1 />
        <SvgMargin />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex h-[28.89px] items-end justify-between pb-[8.889px] px-[16px] relative shrink-0 w-[338.22px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e6e8ea] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <Radiogroup />
      <ButtonMenuSideSelection />
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-[322.22px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <HorizontalBorder />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[0.665px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic opacity-70 relative shrink-0 text-[16px] text-center text-white tracking-[-0.18px] whitespace-nowrap">
        <p className="leading-[20px]">Up</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-center pl-[6px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.18px] whitespace-nowrap">
        <p className="leading-[24px]">51¢</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] relative w-full">
          <Container4 />
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Container">
      <Container3 />
    </div>
  );
}

function Radio2() {
  return (
    <div className="bg-[#30a159] content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-h-px min-w-px relative rounded-[9.2px]" data-name="Radio">
      <Container2 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-center mr-[-0.01px] opacity-40 pb-[0.665px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center tracking-[-0.18px] whitespace-nowrap">
        <p className="leading-[20px]">Down</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-center mr-[-0.01px] opacity-40 pl-[6px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center tracking-[-0.18px] whitespace-nowrap">
        <p className="leading-[24px]">50¢</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pl-[12px] pr-[12.01px] relative w-full">
          <Container8 />
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative" data-name="Container">
      <Container7 />
    </div>
  );
}

function Radio3() {
  return (
    <div className="bg-[#f4f5f6] content-stretch flex flex-[1_0_0] h-[48px] items-center justify-center min-h-px min-w-px relative rounded-[9.2px]" data-name="Radio">
      <Container6 />
    </div>
  );
}

function Radiogroup1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Radiogroup">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start justify-center relative w-full">
        <Radio2 />
        <Radio3 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.665px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[16px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Limit Price</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[20.665px] items-start justify-center min-h-px min-w-px relative" data-name="Container">
      <Container15 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-px overflow-clip relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#aeb4bc] text-[18px] text-center tracking-[-0.45px] whitespace-nowrap">
        <p className="leading-[normal]">0¢</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white content-stretch flex items-start justify-center min-w-[59.37009811401367px] overflow-clip pb-[3px] pt-[1.78px] relative shrink-0 w-[59.37px]" data-name="Input">
      <Container18 />
    </div>
  );
}

function Container17() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col items-center left-[calc(50%+0.01px)] top-[calc(50%-0.11px)]" data-name="Container">
      <Input />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[0.61px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[18px] text-center whitespace-nowrap">
        <p className="leading-[27px]">¢</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bottom-[0.89px] content-stretch flex items-center left-[74.57px] opacity-0 pb-[5.61px] pt-[5px] top-[0.89px] w-[10.49px]" data-name="Container">
      <Container20 />
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
        <g id="SVG">
          <path d="M8.0625 4.5H0.9375" id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Container">
      <Svg1 />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex h-full items-center justify-center px-[15.5px] relative shrink-0" data-name="Button">
      <Container23 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0" data-name="Container">
      <Button />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex h-[40px] items-start relative shrink-0" data-name="Container">
      <Container22 />
    </div>
  );
}

function Margin() {
  return (
    <div className="absolute content-stretch flex flex-col h-[40px] items-center left-[0.89px] pr-[4px] top-0" data-name="Margin">
      <Container21 />
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[9px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
        <g clipPath="url(#clip0_183_1709)" id="SVG">
          <path d="M8.0625 4.5H0.9375" id="Vector" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
          <path d="M4.5 8.0625V0.9375" id="Vector_2" stroke="var(--stroke-0, #18181B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.125" />
        </g>
        <defs>
          <clipPath id="clip0_183_1709">
            <rect fill="white" height="9" width="9" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Container">
      <Svg2 />
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex h-full items-center justify-center px-[15.5px] relative shrink-0" data-name="Button">
      <Container26 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex h-full items-center justify-center relative shrink-0" data-name="Container">
      <Button1 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex h-[40px] items-start relative shrink-0" data-name="Container">
      <Container25 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[40px] items-center left-[104.25px] pl-[4px] top-0" data-name="Margin">
      <Container24 />
    </div>
  );
}

function Border() {
  return (
    <div className="h-[40px] relative rounded-[9.2px] shrink-0 w-[149.14px]" data-name="Border">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Container17 />
        <Container19 />
        <Margin />
        <Margin1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[9.2px]" />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Border />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container16 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[16px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Shares</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <div className="h-[18px] shrink-0 w-full" data-name="Rectangle" />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px mr-[-0.11px] relative" data-name="Container">
      <Container30 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-end min-h-px min-w-px overflow-clip relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#aeb4bc] text-[18px] text-right tracking-[-0.45px] whitespace-nowrap">
        <p className="leading-[normal]">0</p>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white content-stretch flex items-start justify-center min-w-[147.3699951171875px] overflow-clip pb-[3px] pr-[8px] pt-[1.78px] relative shrink-0 w-[147.37px]" data-name="Input">
      <Container33 />
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative">
        <Input1 />
      </div>
    </div>
  );
}

function Border1() {
  return (
    <div className="h-[40px] mr-[-0.11px] relative rounded-[9.2px] shrink-0" data-name="Border">
      <div className="content-stretch flex h-full items-center justify-center overflow-clip p-px relative rounded-[inherit]">
        <Container32 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[9.2px]" />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex items-center pr-[0.11px] relative shrink-0 w-full" data-name="Container">
      <Container29 />
      <Border1 />
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex h-[30px] items-center justify-center pb-[7.89px] pt-[6.11px] px-[10.889px] relative rounded-[9.2px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[9.2px]" />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[12px] text-center tracking-[-0.1px] whitespace-nowrap">
        <p className="leading-[16px]">-100</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex h-[30px] items-center justify-center pb-[7.89px] pt-[6.11px] px-[10.889px] relative rounded-[9.2px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[9.2px]" />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[12px] text-center tracking-[-0.1px] whitespace-nowrap">
        <p className="leading-[16px]">-10</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex h-[30px] items-center justify-center pb-[7.89px] pt-[6.11px] px-[10.889px] relative rounded-[9.2px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[9.2px]" />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[12px] text-center tracking-[-0.1px] whitespace-nowrap">
        <p className="leading-[16px]">+10</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex h-[30px] items-center justify-center pb-[7.89px] pt-[6.11px] px-[10.889px] relative rounded-[9.2px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[9.2px]" />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[12px] text-center tracking-[-0.1px] whitespace-nowrap">
        <p className="leading-[16px]">+100</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[187.111px]" data-name="Container">
      <Container37 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container36 />
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <Container35 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container28 />
      <Container34 />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.555px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#77808d] text-[14px] whitespace-nowrap">
        <p className="leading-[18px]">Set Expiration</p>
      </div>
    </div>
  );
}

function Switch() {
  return (
    <div className="bg-[#e6e8ea] content-stretch flex h-[24px] items-center pl-[2.89px] pr-[18.11px] py-px relative rounded-[29826200px] shrink-0 w-[40px]" data-name="Switch">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[29826200px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="bg-white rounded-[29826200px] shrink-0 size-[19px]" data-name="Background" />
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container40 />
      <Switch />
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex items-start pb-[0.665px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[16px] whitespace-nowrap">
        <p className="leading-[20px]">Total</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1452f0] text-[18px] whitespace-nowrap">
        <p className="leading-[24px]">$0</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Container45 />
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.665px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e0f11] text-[16px] whitespace-nowrap">
        <p className="leading-[20px]">To win</p>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_183_1698)" id="SVG">
          <path d={svgPaths.p3115d100} id="Vector" stroke="var(--stroke-0, #77808D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d={svgPaths.p48c4a80} fill="var(--fill-0, #77808D)" id="Vector_2" />
          <path d="M7 9.91667V6.41667" id="Vector_3" stroke="var(--stroke-0, #77808D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </g>
        <defs>
          <clipPath id="clip0_183_1698">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Container">
      <Container48 />
      <Svg3 />
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p341681b0} fill="var(--fill-0, #21832D)" id="Vector" />
          <path d={svgPaths.p89e00} fill="var(--fill-0, #3AB549)" id="Vector_2" />
          <path d={svgPaths.p2c7c8b00} fill="var(--fill-0, #92FF04)" id="Vector_3" />
          <path d={svgPaths.p39ee4000} fill="var(--fill-0, #3AB549)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#30a159] text-[20px] whitespace-nowrap">
        <p className="leading-[24px]">$0</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Container">
      <Svg4 />
      <Container50 />
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container47 />
      <Container49 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container43 />
      <Container46 />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container42 />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Container39 />
      <Container41 />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <div className="bg-[#e6e8ea] h-[2px] opacity-40 shrink-0 w-full" data-name="Horizontal Divider" />
      <Container27 />
      <div className="bg-[#e6e8ea] h-[2px] opacity-40 shrink-0 w-full" data-name="Horizontal Divider" />
      <Container38 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container12 />
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[0.665px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">Trade</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container56 />
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <Container55 />
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container54 />
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[43px] items-center justify-center min-h-px min-w-px pb-[11.5px] pt-[10.835px] relative" data-name="Container">
      <Container53 />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#1452f0] content-stretch flex flex-[1_0_0] h-[43px] items-center justify-center min-h-px min-w-px pt-[2.5px] relative rounded-[9.2px]" data-name="Button">
      <div className="absolute bg-[#1452f0] inset-[5px_0.11px_-5px_0] rounded-[9.2px]" data-name="Background+Shadow">
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-5px_0px_0px_rgba(0,0,0,0.2)]" />
      </div>
      <Container52 />
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex h-[48px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Button6 />
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative w-full">
        <Container11 />
        <Container51 />
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] items-end p-[16.889px] relative rounded-[15.2px] size-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[15.2px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.06)]" />
      <Container />
      <Radiogroup1 />
      <Container10 />
    </div>
  );
}