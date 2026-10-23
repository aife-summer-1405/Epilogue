"use client";

import React, { useState } from "react";
import Button from "@/components/atoms/button/Button";
import FilterInput from "@/components/molecules/inputs/FilterInput";
import { GetHousesParams } from "@/services/houses/houses.service";
import { IFilterInputs } from "@/components/molecules/inputs/IFilterInput";

interface MortgageFilterSectionProps {
  initialFilters: GetHousesParams;
  locationOptions: IFilterInputs[];
  onApplyFilter: (filters: Partial<GetHousesParams>) => void;
}

const SORT_OPTIONS: IFilterInputs[] = [
  { label: "بروزترین", value: "last_updated" },
  { label: "جدیدترین", value: "created_at" },
  { label: "قیمت", value: "price" },
  { label: "متراژ", value: "area" },
];

const PROPERTY_TYPE_OPTIONS: IFilterInputs[] = [
  { label: "آپارتمان", value: "apartment" },
  { label: "ویلا", value: "villa" },
  { label: "خانه", value: "house" },
  { label: "زمین", value: "land" },
];

const TRANSACTION_TYPE_OPTIONS: IFilterInputs[] = [
  { label: "رهن", value: "mortgage" },
  { label: "اجاره", value: "rental" },
  { label: "رزرو", value: "reservation" },
];

const MAX_PRICE_OPTIONS = [
  { label: "تا ۵۰۰ میلیون تومان", value: "500000000" },
  { label: "تا ۱ میلیارد تومان", value: "1000000000" },
  { label: "تا ۳ میلیارد تومان", value: "3000000000" },
];

const MIN_RENT_OPTIONS = [
  { label: "از ۲ میلیون تومان", value: "2000000" },
  { label: "از ۵ میلیون تومان", value: "5000000" },
  { label: "از ۱۰ میلیون تومان", value: "10000000" },
];

const MAX_RENT_OPTIONS = [
  { label: "تا ۱۰ میلیون تومان", value: "10000000" },
  { label: "تا ۲۰ میلیون تومان", value: "20000000" },
  { label: "تا ۵۰ میلیون تومان", value: "50000000" },
];

const MIN_AREA_OPTIONS = [
  { label: "۵۰ متر", value: "50" },
  { label: "۸۰ متر", value: "80" },
  { label: "۱۲۰ متر", value: "120" },
];

const MAX_AREA_OPTIONS = [
  { label: "۱۰۰ متر", value: "100" },
  { label: "۱۵۰ متر", value: "150" },
  { label: "۳۰۰ متر", value: "300" },
];

const MortgageFilterSection: React.FC<MortgageFilterSectionProps> = ({
  initialFilters,
  locationOptions,
  onApplyFilter,
}) => {
  const [localFilters, setLocalFilters] = useState<Partial<GetHousesParams>>(initialFilters);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  const extractValue = (val: unknown): string | undefined => {
    if (!val) return undefined;
    if (typeof val === "string") return val;
    if (typeof val === "object" && "value" in val) {
      return String((val as { value: unknown }).value);
    }
    return undefined;
  };

  const handleFieldChange = (
    field: keyof GetHousesParams,
    rawValue: unknown,
    isNumeric = false
  ) => {
    const val = extractValue(rawValue);
    setLocalFilters((prev) => ({
      ...prev,
      [field]: val ? (isNumeric ? Number(val) : val) : undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilter(localFilters);
    setIsMobileFilterOpen(false);
  };

  const filterWrapperClass =
    "[&_p]:!text-gray-900 dark:[&_p]:!text-white [&_div[data-slot=combobox-input]]:!rounded-full [&_div[data-slot=combobox-input]]:!bg-gray-100 dark:[&_div[data-slot=combobox-input]]:!bg-[#1e1e1e] [&_input]:!text-gray-800 dark:[&_input]:!text-gray-100";

  return (
    <div className="w-full" dir="rtl">
      
      <div className="mb-4 flex w-full items-center justify-center gap-3 rounded-full bg-gray-100 p-2 dark:bg-[#272727] lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileSortOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-full border border-[#1e3a8a] bg-white px-5 py-2 text-xs font-bold text-[#1e3a8a] transition-colors dark:border-blue-400 dark:bg-[#1e1e1e] dark:text-blue-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
          </svg>
          <span>مرتب سازی</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileFilterOpen((prev) => !prev)}
          className="flex items-center justify-center gap-1.5 rounded-full border border-[#1e3a8a] bg-white px-5 py-2 text-xs font-bold text-[#1e3a8a] transition-colors dark:border-blue-400 dark:bg-[#1e1e1e] dark:text-blue-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
          <span>فیلتر</span>
        </button>
      </div>

      {isMobileSortOpen && (
        <div className="fixed inset-0 z-100 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-all sm:items-center">
          <div className="w-full animate-in slide-in-from-bottom-10 rounded-t-[2rem] bg-white p-6 shadow-xl dark:bg-[#272727] sm:max-w-sm sm:rounded-3xl sm:slide-in-from-bottom-0 sm:fade-in">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-zinc-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">مرتب‌سازی بر اساس</h3>
              <button 
                onClick={() => setIsMobileSortOpen(false)} 
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = localFilters.sort === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                    const updated: Partial<GetHousesParams> = {
                        ...localFilters,
                        sort: opt.value as GetHousesParams["sort"],
                    };
                    setLocalFilters(updated);
                    onApplyFilter(updated);
                    setIsMobileSortOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-right text-sm font-semibold transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-[#1e3a8a] dark:bg-[#1e1e1e] dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`${
          isMobileFilterOpen ? "flex" : "hidden lg:flex"
        } w-full flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm dark:bg-[#272727]`}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12">
          
          <div className="flex flex-col gap-3 lg:col-span-4">
            <label className="text-base leading-5.5 font-semibold text-gray-900 dark:text-white">
              جستجو
            </label>
            <div className="flex h-12 items-center rounded-full bg-gray-100 px-4 dark:bg-[#1e1e1e]">
              <input
                type="text"
                placeholder="نام هتل یا منطقه مورد نظر..."
                value={localFilters.search || ""}
                onChange={(e) =>
                  setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className={`lg:col-span-2 ${filterWrapperClass} hidden lg:block`}>
            <FilterInput
              isTitle="مرتب سازی بر اساس"
              placeHolder="انتخاب کنید"
              items={SORT_OPTIONS}
              onValueChange={(val) => handleFieldChange("sort", val)}
            />
          </div>

          <div className={`lg:col-span-2 ${filterWrapperClass}`}>
            <FilterInput
              isTitle="محل مورد نظر"
              placeHolder="انتخاب کنید"
              items={locationOptions}
              onValueChange={(val) => handleFieldChange("location", val)}
            />
          </div>

          <div className={`lg:col-span-2 ${filterWrapperClass}`}>
            <FilterInput
              isTitle="نوع ملک"
              placeHolder="انتخاب کنید"
              items={PROPERTY_TYPE_OPTIONS}
              onValueChange={(val) => handleFieldChange("propertyType", val)}
            />
          </div>

          <div className={`lg:col-span-2 ${filterWrapperClass}`}>
            <FilterInput
              isTitle="نوع معامله"
              placeHolder="انتخاب کنید"
              items={TRANSACTION_TYPE_OPTIONS}
              onValueChange={(val) => handleFieldChange("transactionType", val)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12">
          
          <div className="flex items-end gap-3 lg:col-span-2">
            <div className="flex w-full flex-col gap-3">
              <label className="text-base leading-5.5 font-semibold text-gray-900 dark:text-white">
                حداکثر قیمت
              </label>
              <div className="flex h-12 items-center rounded-full bg-gray-100 px-4 dark:bg-[#1e1e1e]">
                <input
                  type="number"
                  placeholder="وارد کنید"
                  value={localFilters.maxPrice ?? ""}
                  onChange={(e) => handleFieldChange("maxPrice", e.target.value, true)}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="mb-3 hidden h-6 w-px bg-gray-200 dark:bg-zinc-700 lg:block" />
          </div>

          <div className="flex items-end gap-3 lg:col-span-2">
            <div className="flex w-full flex-col gap-3">
              <label className="text-base leading-5.5 font-semibold text-gray-900 dark:text-white">
                حداقل اجاره
              </label>
              <div className="flex h-12 items-center rounded-full bg-gray-100 px-4 dark:bg-[#1e1e1e]">
                <input
                  type="number"
                  placeholder="وارد کنید"
                  value={localFilters.minRent ?? ""}
                  onChange={(e) => handleFieldChange("minRent", e.target.value, true)}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="mb-3 hidden h-6 w-px bg-gray-200 dark:bg-zinc-700 lg:block" />
          </div>

          <div className="flex items-end gap-3 lg:col-span-2">
            <div className="flex w-full flex-col gap-3">
              <label className="text-base leading-5.5 font-semibold text-gray-900 dark:text-white">
                حداکثر اجاره
              </label>
              <div className="flex h-12 items-center rounded-full bg-gray-100 px-4 dark:bg-[#1e1e1e]">
                <input
                  type="number"
                  placeholder="وارد کنید"
                  value={localFilters.maxRent ?? ""}
                  onChange={(e) => handleFieldChange("maxRent", e.target.value, true)}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="mb-3 hidden h-6 w-px bg-gray-200 dark:bg-zinc-700 lg:block" />
          </div>

          <div className="flex items-end gap-3 lg:col-span-2">
            <div className="flex w-full flex-col gap-3">
              <label className="text-base leading-5.5 font-semibold text-gray-900 dark:text-white">
                حداقل متراژ
              </label>
              <div className="flex h-12 items-center rounded-full bg-gray-100 px-4 dark:bg-[#1e1e1e]">
                <input
                  type="number"
                  placeholder="وارد کنید"
                  value={localFilters.minArea ?? ""}
                  onChange={(e) => handleFieldChange("minArea", e.target.value, true)}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="mb-3 hidden h-6 w-px bg-gray-200 dark:bg-zinc-700 lg:block" />
          </div>

          <div className="flex flex-col gap-3 lg:col-span-2">
            <label className="text-base leading-5.5 font-semibold text-gray-900 dark:text-white">
              حداکثر متراژ
            </label>
            <div className="flex h-12 items-center rounded-full bg-gray-100 px-4 dark:bg-[#1e1e1e]">
              <input
                type="number"
                placeholder="وارد کنید"
                value={localFilters.maxArea ?? ""}
                onChange={(e) => handleFieldChange("maxArea", e.target.value, true)}
                className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex justify-end lg:col-span-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="h-12 w-full bg-[#1e3a8a] text-sm text-white hover:bg-blue-900"
              startIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
              }
            >
              اعمال فیلتر
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MortgageFilterSection;