"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/molecules/Pagination";
import ProductCard from "@/components/molecules/product-card/ProductCard";
import MortgageFilterSection from "./MortgageFilterSection";
import { useGetHouses } from "@/hooks/queries/useGetHouses";
import { IHouseItem } from "@/core/types/houses/houseItems.types";
import { IHouseParams } from "@/core/types/houses/houseParams.types";

const MortgageRentContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParams = useMemo<IHouseParams>(() => {
    const getStr = (k: string) => searchParams.get(k) || undefined;
    const getNum = (k: string) => {
      const val = searchParams.get(k);
      return val && !isNaN(Number(val)) ? Number(val) : undefined;
    };

    return {
      page: getNum("page") || 1,
      limit: getNum("limit") || 9,
      order: (getStr("order") as "ASC" | "DESC") || "DESC",
      sort: (getStr("sort") as IHouseParams["sort"]) || "last_updated",
      search: getStr("search"),
      location: getStr("location"),
      propertyType: getStr("propertyType"),
      transactionType: getStr("transactionType"),
      minPrice: getNum("minPrice"),
      maxPrice: getNum("maxPrice"),
      minRent: getNum("minRent"),
      maxRent: getNum("maxRent"),
      minMortgage: getNum("minMortgage"),
      maxMortgage: getNum("maxMortgage"),
      minArea: getNum("minArea"),
      maxArea: getNum("maxArea"),
    };
  }, [searchParams]);

  const { data, isLoading, isError, isFetching } = useGetHouses(queryParams);

  const dynamicLocationOptions = useMemo(() => {
    if (!data?.data) return [];
    const uniqueAddresses = Array.from(
      new Set(
        data.data
          .map((item) => item.address?.split("،")?.[0]?.trim())
          .filter(Boolean),
      ),
    );
    return uniqueAddresses.map((loc) => ({
      label: String(loc),
      value: String(loc),
    }));
  }, [data?.data]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  const handleLoadMoreMobile = () => {
    const params = new URLSearchParams(searchParams.toString());
    const nextLimit = (queryParams.limit || 9) + 9;
    params.set("limit", String(nextLimit));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const formatPrice = (val?: number | string) => {
    if (val === undefined || val === null || val === "") return "0";
    const num = Number(val);
    return isNaN(num) ? String(val) : num.toLocaleString("fa-IR");
  };

  const housesList = data?.data || [];
  const totalCount = data?.totalCount ?? housesList.length;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="flex w-full flex-col items-center" dir="rtl">
      <MortgageFilterSection
        totalCount={totalCount}
        fallbackLocations={dynamicLocationOptions}
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
          {housesList.map((house: IHouseItem) => (
            <Link key={house.id} href={`/mortgage-rent/${house.id}`}>
              <ProductCard
                slides={(house.photos || []).map((src) => ({
                  src,
                  alt: house.title,
                }))}
                title={house.title}
                address={house.address}
                rating={Number(house.rate ?? house.rating ?? 0)}
                bedrooms={Number(house.rooms ?? house.bedrooms ?? 0)}
                bathrooms={Number(house.bathrooms ?? 0)}
                guests={Number(house.capacity ?? house.guests ?? 0)}
                parking={Number(house.parking ?? 0)}
                monthlyRent={formatPrice(house.rent ?? house.price)}
                pricePerNight={formatPrice(
                  house.discounted_price ?? house.price,
                )}
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
