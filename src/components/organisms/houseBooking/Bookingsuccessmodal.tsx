"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";

export default function BookingSuccessModal({ open }: { open: boolean }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-3xl bg-white p-6 text-center dark:bg-[#272727] dark:text-white">
        <span className="flex size-16 items-center justify-center rounded-full bg-green-500 text-white">
          <HugeiconsIcon icon={Tick02Icon} size={36} />
        </span>

        <p className="text-lg font-bold">رزرو بلیط شما با موفقیت انجام شد !</p>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Link href="/" className="flex-1">
            <Button type="button" size="md" variant="primary" className="w-full">
              بازگشت به صفحه اصلی
            </Button>
          </Link>
          <Link href="/profile/tickets" className="flex-1">
            <Button type="button" size="md" variant="outline" className="w-full">
              بلیط‌های من
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}