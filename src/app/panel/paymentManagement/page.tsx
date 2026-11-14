"use client";

import { Invoice01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import Badge from "@/components/atoms/badge/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import useFakeLoading from "@/hooks/useFakeLoading";

type PaymentStatus = "success" | "failed";
type TransactionType = "deposit" | "withdraw";

interface IPayment {
  id: number;
  date: string;
  trackingCode: string;
  amount: string;
  status: PaymentStatus;
  type: TransactionType;
}

const payments: IPayment[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  date: "12 مرداد 1401 - 12:33",
  trackingCode: "123456789123456",
  amount: "2,000,000",
  status: i % 3 === 1 ? "failed" : "success",
  type: i % 2 === 0 ? "deposit" : "withdraw",
}));

const statusOptions = [
  { value: "all", label: "همه وضعیت ها" },
  { value: "success", label: "تایید شده" },
  { value: "failed", label: "تایید نشده" },
];

const typeOptions = [
  { value: "all", label: "همه تراکنش ها" },
  { value: "deposit", label: "واریز" },
  { value: "withdraw", label: "برداشت" },
];

const perPageOptions = [
  { value: "12", label: "12 در هر صفحه" },
  { value: "8", label: "8 در هر صفحه" },
  { value: "18", label: "18 در هر صفحه" },
];

const typeLabels: Record<TransactionType, string> = {
  deposit: "واریز",
  withdraw: "برداشت",
};

const thClass =
  "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base";
const tdClass =
  "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base";
const selectTriggerClass =
  "w-full bg-default-white-bg rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto! sm:w-48";

const BuyerPaymentsPage = () => {
  const [whichPage, setWhichPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const isTableLoading = useFakeLoading(whichPage);

  const filteredPayments = useMemo(
    () =>
      payments.filter(
        (p) =>
          (statusFilter === "all" || p.status === statusFilter) &&
          (typeFilter === "all" || p.type === typeFilter),
      ),
    [statusFilter, typeFilter],
  );

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-lg font-bold text-default-text sm:text-[20px]">
          لیست تراکنش های شما
        </p>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:gap-4">
          <SelectComponent
            items={statusOptions}
            placeHolder={"وضعیت پرداخت"}
            onChange={(value: string | null) =>
              value ? setStatusFilter(value) : setStatusFilter("all")
            }
            triggerClassName={selectTriggerClass}
          />
          <SelectComponent
            items={typeOptions}
            placeHolder={"نوع تراکنش"}
            onChange={(value: string | null) =>
              value ? setTypeFilter(value) : setTypeFilter("all")
            }
            triggerClassName={selectTriggerClass}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
        <div className="max-h-130 overflow-x-auto overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-225 text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-default-white-bg">
              <tr className="text-right">
                <th className={thClass}>تاریخ</th>
                <th className={thClass}>شماره پیگیری</th>
                <th className={thClass}>مبلغ</th>
                <th className={thClass}>وضعیت پرداخت</th>
                <th className={thClass}>نوع تراکنش</th>
                <th className={`${thClass} text-left`}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isTableLoading ? (
                Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="border-t border-neutral-300">
                    <td className="py-3 pr-2">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-36" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-7 w-20 rounded-[8px]" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="py-3 pl-3">
                      <Skeleton className="mr-auto size-5 rounded" />
                    </td>
                  </tr>
                ))
              ) : filteredPayments.length === 0 ? (
                <tr className="border-t border-neutral-300">
                  <td
                    colSpan={6}
                    className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                  >
                    تراکنشی یافت نشد
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                  >
                    <td className={`${tdClass} pr-2`}>{payment.date}</td>
                    <td className={tdClass}>{payment.trackingCode}</td>
                    <td className={tdClass}>
                      {payment.amount} <span className="mr-1">تومان</span>
                    </td>
                    <td className="py-3">
                      <Badge
                        text={
                          payment.status === "success"
                            ? "تایید شده"
                            : "تایید نشده"
                        }
                        type={
                          payment.status === "success" ? "success" : "error"
                        }
                      />
                    </td>
                    <td className={tdClass}>{typeLabels[payment.type]}</td>
                    <td className="py-3 pl-3">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          aria-label="مشاهده فاکتور"
                          className="cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={Invoice01Icon}
                            className="size-5 text-default-black sm:size-6"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 sm:mx-0">
            <Pagination
              currentPage={whichPage}
              onPageChange={(event) => setWhichPage(event)}
              totalPages={20}
              siblingCount={0}
              containerClassName="w-fit! bg-transparent! gap-1! sm:gap-2!"
              itemClassName="cursor-pointer! size-7! rounded-full! flex! items-center! justify-center!"
              buttonsClassName="cursor-pointer! rounded-full! flex! items-center! justify-center! p-0 mx-1! sm:mx-2! size-7"
            />
          </div>
          <div className="hidden shrink-0 sm:block">
            <SelectComponent
              items={perPageOptions}
              placeHolder={"تعداد نمایش"}
              onChange={(event) => console.log(event)}
              triggerClassName="bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerPaymentsPage;
