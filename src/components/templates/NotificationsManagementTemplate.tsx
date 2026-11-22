"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notification01Icon,
  CheckmarkCircle02Icon,
  MailOpen01Icon,
  Search01Icon,
  UserIcon,
  FilterHorizontalIcon,
} from "@hugeicons/core-free-icons";
import Badge from "@/components/atoms/badge/Badge";
import {
  NotificationsFilters,
  NotificationsResponse,
} from "@/core/types/notification";
import {
  formatPersianNumber,
  toEnglishDigits,
  toPersianDigits,
} from "@/lib/formatters/persian-digits";
import { Pagination } from "../molecules";

interface NotificationsManagementTemplateProps {
  response: NotificationsResponse;
  filters: NotificationsFilters;
  isLoading?: boolean;
  errorMessage?: string | null;
  onFilterChange: (next: Partial<NotificationsFilters>) => void;
}

export function NotificationsManagementTemplate({
  response,
  filters,
  isLoading = false,
  errorMessage = null,
  onFilterChange,
}: NotificationsManagementTemplateProps) {
  const rawItems = response?.data ?? [];
  const totalCountFromApi = response?.totalCount ?? rawItems.length;
  const currentPage = filters.page ?? 1;
  const limit = filters.limit ?? 10;

  const items = useMemo(() => {
    const query = toEnglishDigits(filters.search || "")
      .toLowerCase()
      .trim();
    const userQuery = toEnglishDigits(filters.userId || "").trim();

    return rawItems.filter((item) => {
      const matchesUser =
        !userQuery ||
        toEnglishDigits(String(item.userId ?? "")).includes(userQuery);

      if (!matchesUser) return false;
      if (!query) return true;

      const titleMatch = toEnglishDigits(String(item.title ?? ""))
        .toLowerCase()
        .includes(query);
      const messageMatch = toEnglishDigits(String(item.message ?? ""))
        .toLowerCase()
        .includes(query);
      const typeMatch = toEnglishDigits(String(item.type ?? ""))
        .toLowerCase()
        .includes(query);
      const idMatch = toEnglishDigits(String(item.id ?? "")).includes(query);

      return titleMatch || messageMatch || typeMatch || idMatch;
    });
  }, [rawItems, filters.search, filters.userId]);

  const hasActiveSearchOrUserFilter = Boolean(
    (filters.search && filters.search.trim()) ||
      (filters.userId && filters.userId.trim())
  );

  const effectiveTotalCount = hasActiveSearchOrUserFilter
    ? items.length
    : totalCountFromApi;

  const totalPages = Math.max(1, Math.ceil(effectiveTotalCount / limit));

  const stats = useMemo(() => {
    const readCount = items.filter((n) => n.isRead).length;
    const unreadCount = items.filter((n) => !n.isRead).length;
    return {
      totalCount: effectiveTotalCount,
      readCount,
      unreadCount,
    };
  }, [items, effectiveTotalCount]);

  return (
    <div dir="rtl" className="space-y-6">
      {errorMessage && (
        <div className="rounded-2xl border border-danger-500/40 bg-danger-500/10 px-4 py-3 text-xs sm:text-sm font-medium text-danger-500">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              کل اعلانات ثبت‌شده
            </p>
            <p className="text-xl font-extrabold text-default-text mt-1">
              {formatPersianNumber(stats.totalCount)}
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-primary-50 dark:bg-primary-100/30 text-primary-500 flex items-center justify-center">
            <HugeiconsIcon
              icon={Notification01Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              خوانده‌شده
            </p>
            <p className="text-xl font-extrabold text-default-text mt-1">
              {formatPersianNumber(stats.readCount)}
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              خوانده‌نشده
            </p>
            <p className="text-xl font-extrabold text-default-text mt-1">
              {formatPersianNumber(stats.unreadCount)}
            </p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
            <HugeiconsIcon
              icon={MailOpen01Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </motion.div>
      </div>

      <div className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-600">
          <HugeiconsIcon
            icon={FilterHorizontalIcon}
            size={16}
            color="currentColor"
          />
          <span>فیلتر و جستجوی اعلانات</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              value={toPersianDigits(filters.search || "")}
              onChange={(e) =>
                onFilterChange({ search: e.target.value, page: 1 })
              }
              placeholder="جستجو در عنوان، پیام یا شناسه..."
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
                filters.userId
                  ? formatPersianNumber(filters.userId, false)
                  : ""
              }
              onChange={(e) => {
                const englishVal = toEnglishDigits(e.target.value).replace(
                  /[^\d]/g,
                  ""
                );
                onFilterChange({ userId: englishVal, page: 1 });
              }}
              placeholder="شناسه کاربر..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <select
            value={String(limit)}
            onChange={(e) =>
              onFilterChange({ limit: Number(e.target.value), page: 1 })
            }
            className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3.5 py-2.5 text-xs sm:text-sm text-default-text outline-none focus:border-primary-500 transition-colors"
          >
            <option value="10">نمایش {toPersianDigits(10)} تایی</option>
            <option value="20">نمایش {toPersianDigits(20)} تایی</option>
            <option value="50">نمایش {toPersianDigits(50)} تایی</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="h-16 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-50"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-neutral-800 dark:text-neutral-600">
            هیچ اعلانی برای نمایش یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50/50 text-neutral-800 dark:text-neutral-700">
                  <th className="py-3.5 px-4 font-bold">شناسه</th>
                  <th className="py-3.5 px-4 font-bold">کاربر</th>
                  <th className="py-3.5 px-4 font-bold">عنوان و پیام</th>
                  <th className="py-3.5 px-4 font-bold">نوع / پیشنهاد</th>
                  <th className="py-3.5 px-4 font-bold">وضعیت</th>
                  <th className="py-3.5 px-4 font-bold">تاریخ ثبت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const offerId = item.data?.offerId;
                    const createdDate = new Date(item.createdAt).toLocaleDateString(
                      "fa-IR"
                    );

                    return (
                      <motion.tr
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-50/20 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold whitespace-nowrap">
                          #{toPersianDigits(item.id)}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          کاربر #{toPersianDigits(item.userId)}
                        </td>

                        <td className="py-3.5 px-4 max-w-md">
                          <p className="font-bold text-default-text truncate">
                            {toPersianDigits(item.title)}
                          </p>
                          <p className="text-xs text-neutral-800 dark:text-neutral-600 line-clamp-1 mt-0.5">
                            {toPersianDigits(item.message)}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                          <span>{toPersianDigits(item.type || "—")}</span>
                          {offerId !== undefined && offerId !== null && (
                            <span className="block text-neutral-800 dark:text-neutral-600 mt-0.5">
                              پیشنهاد #{toPersianDigits(String(offerId))}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge
                            text={item.isRead ? "خوانده‌شده" : "خوانده‌نشده"}
                            type={item.isRead ? "confirmed" : "pending"}
                          />
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                          {toPersianDigits(createdDate)}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-800 dark:text-neutral-600">
        <span>
          صفحه {formatPersianNumber(currentPage)} از{" "}
          {formatPersianNumber(totalPages)} (مجموع:{" "}
          {formatPersianNumber(effectiveTotalCount)} اعلان)
        </span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => onFilterChange({ page })}
        />
      </div>
    </div>
  );
}