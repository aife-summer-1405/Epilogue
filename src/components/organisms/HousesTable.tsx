"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    PencilEdit02Icon,
    Delete02Icon,
    ViewIcon,
    StarIcon,
    Location01Icon,
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
        <div className="overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-right">
                    <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-100 bg-neutral-100/70 dark:bg-neutral-50/50 text-xs font-extrabold text-neutral-800 dark:text-neutral-600">
                            <th className="px-4 py-3.5">اقامتگاه</th>
                            <th className="px-4 py-3.5">نوع معامله و دسته</th>
                            <th className="px-4 py-3.5">فروشنده</th>
                            <th className="px-4 py-3.5">ظرفیت و فضا</th>
                            <th className="px-4 py-3.5">قیمت</th>
                            <th className="px-4 py-3.5">امتیاز</th>
                            <th className="px-4 py-3.5 text-center">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-xs sm:text-sm">
                        {houses.map((house) => {
                            const coverPhoto = house.photos?.[0];
                            const numericPrice = Number(house.price) || 0;

                            return (
                                <tr
                                    key={house.id}
                                    className="hover:bg-neutral-100/50 dark:hover:bg-neutral-50/30 transition-colors"
                                >
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            {coverPhoto ? (
                                                <img
                                                    src={coverPhoto}
                                                    alt={house.title}
                                                    className="h-12 w-14 shrink-0 rounded-xl object-cover border border-neutral-200 dark:border-neutral-100"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-200 dark:bg-neutral-100 text-[11px] font-bold text-neutral-800">
                                                    بدون عکس
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="truncate font-bold text-default-text">
                                                    {house.title}
                                                </p>
                                                <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-neutral-800 dark:text-neutral-600">
                                                    <HugeiconsIcon
                                                        icon={Location01Icon}
                                                        size={13}
                                                        color="currentColor"
                                                        className="shrink-0"
                                                    />
                                                    <span>{house.address}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3.5">
                                        <div className="flex flex-col items-start gap-1.5">
                                            <TransactionBadge type={house.transaction_type} />
                                            <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-600">
                                                دسته: {formatCategoryFa(house.categories?.name)}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3.5">
                                        <p className="font-bold text-default-text">
                                            {house.sellerName || "فروشنده"}
                                        </p>
                                        <p className="text-[11px] text-neutral-800 dark:text-neutral-600">
                                            شناسه:{" "}
                                            {new Intl.NumberFormat("fa-IR", {
                                                useGrouping: false,
                                            }).format(Number(house.sellerId) || 0)}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-600">
                                        <div>
                                            ظرفیت:{" "}
                                            <strong className="text-default-text">
                                                {new Intl.NumberFormat("fa-IR").format(house.capacity)}
                                            </strong>{" "}
                                            نفر
                                        </div>
                                        <div className="mt-0.5 text-[11px]">
                                            {new Intl.NumberFormat("fa-IR").format(house.rooms)} اتاق ·{" "}
                                            {new Intl.NumberFormat("fa-IR").format(house.bathrooms)} حمام
                                        </div>
                                    </td>

                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <span className="font-extrabold text-default-text">
                                            {new Intl.NumberFormat("fa-IR").format(numericPrice)}
                                        </span>{" "}
                                        <span className="text-[11px] text-neutral-800 dark:text-neutral-600">
                                            تومان
                                        </span>
                                    </td>

                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 rounded-lg bg-warning-50 dark:bg-warning-900/30 px-2 py-1 text-xs font-bold text-warning-700 dark:text-warning-400">
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
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => onView(house)}
                                                title="مشاهده جزئیات"
                                                className="rounded-xl border border-neutral-300 dark:border-neutral-200 p-2 text-default-text hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
                                            >
                                                <HugeiconsIcon
                                                    icon={ViewIcon}
                                                    size={16}
                                                    color="currentColor"
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onEdit(house)}
                                                title="ویرایش "
                                                className="rounded-xl border border-primary-300 dark:border-primary-700 bg-primary-50/70 dark:bg-primary-100/20 p-2 text-primary-600 dark:text-primary-800 hover:bg-primary-100 transition-colors cursor-pointer"
                                            >
                                                <HugeiconsIcon
                                                    icon={PencilEdit02Icon}
                                                    size={16}
                                                    color="currentColor"
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete(house)}
                                                title="حذف"
                                                className="rounded-xl border border-danger-300 dark:border-danger-700 bg-danger-50/70 dark:bg-danger-900/20 p-2 text-danger-600 dark:text-danger-400 hover:bg-danger-100 transition-colors cursor-pointer"
                                            >
                                                <HugeiconsIcon
                                                    icon={Delete02Icon}
                                                    size={16}
                                                    color="currentColor"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}