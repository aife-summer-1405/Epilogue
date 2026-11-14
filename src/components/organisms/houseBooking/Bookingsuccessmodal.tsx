"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  StarIcon,
  Award01Icon,
  CheckmarkCircle02Icon,
  MessageUser01Icon,
} from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import TextInput from "@/components/molecules/inputs/textInput/TextInput"; // مسیر کامپوننت TextInput شما
import { createFeedbackAction } from "@/app/actions/Feedback.actions";

interface BookingSuccessModalProps {
  open: boolean;
  houseId: number;
  userId?: number;
}

interface FeedbackFormValues {
  comment: string;
}

export default function BookingSuccessModal({
  open,
  houseId,
  userId = 1,
}: BookingSuccessModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const pointsAwarded = 20;

  const { control, handleSubmit, reset } = useForm<FeedbackFormValues>({
    defaultValues: {
      comment: "",
    },
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createFeedbackAction,
    onSuccess: () => {
      setFeedbackSent(true);
      reset();
    },
  });

  if (!open) return null;

  const onSubmit = (data: FeedbackFormValues) => {
    if (!data.comment.trim() || isPending) return;

    mutate({
      userId: Number(userId),
      houseId: Number(houseId),
      rating,
      comment: data.comment.trim(),
      pointsAwarded,
    });
  };

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-3xl bg-white p-6 text-center shadow-2xl dark:bg-[#272727] dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-full bg-green-500 text-white shadow-md shadow-green-500/20">
            <HugeiconsIcon icon={Tick02Icon} size={32} />
          </span>
          <p className="text-lg font-bold">رزرو بلیط شما با موفقیت انجام شد!</p>
        </div>

        <div className="w-full rounded-2xl border border-[#CDCED6] bg-[#F0F0F3]/70 p-4 text-right dark:border-[#353535] dark:bg-[#353535]/70">
          {!feedbackSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#191919] dark:text-white">
                  تجربه رزرو چطور بود؟
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                  <HugeiconsIcon icon={Award01Icon} size={14} />
                  +{pointsAwarded} امتیاز
                </span>
              </div>

              <div className="flex items-center justify-center gap-1.5 py-1" dir="ltr">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none bg-transparent border-none p-0 shadow-none"
                  >
                    <HugeiconsIcon
                      icon={StarIcon}
                      size={26}
                      fill={(hoverRating || rating) >= star ? "#f7df0e" : "none"}
                      className={
                        (hoverRating || rating) >= star
                          ? "text-amber-400"
                          : "text-neutral-400 dark:text-neutral-500"
                      }
                    />
                  </button>
                ))}
              </div>

              <TextInput
                name="comment"
                control={control}
                placeholder="نظر خود را اینجا بنویسید..."
                icons={MessageUser01Icon}
                variableName="mdSm"
              />

              {isError && (
                <p className="text-center text-[11px] text-red-500">
                  خطا در ثبت بازخورد. دوباره تلاش کنید.
                </p>
              )}

              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={isPending}
                className="w-full bg-[#1E40AF] text-xs"
              >
                {isPending ? "در حال ثبت..." : "ثبت بازخورد و دریافت امتیاز"}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-3 text-center">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={26}
                className="text-emerald-500"
              />
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                بازخورد شما ثبت شد و {pointsAwarded} امتیاز گرفتید!
              </p>
            </div>
          )}
        </div>

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