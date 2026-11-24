"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  RefreshIcon,
  Search01Icon,
  ArrowUpDownIcon,
} from "@hugeicons/core-free-icons";
import {
  cancelBookingAction,
  continueBookingAction,
  deleteAdminBookingAction,
  getAdminBookingByIdAction,
  getAdminBookingsAction,
  updateAdminBookingAction,
} from "@/app/actions/admin/admin-bookings.action";
import type {
  AdminBookingItem,
  AdminBookingsListResponse,
  AdminBookingsQueryParams,
  UpdateAdminBookingPayload,
} from "@/core/types/adminBooking";
import { AdminBookingsTable } from "@/components/organisms/AdminBookingsTable";
import {
  AdminBookingDetailModal,
  AdminBookingEditModal,
} from "@/components/molecules/AdminBookingModal";
import { Pagination } from "@/components/molecules";
import { toPersianDigits } from "@/lib/formatters/house";

const DEFAULT_PARAMS: AdminBookingsQueryParams = {
  page: 1,
  limit: 10,
  sort: "createdAt",
  order: "DESC",
  status: "",
  user_id: "",
  house_id: "",
};

export function AdminBookingsTemplate() {
  const [params, setParams] = useState<AdminBookingsQueryParams>(DEFAULT_PARAMS);
  const [items, setItems] = useState<AdminBookingItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [detailBooking, setDetailBooking] = useState<AdminBookingItem | null>(
    null
  );
  const [editBooking, setEditBooking] = useState<AdminBookingItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<number[]>([]);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useQuery<AdminBookingsListResponse>({
      queryKey: ["AdminBookings", params],
      queryFn: () => getAdminBookingsAction(params),
      placeholderData: (prev) => prev,
    });

  useEffect(() => {
    if (data) {
      setItems(data.data ?? []);
      setTotalCount(data.totalCount ?? data.data?.length ?? 0);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : "خطا در دریافت لیست رزروها"
      );
    }
  }, [isError, error]);

  const handleSaveEdit = async (payload: UpdateAdminBookingPayload) => {
    setIsUpdating(true);
    try {
      const updated = await updateAdminBookingAction(payload);
      setItems((prev) =>
        prev.map((item) =>
          item.id === payload.id
            ? {
                ...item,
                ...(updated && typeof updated === "object" ? updated : {}),
                id: payload.id,
                houseId: String(payload.houseId),
                status: payload.status,
                sharedEmail: payload.sharedEmail,
                sharedMobile: payload.sharedMobile,
                reservedDates:
                  Array.isArray(updated?.reservedDates) &&
                  updated.reservedDates.length > 0
                    ? updated.reservedDates
                    : payload.reservedDates,
                traveler_details:
                  Array.isArray(updated?.traveler_details) &&
                  updated.traveler_details.length > 0
                    ? updated.traveler_details
                    : payload.traveler_details,
              }
            : item
        )
      );
      toast.success("رزرو با موفقیت ویرایش شد");
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در ویرایش رزرو");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (booking: AdminBookingItem) => {
    try {
      await deleteAdminBookingAction(booking.id);
      setItems((prev) => prev.filter((item) => item.id !== booking.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setResolvedIds((prev) => prev.filter((item) => item !== booking.id));
      toast.success("رزرو حذف شد");
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در حذف رزرو");
    }
  };

  const handleContinue = async (booking: AdminBookingItem) => {
    try {
      await continueBookingAction(booking.id);
      setResolvedIds((prev) =>
        prev.includes(booking.id) ? prev : [...prev, booking.id]
      );
      setItems((prev) =>
        prev.map((item) =>
          item.id === booking.id ? { ...item, status: "confirmed" } : item
        )
      );
      toast.success("رزرو تایید شد");
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در ادامه رزرو");
    }
  };

  const handleCancel = async (booking: AdminBookingItem) => {
    try {
      await cancelBookingAction(booking.id);
      setResolvedIds((prev) =>
        prev.includes(booking.id) ? prev : [...prev, booking.id]
      );
      setItems((prev) =>
        prev.map((item) =>
          item.id === booking.id ? { ...item, status: "canceled" } : item
        )
      );
      toast.success("رزرو لغو شد");
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "خطا در لغو رزرو");
    }
  };

  const handleOpenDetail = async (booking: AdminBookingItem) => {
    setDetailBooking(booking);
    try {
      const fresh = await getAdminBookingByIdAction(booking.id);
      setDetailBooking(fresh);
    } catch {
    }
  };

  const handleResetFilters = () => {
    setParams(DEFAULT_PARAMS);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / params.limit));

  return (
    <section
      dir="rtl"
      className="w-full space-y-6 p-4 sm:p-6 text-default-text"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
            مدیریت رزروها
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
            مشاهده، فیلتر، ویرایش، ادامه، لغو و حذف رزروهای ثبت‌شده
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

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm"
      >
        <div>
          <p className="text-xs text-neutral-800 dark:text-neutral-600">
            تعداد کل رزروها
          </p>
          <p className="mt-1 text-2xl font-extrabold text-default-text">
            {toPersianDigits(totalCount)}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={22}
            color="currentColor"
          />
        </div>
      </motion.div>

      <div className="space-y-4 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "", label: "همه وضعیت‌ها" },
              { key: "pending", label: "در انتظار" },
              { key: "confirmed", label: "تایید شده" },
              { key: "canceled", label: "لغو شده" },
            ].map((tab) => {
              const active = (params.status || "") === tab.key;
              return (
                <button
                  key={tab.key || "all"}
                  type="button"
                  onClick={() => {
                    setParams((prev) => ({
                      ...prev,
                      status: tab.key,
                      page: 1,
                    }));
                  }}
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

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-600">
              <HugeiconsIcon
                icon={ArrowUpDownIcon}
                size={15}
                color="currentColor"
              />
              <span>مرتب‌سازی:</span>
            </div>

            <select
              value={params.sort || "createdAt"}
              onChange={(e) => {
                setParams((prev) => ({
                  ...prev,
                  sort: e.target.value,
                  page: 1,
                }));
              }}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="createdAt">تاریخ ثبت</option>
              <option value="id">شناسه رزرو</option>
            </select>

            <select
              value={params.order || "DESC"}
              onChange={(e) => {
                setParams((prev) => ({
                  ...prev,
                  order: e.target.value === "ASC" ? "ASC" : "DESC",
                  page: 1,
                }));
              }}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="DESC">نزولی</option>
              <option value="ASC">صعودی</option>
            </select>

            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              inputMode="numeric"
              value={params.user_id || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  user_id: toPersianDigits(e.target.value),
                  page: 1,
                }))
              }
              placeholder="فیلتر شناسه کاربر..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              color="currentColor"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
            />
            <input
              type="text"
              value={params.house_id || ""}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  house_id: toPersianDigits(e.target.value),
                  page: 1,
                }))
              }
              placeholder="فیلتر شناسه اقامتگاه..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className="h-16 w-full animate-pulse rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <AdminBookingsTable
            bookings={items}
            isLoading={isLoading}
            resolvedIds={resolvedIds}
            onView={handleOpenDetail}
            onEdit={(b) => setEditBooking(b)}
            onContinue={handleContinue}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
              <p className="text-xs text-neutral-800 dark:text-neutral-600">
                صفحه{" "}
                <strong className="text-default-text">
                  {toPersianDigits(params.page)}
                </strong>{" "}
                از{" "}
                <strong className="text-default-text">
                  {toPersianDigits(totalPages)}
                </strong>{" "}
                ({toPersianDigits(totalCount)} رزرو)
              </p>

              <Pagination
                currentPage={params.page}
                totalPages={totalPages}
                onPageChange={(nextPage) =>
                  setParams((prev) => ({ ...prev, page: nextPage }))
                }
                itemClassName="cursor-pointer"
                buttonsClassName="cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {detailBooking && (
        <AdminBookingDetailModal
          booking={detailBooking}
          onClose={() => setDetailBooking(null)}
        />
      )}

      {editBooking && (
        <AdminBookingEditModal
          key={editBooking.id}
          booking={editBooking}
          isSubmitting={isUpdating}
          onClose={() => setEditBooking(null)}
          onSave={handleSaveEdit}
        />
      )}
    </section>
  );
}