"use client";

import React, { useMemo, useState } from "react";
import Pagination from "@/components/molecules/Pagination";
import ProductCard from "@/components/molecules/product-card/ProductCard";
import MortgageFilterSection from "./MortgageFilterSection";
import { useGetHouses } from "@/hooks/queries/useGetHouses";
import { GetHousesParams, HouseItem } from "@/services/houses/houses.service";
import Link from "next/link";

const MortgageRentContent: React.FC = () => {
  const [queryParams, setQueryParams] = useState<GetHousesParams>({
    page: 1,
    limit: 9,
    order: "DESC",
    sort: "last_updated",
  });

  const { data, isLoading, isError, isFetching } = useGetHouses(queryParams);

  const dynamicLocationOptions = useMemo(() => {
    if (!data?.data) return [];
    const uniqueAddresses = Array.from(
      new Set(
        data.data
          .map((item) => item.address?.split("،")?.[0]?.trim())
          .filter(Boolean)
      )
    );
    return uniqueAddresses.map((loc) => ({
      label: String(loc),
      value: String(loc),
    }));
  }, [data?.data]);

  const handleApplyFilter = (newFilters: Partial<GetHousesParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
      limit: 9,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMoreMobile = () => {
    setQueryParams((prev) => ({
      ...prev,
      limit: (prev.limit || 9) + 9,
    }));
  };

  const formatPrice = (val?: number | string) => {
    if (val === undefined || val === null || val === "") return "0";
    const num = Number(val);
    return isNaN(num) ? String(val) : num.toLocaleString("fa-IR");
  };

  const housesList = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="flex w-full flex-col items-center" dir="rtl">
      <MortgageFilterSection
        initialFilters={queryParams}
        locationOptions={dynamicLocationOptions}
        onApplyFilter={handleApplyFilter}
      />

      {isLoading && (
        <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:mt-8 lg:grid-cols-3">
          {Array.from({ length: queryParams.limit || 9 }).map((_, idx) => (
            <div
              key={idx}
              className="h-95 w-full animate-pulse rounded-[28px] bg-gray-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="my-16 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-base font-bold text-red-500">
            خطا در دریافت اطلاعات از سرور.
          </p>
        </div>
      )}

      {!isLoading && !isError && housesList.length > 0 && (
        <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:mt-8 lg:grid-cols-3">
          {housesList.map((house: HouseItem) => (
                      <Link
            key={house.id}
            // هدایت به صفحه دیتیل با آیدی واقعی هر خانه
            href={`/mortgage-rent/${house.id}`}
                  >
            <ProductCard
              key={house.id}
              image={house.photos?.[0] || house.image || ""}
              title={house.title}
              address={house.address}
              rating={Number(house.rate ?? house.rating ?? 0)}
              bedrooms={Number(house.rooms ?? house.bedrooms ?? 0)}
              bathrooms={Number(house.bathrooms ?? 0)}
              guests={Number(house.capacity ?? house.guests ?? 0)}
              parking={Number(house.parking ?? 0)}
              monthlyRent={formatPrice(house.rent ?? house.price)}
              pricePerNight={formatPrice(house.discounted_price ?? house.price)}
              off={house.discount ? Number(house.discount) : undefined}
              originalPrice={
                house.discount ? formatPrice(house.price) : undefined
              }
            />
            </Link>
          ))}
          
        </div>
      )}

      {!isLoading && !isError && housesList.length === 0 && (
        <div className="my-16 text-center text-base font-semibold text-gray-500 dark:text-gray-400">
          ملکی یافت نشد!
        </div>
      )}

      {!isLoading && !isError && housesList.length > 0 && (
        <div className="mt-8 mb-6 flex w-full justify-center md:hidden">
          <button
            type="button"
            onClick={handleLoadMoreMobile}
            disabled={isFetching}
            className="rounded-full border border-[#1e3a8a] bg-transparent px-8 py-2.5 text-sm font-bold text-[#1e3a8a] transition-colors hover:bg-blue-50 disabled:opacity-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-zinc-800"
          >
            {isFetching ? "در حال دریافت..." : "مشاهده بیشتر"}
          </button>
        </div>
      )}

      {!isLoading && !isError && totalPages > 1 && (
        <div className="mt-14 mb-8 hidden w-full justify-center md:flex">
          <Pagination
            currentPage={queryParams.page || 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MortgageRentContent;