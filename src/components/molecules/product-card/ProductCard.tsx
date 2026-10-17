"use client";

import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    StarIcon,
    Location01Icon,
    Bathtub01Icon,
    BedIcon,
    CarParking02Icon,
    User02Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import type { ProductCardProps } from "./product-card.types";

export default function ProductCard({
    image,
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
}: ProductCardProps) {
    const isOff = typeof off === "number" && off > 0;

    return (
        <article
            className={cn(
                "w-full  overflow-hidden rounded-[28px]",
                " bg-white border border-gray-200 dark:border-none",
                "dark:bg-[#272727] dark:text-white",
                className,
            )}
            onClick={onClick}
        >
            {/* Image */}
            <div className="relative aspect-340/230 w-full overflow-hidden bg-natural-200">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, 350px"
                    className="object-cover"
                    onClick={onDetailsClick}
                />

                {/* Badges */}
                <div className="absolute right-3 top-3 flex items-center gap-2">


                    <span className="inline-flex items-center justify-center gap-1 rounded-full bg-primary-500 px-2 py-1 text-xs text-white">
                        <span className="text-[14px]  text-white relative top-0.5">
                            {rating.toFixed(1)}

                        </span>

                        <HugeiconsIcon
                            icon={StarIcon}
                            size={21}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    </span>
                    {isOff && (
                        <span className="rounded-full  bg-red-600 px-2 py-1 text-[14px]  text-white">
                            <span className="text-[14px]  text-white relative top-0.5">

                                %{off}

                            </span>
                        </span>
                    )}
                </div>

                {/* Address */}
                <div className="absolute inset-x-3 bottom-3 flex items-center gap-1 text-right text-[16px] text-white">
                    <HugeiconsIcon
                        icon={Location01Icon}
                        size={24}
                        color="currentColor"
                    />
                    <span className="line-clamp-1">{address}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-5">
                <h3 className="line-clamp-1 text-[24px] font-bold">
                    {title}
                </h3>

                {/* Features */}
                <div className="flex flex-wrap items-center  gap-3 gap-y-2  text-[16px] text-[#a6a6a6] dark:text-natural-300">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <HugeiconsIcon icon={BedIcon} size={22} />
                        {bedrooms} خواب
                    </span>

                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <HugeiconsIcon icon={Bathtub01Icon} size={22} />
                        {bathrooms} حمام
                    </span>

                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <HugeiconsIcon icon={User02Icon} size={22} />            {guests} نفر
                    </span>

                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <HugeiconsIcon icon={CarParking02Icon} size={22} />            {parking} پارکینگ
                    </span>
                </div>

                {/* Price */}
                <div className="flex min-h-13.5 items-center justify-between gap-3 rounded-2xl bg-gray-100 px-3 py-3 dark:bg-[#353535] dark:text-white">
                    {isOff ? (
                        <>
                            {originalPrice && (
                                <span className="relative shrink-0 text-[16px] text-red-500">
                                    {originalPrice} تومان
                                    <span className="absolute left-0 top-1/2 h-px w-full rotate-[-8deg] bg-red-500" />

                                </span>
                            )}
                            <p className="text-[#a6a6a6]">|</p>

                            <div className="flex flex-wrap items-center gap-2 text-sm font-bold ">
                                <span className="text-[16px]">{pricePerNight} ت  </span>
                                /
                                <span className="text-[14px] font-normal text-[#a6a6a6] dark:text-natural-300">
                                    هر شب
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-[16px] text-[#a6a6a6] dark:text-natural-300">
                                اجاره ماهیانه:
                            </span>
                            <div className="flex flex-wrap items-center gap-2 text-sm font-bold ">


                                <span className="text-[16px] font-bold">
                                    {monthlyRent} ت
                                </span>
                                /
                                <span className="text-[14px] font-normal text-[#a6a6a6] dark:text-natural-300">
                                    هر شب
                                </span>
                            </div>

                        </>
                    )}
                </div>
            </div>
        </article>
    );
}
