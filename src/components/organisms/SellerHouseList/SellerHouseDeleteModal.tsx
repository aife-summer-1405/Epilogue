"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const SellerHouseDeleteModal = ({ isOpen, onClose, onConfirm, isLoading }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 p-6 text-center shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-start">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-2 space-y-2">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            آیا از حذف مطمئن هستید ؟
          </h3>
          <p className="text-xs text-zinc-400">امکان برگشت پس از حذف وجود ندارد !</p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition disabled:opacity-50"
          >
            {isLoading ? "در حال حذف..." : "حذف کردن"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-zinc-300 dark:border-zinc-700 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};