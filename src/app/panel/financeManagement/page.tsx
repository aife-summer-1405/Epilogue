"use client";

import {
  ArrowLeft01Icon,
  Building03Icon,
  HourglassIcon,
  Invoice01Icon,
  Task01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import Badge from "@/components/atoms/badge/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import useFakeLoading from "@/hooks/useFakeLoading";

type PaymentStatus = "success" | "failed";
type TransactionType = "reserve" | "wallet";

interface ITransaction {
  id: number;
  date: string;
  trackingCode: string;
  amount: string;
  status: PaymentStatus;
  type: TransactionType;
}

interface IStat {
  key: string;
  label: string;
  amount: string;
  icon: typeof Building03Icon;
}

const stats: IStat[] = [
  {
    key: "current-month",
    label: "درآمد ماه جاری",
    amount: "20,000,000",
    icon: Building03Icon,
  },
  {
    key: "last-month",
    label: "درآمد ماه قبل",
    amount: "300,000,000",
    icon: Task01Icon,
  },
  {
    key: "total",
    label: "درآمد کل",
    amount: "220,000,000",
    icon: HourglassIcon,
  },
  {
    key: "withdrawable",
    label: "قابل برداشت",
    amount: "10,000,000",
    icon: ViewIcon,
  },
];

const transactions: ITransaction[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  date: "12 مرداد 1401 - 12:33",
  trackingCode: "123456789123456",
  amount: "2,000,000",
  status: i % 2 === 0 ? "success" : "failed",
  type: i % 2 === 0 ? "reserve" : "wallet",
}));

const statusOptions = [
  { value: "all", label: "همه وضعیت ها" },
  { value: "success", label: "تایید شده" },
  { value: "failed", label: "تایید نشده" },
];

const typeOptions = [
  { value: "all", label: "همه تراکنش ها" },
  { value: "reserve", label: "رزرو" },
  { value: "wallet", label: "پرداخت کیف پول" },
];

const perPageOptions = [
  { value: "8", label: "8 در هر صفحه" },
  { value: "12", label: "12 در هر صفحه" },
  { value: "18", label: "18 در هر صفحه" },
];

const typeLabels: Record<TransactionType, string> = {
  reserve: "رزرو",
  wallet: "پرداخت کیف پول",
};

const thClass =
  "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base";
const tdClass =
  "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base";
const selectTriggerClass =
  "w-full bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto! sm:w-48";

const SellerFinancialManagementPage = () => {
  const [whichPage, setWhichPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(8);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const isTableLoading = useFakeLoading(whichPage);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (statusFilter === "all" || t.status === statusFilter) &&
          (typeFilter === "all" || t.type === typeFilter),
      ),
    [statusFilter, typeFilter],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / perPage),
  );

  useEffect(() => {
    setWhichPage(1);
  }, [statusFilter, typeFilter, perPage]);

  const pageTransactions = filteredTransactions.slice(
    (whichPage - 1) * perPage,
    whichPage * perPage,
  );

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="flex items-center justify-between gap-3 rounded-[16px] bg-default-white-bg p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-primary-50 text-primary-500 dark:bg-neutral-200">
                <HugeiconsIcon icon={stat.icon} className="size-6" />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
                  {stat.label}
                </p>
                <p className="whitespace-nowrap text-default-text">
                  <span className="text-base font-bold sm:text-lg">
                    {stat.amount}
                  </span>{" "}
                  <span className="text-xs font-normal">تومان</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label={stat.label}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-default-text"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-lg font-bold text-default-text sm:text-[20px]">
              لیست تراکنش های مشتریان ({filteredTransactions.length})
            </p>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:gap-4">
              <SelectComponent
                items={statusOptions}
                placeHolder={"وضعیت پرداخت"}
                onChange={(value: string | null) => setStatusFilter(value)}
                triggerClassName={selectTriggerClass}
              />
              <SelectComponent
                items={typeOptions}
                placeHolder={"نوع تراکنش"}
                onChange={(value: string | null) => setTypeFilter(value)}
                triggerClassName={selectTriggerClass}
              />
            </div>
          </div>

          <div className="max-h-110 overflow-x-auto overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
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
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="py-3 pl-3">
                        <Skeleton className="mr-auto size-5 rounded" />
                      </td>
                    </tr>
                  ))
                ) : pageTransactions.length === 0 ? (
                  <tr className="border-t border-neutral-300">
                    <td
                      colSpan={6}
                      className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                    >
                      تراکنشی یافت نشد
                    </td>
                  </tr>
                ) : (
                  pageTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                    >
                      <td className={`${tdClass} pr-2`}>{transaction.date}</td>
                      <td className={tdClass}>{transaction.trackingCode}</td>
                      <td className={tdClass}>
                        {transaction.amount} <span className="mr-1">تومان</span>
                      </td>
                      <td className="py-3">
                        <Badge
                          text={
                            transaction.status === "success"
                              ? "تایید شده"
                              : "تایید نشده"
                          }
                          type={
                            transaction.status === "success"
                              ? "success"
                              : "error"
                          }
                        />
                      </td>
                      <td className={tdClass}>
                        {typeLabels[transaction.type]}
                      </td>
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
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 sm:mx-0">
            <Pagination
              currentPage={whichPage}
              onPageChange={(event) => setWhichPage(event)}
              totalPages={totalPages}
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
              onChange={(value: string | null) =>
                value ? setPerPage(Number(value)) : setPerPage(1)
              }
              triggerClassName="bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerFinancialManagementPage;
