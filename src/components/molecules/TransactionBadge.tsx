"use client";

import { TransactionType } from "@/core/types/house";

const TRANSACTION_LABELS: Record<
  TransactionType,
  { label: string; className: string }
> = {
  reservation: {
    label: "رزرو شبانه",
    className:
      "bg-primary-50 text-primary-700 dark:bg-primary-100/30 dark:text-primary-800",
  },
  rental: {
    label: "اجاره",
    className:
      "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-500",
  },
  mortgage: {
    label: "رهن و اجاره",
    className:
      "bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
  },
  direct_purchase: {
    label: "خرید مستقیم",
    className:
      "bg-neutral-200 text-neutral-900 dark:bg-neutral-100 dark:text-default-text",
  },
};

export function TransactionBadge({ type }: { type: TransactionType }) {
  const config = TRANSACTION_LABELS[type] ?? {
    label: type,
    className: "bg-neutral-100 text-neutral-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold ${config.className}`}
    >
      {config.label}
    </span>
  );
}