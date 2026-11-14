"use client";

import React, { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

interface MarkAllReadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const MarkAllReadModal: React.FC<MarkAllReadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity"
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mark-all-read-title"
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-125 flex-col items-center rounded-[32px] bg-white p-6 shadow-2xl sm:p-8 dark:bg-[#272727]"
      >
        <div className="flex w-full justify-end">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            aria-label="بستن مودال"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} />
          </button>
        </div>

        <h2
          id="mark-all-read-title"
          className="mt-4 mb-8 max-w-sm text-center text-base leading-8 font-extrabold text-gray-900 sm:text-xl sm:leading-9 dark:text-white"
        >
          آیا مطمئن هستید که میخواهید همه مطالب سایت را به عنوان خوانده شده
          علامت بزنید؟
        </h2>

        <div className="grid w-full grid-cols-2 gap-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-gray-400 bg-transparent text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            انصراف
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#0b2b53] text-sm font-bold text-white transition-colors hover:bg-[#1e3a8a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "در حال ثبت..." : "موافقت"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAllReadModal;
