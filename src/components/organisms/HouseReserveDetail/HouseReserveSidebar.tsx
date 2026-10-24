"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  House04Icon,
  Calendar03Icon,
  Money02Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import { HouseRent } from "@/core/types/RentHouse/house";
import { useCreateBooking } from "@/hooks/mutations/useCreateBooking";
import { formatPrice } from "@/utils/formatters";
import { toGregorianDate, getUtcTimestamp } from "@/utils/date";

interface Props {
  house: HouseRent;
}

const getToday = () =>
  new DateObject({ calendar: persian }).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

const getTomorrow = () => getToday().add(1, "day");

export default function HouseReserveSidebar({ house }: Props) {
  const router = useRouter();

  const [startDate, setStartDate] = useState<DateObject | null>(getToday);
  const [endDate, setEndDate] = useState<DateObject | null>(getTomorrow);
  const [travelerCount, setTravelerCount] = useState(1);

  const createBooking = useCreateBooking();

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const difference =
      getUtcTimestamp(endDate) - getUtcTimestamp(startDate);

    if (difference <= 0) return 0;

    return difference / (24 * 60 * 60 * 1000);
  }, [startDate, endDate]);

  const pricePerNight =
    Number(String(house.price ?? 0).replace(/[٬,،]/g, "")) || 0;

  const totalPrice = pricePerNight * nights;

  const handleStartDateChange = (date: DateObject | null) => {
    if (!date || Array.isArray(date)) return;

    const selectedDate = new DateObject(date).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    setStartDate(selectedDate);

    if (
      !endDate ||
      getUtcTimestamp(endDate) <= getUtcTimestamp(selectedDate)
    ) {
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

    if (
      startDate &&
      getUtcTimestamp(selectedDate) <= getUtcTimestamp(startDate)
    ) {
      return;
    }

    setEndDate(selectedDate);
  };

  const handleBooking = async () => {
    if (!startDate || !endDate || nights <= 0) {
      alert("تاریخ رفت و برگشت را به‌درستی انتخاب کنید.");
      return;
    }

    const houseId = Number(house.id);

    if (!Number.isInteger(houseId) || houseId <= 0) {
      alert("شناسه خانه معتبر نیست.");
      return;
    }

    try {
      await createBooking.mutateAsync({
        houseId,
        reservedDates: [
          toGregorianDate(startDate),
          toGregorianDate(endDate),
        ],
      });

      router.push(`/houseBooking/${house.id}`);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

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
        {/* تاریخ رفت */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            تاریخ رفت
          </label>

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

        {/* تاریخ برگشت */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            تاریخ برگشت
          </label>

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

        {/* تعداد مسافران */}
        <div className="space-y-2">
          <label
            htmlFor="travelerCount"
            className="block text-sm font-medium"
          >
            تعداد مسافران
          </label>

          <div className="flex items-center rounded-full bg-[#F0F0F3] px-4 dark:bg-[#353535]">
            <span className="shrink-0 text-xs text-[#8B8D98]">
              نفر
            </span>

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

        {/* قیمت رزرو */}
        <div className="space-y-3 pt-1">
          <p className="flex items-center justify-center gap-2 text-sm font-bold text-black dark:text-white">
            <HugeiconsIcon icon={Money02Icon} size={24} />
            قیمت رزرو
          </p>

          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-[#8B8D98]">
              {formatPrice(nights)} شب
            </span>

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

        {/* وضعیت درخواست */}
        {createBooking.isError && (
          <p role="alert" className="text-sm text-red-600">
            ثبت رزرو ناموفق بود. لطفاً دوباره تلاش کنید.
          </p>
        )}

        {createBooking.isSuccess && (
          <p className="text-sm text-green-600">
            درخواست رزرو با موفقیت ثبت شد.
          </p>
        )}

        {/* ثبت رزرو */}
        <Button
          type="button"
          size="md"
          variant="primary"
          disabled={createBooking.isPending || nights <= 0}
          onClick={handleBooking}
          className="flex w-full items-center justify-center gap-2 font-semibold"
        >
          <span className="pl-2">
            {createBooking.isPending
              ? "در حال ثبت رزرو..."
              : "همین الان رزرو کن"}
          </span>

          {!createBooking.isPending && (
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} />
          )}
        </Button>
      </div>
    </aside>
  );
}
