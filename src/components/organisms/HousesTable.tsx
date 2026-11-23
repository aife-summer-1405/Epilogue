"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PencilEdit02Icon,
  Delete02Icon,
  ViewIcon,
  StarIcon,
  Location01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons";
import { House } from "@/core/types/house";
import { TransactionBadge } from "@/components/molecules/TransactionBadge";
import { formatCategoryFa } from "@/lib/formatters/house";

interface HousesTableProps {
  houses: House[];
  isLoading: boolean;
  onView: (house: House) => void;
  onEdit: (house: House) => void;
  onDelete: (house: House) => void;
}

export function HousesTable({
  houses,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: HousesTableProps) {
  if (!isLoading && houses.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-10 text-center">
        <p className="text-sm font-bold text-default-text">
          اقامتگاهی با این مشخصات یافت نشد
        </p>
        <p className="mt-1 text-xs text-neutral-800 dark:text-neutral-600">
          فیلترهای فروشنده یا قیمت را تغییر دهید یا مجدداً تلاش کنید.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right">
            <thead>
              <tr className="border-b border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50 text-xs font-bold text-neutral-800 dark:text-neutral-700">
                <th className="px-4 py-3.5">اقامتگاه</th>
                <th className="px-4 py-3.5">نوع معامله و دسته</th>
                <th className="px-4 py-3.5">فروشنده</th>
                <th className="px-4 py-3.5">ظرفیت و فضا</th>
                <th className="px-4 py-3.5">قیمت</th>
                <th className="px-4 py-3.5">امتیاز</th>
                <th className="px-4 py-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-sm">
              {houses.map((house, idx) => {
                const coverPhoto = house.photos?.[0];
                const numericPrice = Number(house.price) || 0;

                return (
                  <motion.tr
                    key={house.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(idx * 0.04, 0.4),
                    }}
                    className="group transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-50/60"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {coverPhoto ? (
                          <img
                            src={coverPhoto}
                            alt={house.title}
                            className="h-11 w-14 shrink-0 rounded-xl object-cover border border-neutral-300 dark:border-neutral-200"
                          />
                        ) : (
                          <div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
                            <HugeiconsIcon
                              icon={Home01Icon}
                              size={20}
                              color="currentColor"
                              strokeWidth={1.8}
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate max-w-[220px] font-bold text-default-text">
                            {house.title}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 truncate max-w-[220px] text-xs text-neutral-800 dark:text-neutral-600">
                            <HugeiconsIcon
                              icon={Location01Icon}
                              size={13}
                              color="currentColor"
                              className="shrink-0"
                            />
                            <span className="truncate">{house.address}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-col items-start gap-1.5">
                        <TransactionBadge type={house.transaction_type} />
                        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-600">
                          دسته: {formatCategoryFa(house.categories?.name)}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-default-text">
                        {house.sellerName || "فروشنده"}
                      </div>
                      <div className="text-xs text-neutral-800 dark:text-neutral-600">
                        شناسه:{" "}
                        {new Intl.NumberFormat("fa-IR", {
                          useGrouping: false,
                        }).format(Number(house.sellerId) || 0)}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-600">
                      <div className="font-semibold text-default-text">
                        ظرفیت:{" "}
                        {new Intl.NumberFormat("fa-IR").format(house.capacity)}{" "}
                        نفر
                      </div>
                      <div className="mt-0.5">
                        {new Intl.NumberFormat("fa-IR").format(house.rooms)} اتاق
                        ·{" "}
                        {new Intl.NumberFormat("fa-IR").format(house.bathrooms)}{" "}
                        حمام
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-extrabold text-default-text">
                        {new Intl.NumberFormat("fa-IR").format(numericPrice)}
                      </span>{" "}
                      <span className="text-xs text-neutral-800 dark:text-neutral-600">
                        تومان
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 dark:bg-warning-900/30 px-2.5 py-1 text-xs font-bold text-warning-700 dark:text-warning-500">
                        <HugeiconsIcon
                          icon={StarIcon}
                          size={14}
                          color="currentColor"
                        />
                        {new Intl.NumberFormat("fa-IR", {
                          maximumFractionDigits: 2,
                        }).format(Number(house.rate) || 0)}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onView(house)}
                          title="مشاهده جزئیات"
                          className="inline-flex items-center gap-1 rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-50 dark:hover:bg-neutral-100 px-2.5 py-1.5 text-xs font-bold text-default-text transition-colors cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={ViewIcon}
                            size={15}
                            color="currentColor"
                            strokeWidth={1.8}
                          />
                          <span>جزئیات</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(house)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-primary-300 dark:border-primary-400/50 bg-primary-50 hover:bg-primary-100 dark:bg-primary-100/30 dark:hover:bg-primary-100/50 px-3 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-800 transition-colors cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={PencilEdit02Icon}
                            size={15}
                            color="currentColor"
                            strokeWidth={1.8}
                          />
                          <span>ویرایش</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(house)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-danger-300 dark:border-danger-700/60 bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/30 dark:hover:bg-danger-900/50 px-3 py-1.5 text-xs font-bold text-danger-600 dark:text-danger-400 transition-colors cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={15}
                            color="currentColor"
                            strokeWidth={1.8}
                          />
                          <span>حذف</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {houses.map((house, idx) => {
          const coverPhoto = house.photos?.[0];
          const numericPrice = Number(house.price) || 0;

          return (
            <motion.div
              key={house.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.35) }}
              className="flex flex-col justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {coverPhoto ? (
                    <img
                      src={coverPhoto}
                      alt={house.title}
                      className="h-12 w-14 shrink-0 rounded-xl object-cover border border-neutral-300 dark:border-neutral-200"
                    />
                  ) : (
                    <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
                      <HugeiconsIcon
                        icon={Home01Icon}
                        size={20}
                        color="currentColor"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-default-text">
                      {house.title}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-neutral-800 dark:text-neutral-600">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        size={13}
                        color="currentColor"
                        className="shrink-0"
                      />
                      <span className="truncate">{house.address}</span>
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-lg bg-neutral-200 dark:bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800 dark:text-neutral-700">
                  #{house.id}
                </span>
              </div>

              <div className="space-y-2 border-y border-neutral-200 dark:border-neutral-100 py-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    نوع معامله:
                  </span>
                  <TransactionBadge type={house.transaction_type} />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    دسته‌بندی:
                  </span>
                  <span className="font-semibold text-default-text">
                    {formatCategoryFa(house.categories?.name)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    فروشنده:
                  </span>
                  <span className="font-semibold text-default-text">
                    {house.sellerName || "فروشنده"} (
                    {new Intl.NumberFormat("fa-IR", {
                      useGrouping: false,
                    }).format(Number(house.sellerId) || 0)}
                    )
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    ظرفیت و فضا:
                  </span>
                  <span className="text-default-text">
                    {new Intl.NumberFormat("fa-IR").format(house.capacity)} نفر ·{" "}
                    {new Intl.NumberFormat("fa-IR").format(house.rooms)} اتاق ·{" "}
                    {new Intl.NumberFormat("fa-IR").format(house.bathrooms)} حمام
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    قیمت:
                  </span>
                  <span className="font-extrabold text-default-text">
                    {new Intl.NumberFormat("fa-IR").format(numericPrice)} تومان
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    امتیاز:
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 dark:bg-warning-900/30 px-2 py-0.5 text-[11px] font-bold text-warning-700 dark:text-warning-500">
                    <HugeiconsIcon
                      icon={StarIcon}
                      size={12}
                      color="currentColor"
                    />
                    {new Intl.NumberFormat("fa-IR", {
                      maximumFractionDigits: 2,
                    }).format(Number(house.rate) || 0)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onView(house)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-50 dark:hover:bg-neutral-100 py-2 text-xs font-bold text-default-text transition-colors cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={ViewIcon}
                    size={15}
                    color="currentColor"
                  />
                  <span>جزئیات</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(house)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={PencilEdit02Icon}
                    size={15}
                    color="currentColor"
                  />
                  <span>ویرایش</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(house)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/30 dark:hover:bg-danger-900/50 py-2 text-xs font-bold text-danger-600 dark:text-danger-400 transition-colors cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    size={15}
                    color="currentColor"
                  />
                  <span>حذف</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}