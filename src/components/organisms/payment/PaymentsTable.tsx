"use client";

import Badge from "@/components/atoms/badge/Badge";
import formatPrice from "@/lib/formatters/price";
import { Payment } from "@/core/types/payment";
import { PaymentRowActions } from "../../molecules/PaymentRowActions";
interface PaymentsTableProps {
  payments: Payment[];
  isLoading: boolean;
  onView: (id: string) => void;
  onEdit: (payment: Payment) => void;
  onVerify: (payment: Payment) => void;
  onDelete: (id: string) => void;
}

function mapPaymentBadge(status: string): {
  text: string;
  type: "confirmed" | "pending" | "canceled";
} {
  if (status === "completed" || status === "confirmed") {
    return { text: "پرداخت شده", type: "confirmed" };
  }
  if (status === "failed" || status === "canceled") {
    return { text: "ناموفق / لغو شده", type: "canceled" };
  }
  return { text: "در انتظار پرداخت", type: "pending" };
}
function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function PaymentsTable({
  payments,
  isLoading,
  onView,
  onEdit,
  onVerify,
  onDelete,
}: PaymentsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl p-10 text-center border bg-default-white border-neutral-300 dark:bg-default-dark-content dark:border-neutral-dark-400">
        <div className="w-8 h-8 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm text-neutral-800 dark:text-neutral-300">
          در حال دریافت لیست پرداخت‌ها...
        </p>
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="rounded-2xl p-10 text-center border bg-default-white border-neutral-300 dark:bg-default-dark-content dark:border-neutral-dark-400">
        <p className="text-sm text-neutral-800 dark:text-neutral-300">
          هیچ پرداختی با فیلترهای انتخاب‌شده یافت نشد.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-2xl border bg-default-white border-neutral-300 dark:bg-default-dark-content dark:border-neutral-dark-400">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b text-xs font-semibold border-neutral-200  bg-neutral-100 text-neutral-800  dark:bg-[#3c3c3c] ">
              <th className="py-3.5 px-4">شناسه</th>
              <th className="py-3.5 px-4">کاربر / رزرو</th>
              <th className="py-3.5 px-4">توضیحات</th>
              <th className="py-3.5 px-4">مبلغ</th>
              <th className="py-3.5 px-4">وضعیت</th>
              <th className="py-3.5 px-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm divide-neutral-200 dark:divide-neutral-dark-400">
            {payments.map((item) => {
              const badge = mapPaymentBadge(item.status);
              const numericAmount = parseFloat(item.amount) || 0;

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-dark-600/40"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-primary-500 dark:text-primary-200">
                    #{toPersianDigits(item.id)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        کاربر: {toPersianDigits(item.userId)}
                      </span>
                      <span className="text-xs text-neutral-800 dark:text-neutral-400">
                        {item.bookingId
                          ? `رزرو #${toPersianDigits(item.bookingId)}`
                          : "بدون رزرو"}
                      </span>
                    </div>
                  </td>
                  <td
                    className="py-3.5 px-4 max-w-xs truncate"
                    title={item.description}
                  >
                    {item.description}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-secondary-600 dark:text-secondary-300 whitespace-nowrap">
                    {formatPrice(numericAmount, false)} تومان
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge text={badge.text} type={badge.type} />
                  </td>
                  <td className="py-3.5 px-4">
                    <PaymentRowActions
                      payment={item}
                      onView={onView}
                      onEdit={onEdit}
                      onVerify={onVerify}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {payments.map((item) => {
          const badge = mapPaymentBadge(item.status);
          const numericAmount = parseFloat(item.amount) || 0;

          return (
            <div
              key={item.id}
              className="rounded-2xl p-4 space-y-3 border bg-default-white border-neutral-300 dark:bg-default-dark-content dark:border-neutral-dark-400"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-primary-500 dark:text-primary-200">
                  #{item.id}
                </span>
                <Badge text={badge.text} type={badge.type} />
              </div>

              <p className="text-sm leading-relaxed">{item.description}</p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-200 text-neutral-800 dark:border-neutral-dark-400 dark:text-neutral-400">
                <span>کاربر: {item.userId}</span>
                <span>
                  {item.bookingId ? `رزرو #${item.bookingId}` : "بدون رزرو"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-sm text-secondary-600 dark:text-secondary-300">
                  {formatPrice(numericAmount, false)} تومان
                </span>
                <PaymentRowActions
                  payment={item}
                  onView={onView}
                  onEdit={onEdit}
                  onVerify={onVerify}
                  onDelete={onDelete}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
