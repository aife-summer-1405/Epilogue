"use client";

import { Dialog } from "@base-ui/react";
import Modal from "@/components/molecules/modal/Modal";
import Button from "@/components/atoms/button/Button";
import Badge from "@/components/atoms/badge/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatPersianDate, formatPrice } from "@/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import { getBuyerPaymentDetailById } from "@/services/panel/buyer/reserveManagement.service";

const PaymentDetailModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("paymentId");
  const isOpen = !!paymentId;

  const { data: payment, isPending } = useQuery({
    queryKey: ["PaymentDetail", paymentId],
    queryFn: () => getBuyerPaymentDetailById(paymentId as string),
    enabled: isOpen,
  });

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("paymentId");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (open) return;
        closeModal();
      }}
      title="جزئیات پرداخت"
      contentClassName="sm:max-w-lg"
      hasFooter={true}
      footer={
        <div className="flex w-full flex-col-reverse items-center justify-center gap-3 sm:flex-row sm:gap-6">
          <Dialog.Close
            render={
              <Button
                variant="outline"
                className="w-full rounded-[16px] border-neutral-dark-300 py-3 text-base font-normal text-neutral-dark-300 sm:w-48 dark:border-neutral-400 dark:text-neutral-400"
              />
            }
          >
            بستن
          </Dialog.Close>
        </div>
      }
    >
      {isPending ? (
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col items-center gap-3 rounded-[16px] bg-primary-50 px-4 py-6 dark:bg-neutral-200">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-7 w-28 rounded-[8px]" />
          </div>
          <div className="flex flex-col rounded-[16px] border border-neutral-300 px-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 border-b border-neutral-300 py-3 last:border-b-0"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col items-center gap-3 rounded-[16px] bg-primary-50 px-4 py-6 dark:bg-neutral-200">
            <span className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
              مبلغ قابل پرداخت
            </span>
            <p className="text-2xl font-bold text-default-text sm:text-3xl">
              {formatPrice(Number(payment?.amount))}
              <span className="mr-2 text-base font-normal">تومان</span>
            </p>
            <Badge
              text={
                payment?.status === "pending"
                  ? "در انتظار تایید"
                  : "پرداخت تایید شده"
              }
              type={payment?.status === "completed" ? "confirmed" : "pending"}
            />
          </div>
          <div className="flex flex-col rounded-[16px] border border-neutral-300 px-4">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-300 py-3 last:border-b-0">
              <span className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400 sm:text-base">
                شناسه پرداخت
              </span>
              <span className="text-sm font-bold text-default-text sm:text-base">
                {Number(payment?.id).toLocaleString("fa-IR", {
                  useGrouping: false,
                })}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-neutral-300 py-3 last:border-b-0">
              <span className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400 sm:text-base">
                شناسه رزرو
              </span>
              <span className="text-sm font-bold text-default-text sm:text-base">
                {payment?.bookingId != null
                  ? Number(payment.bookingId).toLocaleString("fa-IR", {
                      useGrouping: false,
                    })
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-neutral-300 py-3 last:border-b-0">
              <span className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400 sm:text-base">
                توضیحات
              </span>
              <span className="text-sm font-bold text-default-text sm:text-base">
                {payment?.description || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-neutral-300 py-3 last:border-b-0">
              <span className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400 sm:text-base">
                شناسه تراکنش
              </span>
              <span className="text-sm font-bold text-default-text sm:text-base">
                <span dir="ltr">{payment?.transactionId ?? "—"}</span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-neutral-300 py-3 last:border-b-0">
              <span className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400 sm:text-base">
                تاریخ ایجاد
              </span>
              <span className="text-sm font-bold text-default-text sm:text-base">
                <span dir="ltr">{formatPersianDate(payment?.createdAt)}</span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-neutral-300 py-3 last:border-b-0">
              <span className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400 sm:text-base">
                آخرین بروزرسانی
              </span>
              <span className="text-sm font-bold text-default-text sm:text-base">
                {formatPersianDate(payment?.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PaymentDetailModal;
