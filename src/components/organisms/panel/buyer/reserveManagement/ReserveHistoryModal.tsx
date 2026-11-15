"use client";

import Modal from "@/components/molecules/modal/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import useModalParams from "@/hooks/useModalParams";
import { ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getBuyerReservedId } from "@/services/panel/buyer/reserveManagement.service";
import { useQuery } from "@tanstack/react-query";
import { formatPersianDate } from "@/utils/formatters";
import { formatDateTime } from "@/utils/date";
import Button from "@/components/atoms/button/Button";

const ReserveHistoryModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { modal, close } = useModalParams();

  const detailId = searchParams.get("detailId");
  const isOpen = modal === "history" && !!detailId;

  const {
    data: history,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: [`ReserveDetail-${detailId}`],
    queryFn: () => detailId && getBuyerReservedId(detailId),
    enabled: !!detailId && !!isOpen,
  });

  const isEmpty = !isPending && !isError && !history.booking;

  const openPassengers = (historyId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("historyId", String(historyId));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Modal
      title="لیست رزرو ها"
      contentClassName="sm:max-w-4xl"
      open={isOpen}
      onOpenChange={(open) => !open && close()}
    >
      {isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[16px] border border-neutral-300 px-4 py-8 text-center">
          <p className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
            دریافت لیست رزرو ها با خطا مواجه شد
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
            سابقه رزروی یافت نشد
          </p>
        </div>
      ) : (
        <div
          className={
            "max-h-[60vh] overflow-auto rounded-[16px] border border-neutral-300 scrollbar-hide sm:max-h-96"
          }
        >
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
                <th
                  className={
                    "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                  }
                >
                  اطلاعات مسافر ها
                </th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
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
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr
                  className={
                    "border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                  }
                >
                  <td
                    className={
                      "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                    }
                  >
                    {formatPersianDate(history.booking.reservedDates?.[0])}
                    <span className="mx-1">تا</span>
                    {formatPersianDate(history.booking.reservedDates?.[1])}
                  </td>
                  <td
                    className={
                      "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                    }
                  >
                    {formatDateTime(history.booking.createdAt)}
                  </td>
                  <td
                    className={
                      "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                    }
                  >
                    {formatDateTime(history.booking.updatedAt)}
                  </td>
                  <td
                    className={
                      "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                    }
                  >
                    <button
                      type="button"
                      onClick={() => openPassengers(history.booking.id)}
                      className="flex cursor-pointer items-center gap-1"
                    >
                      <HugeiconsIcon icon={ViewIcon} className="size-4" />
                      مشاهده
                      <span className="text-xs text-neutral-dark-300 dark:text-neutral-400">
                        (
                        {(
                          history.booking.traveler_details?.length ?? 0
                        ).toLocaleString("fa-IR")}
                        )
                      </span>
                    </button>
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

export default ReserveHistoryModal;
