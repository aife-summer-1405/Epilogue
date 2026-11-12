"use client";

import Badge from "@/components/atoms/badge/Badge";
import Button from "@/components/atoms/button/Button";
import DropDownMenu from "@/components/molecules/dropdown/DropDownMenu";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import SelectComponent from "@/components/molecules/select/Select";
import StatCard from "@/components/molecules/statCard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import useFakeLoading from "@/hooks/useFakeLoading";
import {
  Building06Icon,
  EllipsisVerticalIcon,
  HourglassIcon,
  ListChecksIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const reservations = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "هتل سراوان راتین رشت",
  image: "/images/hotel.jpg",
  date: "۱۲ مرداد ۱۴۰۱ - ۱۲:۳۳",
  price: "۲,۰۰۰,۰۰۰",
  status: "تایید شده",
}));

const items = [
  { label: "ماه جاری", value: "month" },
  { label: "سال جاری", value: "year" },
];

const dropDownOptions = [
  { label: "تایید رزرو" },
  { label: "لغو رزرو" },
  { label: "جزئیات" },
  { label: "حذف" },
];

const href = "/panel/reserveManagement/buyer";

const stats = [
  { icon: Building06Icon, label: "کل ملک ها", value: 20, href },
  { icon: ListChecksIcon, label: "رزرو های فعال", value: 20, href },
  { icon: HourglassIcon, label: "رزرو های در انتظار", value: 20, href },
  { icon: ViewIcon, label: "بازدید های امروز", value: 20, href },
];

const progressStyles = buildStyles({
  strokeLinecap: "round",
  pathColor: "var(--color-primary-800)",
  trailColor: "var(--color-neutral-200)",
  textColor: "var(--color-primary-800)",
  textSize: "18px",
});

const SellerDashboard = () => {
  const isLoading = useFakeLoading();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} isLoading={isLoading} />
        ))}
      </div>
      <div className="flex flex-col items-stretch gap-4 xl:flex-row">
        <div className="flex w-full flex-col gap-4 rounded-[24px] bg-default-white-bg p-4 sm:gap-5 sm:p-6 xl:w-1/2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
              <p className="text-base font-bold sm:text-lg xl:text-[20px]">
                نمودار درآمد
              </p>
              <span className="text-sm font-normal text-neutral-dark-200 sm:text-base">
                از تاریخ 1 تا 31 شهریور 1404
              </span>
            </div>
            <SelectComponent
              defaultValue="month"
              onChange={(event) => console.log(event)}
              items={items}
              triggerClassName="rounded-[40px] border-neutral-300 w-fit px-3! py-2! h-9! sm:px-4! sm:py-2.5! sm:h-10.5! bg-transparent! text-sm! sm:text-base! font-normal! text-default-text!"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-end">
            {isLoading ? (
              <>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-28" />
                  <Skeleton className="h-12 w-28" />
                </div>
                <Skeleton className="size-28 shrink-0 self-end rounded-full sm:size-32.5" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-neutral-400 sm:size-4" />
                      <span className="text-xs text-neutral-dark-300 sm:text-[14px]">
                        درآمد کل
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-normal text-default-text sm:gap-2 sm:text-[14px]">
                      <p>100,000,000</p>
                      <p>تومان</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-primary-600 sm:size-4" />
                      <span className="text-xs text-neutral-dark-300 sm:text-[14px]">
                        درآمد این ماه
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-normal text-default-text sm:gap-2 sm:text-[14px]">
                      <p>60,000,000</p>
                      <p>تومان</p>
                    </div>
                  </div>
                </div>
                <div className="size-28 shrink-0 self-end sm:size-32.5">
                  <CircularProgressbar
                    value={66}
                    text={`${66}%`}
                    strokeWidth={12}
                    styles={progressStyles}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 rounded-[24px] bg-default-white-bg p-4 sm:gap-5 sm:p-6 xl:w-1/2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
              <p className="text-base font-bold sm:text-lg xl:text-[20px]">
                نمودار تکمیل پروفایل
              </p>
              <span className="text-sm font-normal text-neutral-dark-200 sm:text-base">
                پروفایل باید حداقل ۷۰٪ تکمیل شده باشد.
              </span>
            </div>
            <Button
              variant="outline"
              className="w-fit rounded-[40px] border-neutral-300 px-3! py-2! h-9! sm:px-4! sm:py-2.5! sm:h-10.5! bg-transparent! text-sm! sm:text-base! font-normal! text-default-text! hover:border-primary-800 hover:text-primary-800"
            >
              ویرایش پروفایل
            </Button>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-end">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="size-28 shrink-0 self-end rounded-full sm:size-32.5" />
              </>
            ) : (
              <>
                <p className="text-xs font-normal text-neutral-dark-200 sm:text-sm xl:text-[14px]">
                  آخرین ویرایش 3 روز پیش
                </p>
                <div className="size-28 shrink-0 self-end sm:size-32.5">
                  <CircularProgressbar
                    value={16}
                    text={`${16}%`}
                    strokeWidth={12}
                    styles={progressStyles}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-[24px] bg-default-white-bg p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="truncate text-lg font-bold text-default-text sm:text-[20px]">
            رزرو های اخیر مشتریان
          </h2>
          <Link
            href="/panel/reservations"
            className="shrink-0 text-sm font-normal text-neutral-dark-200 sm:text-base"
          >
            مشاهده همه
          </Link>
        </div>
        <div className="max-h-65 overflow-x-auto overflow-y-auto scrollbar-hide [-ms-overflow-style:none] scrollbar-width:none [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-160 text-xs sm:min-w-170 sm:text-sm">
            <thead className="sticky top-0 z-10 bg-default-white-bg">
              <tr className="text-right text-gray-700">
                <th className="py-3 font-bold text-sm text-default-text sm:text-base">
                  نام اقامتگاه
                </th>
                <th className="py-3 font-bold text-sm text-default-text sm:text-base">
                  تاریخ رزرو
                </th>
                <th className="py-3 font-bold text-sm text-default-text sm:text-base">
                  قیمت
                </th>
                <th className="py-3 font-bold text-sm text-default-text sm:text-base">
                  وضعیت
                </th>
                <th className="py-3 text-left font-bold text-sm text-default-text sm:text-base">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }, (_, i) => (
                    <tr key={i} className="border-t border-neutral-300">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-8 rounded-full" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-7 w-20 rounded-[8px]" />
                      </td>
                      <td className="py-3 pl-3">
                        <Skeleton className="mr-auto size-6 rounded-full" />
                      </td>
                    </tr>
                  ))
                : reservations.map((item) => (
                    <tr key={item.id} className="border-t border-neutral-300">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <ImageFallback
                            src={item.image}
                            alt={item.name}
                            className="size-8 shrink-0 rounded-full object-cover"
                            width={32}
                            height={32}
                          />
                          <span className="truncate text-sm font-normal text-default-text sm:text-base">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm font-normal text-default-text sm:text-base">
                        {item.date}
                      </td>
                      <td className="py-3 text-sm font-normal text-default-text sm:text-base">
                        {item.price} <span className="mr-1">تومان</span>
                      </td>
                      <td className="py-3">
                        <Badge text={item.status} type="success" />
                      </td>
                      <td className="flex justify-end py-3 pl-3">
                        <DropDownMenu
                          triggerRender={
                            <HugeiconsIcon
                              icon={EllipsisVerticalIcon}
                              className="size-5 cursor-pointer text-default-black sm:size-6"
                            />
                          }
                          dropDownItems={dropDownOptions}
                        />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
