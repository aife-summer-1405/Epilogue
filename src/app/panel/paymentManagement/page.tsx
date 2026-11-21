"use client";

import { Invoice01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense, useMemo, useState } from "react";
import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import Badge from "@/components/atoms/badge/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PaymentDetail,
  PaymentParams,
  PaymentStatus,
} from "@/core/types/panel/buyer/paymentManagement.types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBuyerPayments } from "@/services/panel/buyer/reserveManagement.service";
import { formatPrice } from "@/utils/formatters";
import { usePathname, useRouter } from "next/navigation";
import PaymentDetailModal from "@/components/organisms/panel/shared/PaymentDetailModal";

const statusOptions = [
  { value: "all", label: "همه وضعیت ها" },
  { value: "completed", label: "تایید شده" },
  { value: "pending", label: "تایید نشده" },
];

const perPageOptions = [
  { value: "12", label: "12 در هر صفحه" },
  { value: "8", label: "8 در هر صفحه" },
  { value: "18", label: "18 در هر صفحه" },
];

const BuyerPaymentsPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [params, setParams] = useState<PaymentParams>({
    page: "1",
    limit: "8",
    sort: null,
    order: null,
    status: null,
  });

  const {
    data: payments,
    isPending,
    isPlaceholderData,
  } = useQuery({
    queryKey: [`BuyerPaymentManagement`, params],
    queryFn: () => getBuyerPayments(params),
    placeholderData: keepPreviousData,
  });

  const totalPages = useMemo(() => {
    if (!payments) return 1;
    return Math.max(
      1,
      Math.ceil((payments.totalCount || 1) / Number(params.limit)),
    );
  }, [params.limit, payments]);

  return (
    <>
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-lg font-bold text-default-text sm:text-[20px]">
            لیست تراکنش های شما
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
                    value && value !== "all" ? (value as PaymentStatus) : null,
                })
              }
              triggerClassName={
                "w-full bg-default-white-bg rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto! sm:w-48"
              }
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
          <div
            className={`max-h-130 overflow-x-auto overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden transition-opacity duration-200 ${
              isPlaceholderData ? "opacity-60" : "opacity-100"
            }`}
          >
            <table className="w-full min-w-225 text-xs sm:text-sm">
              <thead className="sticky top-0 z-10 bg-default-white-bg">
                <tr className="text-right">
                  <th className="py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base">
                    شماره پیگیری
                  </th>
                  <th className="py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base">
                    مبلغ
                  </th>
                  <th className="py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base">
                    وضعیت پرداخت
                  </th>
                  <th className="py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base text-left">
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
                        <Skeleton className="h-7 w-20 rounded-[8px]" />
                      </td>
                      <td className="py-3 pl-3">
                        <Skeleton className="mr-auto size-5 rounded" />
                      </td>
                    </tr>
                  ))
                ) : payments?.payments.length === 0 ? (
                  <tr className="border-t border-neutral-300">
                    <td
                      colSpan={4}
                      className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                    >
                      تراکنشی یافت نشد
                    </td>
                  </tr>
                ) : (
                  payments?.payments.map((payment: PaymentDetail) => (
                    <tr
                      key={payment.id}
                      className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                    >
                      <td className="py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base">
                        {payment.transactionId || "-"}
                      </td>
                      <td className="py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base">
                        {formatPrice(Number(payment.amount))}{" "}
                        <span className="mr-1">تومان</span>
                      </td>
                      <td className="py-3">
                        <Badge
                          text={
                            payment.status === "completed"
                              ? "تایید شده"
                              : "تایید نشده"
                          }
                          type={
                            payment.status === "completed"
                              ? "confirmed"
                              : "canceled"
                          }
                        />
                      </td>
                      <td className="py-3 pl-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            aria-label="مشاهده فاکتور"
                            className="cursor-pointer"
                            onClick={() => {
                              const next = new URLSearchParams(
                                window.location.search,
                              );
                              next.set("paymentId", String(payment.id));
                              router.replace(`${pathname}?${next.toString()}`, {
                                scroll: false,
                              });
                            }}
                          >
                            <HugeiconsIcon
                              icon={Invoice01Icon}
                              className="size-5 text-default-black sm:size-6"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
                  setParams({
                    ...params,
                    page: "1",
                    limit: event ? event : "8",
                  })
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

export default BuyerPaymentsPage;
