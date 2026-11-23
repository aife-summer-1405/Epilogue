"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  CancelCircleIcon,
  Mail01Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { SellerUpgradeRequest } from "@/core/types/sellerUpgrade";
import { toPersianDigits } from "@/lib/formatters/house";

interface SellerUpgradeRequestsTableProps {
  requests: SellerUpgradeRequest[];
  isLoading: boolean;
  onApprove: (req: SellerUpgradeRequest) => void;
  onReject: (req: SellerUpgradeRequest) => void;
}

function isPendingStatus(status?: string | null): boolean {
  return (status ?? "pending").toLowerCase() === "pending";
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase();

  if (normalized === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success-50 dark:bg-success-900/30 px-2.5 py-1 text-xs font-bold text-success-700 dark:text-success-500">
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          size={14}
          color="currentColor"
        />
        تایید شده
      </span>
    );
  }

  if (normalized === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-danger-50 dark:bg-danger-900/30 px-2.5 py-1 text-xs font-bold text-danger-700 dark:text-danger-400">
        <HugeiconsIcon
          icon={CancelCircleIcon}
          size={14}
          color="currentColor"
        />
        رد شده
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-warning-50 dark:bg-warning-900/30 px-2.5 py-1 text-xs font-bold text-warning-700 dark:text-warning-400">
      در انتظار بررسی
    </span>
  );
}

function formatPersianDate(isoDate?: string | null) {
  if (!isoDate) return "ثبت نشده";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "ثبت نشده";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function SellerUpgradeRequestsTable({
  requests,
  isLoading,
  onApprove,
  onReject,
}: SellerUpgradeRequestsTableProps) {
  if (!isLoading && requests.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-10 text-center">
        <p className="text-sm font-bold text-default-text">
          درخواست ارتقای فروشندگی یافت نشد
        </p>
        <p className="mt-1 text-xs text-neutral-800 dark:text-neutral-600">
          وضعیت فیلتر را تغییر دهید یا لیست را بروزرسانی کنید.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right">
            <thead>
              <tr className="border-b border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50 text-xs font-bold text-neutral-800 dark:text-neutral-700">
                <th className="px-4 py-3.5">کاربر متقاضی</th>
                <th className="px-4 py-3.5">اطلاعات تماس</th>
                <th className="px-4 py-3.5">پیام و یادداشت</th>
                <th className="px-4 py-3.5">وضعیت</th>
                <th className="px-4 py-3.5">تاریخ</th>
                <th className="px-4 py-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-sm">
              {requests.map((req, idx) => {
                const displayName =
                  req.user?.fullName?.trim() || "بدون نام";
                const canReview = isPendingStatus(req.status);

                return (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(idx * 0.04, 0.4),
                    }}
                    className="group transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-50/60"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
                          <HugeiconsIcon
                            icon={UserIcon}
                            size={20}
                            color="currentColor"
                            strokeWidth={1.8}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-default-text">
                            {displayName}
                          </div>
                          <div className="text-xs text-neutral-800 dark:text-neutral-600">
                            درخواست #{toPersianDigits(req.id)} · کاربر #
                            {toPersianDigits(req.userId)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-default-text">
                          <HugeiconsIcon
                            icon={Mail01Icon}
                            size={14}
                            color="currentColor"
                            className="text-neutral-800 dark:text-neutral-600 shrink-0"
                          />
                          <span className="truncate max-w-[210px]">
                            {req.user?.email || "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-600">
                          <HugeiconsIcon
                            icon={SmartPhone01Icon}
                            size={14}
                            color="currentColor"
                            className="shrink-0"
                          />
                          <span dir="ltr">
                            {toPersianDigits(req.user?.phoneNumber || "—")}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs max-w-[260px]">
                      <p className="line-clamp-2 text-default-text" dir="ltr">
                        {req.message || "—"}
                      </p>
                      {req.adminNote && (
                        <p
                          className="mt-1 line-clamp-1 text-[11px] text-neutral-800 dark:text-neutral-600"
                          dir="ltr"
                        >
                          Note: {req.adminNote}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>

                    <td className="px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-600 whitespace-nowrap">
                      {formatPersianDate(req.createdAt)}
                    </td>

                    <td className="px-4 py-3.5">
                      {canReview ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => onApprove(req)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-success-300 dark:border-success-700/60 bg-success-50 hover:bg-success-100 dark:bg-success-900/30 dark:hover:bg-success-900/50 px-3 py-1.5 text-xs font-bold text-success-700 dark:text-success-400 transition-colors cursor-pointer"
                          >
                            <HugeiconsIcon
                              icon={CheckmarkCircle02Icon}
                              size={15}
                              color="currentColor"
                              strokeWidth={1.8}
                            />
                            <span>تایید</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onReject(req)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-danger-300 dark:border-danger-700/60 bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/30 dark:hover:bg-danger-900/50 px-3 py-1.5 text-xs font-bold text-danger-600 dark:text-danger-400 transition-colors cursor-pointer"
                          >
                            <HugeiconsIcon
                              icon={CancelCircleIcon}
                              size={15}
                              color="currentColor"
                              strokeWidth={1.8}
                            />
                            <span>رد</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-xs text-neutral-800 dark:text-neutral-600">
                          —
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {requests.map((req, idx) => {
          const displayName = req.user?.fullName?.trim() || "بدون نام";
          const canReview = isPendingStatus(req.status);

          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.35) }}
              className="flex flex-col justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
                    <HugeiconsIcon
                      icon={UserIcon}
                      size={20}
                      color="currentColor"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-default-text">
                      {displayName}
                    </h3>
                    <p className="truncate text-xs text-neutral-800 dark:text-neutral-600">
                      {req.user?.email || "—"}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-lg bg-neutral-200 dark:bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800 dark:text-neutral-700">
                  #{toPersianDigits(req.id)}
                </span>
              </div>

              <div className="space-y-2 border-t border-neutral-200 dark:border-neutral-100 pt-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    شماره تماس:
                  </span>
                  <span dir="ltr" className="font-semibold text-default-text">
                    {toPersianDigits(req.user?.phoneNumber || "—")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    وضعیت:
                  </span>
                  <StatusBadge status={req.status} />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    تاریخ:
                  </span>
                  <span className="text-default-text">
                    {formatPersianDate(req.createdAt)}
                  </span>
                </div>

                {req.message && (
                  <div className="pt-1">
                    <span className="block text-neutral-800 dark:text-neutral-600 mb-0.5">
                      پیام:
                    </span>
                    <p
                      dir="ltr"
                      className="rounded-lg bg-neutral-100 dark:bg-neutral-50 p-2 text-[11px] text-default-text break-words"
                    >
                      {req.message}
                    </p>
                  </div>
                )}

                {req.adminNote && (
                  <div className="pt-0.5">
                    <span className="block text-neutral-800 dark:text-neutral-600 mb-0.5">
                      یادداشت ادمین:
                    </span>
                    <p
                      dir="ltr"
                      className="text-[11px] text-neutral-800 dark:text-neutral-600 break-words"
                    >
                      {req.adminNote}
                    </p>
                  </div>
                )}
              </div>

              {canReview && (
                <div className="flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-100 pt-3">
                  <button
                    type="button"
                    onClick={() => onApprove(req)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-success-600 hover:bg-success-700 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={15}
                      color="currentColor"
                    />
                    <span>تایید</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReject(req)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-danger-600 hover:bg-danger-700 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={CancelCircleIcon}
                      size={15}
                      color="currentColor"
                    />
                    <span>رد</span>
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}