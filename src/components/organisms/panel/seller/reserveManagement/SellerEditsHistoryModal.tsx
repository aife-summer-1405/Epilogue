"use client";

import Modal from "@/components/molecules/modal/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import useModalParams from "@/hooks/useModalParams";
import useFakeLoading from "@/hooks/useFakeLoading";

interface ISellerEdit {
  id: number;
  date: string;
  type: string;
}

const sellerEdits: ISellerEdit[] = [
  { id: 1, date: "12 مرداد 1401 - 12:33", type: "تاریخ رزرو" },
  { id: 2, date: "12 مرداد 1401 - 12:33", type: "اسامی مسافران" },
  { id: 3, date: "12 مرداد 1401 - 12:33", type: "تاریخ رزرو" },
];

const thClass = "p-3 text-sm font-bold text-default-text whitespace-nowrap";
const tdClass = "p-3 text-sm font-normal text-default-text whitespace-nowrap";

const SellerEditsHistoryModal = () => {
  const { modal, close } = useModalParams();
  const isOpen = modal === "edits";
  const isLoading = useFakeLoading(isOpen);

  return (
    <Modal
      title="تاریخچه تغییرات"
      contentClassName="sm:max-w-xl"
      open={isOpen}
      onOpenChange={(open) => !open && close()}
    >
      <div className="max-h-[60vh] overflow-auto rounded-[16px] border border-neutral-300 scrollbar-hide sm:max-h-96">
        <table className="w-full">
          <thead className="sticky top-0 bg-default-white-bg">
            <tr className="text-right">
              <th className={thClass}>تاریخ و ساعت</th>
              <th className={thClass}>نوع تغییر</th>
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
                      <Skeleton className="h-4 w-24" />
                    </td>
                  </tr>
                ))
              : sellerEdits.map((e) => (
                  <tr
                    key={e.id}
                    className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                  >
                    <td className={tdClass}>{e.date}</td>
                    <td className={tdClass}>{e.type}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default SellerEditsHistoryModal;
