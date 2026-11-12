"use client";

import Modal from "@/components/molecules/modal/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import useModalParams from "@/hooks/useModalParams";
import useFakeLoading from "@/hooks/useFakeLoading";

const history = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  date: "12 مرداد 1401 - 12:33",
}));

const thClass = "p-3 text-sm font-bold text-default-text whitespace-nowrap";
const tdClass = "p-3 text-sm font-normal text-default-text whitespace-nowrap";

const ReserveHistoryModal = () => {
  const { modal, open, close } = useModalParams();
  const isOpen = modal === "history";
  const isLoading = useFakeLoading(isOpen);

  return (
    <Modal
      title="لیست رزرو ها"
      contentClassName="sm:max-w-xl"
      open={isOpen}
      onOpenChange={(o) => !o && close()}
    >
      <div className="max-h-[60vh] overflow-auto rounded-[16px] border border-neutral-300 scrollbar-hide sm:max-h-96">
        <table className="w-full">
          <thead className="sticky top-0 bg-default-white-bg">
            <tr className="text-right">
              <th className={thClass}>تاریخ و ساعت</th>
              <th className={thClass}>اطلاعات مسافر ها</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 3 }, (_, i) => (
                  <tr key={i} className="border-t border-neutral-300">
                    <td className="p-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  </tr>
                ))
              : history.map((h) => (
                  <tr
                    key={h.id}
                    className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                  >
                    <td className={tdClass}>{h.date}</td>
                    <td className={tdClass}>
                      <button
                        type="button"
                        onClick={() => open("passengers")}
                        className="flex cursor-pointer items-center gap-1"
                      >
                        <HugeiconsIcon icon={ViewIcon} className="size-4" />
                        مشاهده
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

export default ReserveHistoryModal;
