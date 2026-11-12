"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterRemoveIcon } from "@hugeicons/core-free-icons";
import FilterInput from "../../molecules/inputs/filterInput/FilterInput";
import { IFilterInputs } from "../../molecules/inputs/filterInput/IFilterInput";
import { GetBlogsParams } from "@/services/blogs/blogs.service";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallBack";

interface BlogsFilterSectionProps {
  categoryOptions: IFilterInputs[];
}

const BLOG_FILTER_KEYS = [
  "page",
  "limit",
  "sort",
  "order",
  "title",
  "category_id",
  "author_id",
] as const;

const SORT_TABS: {
  label: string;
  value: NonNullable<GetBlogsParams["sort"]>;
}[] = [
  { label: "آخرین بروزرسانی", value: "updated_at" },
  { label: "جدید ترین", value: "created_at" },
  { label: "پر بازدید ترین", value: "views" },
];

const BlogsFilterSection: React.FC<BlogsFilterSectionProps> = ({
  categoryOptions,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const currentSort =
    (searchParams.get("sort") as GetBlogsParams["sort"]) || "created_at";

  const [searchValue, setSearchValue] = useState(
    () => searchParams.get("title") ?? "",
  );

  const [selectedCategory, setSelectedCategory] =
    useState<IFilterInputs | null>(() => {
      const catId = searchParams.get("category_id");
      if (!catId) return null;
      return (
        categoryOptions.find((opt) => String(opt.value) === catId) ?? {
          label: `دسته‌بندی ${catId}`,
          value: catId,
        }
      );
    });

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

  const debouncedTitleSearch = useDebouncedCallback((val: string) => {
    updateUrlParam("title", val.trim() === "" ? null : val.trim());
  }, 500);

  const handleResetAll = () => {
    BLOG_FILTER_KEYS.forEach((key) => params.delete(key));
    setSearchValue("");
    setSelectedCategory(null);
    router.push(`?${params.toString()}`, { scroll: false });
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
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                debouncedTitleSearch(e.target.value);
              }}
              className="w-full bg-transparent text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className={`lg:col-span-3 ${filterWrapperClass}`}>
          <FilterInput
            isTitle="دسته بندی"
            placeHolder="انتخاب دسته‌بندی..."
            items={categoryOptions}
            value={selectedCategory}
            onValueChange={(val) => {
              setSelectedCategory(val);
              updateUrlParam(
                "category_id",
                val?.value ? String(val.value) : null,
              );
            }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 lg:col-span-5 lg:justify-end">
          {SORT_TABS.map((tab) => {
            const isActive = currentSort === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => updateUrlParam("sort", tab.value)}
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
            onClick={handleResetAll}
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
