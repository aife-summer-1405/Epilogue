"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { SocialMediaLink } from "@/core/types/social";
import { formatPlatformFa } from "@/lib/formatters/social";
import { toPersianDigits } from "@/lib/formatters/house";

interface SocialDeleteConfirmModalProps {
  item: SocialMediaLink | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void> | void;
}

export function SocialDeleteConfirmModal({
  item,
  onClose,
  onConfirm,
}: SocialDeleteConfirmModalProps) {
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await onConfirm(item.id);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
          <div className="flex items-center gap-2 text-danger-600 dark:text-danger-400">
            <HugeiconsIcon icon={Delete02Icon} size={20} color="currentColor" />
            <h2 className="text-base font-extrabold">حذف شبکه اجتماعی</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
          </button>
        </div>

        <p className="mt-4 text-xs sm:text-sm leading-6 text-neutral-800 dark:text-neutral-600">
          آیا از حذف شبکه اجتماعی{" "}
          <strong className="text-default-text">
            «{formatPlatformFa(item.platform)}»
          </strong>{" "}
          (شناسه {toPersianDigits(item.id)}) مطمئن هستید؟
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-4 py-2 text-xs font-bold text-default-text hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="rounded-xl bg-danger-600 hover:bg-danger-700 px-4 py-2 text-xs font-bold text-white transition-colors disabled:opacity-60 cursor-pointer"
          >
            {submitting ? "در حال حذف..." : "تایید و حذف"}
          </button>
        </div>
      </div>
    </div>
  );
}