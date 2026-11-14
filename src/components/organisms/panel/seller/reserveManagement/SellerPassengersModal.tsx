"use client";

import Modal from "@/components/molecules/modal/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Message01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import useModalParams from "@/hooks/useModalParams";
import useFakeLoading from "@/hooks/useFakeLoading";

interface ISellerPassenger {
  id: number;
  name: string;
  gender: string;
  phone: string;
}

const sellerPassengers: ISellerPassenger[] = [
  { id: 1, name: "آقای فلان فلانی", gender: "مرد", phone: "09121234567" },
  { id: 2, name: "خانم فلان فلان پور", gender: "زن", phone: "09121234567" },
  { id: 3, name: "آقای فلان فلانی", gender: "مرد", phone: "09121234567" },
  { id: 4, name: "آقای فلان فلانی", gender: "مرد", phone: "09121234567" },
  { id: 5, name: "آقای فلان فلانی", gender: "مرد", phone: "09121234567" },
];

const thClass = "p-3 text-sm font-bold text-default-text whitespace-nowrap";
const tdClass = "p-3 text-sm font-normal text-default-text whitespace-nowrap";

const SellerPassengersModal = () => {
  const { modal, close } = useModalParams();
  const isOpen = modal === "passengers";
  const isLoading = useFakeLoading(isOpen);

  return (
    <Modal
      title="جزئیات مسافر ها"
      contentClassName="sm:max-w-3xl"
      open={isOpen}
      onOpenChange={(open) => !open && close()}
    >
      <div className="max-h-[60vh] overflow-auto rounded-[16px] border border-neutral-300 scrollbar-hide sm:max-h-96">
        <table className="w-full min-w-150">
          <thead className="sticky top-0 bg-default-white-bg">
            <tr className="text-right">
              <th className={thClass}>نام</th>
              <th className={thClass}>جنسیت</th>
              <th className={thClass}>شماره تماس</th>
              <th className={`${thClass} text-left`}>ارسال پیام</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="border-t border-neutral-300">
                    <td className="p-3">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-3">
                      <Skeleton className="mr-auto size-5 rounded-full" />
                    </td>
                  </tr>
                ))
              : sellerPassengers.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                  >
                    <td className={tdClass}>{p.name}</td>
                    <td className={tdClass}>{p.gender}</td>
                    <td className={tdClass} dir="ltr">
                      <span className="block text-right">{p.phone}</span>
                    </td>
                    <td className={`${tdClass} text-left pl-6`}>
                      <button
                        type="button"
                        aria-label={`ارسال پیام به ${p.name}`}
                        className="inline-flex cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={Message01Icon}
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

export default SellerPassengersModal;
