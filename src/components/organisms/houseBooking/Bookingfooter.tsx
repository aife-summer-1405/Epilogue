"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import { formatPrice } from "@/utils/formatters";

interface Props {
  total: number;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

export default function BookingFooter({ total, label, disabled, onClick }: Props) {
  return (
    <div className="flex flex-col gap-4 border-t border-[#CDCED6] pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-baseline gap-2">
        <span className="text-sm text-[#a6a6a6] sm:text-base">قیمت کل</span>
        <span className="text-xl font-bold text-primary-500 sm:text-2xl">
          {formatPrice(total.toLocaleString("en-US"))}
        </span>
        <span className="text-xs text-[#a6a6a6]">تومان</span>
      </p>

      <Button
        type="button"
        size="md"
        variant="primary"
        disabled={disabled}
        onClick={onClick}
        className="flex w-full items-center justify-center gap-2 rounded-full sm:w-auto"
      >
        <span>{label}</span>
        <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
      </Button>
    </div>
  );
}