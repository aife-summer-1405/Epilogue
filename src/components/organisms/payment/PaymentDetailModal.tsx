"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Copy01Icon,
  Invoice01Icon,
  LinkSquare02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import Badge from "@/components/atoms/badge/Badge";
import formatPrice from "@/lib/formatters/price";
import { usePaymentDetail } from "@/hooks/use-payments";

interface PaymentDetailModalProps {
  paymentId: string | null;
  onClose: () => void;
}


export function PaymentDetailModal({
  paymentId,
  onClose,
}: PaymentDetailModalProps) {
  const { data: payment, isLoading, isError, error } = usePaymentDetail(paymentId);
  const [copiedId, setCopiedId] = useState(false);
  function toPersianDigits(value: string | number): string {
    return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  }

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : "خطا در دریافت جزئیات فاکتور"
      );
    }
  }, [isError, error]);

  if (!paymentId) return null;

  const badgeType =
    payment?.status === "completed"
      ? "confirmed"
      : payment?.status === "failed"
        ? "canceled"
        : "pending";

  const badgeText =
    payment?.status === "completed"
      ? "پرداخت شده"
      : payment?.status === "failed"
        ? "ناموفق"
        : "در انتظار پرداخت";

  const numericAmount = parseFloat(payment?.amount || "0") || 0;

  const handleCopyInvoiceCode = async () => {
    if (!payment) return;
    const textToCopy = payment.transactionId || payment.id;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(true);
      toast.success("شناسه با موفقیت کپی شد.");
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      toast.error("امکان کپی کردن وجود نداشت.");
    }
  };



  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content text-default-text shadow-xl">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-neutral-200 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-50/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
              <HugeiconsIcon
                icon={Invoice01Icon}
                size={22}
                color="currentColor"
                strokeWidth={1.6}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-base sm:text-lg text-default-text">
                  رسید تراکنش #{toPersianDigits(paymentId)}
                </h2>
                {payment && <Badge text={badgeText} type={badgeType} />}
              </div>
              <p className="text-xs text-neutral-800 dark:text-neutral-600 mt-0.5">
                رسید و جزئیات تراکنش ثبت‌شده در سیستم
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن فاکتور"
            className="p-2 rounded-xl text-neutral-800 dark:text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={20}
              color="currentColor"
              strokeWidth={1.6}
            />
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-50"
              />
            ))}
          </div>
        ) : !payment ? (
          <div className="p-8 text-center text-sm font-semibold text-danger-500">
            اطلاعات این فاکتور یافت نشد.
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-neutral-200 dark:border-neutral-100 bg-neutral-50/70 dark:bg-default-dark-bg p-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    شماره رسید:
                  </span>
                  <span className="font-mono font-bold text-default-text">
                    #{toPersianDigits(payment.id)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    شناسه کاربر:
                  </span>
                  <span className="font-bold text-default-text">
                    {toPersianDigits(payment.userId)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    کد رزرو:
                  </span>
                  <span className="font-semibold text-default-text">
                    {payment.bookingId ? `#${payment.bookingId}` : "ثبت نشده"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 sm:border-r sm:border-neutral-200 dark:sm:border-neutral-100 sm:pr-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    کد پیگیری / تراکنش:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold text-default-text">
                      {payment.transactionId || "ثبت نشده"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyInvoiceCode}
                      title="کپی شناسه"
                      className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-100 text-primary-500 dark:text-primary-200 cursor-pointer"
                    >
                      <HugeiconsIcon
                        icon={copiedId ? Tick02Icon : Copy01Icon}
                        size={15}
                        color="currentColor"
                      />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    تاریخ ثبت:
                  </span>
                  <span className="text-xs font-medium text-default-text">
                    {payment.createdAt || "ثبت نشده"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    آخرین بروزرسانی:
                  </span>
                  <span className="text-xs font-medium text-default-text">
                    {payment.updatedAt || "ثبت نشده"}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-100">
              <table className="w-full text-right border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50/50 text-neutral-800 dark:text-neutral-700">
                    <th className="py-3 px-4 font-bold">ردیف</th>
                    <th className="py-3 px-4 font-bold">شرح خدمات / رزرو</th>
                    <th className="py-3 px-4 font-bold text-left">مبلغ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100">
                  <tr>
                    <td className="py-3.5 px-4 font-mono">۱</td>
                    <td className="py-3.5 px-4 leading-relaxed font-medium">
                      {payment.description || "پرداخت تراکنش"}
                    </td>
                    <td className="py-3.5 px-4 text-left font-bold whitespace-nowrap">
                      {formatPrice(numericAmount, false)} تومان
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-primary-200 dark:border-primary-700 bg-primary-50/70 dark:bg-primary-100/20 px-4 py-3.5">
              <span className="text-sm font-bold text-default-text">
                مبلغ قابل پرداخت / تسویه شده:
              </span>
              <span className="text-base sm:text-lg font-extrabold text-primary-600 dark:text-primary-200">
                {formatPrice(numericAmount, false)} تومان
              </span>
            </div>

            {payment.paymentUrl && (
              <div className="flex items-center justify-between gap-2 rounded-xl border border-neutral-200 dark:border-neutral-100 px-3.5 py-2.5 text-xs">
                <span className="text-neutral-800 dark:text-neutral-600 shrink-0">
                  لینک درگاه:
                </span>

                <div className="flex items-center gap-2 min-w-0">
                  <a
                    href={payment.paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono truncate underline text-primary-500 dark:text-primary-200"
                  >
                    <span className="truncate">{payment.paymentUrl}</span>
                    <HugeiconsIcon
                      icon={LinkSquare02Icon}
                      size={14}
                      color="currentColor"
                      className="shrink-0"
                    />
                  </a>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(payment.paymentUrl);
                        toast.success("لینک درگاه کپی شد.");
                      } catch {
                        toast.error("کپی کردن لینک انجام نشد.");
                      }
                    }}
                    title="کپی لینک درگاه"
                    aria-label="کپی لینک درگاه"
                    className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-100 text-primary-500 dark:text-primary-200 shrink-0 transition-colors cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={Copy01Icon}
                      size={14}
                      color="currentColor"
                    />
                  </button>
                </div>
              </div>
            )}


          </div>
        )}
      </div>
    </div>
  );
}