"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format as formatJalali,
  getDay,
  isSameDay,
  isValid,
  parse,
  startOfMonth,
  subMonths,
} from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import type {
  AdminBookingItem,
  UpdateAdminBookingPayload,
} from "@/core/types/adminBooking";
import { toPersianDigits } from "@/lib/formatters/house";

const WEEK_DAYS_FA = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function toEnglishDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

function getPersianBookingStatus(status?: string | null): string {
  const normalized = (status ?? "").toLowerCase();
  if (normalized === "confirmed") return "تایید شده";
  if (normalized === "canceled" || normalized === "cancelled") return "لغو شده";
  if (normalized === "completed") return "تکمیل شده";
  if (normalized === "pending") return "در انتظار";
  return status ? toPersianDigits(status) : "—";
}

function parseExactBookingDate(raw: string): Date | null {
  const english = toEnglishDigits(raw).trim();
  if (!english) return null;

  const isoMatch = english.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    const localGregorian = new Date(year, month - 1, day);
    if (isValid(localGregorian)) {
      return localGregorian;
    }
  }

  const slashNormalized = english.replace(/-/g, "/");
  const jalaliSlash = parse(slashNormalized, "yyyy/MM/dd", new Date(), {
    locale: faIR,
  });
  if (isValid(jalaliSlash)) {
    return jalaliSlash;
  }

  const jalaliText = parse(english, "d MMMM yyyy", new Date(), {
    locale: faIR,
  });
  if (isValid(jalaliText)) {
    return jalaliText;
  }

  return null;
}

function formatBookingDateToPersianText(raw: string): string {
  const parsed = parseExactBookingDate(raw);
  if (!parsed) return toPersianDigits(raw.trim());
  return toPersianDigits(
    formatJalali(parsed, "d MMMM yyyy", { locale: faIR })
  );
}

interface AdminBookingDetailModalProps {
  booking: AdminBookingItem | null;
  onClose: () => void;
}

export function AdminBookingDetailModal({
  booking,
  onClose,
}: AdminBookingDetailModalProps) {
  if (!booking) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold">
              جزئیات رزرو #{toPersianDigits(booking.id)}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-800 dark:text-neutral-600">
              اقامتگاه #{toPersianDigits(booking.houseId)} · کاربر #
              {toPersianDigits(booking.user_id)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3">
            <span className="text-neutral-800 dark:text-neutral-600">
              وضعیت:{" "}
            </span>
            <strong className="font-bold">
              {getPersianBookingStatus(booking.status)}
            </strong>
          </div>
          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3">
            <span className="text-neutral-800 dark:text-neutral-600">
              تعداد مسافران:{" "}
            </span>
            <strong className="font-bold">
              {toPersianDigits(booking.traveler_details?.length ?? 0)} نفر
            </strong>
          </div>
          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3">
            <span className="text-neutral-800 dark:text-neutral-600">
              ایمیل مشترک:{" "}
            </span>
            <strong dir="ltr">{booking.sharedEmail || "—"}</strong>
          </div>
          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3">
            <span className="text-neutral-800 dark:text-neutral-600">
              موبایل مشترک:{" "}
            </span>
            <strong dir="ltr">
              {toPersianDigits(booking.sharedMobile || "—")}
            </strong>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <p className="font-bold">تاریخ‌های رزرو:</p>
          <div className="flex flex-wrap gap-2">
            {(booking.reservedDates ?? []).map((dateStr, i) => (
              <span
                key={`${dateStr}-${i}`}
                className="rounded-lg border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-neutral-50 px-2.5 py-1 font-semibold"
              >
                {formatBookingDateToPersianText(dateStr)}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <p className="font-bold">اطلاعات مسافران:</p>
          <div className="space-y-2">
            {(booking.traveler_details ?? []).map((t, i) => (
              <div
                key={i}
                className="rounded-xl border border-neutral-200 dark:border-neutral-100 p-3 space-y-1"
              >
                <div className="font-bold">
                  {toPersianDigits(t.firstName)} {toPersianDigits(t.lastName)} (
                  {t.gender === "female"
                    ? "خانم"
                    : t.gender === "male"
                      ? "آقا"
                      : toPersianDigits(t.gender)}
                  )
                </div>
                <div className="text-neutral-800 dark:text-neutral-600">
                  کد ملی: <span dir="ltr">{toPersianDigits(t.nationalId)}</span> · تولد:{" "}
                  <span dir="ltr">{toPersianDigits(t.birthDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-neutral-200 dark:border-neutral-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}

interface AdminBookingEditModalProps {
  booking: AdminBookingItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (payload: UpdateAdminBookingPayload) => Promise<void>;
}

export function AdminBookingEditModal({
  booking,
  isSubmitting,
  onClose,
  onSave,
}: AdminBookingEditModalProps) {
  const originalDates = booking?.reservedDates ?? [];
  const initialDatesText = originalDates
    .map((d) => formatBookingDateToPersianText(d))
    .join("، ");

  const [houseId, setHouseId] = useState(
    toPersianDigits(String(booking?.houseId ?? ""))
  );
  const [status, setStatus] = useState(booking?.status ?? "pending");
  const [sharedEmail, setSharedEmail] = useState(booking?.sharedEmail ?? "");
  const [sharedMobile, setSharedMobile] = useState(
    toPersianDigits(booking?.sharedMobile ?? "")
  );
  const [datesText, setDatesText] = useState(initialDatesText);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const firstValid = originalDates
      .map((d) => parseExactBookingDate(d))
      .find((d): d is Date => Boolean(d));
    return firstValid ?? new Date();
  });

  const selectedDateObjects = useMemo(() => {
    return datesText
      .split(/[,،]/)
      .map((item) => parseExactBookingDate(item))
      .filter((d): d is Date => Boolean(d));
  }, [datesText]);

  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingEmptyDays = (getDay(monthStart) + 1) % 7;

  if (!booking) return null;

  const handleToggleCalendarDay = (day: Date) => {
    const formattedPersian = toPersianDigits(
      formatJalali(day, "d MMMM yyyy", { locale: faIR })
    );
    const currentParts = datesText
      .split(/[,،]/)
      .map((p) => p.trim())
      .filter(Boolean);

    const existsIndex = currentParts.findIndex((part) => {
      const parsedPart = parseExactBookingDate(part);
      return parsedPart ? isSameDay(parsedPart, day) : part === formattedPersian;
    });

    const nextParts =
      existsIndex >= 0
        ? currentParts.filter((_, idx) => idx !== existsIndex)
        : [...currentParts, formattedPersian];

    setDatesText(nextParts.join("، "));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isDatesUnchanged = datesText.trim() === initialDatesText.trim();

    const parsedDates = isDatesUnchanged
      ? originalDates
      : datesText
          .split(/[,،]/)
          .map((d) => d.trim())
          .filter(Boolean)
          .map((rawDate, index) => {
            const matchedOriginal = originalDates[index];
            const parsedRaw = parseExactBookingDate(rawDate);
            const parsedOrig = matchedOriginal
              ? parseExactBookingDate(matchedOriginal)
              : null;

            if (parsedRaw && parsedOrig && isSameDay(parsedRaw, parsedOrig)) {
              return matchedOriginal;
            }

            if (parsedRaw) {
              return formatJalali(parsedRaw, "yyyy/MM/dd", { locale: faIR });
            }

            return toEnglishDigits(rawDate);
          });

    await onSave({
      id: booking.id,
      houseId: Number(toEnglishDigits(houseId)) || Number(booking.houseId) || 0,
      status,
      sharedEmail: sharedEmail.trim(),
      sharedMobile: toEnglishDigits(sharedMobile).trim(),
      reservedDates: parsedDates.length > 0 ? parsedDates : originalDates,
      traveler_details: booking.traveler_details ?? [],
    });
    onClose();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-lg rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
          <h2 className="text-base font-extrabold">
            ویرایش رزرو #{toPersianDigits(booking.id)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
                شناسه اقامتگاه
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={houseId}
                onChange={(e) => setHouseId(toPersianDigits(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-default-text outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
                وضعیت
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-default-text outline-none focus:border-primary-500"
              >
                <option value="pending">در انتظار</option>
                <option value="confirmed">تایید شده</option>
                <option value="canceled">لغو شده</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
                ایمیل مشترک
              </label>
              <input
                type="text"
                dir="ltr"
                value={sharedEmail}
                onChange={(e) => setSharedEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-left text-default-text outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
                موبایل مشترک
              </label>
              <input
                type="text"
                dir="ltr"
                value={sharedMobile}
                onChange={(e) =>
                  setSharedMobile(toPersianDigits(e.target.value))
                }
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-left text-default-text outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="relative">
            <div className="mb-1 flex items-center justify-between">
              <label className="font-bold text-neutral-800 dark:text-neutral-600">
                تاریخ‌های رزرو (جداشده با کاما)
              </label>
              <button
                type="button"
                onClick={() => setIsCalendarOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-500 hover:underline cursor-pointer"
              >
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={14}
                  color="currentColor"
                />
                <span>انتخاب از تقویم</span>
              </button>
            </div>

            <input
              type="text"
              dir="rtl"
              value={datesText}
              onChange={(e) => setDatesText(toPersianDigits(e.target.value))}
              placeholder={toPersianDigits("27 آبان 1405")}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-right text-default-text outline-none focus:border-primary-500"
            />

            {isCalendarOpen && (
              <div className="mt-2 rounded-2xl border border-neutral-300 dark:border-neutral-200 bg-default-white-bg dark:bg-default-dark-content p-3.5 shadow-lg">
                <div className="mb-2.5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((m) => subMonths(m, 1))}
                    className="rounded-lg p-1.5 text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100 cursor-pointer"
                    aria-label="ماه قبل"
                  >
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={16}
                      color="currentColor"
                    />
                  </button>

                  <span className="text-xs font-bold text-default-text">
                    {formatJalali(calendarMonth, "MMMM yyyy", { locale: faIR })}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCalendarMonth((m) => addMonths(m, 1))}
                    className="rounded-lg p-1.5 text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100 cursor-pointer"
                    aria-label="ماه بعد"
                  >
                    <HugeiconsIcon
                      icon={ArrowLeft01Icon}
                      size={16}
                      color="currentColor"
                    />
                  </button>
                </div>

                <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-neutral-800 dark:text-neutral-600">
                  {WEEK_DAYS_FA.map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({ length: leadingEmptyDays }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-7" />
                  ))}

                  {daysInMonth.map((day) => {
                    const isSelected = selectedDateObjects.some((d) =>
                      isSameDay(d, day)
                    );
                    const isToday = isSameDay(day, new Date());

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => handleToggleCalendarDay(day)}
                        className={`h-7 rounded-lg font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-primary-500 text-white"
                            : isToday
                              ? "border border-primary-500 text-primary-600 dark:text-primary-200"
                              : "text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100"
                        }`}
                      >
                        {formatJalali(day, "d", { locale: faIR })}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-100 pt-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setDatesText("")}
                    className="font-semibold text-danger-600 dark:text-danger-400 hover:underline cursor-pointer"
                  >
                    پاک کردن تاریخ‌ها
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(false)}
                    className="font-bold text-primary-500 hover:underline cursor-pointer"
                  >
                    تایید و بستن
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-neutral-200 dark:border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-4 py-2 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2 font-bold text-white transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting
                ? `در حال ذخیره ${toPersianDigits("...")}`
                : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}