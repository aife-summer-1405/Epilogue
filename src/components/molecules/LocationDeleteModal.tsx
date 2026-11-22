"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import { toast } from "react-toastify";
import { useDeleteLocationMutation } from "@/hooks/useAdminLocations";
import type { LocationItem } from "@/core/types/location.types";

interface LocationDeleteModalProps {
  location: LocationItem | null;
  onClose: () => void;
}

export function LocationDeleteModal({
  location,
  onClose,
}: LocationDeleteModalProps) {
  const deleteMutation = useDeleteLocationMutation();

  const handleConfirmDelete = async () => {
    if (!location) return;
    try {
      await deleteMutation.mutateAsync(location.id);
      toast.success(`موقعیت «${location.areaName}» با موفقیت حذف شد.`);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "خطا در حذف موقعیت مکانی.");
    }
  };

  return (
    <AnimatePresence>
      {location && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="w-full max-w-md rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger-50 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400">
                <HugeiconsIcon
                  icon={Alert02Icon}
                  size={22}
                  color="currentColor"
                />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-default-text">
                  حذف موقعیت مکانی
                </h3>
                <p className="mt-0.5 text-xs text-neutral-800 dark:text-neutral-600">
                  این عملیات غیرقابل بازگشت است.
                </p>
              </div>
            </div>

            <p className="mt-4 rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3.5 text-xs sm:text-sm leading-6 text-default-text">
              آیا از حذف منطقه{" "}
              <strong className="text-danger-600 dark:text-danger-400">
                «{location.areaName}»
              </strong>{" "}
              (شناسه {location.id}) اطمینان دارید؟
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={deleteMutation.isPending}
                className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-danger-600 px-4 py-2 text-xs font-bold text-white hover:bg-danger-700 disabled:opacity-60 transition-colors cursor-pointer"
              >
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={15}
                  color="currentColor"
                />
                <span>
                  {deleteMutation.isPending ? "در حال حذف..." : "تایید و حذف"}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}