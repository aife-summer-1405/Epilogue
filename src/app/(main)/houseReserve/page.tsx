"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon, StarIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { useHouses } from "@/hooks/queries/houses/useHouses";

export default function HousesPage() {
  // دریافت لیست خانه‌ها با استفاده از تان‌استک کوئری و API واقعی شما
  const { data, isLoading, isError } = useHouses();

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4 py-8">
        <p className="text-neutral-500">در حال دریافت لیست اقامتگاه‌ها...</p>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center px-4 py-8">
        <p className="text-red-500">خطا در دریافت اطلاعات از سرور</p>
      </main>
    );
  }

  // بر اساس ساختار JSON شما، آرایه خانه‌ها داخل property به نام houses قرار دارد
  const houses = data.houses || [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">لیست اقامتگاه‌ها</h1>
          <p className="mt-1 text-sm text-neutral-500">
            مجموع {data.totalCount || houses.length} اقامتگاه آماده رزرو
          </p>
        </div>
      </div>

      {/* گرید نمایش لیست خانه‌ها */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {houses.map((house) => (
          <Link
            key={house.id}
            // هدایت به صفحه دیتیل با آیدی واقعی هر خانه
            href={`/houseReserve/${house.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            {/* تصویر کارت (استفاده از اولین عکس موجود در آرایه photos) */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
              {house.photos && house.photos[0] ? (
                <div
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-neutral-200 text-xs text-neutral-400">
                  بدون تصویر
                </div>
              )}

              {/* امتیاز (Rate) */}
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-neutral-900 shadow-sm backdrop-blur-sm">
                <HugeiconsIcon icon={StarIcon} size={14} className="text-amber-500" />
                <span>{house.rate}</span>
              </div>
            </div>

            {/* اطلاعات متنی کارت */}
            <div className="flex flex-1 flex-col justify-between p-4 text-right">
              <div>
                <h2 className="text-base font-bold text-neutral-900 line-clamp-1">
                  {house.title}
                </h2>
                <div className="mt-1.5 flex items-center gap-1 text-xs text-neutral-500">
                  <HugeiconsIcon icon={Location01Icon} size={16} />
                  <span className="line-clamp-1">{house.address}</span>
                </div>
              </div>

              {/* ظرفیت و قیمت */}
              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                <div className="flex items-center gap-1 text-xs text-neutral-600">
                  <HugeiconsIcon icon={UserGroupIcon} size={16} />
                  <span>ظرفیت: {house.capacity} نفر</span>
                </div>
                
                <div className="text-sm font-bold text-neutral-900">
                  {Number(house.price).toLocaleString()} <span className="text-xs font-normal text-neutral-500">تومان / شب</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}