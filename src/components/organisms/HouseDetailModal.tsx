"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { House } from "@/core/types/house";
import { TransactionBadge } from "@/components/molecules/TransactionBadge";
import { formatCategoryFa, formatYardTypeFa } from "@/lib/formatters/house";

export function HouseDetailModal({
    house,
    onClose,
}: {
    house: House | null;
    onClose: () => void;
}) {
    if (!house) return null;

    return (
        <div
            dir="rtl"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
                    <div>
                        <h2 className="text-base sm:text-lg font-extrabold">{house.title}</h2>
                        <p className="text-xs text-neutral-800 dark:text-neutral-600">
                            {house.address}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
                    >
                        <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
                    </button>
                </div>

                {house.photos?.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {house.photos.map((photo, idx) => (
                            <img
                                key={`${photo}-${idx}`}
                                src={photo}
                                alt={`${house.title} ${idx + 1}`}
                                className="h-28 w-full rounded-xl object-cover border border-neutral-200 dark:border-neutral-100"
                            />
                        ))}
                    </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <TransactionBadge type={house.transaction_type} />
                    <span className="rounded-lg bg-neutral-100 dark:bg-neutral-50 px-2.5 py-1 text-xs font-semibold">
                        دسته: {formatCategoryFa(house.categories?.name)}
                    </span>
                    <span className="rounded-lg bg-neutral-100 dark:bg-neutral-50 px-2.5 py-1 text-xs font-semibold">
                        حیاط: {formatYardTypeFa(house.yard_type)}
                    </span>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-50/40 p-3.5 text-xs">
                    <div>
                        <span className="text-neutral-800 dark:text-neutral-600">قیمت:</span>
                        <p className="mt-0.5 font-extrabold">
                            {new Intl.NumberFormat("fa-IR").format(Number(house.price) || 0)} تومان
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral-800 dark:text-neutral-600">ظرفیت:</span>
                        <p className="mt-0.5 font-extrabold">
                            {new Intl.NumberFormat("fa-IR").format(house.capacity)} نفر
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral-800 dark:text-neutral-600">اتاق / پارکینگ:</span>
                        <p className="mt-0.5 font-extrabold">
                            {new Intl.NumberFormat("fa-IR").format(house.rooms)} /{" "}
                            {new Intl.NumberFormat("fa-IR").format(house.parking)}
                        </p>
                    </div>
                    <div>
                        <span className="text-neutral-800 dark:text-neutral-600">امتیاز:</span>
                        <p className="mt-0.5 font-extrabold">{house.rate}</p>
                    </div>
                </div>

                {house.caption && (
                    <p className="mt-4 rounded-xl border border-neutral-200 dark:border-neutral-100 p-3 text-xs leading-6 text-neutral-800 dark:text-neutral-600">
                        {house.caption}
                    </p>
                )}

                {house.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {house.tags.map((tag, i) => (
                            <span
                                key={`${tag}-${i}`}
                                className="rounded-lg border border-neutral-300 dark:border-neutral-200 px-2.5 py-1 text-[11px] font-semibold"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
}