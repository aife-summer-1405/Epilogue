"use client";

import Image from "next/image";
import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  Location01Icon,
} from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import { HouseRent } from "@/core/types/RentHouse/house";
import { formatPrice } from "@/utils/formatters";

interface Props {
  house: HouseRent;
  startDate: string;
  endDate: string;
  nights: number;
  total: number;
  onChangeHouse: () => void;
}

const toJalali = (date: string) => {
  if (!date) return "—";

  return new DateObject({
    date,
    calendar: gregorian,
    locale: gregorian_en,
  })
    .convert(persian, persian_fa)
    .format("YYYY/MM/DD");
};

export default function BookingHouseCard({
  house,
  startDate,
  endDate,
  nights,
  total,
  onChangeHouse,
}: Props) {
  const image = house.photos?.[0] || house.photos || "";
  const rating = Number(house.rate ?? house.rate ?? 0);
  const discount = Number(house.discounted_price ?? 0);

  const pricePerNight =
    Number(
      String(house.price ?? 0).replace(/[٬,،]/g, ""),
    ) || 0;

  return (
    <article
      className="w-full overflow-hidden rounded-[24px] border border-gray-200 bg-white p-2 text-[#191919] dark:border-[#353535] dark:bg-[#272727] dark:text-white"
    >
      {/* تصویر خانه */}
      <div className="relative aspect-[340/230] w-full overflow-hidden rounded-[18px] bg-gray-100 dark:bg-[#353535]">
        {image ? (
          <Image
            src={image}
            alt={house.title || "تصویر خانه"}
            fill
            sizes="(max-width: 1024px) 100vw, 350px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#8B8D98]">
            تصویری موجود نیست
          </div>
        )}

        <div className="absolute right-2 top-2 flex items-center gap-1">
          {rating > 0 && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-primary-500 px-2 py-1 text-xs text-white"
            >
                <p className="mt-1 font-bold">
              {rating}

                </p>

              <HugeiconsIcon
                icon={StarIcon}
                size={20}
              />
            </span>
          )}

          {discount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
              ٪{house.discounted_price}
            </span>
          )}
        </div>

        {house.address && (
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-1  px-3 py-2 text-xs text-white">
            <HugeiconsIcon
              icon={Location01Icon}
              size={16}
            />

            <span className="line-clamp-1">
              {house.address}
            </span>
          </div>
        )}
      </div>

      {/* عنوان */}
      <div className="flex flex-col gap-3 p-2">
        <h3 className="line-clamp-2 text-[24px] font-bold">
          {house.title}
        </h3>

        {/* تاریخ ورود و خروج */}
        <div className="flex flex-col gap-2 text-[16px] text-[#8B8D98]">
          <div className="flex items-center justify-between gap-2">
            <span>تاریخ ورود به هتل</span>

            <span dir="ltr">
              {toJalali(startDate)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span>تاریخ خروج از هتل</span>

            <span dir="ltr">
              {toJalali(endDate)}
            </span>
          </div>
        </div>

        {/* قیمت نهایی */}
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-gray-100 px-3 py-3 dark:bg-[#353535]">
          <div className="min-w-0">
            <p className="text-[10px] text-[#8B8D98]">
              {formatPrice(nights)} شب اقامت
            </p>

            <p className="mt-1 truncate text-sm font-bold">
              {formatPrice(total)} تومان
            </p>
          </div>

          {discount > 0 && (
            <span className="shrink-0 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
              ٪{discount}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          className="w-full"
          onClick={onChangeHouse}
        >
          تغییر هتل
        </Button>
      </div>
    </article>
  );
}