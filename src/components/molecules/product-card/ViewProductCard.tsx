"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  Location01Icon,
  Bathtub01Icon,
  User02Icon,
  BedIcon,
  CarParking02Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import { cn } from "@/lib/utils";
import { ProductCardProps } from "./product-card.types";
import { Suspense } from "react";
import ImageSlider from "@/components/molecules/imageSlider/ImageSlider";
import formatPrice from "@/lib/formatters/price";

export default function ViewProductCard({
  title,
  address,
  rating,
  bedrooms,
  bathrooms,
  guests,
  parking,
  monthlyRent,
  pricePerNight,
  off,
  originalPrice,
  className,
  onClick,
  onDetailsClick,
  slides,
}: ProductCardProps) {
  const isOff = typeof off === "number" && off > 0;

  return (
    <article
      dir="rtl"
      className={cn(
        "flex w-full flex-col overflow-hidden",
        "rounded-[26px]  border border-gray-200 dark:border-none bg-white",
        "text-black dark:bg-[#272727]  dark:text-white",
        "sm:flex-row  sm:items-stretch sm:gap-3 sm:p-2",
        className,
      )}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-340/230 w-full shrink-0 overflow-hidden rounded-[20px] bg-natural-200  sm:aspect-auto sm:w-[34%]">
        <Suspense
          fallback={
            <div className="size-full rounded-[24px] bg-neutral-300 animate-pulse" />
          }
        >
          <ImageSlider slides={slides} className="size-full" autoPlay={false} />
        </Suspense>
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:order-1 sm:p-2">
        <h3 className="line-clamp-1 text-lg font-bold sm:text-2xl">{title}</h3>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-500 px-2 py-1 text-white">
            <span className="text-[14px]">{rating.toFixed(1)} ستاره</span>
            <HugeiconsIcon
              icon={StarIcon}
              size={19}
              color="currentColor"
              strokeWidth={1.5}
            />
          </span>

          {isOff && (
            <span className="rounded-full bg-red-500 px-2 py-1 text-[14px] text-white">
              %{off}
            </span>
          )}
        </div>
        {/* Address */}
        <div className="flex min-w-0 items-center gap-1 text-sm text-[#969696]">
          <HugeiconsIcon
            icon={Location01Icon}
            size={20}
            color="currentColor"
            strokeWidth={1.5}
          />
          <span className="line-clamp-1">{address}</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#969696] dark:text-natural-300">
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <HugeiconsIcon icon={BedIcon} size={19} />
            {bedrooms} خواب
          </span>

          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <HugeiconsIcon icon={Bathtub01Icon} size={19} />
            {bathrooms} حمام
          </span>

          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <HugeiconsIcon icon={User02Icon} size={19} />
            {guests} نفر
          </span>

          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <HugeiconsIcon icon={CarParking02Icon} size={19} />
            {parking} پارکینگ
          </span>
        </div>

        {/* Price */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-full bg-gray-100 px-3 py-3 dark:bg-[#353535] dark:text-white sm:flex-none">
            {isOff ? (
              <>
                {originalPrice && (
                  <span className="relative shrink-0 text-xs text-red-500">
                    {formatPrice(Number(originalPrice))} تومان
                    <span className="absolute left-0 top-1/2 h-px w-full rotate-[-8deg] bg-red-500" />
                  </span>
                )}
                <p className="text-[#a6a6a6]">|</p>

                <span className="text-sm font-bold">{pricePerNight} ت</span>
                <span className="shrink-0 text-xs text-[#969696]">/ هر شب</span>
              </>
            ) : (
              <>
                <div className="flex gap-12">
                  <span className="shrink-0 text-xs text-[#969696]">
                    اجاره ماهیانه:
                  </span>

                  <span className="whitespace-nowrap flex gap-1 text-sm font-bold">
                    {formatPrice(Number(monthlyRent))} ت/
                    <span className="shrink-0 text-xs text-[#969696]">
                      هر شب
                    </span>
                  </span>
                </div>
              </>
            )}
          </div>
          <Button
            variant="link"
            endIcon={
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={24}
                strokeWidth={1.5}
              />
            }
            onClick={onDetailsClick}
          >
            مشاهده جزئیات
          </Button>
        </div>
      </div>
    </article>
  );
}
