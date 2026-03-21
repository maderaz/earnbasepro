import svgPaths from "./svg-7wm2m3cdss";
import { imgGroup } from "./svg-m4hk8";

function Group() {
  return (
    <div className="col-1 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.771px_-0.771px] mask-size-[37px_37px] ml-[2.08%] mt-[2.08%] relative row-1 size-[35.458px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <div className="absolute inset-[-2.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 37">
          <g id="Group">
            <path d={svgPaths.p138b2540} fill="var(--fill-0, #2775CA)" id="Vector" stroke="var(--stroke-0, #2775CA)" strokeWidth="1.54167" />
            <path d={svgPaths.pb469c00} fill="var(--fill-0, white)" id="Vector_2" />
            <path d={svgPaths.p4fb6180} fill="var(--fill-0, white)" id="Vector_3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0">
      <div className="col-1 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center ml-0 mt-0 not-italic relative row-1 text-[#09090b] text-[16.866px] whitespace-nowrap">
        <p className="leading-[23.612px]">Earn - avUSDC</p>
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[7px] items-center leading-[0] relative size-full">
      <ClipPathGroup />
      <Group1 />
    </div>
  );
}