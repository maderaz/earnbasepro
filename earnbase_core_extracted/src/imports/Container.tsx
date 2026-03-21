import svgPaths from "./svg-e5v62fh0il";
import imgMerklRewards from "figma:asset/951d477d641bade962b65647e2e1daf7d3fb67fe.png";
import { imgGroup, imgGroup1, imgGroup2 } from "./svg-1g24d";

function Heading() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Heading 4">
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[32px] text-[rgba(0,0,0,0.87)] tracking-[-0.48px] w-full">
        <p className="leading-[40px] whitespace-pre-wrap">Explore DeFi Opportunities</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[24px] relative w-full">
          <Heading />
        </div>
      </div>
    </div>
  );
}

function Tab() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex flex-col items-center justify-center max-h-[36px] max-w-[360px] min-h-[36px] min-w-[90px] overflow-clip pb-[8.29px] pt-[7.7px] px-[16px] relative rounded-[32px] shrink-0" data-name="Tab">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0e121b] text-[14px] text-center tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">syrupUSDC</p>
      </div>
    </div>
  );
}

function Tab1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center max-h-[36px] max-w-[360px] min-h-[36px] min-w-[90px] overflow-clip pb-[8.29px] pt-[7.7px] px-[16px] relative rounded-[32px] shrink-0" data-name="Tab">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[14px] text-center tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">syrupUSDT</p>
      </div>
    </div>
  );
}

function Tablist() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Tablist">
      <Tab />
      <Tab1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col h-full items-start overflow-clip relative shrink-0" data-name="Container">
      <Tablist />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[36px] items-start justify-center max-h-[36px] min-h-[36px] overflow-clip relative shrink-0" data-name="Container">
      <Container7 />
    </div>
  );
}

function Svg() {
  return (
    <div className="absolute left-[-4px] size-[15.99px] top-0" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.99 15.99">
        <g id="SVG">
          <path d={svgPaths.p32703580} fill="var(--fill-0, #0E121B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Margin() {
  return (
    <div className="h-[15.99px] relative shrink-0 w-[19.99px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Svg />
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[15.99px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.99 15.99">
        <g id="SVG">
          <path d={svgPaths.p39623400} fill="var(--fill-0, #0E121B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0 w-[17.99px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[6px] relative w-full">
        <Svg1 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white min-w-[64px] relative rounded-[200px] shrink-0" data-name="Button">
      <div className="content-stretch flex items-center justify-center min-w-[inherit] overflow-clip px-[20.606px] py-[8.606px] relative rounded-[inherit]">
        <Margin />
        <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0e121b] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[16px]">All chains</p>
        </div>
        <Margin1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e4ea] border-solid inset-0 pointer-events-none rounded-[200px] shadow-[0px_16px_40px_-8px_rgba(88,92,95,0.16)]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Button />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[0_0_-0.05%_0] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[40px_40px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40.021">
        <g id="Group">
          <path d={svgPaths.p34e9d400} fill="var(--fill-0, #9391F7)" id="Vector" />
          <path d={svgPaths.pfa6600} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p7dfd0f0} fill="var(--fill-0, white)" id="Vector_3" />
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

function Svg2() {
  return (
    <div className="mr-[-0.01px] relative shrink-0 size-[40px]" data-name="SVG">
      <ClipPathGroup />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.01px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.87)] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">Aave</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[12px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Borrow</p>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.01px] pt-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container13 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.01px] relative shrink-0" data-name="Container">
      <Container12 />
      <Margin4 />
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[12px] relative shrink-0" data-name="Margin">
      <Container11 />
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pr-[0.01px] relative">
        <Svg2 />
        <Margin3 />
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p1e07c780} fill="var(--fill-0, #0000FF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[20px]" data-name="Frame">
      <div className="absolute bottom-[24.91%] left-[24.93%] right-[24.98%] top-1/4" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0173 10.0173">
          <path d={svgPaths.p2ac1ba00} fill="var(--fill-0, #99A0AE)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-[20px]" data-name="SVG">
      <Frame />
    </div>
  );
}

function SvgMargin() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pl-[12px] relative shrink-0 w-[32px]" data-name="SVG:margin">
      <Svg4 />
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative">
        <Svg3 />
        <SvgMargin />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border border-[#eff1f6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12.61px] py-[12.606px] relative w-full">
          <Container10 />
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[0_373.36px_162.4px_0] items-start max-w-[344.64959716796875px]" data-name="Container">
      <Link />
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="SVG">
          <path d={svgPaths.p29cd0740} fill="var(--fill-0, white)" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p201da7f2} fill="var(--fill-0, #3864FF)" fillOpacity="0.25" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p26f35600} fill="var(--fill-0, #3864FF)" fillOpacity="0.25" fillRule="evenodd" id="Vector_3" />
          <path d={svgPaths.p66dfe80} fill="url(#paint0_linear_23_803)" id="Vector_4" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_23_803" x1="11.9524" x2="28.3147" y1="23.8457" y2="11.2126">
            <stop offset="0.16" stopColor="#3864FF" />
            <stop offset="0.56" stopColor="#6083FF" />
            <stop offset="1" stopColor="#3864FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.01px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.87)] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">Midas</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[12px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Earn more</p>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.01px] pt-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container19 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start min-w-[55.689998626708984px] pb-[0.01px] relative shrink-0" data-name="Container">
      <Container18 />
      <Margin6 />
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <Container17 />
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative">
        <Svg5 />
        <Margin5 />
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="mr-[-0.01px] relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p1c665200} fill="var(--fill-0, #627EEA)" id="Vector" />
          <path d={svgPaths.p969f700} fill="var(--fill-0, white)" fillOpacity="0.602" id="Vector_2" />
          <path d={svgPaths.p1ebe2800} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p18408900} fill="var(--fill-0, white)" fillOpacity="0.602" id="Vector_4" />
          <path d={svgPaths.p2e25ee00} fill="var(--fill-0, white)" id="Vector_5" />
          <path d={svgPaths.p194e5000} fill="var(--fill-0, white)" fillOpacity="0.2" id="Vector_6" />
          <path d={svgPaths.p36c52980} fill="var(--fill-0, white)" fillOpacity="0.602" id="Vector_7" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[20px]" data-name="Frame">
      <div className="absolute bottom-[24.91%] left-[24.93%] right-[24.98%] top-1/4" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0173 10.0173">
          <path d={svgPaths.p2ac1ba00} fill="var(--fill-0, #99A0AE)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Svg7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-[20px]" data-name="SVG">
      <Frame1 />
    </div>
  );
}

function SvgMargin1() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start mr-[-0.01px] pl-[12px] relative shrink-0 w-[32px]" data-name="SVG:margin">
      <Svg7 />
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pr-[0.01px] relative">
        <Svg6 />
        <SvgMargin1 />
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border border-[#eff1f6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[12.6px] pr-[12.61px] py-[12.606px] relative w-full">
          <Container16 />
          <Container20 />
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[0_12.71px_162.4px_360.65px] items-start max-w-[344.64959716796875px]" data-name="Container">
      <Link1 />
    </div>
  );
}

function Svg8() {
  return (
    <div className="mr-[-0.01px] relative shrink-0 size-[40px]" data-name="SVG">
      <div className="absolute inset-[0_0_-0.01%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40.0049">
          <g id="SVG">
            <path d={svgPaths.ped47f00} fill="var(--fill-0, #091326)" id="Vector" />
            <g id="Vector_2" opacity="0.7">
              <path d={svgPaths.p2475c000} fill="#0E121B" />
              <path d={svgPaths.p2475c000} stroke="url(#paint0_radial_23_816)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </g>
            <g id="Vector_3">
              <path d={svgPaths.p11d43b80} fill="white" />
              <path d={svgPaths.pec3fc80} stroke="var(--stroke-0, white)" strokeWidth="0.416667" />
            </g>
          </g>
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(35.9837 11.746) rotate(108.872) scale(18.8852 45.7977)" gradientUnits="userSpaceOnUse" id="paint0_radial_23_816" r="1">
              <stop offset="0.139194" stopColor="white" stopOpacity="0.5" />
              <stop offset="0.620501" stopColor="white" stopOpacity="0.8" />
              <stop offset="1" stopColor="white" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.87)] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">Kamino</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[12px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">{`Borrow & Loop`}</p>
      </div>
    </div>
  );
}

function Margin8() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container25 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start min-w-[80.02999877929688px] relative shrink-0" data-name="Container">
      <Container24 />
      <Margin8 />
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[12px] relative shrink-0" data-name="Margin">
      <Container23 />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pr-[0.01px] relative">
        <Svg8 />
        <Margin7 />
      </div>
    </div>
  );
}

function Svg9() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p15ed0480} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p1a03bb80} fill="url(#paint0_linear_23_784)" id="Vector_2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_23_784" x1="6.55962" x2="16.9893" y1="18.2232" y2="6.15447">
            <stop offset="0.08" stopColor="#8752F3" />
            <stop offset="0.3" stopColor="#8752F3" />
            <stop offset="0.5" stopColor="#5497D5" />
            <stop offset="0.6" stopColor="#43B4CA" />
            <stop offset="0.72" stopColor="#28E0B9" />
            <stop offset="0.97" stopColor="#19FB9B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[20px]" data-name="Frame">
      <div className="absolute bottom-[24.91%] left-[24.93%] right-[24.98%] top-1/4" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0173 10.0173">
          <path d={svgPaths.p2ac1ba00} fill="var(--fill-0, #99A0AE)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Svg10() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-[20px]" data-name="SVG">
      <Frame2 />
    </div>
  );
}

function SvgMargin2() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pl-[12px] relative shrink-0 w-[32px]" data-name="SVG:margin">
      <Svg10 />
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative">
        <Svg9 />
        <SvgMargin2 />
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border border-[#eff1f6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12.61px] py-[12.606px] relative w-full">
          <Container22 />
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[81.21px_373.36px_81.19px_0] items-start max-w-[344.64959716796875px]" data-name="Container">
      <Link2 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[40px_40px]" data-name="Group" style={{ maskImage: `url('${imgGroup1}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Group">
          <path d={svgPaths.p29cd0740} fill="var(--fill-0, #141726)" id="Vector" />
          <path d={svgPaths.p1894a200} fill="url(#paint0_linear_23_775)" id="Vector_2" />
          <path d={svgPaths.p48f6f70} fill="url(#paint1_linear_23_775)" id="Vector_3" />
          <path d={svgPaths.p5902600} fill="url(#paint2_linear_23_775)" id="Vector_4" />
          <path d={svgPaths.p84d3bd0} fill="url(#paint3_linear_23_775)" id="Vector_5" />
          <path d={svgPaths.p1ce36100} fill="url(#paint4_linear_23_775)" id="Vector_6" />
          <path d={svgPaths.p292aea80} fill="url(#paint5_linear_23_775)" id="Vector_7" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_23_775" x1="28.7463" x2="12.4263" y1="6.70638" y2="32.8844">
            <stop offset="0.16" stopColor="#C6F462" />
            <stop offset="0.89" stopColor="#33D9FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_23_775" x1="28.6293" x2="12.3098" y1="6.63366" y2="32.8117">
            <stop offset="0.16" stopColor="#C6F462" />
            <stop offset="0.89" stopColor="#33D9FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_23_775" x1="28.8509" x2="12.5314" y1="6.77159" y2="32.9496">
            <stop offset="0.16" stopColor="#C6F462" />
            <stop offset="0.89" stopColor="#33D9FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_23_775" x1="28.4514" x2="12.1314" y1="6.52246" y2="32.7005">
            <stop offset="0.16" stopColor="#C6F462" />
            <stop offset="0.89" stopColor="#33D9FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint4_linear_23_775" x1="28.5848" x2="12.2648" y1="6.60536" y2="32.7834">
            <stop offset="0.16" stopColor="#C6F462" />
            <stop offset="0.89" stopColor="#33D9FF" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint5_linear_23_775" x1="28.9519" x2="12.6324" y1="6.83443" y2="33.0124">
            <stop offset="0.16" stopColor="#C6F462" />
            <stop offset="0.89" stopColor="#33D9FF" />
          </linearGradient>
        </defs>
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

function Svg11() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="SVG">
      <ClipPathGroup1 />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.87)] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">Jupiter</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[12px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">{`Borrow & Loop`}</p>
      </div>
    </div>
  );
}

function Margin10() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container31 />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start min-w-[80.02999877929688px] relative shrink-0" data-name="Container">
      <Container30 />
      <Margin10 />
    </div>
  );
}

function Margin9() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <Container29 />
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative">
        <Svg11 />
        <Margin9 />
      </div>
    </div>
  );
}

function Svg12() {
  return (
    <div className="mr-[-0.01px] relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p15ed0480} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p1a03bb80} fill="url(#paint0_linear_23_784)" id="Vector_2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_23_784" x1="6.55962" x2="16.9893" y1="18.2232" y2="6.15447">
            <stop offset="0.08" stopColor="#8752F3" />
            <stop offset="0.3" stopColor="#8752F3" />
            <stop offset="0.5" stopColor="#5497D5" />
            <stop offset="0.6" stopColor="#43B4CA" />
            <stop offset="0.72" stopColor="#28E0B9" />
            <stop offset="0.97" stopColor="#19FB9B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[20px]" data-name="Frame">
      <div className="absolute bottom-[24.91%] left-[24.93%] right-[24.98%] top-1/4" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0173 10.0173">
          <path d={svgPaths.p2ac1ba00} fill="var(--fill-0, #99A0AE)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Svg13() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-[20px]" data-name="SVG">
      <Frame3 />
    </div>
  );
}

function SvgMargin3() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start mr-[-0.01px] pl-[12px] relative shrink-0 w-[32px]" data-name="SVG:margin">
      <Svg13 />
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pr-[0.01px] relative">
        <Svg12 />
        <SvgMargin3 />
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border border-[#eff1f6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[12.6px] pr-[12.61px] py-[12.606px] relative w-full">
          <Container28 />
          <Container32 />
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[81.21px_12.71px_81.19px_360.65px] items-start max-w-[344.64959716796875px]" data-name="Container">
      <Link3 />
    </div>
  );
}

function Svg14() {
  return (
    <div className="mr-[-0.01px] relative shrink-0 size-[40px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="SVG">
          <path d={svgPaths.p1fd92980} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p32326c00} fill="var(--fill-0, #3F75FF)" id="Vector_2" />
          <path d={svgPaths.p2e7a4f00} fill="var(--fill-0, #3F75FF)" id="Vector_3" />
          <path d={svgPaths.p13508d00} fill="var(--fill-0, #003F99)" id="Vector_4" />
          <path d={svgPaths.pa26db00} fill="var(--fill-0, #003F99)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.87)] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">Fluid</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[12px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">{`Swap, Borrow & Loop`}</p>
      </div>
    </div>
  );
}

function Margin12() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container37 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start min-w-[116.20999908447266px] relative shrink-0" data-name="Container">
      <Container36 />
      <Margin12 />
    </div>
  );
}

function Margin11() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[12px] relative shrink-0" data-name="Margin">
      <Container35 />
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pr-[0.01px] relative">
        <Svg14 />
        <Margin11 />
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[15.38%_19.32%_15.44%_19.32%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.945px_0px] mask-size-[16.617px_16.615px]" data-name="Group" style={{ maskImage: `url('${imgGroup2}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7278 16.6021">
        <g id="Group">
          <path d={svgPaths.p3d2d9000} fill="var(--fill-0, #213147)" id="Vector" />
          <path d={svgPaths.pf684280} fill="var(--fill-0, #12AAFF)" id="Vector_2" />
          <path d={svgPaths.p39d1a900} fill="var(--fill-0, #12AAFF)" id="Vector_3" />
          <path d={svgPaths.p333fe000} fill="var(--fill-0, #9DCCED)" id="Vector_4" />
          <path d={svgPaths.p3830aaf0} fill="var(--fill-0, #213147)" id="Vector_5" />
          <path d={svgPaths.ped9fae0} fill="var(--fill-0, white)" id="Vector_6" />
          <path d={svgPaths.p39875100} fill="var(--fill-0, white)" id="Vector_7" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup2() {
  return (
    <div className="absolute contents inset-[15.38%]" data-name="Clip path group">
      <Group2 />
    </div>
  );
}

function Svg15() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <div className="absolute inset-[1.92%]" data-name="Vector">
        <div className="absolute inset-[-2%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <path d={svgPaths.p1e607500} fill="var(--fill-0, #0E121B)" id="Vector" stroke="var(--stroke-0, white)" strokeWidth="0.923077" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[3.85%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.1538 22.1538">
          <path d={svgPaths.p2642d5f0} fill="var(--fill-0, #213147)" id="Vector" />
        </svg>
      </div>
      <ClipPathGroup2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[20px]" data-name="Frame">
      <div className="absolute bottom-[24.91%] left-[24.93%] right-[24.98%] top-1/4" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0173 10.0173">
          <path d={svgPaths.p2ac1ba00} fill="var(--fill-0, #99A0AE)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Svg16() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-[20px]" data-name="SVG">
      <Frame4 />
    </div>
  );
}

function SvgMargin4() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pl-[12px] relative shrink-0 w-[32px]" data-name="SVG:margin">
      <Svg16 />
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative">
        <Svg15 />
        <SvgMargin4 />
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border border-[#eff1f6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12.61px] py-[12.606px] relative w-full">
          <Container34 />
          <Container38 />
        </div>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[162.41px_373.36px_-0.01px_0] items-start max-w-[344.64959716796875px]" data-name="Container">
      <Link4 />
    </div>
  );
}

function Svg17() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="SVG">
          <path d={svgPaths.p4ee3e00} fill="var(--fill-0, #2470FF)" id="Vector" />
          <path d={svgPaths.p16139c00} fill="var(--fill-0, white)" id="Vector_2" opacity="0.8" />
          <path d={svgPaths.p243f6180} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p2fdb3e00} fill="var(--fill-0, white)" id="Vector_4" opacity="0.8" />
          <path d={svgPaths.p1ac66080} fill="var(--fill-0, white)" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.87)] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">Morpho</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[12px] w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Borrow</p>
      </div>
    </div>
  );
}

function Margin14() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container43 />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Container42 />
      <Margin14 />
    </div>
  );
}

function Margin13() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[12px] relative shrink-0" data-name="Margin">
      <Container41 />
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative">
        <Svg17 />
        <Margin13 />
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[15.38%_19.32%_15.44%_19.32%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.945px_0px] mask-size-[16.617px_16.615px]" data-name="Group" style={{ maskImage: `url('${imgGroup2}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7278 16.6021">
        <g id="Group">
          <path d={svgPaths.p3d2d9000} fill="var(--fill-0, #213147)" id="Vector" />
          <path d={svgPaths.pf684280} fill="var(--fill-0, #12AAFF)" id="Vector_2" />
          <path d={svgPaths.p39d1a900} fill="var(--fill-0, #12AAFF)" id="Vector_3" />
          <path d={svgPaths.p333fe000} fill="var(--fill-0, #9DCCED)" id="Vector_4" />
          <path d={svgPaths.p3830aaf0} fill="var(--fill-0, #213147)" id="Vector_5" />
          <path d={svgPaths.ped9fae0} fill="var(--fill-0, white)" id="Vector_6" />
          <path d={svgPaths.p39875100} fill="var(--fill-0, white)" id="Vector_7" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup3() {
  return (
    <div className="absolute contents inset-[15.38%]" data-name="Clip path group">
      <Group3 />
    </div>
  );
}

function Svg18() {
  return (
    <div className="mr-[-0.01px] relative shrink-0 size-[24px]" data-name="SVG">
      <div className="absolute inset-[1.92%]" data-name="Vector">
        <div className="absolute inset-[-2%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <path d={svgPaths.p1e607500} fill="var(--fill-0, #0E121B)" id="Vector" stroke="var(--stroke-0, white)" strokeWidth="0.923077" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[3.85%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.1538 22.1538">
          <path d={svgPaths.p2642d5f0} fill="var(--fill-0, #213147)" id="Vector" />
        </svg>
      </div>
      <ClipPathGroup3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[20px]" data-name="Frame">
      <div className="absolute bottom-[24.91%] left-[24.93%] right-[24.98%] top-1/4" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0173 10.0173">
          <path d={svgPaths.p2ac1ba00} fill="var(--fill-0, #99A0AE)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Svg19() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-[20px]" data-name="SVG">
      <Frame5 />
    </div>
  );
}

function SvgMargin5() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start mr-[-0.01px] pl-[12px] relative shrink-0 w-[32px]" data-name="SVG:margin">
      <Svg19 />
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pr-[0.01px] relative">
        <Svg18 />
        <SvgMargin5 />
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border border-[#eff1f6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[12.6px] pr-[12.61px] py-[12.606px] relative w-full">
          <Container40 />
          <Container44 />
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[162.41px_12.71px_-0.01px_360.65px] items-start max-w-[344.64959716796875px]" data-name="Container">
      <Link5 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[227.61px] relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container15 />
      <Container21 />
      <Container27 />
      <Container33 />
      <Container39 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[20px] relative shrink-0 w-full" data-name="Margin">
      <Container8 />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-[24px] px-[24px] relative w-full">
        <Container5 />
        <Margin2 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[395.99px] items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Background">
      <Container2 />
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[18px] text-[rgba(0,0,0,0.87)] tracking-[-0.27px] w-full">
        <p className="leading-[24px] whitespace-pre-wrap">Frequently Asked Questions</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#525866] text-[14px] tracking-[-0.084px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Still have a question?</p>
      </div>
    </div>
  );
}

function Svg20() {
  return (
    <div className="relative shrink-0 size-[15.99px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.99 15.99">
        <g id="SVG">
          <path d={svgPaths.p25fd15c0} fill="var(--fill-0, #0E121B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Margin18() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[8px] relative shrink-0 w-[21.99px]" data-name="Margin">
      <Svg20 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex items-center justify-center min-w-[64px] pl-[14px] pr-[14.01px] py-[8.016px] relative rounded-[200px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] mr-[-0.01px] relative shrink-0 text-[#0e121b] text-[14px] text-center tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">support@maple.finance</p>
      </div>
      <Margin18 />
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] relative shrink-0" data-name="Container">
      <Button1 />
    </div>
  );
}

function Svg21() {
  return (
    <div className="relative shrink-0 size-[15.99px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.99 15.99">
        <g id="SVG">
          <path d={svgPaths.p12823b72} fill="var(--fill-0, #0E121B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex items-center justify-center p-[8px] relative rounded-[16px] shrink-0 size-[32px]" data-name="Button">
      <Svg21 />
    </div>
  );
}

function Link6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <Button2 />
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[8px] relative shrink-0" data-name="Link:margin">
      <Link6 />
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0 w-full" data-name="Container">
      <Container51 />
      <LinkMargin />
    </div>
  );
}

function Margin17() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-full" data-name="Margin">
      <Container50 />
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container49 />
      <Margin17 />
    </div>
  );
}

function Margin16() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-name="Margin">
      <Container48 />
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start justify-between pb-[0.01px] relative self-stretch shrink-0 w-[240.23px]" data-name="Container">
      <Container47 />
      <Margin16 />
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.87)] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">Why did Drips rewards end?</p>
      </div>
    </div>
  );
}

function Svg22() {
  return (
    <div className="relative shrink-0 size-[15.99px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.99 15.99">
        <g id="SVG">
          <path d={svgPaths.p2764cc00} fill="var(--fill-0, #0E121B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0" data-name="Button">
      <Svg22 />
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Button:margin">
      <Button4 />
    </div>
  );
}

function Container54() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Container55 />
          <ButtonMargin />
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start justify-center min-h-px min-w-px relative" data-name="Container">
      <Container54 />
    </div>
  );
}

function Button3() {
  return (
    <div className="min-h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center min-h-[inherit] p-[16px] relative w-full">
          <Container53 />
        </div>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="Background">
      <Button3 />
    </div>
  );
}

function Container58() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.87)] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">When can I claim my Season 12 Drips?</p>
      </div>
    </div>
  );
}

function Svg23() {
  return (
    <div className="relative shrink-0 size-[15.99px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.99 15.99">
        <g id="SVG">
          <path d={svgPaths.p2764cc00} fill="var(--fill-0, #0E121B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0" data-name="Button">
      <Svg23 />
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Button:margin">
      <Button6 />
    </div>
  );
}

function Container57() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Container58 />
          <ButtonMargin1 />
        </div>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start justify-center min-h-px min-w-px relative" data-name="Container">
      <Container57 />
    </div>
  );
}

function Button5() {
  return (
    <div className="min-h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center min-h-[inherit] p-[16px] relative w-full">
          <Container56 />
        </div>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="Background">
      <Button5 />
    </div>
  );
}

function Margin20() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Margin">
      <Background3 />
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.87)] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">What happens if I miss the claim deadline?</p>
      </div>
    </div>
  );
}

function Svg24() {
  return (
    <div className="relative shrink-0 size-[15.99px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.99 15.99">
        <g id="SVG">
          <path d={svgPaths.p2764cc00} fill="var(--fill-0, #0E121B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0" data-name="Button">
      <Svg24 />
    </div>
  );
}

function ButtonMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Button:margin">
      <Button8 />
    </div>
  );
}

function Container60() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Container61 />
          <ButtonMargin2 />
        </div>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start justify-center min-h-px min-w-px relative" data-name="Container">
      <Container60 />
    </div>
  );
}

function Button7() {
  return (
    <div className="min-h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center min-h-[inherit] p-[16px] relative w-full">
          <Container59 />
        </div>
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="Background">
      <Button7 />
    </div>
  );
}

function Margin21() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Margin">
      <Background4 />
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.87)] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">How do I earn rewards now?</p>
      </div>
    </div>
  );
}

function Svg25() {
  return (
    <div className="relative shrink-0 size-[15.99px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.99 15.99">
        <g id="SVG">
          <path d={svgPaths.p2764cc00} fill="var(--fill-0, #0E121B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0" data-name="Button">
      <Svg25 />
    </div>
  );
}

function ButtonMargin3() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Button:margin">
      <Button10 />
    </div>
  );
}

function Container63() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Container64 />
          <ButtonMargin3 />
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start justify-center min-h-px min-w-px relative" data-name="Container">
      <Container63 />
    </div>
  );
}

function Button9() {
  return (
    <div className="min-h-[48px] relative shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center min-h-[inherit] p-[16px] relative w-full">
          <Container62 />
        </div>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#f5f7fa] content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="Background">
      <Button9 />
    </div>
  );
}

function Margin22() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Margin">
      <Background5 />
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative w-full" data-name="Container">
      <Background2 />
      <Margin20 />
      <Margin21 />
      <Margin22 />
    </div>
  );
}

function Margin19() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[32px] relative self-stretch shrink-0 w-[461.79px]" data-name="Margin">
      <Container52 />
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex items-start min-h-[255.94000244140625px] relative shrink-0 w-full" data-name="Container">
      <Container46 />
      <Margin19 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[32px] relative w-full">
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function Margin15() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-full" data-name="Margin">
      <Background1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[766.01px]" data-name="Container">
      <Background />
      <Margin15 />
    </div>
  );
}

function MerklRewards() {
  return (
    <div className="aspect-[57/57] relative shrink-0 w-full" data-name="Merkl Rewards">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgMerklRewards} />
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] relative shrink-0 size-[57px]" data-name="Container">
      <MerklRewards />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[32px] text-[rgba(0,0,0,0.87)] tracking-[-0.48px] whitespace-nowrap">
        <p className="leading-[40px]">Merkl Rewards</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[16px] tracking-[-0.176px] whitespace-nowrap">
        <p className="leading-[24px]">Earn with Ecosystem Partners</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading1 />
      <Container69 />
    </div>
  );
}

function Margin23() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[8px] relative shrink-0" data-name="Margin">
      <Container68 />
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex items-center pr-[0.01px] relative shrink-0 w-full" data-name="Container">
      <Container67 />
      <Margin23 />
    </div>
  );
}

function Svg26() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.pec2ae00} fill="var(--fill-0, #3FC07C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.01px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0e121b] text-[16px] tracking-[-0.176px] whitespace-nowrap">
        <p className="leading-[24px]">Multiple Partners</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.01px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[14px] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">Access rewards from various DeFi protocols</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px pb-[0.01px] relative" data-name="Container">
      <Container73 />
      <Container74 />
    </div>
  );
}

function Margin24() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[8px] relative self-stretch shrink-0" data-name="Margin">
      <Container72 />
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex items-start min-h-[44px] relative shrink-0 w-full" data-name="Container">
      <Svg26 />
      <Margin24 />
    </div>
  );
}

function Svg27() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.pec2ae00} fill="var(--fill-0, #3FC07C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.01px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0e121b] text-[16px] tracking-[-0.176px] whitespace-nowrap">
        <p className="leading-[24px]">Competitive APYs</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex flex-col items-start mb-[-0.01px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[14px] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">Higher earning potential across platforms</p>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px pb-[0.01px] relative" data-name="Container">
      <Container77 />
      <Container78 />
    </div>
  );
}

function Margin26() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[8px] relative self-stretch shrink-0" data-name="Margin">
      <Container76 />
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex items-start min-h-[44px] relative shrink-0 w-full" data-name="Container">
      <Svg27 />
      <Margin26 />
    </div>
  );
}

function Margin25() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container75 />
    </div>
  );
}

function Svg28() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.pec2ae00} fill="var(--fill-0, #3FC07C)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#0e121b] text-[16px] tracking-[-0.176px] whitespace-nowrap">
        <p className="leading-[24px]">Onchain</p>
      </div>
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#99a0ae] text-[14px] tracking-[-0.084px] whitespace-nowrap">
        <p className="leading-[20px]">Transparent, verifiable distributions</p>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Container">
      <Container81 />
      <Container82 />
    </div>
  );
}

function Margin28() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center pl-[8px] relative self-stretch shrink-0" data-name="Margin">
      <Container80 />
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex items-start min-h-[44px] relative shrink-0 w-full" data-name="Container">
      <Svg28 />
      <Margin28 />
    </div>
  );
}

function Margin27() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container79 />
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container71 />
      <Margin25 />
      <Margin27 />
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[20px] relative shrink-0 text-[#99a0ae] text-[14px] text-center tracking-[-0.084px] whitespace-nowrap">
        <p className="mb-0">Third-party protocols carry independent risks.</p>
        <p>Always research before depositing</p>
      </div>
    </div>
  );
}

function Margin29() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[8px] right-0 top-[105.18px]" data-name="Margin">
      <Container84 />
    </div>
  );
}

function Svg29() {
  return (
    <div className="relative shrink-0 size-[17.99px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.99 17.99">
        <g id="SVG">
          <path d={svgPaths.p3f1fac00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Margin30() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-0.01px] pl-[8px] relative shrink-0 w-[21.99px]" data-name="Margin">
      <Svg29 />
    </div>
  );
}

function Link7() {
  return (
    <div className="absolute bg-[#0e121b] content-stretch flex items-center justify-center left-0 min-w-[64px] overflow-clip pl-[14px] pr-[14.01px] py-[12px] right-0 rounded-[200px] shadow-[0px_16px_32px_-12px_rgba(88,92,95,0.1)] top-0" data-name="Link">
      <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] mr-[-0.01px] relative shrink-0 text-[16px] text-center text-white tracking-[-0.176px] whitespace-nowrap">
        <p className="leading-[24px]">View your Rewards</p>
      </div>
      <Margin30 />
    </div>
  );
}

function Svg30() {
  return (
    <div className="relative shrink-0 size-[17.99px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.99 17.99">
        <g id="SVG">
          <path d={svgPaths.p3f1fac00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Margin31() {
  return (
    <div className="relative shrink-0 w-[21.99px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[8px] relative w-full">
        <Svg30 />
      </div>
    </div>
  );
}

function Link8() {
  return (
    <div className="bg-white min-w-[64px] relative rounded-[200px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center justify-center min-w-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center min-w-[inherit] px-[14.606px] py-[12.606px] relative w-full">
          <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#0e121b] text-[16px] text-center tracking-[-0.176px] whitespace-nowrap">
            <p className="leading-[24px]">View rewards opportunities</p>
          </div>
          <Margin31 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e4ea] border-solid inset-0 pointer-events-none rounded-[200px] shadow-[0px_16px_40px_-8px_rgba(88,92,95,0.16)]" />
    </div>
  );
}

function LinkMargin1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 min-w-[64px] pt-[8px] right-0 top-[47.98px]" data-name="Link:margin">
      <Link8 />
    </div>
  );
}

function Container83() {
  return (
    <div className="h-[153.18px] relative shrink-0 w-full" data-name="Container">
      <Margin29 />
      <Link7 />
      <LinkMargin1 />
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Background">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-start p-[24px] relative w-full">
          <Container66 />
          <Container70 />
          <Container83 />
        </div>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[354px] shrink-0 sticky top-0 w-[354px]" data-name="Container">
      <Background6 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex gap-[32px] items-start justify-center relative size-full" data-name="Container">
      <Container1 />
      <Container65 />
    </div>
  );
}