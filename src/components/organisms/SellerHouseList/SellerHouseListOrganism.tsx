"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  FilterIcon,
  Search01Icon,
  MoreVerticalIcon,
  PencilEdit02Icon,
  Delete02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import formatPrice from "@/lib/formatters/price";
import {
  SellerHouse,
  SellerHouseResponse,
  Category,
} from "@/core/types/sellerHouse";
import { deleteSellerHouseAction } from "@/app/actions/sellerHouse.action";
import { SellerHouseFilterModal } from "./SellerHouseFilterModal";
import { SellerHouseDeleteModal } from "./SellerHouseDeleteModal";

interface Props {
  initialData: SellerHouseResponse;
  categories: Category[];
}

export const SellerHouseListOrganism = ({ initialData, categories }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentLimit = Number(searchParams.get("limit")) || 10;
  const currentSearch = searchParams.get("search") || "";
  const currentMinPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const currentMaxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const currentCategory = searchParams.get("category") || undefined;

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateQueryParams = (
    newParams: Record<string, string | number | undefined>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const totalPages = Math.ceil(initialData.totalCount / currentLimit);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    const result = await deleteSellerHouseAction(deleteTargetId);
    setIsDeleting(false);
    if (result.success) {
      setDeleteTargetId(null);
      setActiveMenuId(null);
      router.refresh();
    }
  };

  return (
    <div
      dir="rtl"
      className={`w-full space-y-6 ${isPending ? "opacity-60 transition-opacity" : ""}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 md:text-2xl">
            مدیریت املاک
          </h1>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
              <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.5} />
            </span>
            <input
              type="text"
              placeholder="جستجو ..."
              defaultValue={currentSearch}
              onChange={(e) =>
                updateQueryParams({ search: e.target.value, page: 1 })
              }
              className="w-full rounded-2xl border border-zinc-200 bg-white py-2.5 pr-10 pl-4 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 sm:rounded-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 sm:flex-initial sm:rounded-full"
            >
              <HugeiconsIcon icon={FilterIcon} size={18} strokeWidth={1.5} />
              <span>فیلتر ها</span>
            </button>

            <Button
              variant="primary"
              startIcon={
                <HugeiconsIcon icon={Add01Icon} size={20} strokeWidth={2} />
              }
              onClick={() =>
                router.push(
                  "/panel/houseManagement/add-house",
                )
              }
              className="flex-1 rounded-2xl bg-[#0f3d61] hover:bg-[#0b2f4c] dark:bg-[#1a507a] sm:flex-initial sm:rounded-full"
            >
              افزودن ملک
            </Button>
          </div>
        </div>
      </div>

      <div className="relative overflow-visible rounded-3xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="hidden overflow-x-auto overflow-y-visible md:block">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="px-6 py-4 text-right">نام اقامتگاه</th>
                <th className="px-6 py-4 text-center">تاریخ به روزرسانی</th>
                <th className="px-6 py-4 text-center">قیمت</th>
                <th className="px-6 py-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {!initialData.houses.length ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-400">
                    هیچ ملکی یافت نشد.
                  </td>
                </tr>
              ) : (
                initialData.houses.map((house: SellerHouse, index: number) => {
                  const openUpward =
                    initialData.houses.length <= 2 ||
                    index >= initialData.houses.length - 2;

                  return (
                    <tr
                      key={house.id}
                      className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                    >
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            {house.photos && house.photos.length > 0 ? (
                              <Image
                                src={house.photos[0]}
                                alt={house.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                                بدون عکس
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {house.title}
                          </span>
                        </div>
                      </td>

                      <td className="dir-ltr whitespace-nowrap px-6 py-4 text-center text-zinc-600 dark:text-zinc-400">
                        {new Date(house.last_updated).toLocaleDateString(
                          "fa-IR",
                        )}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-center font-medium text-zinc-900 dark:text-zinc-100">
                        {formatPrice(Number(house.price), false)}{" "}
                        <span className="text-xs font-normal text-zinc-400">
                          تومان
                        </span>
                      </td>

                      <td className="relative px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(
                                activeMenuId === house.id ? null : house.id,
                              );
                            }}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            <HugeiconsIcon
                              icon={MoreVerticalIcon}
                              size={20}
                              strokeWidth={2}
                            />
                          </button>
                        </div>

                        {activeMenuId === house.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                              }}
                            />
                            <div
                              className={`absolute left-[190px] z-50 w-36 -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 ${
                                openUpward ? "bottom-[0px]" : "top-[0px]"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                  router.push(
                                    `/panel/houseManagement/${house.id}`,
                                  );
                                }}
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-right text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                              >
                                <HugeiconsIcon
                                  icon={PencilEdit02Icon}
                                  size={16}
                                  strokeWidth={1.5}
                                />
                                <span>ویرایش</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                  setDeleteTargetId(house.id);
                                }}
                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-right text-xs font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                              >
                                <HugeiconsIcon
                                  icon={Delete02Icon}
                                  size={16}
                                  strokeWidth={1.5}
                                />
                                <span>حذف</span>
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="block divide-y divide-zinc-100 dark:divide-zinc-800 md:hidden">
          {!initialData.houses.length ? (
            <div className="py-12 text-center text-sm text-zinc-400">
              هیچ ملکی یافت نشد.
            </div>
          ) : (
            initialData.houses.map((house: SellerHouse, index: number) => {
              const openUpward =
                initialData.houses.length <= 2 ||
                index >= initialData.houses.length - 2;

              return (
                <div
                  key={house.id}
                  className="relative flex flex-col gap-3 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                        {house.photos && house.photos.length > 0 ? (
                          <Image
                            src={house.photos[0]}
                            alt={house.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
                            بدون عکس
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {house.title}
                        </h3>
                        <span className="dir-ltr mt-0.5 inline-block text-xs text-zinc-400">
                          {new Date(house.last_updated).toLocaleDateString(
                            "fa-IR",
                          )}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(
                          activeMenuId === house.id ? null : house.id,
                        );
                      }}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <HugeiconsIcon
                        icon={MoreVerticalIcon}
                        size={20}
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-50 pt-2 text-xs dark:border-zinc-800/60">
                    <span className="text-zinc-500">قیمت:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {formatPrice(Number(house.price), false)}{" "}
                      <span className="font-normal text-zinc-400">تومان</span>
                    </span>
                  </div>

                  {activeMenuId === house.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                        }}
                      />
                      <div
                        className={`absolute left-4 z-50 w-36 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 ${
                          openUpward ? "bottom-14" : "top-12"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            router.push(
                              `/panel/houseManagement/edit-house/${house.id}`,
                            );
                          }}
                          className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-right text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                          <HugeiconsIcon
                            icon={PencilEdit02Icon}
                            size={16}
                            strokeWidth={1.5}
                          />
                          <span>ویرایش</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            setDeleteTargetId(house.id);
                          }}
                          className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-right text-xs font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={16}
                            strokeWidth={1.5}
                          />
                          <span>حذف</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-col-reverse gap-4 border-t border-zinc-100 p-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="text-xs text-zinc-500">تعداد نمایش</span>
            <select
              value={currentLimit}
              onChange={(e) =>
                updateQueryParams({ limit: Number(e.target.value), page: 1 })
              }
              className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 text-xs sm:gap-2">
            <button
              type="button"
              onClick={() =>
                updateQueryParams({ page: Math.max(1, currentPage - 1) })
              }
              disabled={currentPage === 1}
              className="flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-zinc-500 transition hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800 whitespace-nowrap"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                strokeWidth={1.5}
              />
              <span>قبلی</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => updateQueryParams({ page: p })}
                className={`h-7 w-7 shrink-0 cursor-pointer rounded-full font-medium transition ${
                  currentPage === p
                    ? "bg-[#0f3d61] text-white dark:bg-[#1a507a]"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                updateQueryParams({
                  page: Math.min(totalPages, currentPage + 1),
                })
              }
              disabled={currentPage >= totalPages}
              className="flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-zinc-500 transition hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-800 whitespace-nowrap"
            >
              <span>بعدی</span>
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={14}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </div>

      <SellerHouseFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        minPrice={currentMinPrice || 0}
        maxPrice={currentMaxPrice || 10000000000}
        categories={categories}
        selectedCategory={currentCategory}
        onApply={(filters) => {
          updateQueryParams({
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            category: filters.category,
            page: 1,
          });
        }}
      />

      <SellerHouseDeleteModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};