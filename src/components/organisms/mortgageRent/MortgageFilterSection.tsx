"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/atoms/button/Button";
import DrawerComponent from "@/components/molecules/drawer/Drawer";
import { DrawerClose } from "@/components/ui/drawer";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { IFilterInputs } from "@/components/molecules/inputs/filterInput/IFilterInput";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, FilterRemoveIcon } from "@hugeicons/core-free-icons";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallBack";
import { useGetLocations } from "@/hooks/queries/useGetLocations";
import { ILocations } from "@/core/types/locations/locations.types";

interface MortgageFilterSectionProps {
  totalCount: number;
  fallbackLocations?: IFilterInputs[];
}

const FILTER_KEYS = [
  "page",
  "limit",
  "transactionType",
  "search",
  "order",
  "sort",
  "propertyType",
  "location",
  "minPrice",
  "maxPrice",
  "minRent",
  "maxRent",
  "minMortgage",
  "maxMortgage",
  "minArea",
  "maxArea",
] as const;

const SORT_OPTIONS: IFilterInputs[] = [
  { label: "بروزترین", value: "last_updated" },
  { label: "جدیدترین", value: "created_at" },
  { label: "ارزان‌ترین", value: "ascPrice" },
  { label: "گران‌ترین", value: "price" },
  { label: "متراژ", value: "area" },
];

const PROPERTY_TYPE_OPTIONS: IFilterInputs[] = [
  { label: "آپارتمان", value: "apartment" },
  { label: "ویلا", value: "villa" },
  { label: "خانه", value: "house" },
  { label: "زمین", value: "land" },
  { label: "تجاری", value: "commercial" },
];

const TRANSACTION_TYPE_OPTIONS: IFilterInputs[] = [
  { label: "رهن", value: "mortgage" },
  { label: "اجاره", value: "rental" },
  { label: "رزرو", value: "reservation" },
];

const GRID_CLASS =
  "grid w-full grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12";

const SEARCH_CELL =
  "flex min-w-0 2xl:max-w-124 flex-col gap-3 sm:col-span-2 lg:col-span-6 xl:col-span-4";

const FIELD_CELL = "min-w-0 lg:col-span-2 xl:col-span-2 w-full xl:w-52";

const SELECT_STYLE =
  "[&_p]:!text-gray-900 dark:[&_p]:!text-white [&_div[data-slot=combobox-input]]:!rounded-full [&_div[data-slot=combobox-input]]:!bg-gray-100 dark:[&_div[data-slot=combobox-input]]:!bg-[#1e1e1e] [&_input]:!text-gray-800 dark:[&_input]:!text-gray-100";

const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
}) => (
  <div className={`${FIELD_CELL} flex flex-col gap-3`}>
    <label className="text-base font-semibold text-default-black dark:text-white">
      {label}
    </label>
    <div className="flex h-12 items-center rounded-full bg-neutral-200 px-4 dark:bg-[#353535]">
      <input
        type="number"
        placeholder="وارد کنید"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 bg-transparent text-base! leading-5.5! font-normal text-default-black! placeholder:text-neutral-800! focus:outline-none dark:text-white! dark:placeholder:text-gray-400!"
      />
    </div>
  </div>
);

const MortgageFilterSection: React.FC<MortgageFilterSectionProps> = ({
  totalCount,
  fallbackLocations = [],
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const { data: locationsData, isLoading: isLocationsLoading } =
    useGetLocations();

  const locationOptions = useMemo<IFilterInputs[]>(() => {
    const apiLocs = (locationsData?.data ?? []).map((loc: ILocations) => ({
      ...loc,
      label: loc.areaName,
      value: loc.areaName,
    }));
    return apiLocs.length > 0 ? apiLocs : fallbackLocations;
  }, [locationsData, fallbackLocations]);

  const [locationsValue, setLocationsValue] = useState<null | IFilterInputs>(
    () => {
      const loc = searchParams.get("location");
      return loc ? { label: loc, value: loc } : null;
    },
  );

  const [propertyTypesValue, setPropertyTypesValue] =
    useState<null | IFilterInputs>(() => {
      const pt = searchParams.get("propertyType");
      return PROPERTY_TYPE_OPTIONS.find((o) => o.value === pt) ?? null;
    });

  const [transactionTypesValue, setTransactionTypesValue] =
    useState<null | IFilterInputs>(() => {
      const tt = searchParams.get("transactionType");
      return TRANSACTION_TYPE_OPTIONS.find((o) => o.value === tt) ?? null;
    });

  const [sortValue, setSortValue] = useState<null | IFilterInputs>(() => {
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    if (sort === "price" && order === "ASC") {
      return { label: "ارزان‌ترین", value: "ascPrice" };
    }
    return SORT_OPTIONS.find((o) => o.value === sort) ?? null;
  });

  const [searchValue, setSearchValue] = useState(
    () => searchParams.get("search") ?? "",
  );
  const [maxPriceValue, setMaxPriceValue] = useState(
    () => searchParams.get("maxPrice") ?? "",
  );
  const [minRentValue, setMinRentValue] = useState(
    () => searchParams.get("minRent") ?? "",
  );
  const [maxRentValue, setMaxRentValue] = useState(
    () => searchParams.get("maxRent") ?? "",
  );
  const [minAreaValue, setMinAreaValue] = useState(
    () => searchParams.get("minArea") ?? "",
  );
  const [maxAreaValue, setMaxAreaValue] = useState(
    () => searchParams.get("maxArea") ?? "",
  );

  const updateUrlParam = (key: string, value: string | null) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    nextParams.set("page", "1");
    router.push(`?${nextParams.toString()}`, { scroll: false });
  };

  const debouncedSearch = useDebouncedCallback((val: string) => {
    updateUrlParam("search", val.trim() === "" ? null : val.trim());
  }, 800);

  const debouncedMaxPrice = useDebouncedCallback((val: string) => {
    updateUrlParam("maxPrice", val === "" ? null : val);
  }, 800);

  const debouncedMinRent = useDebouncedCallback((val: string) => {
    updateUrlParam("minRent", val === "" ? null : val);
  }, 800);

  const debouncedMaxRent = useDebouncedCallback((val: string) => {
    updateUrlParam("maxRent", val === "" ? null : val);
  }, 800);

  const debouncedMinArea = useDebouncedCallback((val: string) => {
    updateUrlParam("minArea", val === "" ? null : val);
  }, 800);

  const debouncedMaxArea = useDebouncedCallback((val: string) => {
    updateUrlParam("maxArea", val === "" ? null : val);
  }, 800);

  const handleSortChange = (selected: IFilterInputs | null) => {
    setSortValue(selected);
    const nextParams = new URLSearchParams(searchParams.toString());

    if (!selected?.value) {
      nextParams.delete("sort");
      nextParams.delete("order");
    } else if (selected.value === "ascPrice") {
      nextParams.set("sort", "price");
      nextParams.set("order", "ASC");
    } else {
      nextParams.set("sort", String(selected.value));
      nextParams.set("order", "DESC");
    }

    nextParams.set("page", "1");
    router.push(`?${nextParams.toString()}`, { scroll: false });
  };

  const handleResetAllFilters = () => {
    FILTER_KEYS.forEach((key) => params.delete(key));
    setSearchValue("");
    setMaxPriceValue("");
    setMinRentValue("");
    setMaxRentValue("");
    setMinAreaValue("");
    setMaxAreaValue("");
    setLocationsValue(null);
    setPropertyTypesValue(null);
    setTransactionTypesValue(null);
    setSortValue(null);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const renderFilterInputs = (showSort: boolean) => (
    <div className={GRID_CLASS}>
      <div className={SEARCH_CELL}>
        <label className="text-base font-semibold text-default-black dark:text-white">
          جستجو
        </label>
        <div className="flex h-12 items-center rounded-full bg-neutral-200 px-4 dark:bg-[#353535]">
          <input
            type="text"
            placeholder="نام هتل یا منطقه مورد نظر..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="w-full min-w-0 bg-transparent text-base! leading-5.5! font-normal text-default-black! placeholder:text-neutral-800! focus:outline-none dark:text-white! dark:placeholder:text-gray-400!"
          />
        </div>
      </div>

      {/* مرتب‌سازی */}
      {showSort && (
        <div className={`${FIELD_CELL} ${SELECT_STYLE}`}>
          <FilterInput
            isTitle="مرتب سازی بر اساس"
            placeHolder="انتخاب کنید"
            items={SORT_OPTIONS}
            value={sortValue}
            onValueChange={(val) => handleSortChange(val)}
            className="w-full xl:w-52"
          />
        </div>
      )}

      <div className={`${FIELD_CELL} ${SELECT_STYLE}`}>
        <FilterInput
          isTitle="محل مورد نظر"
          placeHolder="انتخاب کنید"
          items={locationOptions}
          value={locationsValue}
          onValueChange={(val) => {
            setLocationsValue(val);
            updateUrlParam("location", val?.value ? String(val.value) : null);
          }}
          className="w-full xl:w-52"
        />
      </div>

      <div className={`${FIELD_CELL} ${SELECT_STYLE}`}>
        <FilterInput
          isTitle="نوع ملک"
          placeHolder="انتخاب کنید"
          items={PROPERTY_TYPE_OPTIONS}
          value={propertyTypesValue}
          onValueChange={(val) => {
            setPropertyTypesValue(val);
            updateUrlParam(
              "propertyType",
              val?.value ? String(val.value) : null,
            );
          }}
          className="w-full xl:w-52"
        />
      </div>

      <div className={`${FIELD_CELL} ${SELECT_STYLE}`}>
        <FilterInput
          isTitle="نوع معامله"
          placeHolder="انتخاب کنید"
          items={TRANSACTION_TYPE_OPTIONS}
          value={transactionTypesValue}
          onValueChange={(val) => {
            setTransactionTypesValue(val);
            updateUrlParam(
              "transactionType",
              val?.value ? String(val.value) : null,
            );
          }}
          className="w-full xl:w-52"
        />
      </div>
      <NumberField
        label="حداکثر قیمت"
        value={maxPriceValue}
        onChange={(v) => {
          setMaxPriceValue(v);
          debouncedMaxPrice(v);
        }}
      />
      <NumberField
        label="حداقل اجاره"
        value={minRentValue}
        onChange={(v) => {
          setMinRentValue(v);
          debouncedMinRent(v);
        }}
      />
      <NumberField
        label="حداکثر اجاره"
        value={maxRentValue}
        onChange={(v) => {
          setMaxRentValue(v);
          debouncedMaxRent(v);
        }}
      />
      <NumberField
        label="حداقل متراژ"
        value={minAreaValue}
        onChange={(v) => {
          setMinAreaValue(v);
          debouncedMinArea(v);
        }}
      />
      <NumberField
        label="حداکثر متراژ"
        value={maxAreaValue}
        onChange={(v) => {
          setMaxAreaValue(v);
          debouncedMaxArea(v);
        }}
      />

      <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-6 xl:col-span-2">
        <Button
          type="button"
          hasIcon={false}
          className="h-10 flex-1 text-xs lg:h-12 lg:text-sm"
        >
          {totalCount} آگهی پیدا شد
        </Button>

        <Button
          type="button"
          variant="danger"
          onClick={handleResetAllFilters}
          className="h-10 px-3 text-xs lg:h-12 lg:text-sm"
          startIcon={
            <HugeiconsIcon
              icon={FilterRemoveIcon}
              className="size-4.5"
              stroke="1.5"
            />
          }
        >
          حذف فیلتر
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full" dir="rtl">
      <div className="mb-4 flex w-full flex-wrap items-center justify-center gap-2.5 rounded-full bg-gray-100 p-2 dark:bg-[#272727] lg:hidden">
        <DrawerComponent
          title="مرتب‌سازی بر اساس"
          trigger={
            <Button
              type="button"
              startIcon={<SortIcon />}
              variant="outline"
              size="sm"
              state="default"
            >
              مرتب سازی
            </Button>
          }
          className="rounded-t-[2rem] bg-white dark:bg-[#272727]"
        >
          <div dir="rtl" className="flex flex-col gap-2 px-4 pt-4 pb-6">
            {SORT_OPTIONS.map((opt) => {
              const isSelected = sortValue?.value === opt.value;
              return (
                <DrawerClose
                  key={opt.value}
                  onClick={() => handleSortChange(opt)}
                  render={
                    <button
                      type="button"
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-right text-sm font-semibold transition-colors ${
                        isSelected
                          ? "bg-blue-50 text-[#1e3a8a] dark:bg-[#1e1e1e] dark:text-blue-400"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800"
                      }`}
                    />
                  }
                >
                  <span>{opt.label}</span>
                  {isSelected && <CheckIcon />}
                </DrawerClose>
              );
            })}
          </div>
        </DrawerComponent>

        <DrawerComponent
          title="فیلتر"
          trigger={
            <Button
              type="button"
              startIcon={<HugeiconsIcon icon={FilterIcon} />}
              variant="outline"
              size="sm"
              state="default"
            >
              فیلتر
            </Button>
          }
          className="max-h-[90dvh] rounded-t-[2rem] bg-white dark:bg-[#272727]"
        >
          <div dir="rtl" className="overflow-y-auto px-4 pb-6">
            {renderFilterInputs(false)}
          </div>
        </DrawerComponent>

        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={handleResetAllFilters}
          startIcon={
            <HugeiconsIcon
              icon={FilterRemoveIcon}
              className="size-4"
              stroke="1.5"
            />
          }
        >
          حذف فیلتر
        </Button>
      </div>

      <div className="hidden w-full rounded-3xl bg-white p-6 shadow-sm dark:bg-[#272727] lg:block">
        {renderFilterInputs(true)}
      </div>
    </div>
  );
};

export default MortgageFilterSection;
