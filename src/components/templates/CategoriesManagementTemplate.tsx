"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Folder01Icon,
  RefreshIcon,
  Search01Icon,
  ArrowUpDownIcon,
  Add01Icon,
} from "@hugeicons/core-free-icons";
import {
  useCategories,
  useDeleteCategory,
} from "@/hooks/use-categories";
import { Category, CategoryFilters } from "@/core/types/category";
import { CategoriesTable } from "@/components/organisms/category/CategoriesTable";
import { CategoryFormModal } from "@/components/organisms/category/CategoryFormModal";
import { CategoryDeleteConfirmModal } from "@/components/molecules/category/CategoryDeleteConfirmModal";
import { Pagination } from "@/components/molecules";
import { formatCategoryFa, toPersianDigits } from "@/lib/formatters/house";

const ITEMS_PER_PAGE = 10;

const DEFAULT_FILTERS: CategoryFilters = {
  page: 1,
  limit: ITEMS_PER_PAGE,
  sort: "id",
  order: "ASC",
  name: "",
};

export function CategoriesManagementTemplate() {
  const [filters, setFilters] = useState<CategoryFilters>(DEFAULT_FILTERS);
  const [searchText, setSearchText] = useState("");
  const [modalState, setModalState] = useState<{
    open: boolean;
    category: Category | null;
  }>({ open: false, category: null });
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useCategories(filters);
  const deleteMutation = useDeleteCategory();

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error
          ? error.message
          : "خطا در دریافت لیست دسته‌بندی‌ها"
      );
    }
  }, [isError, error]);

  const categories = data?.data ?? [];
  const totalCount = data?.totalCount ?? categories.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / filters.limit));

  const filteredCategories = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return categories;

    return categories.filter((c) => {
      const fa = formatCategoryFa(c.name).toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        fa.includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }, [categories, searchText]);

  const handleFilterChange = (partial: Partial<CategoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleSearchName = (val: string) => {
    setSearchText(val);
    handleFilterChange({ name: val, page: 1 });
  };

  const handlePageChange = (nextPage: number) => {
    handleFilterChange({ page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      dir="rtl"
      className="w-full space-y-6 p-4 sm:p-6 text-default-text"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
            مدیریت دسته‌بندی‌ها
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
            مشاهده، جستجو، مرتب‌سازی، افزودن، ویرایش و حذف دسته‌بندی‌های اقامتگاه‌ها
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content px-4 py-2 text-xs font-bold text-default-text hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              size={15}
              color="currentColor"
              strokeWidth={2}
              className={isFetching ? "animate-spin text-primary-500" : ""}
            />
            <span>بروزرسانی</span>
          </button>

          <button
            type="button"
            onClick={() => setModalState({ open: true, category: null })}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Add01Icon} size={16} color="currentColor" />
            <span>افزودن دسته‌بندی</span>
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              کل دسته‌بندی‌های ثبت‌شده
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(totalCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
            <HugeiconsIcon
              icon={Folder01Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              نمایش در صفحه جاری
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(filteredCategories.length)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-500">
            <HugeiconsIcon
              icon={Folder01Icon}
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
        className="flex flex-col gap-3 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative w-full sm:max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            color="currentColor"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
          />
          <input
            type="text"
            value={searchText}
            onChange={(e) => handleSearchName(e.target.value)}
            placeholder="جستجو بر اساس نام دسته‌بندی..."
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
          />
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
            value={filters.sort}
            onChange={(e) =>
              handleFilterChange({ sort: e.target.value, page: 1 })
            }
            className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
          >
            <option value="id">شناسه</option>
            <option value="name">نام دسته‌بندی</option>
          </select>

          <select
            value={filters.order}
            onChange={(e) =>
              handleFilterChange({
                order: e.target.value as "ASC" | "DESC",
                page: 1,
              })
            }
            className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
          >
            <option value="ASC">صعودی</option>
            <option value="DESC">نزولی</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearchText("");
              setFilters(DEFAULT_FILTERS);
            }}
            className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            پاک کردن فیلترها
          </button>
        </div>
      </motion.div>

      {isLoading && !data ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((skeleton) => (
            <div
              key={skeleton}
              className="h-14 w-full animate-pulse rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <CategoriesTable
            categories={filteredCategories}
            isLoading={isLoading}
            onEdit={(cat) => setModalState({ open: true, category: cat })}
            onDelete={(cat) => setDeleteTarget(cat)}
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
                ({new Intl.NumberFormat("fa-IR").format(totalCount)} دسته‌بندی)
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
        </div>
      )}

      {modalState.open && (
        <CategoryFormModal
          key={modalState.category?.id ?? "create-category"}
          category={modalState.category}
          onClose={() => setModalState({ open: false, category: null })}
        />
      )}

      <CategoryDeleteConfirmModal
        category={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async (id) => {
          await deleteMutation.mutateAsync(id);
        }}
      />
    </section>
  );
}