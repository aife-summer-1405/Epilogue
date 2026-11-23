"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  RefreshIcon,
  Money03Icon,
  Search01Icon,
  UserIcon,
  ArrowUpDownIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import {
  useAdminHouses,
  useDeleteAdminHouse,
} from "@/hooks/use-houses";
import { House, HouseFilters } from "@/core/types/house";
import { HousesTable } from "@/components/organisms/HousesTable";
import { HouseDetailModal } from "@/components/organisms/HouseDetailModal";
import { HouseEditModal } from "@/components/organisms/HouseEditModal";
import { HouseDeleteConfirmModal } from "@/components/molecules/HouseDeleteConfirmModal";
import { Pagination } from "@/components/molecules";

const ITEMS_PER_PAGE = 10;

const DEFAULT_FILTERS: HouseFilters = {
  page: 1,
  limit: ITEMS_PER_PAGE,
  sort: "created_at",
  order: "DESC",
  sellerId: "",
  price: "",
};

interface HousesManagementTemplateProps {
  initialFilters?: Partial<HouseFilters>;
}

export function HousesManagementTemplate({
  initialFilters,
}: HousesManagementTemplateProps) {
  const [filters, setFilters] = useState<HouseFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [searchText, setSearchText] = useState("");
  const [viewHouse, setViewHouse] = useState<House | null>(null);
  const [editHouse, setEditHouse] = useState<House | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<House | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminHouses(filters);
  const deleteMutation = useDeleteAdminHouse();

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : "خطا در دریافت لیست اقامتگاه‌ها"
      );
    }
  }, [isError, error]);

  const houses = data?.data ?? [];
  const totalCount = data?.totalCount ?? houses.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / filters.limit));

  const filteredHouses = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return houses;

    return houses.filter((item) => {
      const tagsStr = (item.tags ?? []).join(" ");
      const target =
        `${item.id} ${item.title} ${item.address} ${item.sellerName ?? ""} ${item.sellerId} ${item.categories?.name ?? ""} ${tagsStr}`.toLowerCase();
      return target.includes(q);
    });
  }, [houses, searchText]);

  const avgRate = useMemo(() => {
    if (houses.length === 0) return 0;
    const sum = houses.reduce((acc, h) => acc + (Number(h.rate) || 0), 0);
    return sum / houses.length;
  }, [houses]);

  const pageTotalPrice = useMemo(
    () =>
      houses.reduce((sum, item) => {
        const val = Number(item.price);
        return sum + (Number.isFinite(val) ? val : 0);
      }, 0),
    [houses]
  );

  const handleFilterChange = (partial: Partial<HouseFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleReset = () => {
    setSearchText("");
    setFilters({
      ...DEFAULT_FILTERS,
      ...initialFilters,
    });
  };

  const handlePageChange = (nextPage: number) => {
    handleFilterChange({ page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const formattedDateHint = useMemo(
    () => formatJalali(new Date(), "d MMMM yyyy", { locale: faIR }),
    []
  );

  return (
    <section
      dir="rtl"
      className="w-full space-y-6 p-4 sm:p-6 text-default-text"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
            مدیریت اقامتگاه‌ها
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
            مشاهده لیست اقامتگاه‌ها، فیلتر فروشنده و قیمت، مرتب‌سازی، ویرایش و حذف
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 self-start sm:self-auto rounded-xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content px-4 py-2 text-xs font-bold text-default-text hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <HugeiconsIcon
            icon={RefreshIcon}
            size={15}
            color="currentColor"
            strokeWidth={2}
            className={isFetching ? "animate-spin text-primary-500" : ""}
          />
          <span>بروزرسانی لیست</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              کل اقامتگاه‌های ثبت‌شده
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(totalCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
            <HugeiconsIcon
              icon={Home01Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              میانگین امتیاز (در صفحه جاری)
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR", {
                maximumFractionDigits: 2,
              }).format(avgRate)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400">
            <HugeiconsIcon
              icon={StarIcon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              مجموع نرخ صفحه جاری
            </p>
            <p className="mt-1 text-lg sm:text-xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(pageTotalPrice)}{" "}
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-600">
                تومان
              </span>
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-500">
            <HugeiconsIcon
              icon={Money03Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="space-y-4 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-primary-500 px-3.5 py-2 text-xs font-bold text-white">
              همه اقامتگاه‌ها
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-600">
              <HugeiconsIcon
                icon={ArrowUpDownIcon}
                size={15}
                color="currentColor"
              />
              <span>مرتب‌سازی:</span>
            </div>

            <select
              value={filters.sort || "created_at"}
              onChange={(e) =>
                handleFilterChange({ sort: e.target.value, page: 1 })
              }
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="created_at">تاریخ ایجاد</option>
              <option value="price">قیمت</option>
              <option value="rate">امتیاز</option>
              <option value="id">شناسه</option>
            </select>

            <select
              value={filters.order || "DESC"}
              onChange={(e) =>
                handleFilterChange({
                  order: e.target.value as "ASC" | "DESC",
                  page: 1,
                })
              }
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="DESC">نزولی</option>
              <option value="ASC">صعودی</option>
            </select>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="جستجو بر اساس عنوان، آدرس، فروشنده یا تگ..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="relative">
            <HugeiconsIcon
              icon={UserIcon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              inputMode="numeric"
              value={
                filters.sellerId
                  ? new Intl.NumberFormat("fa-IR", {
                      useGrouping: false,
                    }).format(Number(filters.sellerId))
                  : ""
              }
              onChange={(e) => {
                const englishValue = e.target.value
                  .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
                  .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
                  .replace(/[^\d]/g, "");
                handleFilterChange({ sellerId: englishValue, page: 1 });
              }}
              placeholder="شناسه فروشنده "
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="relative">
            <HugeiconsIcon
              icon={Money03Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              inputMode="numeric"
              value={
                filters.price
                  ? new Intl.NumberFormat("fa-IR").format(Number(filters.price))
                  : ""
              }
              onChange={(e) => {
                const englishValue = e.target.value
                  .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
                  .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
                  .replace(/[^\d]/g, "");
                handleFilterChange({ price: englishValue, page: 1 });
              }}
              placeholder="قیمت "
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {isLoading && !data ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((skeleton) => (
            <div
              key={skeleton}
              className="h-16 w-full animate-pulse rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-danger-300 dark:border-danger-700 bg-danger-50 dark:bg-danger-900/30 p-6 text-center text-danger-700 dark:text-danger-400">
          <p className="text-sm font-bold">خطا در دریافت لیست اقامتگاه‌ها</p>
          <p className="mt-1 text-xs">{error?.message}</p>
        </div>
      ) : (
        <motion.div
          key={`${filters.page}-${filters.order}-${filters.sort}-${filters.sellerId}-${filters.price}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <HousesTable
            houses={filteredHouses}
            isLoading={isLoading}
            onView={setViewHouse}
            onEdit={setEditHouse}
            onDelete={setDeleteTarget}
          />

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
              <p className="text-xs text-neutral-800 dark:text-neutral-600">
                صفحه{" "}
                <strong className="text-default-text">
                  {new Intl.NumberFormat("fa-IR").format(filters.page)}
                </strong>{" "}
                از{" "}
                <strong className="text-default-text">
                  {new Intl.NumberFormat("fa-IR").format(totalPages)}
                </strong>{" "}
                ({new Intl.NumberFormat("fa-IR").format(totalCount)} اقامتگاه ·{" "}
                {formattedDateHint})
              </p>

              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemClassName="cursor-pointer"
                buttonsClassName="cursor-pointer"
              />
            </div>
          )}
        </motion.div>
      )}

      <HouseDetailModal
        house={viewHouse}
        onClose={() => setViewHouse(null)}
      />

      {editHouse && (
        <HouseEditModal
          key={editHouse.id}
          house={editHouse}
          onClose={() => setEditHouse(null)}
        />
      )}

      <HouseDeleteConfirmModal
        house={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}