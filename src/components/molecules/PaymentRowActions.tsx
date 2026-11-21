"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkBadge01Icon,
  Delete02Icon,
  Edit02Icon,
  LinkSquare02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { Payment } from "@/core/types/payment";

interface PaymentRowActionsProps {
  payment: Payment;
  onView: (id: string) => void;
  onEdit: (payment: Payment) => void;
  onVerify: (payment: Payment) => void;
  onDelete: (id: string) => void;
}

export function PaymentRowActions({
  payment,
  onView,
  onEdit,
  onVerify,
  onDelete,
}: PaymentRowActionsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onView(payment.id)}
        title="مشاهده جزئیات"
        className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-dark-400 bg-neutral-100 dark:bg-default-dark-bg text-primary-500 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors cursor-pointer"
      >
        <HugeiconsIcon icon={ViewIcon} size={20} color="currentColor" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={() => onEdit(payment)}
        title="ویرایش"
        className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-dark-400 bg-neutral-100 dark:bg-default-dark-bg text-warning-600 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900 transition-colors cursor-pointer"
      >
        <HugeiconsIcon icon={Edit02Icon} size={20} color="currentColor" strokeWidth={1.5} />
      </button>

      {payment.status === "pending" && (
        <button
          type="button"
          onClick={() => onVerify(payment)}
          title="تایید پرداخت"
          className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-dark-400 bg-neutral-100 dark:bg-default-dark-bg text-success-700 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-900 transition-colors cursor-pointer"
        >
          <HugeiconsIcon
            icon={CheckmarkBadge01Icon}
            size={20}
            color="currentColor"
            strokeWidth={1.5}
          />
        </button>
      )}



      <button
        type="button"
        onClick={() => onDelete(payment.id)}
        title="حذف"
        className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-dark-400 bg-neutral-100 dark:bg-default-dark-bg text-danger-500 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900 transition-colors cursor-pointer"
      >
        <HugeiconsIcon
          icon={Delete02Icon}
          size={20}
          color="currentColor"
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}