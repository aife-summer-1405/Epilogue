"use client";

import { useQuery } from "@tanstack/react-query";
import VillaCard from "@/components/molecules/villa-card/VillaCard";
import Button from "@/components/atoms/button/Button";
import villa2Image from "@/app/assets/Image/Villa2.png";
import { SectionHeading } from "@/components/molecules";
import { getLocationsAction } from "@/app/actions/admin/location.actions";

export default function PopularVillasSection() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["popular-locations"],
    queryFn: () => getLocationsAction({ page: 1, limit: 4 }),
  });

  const locations = data?.data.slice(0, 4) ?? [];

  return (
    <section className="w-full overflow-hidden px-4 py-8 md:px-6 md:pb-24">
      <SectionHeading
        title="اجاره ویلا در محبوب‌ترین مقاصد ایران"
        subtitle="ویلاها را با ما انتخاب کنید"
      />

      {isError && (
        <p className="mt-6 text-center text-sm text-red-500">
          {error instanceof Error
            ? error.message
            : "خطا در دریافت اطلاعات مقاصد."}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-64 w-full animate-pulse rounded-xl bg-neutral-200"
              />
            ))
          : locations.map((location) => (
              <div key={location.id} className="w-full min-w-0">
                <VillaCard
                  image={villa2Image.src}
                  title={`اجاره ویلا در ${location.areaName}`}
                  count={50}
                />
              </div>
            ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button size="lg" variant="outline">
          مشاهده بیشتر
        </Button>
      </div>
    </section>
  );
}