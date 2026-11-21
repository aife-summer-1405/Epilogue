"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format as formatJalali } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    CreditCardIcon,
    RefreshIcon,
    Clock01Icon,
    CheckmarkCircle02Icon,
    Money03Icon,
    Search01Icon,
    UserIcon,
    ArrowUpDownIcon,
} from "@hugeicons/core-free-icons";
import { useDeletePayment, usePayments } from "@/hooks/use-payments";
import { Payment, PaymentFilters } from "@/core/types/payment";
import { PaymentsTable } from "../organisms/payment/PaymentsTable";
import { PaymentDetailModal } from "../organisms/payment/PaymentDetailModal";
import { PaymentEditModal } from "../organisms/payment/PaymentEditModal";
import { PaymentVerifyModal } from "../organisms/payment/PaymentVerifyModal";
import { Pagination } from "../molecules";

const ITEMS_PER_PAGE = 10;

const DEFAULT_FILTERS: PaymentFilters = {
    page: 1,
    limit: ITEMS_PER_PAGE,
    sort: "createdAt",
    order: "DESC",
    status: "all",
    userId: "",
    amount: "",
};

interface PaymentsManagementTemplateProps {
    initialFilters?: Partial<PaymentFilters>;
}

export function PaymentsManagementTemplate({
    initialFilters,
}: PaymentsManagementTemplateProps) {
    const [filters, setFilters] = useState<PaymentFilters>({
        ...DEFAULT_FILTERS,
        ...initialFilters,
    });
    const [searchText, setSearchText] = useState("");
    const [viewId, setViewId] = useState<string | null>(null);
    const [editPayment, setEditPayment] = useState<Payment | null>(null);
    const [verifyPayment, setVerifyPayment] = useState<Payment | null>(null);

    const { data, isLoading, isFetching, isError, error, refetch } =
        usePayments(filters);
    const deleteMutation = useDeletePayment();

    useEffect(() => {
        if (isError) {
            toast.error(
                error instanceof Error ? error.message : "خطا در دریافت لیست پرداخت‌ها"
            );
        }
    }, [isError, error]);

    const payments = data?.data ?? [];
    const totalCount = data?.totalCount ?? payments.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / filters.limit));

    const filteredPayments = useMemo(() => {
        const q = searchText.trim().toLowerCase();
        if (!q) return payments;

        return payments.filter((item) => {
            const target =
                `${item.id} ${item.userId} ${item.bookingId ?? ""} ${item.description ?? ""} ${item.transactionId ?? ""}`.toLowerCase();
            return target.includes(q);
        });
    }, [payments, searchText]);

    const pendingCount = useMemo(
        () => payments.filter((p) => p.status?.toLowerCase() === "pending").length,
        [payments]
    );

    const completedCount = useMemo(
        () =>
            payments.filter((p) =>
                ["completed", "confirmed", "paid", "success"].includes(
                    p.status?.toLowerCase() || ""
                )
            ).length,
        [payments]
    );

    const pageTotalAmount = useMemo(
        () =>
            payments.reduce((sum, item) => {
                const val = parseFloat(item.amount);
                return sum + (Number.isFinite(val) ? val : 0);
            }, 0),
        [payments]
    );

    const handleFilterChange = (partial: Partial<PaymentFilters>) => {
        setFilters((prev) => ({ ...prev, ...partial }));
    };

    const handleReset = () => {
        setSearchText("");
        setFilters({
            ...DEFAULT_FILTERS,
            ...initialFilters,
        });
    };

    const handlePageChange = (nextPage: number) => {
        handleFilterChange({ page: nextPage });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    const formattedDateHint = useMemo(
        () => formatJalali(new Date(), "d MMMM yyyy", { locale: faIR }),
        []
    );

    return (
        <section dir="rtl" className="w-full space-y-6 p-4 sm:p-6 text-default-text">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-default-text">
                        مدیریت پرداخت‌ها
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-600">
                        مشاهده لیست تراکنش‌ها، فیلتر وضعیت و کاربر، مرتب‌سازی، ویرایش، تایید و حذف پرداخت
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
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
                <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
                    <div>
                        <p className="text-xs text-neutral-800 dark:text-neutral-600">
                            کل تراکنش‌های ثبت‌شده
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-default-text">
                            {new Intl.NumberFormat("fa-IR").format(totalCount)}
                        </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
                        <HugeiconsIcon
                            icon={CreditCardIcon}
                            size={22}
                            color="currentColor"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
                    <div>
                        <p className="text-xs text-neutral-800 dark:text-neutral-600">
                            در انتظار پرداخت (در صفحه جاری)
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-default-text">
                            {new Intl.NumberFormat("fa-IR").format(pendingCount)}
                        </p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400">
                        <HugeiconsIcon
                            icon={Clock01Icon}
                            size={22}
                            color="currentColor"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm">
                    <div>
                        <p className="text-xs text-neutral-800 dark:text-neutral-600">
                            تاییدشده: {new Intl.NumberFormat("fa-IR").format(completedCount)} | جمع صفحه
                        </p>
                        <p className="mt-1 text-lg sm:text-xl font-extrabold text-default-text">
                            {new Intl.NumberFormat("fa-IR").format(pageTotalAmount)}{" "}
                            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-600">
                                تومان
                            </span>
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

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="space-y-4 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-sm"
            >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { key: "all", label: "همه وضعیت‌ها" },
                            { key: "pending", label: "در انتظار پرداخت" },
                            { key: "completed", label: "پرداخت شده" },
                            { key: "failed", label: "ناموفق" },
                        ].map((tab) => {
                            const active = (filters.status || "all") === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() =>
                                        handleFilterChange({ status: tab.key, page: 1 })
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
                            value={filters.sort || "createdAt"}
                            onChange={(e) =>
                                handleFilterChange({ sort: e.target.value, page: 1 })
                            }
                            className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
                        >
                            <option value="createdAt">تاریخ ایجاد</option>
                            <option value="amount">مبلغ</option>
                            <option value="id">شناسه تراکنش</option>
                        </select>

                        <select
                            value={filters.order || "DESC"}
                            onChange={(e) =>
                                handleFilterChange({
                                    order: e.target.value as "ASC" | "DESC",
                                    page: 1,
                                })
                            }
                            className="rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-xs font-semibold text-default-text outline-none focus:border-primary-500 cursor-pointer"
                        >
                            <option value="DESC">نزولی</option>
                            <option value="ASC">صعودی</option>
                        </select>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                            پاک کردن فیلترها
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="relative">
                        <HugeiconsIcon
                            icon={Search01Icon}
                            size={18}
                            color="currentColor"
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
                        />
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="جستجو بر اساس توضیحات، رزرو یا شناسه..."
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <HugeiconsIcon
                            icon={UserIcon}
                            size={18}
                            color="currentColor"
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
                        />
                        <input
                            type="text"
                            inputMode="numeric"
                            value={
                                filters.userId
                                    ? new Intl.NumberFormat("fa-IR", { useGrouping: false }).format(
                                        Number(filters.userId)
                                    )
                                    : ""
                            }
                            onChange={(e) => {
                                const englishValue = e.target.value
                                    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
                                    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
                                    .replace(/[^\d]/g, "");
                                handleFilterChange({ userId: englishValue, page: 1 });
                            }}
                            placeholder="شناسه کاربر"
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <HugeiconsIcon
                            icon={Money03Icon}
                            size={18}
                            color="currentColor"
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
                        />
                        <input
                            type="text"
                            inputMode="numeric"
                            value={
                                filters.amount
                                    ? new Intl.NumberFormat("fa-IR").format(Number(filters.amount))
                                    : ""
                            }
                            onChange={(e) => {
                                const englishValue = e.target.value
                                    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
                                    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
                                    .replace(/[^\d]/g, "");
                                handleFilterChange({ amount: englishValue, page: 1 });
                            }}
                            placeholder="فیلتر مبلغ "
                            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>
                </div>
            </motion.div>

            {isLoading && !data ? (
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
                    <p className="text-sm font-bold">خطا در دریافت لیست پرداخت‌ها</p>
                    <p className="mt-1 text-xs">{error?.message}</p>
                </div>
            ) : (
                <motion.div
                    key={`${filters.page}-${filters.status}-${filters.order}-${filters.sort}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                >
                    <PaymentsTable
                        payments={filteredPayments}
                        isLoading={isLoading}
                        onView={setViewId}
                        onEdit={setEditPayment}
                        onVerify={setVerifyPayment}
                        onDelete={handleDelete}
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
                                ({new Intl.NumberFormat("fa-IR").format(totalCount)} تراکنش ·{" "}
                                {formattedDateHint})
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
                </motion.div>
            )}

            <PaymentDetailModal paymentId={viewId} onClose={() => setViewId(null)} />

            {editPayment && (
                <PaymentEditModal
                    key={editPayment.id}
                    payment={editPayment}
                    onClose={() => setEditPayment(null)}
                />
            )}

            {verifyPayment && (
                <PaymentVerifyModal
                    key={verifyPayment.id}
                    payment={verifyPayment}
                    onClose={() => setVerifyPayment(null)}
                />
            )}
        </section>
    );
}