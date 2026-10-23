import BreadCrumb from "@/components/molecules/breadcrumb/BreadCrumb";
import ViewProductCard from "@/components/molecules/product-card/ViewProductCard";
import FiltersSection from "@/components/organisms/fastReserve/FiltersSection";
import { FC } from "react";
import slider1 from "@/app/assets/Image/Slider1.webp";
import slider2 from "@/app/assets/Image/Slider2.webp";
import slider3 from "@/app/assets/Image/Slider3.webp";

interface IProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const list = [
  {
    label: "خانه",
    href: "/",
  },
  {
    label: "رزرو هتل",
    href: "/fastReserve",
  },
];

const slides = [
  { src: slider1, alt: "نمای بیرونی ویلا" },
  { src: slider2, alt: "نمای ورودی ساختمان" },
  { src: slider3, alt: "حیاط و محوطه" },
];

const page: FC<IProps> = async ({ searchParams }) => {
  //   console.log(await searchParams);
  return (
    <div className="mx-auto flex flex-col items-center gap-12 max-w-10/12">
      <BreadCrumb list={list} />
      <FiltersSection />
      <div className="flex items-center gap-3 w-full">
        <div
          dir="ltr"
          className="w-6/10 grid gap-3 max-h-270 overflow-y-auto pr-4 scrollbar-brand"
        >
          <ViewProductCard
            slides={slides}
            title="خانه ویلایی با پارکینگ اختصاصی"
            address="خیابان 404 بروکلین کالیفورنیا نیویورک"
            bathrooms={3}
            bedrooms={3}
            guests={3}
            rating={4.5}
            parking={2}
            pricePerNight="4500000"
            monthlyRent="45000000000"
            image=""
          />
          <ViewProductCard
            slides={slides}
            title="خانه ویلایی با پارکینگ اختصاصی"
            address="خیابان 404 بروکلین کالیفورنیا نیویورک"
            bathrooms={3}
            bedrooms={3}
            guests={3}
            rating={4.5}
            parking={2}
            pricePerNight="4500000"
            monthlyRent="45000000000"
            image=""
          />
          <ViewProductCard
            slides={slides}
            title="خانه ویلایی با پارکینگ اختصاصی"
            address="خیابان 404 بروکلین کالیفورنیا نیویورک"
            bathrooms={3}
            bedrooms={3}
            guests={3}
            rating={4.5}
            parking={2}
            pricePerNight="4500000"
            monthlyRent="45000000000"
            image=""
          />
          <ViewProductCard
            slides={slides}
            title="خانه ویلایی با پارکینگ اختصاصی"
            address="خیابان 404 بروکلین کالیفورنیا نیویورک"
            bathrooms={3}
            bedrooms={3}
            guests={3}
            rating={4.5}
            parking={2}
            pricePerNight="4500000"
            monthlyRent="45000000000"
            image=""
          />

          <ViewProductCard
            slides={slides}
            title="خانه ویلایی با پارکینگ اختصاصی"
            address="خیابان 404 بروکلین کالیفورنیا نیویورک"
            bathrooms={3}
            bedrooms={3}
            guests={3}
            rating={4.5}
            parking={2}
            pricePerNight="4500000"
            monthlyRent="45000000000"
            image=""
          />
          <ViewProductCard
            slides={slides}
            title="خانه ویلایی با پارکینگ اختصاصی"
            address="خیابان 404 بروکلین کالیفورنیا نیویورک"
            bathrooms={3}
            bedrooms={3}
            guests={3}
            rating={4.5}
            parking={2}
            pricePerNight="4500000"
            monthlyRent="45000000000"
            image=""
          />

          <ViewProductCard
            slides={slides}
            title="خانه ویلایی با پارکینگ اختصاصی"
            address="خیابان 404 بروکلین کالیفورنیا نیویورک"
            bathrooms={3}
            bedrooms={3}
            guests={3}
            rating={4.5}
            parking={2}
            pricePerNight="4500000"
            monthlyRent="45000000000"
            image=""
          />
        </div>
      </div>
    </div>
  );
};

export default page;
