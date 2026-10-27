import BreadCrumb from "@/components/molecules/breadcrumb/BreadCrumb";
import FiltersSection from "@/components/organisms/fastReserve/FiltersSection";
import HousesList from "@/components/organisms/fastReserve/HousesList";
import { Suspense } from "react";

const list = [
  { label: "خانه", href: "/" },
  { label: "رزرو هتل", href: "/fastReserve" },
];

const page = () => {
  return (
    <div className="mx-auto flex flex-col items-center gap-12 max-w-10/12">
      <BreadCrumb list={list} />
      <Suspense>
        <FiltersSection />
      </Suspense>
      <div className="flex items-center gap-3 w-full">
        <div
          dir="ltr"
          className="w-6/10 grid gap-3 max-h-270 overflow-y-auto pr-4 scrollbar-brand"
        >
          <Suspense fallback={<p>در حال بارگذاری ...</p>}>
            <HousesList />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default page;
