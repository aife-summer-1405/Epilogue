"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  PencilEdit02Icon,
  Delete02Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import type { AdminCommentItem } from "@/core/types/adminComment";
import { toPersianDigits } from "@/lib/formatters/house";

interface AdminCommentsTableProps {
  comments: AdminCommentItem[];
  isLoading: boolean;
  onView: (comment: AdminCommentItem) => void;
  onEdit: (comment: AdminCommentItem) => void;
  onDelete: (comment: AdminCommentItem) => void;
}

function formatCommentDate(comment: AdminCommentItem): string {
  const raw = comment.created_at || comment.createdAt || "";
  if (!raw) return "ثبت نشده";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return toPersianDigits(raw);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function AdminCommentsTable({
  comments,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: AdminCommentsTableProps) {
  if (!isLoading && comments.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-10 text-center">
        <p className="text-sm font-bold text-default-text">نظری یافت نشد</p>
        <p className="mt-1 text-xs text-neutral-800 dark:text-neutral-600">
          فیلترهای امتیاز، شناسه کاربر یا شناسه اقامتگاه را تغییر دهید.
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
                <th className="px-4 py-3.5">کاربر و اقامتگاه</th>
                <th className="px-4 py-3.5">عنوان و متن نظر</th>
                <th className="px-4 py-3.5">امتیاز</th>
                <th className="px-4 py-3.5">تاریخ ثبت</th>
                <th className="px-4 py-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-sm">
              {comments.map((comment, idx) => {
                const userFullName =
                  [comment.user?.firstName, comment.user?.lastName]
                    .filter(Boolean)
                    .join(" ")
                    .trim() || "کاربر";

                return (
                  <motion.tr
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(idx * 0.04, 0.4),
                    }}
                    className="group transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-50/60"
                  >
                    <td className="px-4 py-3.5 font-bold text-default-text whitespace-nowrap">
                      #{toPersianDigits(String(comment.id))}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {comment.user?.profilePicture ? (
                          <img
                            src={comment.user.profilePicture}
                            alt={userFullName}
                            className="h-8 w-8 shrink-0 rounded-full object-cover border border-neutral-300 dark:border-neutral-200"
                          />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                            {userFullName.slice(0, 1)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-default-text">
                            {toPersianDigits(userFullName)}
                          </div>
                          <div className="text-xs text-neutral-800 dark:text-neutral-600">
                            {comment.house?.title
                              ? toPersianDigits(comment.house.title)
                              : `اقامتگاه #${toPersianDigits(String(comment.house_id))}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-bold text-default-text truncate">
                        {toPersianDigits(comment.title)}
                      </div>
                      <div className="text-xs text-neutral-800 dark:text-neutral-600 truncate">
                        {toPersianDigits(comment.caption)}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 dark:bg-warning-900/30 px-2.5 py-1 text-xs font-bold text-warning-700 dark:text-warning-400">
                        <HugeiconsIcon
                          icon={StarIcon}
                          size={13}
                          color="currentColor"
                        />
                        {toPersianDigits(String(comment.rating))}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-600 whitespace-nowrap">
                      {formatCommentDate(comment)}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onView(comment)}
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
                          onClick={() => onEdit(comment)}
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
                          onClick={() => onDelete(comment)}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {comments.map((comment, idx) => {
          const userFullName =
            [comment.user?.firstName, comment.user?.lastName]
              .filter(Boolean)
              .join(" ")
              .trim() || "کاربر";

          return (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.35) }}
              className="flex flex-col justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-default-text">
                    {toPersianDigits(userFullName)}
                  </h3>
                  <p className="text-xs text-neutral-800 dark:text-neutral-600">
                    {comment.house?.title
                      ? toPersianDigits(comment.house.title)
                      : `اقامتگاه #${toPersianDigits(String(comment.house_id))}`}
                  </p>
                </div>

                <span className="shrink-0 rounded-lg bg-neutral-200 dark:bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800 dark:text-neutral-700">
                  #{toPersianDigits(String(comment.id))}
                </span>
              </div>

              <div className="space-y-2 border-y border-neutral-200 dark:border-neutral-100 py-3 text-xs">
                <div className="font-bold text-default-text">
                  {toPersianDigits(comment.title)}
                </div>
                <p className="text-neutral-800 dark:text-neutral-600 line-clamp-2">
                  {toPersianDigits(comment.caption)}
                </p>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    امتیاز:
                  </span>
                  <span className="font-bold text-warning-700 dark:text-warning-400">
                    {toPersianDigits(String(comment.rating))}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-800 dark:text-neutral-600">
                    تاریخ:
                  </span>
                  <span className="text-default-text">
                    {formatCommentDate(comment)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onView(comment)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-neutral-300 dark:border-neutral-200 py-2 text-xs font-bold text-default-text transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={ViewIcon} size={14} color="currentColor" />
                  <span>جزئیات</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(comment)}
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
                  onClick={() => onDelete(comment)}
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
          );
        })}
      </div>
    </>
  );
}