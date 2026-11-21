"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, Award02Icon } from "@hugeicons/core-free-icons";
import { AnimatedCounter } from "@/components/atoms/AnimatedCounter";
import { RadialProgressRing } from "@/components/atoms/RadialProgressRing";

interface RatingGaugeCardProps {
  averageRating: string;
}

export function RatingGaugeCard({ averageRating }: RatingGaugeCardProps) {
  const numericRating = parseFloat(averageRating) || 0;
  const percentage = (numericRating / 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-default-text">
            میانگین رضایت کاربران
          </h3>
          <p className="mt-0.5 text-xs text-neutral-800 dark:text-neutral-600">
            امتیاز کل ثبت‌شده برای اقامتگاه‌ها
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 text-warning-600 dark:bg-warning-100/30 dark:text-warning-500">
          <HugeiconsIcon icon={Award02Icon} size={20} color="currentColor" strokeWidth={1.8} />
        </div>
      </div>

      <div className="my-6 flex flex-col items-center justify-center">
        <RadialProgressRing
          percentage={percentage}
          size={152}
          strokeWidth={13}
          strokeColorClass="stroke-warning-500 dark:stroke-warning-400"
        >
          <div className="flex items-baseline gap-0.5" dir="ltr">
            <AnimatedCounter
              value={numericRating}
              decimals={2}
              className="text-3xl font-extrabold text-default-text"
            />
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-600">
              / 5
            </span>
          </div>
          <span className="mt-1 text-[11px] font-medium text-warning-600 dark:text-warning-500">
            {numericRating >= 4 ? "عملکرد عالی" : numericRating >= 3 ? "عملکرد خوب" : "نیاز به بهبود"}
          </span>
        </RadialProgressRing>

        <div className="mt-4 flex items-center gap-1.5" dir="ltr">
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const fillRatio = Math.min(1, Math.max(0, numericRating - (starIndex - 1)));
            return (
              <motion.div
                key={starIndex}
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 + starIndex * 0.08, type: "spring" }}
                className="relative h-5 w-5 text-warning-500"
              >
                <HugeiconsIcon
                  icon={StarIcon}
                  size={20}
                  color="currentColor"
                  strokeWidth={1.8}
                  className="text-neutral-300 dark:text-neutral-200"
                />
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${fillRatio * 100}%` }}
                >
                  <HugeiconsIcon
                    icon={StarIcon}
                    size={20}
                    color="currentColor"
                    fill="currentColor"
                    strokeWidth={1.8}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl bg-neutral-100 dark:bg-neutral-50 px-4 py-2.5 text-center text-xs font-medium text-neutral-800 dark:text-neutral-700">
        معادل{" "}
        <span className="font-bold text-warning-600 dark:text-warning-500">
          {new Intl.NumberFormat("fa-IR").format(Math.round(percentage))}٪
        </span>{" "}
        رضایت حداکثری مهمانان
      </div>
    </motion.div>
  );
}