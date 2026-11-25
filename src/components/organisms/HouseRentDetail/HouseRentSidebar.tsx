"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import Button from "@/components/atoms/button/Button";
import { HouseRent } from "@/core/types/RentHouse/house";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserAccountIcon,
  ArrowLeft01Icon,
  House04Icon,
  Calendar03Icon,
  Money02Icon,
  MoneyExchange01Icon,
} from "@hugeicons/core-free-icons";
import { formatPersianDate, formatPrice } from "@/utils/formatters";
import HouseQAModal from "../PropertyQA/HouseQAModal";

import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

import {
  createVisitAppointment,
  VisitAppointmentType,
} from "@/services/visitAppointment.service";

interface Props {
  house: HouseRent;
}

export default function HouseRentSidebar({ house }: Props) {
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<DateObject | null>(null);

  const [selectedTime, setSelectedTime] = useState("10:00");

  const [appointmentType, setAppointmentType] =
    useState<VisitAppointmentType>("in_person");

  const [isPending, startTransition] = useTransition();

  const { theme } = useTheme();

  const currentUserId =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id") || localStorage.getItem("userId")
      : null;

  const ownerId =
    house.seller_id ??
    (
      house as HouseRent & {
        sellerId?: string | number;
        user_id?: string | number;
      }
    ).sellerId ??
    (
      house as HouseRent & {
        sellerId?: string | number;
        user_id?: string | number;
      }
    ).user_id;

  const isSellerUser = Boolean(
    ownerId && currentUserId && String(ownerId) === String(currentUserId),
  );

  const handleCreateAppointment = () => {
    if (!selectedDate) {
      toast.error("لطفاً تاریخ بازدید را انتخاب کنید");
      return;
    }

    const appointmentDate = selectedDate.toDate();

    const [hours, minutes] = selectedTime.split(":").map(Number);

    appointmentDate.setHours(hours, minutes, 0, 0);

    if (appointmentDate.getTime() <= Date.now()) {
      toast.error("زمان انتخاب شده باید در آینده باشد");
      return;
    }

    const payload = {
      houseId: house.id,
      appointmentTime: appointmentDate.toISOString(),
      type: appointmentType,
    };

    startTransition(async () => {
      const result = await createVisitAppointment(payload);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("زمان بازدید با موفقیت ثبت شد");

      setIsAppointmentModalOpen(false);
      setSelectedDate(null);
      setSelectedTime("10:00");
      setAppointmentType("in_person");
    });
  };

  return (
    <>
      <aside
        dir="rtl"
        className="h-fit w-full rounded-2xl border border-neutral-200 bg-white p-5 dark:bg-[#272727] lg:sticky lg:top-33"
      >
        <h2 className="mb-5 flex items-center justify-center gap-2 text-base font-bold">
          <HugeiconsIcon icon={House04Icon} size={24} />
          رزرو خونه برای {house.title}
        </h2>

        <div className="mb-6 flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-xs dark:bg-[#353535]">
          {house.sellerAvatar ? (
            <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-full border border-neutral-100">
              <Image
                src={house.sellerAvatar}
                alt={house.sellerName || "فروشنده"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-200">
              <HugeiconsIcon icon={UserAccountIcon} size={28} />
            </div>
          )}

          <p className="font-semibold">
            {house.sellerName || "امیر محمد خیرآبادی"}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
            <HugeiconsIcon icon={Calendar03Icon} />
            <span>
              {house.last_updated
                ? formatPersianDate(house.last_updated)
                : "3 تیر - 1404 10:10"}
            </span>
          </div>
        </div>

        <p className="mb-3 text-center text-sm font-bold">قیمت</p>

        <div className="mb-6 space-y-2.5">
          <div className="flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-3 text-sm dark:bg-[#353535]">
            <span className="flex items-center gap-2 font-medium">
              <HugeiconsIcon icon={Money02Icon} />
              قیمت رهن از
            </span>

            <span className="font-bold">
              {formatPrice(house.discounted_price) || "-"} ت
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-3 text-sm dark:bg-[#353535]">
            <span className="flex items-center gap-2 font-medium">
              <HugeiconsIcon icon={MoneyExchange01Icon} />
              قیمت اجاره از
            </span>

            <span className="font-bold">
              {formatPrice(house.price) || "-"} ت
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-center gap-1.5 text-[14px] font-semibold">
            <HugeiconsIcon icon={UserAccountIcon} size={24} />
            <span>ارتباط با فروشنده</span>
          </div>

          <Button
            size="md"
            variant="primary"
            className="flex w-full items-center justify-center rounded-2xl px-4 py-3.5 font-medium text-white"
          >
            <span className="flex items-center gap-2">
              تماس با {house.sellerPhone || "0939****353"}
            </span>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Button>

          <Button
            size="md"
            variant="primary"
            onClick={() => setIsAppointmentModalOpen(true)}
            className="flex w-full items-center justify-center rounded-2xl px-4 py-3.5 font-medium text-white"
          >
            <span className="flex items-center gap-2">
              تنظیم تایم بازدید
            </span>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Button>

          <Button
            size="md"
            variant="outline"
            onClick={() => setIsQAModalOpen(true)}
            className="flex w-full items-center justify-center rounded-2xl border-blue-700 px-4 py-3.5 font-medium text-blue-700 hover:bg-blue-50"
          >
            <span className="flex items-center gap-2">گفت و گو با فروشنده</span>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Button>
        </div>
      </aside>

      {isAppointmentModalOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsAppointmentModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#272727]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold">تنظیم زمان بازدید</h3>

              <button
                type="button"
                onClick={() => setIsAppointmentModalOpen(false)}
                className="text-2xl text-neutral-500 hover:text-red-500"
              >
                &times;
              </button>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold">
                نوع بازدید
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAppointmentType("in_person")}
                  className={`rounded-xl border p-3 text-sm transition ${
                    appointmentType === "in_person"
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950"
                      : "border-neutral-200 dark:border-neutral-600"
                  }`}
                >
                  بازدید حضوری
                </button>

                <button
                  type="button"
                  onClick={() => setAppointmentType("virtual")}
                  className={`rounded-xl border p-3 text-sm transition ${
                    appointmentType === "virtual"
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950"
                      : "border-neutral-200 dark:border-neutral-600"
                  }`}
                >
                  بازدید مجازی
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold">
                تاریخ بازدید
              </label>

              <DatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                calendar={persian}
                locale={persian_fa}
                format="YYYY/M/D"
                minDate={
                  new DateObject({
                    calendar: persian,
                    locale: persian_fa,
                  })
                }
                calendarPosition="bottom-right"
                inputClass="!h-12 !w-full !rounded-xl !border !border-neutral-200 !bg-[#F0F0F3] !px-4 !text-base !outline-none dark:!border-neutral-600 dark:!bg-[#353535] dark:!text-white"
                containerClassName="w-full"
                portal
                zIndex={10000}
                className={theme === "dark" ? "bg-dark" : ""}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold">
                ساعت بازدید
              </label>

              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-[#F0F0F3] px-4 text-left outline-none dark:border-neutral-600 dark:bg-[#353535] dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={handleCreateAppointment}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "در حال ثبت..." : "ثبت زمان بازدید"}
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsAppointmentModalOpen(false)}
                className="rounded-xl border border-neutral-300 px-4 py-3 dark:border-neutral-600"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

<HouseQAModal
  houseId={house.id}
  isOpen={isQAModalOpen}
  onClose={() => setIsQAModalOpen(false)}
/>
    </>
  );
}