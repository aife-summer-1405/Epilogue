"use client";

import Modal from "@/components/molecules/modal/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import useModalParams from "@/hooks/useModalParams";
import useFakeLoading from "@/hooks/useFakeLoading";

const passengers = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "آقای فلان فلانی",
  nationalCode: "2151231234",
  gender: "مرد",
  birthDate: "12 مرداد 1401 - 12:33",
}));

const thClass = "p-3 text-sm font-bold text-default-text whitespace-nowrap";
const tdClass = "p-3 text-sm font-normal text-default-text whitespace-nowrap";

const PassengersModal = () => {
  const { modal, close } = useModalParams();
  const isOpen = modal === "passengers";
  const isLoading = useFakeLoading(isOpen);

  return (
    <Modal
      title="لیست مسافر ها"
      contentClassName="sm:max-w-3xl"
      open={isOpen}
      onOpenChange={(open) => !open && close()}
    >
      <div className="max-h-[60vh] overflow-auto rounded-[16px] border border-neutral-300 scrollbar-hide sm:max-h-96">
        <table className="w-full min-w-150">
          <thead className="sticky top-0 bg-default-white-bg">
            <tr className="text-right">
              <th className={thClass}>نام</th>
              <th className={thClass}>کد ملی</th>
              <th className={thClass}>جنسیت</th>
              <th className={thClass}>تاریخ تولد</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }, (_, i) => (
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
              : passengers.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                  >
                    <td className={tdClass}>{p.name}</td>
                    <td className={tdClass}>{p.nationalCode}</td>
                    <td className={tdClass}>{p.gender}</td>
                    <td className={tdClass}>{p.birthDate}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default PassengersModal;
