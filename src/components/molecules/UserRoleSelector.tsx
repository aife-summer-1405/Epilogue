"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ShieldUserIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import { useUpdateUserRoleMutation } from "@/hooks/useAdminUsers";
import type { UserRole } from "@/core/types/userManagement.types";

interface UserRoleSelectorProps {
  userId: string;
  currentRole: UserRole;
  onFeedback?: (type: "success" | "error", text: string) => void;
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "admin", label: "ادمین " },
  { value: "buyer", label: "کاربر / خریدار " },
  { value: "seller", label: "میزبان / فروشنده " },
];

export function UserRoleSelector({
  userId,
  currentRole,
  onFeedback,
}: UserRoleSelectorProps) {
  const { mutate, isPending } = useUpdateUserRoleMutation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRole = e.target.value as UserRole;
    if (nextRole === currentRole) return;

    mutate(
      { userId, role: nextRole },
      {
        onSuccess: (res) => {
          onFeedback?.("success", res.message || "نقش کاربر با موفقیت تغییر یافت");
        },
        onError: (err) => {
          onFeedback?.("error", err.message || "خطا در تغییر نقش");
        },
      }
    );
  };

  const badgeStyle =
    currentRole === "admin"
      ? "border-primary-400/60 bg-primary-50 text-primary-700 dark:bg-primary-100/30 dark:text-primary-800"
      : "border-secondary-400/50 bg-secondary-50 text-secondary-700 dark:bg-secondary-100/30 dark:text-secondary-700";

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className={`relative inline-flex items-center rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all ${badgeStyle}`}
      >
        {isPending ? (
          <HugeiconsIcon
            icon={Loading03Icon}
            size={14}
            color="currentColor"
            strokeWidth={2}
            className="ml-1.5 animate-spin"
          />
        ) : (
          <HugeiconsIcon
            icon={ShieldUserIcon}
            size={14}
            color="currentColor"
            strokeWidth={1.8}
            className="ml-1.5 shrink-0"
          />
        )}

        <select
          aria-label="تغییر نقش کاربر"
          value={currentRole}
          disabled={isPending}
          onChange={handleChange}
          className="cursor-pointer bg-transparent text-xs font-bold outline-none disabled:cursor-not-allowed"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-default-white-bg dark:bg-default-dark-content text-default-text"
            >
              {opt.label}
            </option>
          ))}
          {!ROLE_OPTIONS.some((o) => o.value === currentRole) && (
            <option
              value={currentRole}
              className="bg-default-white-bg dark:bg-default-dark-content text-default-text"
            >
              {currentRole}
            </option>
          )}
        </select>
      </div>
    </div>
  );
}