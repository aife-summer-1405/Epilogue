"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  ViewIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import type { ContactMessageItem } from "@/core/types/contactUs.types";

interface ContactMessagesListTableProps {
  messages: ContactMessageItem[];
  onRequestView: (item: ContactMessageItem) => void;
  onRequestDelete: (item: ContactMessageItem) => void;
}

export function ContactMessagesListTable({
  messages,
  onRequestView,
  onRequestDelete,
}: ContactMessagesListTableProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-50 text-neutral-800 dark:text-neutral-600">
          <HugeiconsIcon icon={Mail01Icon} size={24} color="currentColor" />
        </div>
        <p className="mt-3 text-sm font-bold text-default-text">
          هیچ پیامی یافت نشد
        </p>
        <p className="mt-1 text-xs text-neutral-800 dark:text-neutral-600">
          عبارت جستجو را تغییر دهید یا فیلترها را بازنشانی کنید.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-100 bg-neutral-100/70 dark:bg-neutral-50 text-xs font-extrabold text-neutral-800 dark:text-neutral-600">
                <th className="w-24 px-5 py-3.5">شناسه</th>
                <th className="w-1/3 px-5 py-3.5">عنوان پیام </th>
                <th className="px-5 py-3.5">متن پیام </th>
                <th className="w-44 px-5 py-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-100 text-xs sm:text-sm">
              {messages.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-neutral-100/60 dark:hover:bg-neutral-50/60 transition-colors"
                >
                  <td className="px-5 py-4 font-bold text-neutral-800 dark:text-neutral-600">
                    #{new Intl.NumberFormat("fa-IR").format(Number(item.id))}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5 font-bold text-default-text">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-100/30">
                        <HugeiconsIcon
                          icon={Mail01Icon}
                          size={16}
                          color="currentColor"
                        />
                      </span>
                      <span className="line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-neutral-800 dark:text-neutral-600">
                    <p className="line-clamp-2 max-w-md leading-5">
                      {item.message}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onRequestView(item)}
                        className="inline-flex items-center gap-1 rounded-xl bg-primary-50 dark:bg-primary-100/20 px-3 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-100/40 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={ViewIcon}
                          size={15}
                          color="currentColor"
                        />
                        <span>مشاهده</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRequestDelete(item)}
                        className="inline-flex items-center gap-1 rounded-xl bg-danger-50 dark:bg-danger-900/30 px-3 py-1.5 text-xs font-bold text-danger-600 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-900/50 transition-colors cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          size={15}
                          color="currentColor"
                        />
                        <span>حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {messages.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 font-extrabold text-default-text">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-100/30">
                  <HugeiconsIcon icon={Mail01Icon} size={16} />
                </span>
                <span className="text-xs sm:text-sm line-clamp-1">
                  {item.title}
                </span>
              </div>
              <span className="shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-50 px-2.5 py-1 text-xs font-bold text-neutral-800 dark:text-neutral-600">
                #{item.id}
              </span>
            </div>

            <p className="rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3 text-xs leading-5 text-neutral-800 dark:text-neutral-600 line-clamp-3">
              {item.message}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onRequestView(item)}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-primary-50 dark:bg-primary-100/20 py-2 text-xs font-bold text-primary-600 dark:text-primary-300"
              >
                <HugeiconsIcon icon={ViewIcon} size={14} />
                <span>مشاهده کامل</span>
              </button>
              <button
                type="button"
                onClick={() => onRequestDelete(item)}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-danger-50 dark:bg-danger-900/30 py-2 text-xs font-bold text-danger-600 dark:text-danger-400"
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} />
                <span>حذف</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}