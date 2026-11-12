"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  Location01Icon,
  Bathtub01Icon,
  BedIcon,
  CarParking02Icon,
  User02Icon,
  Cancel01Icon,
  Add01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import { useGetComparison } from "@/hooks/queries/useGetComparison";
import {
  IComparisonHouse,
  parseComparisonIds,
} from "@/services/comparison/comparison.service";
import {
  useComparisonStore,
  MAX_COMPARE_ITEMS,
} from "@/store/comparison.store";

const TRANSACTION_LABELS: Record<string, string> = {
  direct_purchase: "خرید مستقیم",
  mortgage: "رهن",
  rental: "اجاره",
  reservation: "رزرو شبانه",
};

const CATEGORY_LABELS: Record<string, string> = {
  apartment: "آپارتمان",
  villa: "ویلا",
  house: "خانه ویلایی",
  suite: "سوئیت",
  land: "زمین",
};

const YARD_LABELS: Record<string, string> = {
  none: "ندارد",
  private: "اختصاصی",
  shared: "مشترک",
};

const ComparisonContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedIdsInStore = useComparisonStore((state) => state.selectedIds);
  const { setIds, clearAll } = useComparisonStore((state) => state.actions);

  const activeIds = useMemo(() => {
    const fromUrl = parseComparisonIds(searchParams.get("ids") || undefined);
    if (fromUrl.length > 0) return fromUrl;
    return selectedIdsInStore.slice(0, MAX_COMPARE_ITEMS);
  }, [searchParams, selectedIdsInStore]);

  useEffect(() => {
    const fromUrl = parseComparisonIds(searchParams.get("ids") || undefined);
    if (fromUrl.length > 0) {
      setIds(fromUrl);
    }
  }, [searchParams, setIds]);

  const { data: houses = [], isLoading, isError } = useGetComparison(activeIds);

  const handleRemoveItem = (idToRemove: string) => {
    const nextIds = activeIds.filter((id) => id !== String(idToRemove));
    setIds(nextIds);
    if (nextIds.length > 0) {
      router.push(`/comparison?ids=${nextIds.join(",")}`, { scroll: false });
    } else {
      router.push("/comparison", { scroll: false });
    }
  };

  const handleClearAll = () => {
    clearAll();
    router.push("/comparison", { scroll: false });
  };

  const formatPrice = (val?: string | number | null) => {
    if (val === undefined || val === null || val === "") return "توافقی";
    const num = Number(val);
    return isNaN(num) ? String(val) : `${num.toLocaleString("fa-IR")} تومان`;
  };

  if (activeIds.length === 0) {
    return (
      <div
        dir="rtl"
        className="my-12 flex w-full flex-col items-center justify-center gap-6 rounded-[32px] border border-gray-200 bg-white p-10 text-center shadow-xs dark:border-zinc-800 dark:bg-[#272727]"
      >
        <p className="text-lg font-extrabold text-gray-900 dark:text-white">
          هنوز ملکی برای مقایسه انتخاب نکرده‌اید!
        </p>
        <p className="max-w-md text-sm text-gray-500 dark:text-gray-300">
          می‌توانید تا سقف {MAX_COMPARE_ITEMS} ملک را از لیست املاک انتخاب کرده
          و تمامی مشخصات، قیمت و امکانات آن‌ها را در کنار هم مقایسه کنید.
        </p>
        <Link href="/mortgage-rent">
          <Button
            type="button"
            variant="primary"
            size="md"
            hasIcon={false}
            className="h-12 rounded-full bg-[#1e3a8a] px-8 text-sm font-bold text-white hover:bg-blue-900"
          >
            مشاهده و انتخاب املاک
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: activeIds.length || 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-135 w-full animate-pulse rounded-[28px] bg-gray-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="my-16 text-center text-base font-bold text-red-500">
        خطا در دریافت اطلاعات مقایسه از سرور.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-xs dark:bg-[#272727]">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl dark:text-white">
            مقایسه املاک انتخاب‌شده ({houses.length} از {MAX_COMPARE_ITEMS})
          </h1>
          <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            بررسی دقیق مشخصات، امکانات و قیمت املاک در کنار یکدیگر
          </p>
        </div>

        <div className="flex items-center gap-3">
          {houses.length < MAX_COMPARE_ITEMS && (
            <Link href="/mortgage-rent">
              <Button
                type="button"
                variant="outline"
                size="sm"
                startIcon={<HugeiconsIcon icon={Add01Icon} size={18} />}
                className="h-11 rounded-full text-xs font-bold"
              >
                افزودن ملک جدید
              </Button>
            </Link>
          )}

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleClearAll}
            startIcon={<HugeiconsIcon icon={Delete02Icon} size={18} />}
            className="h-11 rounded-full px-4 text-xs font-bold"
          >
            حذف همه
          </Button>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {houses.map((house: IComparisonHouse) => {
          const detailHref =
            house.transaction_type === "reservation"
              ? `/fastReserve/${house.id}`
              : `/mortgage-rent/${house.id}`;

          return (
            <article
              key={house.id}
              className="flex flex-col justify-between overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-xs transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-[#272727] dark:text-white"
            >
              <div>
                <div className="relative aspect-340/220 w-full overflow-hidden bg-gray-200 dark:bg-zinc-800">
                  <ImageFallback
                    src={house.photos?.[0] || null}
                    alt={house.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/75 via-black/30 to-transparent" />

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center gap-1 rounded-full bg-primary-500 px-2.5 py-1 text-xs text-white shadow-xs">
                      <span className="relative top-0.5 text-sm font-bold">
                        {Number(house.rate || 0).toFixed(1)}
                      </span>
                      <HugeiconsIcon
                        icon={StarIcon}
                        size={18}
                        color="currentColor"
                        strokeWidth={1.5}
                      />
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(house.id)}
                    aria-label="حذف از مقایسه"
                    title="حذف از مقایسه"
                    className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-xs transition-colors hover:bg-red-600 hover:text-white dark:bg-zinc-900/90 dark:text-white dark:hover:bg-red-600"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} />
                  </button>

                  <div className="absolute inset-x-3 bottom-3 flex items-center gap-1 text-right text-xs text-white">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={18}
                      color="currentColor"
                      className="shrink-0"
                    />
                    <span className="line-clamp-1">{house.address}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-5">
                  <h2 className="line-clamp-1 text-lg font-extrabold text-gray-900 dark:text-white">
                    {house.title}
                  </h2>

                  <div className="flex items-center justify-between rounded-2xl bg-gray-100 px-3.5 py-3 dark:bg-[#353535]">
                    <span className="text-xs text-gray-500 dark:text-gray-300">
                      قیمت / مبلغ:
                    </span>
                    <span className="text-sm font-extrabold text-[#1e3a8a] dark:text-blue-400">
                      {formatPrice(house.discounted_price ?? house.price)}
                    </span>
                  </div>

                  <div className="flex flex-col divide-y divide-gray-100 text-sm dark:divide-zinc-800">
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-gray-500 dark:text-gray-400">
                        نوع معامله
                      </span>
                      <span className="font-semibold">
                        {TRANSACTION_LABELS[house.transaction_type] ||
                          house.transaction_type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-gray-500 dark:text-gray-400">
                        دسته‌بندی ملک
                      </span>
                      <span className="font-semibold">
                        {CATEGORY_LABELS[house.categories?.name || ""] ||
                          house.categories?.name ||
                          "نامشخص"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <HugeiconsIcon icon={BedIcon} size={18} />
                        تعداد اتاق خواب
                      </span>
                      <span className="font-bold">{house.rooms} خواب</span>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <HugeiconsIcon icon={Bathtub01Icon} size={18} />
                        سرویس حمام
                      </span>
                      <span className="font-bold">{house.bathrooms} حمام</span>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <HugeiconsIcon icon={User02Icon} size={18} />
                        ظرفیت نفرات
                      </span>
                      <span className="font-bold">{house.capacity} نفر</span>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <HugeiconsIcon icon={CarParking02Icon} size={18} />
                        پارکینگ
                      </span>
                      <span className="font-bold">
                        {house.parking > 0
                          ? `${house.parking} جایگاه`
                          : "ندارد"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-gray-500 dark:text-gray-400">
                        حیاط
                      </span>
                      <span className="font-semibold">
                        {YARD_LABELS[house.yard_type] || house.yard_type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-gray-500 dark:text-gray-400">
                        میزبان / فروشنده
                      </span>
                      <span className="line-clamp-1 font-semibold">
                        {house.sellerName || "نامشخص"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      ویژگی‌ها و امکانات:
                    </span>
                    <div className="flex min-h-14 flex-wrap items-start gap-1.5">
                      {Array.isArray(house.tags) && house.tags.length > 0 ? (
                        house.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-[#353535] dark:text-gray-200"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">ثبت نشده</span>
                      )}
                    </div>
                  </div>

                  <p className="line-clamp-2 min-h-10 text-justify text-xs leading-5 text-gray-500 dark:text-gray-300">
                    {house.caption || "بدون توضیحات تکمیلی."}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link href={detailHref} className="block w-full">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    hasIcon={false}
                    className="h-11 w-full rounded-full bg-[#1e3a8a] text-xs font-bold text-white hover:bg-blue-900"
                  >
                    مشاهده و بررسی ملک
                  </Button>
                </Link>
              </div>
            </article>
          );
        })}

        {houses.length < MAX_COMPARE_ITEMS && (
          <Link
            href="/mortgage-rent"
            className="flex min-h-96 flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-gray-300 bg-white/50 p-6 text-center transition-colors hover:border-[#1e3a8a] hover:bg-blue-50/30 dark:border-zinc-700 dark:bg-[#272727]/40 dark:hover:border-blue-400"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-[#1e3a8a] dark:bg-zinc-800 dark:text-blue-400">
              <HugeiconsIcon icon={Add01Icon} size={28} />
            </div>
            <span className="text-base font-bold text-gray-800 dark:text-white">
              افزودن ملک به مقایسه
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              می‌توانید {MAX_COMPARE_ITEMS - houses.length} ملک دیگر اضافه کنید
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ComparisonContent;
