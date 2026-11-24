"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultiple02Icon,
  RefreshIcon,
  CheckmarkCircle02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import {
  useApproveSellerUpgradeRequest,
  useRejectSellerUpgradeRequest,
  useSellerUpgradeRequests,
} from "@/hooks/use-seller-upgrade";
import {
  SellerUpgradeFilters,
  SellerUpgradeRequest,
} from "@/core/types/sellerUpgrade";
import { SellerUpgradeRequestsTable } from "@/components/organisms/SellerUpgradeRequestsTable";
import { SellerUpgradeReviewModal } from "@/components/molecules/SellerUpgradeReviewModal";
import { Pagination } from "@/components/molecules";

const ITEMS_PER_PAGE = 10;

const DEFAULT_FILTERS: SellerUpgradeFilters = {
  status: "pending",
  page: 1,
  limit: ITEMS_PER_PAGE,
};

export function SellerUpgradeRequestsTemplate() {
  const [filters, setFilters] = useState<SellerUpgradeFilters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewModal, setReviewModal] = useState<{
    request: SellerUpgradeRequest | null;
    action: "approve" | "reject" | null;
  }>({ request: null, action: null });

  const { data, isLoading, isFetching, isError, error, refetch } =
    useSellerUpgradeRequests(filters);

  const approveMutation = useApproveSellerUpgradeRequest();
  const rejectMutation = useRejectSellerUpgradeRequest();

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error
          ? error.message
          : "خطا در دریافت لیست درخواست‌های فروشندگی"
      );
    }
  }, [isError, error]);

  const requests = data?.requests ?? [];
  const totalCount = data?.totalCount ?? requests.length;
  const totalPages = Math.max(
    1,
    data?.totalPages ?? Math.ceil(totalCount / filters.limit)
  );

  const filteredRequests = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return requests;

    return requests.filter((req) => {
      const target =
        `${req.id} ${req.userId} ${req.message ?? ""} ${req.adminNote ?? ""} ${req.user?.fullName ?? ""} ${req.user?.email ?? ""} ${req.user?.phoneNumber ?? ""}`.toLowerCase();
      return target.includes(q);
    });
  }, [requests, searchQuery]);

  const approvedInPageCount = useMemo(
    () =>
      requests.filter((r) => r.status?.toLowerCase() === "approved").length,
    [requests]
  );

  const handlePageChange = (nextPage: number) => {
    setFilters((prev) => ({ ...prev, page: nextPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmReview = async (id: string, adminNote: string) => {
    if (reviewModal.action === "approve") {
      await approveMutation.mutateAsync({ id, adminNote });
    } else if (reviewModal.action === "reject") {
      await rejectMutation.mutateAsync({ id, adminNote });
    }
  };

  return (
    <section
      dir="rtl"
      className="w-full space-y-6 p-4 sm:p-6 text-default-text"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
            درخواست‌های ارتقا به فروشنده
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
            بررسی، تایید یا رد درخواست‌های کاربران برای تبدیل حساب به فروشنده
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
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              تعداد کل درخواست‌ها
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(totalCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
            <HugeiconsIcon
              icon={UserMultiple02Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
          <div>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              تاییدشده (در صفحه جاری)
            </p>
            <p className="mt-1 text-2xl font-extrabold text-default-text">
              {new Intl.NumberFormat("fa-IR").format(approvedInPageCount)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-500">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={22}
              color="currentColor"
            />
          </div>
        </div>
      </motion.div>

      <div className="space-y-4 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: "", label: "همه وضعیت‌ها" },
                { key: "pending", label: "در انتظار بررسی" },
                { key: "approved", label: "تایید شده" },
                { key: "rejected", label: "رد شده" },
              ] as const
            ).map((tab) => {
              const active = filters.status === tab.key;
              return (
                <button
                  key={tab.key || "all"}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      status: tab.key,
                      page: 1,
                    }))
                  }
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${active
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 dark:bg-neutral-50 text-neutral-800 dark:text-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-100"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-80">
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
              placeholder="جستجو نام، ایمیل، موبایل یا شناسه..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((skeleton) => (
            <div
              key={skeleton}
              className="h-16 w-full animate-pulse rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <SellerUpgradeRequestsTable
            requests={filteredRequests}
            isLoading={isLoading}
            onApprove={(req) => setReviewModal({ request: req, action: "approve" })}
            onReject={(req) => setReviewModal({ request: req, action: "reject" })}
          />

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
              <p className="text-xs text-neutral-800 dark:text-neutral-600">
                صفحه{" "}
                <strong className="text-default-text">
                  {new Intl.NumberFormat("fa-IR").format(filters.page)}
                </strong>{" "}
                از{" "}
                <strong className="text-default-text">
                  {new Intl.NumberFormat("fa-IR").format(totalPages)}
                </strong>{" "}
                ({new Intl.NumberFormat("fa-IR").format(totalCount)} درخواست)
              </p>

              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemClassName="cursor-pointer"
                buttonsClassName="cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {reviewModal.request && reviewModal.action && (
        <SellerUpgradeReviewModal
          key={`${reviewModal.request.id}-${reviewModal.action}`}
          request={reviewModal.request}
          action={reviewModal.action}
          isSubmitting={approveMutation.isPending || rejectMutation.isPending}
          onClose={() => setReviewModal({ request: null, action: null })}
          onConfirm={handleConfirmReview}
        />
      )}
    </section>
  );
}