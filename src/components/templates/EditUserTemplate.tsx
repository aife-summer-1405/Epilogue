"use client";

import { useAdminUserDetailQuery } from "@/hooks/useAdminUsers";
import { EditUserForm } from "@/components/organisms/EditUserForm";
import type { AdminUserItem } from "@/core/types/userManagement.types";

interface EditUserTemplateProps {
  userId: string;
  initialUser?: AdminUserItem;
}

export function EditUserTemplate({ userId, initialUser }: EditUserTemplateProps) {
  const { data, isLoading, isError, error } = useAdminUserDetailQuery(userId);
  const user = data ?? initialUser;

  return (
    <section dir="rtl" className="w-full space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
          ویرایش اطلاعات کاربر #{userId}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
          بروزرسانی مشخصات، شماره تماس، وضعیت تایید ایمیل و تصویر پروفایل کاربر
        </p>
      </div>

      {isLoading && !user ? (
        <div className="h-72 w-full animate-pulse rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50" />
      ) : isError && !user ? (
        <div className="rounded-2xl border border-danger-300 dark:border-danger-700 bg-danger-50 dark:bg-danger-900/30 p-6 text-center text-danger-700 dark:text-danger-400">
          <p className="text-sm font-bold">خطا در دریافت اطلاعات کاربر</p>
          <p className="mt-1 text-xs">{error?.message}</p>
        </div>
      ) : user ? (
        <EditUserForm user={user} />
      ) : null}
    </section>
  );
}