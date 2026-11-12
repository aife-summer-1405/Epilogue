"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/button/Button";
import {
  useComparisonStore,
  MIN_COMPARE_ITEMS,
  MAX_COMPARE_ITEMS,
} from "@/store/comparison.store";

const ComparisonBar: React.FC = () => {
  const router = useRouter();
  const selectedIds = useComparisonStore((state) => state.selectedIds);
  const { clearAll, validateCanCompare } = useComparisonStore(
    (state) => state.actions,
  );

  if (selectedIds.length === 0) return null;

  const isEnoughForCompare = selectedIds.length >= MIN_COMPARE_ITEMS;

  const handleNavigateToCompare = () => {
    if (!validateCanCompare()) return;
    router.push(`/comparison?ids=${selectedIds.join(",")}`);
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-11/12 max-w-xl items-center justify-between gap-4 rounded-full border border-gray-200 bg-white/95 px-5 py-3 shadow-xl backdrop-blur-md dark:border-zinc-700 dark:bg-[#272727]/95"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a8a] text-sm font-bold text-white">
          {selectedIds.length}
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-800 sm:text-sm dark:text-white">
            ملک برای مقایسه انتخاب شده (حداکثر {MAX_COMPARE_ITEMS} مورد)
          </span>
          {!isEnoughForCompare && (
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
              حداقل {MIN_COMPARE_ITEMS - selectedIds.length} ملک دیگر برای شروع
              مقایسه انتخاب کنید
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="danger"
          size="sm"
          hasIcon={false}
          onClick={clearAll}
          className="h-10 rounded-full px-4 text-xs"
        >
          پاک کردن
        </Button>

        <Button
          type="button"
          variant="primary"
          size="sm"
          hasIcon={false}
          onClick={handleNavigateToCompare}
          className={`h-10 rounded-full bg-[#1e3a8a] px-5 text-xs font-bold text-white transition-opacity ${
            !isEnoughForCompare
              ? "cursor-not-allowed opacity-60"
              : "hover:bg-blue-900"
          }`}
        >
          مقایسه املاک
        </Button>
      </div>
    </div>
  );
};

export default ComparisonBar;
