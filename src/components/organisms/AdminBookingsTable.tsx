"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  PencilEdit02Icon,
  Delete02Icon,
  PlayIcon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";
import { format as formatJalali, isValid, parse } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import type { AdminBookingItem } from "@/core/types/adminBooking";
import { toPersianDigits } from "@/lib/formatters/house";

interface AdminBookingsTableProps {
  bookings: AdminBookingItem[];
  isLoading: boolean;
  resolvedIds?: number[];
  onView: (booking: AdminBookingItem) => void;
  onEdit: (booking: AdminBookingItem) => void;
  onContinue: (booking: AdminBookingItem) => void;
  onCancel: (booking: AdminBookingItem) => void;
  onDelete: (booking: AdminBookingItem) => void;
}

function toEnglishDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

function BookingStatusBadge({ status }: { status?: string }) {
  const normalized = (status ?? "pending").toLowerCase();

  if (normalized === "confirmed") {
    return (
      <span className="inline-flex items-center rounded-full bg-success-50 dark:bg-success-900/30 px-2.5 py-1 text-xs font-bold text-success-700 dark:text-success-500">
        تایید شده
      </span>
    );
  }

  if (normalized === "canceled" || normalized === "cancelled") {
    return (
      <span className="inline-flex items-center rounded-full bg-danger-50 dark:bg-danger-900/30 px-2.5 py-1 text-xs font-bold text-danger-700 dark:text-danger-400">
        لغو شده
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-warning-50 dark:bg-warning-900/30 px-2.5 py-1 text-xs font-bold text-warning-700 dark:text-warning-400">
      در انتظار
    </span>
  );
}

function formatBookingDate(booking: AdminBookingItem) {
  const raw =
    booking.reservedDates?.[0] ||
    booking.createdAt ||
    booking.created_at ||
    "";
  if (!raw) return "ثبت نشده";

  const english = toEnglishDigits(raw).trim();

  const isoMatch = english.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const gregorianDate = new Date(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3])
    );
    if (isValid(gregorianDate)) {
      return toPersianDigits(
        formatJalali(gregorianDate, "d MMMM yyyy", { locale: faIR })
      );
    }
  }

  const jalaliSlash = parse(
    english.replace(/-/g, "/"),
    "yyyy/MM/dd",
    new Date(),
    { locale: faIR }
  );
  if (isValid(jalaliSlash)) {
    return toPersianDigits(
      formatJalali(jalaliSlash, "d MMMM yyyy", { locale: faIR })
    );
  }

  return toPersianDigits(raw);
}

export function AdminBookingsTable({
  bookings,
  isLoading,
  resolvedIds = [],
  onView,
  onEdit,
  onContinue,
  onCancel,
  onDelete,
}: AdminBookingsTableProps) {
  if (!isLoading && bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-10 text-center">
        <p className="text-sm font-bold text-default-text">رزروی یافت نشد</p>
        <p className="mt-1 text-xs text-neutral-800 dark:text-neutral-600">
          فیلترهای وضعیت، کاربر یا اقامتگاه را تغییر دهید.
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
                <th className="px-4 py-3.5">شناسه رزرو</th>
                <th className="px-4 py-3.5">کاربر و اقامتگاه</th>
                <th className="px-4 py-3.5">مسافران</th>
                <th className="px-4 py-3.5">تاریخ رزرو</th>
                <th className="px-4 py-3.5">وضعیت</th>
                <th className="px-4 py-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-sm">
              {bookings.map((booking, idx) => {
                const travelersCount = booking.traveler_details?.length ?? 0;
                const firstTraveler = booking.traveler_details?.[0];
                const normalizedStatus = (booking.status ?? "").toLowerCase();
                const showDecisionActions =
                  !resolvedIds.includes(booking.id) &&
                  normalizedStatus !== "confirmed" &&
                  normalizedStatus !== "canceled" &&
                  normalizedStatus !== "cancelled";

                return (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(idx * 0.04, 0.4),
                    }}
                    className="group transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-50/60"
                  >
                    <td className="px-4 py-3.5 font-bold text-default-text whitespace-nowrap">
                      #{toPersianDigits(booking.id)}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-default-text">
                        اقامتگاه #{toPersianDigits(booking.houseId)}
                      </div>
                      <div className="text-xs text-neutral-800 dark:text-neutral-600">
                        کاربر #{toPersianDigits(booking.user_id)}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs">
                      <div className="font-bold text-default-text">
                        {toPersianDigits(travelersCount)} نفر مسافر
                      </div>
                      <div className="text-neutral-800 dark:text-neutral-600">
                        {firstTraveler
                          ? `${toPersianDigits(firstTraveler.firstName)} ${toPersianDigits(firstTraveler.lastName)}`
                          : "—"}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-600 whitespace-nowrap">
                      {formatBookingDate(booking)}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <BookingStatusBadge status={booking.status} />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onView(booking)}
                          title="مشاهده جزئیات"
                          className="rounded-xl border border-neutral-300 dark:border-neutral-200 p-2 text-default-text hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={ViewIcon}
                            size={15}
                            color="currentColor"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(booking)}
                          title="ویرایش"
                          className="rounded-xl border border-primary-300 dark:border-primary-700 bg-primary-50/70 dark:bg-primary-100/20 p-2 text-primary-600 dark:text-primary-800 hover:bg-primary-100 transition-colors cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={PencilEdit02Icon}
                            size={15}
                            color="currentColor"
                          />
                        </button>

                        {showDecisionActions && (
                          <>
                            <button
                              type="button"
                              onClick={() => onContinue(booking)}
                              title="ادامه رزرو"
                              className="rounded-xl border border-success-300 dark:border-success-700 bg-success-50/70 dark:bg-success-900/20 p-2 text-success-700 dark:text-success-400 hover:bg-success-100 transition-colors cursor-pointer"
                            >
                              <HugeiconsIcon
                                icon={PlayIcon}
                                size={15}
                                color="currentColor"
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() => onCancel(booking)}
                              title="لغو رزرو"
                              className="rounded-xl border border-warning-300 dark:border-warning-700 bg-warning-50/70 dark:bg-warning-900/20 p-2 text-warning-700 dark:text-warning-400 hover:bg-warning-100 transition-colors cursor-pointer"
                            >
                              <HugeiconsIcon
                                icon={CancelCircleIcon}
                                size={15}
                                color="currentColor"
                              />
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => onDelete(booking)}
                          title="حذف"
                          className="rounded-xl border border-danger-300 dark:border-danger-700 bg-danger-50/70 dark:bg-danger-900/20 p-2 text-danger-600 dark:text-danger-400 hover:bg-danger-100 transition-colors cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={15}
                            color="currentColor"
                          />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {bookings.map((booking, idx) => {
          const travelersCount = booking.traveler_details?.length ?? 0;
          const normalizedStatus = (booking.status ?? "").toLowerCase();
          const showDecisionActions =
            !resolvedIds.includes(booking.id) &&
            normalizedStatus !== "confirmed" &&
            normalizedStatus !== "canceled" &&
            normalizedStatus !== "cancelled";

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.35) }}
              className="flex flex-col justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-default-text">
                    اقامتگاه #{toPersianDigits(booking.houseId)}
                  </h3>
                  <p className="text-xs text-neutral-800 dark:text-neutral-600">
                    کاربر #{toPersianDigits(booking.user_id)}
                  </p>
                </div>

                <span className="shrink-0 rounded-lg bg-neutral-200 dark:bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800 dark:text-neutral-700">
                  #{toPersianDigits(booking.id)}
                </span>
              </div>

              <div className="space-y-2 border-y border-neutral-200 dark:border-neutral-100 py-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    وضعیت:
                  </span>
                  <BookingStatusBadge status={booking.status} />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    مسافران:
                  </span>
                  <span className="font-semibold text-default-text">
                    {toPersianDigits(travelersCount)} نفر
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    تاریخ:
                  </span>
                  <span className="text-default-text">
                    {formatBookingDate(booking)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onView(booking)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-neutral-300 dark:border-neutral-200 py-2 text-xs font-bold text-default-text transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={ViewIcon} size={14} color="currentColor" />
                  <span>جزئیات</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(booking)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary-500 hover:bg-primary-600 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={PencilEdit02Icon}
                    size={14}
                    color="currentColor"
                  />
                  <span>ویرایش</span>
                </button>

                {showDecisionActions && (
                  <>
                    <button
                      type="button"
                      onClick={() => onContinue(booking)}
                      className="rounded-xl bg-success-600 hover:bg-success-700 px-3 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      ادامه
                    </button>

                    <button
                      type="button"
                      onClick={() => onCancel(booking)}
                      className="rounded-xl bg-warning-600 hover:bg-warning-700 px-3 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      لغو
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => onDelete(booking)}
                  className="rounded-xl bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/30 px-3 py-2 text-xs font-bold text-danger-600 dark:text-danger-400 transition-colors cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    size={14}
                    color="currentColor"
                  />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}