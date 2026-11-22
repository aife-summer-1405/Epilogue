"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import { toast } from "react-toastify";
import { useDeleteContactMessageMutation } from "@/hooks/useAdminContactUs";
import type { ContactMessageItem } from "@/core/types/contactUs.types";

interface ContactMessageDeleteModalProps {
  messageItem: ContactMessageItem | null;
  onClose: () => void;
}

export function ContactMessageDeleteModal({
  messageItem,
  onClose,
}: ContactMessageDeleteModalProps) {
  const deleteMutation = useDeleteContactMessageMutation();

  const handleConfirmDelete = async () => {
    if (!messageItem) return;
    try {
      await deleteMutation.mutateAsync(messageItem.id);
      toast.success(`پیام شماره ${messageItem.id} با موفقیت حذف شد.`);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "خطا در حذف پیام.");
    }
  };

  return (
    <AnimatePresence>
      {messageItem && (
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
                  حذف پیام تماس با ما
                </h3>
                <p className="mt-0.5 text-xs text-neutral-800 dark:text-neutral-600">
                  این عملیات غیرقابل بازگشت است.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3.5 text-xs sm:text-sm leading-6 text-default-text">
              <p>
                آیا از حذف پیام{" "}
                <strong className="text-danger-600 dark:text-danger-400">
                  «{messageItem.title}»
                </strong>{" "}
                (شناسه {new Intl.NumberFormat("fa-IR").format(Number(messageItem.id))}) اطمینان دارید؟
              </p>
            </div>

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