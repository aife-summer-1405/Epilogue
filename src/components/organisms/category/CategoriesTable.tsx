"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Category } from "@/core/types/category";
import { formatCategoryFa, toPersianDigits } from "@/lib/formatters/house";

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (!isLoading && categories.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-10 text-center">
        <p className="text-sm font-bold text-default-text">
          دسته‌بندی‌ای یافت نشد
        </p>
        <p className="mt-1 text-xs text-neutral-800 dark:text-neutral-600">
          عبارت جستجو را تغییر دهید یا دسته‌بندی جدیدی ثبت کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] border-collapse text-right">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-100 bg-neutral-100/70 dark:bg-neutral-50/50 text-xs font-extrabold text-neutral-800 dark:text-neutral-600">
              <th className="px-4 py-3.5">شناسه</th>
              <th className="px-4 py-3.5">نام دسته‌بندی به فارسی</th>
              <th className="px-4 py-3.5">مقدار ثبت‌شده</th>
              <th className="px-4 py-3.5 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-xs sm:text-sm">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-neutral-100/50 dark:hover:bg-neutral-50/30 transition-colors"
              >
                <td className="px-4 py-3.5 font-bold text-default-text">
                  {toPersianDigits(cat.id)}#
                </td>
                <td className="px-4 py-3.5 font-extrabold text-default-text">
                  {formatCategoryFa(cat.name)}
                </td>
                <td className="px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-600">
                  {toPersianDigits(cat.name)}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(cat)}
                      title="ویرایش "
                      className="rounded-xl border border-primary-300 dark:border-primary-700 bg-primary-50/70 dark:bg-primary-100/20 p-2 text-primary-600 dark:text-primary-800 hover:bg-primary-100 transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon
                        icon={PencilEdit02Icon}
                        size={16}
                        color="currentColor"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(cat)}
                      title="حذف "
                      className="rounded-xl border border-danger-300 dark:border-danger-700 bg-danger-50/70 dark:bg-danger-900/20 p-2 text-danger-600 dark:text-danger-400 hover:bg-danger-100 transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon
                        icon={Delete02Icon}
                        size={16}
                        color="currentColor"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}