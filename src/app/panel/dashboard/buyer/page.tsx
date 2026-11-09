"use client";

import Button from "@/components/atoms/button/Button";
import SelectComponent from "@/components/molecules/select/Select";
import {
  HeartIcon,
  LinkCircle02Icon,
  ListChecksIcon,
  ListIcon,
  MoneyRemove02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Reservation = {
  id: number;
  name: string;
  image: string;
  date: string;
  price: string;
  status: string;
};

const reservations: Reservation[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  name: "هتل سراوان راتین رشت",
  image: "/images/hotel.jpg",
  date: "۱۲ مرداد ۱۴۰۱ - ۱۲:۳۳",
  price: "۲,۰۰۰,۰۰۰",
  status: "تایید شده",
}));

export function RecentReservations() {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">رزرو های اخیر</h2>
        <a
          href="/panel/reservations"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          مشاهده همه
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right text-gray-700">
              <th className="py-3 font-medium">نام اقامتگاه</th>
              <th className="py-3 font-medium">تاریخ رزرو</th>
              <th className="py-3 font-medium">قیمت</th>
              <th className="py-3 font-medium">وضعیت</th>
              <th className="py-3 font-medium text-left">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((item) => (
              <tr key={item.id} className="border-t border-gray-200">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-8 rounded-full object-cover"
                    />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="py-3 text-gray-700">{item.date}</td>
                <td className="py-3 text-gray-700">
                  {item.price} <span className="mr-1">تومان</span>
                </td>
                <td className="py-3">
                  <span className="inline-block rounded-md bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-left">
                  <button
                    type="button"
                    aria-label="عملیات"
                    className="p-1 text-gray-600"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle cx="8" cy="3" r="1.3" />
                      <circle cx="8" cy="8" r="1.3" />
                      <circle cx="8" cy="13" r="1.3" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const items = [
  { label: "ماه جاری", value: "month" },
  { label: "سال جاری", value: "year" },
];

const BuyerDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="rounded-[24px] bg-default-white-bg p-4 w-1/4 flex gap-4 items-center">
          <div className="min-h-12 min-w-12 rounded-[8px] bg-neutral-200 flex items-center justify-center">
            <HugeiconsIcon
              icon={ListIcon}
              className="size-6 text-primary-500 dark:text-primary-800"
            />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
              <p className="font-normal text-base text-default-text">
                کل رزرو ها
              </p>
              <Link
                href={"/panel/reserveManagement/buyer"}
                className="rounded-full"
              >
                <HugeiconsIcon
                  icon={LinkCircle02Icon}
                  className="size-5.5 text-default-text transform-[scaleX(-1)]"
                />
              </Link>
            </div>
            <p className="font-bold text-2xl text-default-text">20</p>
          </div>
        </div>
        <div className="rounded-[24px] bg-default-white-bg p-4 w-1/4 flex gap-4 items-center">
          <div className="min-h-12 min-w-12 rounded-[8px] bg-neutral-200 flex items-center justify-center">
            <HugeiconsIcon
              icon={ListChecksIcon}
              className="size-6 text-primary-500 dark:text-primary-800"
            />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
              <p className="font-normal text-base text-default-text">
                رزرو های فعال
              </p>
              <Link
                href={"/panel/reserveManagement/buyer"}
                className="rounded-full"
              >
                <HugeiconsIcon
                  icon={LinkCircle02Icon}
                  className="size-5.5 text-default-text transform-[scaleX(-1)]"
                />
              </Link>
            </div>
            <p className="font-bold text-2xl text-default-text">20</p>
          </div>
        </div>
        <div className="rounded-[24px] bg-default-white-bg p-4 w-1/4 flex gap-4 items-center">
          <div className="min-h-12 min-w-12 rounded-[8px] bg-neutral-200 flex items-center justify-center">
            <HugeiconsIcon
              icon={MoneyRemove02Icon}
              className="size-6 text-primary-500 dark:text-primary-800"
            />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
              <p className="font-normal text-base text-default-text">
                پرداخت نشده
              </p>
              <Link
                href={"/panel/reserveManagement/buyer"}
                className="rounded-full"
              >
                <HugeiconsIcon
                  icon={LinkCircle02Icon}
                  className="size-5.5 text-default-text transform-[scaleX(-1)]"
                />
              </Link>
            </div>
            <p className="font-bold text-2xl text-default-text">20</p>
          </div>
        </div>
        <div className="rounded-[24px] bg-default-white-bg p-4 w-1/4 flex gap-4 items-center">
          <div className="min-h-12 min-w-12 rounded-[8px] bg-neutral-200 flex items-center justify-center">
            <HugeiconsIcon
              icon={HeartIcon}
              className="size-6 text-primary-500 dark:text-primary-800"
            />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
              <p className="font-normal text-base text-default-text">
                علاقه مندی ها
              </p>
              <Link
                href={"/panel/reserveManagement/buyer"}
                className="rounded-full"
              >
                <HugeiconsIcon
                  icon={LinkCircle02Icon}
                  className="size-5.5 text-default-text transform-[scaleX(-1)]"
                />
              </Link>
            </div>
            <p className="font-bold text-2xl text-default-text">20</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-1/2 bg-default-white-bg p-6 rounded-[24px] flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-bold text-[20px]">نمودار درآمد</p>
              <span className="text-base font-normal text-neutral-dark-200">
                از تاریخ 1 تا 31 شهریور 1404
              </span>
            </div>
            <SelectComponent
              defaultValue="month"
              onChange={(event) => console.log(event)}
              items={items}
              triggerClassName="rounded-[40px] border-neutral-300 w-fit px-4! py-2.5! h-10.5! bg-transparent! text-base! font-normal! text-default-text!"
            />
          </div>
          <div className="flex items-end justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-4 bg-neutral-400 rounded-full" />
                  <span className="text-[14px] text-neutral-dark-300">
                    درآمد کل
                  </span>
                </div>
                <div className="flex items-center gap-2 text-default-text font-normal text-[14px]">
                  <p>100,000,000</p>
                  <p>تومان</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-4 bg-primary-600 rounded-full" />
                  <span className="text-[14px] text-neutral-dark-300">
                    درآمد این ماه
                  </span>
                </div>
                <div className="flex items-center gap-2 text-default-text font-normal text-[14px]">
                  <p>60,000,000</p>
                  <p>تومان</p>
                </div>
              </div>
            </div>
            <div className="size-32.5">
              <CircularProgressbar
                value={66}
                text={`${66}%`}
                strokeWidth={12}
                styles={buildStyles({
                  strokeLinecap: "round",
                  pathColor: "var(--color-primary-800)",
                  trailColor: "var(--color-neutral-200)",
                  textColor: "var(--color-primary-800)",
                  textSize: "18px",
                })}
              />
            </div>
          </div>
        </div>
        <div className="w-1/2 bg-default-white-bg p-6 rounded-[24px] flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-bold text-[20px]">نمودار تکمیل پروفایل</p>
              <span className="text-base font-normal text-neutral-dark-200">
                پروفایل باید حداقل ۷۰٪ تکمیل شده باشد.
              </span>
            </div>
            <Button
              variant="outline"
              className="rounded-[40px] border-neutral-300 w-fit px-4! py-2.5! h-10.5! bg-transparent! text-base! font-normal! text-default-text! hover:border-primary-800 hover:text-primary-800"
            >
              ویرایش پروفایل
            </Button>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[14px] font-normal text-neutral-dark-200">
              آخرین ویرایش 3 روز پیش
            </p>
            <div className="size-32.5">
              <CircularProgressbar
                value={16}
                text={`${16}%`}
                strokeWidth={12}
                styles={buildStyles({
                  strokeLinecap: "round",
                  pathColor: "var(--color-primary-800)",
                  trailColor: "var(--color-neutral-200)",
                  textColor: "var(--color-primary-800)",
                  textSize: "18px",
                })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-default-white-bg p-6 rounded-[24px]">
        {RecentReservations()}
      </div>
    </div>
  );
};

export default BuyerDashboard;
