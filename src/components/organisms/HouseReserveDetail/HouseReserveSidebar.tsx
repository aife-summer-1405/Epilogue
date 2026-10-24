
"use client";

import { useMemo, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  House04Icon,
  Calendar03Icon,
  UserAccountIcon,
  Money02Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import { HouseRent } from "@/core/types/RentHouse/house";
import { useCreateBooking } from "@/hooks/mutations/useCreateBooking";

interface Props {
  house: HouseRent;
}

const today = new DateObject({ calendar: persian });
const tomorrow = new DateObject({ calendar: persian }).add(1, "day");

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price);

const toGregorianDate = (date: DateObject) =>
  date.convert("gregorian").format("YYYY-MM-DD");

export default function HouseReserveSidebar({ house }: Props) {
  const [startDate, setStartDate] = useState<DateObject | null>(today);
  const [endDate, setEndDate] = useState<DateObject | null>(tomorrow);
  const [travelerCount, setTravelerCount] = useState(1);

  const createBooking = useCreateBooking();

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(`${toGregorianDate(startDate)}T00:00:00`);
    const end = new Date(`${toGregorianDate(endDate)}T00:00:00`);

    return Math.max(
      0,
      Math.round((end.getTime() - start.getTime()) / 86400000)
    );
  }, [startDate, endDate]);

  // فرض شده rentPrice قیمت هر شب است.
  const pricePerNight = Number(
    String(house.rentPrice ?? 0).replace(/[٬,،]/g, "")
  ) || 0;

  const totalPrice = pricePerNight * nights;

  const handleBooking = () => {
    if (!startDate || !endDate || nights <= 0) {
      alert("تاریخ رفت و برگشت را به‌درستی انتخاب کنید.");
      return;
    }

    /*
      API به traveler_details، sharedEmail و sharedMobile نیاز دارد.
      چون این فیلدها از این کامپوننت حذف شده‌اند، باید از اطلاعات
      کاربر لاگین‌شده یا منبع دیگری تأمین شوند.
    */
    alert(
      "برای ثبت رزرو، اطلاعات تماس و مسافران باید از منبع دیگری تأمین شوند."
    );
  };

  return (
    <aside
      dir="rtl"
      className="h-fit w-full rounded-[22px] border border-neutral-200 mb-[32px] bg-white p-4 text-neutral-900  dark:bg-[#272727] dark:text-white "
    >
      <h2 className="mb-5 flex items-center justify-center gap-2 text-base font-bold">
        <HugeiconsIcon icon={House04Icon} size={22} />
        رزرو خونه برای {house.title}
      </h2>

      <div className="space-y-4">
        {/* تاریخ رفت */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">تاریخ رفت</label>

          <div className="relative">
            <DatePicker
              value={startDate}
              onChange={(date) => {
                if (!date || Array.isArray(date)) return;

                setStartDate(date);

                if (endDate && date.toDate() >= endDate.toDate()) {
                  setEndDate(date.add(1, "day"));
                }
              }}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/M/D"
              minDate={today}
              calendarPosition="bottom-right"
              inputClass="!w-full !h-10 !rounded-full !border-0 !bg-neutral-100 !px-4 !pl-10 !text-sm !outline-none dark:!bg-[#353535]"
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
          <label className="block text-sm font-medium">تاریخ برگشت</label>

          <div className="relative">
            <DatePicker
              value={endDate}
              onChange={(date) => {
                if (!date || Array.isArray(date)) return;
                setEndDate(date);
              }}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/M/D"
              minDate={startDate ? startDate.add(1, "day") : tomorrow}
              calendarPosition="bottom-right"
              inputClass="!w-full !h-10 !rounded-full !border-0 !bg-neutral-100 !px-4 !pl-10 !text-sm !outline-none dark:!bg-[#353535]"
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

          <div className="flex items-center rounded-full bg-neutral-100 px-4 dark:bg-[#353535]">
            <HugeiconsIcon icon={UserAccountIcon} size={20} />

            <input
              id="travelerCount"
              type="number"
              min={1}
              max={20}
              value={travelerCount}
              onChange={(event) => {
                const value = Number(event.target.value);
                setTravelerCount(
                  Math.max(1, Math.min(20, value || 1))
                );
              }}
              className="w-full bg-transparent px-3 py-3 text-sm outline-none"
            />

            <span className="shrink-0 text-xs text-neutral-500">نفر</span>
          </div>
        </div>

        {/* قیمت رزرو */}
        <div className="space-y-3 pt-1">
          <p className="flex items-center dark:text-white text-black justify-center gap-2 text-sm font-bold">
            <HugeiconsIcon icon={Money02Icon} size={24} />
            قیمت رزرو
          </p>

          <div className="space-y-3 text-[14px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#8B8D98]">{nights} شب</span>
              <span className="font-semibold dark:text-white text-black">
                {formatPrice(pricePerNight)} تومان
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-2 pt-1 text-sm font-bold">
     
            <p className="flex dark:text-white text-black items-center justify-center gap-2 text-sm font-bold">
              <HugeiconsIcon icon={Money02Icon} size={24} />
              قیمت نهایی
            </p>
            <span>{formatPrice(totalPrice)} تومان</span>
          </div>
        </div>

        <Button
          type="button"
          size="md"
          variant="primary"
          disabled={createBooking.isPending || nights <= 0}
          onClick={handleBooking}
          className="flex w-full "
        >
          <span>همین الان رزرو کن</span>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Button>
      </div>
    </aside>
  );
}
