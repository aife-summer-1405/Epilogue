"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building03Icon,
  UserIcon,
  HandGripIcon,
  Money01Icon,
  TextCheckIcon,
} from "@hugeicons/core-free-icons";

export const BOOKING_STEPS = [
  {
    label: "انتخاب هتل",
    icon: Building03Icon,
  },
  {
    label: "مشخصات مسافران",
    icon: UserIcon,
  },
  {
    label: "تأیید اطلاعات",
    icon: TextCheckIcon,
  },
  {
    label: "پرداخت آفلاین",
    icon: Money01Icon,
  },
  {
    label: "صدور بلیط",
    icon: HandGripIcon,
  },
] as const;

interface Props {
  current: number; // 0 تا 4
}

export default function BookingStepper({ current }: Props) {
  return (
    <nav
      dir="rtl"
      aria-label="مراحل رزرو"
      className="w-full overflow-x-auto rounded-full bg-[#F0F0F3] p-2 dark:bg-[#272727]"
    >
      <ol className="flex min-w-max items-center gap-2 sm:gap-3">
        {BOOKING_STEPS.map((step, index) => {
          const isDone = index < current;
          const isCurrent = index === current;
          const isActive = isDone || isCurrent;

          return (
            <li
              key={step.label}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={[
                  "flex h-[38px] items-center justify-center gap-2",
                  "whitespace-nowrap rounded-full px-3 text-xs",
                  "transition-colors duration-200 sm:text-sm",
                  isActive
                    ? "bg-[#2446B5] text-white"
                    : "bg-transparent text-[#91A5E8]",
                ].join(" ")}
              >
                <HugeiconsIcon
                  icon={step.icon}
                  size={20}
                  strokeWidth={1.7}
                />

                <span>{step.label}</span>
              </div>

              {index < BOOKING_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={[
                    "h-px w-5 shrink-0 sm:w-7",
                    isDone
                      ? "bg-[#2446B5]"
                      : "bg-[#C8C9D1]",
                  ].join(" ")}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
