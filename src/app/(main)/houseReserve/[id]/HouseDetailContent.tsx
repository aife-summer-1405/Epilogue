"use client";

import { useHouse } from "@/hooks/queries/houses/useHouses";

import { HouseRentGallery } from "@/components/organisms/HouseRentDetail/HouseRentGallery";
import HouseRentInfo from "@/components/organisms/HouseRentDetail/HouseRentInfo";
import HouseRentFeatures from "@/components/organisms/HouseRentDetail/HouseRentFeatures";
import HouseRentSidebar from "@/components/organisms/HouseRentDetail/HouseRentSidebar";
import { HouseRent } from "@/core/types/RentHouse/house";
import HouseRentComments from "@/components/organisms/HouseRentDetail/Comments/HouseRentComments";
import SimilarAds from "@/components/organisms/HouseRentDetail/SimilarAds";
import HouseReserveSidebar from "@/components/organisms/HouseReserveDetail/HouseReserveSidebar";

interface HouseDetailContentProps {
  id: string;
}

export default function HouseDetailContent({
  id,
}: HouseDetailContentProps) {
  const { data: house, isLoading, isError } = useHouse(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center px-4">
        <p className="text-sm text-neutral-500">
          در حال دریافت اطلاعات اقامتگاه...
        </p>
      </div>
    );
  }

  if (isError || !house) {
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center px-4">
        <p className="text-sm text-red-500">
          خطا در دریافت اطلاعات اقامتگاه
        </p>
      </div>
    );
  }

  const property = house as HouseRent;

  return (
    <main
      dir="rtl"
      className="mx-auto w-full  py-5 "
    >
      <HouseRentGallery
        title={property.title}
        address={property.address}
        rating={property.rate}
        photos={property.photos ?? []}
      />

      <div className="mt-12 flex flex-col justify-between px-[42px] gap-8 lg:flex-row lg:gap-[65px]">
        {/* محتوای اصلی */}
        <div className="order-2 min-w-0 w-full space-y-8 lg:order-1 lg:flex-1">
          <HouseRentInfo house={property} />


          {/* نظرات دقیقاً زیر امکانات */}
          <HouseRentComments houseId={property.id} />

        </div>
        

        {/* سایدبار رزرو */}
        <div className="order-1 w-full  shrink-0 lg:order-2 lg:w-[380px] xl:w-[420px]">
          <HouseReserveSidebar house={property} />
          <HouseRentFeatures house={property} />

        </div>
        
      </div>
            <SimilarAds />

    </main>
  );
}