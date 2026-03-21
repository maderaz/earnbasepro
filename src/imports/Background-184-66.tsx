import img6972B27081Fd2Bf3B6636Fe1479C79A2Fbe7A5B75A018A6B2Bdf920DCompanySearchAvif from "figma:asset/b0439129c79faf8ed95303009ed5009a7d3d161c.png";

function Component6972B27081Fd2Bf3B6636Fe1479C79A2Fbe7A5B75A018A6B2Bdf920DCompanySearchAvif() {
  return (
    <div className="h-[219.77px] relative shrink-0 w-[380px]" data-name="6972b27081fd2bf3b6636fe1_479c79a2fbe7a5b75a018a6b2bdf920d_company-search.avif">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={img6972B27081Fd2Bf3B6636Fe1479C79A2Fbe7A5B75A018A6B2Bdf920DCompanySearchAvif} />
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(219,218,216,0.2)] flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[12px]" data-name="Overlay">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[64px] py-[64px] relative w-full">
          <Component6972B27081Fd2Bf3B6636Fe1479C79A2Fbe7A5B75A018A6B2Bdf920DCompanySearchAvif />
        </div>
      </div>
    </div>
  );
}

export default function Background() {
  return (
    <div className="bg-white content-stretch flex items-end pl-[40px] relative size-full" data-name="Background">
      <Overlay />
    </div>
  );
}