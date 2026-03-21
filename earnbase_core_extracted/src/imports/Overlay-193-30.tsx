import img69728D8Ae6F16Cb052351EecSpreadsheetsAvif from "figma:asset/be3dbb7915f21a04aaea4363ce635f85736145aa.png";

function Component69728D8Ae6F16Cb052351EecSpreadsheetsAvif() {
  return (
    <div className="aspect-[856/701.8200073242188] relative rounded-[12px] shrink-0 w-full" data-name="69728d8ae6f16cb052351eec_spreadsheets.avif">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={img69728D8Ae6F16Cb052351EecSpreadsheetsAvif} />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative self-stretch" data-name="Container">
      <div className="content-stretch flex flex-col items-start pl-[40px] py-[40px] relative size-full">
        <Component69728D8Ae6F16Cb052351EecSpreadsheetsAvif />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-white tracking-[-0.36px] w-full">
        <p className="leading-[19.8px] whitespace-pre-wrap">Tabellen mühelos analysieren</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-75 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[24px] not-italic relative shrink-0 text-[15px] text-white tracking-[-0.16px] w-full whitespace-pre-wrap">
        <p className="mb-0">Werte große Tabellen direkt aus und</p>
        <p className="mb-0">lass dir komplexe Daten als</p>
        <p className="mb-0">übersichtliche Diagramme</p>
        <p>visualisieren.</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start max-w-[256px] relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Container3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative self-stretch shrink-0 w-[336px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start p-[40px] relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

export default function Overlay() {
  return (
    <div className="bg-[rgba(38,130,76,0.85)] content-stretch flex items-start overflow-clip relative rounded-[12px] size-full" data-name="Overlay">
      <Container />
      <Container1 />
    </div>
  );
}