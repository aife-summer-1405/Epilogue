"use client";

import Image from "next/image";
import Button from "@/components/atoms/button/Button";
import HouseRentPrice from "./HouseRentPrice";
import { HouseRent } from "@/core/types/RentHouse/house";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home09Icon,
  Calendar01Icon,
  Building03Icon,
  RefreshIcon,
  UserAccountIcon,
  Call02Icon,
  BubbleChatIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

interface Props {
  house: HouseRent;
}

export default function HouseRentSidebar({ house }: Props) {
  return (
    <aside
      dir="rtl"
      className="h-fit w-full rounded-2xl border border-neutral-200 bg-white p-5 lg:sticky lg:top-24 shadow-sm"
    >
      {/* Header */}
      <h2 className="mb-5 flex items-center justify-center gap-2 text-base font-bold text-neutral-900">
        <HugeiconsIcon icon={Home09Icon} size={20} className="text-neutral-800" />
        رزرو خونه برای {house.title}
      </h2>

      {/* Seller Card */}
      <div className="mb-6 flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-xs">
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
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-200 text-neutral-800">
            <HugeiconsIcon icon={UserAccountIcon} size={28} />
          </div>
        )}
        <p className="font-bold text-neutral-900">
          {house.sellerName || "امیر محمد خیرآبادی"}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
          <HugeiconsIcon icon={Calendar01Icon} size={15} />
          <span>{house.sellerDate || "3 تیر - 1404  10:10"}</span>
        </div>
      </div>

      {/* Price Section Title */}
      <p className="mb-3 text-center text-sm font-bold text-neutral-900">قیمت</p>

      {/* Price Boxes */}
      <div className="space-y-2.5 mb-6">
        <div className="flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-3 text-sm">
          <span className="flex items-center gap-2 font-medium text-neutral-700">
            <HugeiconsIcon icon={Building03Icon} size={18} />
            قیمت رهن از
          </span>
          <span className="font-bold text-neutral-900">
            {house.mortgagePrice || "4.500.000"}‌ت
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-3 text-sm">
          <span className="flex items-center gap-2 font-medium text-neutral-700">
            <HugeiconsIcon icon={RefreshIcon} size={18} />
            قیمت اجاره از
          </span>
          <span className="font-bold text-neutral-900">
            {house.rentPrice || "4.500.000"}‌ت
          </span>
        </div>
      </div>

      {/* Actions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-700 mb-1">
          <HugeiconsIcon icon={UserAccountIcon} size={16} />
          <span>ارتباط با فروشنده</span>
        </div>

        <Button
          size="md"
          variant="primary"
          className="w-full flex items-center justify-between !bg-blue-700 hover:!bg-blue-800 text-white rounded-2xl py-3.5 px-4 font-medium"
        >
          <span className="flex items-center gap-2">
            <HugeiconsIcon icon={Call02Icon} size={20} />
            تماس با {house.sellerPhone || "0939****353"}
          </span>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Button>

        <Button
          size="md"
          variant="outline"
          className="w-full flex items-center justify-between border-blue-700 text-blue-700 hover:bg-blue-50 rounded-2xl py-3.5 px-4 font-medium"
        >
          <span className="flex items-center gap-2">
            <HugeiconsIcon icon={BubbleChatIcon} size={20} />
            گفت و گو با فروشنده
          </span>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Button>
      </div>
    </aside>
  );
}