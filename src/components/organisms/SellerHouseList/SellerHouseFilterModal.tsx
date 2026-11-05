"import client directive if needed"
"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import { Category } from "@/core/types/sellerHouse";
import RangeInput from "@/components/molecules/inputs/RangeInput";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  minPrice: number;
  maxPrice: number;
  categories?: Category[]; // اختیاری کردن برای جلوگیری از کرش
  selectedCategory?: string;
  onApply: (filters: { minPrice: number; maxPrice: number; category?: string }) => void;
}

export const SellerHouseFilterModal = ({
  isOpen,
  onClose,
  minPrice,
  maxPrice,
  categories = [], // مقدار پیش‌فرض آرایه خالی
  selectedCategory,
  onApply,
}: Props) => {
  const [priceRange, setPriceRange] = useState<number[]>([
    minPrice || 0,
    maxPrice || 10000000000,
  ]);
  const [category, setCategory] = useState<string | undefined>(selectedCategory);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 p-6 shadow-xl transition-all border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">فیلتر ها</h3>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* فیلتر دسته‌بندی */}
  <div className="space-y-3">
  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">نوع ملک (دسته‌بندی)</p>
  <select
    value={category || ""}
    onChange={(e) => setCategory(e.target.value || undefined)}
    className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
  >
    <option value="">همه دسته‌ها</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.name}>
        {cat.name}
      </option>
    ))}
  </select>
</div>

          {/* رنج قیمت */}
          <div className="space-y-3">
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">رنج قیمت</p>
            <RangeInput
              value={priceRange}
              setValue={setPriceRange}
              min={0}
              max={10000000000}
              step={50000000}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button variant="primary" className="flex-1 py-2.5" onClick={handleApply}>
            اعمال فیلتر
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-zinc-300 dark:border-zinc-700 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition text-center"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};