"use client";

import {
  ArrowLeft01Icon,
  Building03Icon,
  CheckmarkCircle02Icon,
  HourglassIcon,
  Invoice01Icon,
  Task01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { getCookie } from "@/utils/getCookie";
import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import Badge from "@/components/atoms/badge/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FinanceParams,
  FinanceStatus,
  IFinanceList,
} from "@/core/types/panel/seller/financeManagement.types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  acceptAPayment,
  getSellerFinanceList,
} from "@/services/panel/seller/financeManagement.service";
import { formatPersianDate, formatPrice } from "@/utils/formatters";
import PaymentDetailModal from "@/components/organisms/panel/shared/PaymentDetailModal";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface IStat {
  key: string;
  label: string;
  amount: string;
  icon: typeof Building03Icon;
}

const stats: IStat[] = [
  {
    key: "current-month",
    label: "درآمد ماه جاری",
    amount: "20,000,000",
    icon: Building03Icon,
  },
  {
    key: "last-month",
    label: "درآمد ماه قبل",
    amount: "300,000,000",
    icon: Task01Icon,
  },
  {
    key: "total",
    label: "درآمد کل",
    amount: "220,000,000",
    icon: HourglassIcon,
  },
  {
    key: "withdrawable",
    label: "قابل برداشت",
    amount: "10,000,000",
    icon: ViewIcon,
  },
];

const statusOptions = [
  { value: "all", label: "همه وضعیت ها" },
  { value: "completed", label: "تایید شده" },
  { value: "pending", label: "در انتظار" },
  { value: "failed", label: "ناموفق" },
  { value: "refunded", label: "بازگشت وجه" },
];

const perPageOptions = [
  { value: "8", label: "8 در هر صفحه" },
  { value: "12", label: "12 در هر صفحه" },
  { value: "18", label: "18 در هر صفحه" },
];

const SellerFinancialManagementPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [params, setParams] = useState<FinanceParams>({
    page: "1",
    limit: "8",
    sort: null,
    order: null,
    status: null,
  });

  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setUserId(getCookie("userId"));
  }, []);

  const { data, isPending: isFetching } = useQuery<IFinanceList>({
    queryKey: ["SellerFinanceList", params.status],
    queryFn: () =>
      getSellerFinanceList({ ...params, page: "1", limit: "1000" }),
    placeholderData: keepPreviousData,
  });

  const isPending = isFetching || userId === undefined;

  const sellerPayments = useMemo(
    () =>
      (data?.payments ?? []).filter(
        (payment) => String(payment.booking.house.sellerId) === userId,
      ),
    [data, userId],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sellerPayments.length / Number(params.limit)),
  );

  const paginatedPayments = useMemo(() => {
    const start = (Number(params.page) - 1) * Number(params.limit);
    return sellerPayments.slice(start, start + Number(params.limit));
  }, [sellerPayments, params.page, params.limit]);

  const { mutate: verifyPayment, isPending: verifyPending } = useMutation({
    mutationKey: [`DeleteReserve`],
    mutationFn: (id: string) => acceptAPayment(id),
    onMutate: () => {
      toast.loading("درحال تایید پرداخت", { toastId: "VerifyingPayment" });
    },
    onSuccess: () => {
      toast.update("VerifyingPayment", {
        render: "پرداخت مورد نظر با موفقیت تایید شد",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["SellerFinanceList", params],
      });
    },
    onError: () => {
      toast.update("VerifyingPayment", {
        render: "تایید پرداخت مورد نظر با خطا روبرو شد",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  return (
    <>
      <div className="flex h-full flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="flex items-center justify-between gap-3 rounded-[16px] bg-default-white-bg p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-primary-50 text-primary-500 dark:bg-neutral-200">
                  <HugeiconsIcon icon={stat.icon} className="size-6" />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="truncate text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
                    {stat.label}
                  </p>
                  <p className="whitespace-nowrap text-default-text">
                    <span className="text-base font-bold sm:text-lg">
                      {stat.amount}
                    </span>{" "}
                    <span className="text-xs font-normal">تومان</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label={stat.label}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-default-text"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-lg font-bold text-default-text sm:text-[20px]">
                لیست تراکنش های مشتریان ({sellerPayments.length})
              </p>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:gap-4">
                <SelectComponent
                  items={statusOptions}
                  placeHolder={"وضعیت پرداخت"}
                  onChange={(value: string | null) =>
                    setParams({
                      ...params,
                      page: "1",
                      status:
                        value && value !== "all"
                          ? (value as FinanceStatus)
                          : null,
                    })
                  }
                  triggerClassName={
                    "w-full bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto! sm:w-48"
                  }
                />
              </div>
            </div>

            <div className="max-h-110 overflow-x-auto overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-225 text-xs sm:text-sm">
                <thead className="sticky top-0 z-10 bg-default-white-bg">
                  <tr className="text-right">
                    <th
                      className={
                        "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                      }
                    >
                      تاریخ
                    </th>
                    <th
                      className={
                        "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                      }
                    >
                      شماره پیگیری
                    </th>
                    <th
                      className={
                        "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                      }
                    >
                      مبلغ
                    </th>
                    <th
                      className={
                        "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                      }
                    >
                      وضعیت پرداخت
                    </th>
                    <th
                      className={
                        "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                      }
                    >
                      اقامتگاه
                    </th>
                    <th
                      className={`py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base text-left`}
                    >
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isPending ? (
                    Array.from({ length: 8 }, (_, i) => (
                      <tr key={i} className="border-t border-neutral-300">
                        <td className="py-3 pr-2">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="py-3">
                          <Skeleton className="h-4 w-36" />
                        </td>
                        <td className="py-3">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="py-3">
                          <Skeleton className="h-7 w-20 rounded-[8px]" />
                        </td>
                        <td className="py-3">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="py-3 pl-3">
                          <Skeleton className="mr-auto size-5 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : paginatedPayments.length === 0 ? (
                    <tr className="border-t border-neutral-300">
                      <td
                        colSpan={6}
                        className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                      >
                        تراکنشی یافت نشد
                      </td>
                    </tr>
                  ) : (
                    paginatedPayments.map((payment) => {
                      const statusLabel =
                        payment.status === "completed"
                          ? "تایید شده"
                          : payment.status === "failed"
                            ? "ناموفق"
                            : payment.status === "refunded"
                              ? "بازگشت وجه"
                              : "در انتظار";
                      const badgeType =
                        payment.status === "completed"
                          ? "confirmed"
                          : payment.status === "failed" ||
                              payment.status === "refunded"
                            ? "canceled"
                            : "pending";

                      return (
                        <tr
                          key={payment.id}
                          className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                        >
                          <td
                            className={`py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base pr-2`}
                          >
                            {formatPersianDate(
                              payment.createdAt ?? payment.booking.createdAt,
                            )}
                          </td>
                          <td
                            className={
                              "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base"
                            }
                          >
                            {payment.transactionId ?? "-"}
                          </td>
                          <td
                            className={
                              "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base"
                            }
                          >
                            {formatPrice(Number(payment.amount))}
                            <span className="mr-1">تومان</span>
                          </td>
                          <td className="py-3">
                            <Badge text={statusLabel} type={badgeType} />
                          </td>
                          <td
                            className={
                              "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base"
                            }
                          >
                            {payment.booking.house.title}
                          </td>
                          <td className="py-3 pl-3">
                            <div className="flex items-center justify-end gap-2">
                              {payment.status === "pending" ? (
                                <button
                                  type="button"
                                  aria-label="تایید پرداخت"
                                  disabled={verifyPending}
                                  className="cursor-pointer disabled:opacity-60 disabled:cursor-auto"
                                  onClick={() =>
                                    verifyPayment(String(payment.id))
                                  }
                                >
                                  <HugeiconsIcon
                                    icon={CheckmarkCircle02Icon}
                                    className="size-5 text-default-black sm:size-6"
                                  />
                                </button>
                              ) : null}
                              <button
                                type="button"
                                aria-label="مشاهده فاکتور"
                                className="cursor-pointer"
                              >
                                <HugeiconsIcon
                                  icon={Invoice01Icon}
                                  onClick={() => {
                                    const next = new URLSearchParams(
                                      window.location.search,
                                    );
                                    next.set("paymentId", String(payment.id));
                                    router.replace(
                                      `${pathname}?${next.toString()}`,
                                      {
                                        scroll: false,
                                      },
                                    );
                                  }}
                                  className="size-5 text-default-black sm:size-6"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 sm:mx-0">
              <Pagination
                currentPage={Number(params.page)}
                onPageChange={(event) =>
                  setParams({ ...params, page: String(event) })
                }
                totalPages={totalPages}
                siblingCount={0}
                containerClassName="w-fit! bg-transparent! gap-1! sm:gap-2!"
                itemClassName="cursor-pointer! size-7! rounded-full! flex! items-center! justify-center!"
                buttonsClassName="cursor-pointer! rounded-full! flex! items-center! justify-center! p-0 mx-1! sm:mx-2! size-7"
              />
            </div>
            <div className="hidden shrink-0 sm:block">
              <SelectComponent
                items={perPageOptions}
                placeHolder={"تعداد نمایش"}
                onChange={(event) =>
                  setParams({ ...params, page: "1", limit: event ?? "8" })
                }
                triggerClassName="bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto!"
              />
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <PaymentDetailModal />
      </Suspense>
    </>
  );
};

export default SellerFinancialManagementPage;
