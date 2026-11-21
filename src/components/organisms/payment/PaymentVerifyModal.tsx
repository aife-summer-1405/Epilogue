"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Key01Icon } from "@hugeicons/core-free-icons";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import Button from "@/components/atoms/button/Button";
import { useVerifyPayment } from "@/hooks/use-payments";
import { Payment } from "@/core/types/payment";

interface VerifyFormValues {
  token: string;
}

interface PaymentVerifyModalProps {
  payment: Payment;
  onClose: () => void;
}

function extractTokenFromInput(raw: string): string {
  const value = raw.trim();
  if (!value) return "";

  try {
    const url = new URL(value);
    const paramToken = url.searchParams.get("token");
    if (paramToken) return paramToken.trim();
  } catch {
  }

  const match = value.match(/[?&]token=([^&]+)/i);
  if (match?.[1]) {
    return decodeURIComponent(match[1]).trim();
  }

  return value;
}

export function PaymentVerifyModal({ payment, onClose }: PaymentVerifyModalProps) {
  const verifyMutation = useVerifyPayment();
  const { control, handleSubmit } = useForm<VerifyFormValues>({
    defaultValues: { token: "" },
  });

  const onSubmit = (values: VerifyFormValues) => {
    const parsedToken = extractTokenFromInput(values.token);
    if (!parsedToken) {
      toast.warning("لطفاً توکن تایید را وارد کنید.");
      return;
    }

    verifyMutation.mutate(
      { id: payment.id, payload: { token: parsedToken } },
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
          <h2 className="font-bold text-base sm:text-lg">تایید پرداخت #{payment.id}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-dark-600 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} color="currentColor" strokeWidth={1.5} />
          </button>
        </div>

        <TextInput
          name="token"
          title="توکن تراکنش"
          placeholder="توکن یا لینک حاوی token را وارد کنید"
          icons={Key01Icon}
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
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? "در حال بررسی..." : "تایید پرداخت"}
          </Button>
        </div>
      </form>
    </div>
  );
}