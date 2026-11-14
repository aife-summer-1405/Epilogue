"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import confetti from "canvas-confetti"; // پکیج ذرات شادی و فشفشه
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  StarIcon,
  Award01Icon,
  MessageUser01Icon,
} from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import { createFeedbackAction } from "@/app/actions/feedback.action";
import { toast } from "react-toastify";

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

  const { mutate, isPending } = useMutation({
    mutationFn: createFeedbackAction,
    onSuccess: () => {
      setFeedbackSent(true);
      toast.success(`دیدگاه شما ثبت شد و ${pointsAwarded} امتیاز وفاداری دریافت کردید!`);
      reset();

      // تابع اجرای انیمیشن آتش‌بازی و ذرات شادی (تولد / سورپرایز)
      const triggerConfettiExplosion = () => {
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

        const interval: any = setInterval(function () {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);

          // پرتاب ذرات رنگی از سمت چپ و راست صفحه
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#f59e0b', '#1e40af', '#10b981', '#ec4899', '#8b5cf6']
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#f59e0b', '#1e40af', '#10b981', '#ec4899', '#8b5cf6']
          });
        }, 250);
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      // اجرای افکت ذرات شادی بلافاصله بعد از موفقیت
      triggerConfettiExplosion();
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ثبت بازخورد. دوباره تلاش کنید.");
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
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-3xl bg-card p-6 text-center shadow-2xl border border-border">
        <div className="flex flex-col items-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-500 text-white shadow-md shadow-success-500/20">
            <HugeiconsIcon icon={Tick02Icon} size={32} />
          </span>
          <p className="text-lg font-bold text-foreground">رزرو بلیط شما با موفقیت انجام شد!</p>
        </div>

        <div className="w-full rounded-2xl border border-border bg-muted/40 p-4 text-right">
          {!feedbackSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-foreground">
                  تجربه رزرو چطور بود؟
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-warning-100 dark:bg-warning-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-warning-700 dark:text-warning-300">
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
                    className="transition-transform hover:scale-110 focus:outline-none bg-transparent border-none p-0 shadow-none cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={StarIcon}
                      size={26}
                      fill={(hoverRating || rating) >= star ? "#f7df0e" : "none"}
                      className={
                        (hoverRating || rating) >= star
                          ? "text-warning-500"
                          : "text-muted-foreground"
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

              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={isPending}
                className="w-full bg-primary-600 text-xs"
              >
                {isPending ? "در حال ثبت..." : "ثبت بازخورد و دریافت امتیاز"}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-2 py-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-success-50 dark:bg-success-950/40 text-success-600 dark:text-success-400">
                <HugeiconsIcon icon={Award01Icon} size={28} />
              </div>
              <p className="text-xs font-bold text-success-600 dark:text-success-400">
                بازخورد شما ثبت شد!
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-warning-50 dark:bg-warning-950/40 px-3 py-1.5 text-xs font-bold text-warning-700 dark:text-warning-300 shadow-xs mt-1">
                <span>🎉</span>
                <span>+{pointsAwarded} امتیاز وفاداری به حساب شما واریز شد</span>
              </div>
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