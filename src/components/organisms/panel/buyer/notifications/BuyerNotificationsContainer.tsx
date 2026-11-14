"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  ArrowDown01Icon,
  Notification03Icon,
} from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import Pagination from "@/components/molecules/Pagination";
import MarkAllReadModal from "@/components/molecules/mark-all-read-modal/MarkAllReadModal";
import { useGetNotifications } from "@/hooks/queries/useGetNotifications";
import {
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/mutations/panel/buyer/useNotificationMutations";
import {
  IGetNotificationsParams,
  INotificationItem,
} from "@/core/types/notifications/notifications.types";

const FILTER_OPTIONS = [
  { label: "همه اعلان‌ها", value: "all" },
  { label: "خوانده نشده", value: "unread" },
  { label: "خوانده شده", value: "read" },
];

const formatPersianDateTime = (isoDate?: string): string => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;

  const datePart = new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${datePart} - ${timePart}`;
};

const BuyerNotificationsContainer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const statusFilter = searchParams.get("status") || "all";
  const typeFilter = searchParams.get("type") || undefined;
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const queryParams = useMemo<IGetNotificationsParams>(() => {
    return {
      page: currentPage,
      limit,
      sort: "createdAt",
      order: "DESC",
      isRead:
        statusFilter === "unread"
          ? false
          : statusFilter === "read"
            ? true
            : undefined,
      type: typeFilter,
    };
  }, [currentPage, limit, statusFilter, typeFilter]);

  const { data, isLoading, isError } = useGetNotifications(queryParams);
  const {
    mutate: markOneAsRead,
    variables: markingId,
    isPending: isMarkingOne,
  } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead();

  const notifications = useMemo(() => data?.data || [], [data?.data]);
  const totalPages = data?.totalPages || 1;

  const unreadList = useMemo(
    () => notifications.filter((item) => !item.isRead),
    [notifications],
  );
  const readList = useMemo(
    () => notifications.filter((item) => item.isRead),
    [notifications],
  );

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      params.delete("status");
    } else {
      params.set("status", val);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  const handleConfirmMarkAll = () => {
    markAllAsRead(undefined, {
      onSuccess: (res) => {
        if (res?.success) {
          setIsConfirmModalOpen(false);
        }
      },
    });
  };

  const renderNotificationRow = (
    item: INotificationItem,
    isUnread: boolean,
  ) => {
    const displayText = item.message || item.title || "اعلان جدید";
    const displayDate = formatPersianDateTime(
      item.createdAt || item.created_at,
    );
    const isThisItemLoading =
      isMarkingOne && String(markingId) === String(item.id);

    return (
      <div
        key={item.id}
        className="flex flex-col justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50 md:grid md:grid-cols-12 md:items-center md:gap-4 md:rounded-none md:border-0 md:bg-transparent md:px-2 md:py-3.5 md:hover:bg-gray-50/60 dark:border-zinc-800 dark:bg-zinc-800/40 md:dark:bg-transparent md:dark:hover:bg-zinc-800/30"
      >
        <div className="flex flex-col gap-1 md:col-span-6">
          {item.title && item.message && item.title !== item.message && (
            <span className="text-xs font-extrabold text-gray-900 dark:text-white">
              {item.title}
            </span>
          )}
          <p className="text-xs leading-6 font-bold text-gray-800 sm:text-sm dark:text-gray-200">
            {displayText}
          </p>
        </div>

        <div className="flex items-center justify-between md:col-span-3 md:justify-center">
          <span className="text-xs text-gray-400 md:hidden">تاریخ:</span>
          <span className="text-xs font-semibold text-gray-600 sm:text-sm dark:text-gray-400">
            {displayDate}
          </span>
        </div>

        <div className="flex items-center justify-end md:col-span-3">
          {isUnread && (
            <button
              type="button"
              disabled={isThisItemLoading}
              onClick={() => markOneAsRead(item.id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 transition-opacity hover:text-emerald-700 disabled:opacity-50 sm:text-sm dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <span>
                {isThisItemLoading
                  ? "در حال ثبت..."
                  : "علامت گذاری به عنوان خوانده شده"}
              </span>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      dir="rtl"
      className="flex min-h-135 w-full flex-col justify-between rounded-[28px] bg-white p-5 shadow-xs sm:p-7 dark:bg-[#272727]"
    >
      <div>
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center dark:border-zinc-800">
          <h1 className="text-lg font-extrabold text-gray-900 sm:text-xl dark:text-white">
            لیست اعلان های شما
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                aria-label="فیلتر نوع اعلان"
                className="h-10 appearance-none rounded-full border border-gray-200 bg-white pr-4 pl-9 text-xs font-bold text-gray-700 outline-none transition-colors focus:border-[#1e3a8a] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
              >
                {FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              />
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              hasIcon={false}
              disabled={isMarkingAll || unreadList.length === 0}
              onClick={() => setIsConfirmModalOpen(true)}
              className="h-10 rounded-full bg-[#1e3a8a] px-5 text-xs font-bold text-white transition-opacity hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              علامت گذاری به عنوان خوانده شده
            </Button>
          </div>
        </div>

        <div className="mt-6 hidden grid-cols-12 px-2 pb-3 text-sm font-extrabold text-gray-900 md:grid dark:text-white">
          <div className="col-span-6 text-right">اعلان</div>
          <div className="col-span-3 text-center">تاریخ</div>
          <div className="col-span-3 text-left" />
        </div>

        {isLoading && (
          <div className="mt-4 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-14 w-full animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="my-16 text-center text-sm font-bold text-red-500">
            خطا در دریافت لیست اعلان‌ها از سرور.
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="my-16 flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-zinc-800">
              <HugeiconsIcon icon={Notification03Icon} size={28} />
            </div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              هیچ اعلانی یافت نشد!
            </p>
          </div>
        )}

        {!isLoading && !isError && notifications.length > 0 && (
          <div className="mt-4 flex flex-col gap-6">
            {unreadList.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="px-2 py-1 text-sm font-bold text-gray-400 dark:text-gray-500">
                  خوانده نشده
                </div>
                <div className="flex flex-col gap-2.5 md:gap-1">
                  {unreadList.map((item) => renderNotificationRow(item, true))}
                </div>
              </div>
            )}

            {readList.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="px-2 py-1 text-sm font-bold text-gray-400 dark:text-gray-500">
                  خوانده شده
                </div>
                <div className="flex flex-col gap-2.5 md:gap-1">
                  {readList.map((item) => renderNotificationRow(item, false))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!isLoading && !isError && totalPages > 1 && (
        <div className="mt-10 flex w-full justify-center pt-4 md:justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <MarkAllReadModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmMarkAll}
        isLoading={isMarkingAll}
      />
    </section>
  );
};

export default BuyerNotificationsContainer;
