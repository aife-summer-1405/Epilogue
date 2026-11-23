"use client";

import { FormEvent, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Category } from "@/core/types/category";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import {
  formatCategoryFa,
  normalizeCategoryToApi,
  toPersianDigits,
} from "@/lib/formatters/house";

interface CategoryFormModalProps {
  category: Category | null; 
  onClose: () => void;
}

export function CategoryFormModal({
  category,
  onClose,
}: CategoryFormModalProps) {
  const isEdit = Boolean(category);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const [name, setName] = useState(
    category ? formatCategoryFa(category.name) : ""
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;

    const apiName = /[a-zA-Z]/.test(clean)
      ? normalizeCategoryToApi(clean)
      : clean;

    if (isEdit && category) {
      await updateMutation.mutateAsync({
        id: category.id,
        payload: { name: apiName },
      });
    } else {
      await createMutation.mutateAsync({ name: apiName });
    }

    onClose();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold">
              {isEdit
                ? `ویرایش دسته‌بندی #${toPersianDigits(category!.id)}`
                : "افزودن دسته‌بندی جدید"}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-800 dark:text-neutral-600">
              {isEdit ? "" : " "}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-neutral-800 dark:text-neutral-600">
              نام دسته‌بندی
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: سوئیت، ویلا باغ، پنت‌هاوس..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3.5 py-2.5 text-xs sm:text-sm text-default-text outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-neutral-200 dark:border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-4 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2 text-xs font-bold text-white transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isPending
                ? "در حال ذخیره..."
                : isEdit
                  ? "ذخیره تغییرات"
                  : "ثبت دسته‌بندی"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}