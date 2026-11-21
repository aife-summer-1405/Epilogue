"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Alert02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { useDeleteUserMutation } from "@/hooks/useAdminUsers";
import type { AdminUserItem } from "@/core/types/userManagement.types";

interface UserDeleteModalProps {
  user: AdminUserItem | null;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export function UserDeleteModal({
  user,
  onClose,
  onSuccess,
  onError,
}: UserDeleteModalProps) {
  const { mutate, isPending } = useDeleteUserMutation();

  const handleConfirmDelete = () => {
    if (!user) return;
    mutate(user.id, {
      onSuccess: (res) => {
        onSuccess?.(res.message || "حساب کاربری با موفقیت حذف شد");
        onClose();
      },
      onError: (err) => {
        onError?.(err.message || "خطا در حذف حساب کاربری");
      },
    });
  };

  return (
    <AnimatePresence>
      {user && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isPending && onClose()}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-6 shadow-2xl"
          >
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              aria-label="بستن"
              className="absolute left-4 top-4 rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-100 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
            </button>

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-50 text-danger-600 dark:bg-danger-900/40 dark:text-danger-400">
              <HugeiconsIcon icon={Alert02Icon} size={28} color="currentColor" strokeWidth={1.8} />
            </div>

            <h3 className="text-center text-lg font-extrabold text-default-text">
              حذف حساب کاربری
            </h3>
            <p className="mt-2 text-center text-xs sm:text-sm leading-relaxed text-neutral-800 dark:text-neutral-600">
              آیا از حذف حساب کاربری{" "}
              <span className="font-bold text-default-text">
                {user.fullName || user.email}
              </span>{" "}
              (شناسه #{user.id}) اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={onClose}
                className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50 py-2.5 text-xs sm:text-sm font-bold text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                انصراف
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirmDelete}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger-600 hover:bg-danger-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                <HugeiconsIcon icon={Delete02Icon} size={17} color="currentColor" strokeWidth={1.8} />
                <span>{isPending ? "در حال حذف..." : "حذف کاربر"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}