"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit02Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
  Mail01Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { AdminUserItem } from "@/core/types/userManagement.types";
import { UserRoleSelector } from "@/components/molecules/UserRoleSelector";

interface UsersListTableProps {
  users: AdminUserItem[];
  onRequestDelete: (user: AdminUserItem) => void;
  onRoleFeedback: (type: "success" | "error", text: string) => void;
}

function formatPersianDate(isoDate?: string | null) {
  if (!isoDate) return "ثبت نشده";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "ثبت نشده";
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function UsersListTable({
  users,
  onRequestDelete,
  onRoleFeedback,
}: UsersListTableProps) {
  if (!users.length) {
    return (
      <div className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-10 text-center">
        <p className="text-sm font-bold text-default-text">هیچ کاربری یافت نشد.</p>
        <p className="mt-1 text-xs text-neutral-800 dark:text-neutral-600">
          عبارت جستجو را تغییر دهید یا لیست را بروزرسانی کنید.
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
                <th className="px-4 py-3.5">کاربر</th>
                <th className="px-4 py-3.5">اطلاعات تماس</th>
                <th className="px-4 py-3.5">وضعیت ایمیل</th>
                <th className="px-4 py-3.5">نقش کاربری</th>
                <th className="px-4 py-3.5">تاریخ عضویت</th>
                <th className="px-4 py-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-sm">
              {users.map((user, idx) => {
                const displayName =
                  [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
                  user.fullName ||
                  "بدون نام";

                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.4) }}
                    className="group transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-50/60"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={displayName}
                            className="h-10 w-10 shrink-0 rounded-full object-cover border border-neutral-300 dark:border-neutral-200"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
                            <HugeiconsIcon
                              icon={UserIcon}
                              size={20}
                              color="currentColor"
                              strokeWidth={1.8}
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-default-text">{displayName}</div>
                          <div className="text-xs text-neutral-800 dark:text-neutral-600">
                            شناسه: #{user.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-default-text">
                          <HugeiconsIcon
                            icon={Mail01Icon}
                            size={14}
                            color="currentColor"
                            className="text-neutral-800 dark:text-neutral-600 shrink-0"
                          />
                          <span className="truncate max-w-[210px]">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-600">
                          <HugeiconsIcon
                            icon={SmartPhone01Icon}
                            size={14}
                            color="currentColor"
                            className="shrink-0"
                          />
                          <span dir="ltr">{user.phoneNumber || "—"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      {user.emailVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success-50 dark:bg-success-900/30 px-2.5 py-1 text-xs font-semibold text-success-700 dark:text-success-500">
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={14}
                            color="currentColor"
                          />
                          تایید شده
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 dark:bg-warning-900/30 px-2.5 py-1 text-xs font-semibold text-warning-700 dark:text-warning-500">
                          <HugeiconsIcon
                            icon={CancelCircleIcon}
                            size={14}
                            color="currentColor"
                          />
                          تایید نشده
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <UserRoleSelector
                        userId={user.id}
                        currentRole={user.role}
                        onFeedback={onRoleFeedback}
                      />
                    </td>

                    <td className="px-4 py-3.5 text-xs text-neutral-800 dark:text-neutral-600">
                      {formatPersianDate(user.createdAt || user.created_at)}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/panel/admin/users/${user.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-primary-300 dark:border-primary-400/50 bg-primary-50 hover:bg-primary-100 dark:bg-primary-100/30 dark:hover:bg-primary-100/50 px-3 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-800 transition-colors"
                        >
                          <HugeiconsIcon
                            icon={Edit02Icon}
                            size={15}
                            color="currentColor"
                            strokeWidth={1.8}
                          />
                          <span>ویرایش</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => onRequestDelete(user)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-danger-300 dark:border-danger-700/60 bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/30 dark:hover:bg-danger-900/50 px-3 py-1.5 text-xs font-bold text-danger-600 dark:text-danger-400 transition-colors cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={15}
                            color="currentColor"
                            strokeWidth={1.8}
                          />
                          <span>حذف</span>
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
        {users.map((user, idx) => {
          const displayName =
            [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
            user.fullName ||
            "بدون نام";

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.35) }}
              className="flex flex-col justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={displayName}
                      className="h-11 w-11 shrink-0 rounded-full object-cover border border-neutral-300 dark:border-neutral-200"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
                      <HugeiconsIcon icon={UserIcon} size={20} color="currentColor" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-default-text">
                      {displayName}
                    </h3>
                    <p className="truncate text-xs text-neutral-800 dark:text-neutral-600">
                      {user.email}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-lg bg-neutral-200 dark:bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800 dark:text-neutral-700">
                  #{user.id}
                </span>
              </div>

              <div className="space-y-2 border-y border-neutral-200 dark:border-neutral-100 py-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-800 dark:text-neutral-600">شماره تماس:</span>
                  <span dir="ltr" className="font-semibold text-default-text">
                    {user.phoneNumber || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-800 dark:text-neutral-600">وضعیت ایمیل:</span>
                  <span
                    className={`font-bold ${
                      user.emailVerified
                        ? "text-success-700 dark:text-success-500"
                        : "text-warning-700 dark:text-warning-500"
                    }`}
                  >
                    {user.emailVerified ? "تایید شده" : "تایید نشده"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-800 dark:text-neutral-600">تاریخ ثبت:</span>
                  <span className="text-default-text">
                    {formatPersianDate(user.createdAt || user.created_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-neutral-800 dark:text-neutral-600">نقش:</span>
                  <UserRoleSelector
                    userId={user.id}
                    currentRole={user.role}
                    onFeedback={onRoleFeedback}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`panel/admin/users/${user.id}/edit`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 py-2 text-xs font-bold text-white transition-colors"
                >
                  <HugeiconsIcon icon={Edit02Icon} size={15} color="currentColor" />
                  <span>ویرایش</span>
                </Link>

                <button
                  type="button"
                  onClick={() => onRequestDelete(user)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-danger-50 hover:bg-danger-100 dark:bg-danger-900/30 dark:hover:bg-danger-900/50 py-2 text-xs font-bold text-danger-600 dark:text-danger-400 transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={15} color="currentColor" />
                  <span>حذف</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}