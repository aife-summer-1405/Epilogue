"use client";

import { FormEvent, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";
import { SellerUpgradeRequest } from "@/core/types/sellerUpgrade";
import { toPersianDigits } from "@/lib/formatters/house";

interface SellerUpgradeReviewModalProps {
  request: SellerUpgradeRequest | null;
  action: "approve" | "reject" | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (id: string, adminNote: string) => Promise<void>;
}

const DEFAULT_NOTES = {
  approve: "درخواست شما با موفقیت تایید شد. لطفاً برای ادامه مراحل، به پنل فروشندگی خود مراجعه کنید.",
  reject: "متاسفانه درخواست شما رد شد. لطفاً برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.",
};

export function SellerUpgradeReviewModal({
  request,
  action,
  isSubmitting,
  onClose,
  onConfirm,
}: SellerUpgradeReviewModalProps) {
  const [adminNote, setAdminNote] = useState(
    request?.adminNote?.trim() || (action ? DEFAULT_NOTES[action] : "")
  );

  if (!request || !action) return null;

  const isApprove = action === "approve";
  const applicantName =
    request.user?.fullName?.trim() || request.user?.email || `کاربر #${request.userId}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanNote = adminNote.trim();
    if (!cleanNote) return;
    await onConfirm(request.id, cleanNote);
    onClose();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={isApprove ? CheckmarkCircle02Icon : CancelCircleIcon}
              size={20}
              color="currentColor"
              className={
                isApprove
                  ? "text-success-600 dark:text-success-400"
                  : "text-danger-600 dark:text-danger-400"
              }
            />
            <div>
              <h2 className="text-base font-extrabold">
                {isApprove ? "تایید درخواست فروشندگی" : "رد درخواست فروشندگی"}
              </h2>
              <p className="mt-0.5 text-xs text-neutral-800 dark:text-neutral-600">
                درخواست #{toPersianDigits(request.id)} · {applicantName}
              </p>
            </div>
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
          {request.message && (
            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3 text-xs text-neutral-800 dark:text-neutral-700">
              <span className="font-bold text-default-text">پیام کاربر: </span>
              <span dir="ltr" className="break-words">
                {request.message}
              </span>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-neutral-800 dark:text-neutral-600">
              یادداشت ادمین 
            </label>
            <textarea
              rows={3}
              required
              dir="ltr"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3.5 py-2.5 text-xs sm:text-sm text-default-text outline-none focus:border-primary-500 transition-colors text-left"
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
              disabled={isSubmitting}
              className={`rounded-xl px-5 py-2 text-xs font-bold text-white transition-colors disabled:opacity-60 cursor-pointer ${
                isApprove
                  ? "bg-success-600 hover:bg-success-700"
                  : "bg-danger-600 hover:bg-danger-700"
              }`}
            >
              {isSubmitting
                ? "در حال ثبت..."
                : isApprove
                  ? "تایید درخواست"
                  : "رد درخواست"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}