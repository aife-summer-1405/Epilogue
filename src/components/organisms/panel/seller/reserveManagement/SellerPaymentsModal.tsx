"use client";

import Modal from "@/components/molecules/modal/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Invoice01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import useModalParams from "@/hooks/useModalParams";
import useFakeLoading from "@/hooks/useFakeLoading";

interface ISellerPayment {
  id: number;
  date: string;
  trackingCode: string;
  amount: string;
}

const sellerPayments: ISellerPayment[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  date: "12 مرداد 1401 - 12:33",
  trackingCode: "123456789123456",
  amount: "2,000,000",
}));

const thClass = "p-3 text-sm font-bold text-default-text whitespace-nowrap";
const tdClass = "p-3 text-sm font-normal text-default-text whitespace-nowrap";

const SellerPaymentsModal = () => {
  const { modal, close } = useModalParams();
  const isOpen = modal === "payments";
  const isLoading = useFakeLoading(isOpen);

  return (
    <Modal
      title="لیست پرداختی ها"
      contentClassName="sm:max-w-2xl"
      open={isOpen}
      onOpenChange={(open) => !open && close()}
    >
      <div className="max-h-[60vh] overflow-auto rounded-[16px] border border-neutral-300 scrollbar-hide sm:max-h-96">
        <table className="w-full min-w-125">
          <thead className="sticky top-0 bg-default-white-bg">
            <tr className="text-right">
              <th className={thClass}>تاریخ</th>
              <th className={thClass}>شماره پیگیری</th>
              <th className={thClass}>مبلغ</th>
              <th className={`${thClass} text-left`}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }, (_, i) => (
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
                      <Skeleton className="mr-auto size-5 rounded" />
                    </td>
                  </tr>
                ))
              : sellerPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                  >
                    <td className={tdClass}>{p.date}</td>
                    <td className={tdClass}>{p.trackingCode}</td>
                    <td className={tdClass}>
                      {p.amount} <span className="mr-1">تومان</span>
                    </td>
                    <td className={`${tdClass} text-left`}>
                      <button
                        type="button"
                        aria-label="مشاهده فاکتور"
                        className="cursor-pointer"
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
    </Modal>
  );
};

export default SellerPaymentsModal;
