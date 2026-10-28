"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterRemoveIcon } from "@hugeicons/core-free-icons";
import FilterInput from "../../molecules/inputs/filterInput/FilterInput";
import { IFilterInputs } from "../../molecules/inputs/filterInput/IFilterInput";
import { GetBlogsParams } from "@/services/blogs/blogs.service";

interface BlogsFilterSectionProps {
  filters: GetBlogsParams;
  categoryOptions: IFilterInputs[];
  onFilterChange: (newFilters: Partial<GetBlogsParams>) => void;
  onResetFilters: () => void;
}

const SORT_TABS: { label: string; value: GetBlogsParams["sort"] }[] = [
  { label: "آخرین بروزرسانی", value: "updated_at" },
  { label: "جدید ترین", value: "created_at" },
  { label: "پر بازدید ترین", value: "views" },
];

const BlogsFilterSection: React.FC<BlogsFilterSectionProps> = ({
  filters,
  categoryOptions,
  onFilterChange,
  onResetFilters,
}) => {
  const [searchInput, setSearchInput] = useState(filters.title || "");

  useEffect(() => {
    setSearchInput(filters.title || "");
  }, [filters.title]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.title || "")) {
        onFilterChange({ title: searchInput || undefined });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, filters.title, onFilterChange]);

  const extractCategoryValue = (val: unknown): number | undefined => {
    if (!val) return undefined;
    if (typeof val === "string" || typeof val === "number") return Number(val);
    if (typeof val === "object" && "value" in val) {
      return Number((val as { value: unknown }).value);
    }
    return undefined;
  };

  const filterWrapperClass =
    "[&_p]:!text-gray-900 dark:[&_p]:!text-white [&_div[data-slot=combobox-input]]:!h-[48px] [&_div[data-slot=combobox-input]]:!rounded-full [&_div[data-slot=combobox-input]]:!bg-gray-100 dark:[&_div[data-slot=combobox-input]]:!bg-[#1e1e1e] [&_input]:!text-gray-800 dark:[&_input]:!text-gray-100";

  return (
    <section
      className="w-full rounded-3xl bg-white p-4 shadow-sm dark:bg-[#272727] md:p-6"
      dir="rtl"
    >
      <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-3 lg:col-span-4">
          <label className="text-right text-sm font-bold text-gray-900 dark:text-white">
            جستجو
          </label>
          <div className="flex h-12 items-center rounded-full bg-gray-100 px-4 dark:bg-[#1e1e1e]">
            <input
              type="text"
              placeholder="عنوان مقاله مورد نظر..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className={`lg:col-span-3 ${filterWrapperClass}`}>
          <FilterInput
            isTitle="دسته بندی"
            placeHolder="انتخاب دسته‌بندی..."
            items={categoryOptions}
            onValueChange={(val) =>
              onFilterChange({ category_id: extractCategoryValue(val) })
            }
          />
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 lg:col-span-5 lg:justify-end">
          {SORT_TABS.map((tab) => {
            const isActive = filters.sort === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onFilterChange({ sort: tab.value })}
                className={`h-11 rounded-full border px-4 text-xs font-bold transition-all ${
                  isActive
                    ? "border-[#1e3a8a] bg-[#1e3a8a] text-white shadow-sm"
                    : "border-[#1e3a8a] bg-transparent text-[#1e3a8a] hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              onResetFilters();
            }}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-red-600 px-4 text-xs font-bold text-white transition-colors hover:bg-red-700"
          >
            <span>حذف</span>
            <HugeiconsIcon icon={FilterRemoveIcon} size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogsFilterSection;
