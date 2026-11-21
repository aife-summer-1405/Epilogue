"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";
import {
  Cancel01Icon,
  File01Icon,
  Invoice01Icon,
  Money03Icon,
} from "@hugeicons/core-free-icons";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import Button from "@/components/atoms/button/Button";
import { useUpdatePayment } from "@/hooks/use-payments";
import { Payment } from "@/core/types/payment";

interface EditFormValues {
  amount: string;
  status: string;
  description: string;
  transactionId: string;
}

interface PaymentEditModalProps {
  payment: Payment;
  onClose: () => void;
}

export function PaymentEditModal({ payment, onClose }: PaymentEditModalProps) {
  const updateMutation = useUpdatePayment();
  function toPersianDigits(value: string | number): string {
    return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
  }

  const { control, register, handleSubmit } = useForm<EditFormValues>({
    defaultValues: {
      amount: String(parseInt(payment.amount, 10) || 0),
      status: payment.status,
      description: payment.description,
      transactionId: payment.transactionId ?? "",
    },
  });

  const onSubmit = (values: EditFormValues) => {
    const numericAmount = Number(values.amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.warning("لطفاً مبلغ معتبر وارد کنید.");
      return;
    }


    updateMutation.mutate(
      {
        id: payment.id,
        payload: {
          amount: numericAmount,
          status: values.status,
          description: values.description.trim(),
          transactionId: values.transactionId.trim(),
        },
      },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl p-5 sm:p-6 space-y-4 border bg-default-white border-neutral-300 dark:bg-default-dark-content dark:border-neutral-dark-400 text-default-text"
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-dark-400">
          <h2 className="font-bold text-base sm:text-lg">
            ویرایش پرداخت #{toPersianDigits(payment.id)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-dark-600 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} color="currentColor" strokeWidth={1.5} />
          </button>
        </div>

<Controller
  name="amount"
  control={control}
  render={({ field, fieldState }) => {
    const rawDigits = String(field.value ?? "")
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
      .replace(/[^\d]/g, "");

    const formattedPersian = rawDigits
      ? new Intl.NumberFormat("fa-IR").format(Number(rawDigits))
      : "";

    return (
      <div className="space-y-1.5">
        <label className="block text-xs sm:text-sm font-bold text-default-text">
          مبلغ (تومان)
        </label>
        <div className="relative">
          <HugeiconsIcon
            icon={Money03Icon}
            size={18}
            color="currentColor"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-800 dark:text-neutral-600"
          />
          <input
            type="text"
            inputMode="numeric"
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            value={formattedPersian}
            onChange={(e) => {
              const nextRaw = e.target.value
                .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
                .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
                .replace(/[^\d]/g, "");

              field.onChange(nextRaw);
            }}
            placeholder="مبلغ را وارد کنید..."
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] py-2.5 pr-10 pl-4 text-xs sm:text-sm text-default-text placeholder:text-neutral-800 dark:placeholder:text-neutral-600 outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        {fieldState.error?.message && (
          <p className="text-xs font-medium text-danger-500">
            {fieldState.error.message}
          </p>
        )}
      </div>
    );
  }}
/>

        <div className="flex flex-col gap-3">
          <label htmlFor="edit-status" className="font-semibold text-sm sm:text-base">
            وضعیت پرداخت
          </label>
          <select
            id="edit-status"
            {...register("status")}
            className="h-12 px-4 rounded-xl border border-neutral-600 dark:border-neutral-200 bg-transparent dark:bg-[#353535] text-neutral-800 dark:text-neutral-200 text-sm sm:text-base outline-none"
          >
            <option value="pending">در انتظار پرداخت</option>
            <option value="completed">پرداخت شده</option>
            <option value="failed">ناموفق</option>
          </select>
        </div>

        <TextInput
          name="transactionId"
          title="شناسه تراکنش"
          placeholder="مثال: TRX-12345"
          icons={Invoice01Icon}
          control={control}
        />

        <TextInput
          name="description"
          title="توضیحات"
          icons={File01Icon}
          control={control}
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            انصراف
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>
      </form>
    </div>
  );
}