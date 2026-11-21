"use client";

import Badge from "@/components/atoms/badge/Badge";
import Button from "@/components/atoms/button/Button";
import Modal from "@/components/molecules/modal/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import useModalParams from "@/hooks/useModalParams";
import { Invoice01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PaymentDetail,
  PaymentParams,
} from "@/core/types/panel/buyer/paymentManagement.types";
import { formatPersianDate, formatPrice } from "@/utils/formatters";
import PaymentDetailModal from "../../shared/PaymentDetailModal";
import { getSellerFinanceList } from "@/services/panel/seller/financeManagement.service";

const SellerPaymentsModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { modal, close } = useModalParams();

  const [params] = useState<PaymentParams>({
    page: "1",
    limit: "10000",
    sort: null,
    order: null,
    status: null,
  });

  const reserveId = searchParams.get("reserveId");
  const isOpen = modal === "payments" && !!reserveId;

  const openPaymentDetail = (paymentId: number) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("paymentId", String(paymentId));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["SellerReservedDetailPayments", reserveId, params],
    queryFn: () => getSellerFinanceList(params),
    enabled: isOpen,
  });

  const paymentList: PaymentDetail[] = (data?.payments ?? []).filter(
    (item: PaymentDetail) => String(item.bookingId) === reserveId,
  );

  const isEmpty = !isPending && !isError && paymentList.length === 0;

  return (
    <>
      <Modal
        title="لیست پرداختی ها"
        contentClassName="sm:max-w-3xl"
        open={isOpen}
        onOpenChange={(open) => !open && close()}
      >
        {isError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[16px] border border-neutral-300 px-4 py-8 text-center">
            <p className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
              دریافت لیست پرداختی ها با خطا مواجه شد
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="cursor-pointer rounded-[12px] px-4 py-2 text-sm font-normal text-default-text"
            >
              تلاش مجدد
            </Button>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[16px] border border-neutral-300 px-4 py-8 text-center">
            <p className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
              پرداختی برای این رزرو یافت نشد
            </p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-auto rounded-[16px] border border-neutral-300 scrollbar-hide sm:max-h-96">
            <table className="w-full min-w-175">
              <thead className="sticky top-0 bg-default-white-bg">
                <tr className="text-right">
                  <th
                    className={
                      "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                    }
                  >
                    تاریخ
                  </th>
                  <th
                    className={
                      "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                    }
                  >
                    شماره پیگیری
                  </th>
                  <th
                    className={
                      "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                    }
                  >
                    مبلغ
                  </th>
                  <th
                    className={
                      "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                    }
                  >
                    وضعیت
                  </th>
                  <th
                    className={
                      "p-3 text-sm font-bold text-default-text whitespace-nowrap text-left"
                    }
                  >
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody>
                {isPending
                  ? Array.from({ length: 4 }, (_, i) => (
                      <tr key={i} className="border-t border-neutral-300">
                        <td className="p-3">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="p-3">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="p-3">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="p-3">
                          <Skeleton className="h-7 w-24 rounded-[8px]" />
                        </td>
                        <td className="p-3">
                          <Skeleton className="mr-auto size-5 rounded" />
                        </td>
                      </tr>
                    ))
                  : paymentList.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                      >
                        <td
                          className={
                            "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                          }
                        >
                          {formatPersianDate(payment.createdAt)}
                        </td>
                        <td
                          className={
                            "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                          }
                        >
                          {payment.transactionId || "-"}
                        </td>
                        <td
                          className={
                            "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                          }
                        >
                          {formatPrice(payment.amount)}
                          <span className="mr-1">تومان</span>
                        </td>
                        <td className="p-3">
                          <Badge
                            text={
                              payment.status === "pending"
                                ? "پرداخت نشده"
                                : "پرداخت شده"
                            }
                            type={
                              payment.status === "pending"
                                ? "pending"
                                : "confirmed"
                            }
                          />
                        </td>
                        <td
                          className={`p-3 text-sm font-normal text-default-text whitespace-nowrap text-left`}
                        >
                          <button
                            type="button"
                            aria-label="مشاهده فاکتور"
                            className="cursor-pointer"
                            onClick={() =>
                              openPaymentDetail(Number(payment.id))
                            }
                          >
                            <HugeiconsIcon
                              icon={Invoice01Icon}
                              className="size-5"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
      <PaymentDetailModal />
    </>
  );
};

export default SellerPaymentsModal;
