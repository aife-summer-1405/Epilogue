"use client";

import { HouseRent } from "@/core/types/RentHouse/house";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home09Icon,
  DocumentValidationIcon,

  RulerIcon,
  UserGroupIcon,
  Building02Icon,
  Car01Icon,
  Tree01Icon,
  Comment01Icon,
  Home11Icon,
  Stairs02Icon,
  Calendar03Icon,
  BedIcon,
  Toilet01Icon,
} from "@hugeicons/core-free-icons";
import ButtonOnlyIcon from "@/components/atoms/buttonOnlyIcon/buttonOnlyIcon";

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
      icon: Home11Icon,
    },
    {
      label: "سند",
      value: "ثبت نشده",
      icon: DocumentValidationIcon,
    },
    {
      label: "تعداد طبقات",
      value: "ثبت نشده",
      icon: Stairs02Icon,
    },
    {
      label: "سال ساخت",
      value: "ثبت نشده",
      icon: Calendar03Icon,
    },
    {
      label: "متراژ",
      value: "ثبت نشده",
      icon: RulerIcon,
    },
    {
      label: "تعداد خواب",
      value: `${house.rooms} اتاق`,
      icon: BedIcon,
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
      icon: Toilet01Icon,
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


      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {features.map((feature, index) => {
          // بررسی وجود آیکون برای جلوگیری از خطای undefined
          const IconComponent = feature.icon || Home09Icon;

          return (
            <div
              key={feature.label}
              className={`flex min-h-[95px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#B9BBC6] p-3 text-center dark:border-[#272727] dark:bg-[#272727] transition-all hover:border-r-4 hover:border-[#1E40AF]`}
            >
              <ButtonOnlyIcon hasIcon={false} variant="outline"
                className={`flex items-center border rounded-full size-10 justify-center rounded-full`}
              >
                <HugeiconsIcon icon={IconComponent} size={22} />
              </ButtonOnlyIcon>

              <span className="text-sm font-bold text-[#1E40AF]">
                {feature.label}
              </span>

              <span className="text-xs dark:text-white text-[#80838D]">
                {feature.value}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}