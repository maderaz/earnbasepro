import svgPaths from "./svg-y30783cbc2";

function Container1() {
  return (
    <div className="content-stretch flex items-start justify-center relative rounded-[8px] shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#52525c] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Monthly</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container1 />
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="relative shrink-0" data-name="Button:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[4px] relative">
        <Button />
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="absolute bg-white inset-0 rounded-[8px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.35px_0_0] rounded-[8px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" data-name="Overlay+Shadow" />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex items-start justify-center relative rounded-[8px] shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Yearly</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[12px] py-[8px] relative">
        <BackgroundBorder1 />
        <Container2 />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#fafafa] relative rounded-[10px] shrink-0" data-name="Background+Border">
      <div className="content-stretch flex items-center justify-center overflow-auto p-[2.889px] relative">
        <ButtonMargin />
        <Button1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative">
        <BackgroundBorder />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[0_0_0_-4px] items-start justify-end pb-[89.99px] pl-[109.67px] pr-[109.68px] pt-[89.11px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <Container />
    </div>
  );
}

function Margin() {
  return (
    <div className="relative self-stretch shrink-0 w-[369.06px]" data-name="Margin">
      <HorizontalBorder />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Free</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative">
        <Container5 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">0</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">$</p>
      </div>
      <Container10 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-center flex flex-wrap h-[36px] items-center relative shrink-0 w-full" data-name="Container">
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.88px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#71717b] text-[12px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">per month</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[7.11px] items-start relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Container11 />
    </div>
  );
}

function LinkButton() {
  return (
    <div className="bg-[rgba(255,255,255,0)] h-[48px] relative rounded-[10px] shrink-0 w-full" data-name="Link → Button">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[14.665px] pt-[13.335px] px-[20.889px] relative size-full">
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Get started</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[166.39px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between pb-[0.01px] relative size-full">
        <Container7 />
        <LinkButton />
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] inset-[-4px_-4px_0_0] items-start pb-[24.889px] pl-[24.889px] pr-[24px] pt-[24px]" data-name="Border">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b-[0.889px] border-l-[0.889px] border-solid inset-0 pointer-events-none" />
      <Container4 />
      <Container6 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="h-full relative shrink-0 w-[211.28px]" data-name="Margin">
      <Border />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Hobby</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative">
        <Container13 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">32</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">$</p>
      </div>
      <Container18 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#fa4941] items-center justify-center overflow-clip px-[8px] py-[4px] relative rounded-[24px] shrink-0 to-[#fa7fa1]" data-name="Background">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">20% off</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2.22px] relative shrink-0" data-name="Container">
      <Background1 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex h-[26px] items-center relative shrink-0" data-name="Container">
      <Container20 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-center flex flex-wrap gap-[0px_8px] h-[36px] items-center relative shrink-0 w-full" data-name="Container">
      <Container17 />
      <Container19 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.88px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#71717b] text-[12px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">per month, billed annually</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col gap-[7.11px] items-start relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Container21 />
    </div>
  );
}

function LinkButton1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] h-[48px] relative rounded-[10px] shrink-0 w-full" data-name="Link → Button">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[14.665px] pt-[13.335px] px-[20.889px] relative size-full">
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Subscribe</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function Container14() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[166.4px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[15.99px] items-start relative size-full">
        <Container15 />
        <LinkButton1 />
      </div>
    </div>
  );
}

function Border1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] inset-[-4px_-4px_0_0] items-start pb-[24.889px] pl-[24.889px] pr-[24px] pt-[24px]" data-name="Border">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b-[0.889px] border-l-[0.889px] border-solid inset-0 pointer-events-none" />
      <Container12 />
      <Container14 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="h-full relative shrink-0 w-[211.29px]" data-name="Margin">
      <Border1 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Standard</p>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#09090b] relative rounded-[29826200px] shrink-0" data-name="Background+Border">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[8.889px] py-[2.889px] relative rounded-[inherit]">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#fafafa] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[16px]">Popular</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[29826200px]" />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative">
        <Container23 />
        <BackgroundBorder2 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">120</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">$</p>
      </div>
      <Container28 />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#fa4941] items-center justify-center overflow-clip px-[8px] py-[4px] relative rounded-[24px] shrink-0 to-[#fa7fa1]" data-name="Background">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">20% off</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2.22px] relative shrink-0" data-name="Container">
      <Background2 />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex h-[26px] items-center relative shrink-0" data-name="Container">
      <Container30 />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-center flex flex-wrap gap-[0px_8px] h-[36px] items-center relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container29 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.88px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#71717b] text-[12px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">per month, billed annually</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[7.11px] items-start relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container31 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#09090b] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[24px] py-[8px] relative size-full">
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
            <p className="leading-[24px]">Subscribe</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col h-[48px] items-start relative shrink-0 w-full" data-name="Link">
      <div className="absolute bg-gradient-to-r bottom-[-8px] from-[#fb923c] h-[16px] left-0 right-0 rounded-bl-[10px] rounded-br-[10px] to-[#e879f9] via-1/2 via-[#f472b6]" data-name="Gradient" />
      <Button2 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[123.98px] relative shrink-0 w-[166.4px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[15.99px] items-start relative size-full">
        <Container25 />
        <Link />
      </div>
    </div>
  );
}

function Border2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] inset-[-4px_-4px_0_0] items-start pb-[24.889px] pl-[24.889px] pr-[24px] pt-[24px]" data-name="Border">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b-[0.889px] border-l-[0.889px] border-solid inset-0 pointer-events-none" />
      <Container22 />
      <Container24 />
    </div>
  );
}

function Margin3() {
  return (
    <div className="h-full relative shrink-0 w-[211.29px]" data-name="Margin">
      <Border2 />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Pro</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative">
        <Container33 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">400</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">$</p>
      </div>
      <Container38 />
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#fa4941] items-center justify-center overflow-clip px-[8px] py-[4px] relative rounded-[24px] shrink-0 to-[#fa7fa1]" data-name="Background">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">20% off</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[2.22px] relative shrink-0" data-name="Container">
      <Background3 />
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex h-[26px] items-center relative shrink-0" data-name="Container">
      <Container40 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-center flex flex-wrap gap-[0px_8px] h-[36px] items-center relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Container39 />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.88px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#71717b] text-[12px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">per month, billed annually</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col gap-[7.11px] items-start relative shrink-0 w-full" data-name="Container">
      <Container36 />
      <Container41 />
    </div>
  );
}

function LinkButton2() {
  return (
    <div className="bg-[rgba(255,255,255,0)] h-[48px] relative rounded-[10px] shrink-0 w-full" data-name="Link → Button">
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[14.665px] pt-[13.335px] px-[20.889px] relative size-full">
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Subscribe</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-1.5px_0px_0px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function Container34() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[166.4px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[15.99px] items-start relative size-full">
        <Container35 />
        <LinkButton2 />
      </div>
    </div>
  );
}

function Border3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] inset-[-4px_-4px_0_0] items-start pb-[24.889px] pl-[24.889px] pr-[24px] pt-[24px]" data-name="Border">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b-[0.889px] border-l-[0.889px] border-solid inset-0 pointer-events-none" />
      <Container32 />
      <Container34 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="h-full relative shrink-0 w-[211.29px]" data-name="Margin">
      <Border3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[4px] items-start justify-center pr-[4px] relative self-stretch shrink-0 w-[861.15px]" data-name="Container">
      <Margin1 />
      <Margin2 />
      <Margin3 />
      <Margin4 />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-white content-stretch flex items-start justify-center relative shrink-0 w-full" data-name="Background">
      <Margin />
      <Container3 />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start pointer-events-auto sticky top-0" data-name="Header">
      <Background />
    </div>
  );
}

function HeaderMargin() {
  return (
    <div className="h-[214.88px] mb-[-0.01px] shrink-0 sticky top-0 w-[1230.22px] z-[2]" data-name="Header:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute h-[214.8800048828125px] inset-0 pointer-events-none">
          <Header />
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-white content-stretch flex h-[64px] items-center pb-[0.889px] pl-[24px] pointer-events-auto sticky top-0 w-[3057.78px]" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Configuration</p>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="h-[64px] pointer-events-auto sticky top-0 w-[3053.78px]" data-name="Margin">
      <div className="absolute bottom-0 h-[64px] left-[-4px] pointer-events-none top-0">
        <BackgroundHorizontalBorder />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="content-stretch flex h-[64px] items-center pb-[23.105px] pl-[24px] pt-[20.895px] relative shrink-0 w-[369.06px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Message credits (monthly)</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-4px] right-0 top-[64px]" data-name="Container">
      <HorizontalBorder1 />
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="content-stretch flex h-[64px] items-center pb-[23.105px] pl-[24px] pt-[20.895px] relative shrink-0 w-[369.06px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Agents</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-4px] right-0 top-[128px]" data-name="Container">
      <HorizontalBorder2 />
    </div>
  );
}

function HorizontalBorder3() {
  return (
    <div className="content-stretch flex h-[64px] items-center pb-[23.105px] pl-[24px] pt-[20.895px] relative shrink-0 w-[369.06px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">AI Actions per agent</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-4px] right-0 top-[192px]" data-name="Container">
      <HorizontalBorder3 />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_84_402)" id="SVG">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_84_402">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Link1() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-start left-[163.73px] pl-[4px] top-[calc(50%-0.44px)]" data-name="Link">
      <Svg />
    </div>
  );
}

function HorizontalBorder4() {
  return (
    <div className="h-[64px] relative shrink-0 w-[369.06px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] left-[24px] not-italic text-[#09090b] text-[14px] top-[calc(50%-1.1px)] w-[140.028px]">
        <p className="leading-[20px] whitespace-pre-wrap">Training content size</p>
      </div>
      <Link1 />
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-4px] right-0 top-[256px]" data-name="Container">
      <HorizontalBorder4 />
    </div>
  );
}

function HorizontalBorder5() {
  return (
    <div className="content-stretch flex h-[64px] items-center pb-[23.105px] pl-[24px] pt-[20.895px] relative shrink-0 w-[369.06px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Workspace seats</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-4px] right-0 top-[320px]" data-name="Container">
      <HorizontalBorder5 />
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex h-[64px] items-center pb-[22.665px] pl-[24px] pt-[21.335px] relative shrink-0 w-[369.06px]" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Embed on unlimited websites</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-4px] right-0 top-[384px]" data-name="Container">
      <Container50 />
    </div>
  );
}

function Container43() {
  return (
    <div className="h-[444px] relative shrink-0 w-full" data-name="Container">
      <div className="absolute bottom-0 h-[444px] left-0 pointer-events-none top-0">
        <Margin5 />
      </div>
      <Container44 />
      <Container45 />
      <Container46 />
      <Container47 />
      <Container48 />
      <Container49 />
    </div>
  );
}

function BackgroundHorizontalBorder1() {
  return (
    <div className="bg-white content-stretch flex h-[64px] items-center pb-[0.889px] pl-[24px] pointer-events-auto sticky top-0 w-[3057.78px]" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Training</p>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="h-[64px] pointer-events-auto sticky top-0 w-[3053.78px]" data-name="Margin">
      <div className="absolute bottom-0 h-[64px] left-[-4px] pointer-events-none top-0">
        <BackgroundHorizontalBorder1 />
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_84_402)" id="SVG">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_84_402">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Link2() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-start left-[152.53px] pl-[4px] top-[calc(50%-0.44px)]" data-name="Link">
      <Svg1 />
    </div>
  );
}

function HorizontalBorder6() {
  return (
    <div className="h-[64px] relative shrink-0 w-[369.06px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] left-[24px] not-italic text-[#09090b] text-[14px] top-[calc(50%-1.1px)] w-[128.929px]">
        <p className="leading-[20px] whitespace-pre-wrap">Auto retrain agents</p>
      </div>
      <Link2 />
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-4px] right-0 top-[64px]" data-name="Container">
      <HorizontalBorder6 />
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_84_402)" id="SVG">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_84_402">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Link3() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-start left-[164.07px] pl-[4px] top-[calc(50%-0.44px)]" data-name="Link">
      <Svg2 />
    </div>
  );
}

function HorizontalBorder7() {
  return (
    <div className="h-[64px] relative shrink-0 w-[369.06px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] left-[24px] not-italic text-[#09090b] text-[14px] top-[calc(50%-1.1px)] w-[140.379px]">
        <p className="leading-[20px] whitespace-pre-wrap">Sources suggestions</p>
      </div>
      <Link3 />
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-4px] right-0 top-[128px]" data-name="Container">
      <HorizontalBorder7 />
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_84_402)" id="SVG">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #09090B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_84_402">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Link4() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-start left-[152.93px] pl-[4px] top-1/2" data-name="Link">
      <Svg3 />
    </div>
  );
}

function Container55() {
  return (
    <div className="h-[64px] relative shrink-0 w-[369.06px]" data-name="Container">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] left-[24px] not-italic text-[#09090b] text-[14px] top-[calc(50%-0.67px)] w-[129.33px]">
        <p className="leading-[20px] whitespace-pre-wrap">Tickets as a source</p>
      </div>
      <Link4 />
    </div>
  );
}

function Container54() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[-4px] right-0 top-[192px]" data-name="Container">
      <Container55 />
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[252px] relative shrink-0 w-full" data-name="Container">
      <div className="absolute bottom-0 h-[252px] left-0 pointer-events-none top-0">
        <Margin6 />
      </div>
      <Container52 />
      <Container53 />
      <Container54 />
    </div>
  );
}

function BackgroundHorizontalBorder2() {
  return (
    <div className="bg-white h-[64px] pointer-events-auto sticky top-0 w-[3057.78px]" data-name="Background+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e4e4e7] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Margin7() {
  return (
    <div className="h-[64px] pointer-events-auto sticky top-0 w-[3053.78px]" data-name="Margin">
      <div className="absolute bottom-0 h-[64px] left-[-4px] pointer-events-none top-0">
        <BackgroundHorizontalBorder2 />
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[188px] relative shrink-0 w-full" data-name="Container">
      <div className="absolute bottom-0 h-[188px] left-0 pointer-events-none top-0">
        <Margin7 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[369.06px]" data-name="Container">
      <Container43 />
      <Container51 />
      <Container56 />
    </div>
  );
}

function HorizontalBorder8() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">50</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder9() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder10() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder11() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">400 KB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder12() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">1 member</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path clipRule="evenodd" d={svgPaths.p3b208f80} fill="var(--fill-0, #3F3F46)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute content-stretch flex h-[64px] items-center justify-center left-0 px-[16px] right-0 top-0" data-name="Container">
      <Svg4 />
    </div>
  );
}

function Margin9() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Margin">
      <Container60 />
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <HorizontalBorder8 />
      <HorizontalBorder9 />
      <HorizontalBorder10 />
      <HorizontalBorder11 />
      <HorizontalBorder12 />
      <Margin9 />
    </div>
  );
}

function Margin8() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[64px] relative shrink-0 w-full" data-name="Margin">
      <Container59 />
    </div>
  );
}

function Margin11() {
  return <div className="h-[60px] shrink-0 w-full" data-name="Margin" />;
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
        <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
        <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      </div>
      <Margin11 />
    </div>
  );
}

function Margin10() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[64px] relative shrink-0 w-full" data-name="Margin">
      <Container61 />
    </div>
  );
}

function Margin12() {
  return <div className="h-[188px] shrink-0 w-full" data-name="Margin" />;
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[215.28px]" data-name="Container">
      <Margin8 />
      <Margin10 />
      <Margin12 />
    </div>
  );
}

function HorizontalBorder13() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">1,500</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder14() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder15() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">5</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder16() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">20 MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder18() {
  return (
    <div className="h-[20.89px] relative shrink-0 w-[80.99px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(9,9,11,0.3)] border-b-[0.889px] border-dashed inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] left-0 not-italic text-[#09090b] text-[14px] top-[9.33px] w-[81.565px]">
          <p className="leading-[20px] whitespace-pre-wrap">1+ members</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder17() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[0.889px] px-[16px] relative size-full">
          <HorizontalBorder18 />
        </div>
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path clipRule="evenodd" d={svgPaths.p3b208f80} fill="var(--fill-0, #3F3F46)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute content-stretch flex h-[64px] items-center justify-center left-0 px-[16px] right-0 top-0" data-name="Container">
      <Svg5 />
    </div>
  );
}

function Margin14() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Margin">
      <Container64 />
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <HorizontalBorder13 />
      <HorizontalBorder14 />
      <HorizontalBorder15 />
      <HorizontalBorder16 />
      <HorizontalBorder17 />
      <Margin14 />
    </div>
  );
}

function Margin13() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[64px] relative shrink-0 w-full" data-name="Margin">
      <Container63 />
    </div>
  );
}

function Margin16() {
  return <div className="h-[60px] shrink-0 w-full" data-name="Margin" />;
}

function Container65() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
        <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
        <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      </div>
      <Margin16 />
    </div>
  );
}

function Margin15() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[64px] relative shrink-0 w-full" data-name="Margin">
      <Container65 />
    </div>
  );
}

function Margin17() {
  return <div className="h-[188px] shrink-0 w-full" data-name="Margin" />;
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[215.29px]" data-name="Container">
      <Margin13 />
      <Margin15 />
      <Margin17 />
    </div>
  );
}

function OverlayHorizontalBorder() {
  return (
    <div className="bg-[rgba(250,250,250,0.8)] h-[64px] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorder1() {
  return (
    <div className="bg-[rgba(250,250,250,0.8)] h-[64px] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorder2() {
  return (
    <div className="bg-[rgba(250,250,250,0.8)] h-[64px] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">10</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorder3() {
  return (
    <div className="bg-[rgba(250,250,250,0.8)] h-[64px] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">40 MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder19() {
  return (
    <div className="h-[20.89px] relative shrink-0 w-[80.99px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(9,9,11,0.3)] border-b-[0.889px] border-dashed inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] left-0 not-italic text-[#09090b] text-[14px] top-[9.33px] w-[81.565px]">
          <p className="leading-[20px] whitespace-pre-wrap">1+ members</p>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorder4() {
  return (
    <div className="bg-[rgba(250,250,250,0.8)] h-[64px] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[0.889px] px-[16px] relative size-full">
          <HorizontalBorder19 />
        </div>
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path clipRule="evenodd" d={svgPaths.p3b208f80} fill="var(--fill-0, #3F3F46)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="absolute bg-[rgba(250,250,250,0.8)] content-stretch flex h-[64px] items-center justify-center left-0 px-[16px] right-0 top-0" data-name="Overlay">
      <Svg6 />
    </div>
  );
}

function Margin19() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Margin">
      <Overlay />
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <OverlayHorizontalBorder />
      <OverlayHorizontalBorder1 />
      <OverlayHorizontalBorder2 />
      <OverlayHorizontalBorder3 />
      <OverlayHorizontalBorder4 />
      <Margin19 />
    </div>
  );
}

function Margin18() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[64px] relative shrink-0 w-full" data-name="Margin">
      <Container67 />
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path clipRule="evenodd" d={svgPaths.p3b208f80} fill="var(--fill-0, #3F3F46)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function OverlayHorizontalBorder5() {
  return (
    <div className="bg-[rgba(250,250,250,0.8)] h-[64px] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[0.889px] px-[16px] relative size-full">
          <Svg7 />
        </div>
      </div>
    </div>
  );
}

function Margin21() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Margin">
      <div className="absolute bg-[rgba(250,250,250,0.8)] h-[64px] left-0 right-0 top-0" data-name="Overlay" />
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <OverlayHorizontalBorder5 />
      <div className="bg-[rgba(250,250,250,0.8)] h-[64px] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
        <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      </div>
      <Margin21 />
    </div>
  );
}

function Margin20() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[64px] relative shrink-0 w-full" data-name="Margin">
      <Container68 />
    </div>
  );
}

function Margin22() {
  return <div className="h-[188px] shrink-0 w-full" data-name="Margin" />;
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[215.29px]" data-name="Container">
      <Margin18 />
      <Margin20 />
      <Margin22 />
    </div>
  );
}

function HorizontalBorder20() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">40,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder21() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder22() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">15</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder23() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[23.105px] pt-[20.895px] px-[16px] relative size-full">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#09090b] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">60 MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder25() {
  return (
    <div className="h-[20.89px] relative shrink-0 w-[80.99px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(9,9,11,0.3)] border-b-[0.889px] border-dashed inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] left-0 not-italic text-[#09090b] text-[14px] top-[9.33px] w-[81.565px]">
          <p className="leading-[20px] whitespace-pre-wrap">1+ members</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder24() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[0.889px] px-[16px] relative size-full">
          <HorizontalBorder25 />
        </div>
      </div>
    </div>
  );
}

function Svg8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path clipRule="evenodd" d={svgPaths.p3b208f80} fill="var(--fill-0, #3F3F46)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute content-stretch flex h-[64px] items-center justify-center left-0 px-[16px] right-0 top-0" data-name="Container">
      <Svg8 />
    </div>
  );
}

function Margin24() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Margin">
      <Container71 />
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <HorizontalBorder20 />
      <HorizontalBorder21 />
      <HorizontalBorder22 />
      <HorizontalBorder23 />
      <HorizontalBorder24 />
      <Margin24 />
    </div>
  );
}

function Margin23() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[64px] relative shrink-0 w-full" data-name="Margin">
      <Container70 />
    </div>
  );
}

function Svg9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path clipRule="evenodd" d={svgPaths.p3b208f80} fill="var(--fill-0, #3F3F46)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function HorizontalBorder26() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[0.889px] px-[16px] relative size-full">
          <Svg9 />
        </div>
      </div>
    </div>
  );
}

function Svg10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path clipRule="evenodd" d={svgPaths.p3b208f80} fill="var(--fill-0, #3F3F46)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function HorizontalBorder27() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(228,228,231,0.5)] border-b-[0.889px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[0.889px] px-[16px] relative size-full">
          <Svg10 />
        </div>
      </div>
    </div>
  );
}

function Svg11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path clipRule="evenodd" d={svgPaths.p3b208f80} fill="var(--fill-0, #3F3F46)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute content-stretch flex h-[64px] items-center justify-center left-0 px-[16px] right-0 top-0" data-name="Container">
      <Svg11 />
    </div>
  );
}

function Margin26() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Margin">
      <Container73 />
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <HorizontalBorder26 />
      <HorizontalBorder27 />
      <Margin26 />
    </div>
  );
}

function Margin25() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[64px] relative shrink-0 w-full" data-name="Margin">
      <Container72 />
    </div>
  );
}

function Margin27() {
  return <div className="h-[188px] shrink-0 w-full" data-name="Margin" />;
}

function Container69() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[215.29px]" data-name="Container">
      <Margin23 />
      <Margin25 />
      <Margin27 />
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex items-start justify-center relative self-stretch shrink-0 w-[861.15px]" data-name="Container">
      <Container58 />
      <Container62 />
      <Container66 />
      <Container69 />
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-white mb-[-0.01px] relative shrink-0 w-[1230.22px] z-[1]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative w-full">
        <Container42 />
        <Container57 />
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="Frame">
      <div className="content-stretch flex flex-col isolate items-start overflow-clip pb-[4.899px] pt-[4.889px] px-px relative rounded-[inherit] size-full">
        <HeaderMargin />
        <Background4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}