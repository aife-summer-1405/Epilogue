"use client";

import { motion } from "framer-motion";
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
    <>
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right">
            <thead>
              <tr className="border-b border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50 text-xs font-bold text-neutral-800 dark:text-neutral-700">
                <th className="px-4 py-3.5">شناسه</th>
                <th className="px-4 py-3.5">نام دسته‌بندی به فارسی</th>
                <th className="px-4 py-3.5">مقدار ثبت‌شده</th>
                <th className="px-4 py-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-sm">
              {categories.map((cat, idx) => (
                <motion.tr
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(idx * 0.04, 0.4),
                  }}
                  className="group transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-50/60"
                >
                  <td className="px-4 py-3.5 font-bold text-default-text">
                    #{toPersianDigits(cat.id)}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-default-text">
                    {formatCategoryFa(cat.name)}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-600">
                    {toPersianDigits(cat.name)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(cat)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-primary-300 dark:border-primary-400/50 bg-primary-50 hover:bg-primary-100 dark:bg-primary-100/30 dark:hover:bg-primary-100/50 px-3 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-800 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={PencilEdit02Icon}
                          size={15}
                          color="currentColor"
                          strokeWidth={1.8}
                        />
                        <span>ویرایش</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(cat)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-danger-300 dark:border-danger-700/60 bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/30 dark:hover:bg-danger-900/50 px-3 py-1.5 text-xs font-bold text-danger-600 dark:text-danger-400 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          size={15}
                          color="currentColor"
                          strokeWidth={1.8}
                        />
                        <span>حذف</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.35) }}
            className="flex flex-col justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-default-text">
                {formatCategoryFa(cat.name)}
              </h3>

              <span className="shrink-0 rounded-lg bg-neutral-200 dark:bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800 dark:text-neutral-700">
                #{toPersianDigits(cat.id)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 border-y border-neutral-200 dark:border-neutral-100 py-2.5 text-xs">
              <span className="text-neutral-800 dark:text-neutral-600">
                مقدار ثبت‌شده:
              </span>
              <span className="font-semibold text-default-text">
                {toPersianDigits(cat.name)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(cat)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon
                  icon={PencilEdit02Icon}
                  size={15}
                  color="currentColor"
                />
                <span>ویرایش</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(cat)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/30 dark:hover:bg-danger-900/50 py-2 text-xs font-bold text-danger-600 dark:text-danger-400 transition-colors cursor-pointer"
              >
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={15}
                  color="currentColor"
                />
                <span>حذف</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}