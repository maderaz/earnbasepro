import imgUsdc from "figma:asset/d05054bc648a1d32380441aadcab50210cc5700f.png";

function Usdc() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="USDC">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUsdc} />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold items-start justify-center leading-[0] not-italic relative shrink-0 whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0 text-[#52525b] text-[12.3px] text-center">
        <p className="leading-[19.5px]">Hyperithm (Private Credit)</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[12.1px] text-[rgba(58,63,75,0.5)]">
        <p className="leading-[19.5px]">Wildcat</p>
      </div>
    </div>
  );
}

export default function Box() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center justify-center px-[15px] py-[10px] relative rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] size-full" data-name="box">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.33px_0_0] rounded-[8px] shadow-[0px_1px_3px_0px_rgba(8,166,113,0.1),0px_1px_2px_-1px_rgba(8,166,113,0.1)]" data-name="Link:shadow" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.33px_0_0] rounded-[8px] shadow-[0px_1px_3px_0px_rgba(8,166,113,0.1),0px_1px_2px_-1px_rgba(8,166,113,0.1)]" data-name="Link:shadow" />
      <Usdc />
      <Frame />
      <div className="bg-white shrink-0 size-[10px]" />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#08a671] text-[17px] tracking-[-0.55px]">
        <p className="leading-[27.5px] whitespace-pre-wrap">15.00%</p>
      </div>
    </div>
  );
}