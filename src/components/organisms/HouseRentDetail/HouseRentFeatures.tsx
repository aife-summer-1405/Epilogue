"use client";

import { HouseRent } from "@/core/types/RentHouse/house";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home09Icon,
  DocumentValidationIcon,
  Building03Icon,
  Calendar01Icon,
  RulerIcon,
  UserGroupIcon,
  Building02Icon,
  Car01Icon,
  Tree01Icon,
  Comment01Icon,
} from "@hugeicons/core-free-icons";

interface Props {
  house: HouseRent;
}

const yardTypeLabels: Record<string, string> = {
  shared: "مشترک",
  private: "اختصاصی",
  none: "ندارد",
};

const categoryLabels: Record<string, string> = {
  apartment: "آپارتمان",
  villa: "ویلا",
  house: "خانه",
  cottage: "کلبه",
};

export default function HouseRentFeatures({ house }: Props) {
  const features = [
    {
      label: "تعداد واحد",
      value: "۱ واحد",
      icon: Home09Icon,
    },
    {
      label: "سند",
      value: "ثبت نشده",
      icon: DocumentValidationIcon,
    },
    {
      label: "تعداد طبقات",
      value: "ثبت نشده",
      icon: Building03Icon,
    },
    {
      label: "سال ساخت",
      value: "ثبت نشده",
      icon: Calendar01Icon,
    },
    {
      label: "متراژ",
      value: "ثبت نشده",
      icon: RulerIcon,
    },
    {
      label: "تعداد خواب",
      value: `${house.rooms} اتاق`,
      icon: Building03Icon,
    },
    {
      label: "ظرفیت",
      value: `${house.capacity} نفر`,
      icon: UserGroupIcon,
    },
    {
      label: "نوع ملک",
      value: categoryLabels[house.categories?.name] ?? house.categories?.name ?? "ثبت نشده",
      icon: Building02Icon,
    },
    {
      label: "سرویس بهداشتی",
      value: `${house.bathrooms} عدد`,
      icon: Building03Icon,
    },
    {
      label: "پارکینگ",
      value: `${house.parking} خودرو`,
      icon: Car01Icon,
    },
    {
      label: "حیاط",
      value: yardTypeLabels[house.yard_type] ?? house.yard_type ?? "ثبت نشده",
      icon: Tree01Icon,
    },
    {
      label: "نظرات",
      value: `${house.num_comments} نظر`,
      icon: Comment01Icon,
    },
  ];

  return (
    <section dir="rtl" className="w-full">
      <h2 className="mb-4 text-base font-bold text-neutral-900">
        امکانات و مشخصات اقامتگاه
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {features.map((feature, index) => {
          // بررسی وجود آیکون برای جلوگیری از خطای undefined
          const IconComponent = feature.icon || Home09Icon;
          const isSelected = index === 0;

          return (
            <div
              key={feature.label}
              className={`flex min-h-[95px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#B9BBC6] p-3 text-center transition-all `}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isSelected ? "text-[#1E40AF]" : "text-blue-800"
                }`}
              >
                <HugeiconsIcon icon={IconComponent} size={22} />
              </div>

              <span className="text-sm font-bold text-[#1E40AF]">
                {feature.label}
              </span>

              <span className="text-xs text-[#80838D]">
                {feature.value}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}