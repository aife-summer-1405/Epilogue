"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  PencilEdit02Icon,
  Delete02Icon,
  Link02Icon,
} from "@hugeicons/core-free-icons";
import { SocialMediaLink } from "@/core/types/social";
import { formatPlatformFa } from "@/lib/formatters/social";
import { toPersianDigits } from "@/lib/formatters/house";

interface SocialsTableProps {
  items: SocialMediaLink[];
  isLoading: boolean;
  onEdit: (item: SocialMediaLink) => void;
  onDelete: (item: SocialMediaLink) => void;
}

export function SocialsTable({
  items,
  isLoading,
  onEdit,
  onDelete,
}: SocialsTableProps) {
  if (!isLoading && items.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-10 text-center">
        <p className="text-sm font-bold text-default-text">
          شبکه اجتماعی‌ای یافت نشد
        </p>
        <p className="mt-1 text-xs text-neutral-800 dark:text-neutral-600">
          فیلتر پلتفرم یا لینک را تغییر دهید یا مورد جدیدی ثبت کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-right">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-100 bg-neutral-100/70 dark:bg-neutral-50/50 text-xs font-extrabold text-neutral-800 dark:text-neutral-600">
              <th className="px-4 py-3.5">شناسه</th>
              <th className="px-4 py-3.5">پلتفرم</th>
              <th className="px-4 py-3.5">آدرس لینک </th>
              <th className="px-4 py-3.5 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-xs sm:text-sm">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-neutral-100/50 dark:hover:bg-neutral-50/30 transition-colors"
              >
                <td className="px-4 py-3.5 font-bold text-default-text">
                  {toPersianDigits(item.id)}#
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-100/30 dark:text-primary-800 px-2.5 py-1 text-xs font-extrabold">
                    {formatPlatformFa(item.platform)}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-primary-600 dark:text-primary-800 hover:underline break-all"
                  >
                    <HugeiconsIcon
                      icon={Link02Icon}
                      size={14}
                      color="currentColor"
                      className="shrink-0"
                    />
                    <span>{item.url}</span>
                  </a>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      title="ویرایش "
                      className="rounded-xl border border-primary-300 dark:border-primary-700 bg-primary-50/70 dark:bg-primary-100/20 p-2 text-primary-600 dark:text-primary-800 hover:bg-primary-100 transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon
                        icon={PencilEdit02Icon}
                        size={16}
                        color="currentColor"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      title="حذف "
                      className="rounded-xl border border-danger-300 dark:border-danger-700 bg-danger-50/70 dark:bg-danger-900/20 p-2 text-danger-600 dark:text-danger-400 hover:bg-danger-100 transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon
                        icon={Delete02Icon}
                        size={16}
                        color="currentColor"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}