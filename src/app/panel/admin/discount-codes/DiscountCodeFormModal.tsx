"use client";

import { FC, FormEvent, useEffect, useState } from "react";
import Modal from "@/components/molecules/modal/Modal";
import Button from "@/components/atoms/button/Button";
import { IDiscountCode } from "@/core/types/admin/discountCodes.types";

interface DiscountCodeFormModalProps {
  open: boolean;
  initialData: IDiscountCode | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    code: string;
    house_id: number;
    discount_percentage: number;
    valid_until: string;
  }) => void;
}

const toDateTimeLocalValue = (isoString?: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const DiscountCodeFormModal: FC<DiscountCodeFormModalProps> = ({
  open,
  initialData,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState("");
  const [houseId, setHouseId] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => {
    if (open) {
      setCode(initialData?.code || "");
      setHouseId(initialData?.house_id ? String(initialData.house_id) : "");
      setDiscountPercentage(
        initialData?.discount_percentage !== undefined
          ? String(Number(initialData.discount_percentage))
          : "",
      );
      setValidUntil(toDateTimeLocalValue(initialData?.valid_until));
    }
  }, [open, initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !houseId || !discountPercentage || !validUntil) return;

    const parsedDate = new Date(validUntil);
    if (isNaN(parsedDate.getTime())) return;

    onSubmit({
      code: code.trim().toUpperCase(),
      house_id: Number(houseId),
      discount_percentage: Number(discountPercentage),
      valid_until: parsedDate.toISOString(),
    });
  };

  const isInvalid =
    !code.trim() || !houseId || !discountPercentage || !validUntil;

  return (
    <Modal
      title={initialData ? "ویرایش کد تخفیف" : "افزودن کد تخفیف جدید"}
      contentClassName="sm:max-w-xl"
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isSubmitting) onClose();
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="discount-code"
              className="text-sm font-semibold text-default-text"
            >
              کد تخفیف
            </label>
            <input
              id="discount-code"
              type="text"
              required
              dir="ltr"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثلاً DELTA10"
              className="w-full rounded-[16px] border border-neutral-300 bg-transparent px-4 py-2.5 text-left text-sm uppercase text-default-text outline-none transition-colors focus:border-primary-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="discount-house-id"
              className="text-sm font-semibold text-default-text"
            >
              شناسه ملک (House ID)
            </label>
            <input
              id="discount-house-id"
              type="number"
              min={1}
              required
              dir="ltr"
              value={houseId}
              onChange={(e) => setHouseId(e.target.value)}
              placeholder="مثلاً 23"
              className="w-full rounded-[16px] border border-neutral-300 bg-transparent px-4 py-2.5 text-left text-sm text-default-text outline-none transition-colors focus:border-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="discount-percentage"
              className="text-sm font-semibold text-default-text"
            >
              درصد تخفیف (%)
            </label>
            <input
              id="discount-percentage"
              type="number"
              min={1}
              max={100}
              step="0.5"
              required
              dir="ltr"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="مثلاً 15"
              className="w-full rounded-[16px] border border-neutral-300 bg-transparent px-4 py-2.5 text-left text-sm text-default-text outline-none transition-colors focus:border-primary-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="discount-valid-until"
              className="text-sm font-semibold text-default-text"
            >
              تاریخ انقضا
            </label>
            <input
              id="discount-valid-until"
              type="datetime-local"
              required
              dir="ltr"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full rounded-[16px] border border-neutral-300 bg-transparent px-4 py-2.5 text-left text-sm text-default-text outline-none transition-colors focus:border-primary-500"
            />
          </div>
        </div>

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-full cursor-pointer rounded-[16px] border-neutral-dark-300 py-2.5 text-sm text-neutral-dark-300 sm:w-36 dark:border-neutral-400 dark:text-neutral-400"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isInvalid}
            className="w-full cursor-pointer rounded-[16px] py-2.5 text-sm text-white sm:w-40"
          >
            {isSubmitting
              ? "در حال ذخیره..."
              : initialData
                ? "ذخیره تغییرات"
                : "ایجاد کد تخفیف"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DiscountCodeFormModal;