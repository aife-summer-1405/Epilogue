"use client";

import Button from "@/components/atoms/button/Button";
import Modal from "@/components/molecules/modal/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import useModalParams from "@/hooks/useModalParams";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBuyerReservedId } from "@/services/panel/buyer/reserveManagement.service";
import { formatPersianDate } from "@/utils/formatters";
import { formatDateTime } from "@/utils/date";

const SellerEditsHistoryModal = () => {
  const searchParams = useSearchParams();
  const { modal, close } = useModalParams();

  const reserveId = searchParams.get("reserveId");
  const isOpen = modal === "edits" && !!reserveId;

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["SellerReserveDetail", reserveId],
    queryFn: () => getBuyerReservedId(reserveId as string),
    enabled: isOpen,
  });

  const booking = data?.booking;
  const isEmpty = !isPending && !isError && !booking;

  return (
    <Modal
      title="تاریخچه تغییرات"
      contentClassName="sm:max-w-4xl"
      open={isOpen}
      onOpenChange={(open) => !open && close()}
    >
      {isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[16px] border border-neutral-300 px-4 py-8 text-center">
          <p className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
            دریافت تاریخچه تغییرات با خطا مواجه شد
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
            تغییری برای این رزرو ثبت نشده است
          </p>
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-auto rounded-[16px] border border-neutral-300 scrollbar-hide sm:max-h-96">
          <table className="w-full min-w-137.5">
            <thead className="sticky top-0 bg-default-white-bg">
              <tr className="text-right">
                <th
                  className={
                    "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                  }
                >
                  بازه رزرو
                </th>
                <th
                  className={
                    "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                  }
                >
                  تاریخ و ساعت ثبت
                </th>
                <th
                  className={
                    "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                  }
                >
                  تاریخ و ساعت آخرین تغییرات
                </th>
              </tr>
            </thead>
            <tbody>
              {isPending || !booking ? (
                Array.from({ length: 3 }, (_, i) => (
                  <tr key={i} className="border-t border-neutral-300">
                    <td className="p-3">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200">
                  <td
                    className={
                      "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                    }
                  >
                    {formatPersianDate(booking.reservedDates?.[0])}
                    <span className="mx-1">تا</span>
                    {formatPersianDate(booking.reservedDates?.[1])}
                  </td>
                  <td
                    className={
                      "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                    }
                  >
                    {formatDateTime(booking.createdAt)}
                  </td>
                  <td
                    className={
                      "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                    }
                  >
                    {formatDateTime(booking.updatedAt)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default SellerEditsHistoryModal;
