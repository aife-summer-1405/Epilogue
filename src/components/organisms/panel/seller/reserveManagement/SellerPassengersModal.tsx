"use client";

import Button from "@/components/atoms/button/Button";
import Modal from "@/components/molecules/modal/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import useModalParams from "@/hooks/useModalParams";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBuyerReservedId } from "@/services/panel/buyer/reserveManagement.service";
import { TravelersDetails } from "@/core/types/panel/buyer/reserveManagement.types";

const SellerPassengersModal = () => {
  const searchParams = useSearchParams();
  const { modal, close } = useModalParams();

  const reserveId = searchParams.get("reserveId");
  const isOpen = modal === "passengers" && !!reserveId;

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["SellerReserveDetail", reserveId],
    queryFn: () => getBuyerReservedId(reserveId as string),
    enabled: isOpen,
  });

  const travelers: TravelersDetails[] = data?.booking?.traveler_details ?? [];
  const isEmpty = !isPending && !isError && travelers.length === 0;

  return (
    <Modal
      title="جزئیات مسافر ها"
      contentClassName="sm:max-w-3xl"
      open={isOpen}
      onOpenChange={(open) => !open && close()}
    >
      {isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[16px] border border-neutral-300 px-4 py-8 text-center">
          <p className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
            دریافت لیست مسافر ها با خطا مواجه شد
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
            مسافری برای این رزرو ثبت نشده است
          </p>
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-auto rounded-[16px] border border-neutral-300 scrollbar-hide sm:max-h-96">
          <table className="w-full min-w-150">
            <thead className="sticky top-0 bg-default-white-bg">
              <tr className="text-right">
                <th
                  className={
                    "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                  }
                >
                  نام
                </th>
                <th
                  className={
                    "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                  }
                >
                  کد ملی
                </th>
                <th
                  className={
                    "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                  }
                >
                  جنسیت
                </th>
                <th
                  className={
                    "p-3 text-sm font-bold text-default-text whitespace-nowrap"
                  }
                >
                  تاریخ تولد
                </th>
              </tr>
            </thead>
            <tbody>
              {isPending
                ? Array.from({ length: 3 }, (_, i) => (
                    <tr key={i} className="border-t border-neutral-300">
                      <td className="p-3">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="p-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="p-3">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="p-3">
                        <Skeleton className="h-4 w-32" />
                      </td>
                    </tr>
                  ))
                : travelers.map((traveler, index) => (
                    <tr
                      key={`${traveler.nationalId}-${index}`}
                      className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                    >
                      <td
                        className={
                          "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                        }
                      >
                        {`${traveler.firstName ?? ""} ${traveler.lastName ?? ""}`.trim() ||
                          "-"}
                      </td>
                      <td
                        className={
                          "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                        }
                      >
                        {traveler.nationalId || "-"}
                      </td>
                      <td
                        className={
                          "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                        }
                      >
                        {!traveler.gender
                          ? "-"
                          : traveler.gender === "male"
                            ? "مرد"
                            : "زن"}
                      </td>
                      <td
                        className={
                          "p-3 text-sm font-normal text-default-text whitespace-nowrap"
                        }
                      >
                        {traveler.birthDate || "-"}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default SellerPassengersModal;
