"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  PencilEdit02Icon,
  Delete02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import type { AdminArticleItem } from "@/core/types/adminArticle";
import { toPersianDigits } from "@/lib/formatters/house";

interface AdminArticlesTableProps {
  articles: AdminArticleItem[];
  isLoading: boolean;
  onView: (article: AdminArticleItem) => void;
  onEdit: (article: AdminArticleItem) => void;
  onDelete: (article: AdminArticleItem) => void;
}

function formatArticleDate(article: AdminArticleItem): string {
  const raw = article.created_at || article.createdAt || "";
  if (!raw) return "ثبت نشده";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return toPersianDigits(raw);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function AdminArticlesTable({
  articles,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: AdminArticlesTableProps) {
  if (!isLoading && articles.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-10 text-center">
        <p className="text-sm font-bold text-default-text">مقاله‌ای یافت نشد</p>
        <p className="mt-1 text-xs text-neutral-800 dark:text-neutral-600">
          فیلترهای عنوان، نویسنده یا دسته‌بندی را تغییر دهید یا مقاله جدیدی ایجاد
          کنید.
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
                <th className="px-4 py-3.5">شناسه</th>
                <th className="px-4 py-3.5">عنوان و خلاصه مقاله</th>
                <th className="px-4 py-3.5">زمان مطالعه</th>
                <th className="px-4 py-3.5">نویسنده / دسته</th>
                <th className="px-4 py-3.5">تاریخ انتشار</th>
                <th className="px-4 py-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-sm">
              {articles.map((article, idx) => (
                <motion.tr
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(idx * 0.04, 0.4),
                  }}
                  className="group transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-50/60"
                >
                  <td className="px-4 py-3.5 font-bold text-default-text whitespace-nowrap">
                    #{toPersianDigits(String(article.id))}
                  </td>

                  <td className="px-4 py-3.5 max-w-md">
                    <div className="font-bold text-default-text truncate">
                      {toPersianDigits(article.title)}
                    </div>
                    <div className="text-xs text-neutral-800 dark:text-neutral-600 truncate">
                      {toPersianDigits(article.caption)}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 dark:bg-primary-100/20 px-2.5 py-1 text-xs font-bold text-primary-600 dark:text-primary-800">
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={13}
                        color="currentColor"
                      />
                      {toPersianDigits(article.estimated_reading_time || "—")}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                    <div className="font-semibold text-default-text">
                      نویسنده #{toPersianDigits(String(article.author_id))}
                    </div>
                    <div className="text-neutral-800 dark:text-neutral-600">
                      دسته‌بندی #{toPersianDigits(String(article.category_id))}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-600 whitespace-nowrap">
                    {formatArticleDate(article)}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(article)}
                        title="مشاهده جزئیات"
                        className="rounded-xl border border-neutral-300 dark:border-neutral-200 p-2 text-default-text hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={ViewIcon}
                          size={15}
                          color="currentColor"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(article)}
                        title="ویرایش"
                        className="rounded-xl border border-primary-300 dark:border-primary-700 bg-primary-50/70 dark:bg-primary-100/20 p-2 text-primary-600 dark:text-primary-800 hover:bg-primary-100 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={PencilEdit02Icon}
                          size={15}
                          color="currentColor"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(article)}
                        title="حذف"
                        className="rounded-xl border border-danger-300 dark:border-danger-700 bg-danger-50/70 dark:bg-danger-900/20 p-2 text-danger-600 dark:text-danger-400 hover:bg-danger-100 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          size={15}
                          color="currentColor"
                        />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {articles.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.35) }}
            className="flex flex-col justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-default-text line-clamp-1">
                  {toPersianDigits(article.title)}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-800 dark:text-neutral-600">
                  نویسنده #{toPersianDigits(String(article.author_id))} · دسته #
                  {toPersianDigits(String(article.category_id))}
                </p>
              </div>

              <span className="shrink-0 rounded-lg bg-neutral-200 dark:bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800 dark:text-neutral-700">
                #{toPersianDigits(String(article.id))}
              </span>
            </div>

            <div className="space-y-2 border-y border-neutral-200 dark:border-neutral-100 py-3 text-xs">
              <p className="text-neutral-800 dark:text-neutral-600 line-clamp-2">
                {toPersianDigits(article.caption)}
              </p>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-neutral-800 dark:text-neutral-600">
                  زمان مطالعه:
                </span>
                <span className="font-bold text-primary-600 dark:text-primary-800">
                  {toPersianDigits(article.estimated_reading_time || "—")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-neutral-800 dark:text-neutral-600">
                  تاریخ انتشار:
                </span>
                <span className="text-default-text">
                  {formatArticleDate(article)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onView(article)}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-neutral-300 dark:border-neutral-200 py-2 text-xs font-bold text-default-text transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={ViewIcon} size={14} color="currentColor" />
                <span>جزئیات</span>
              </button>

              <button
                type="button"
                onClick={() => onEdit(article)}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary-500 hover:bg-primary-600 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <HugeiconsIcon
                  icon={PencilEdit02Icon}
                  size={14}
                  color="currentColor"
                />
                <span>ویرایش</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(article)}
                className="rounded-xl bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/30 px-3 py-2 text-xs font-bold text-danger-600 dark:text-danger-400 transition-colors cursor-pointer"
              >
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={14}
                  color="currentColor"
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}