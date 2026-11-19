"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import DateObject from "react-date-object";
import { toast } from "react-toastify";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  House04Icon,
  Calendar03Icon,
  Money02Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import { HouseRent } from "@/core/types/RentHouse/house";
import { formatPrice } from "@/utils/formatters";
import { getUtcTimestamp } from "@/utils/date";
import { getToday, getTomorrow } from "@/utils/getToday";
import { checkAuthAndExecute } from "@/utils/authGuard";
import { checkHouseAvailabilityAction } from "@/app/actions/availability.actions";

interface Props {
  house: HouseRent;
}

export default function HouseReserveSidebar({ house }: Props) {
  const router = useRouter();
  const [startDate, setStartDate] = useState<DateObject | null>(getToday);
  const [endDate, setEndDate] = useState<DateObject | null>(getTomorrow);
  const [travelerCount, setTravelerCount] = useState(1);

  const [availabilityResult, setAvailabilityResult] = useState<{
    checked: boolean;
    available: boolean;
    message?: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const difference = getUtcTimestamp(endDate) - getUtcTimestamp(startDate);
    return difference <= 0 ? 0 : difference / (24 * 60 * 60 * 1000);
  }, [startDate, endDate]);

  const houseId = Number(house.id);

  const handleStartDateChange = (date: DateObject | null) => {
    if (!date || Array.isArray(date)) return;
    const selectedDate = new DateObject(date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    setStartDate(selectedDate);
    setAvailabilityResult(null); 

    if (!endDate || getUtcTimestamp(endDate) <= getUtcTimestamp(selectedDate)) {
      setEndDate(new DateObject(selectedDate).add(1, "day"));
    }
  };

  const handleEndDateChange = (date: DateObject | null) => {
    if (!date || Array.isArray(date)) return;
    const selectedDate = new DateObject(date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    if (startDate && getUtcTimestamp(selectedDate) <= getUtcTimestamp(startDate))
      return;
    setEndDate(selectedDate);
    setAvailabilityResult(null);
  };

  const handleCheckAvailability = () => {
    if (!startDate || !endDate || nights <= 0) return;

    const startStr = new DateObject(startDate)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DD");
    const endStr = new DateObject(endDate)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DD");

    startTransition(async () => {
      const res = await checkHouseAvailabilityAction(houseId, startStr, endStr);
      setAvailabilityResult({
        checked: true,
        available: res.available,
        message: res.message,
      });
    });
  };

  const handleBooking = () => {
    checkAuthAndExecute(async () => {
      if (!startDate || !endDate || nights <= 0) {
        toast.error("تاریخ رفت و برگشت را به‌درستی انتخاب کنید.");
        return;
      }

      if (availabilityResult && !availabilityResult.available) {
        toast.error("اقامتگاه در این تاریخ پر است.");
        return;
      }

      const startDateGregorian = new DateObject(startDate)
        .convert(gregorian, gregorian_en)
        .format("YYYY-MM-DD");

      const endDateGregorian = new DateObject(endDate)
        .convert(gregorian, gregorian_en)
        .format("YYYY-MM-DD");

      const params = new URLSearchParams({
        startDate: startDateGregorian,
        endDate: endDateGregorian,
        travelers: String(travelerCount),
      });

      router.push(`/houseBooking/${houseId}?${params.toString()}`);
    });
  };

  const pricePerNight =
    Number(String(house.price ?? 0).replace(/[٬,،]/g, "")) || 0;
  const totalPrice = pricePerNight * nights;

  return (
    <aside
      dir="rtl"
      className="mb-[32px] h-fit w-full rounded-[24px] border border-neutral-200 bg-white p-4 dark:border-[#272727] dark:bg-[#272727] dark:text-white"
    >
      <h2 className="mb-5 flex items-center justify-center gap-2 text-base font-bold">
        <HugeiconsIcon icon={House04Icon} size={22} />
        رزرو خونه برای {house.title}
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">تاریخ رفت</label>
          <div className="relative">
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/M/D"
              minDate={getToday()}
              calendarPosition="bottom-right"
              inputClass="!h-10 !py-6 !w-full text-[#8B8D98] !rounded-full !border-0 !bg-[#F0F0F3] !px-4 !pl-10 !text-sm !outline-none dark:!bg-[#353535]"
              containerClassName="!w-full"
            />
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">تاریخ برگشت</label>
          <div className="relative">
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/M/D"
              minDate={
                startDate
                  ? new DateObject(startDate).add(1, "day")
                  : getTomorrow()
              }
              calendarPosition="bottom-right"
              inputClass="!h-10 !py-6 !w-full text-[#8B8D98] !rounded-full !border-0 !bg-[#F0F0F3] !px-4 !pl-10 !text-sm !outline-none dark:!bg-[#353535]"
              containerClassName="!w-full"
            />
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <div>
          {!availabilityResult?.checked ? (
            <button
              type="button"
              onClick={handleCheckAvailability}
              disabled={isPending || nights <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-100 py-2.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-50 dark:bg-[#353535] dark:text-neutral-200"
            >
              {isPending ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={16}
                    className="animate-spin"
                  />
                  <span>در حال استعلام ظرفیت...</span>
                </>
              ) : (
                <span>بررسی در دسترس بودن در این تاریخ</span>
              )}
            </button>
          ) : availabilityResult.available ? (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
              <span>اقامتگاه در این تاریخ آماده رزرو است</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400">
              <HugeiconsIcon icon={CancelCircleIcon} size={16} />
              <span>
                {availabilityResult.message || "متأسفانه در این تاریخ پر است"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="travelerCount" className="block text-sm font-medium">
            تعداد مسافران
          </label>
          <div className="flex items-center rounded-full bg-[#F0F0F3] px-4 dark:bg-[#353535]">
            <span className="shrink-0 text-xs text-[#8B8D98]">نفر</span>
            <input
              id="travelerCount"
              type="number"
              min={1}
              max={20}
              value={travelerCount}
              onChange={(event) => {
                const value = Number(event.target.value);
                setTravelerCount(Math.max(1, Math.min(20, value || 1)));
              }}
              className="w-full bg-transparent px-3 py-3 text-sm text-[#8B8D98] outline-none"
            />
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <p className="flex items-center justify-center gap-2 text-sm font-bold text-black dark:text-white">
            <HugeiconsIcon icon={Money02Icon} size={24} />
            قیمت رزرو
          </p>
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-[#8B8D98]">{formatPrice(nights)} شب</span>
            <span className="text-black dark:text-white">
              {formatPrice(pricePerNight)} تومان
            </span>
          </div>

          <p className="flex items-center justify-center gap-2 text-sm font-bold text-black dark:text-white">
            <HugeiconsIcon icon={Money02Icon} size={24} />
            قیمت نهایی
          </p>
          <div className="mx-11 flex items-center justify-between gap-2 rounded-[24px] bg-[#EDEDED] p-3 text-sm font-semibold text-black dark:bg-[#353535] dark:text-white">
            <span>{formatPrice(nights)} شب</span>
            <span>{formatPrice(totalPrice)} تومان</span>
          </div>
        </div>

        <Button
          type="button"
          size="md"
          variant="primary"
          disabled={
            !startDate ||
            !endDate ||
            nights <= 0 ||
            (availabilityResult?.checked && !availabilityResult.available)
          }
          onClick={handleBooking}
          className="flex w-full items-center justify-center gap-2 font-semibold disabled:opacity-50"
        >
          <span className="pl-2">همین الان رزرو کن</span>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
        </Button>
      </div>
    </aside>
  );
}