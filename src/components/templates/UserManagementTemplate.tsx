"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultiple02Icon,
  Search01Icon,
  RefreshIcon,
  ShieldUserIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { useAdminUsersQuery } from "@/hooks/useAdminUsers";
import type { AdminUserItem, GetAdminUsersResponse } from "@/core/types/userManagement.types";
import { UsersListTable } from "@/components/organisms/UsersListTable";
import { UserDeleteModal } from "@/components/molecules/UserDeleteModal";

interface UserManagementTemplateProps {
  initialData?: GetAdminUsersResponse;
}

export function UserManagementTemplate({ initialData }: UserManagementTemplateProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | string>("all");
  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminUsersQuery({ search: searchQuery || undefined });

  const users = data?.data ?? initialData?.data ?? [];
  const totalCount = data?.totalCount ?? initialData?.totalCount ?? users.length;

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesRole;

      const full = `${u.firstName ?? ""} ${u.lastName ?? ""} ${u.fullName ?? ""} ${u.email ?? ""} ${u.phoneNumber ?? ""} ${u.id}`.toLowerCase();
      return matchesRole && full.includes(q);
    });
  }, [users, roleFilter, searchQuery]);

  const adminCount = useMemo(
    () => users.filter((u) => u.role === "admin").length,
    [users]
  );

  const verifiedCount = useMemo(
    () => users.filter((u) => u.emailVerified).length,
    [users]
  );

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  return (
    <section dir="rtl" className="w-full space-y-6 p-4 sm:p-6">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border px-4 py-3 text-xs sm:text-sm font-bold shadow-sm ${
            toast.type === "success"
              ? "border-success-400 bg-success-50 text-success-800 dark:bg-success-900/30 dark:text-success-400"
              : "border-danger-400 bg-danger-50 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400"
          }`}
        >
          {toast.text}
        </motion.div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
            مدیریت کاربران
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
            مشاهده لیست کاربران، تغییر نقش، ویرایش اطلاعات و حذف حساب کاربری
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">کل کاربران ثبت‌شده</p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(totalCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
            <HugeiconsIcon icon={UserMultiple02Icon} size={22} color="currentColor" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">مدیران (در صفحه جاری)</p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(adminCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 dark:bg-secondary-100/40 dark:text-secondary-700">
            <HugeiconsIcon icon={ShieldUserIcon} size={22} color="currentColor" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">ایمیل تاییدشده (در صفحه جاری)</p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(verifiedCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-500">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} color="currentColor" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            color="currentColor"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس نام، ایمیل، موبایل یا شناسه..."
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "همه نقش‌ها" },
            { key: "admin", label: "ادمین" },
            { key: "buyer", label: "کاربر" },
          ].map((tab) => {
            const active = roleFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setRoleFilter(tab.key)}
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
      </div>

      {isLoading && !initialData ? (
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
          <p className="text-sm font-bold">خطا در دریافت لیست کاربران</p>
          <p className="mt-1 text-xs">{error?.message}</p>
        </div>
      ) : (
        <UsersListTable
          users={filteredUsers}
          onRequestDelete={(user) => setUserToDelete(user)}
          onRoleFeedback={showToast}
        />
      )}

      <UserDeleteModal
        user={userToDelete}
        onClose={() => setUserToDelete(null)}
        onSuccess={(msg) => showToast("success", msg)}
        onError={(msg) => showToast("error", msg)}
      />
    </section>
  );
}