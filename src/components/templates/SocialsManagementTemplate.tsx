"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Share08Icon,
  RefreshIcon,
  Search01Icon,
  Link02Icon,
  ArrowUpDownIcon,
  Add01Icon,
} from "@hugeicons/core-free-icons";
import {
  useDeleteSocialMediaLink,
  useSocialMediaLinks,
} from "@/hooks/use-socials";
import { SocialMediaFilters, SocialMediaLink } from "@/core/types/social";
import { SocialsTable } from "@/components/organisms/social/SocialsTable";
import { SocialFormModal } from "@/components/organisms/social/SocialFormModal";
import { SocialDeleteConfirmModal } from "@/components/molecules/social/SocialDeleteConfirmModal";
import { Pagination } from "@/components/molecules";

const ITEMS_PER_PAGE = 10;

const DEFAULT_FILTERS: SocialMediaFilters = {
  page: 1,
  limit: ITEMS_PER_PAGE,
  sort: "id",
  order: "ASC",
  platform: "",
  url: "",
};

export function SocialsManagementTemplate() {
  const [filters, setFilters] = useState<SocialMediaFilters>(DEFAULT_FILTERS);
  const [modalState, setModalState] = useState<{
    open: boolean;
    item: SocialMediaLink | null;
  }>({ open: false, item: null });
  const [deleteTarget, setDeleteTarget] = useState<SocialMediaLink | null>(
    null
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useSocialMediaLinks(filters);
  const deleteMutation = useDeleteSocialMediaLink();

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error
          ? error.message
          : "خطا در دریافت لیست شبکه‌های اجتماعی"
      );
    }
  }, [isError, error]);

  const items = data?.data ?? [];
  const totalCount = data?.totalCount ?? items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / filters.limit));

  const uniquePlatformsCount = useMemo(() => {
    return new Set(items.map((i) => i.platform.toLowerCase())).size;
  }, [items]);

  const handleFilterChange = (partial: Partial<SocialMediaFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
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
            مدیریت شبکه‌های اجتماعی
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
            مدیریت لینک‌ها و پلتفرم‌های شبکه‌های اجتماعی (افزودن، ویرایش، حذف و فیلتر)
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
            onClick={() => setModalState({ open: true, item: null })}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Add01Icon} size={16} color="currentColor" />
            <span>افزودن شبکه اجتماعی</span>
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
              کل لینک‌های ثبت‌شده
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(totalCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
            <HugeiconsIcon
              icon={Share08Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              تنوع پلتفرم‌ها (در صفحه جاری)
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(uniquePlatformsCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-500">
            <HugeiconsIcon
              icon={Share08Icon}
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
            {[
              { key: "", label: "همه پلتفرم‌ها" },
              { key: "instagram", label: "اینستاگرام" },
              { key: "telegram", label: "تلگرام" },
              { key: "whatsapp", label: "واتساپ" },
              { key: "youtube", label: "یوتیوب" },
            ].map((tab) => {
              const active = filters.platform === tab.key;
              return (
                <button
                  key={tab.key || "all"}
                  type="button"
                  onClick={() =>
                    handleFilterChange({ platform: tab.key, page: 1 })
                  }
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 dark:bg-neutral-50 text-neutral-800 dark:text-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
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
              <option value="platform">پلتفرم</option>
              <option value="url">آدرس لینک</option>
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
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              value={filters.platform}
              onChange={(e) =>
                handleFilterChange({ platform: e.target.value, page: 1 })
              }
              placeholder="فیلتر پلتفرم..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="relative">
            <HugeiconsIcon
              icon={Link02Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              value={filters.url}
              onChange={(e) =>
                handleFilterChange({ url: e.target.value, page: 1 })
              }
              placeholder="فیلتر آدرس لینک..."
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
              className="h-14 w-full animate-pulse rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <SocialsTable
            items={items}
            isLoading={isLoading}
            onEdit={(item) => setModalState({ open: true, item })}
            onDelete={(item) => setDeleteTarget(item)}
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
                ({new Intl.NumberFormat("fa-IR").format(totalCount)} شبکه اجتماعی)
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
        <SocialFormModal
          key={modalState.item?.id ?? "create-social"}
          item={modalState.item}
          onClose={() => setModalState({ open: false, item: null })}
        />
      )}

      <SocialDeleteConfirmModal
        item={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async (id) => {
          await deleteMutation.mutateAsync(id);
        }}
      />
    </section>
  );
}