"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Mail01Icon,
  Copy01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "react-toastify";
import type { ContactMessageItem } from "@/core/types/contactUs.types";
import { useAdminContactMessageDetailQuery } from "@/hooks/useAdminContactUs";

interface ContactMessageDetailModalProps {
  messageItem: ContactMessageItem | null;
  onClose: () => void;
  onRequestDelete: (item: ContactMessageItem) => void;
}

function extractEmail(title?: string): string | null {
  if (!title) return null;
  const match = title.match(/\(([^@\s]+@[^@\s]+\.[^@\s]+)\)/);
  return match ? match[1] : null;
}

export function ContactMessageDetailModal({
  messageItem,
  onClose,
  onRequestDelete,
}: ContactMessageDetailModalProps) {
  const { data, isLoading, isError, error } = useAdminContactMessageDetailQuery(
    messageItem?.id ?? null
  );

  const activeData = data ?? messageItem;
  const senderEmail = extractEmail(activeData?.title);

  const handleCopyEmail = async () => {
    if (!senderEmail) return;
    try {
      await navigator.clipboard.writeText(senderEmail);
      toast.success("ایمیل فرستنده کپی شد.");
    } catch {
      toast.error("کپی کردن ایمیل ناموفق بود.");
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
            className="w-full max-w-lg rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 sm:p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/30">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={20}
                    color="currentColor"
                  />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-default-text">
                    جزئیات پیام #{messageItem.id}
                  </h2>
                  <p className="text-xs text-neutral-800 dark:text-neutral-600">
                    مشاهده کامل عنوان و متن پیام ارسال‌شده
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={18}
                  color="currentColor"
                />
              </button>
            </div>

            {isLoading && !activeData ? (
              <div className="my-6 space-y-3">
                <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-50" />
                <div className="h-28 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-50" />
              </div>
            ) : isError ? (
              <div className="my-4 rounded-xl border border-danger-300 bg-danger-50 dark:bg-danger-900/30 p-4 text-xs text-danger-700 dark:text-danger-400">
                {error?.message || "خطا در دریافت اطلاعات پیام"}
              </div>
            ) : (
              activeData && (
                <div className="mt-4 space-y-4">
                  <div>
                    <span className="mb-1 block text-xs font-bold text-neutral-800 dark:text-neutral-600">
                      عنوان پیام 
                    </span>
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-default-text break-words">
                      {activeData.title}
                    </div>
                  </div>

                  {senderEmail && (
                    <div className="flex items-center justify-between rounded-xl border border-primary-200 dark:border-primary-100/30 bg-primary-50/60 dark:bg-primary-100/15 px-3.5 py-2.5">
                      <div className="text-xs">
                        <span className="text-neutral-800 dark:text-neutral-600">
                          ایمیل فرستنده:{" "}
                        </span>
                        <strong
                          dir="ltr"
                          className="font-mono text-primary-600 dark:text-primary-300"
                        >
                          {senderEmail}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary-500 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-primary-600 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon icon={Copy01Icon} size={13} />
                        <span>کپی ایمیل</span>
                      </button>
                    </div>
                  )}

                  <div>
                    <span className="mb-1 block text-xs font-bold text-neutral-800 dark:text-neutral-600">
                      متن پیام 
                    </span>
                    <div className="max-h-60 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-neutral-200 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50 p-3.5 text-xs sm:text-sm leading-6 text-default-text">
                      {activeData.message}
                    </div>
                  </div>
                </div>
              )
            )}

            <div className="mt-5 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-100 pt-4">
              {activeData ? (
                <button
                  type="button"
                  onClick={() => {
                    const target = activeData;
                    onClose();
                    onRequestDelete(target);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-danger-50 dark:bg-danger-900/30 px-3.5 py-2 text-xs font-bold text-danger-600 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-900/50 transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={15} />
                  <span>حذف پیام</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-5 py-2 text-xs font-bold text-default-text hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                بستن
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}