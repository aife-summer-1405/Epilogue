"use client";

import React, { useState } from "react";
import Button from "@/components/atoms/button/Button";
import DrawerComponent from "@/components/molecules/drawer/Drawer";
import { DrawerClose } from "@/components/ui/drawer";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { IFilterInputs } from "@/components/molecules/inputs/filterInput/IFilterInput";
import { IHouseParams } from "@/core/types/houses/houseParams.types";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon } from "@hugeicons/core-free-icons";

interface MortgageFilterSectionProps {
  initialFilters: IHouseParams;
  locationOptions: IFilterInputs[];
  onApplyFilter: (filters: Partial<IHouseParams>) => void;
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

const GRID_CLASS =
  "grid w-full grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12";

const SEARCH_CELL =
  "flex min-w-0 2xl:max-w-124 flex-col gap-3 sm:col-span-2 lg:col-span-6 xl:col-span-4";

const FIELD_CELL = "min-w-0 lg:col-span-2 xl:col-span-2 w-full xl:w-52";

const SELECT_STYLE =
  "[&_p]:!text-gray-900 dark:[&_p]:!text-white [&_div[data-slot=combobox-input]]:!rounded-full [&_div[data-slot=combobox-input]]:!bg-gray-100 dark:[&_div[data-slot=combobox-input]]:!bg-[#1e1e1e] [&_input]:!text-gray-800 dark:[&_input]:!text-gray-100";

const SUBMIT_CELL = "flex min-w-0 sm:col-span-2 lg:col-span-6 xl:col-span-2";

const mobileTriggerClass =
  "flex items-center justify-center gap-1.5 rounded-full border border-[#1e3a8a] bg-white px-5 py-2 text-xs font-bold text-[#1e3a8a] transition-colors dark:border-blue-400 dark:bg-[#1e1e1e] dark:text-blue-400";

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
  value: number | undefined;
  onChange: (value: string) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  onChange,
}) => (
  <div className={`${FIELD_CELL} flex flex-col gap-3`}>
    <label className="text-base text-default-black font-semibold">
      {label}
    </label>
    <div className="flex h-12 items-center rounded-full bg-neutral-200 px-4 dark:bg-[#353535]">
      <input
        type="number"
        placeholder="وارد کنید"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 bg-transparent text-base! leading-5.5! font-normal text-default-black! placeholder:text-neutral-800! focus:outline-none"
      />
    </div>
  </div>
);

interface FilterFieldsProps {
  showSort: boolean;
  localFilters: Partial<IHouseParams>;
  locationOptions: IFilterInputs[];
  onSearchChange: (value: string) => void;
  onFieldChange: (
    field: keyof IHouseParams,
    rawValue: unknown,
    isNumeric?: boolean,
  ) => void;
  children?: React.ReactNode;
}

const FilterFields: React.FC<FilterFieldsProps> = ({
  showSort,
  localFilters,
  locationOptions,
  onSearchChange,
  onFieldChange,
  children,
}) => (
  <div className={GRID_CLASS}>
    <div className={SEARCH_CELL}>
      <label className="text-base text-default-black font-semibold">
        جستجو
      </label>
      <div className="flex h-12 items-center rounded-full bg-neutral-200 px-4 dark:bg-[#353535]">
        <input
          type="text"
          placeholder="نام هتل یا منطقه مورد نظر..."
          value={localFilters.search || ""}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full min-w-0 bg-transparent text-base! leading-5.5! font-normal text-default-black! placeholder:text-neutral-800! focus:outline-none"
        />
      </div>
    </div>
    {showSort && (
      <div className={`${FIELD_CELL} ${SELECT_STYLE}`}>
        <FilterInput
          isTitle="مرتب سازی بر اساس"
          placeHolder="انتخاب کنید"
          items={SORT_OPTIONS}
          onValueChange={(val) => onFieldChange("sort", val)}
          className="w-full xl:w-52"
        />
      </div>
    )}
    <div className={`${FIELD_CELL} ${SELECT_STYLE}`}>
      <FilterInput
        isTitle="محل مورد نظر"
        placeHolder="انتخاب کنید"
        items={locationOptions}
        onValueChange={(val) => onFieldChange("location", val)}
        className="w-full xl:w-52"
      />
    </div>
    <div className={`${FIELD_CELL} ${SELECT_STYLE}`}>
      <FilterInput
        isTitle="نوع ملک"
        placeHolder="انتخاب کنید"
        items={PROPERTY_TYPE_OPTIONS}
        onValueChange={(val) => onFieldChange("propertyType", val)}
        className="w-full xl:w-52"
      />
    </div>
    <div className={`${FIELD_CELL} ${SELECT_STYLE}`}>
      <FilterInput
        isTitle="نوع معامله"
        placeHolder="انتخاب کنید"
        items={TRANSACTION_TYPE_OPTIONS}
        onValueChange={(val) => onFieldChange("transactionType", val)}
        className="w-full xl:w-52"
      />
    </div>
    <NumberField
      label="حداکثر قیمت"
      value={localFilters.maxPrice}
      onChange={(v) => onFieldChange("maxPrice", v, true)}
    />
    <NumberField
      label="حداقل اجاره"
      value={localFilters.minRent}
      onChange={(v) => onFieldChange("minRent", v, true)}
    />
    <NumberField
      label="حداکثر اجاره"
      value={localFilters.maxRent}
      onChange={(v) => onFieldChange("maxRent", v, true)}
    />
    <NumberField
      label="حداقل متراژ"
      value={localFilters.minArea}
      onChange={(v) => onFieldChange("minArea", v, true)}
    />
    <NumberField
      label="حداکثر متراژ"
      value={localFilters.maxArea}
      onChange={(v) => onFieldChange("maxArea", v, true)}
    />
    {children}
  </div>
);

const MortgageFilterSection: React.FC<MortgageFilterSectionProps> = ({
  initialFilters,
  locationOptions,
  onApplyFilter,
}) => {
  const [localFilters, setLocalFilters] =
    useState<Partial<IHouseParams>>(initialFilters);

  const extractValue = (val: unknown): string | undefined => {
    if (!val) return undefined;
    if (typeof val === "string") return val;
    if (typeof val === "object" && "value" in val) {
      return String((val as { value: unknown }).value);
    }
    return undefined;
  };

  const handleFieldChange = (
    field: keyof IHouseParams,
    rawValue: unknown,
    isNumeric = false,
  ) => {
    const val = extractValue(rawValue);
    setLocalFilters((prev) => ({
      ...prev,
      [field]: val ? (isNumeric ? Number(val) : val) : undefined,
    }));
  };

  const handleSearchChange = (value: string) =>
    setLocalFilters((prev) => ({ ...prev, search: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilter(localFilters);
  };

  const handleSortSelect = (value: string) => {
    const updated: Partial<IHouseParams> = {
      ...localFilters,
      sort: value as IHouseParams["sort"],
    };
    setLocalFilters(updated);
    onApplyFilter(updated);
  };

  return (
    <div className="w-full" dir="rtl">
      <div className="mb-4 flex w-full items-center justify-center gap-3 rounded-full bg-gray-100 p-2 dark:bg-[#272727] lg:hidden">
        <DrawerComponent
          title="مرتب‌سازی بر اساس"
          trigger={
            <Button
              type="button"
              startIcon={<SortIcon />}
              variant="outline"
              size="sm"
              state={"default"}
            >
              مرتب سازی
            </Button>
          }
          className="rounded-t-[2rem] bg-white dark:bg-[#272727]"
        >
          <div dir="rtl" className="flex flex-col gap-2 px-4 pb-6 pt-4">
            {SORT_OPTIONS.map((opt) => {
              const isSelected = localFilters.sort === opt.value;
              return (
                <DrawerClose
                  key={opt.value}
                  onClick={() => handleSortSelect(String(opt.value))}
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
              startIcon={<HugeiconsIcon icon={FilterIcon} />}
              variant="outline"
              size="sm"
              state={"default"}
            >
              فیلتر
            </Button>
          }
          className="max-h-[90dvh] rounded-t-[2rem] bg-white dark:bg-[#272727]"
          close={
            <Button
              type="button"
              onClick={() => onApplyFilter(localFilters)}
              startIcon={<HugeiconsIcon icon={FilterIcon} />}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full  text-sm font-bold text-white"
            >
              اعمال فیلتر
            </Button>
          }
        >
          <div dir="rtl" className="overflow-y-auto px-4 pb-4">
            <FilterFields
              showSort={false}
              localFilters={localFilters}
              locationOptions={locationOptions}
              onSearchChange={handleSearchChange}
              onFieldChange={handleFieldChange}
            />
          </div>
        </DrawerComponent>
      </div>
      <form
        onSubmit={handleSubmit}
        className="hidden w-full rounded-3xl bg-white p-6 shadow-sm dark:bg-[#272727] lg:block"
      >
        <FilterFields
          showSort
          localFilters={localFilters}
          locationOptions={locationOptions}
          onSearchChange={handleSearchChange}
          onFieldChange={handleFieldChange}
        >
          <div className={SUBMIT_CELL}>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="h-12 w-full xl:w-52 bg-[#1e3a8a] text-sm text-white hover:bg-blue-900"
              startIcon={<HugeiconsIcon icon={FilterIcon} />}
            >
              اعمال فیلتر
            </Button>
          </div>
        </FilterFields>
      </form>
    </div>
  );
};

export default MortgageFilterSection;
