"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BarChartIcon,
  UserMultiple02Icon,
  Home01Icon,
  CalendarCheckIn01Icon,
} from "@hugeicons/core-free-icons";
import { AdminDashboardStats } from "@/core/types/dashboard.types";
import { AnimatedCounter } from "@/components/atoms/AnimatedCounter";

interface DashboardOverviewChartProps {
  stats: AdminDashboardStats;
}

export function DashboardOverviewChart({ stats }: DashboardOverviewChartProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const items = [
    {
      key: "users",
      label: "کل کاربران",
      value: stats.totalUsers,
      icon: UserMultiple02Icon,
      barGradient: "from-primary-600 to-primary-400 dark:from-primary-500 dark:to-primary-200",
      badgeBg: "bg-primary-50 text-primary-600 dark:bg-primary-100/40 dark:text-primary-800",
      description: "کاربران ثبت‌نام‌شده در پلتفرم",
    },
    {
      key: "bookings",
      label: "کل رزروها",
      value: stats.totalBookings,
      icon: CalendarCheckIn01Icon,
      barGradient: "from-secondary-600 to-secondary-400 dark:from-secondary-400 dark:to-secondary-600",
      badgeBg: "bg-secondary-50 text-secondary-600 dark:bg-secondary-100/40 dark:text-secondary-700",
      description: "تعداد رزروهای ثبت‌شده",
    },
    {
      key: "houses",
      label: "کل اقامتگاه‌ها",
      value: stats.totalHouses,
      icon: Home01Icon,
      barGradient: "from-success-700 to-success-500 dark:from-success-400 dark:to-success-600",
      badgeBg: "bg-success-50 text-success-700 dark:bg-success-100/30 dark:text-success-600",
      description: "اقامتگاه‌های فعال و ثبت‌شده",
    },
  ];

  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="flex flex-col justify-between rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800">
            <HugeiconsIcon icon={BarChartIcon} size={20} color="currentColor" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-base font-bold text-default-text">
              نمودار مقایسه‌ای شاخص‌های کلیدی
            </h3>
            <p className="text-xs text-neutral-800 dark:text-neutral-600">
              مقایسه بصری حجم کاربران، رزروها و اقامتگاه‌های سامانه
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 items-end gap-4 sm:gap-8 pt-6 px-2 sm:px-6 border-b border-neutral-200 dark:border-neutral-100">
        {items.map((item, idx) => {
          const heightPercent = Math.max(16, Math.round((item.value / maxValue) * 100));
          const isHovered = hoveredKey === item.key;

          return (
            <div
              key={item.key}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="flex flex-col items-center cursor-pointer"
            >
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1, y: isHovered ? -4 : 0 }}
                className={`mb-3 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-bold transition-colors ${item.badgeBg}`}
              >
                <AnimatedCounter value={item.value} />
              </motion.div>

              <div className="relative flex h-44 sm:h-52 w-full max-w-[76px] items-end justify-center rounded-t-2xl bg-neutral-100/80 dark:bg-neutral-50/50 p-1.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{
                    duration: 1.1,
                    delay: 0.3 + idx * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative w-full rounded-xl bg-gradient-to-t ${item.barGradient} shadow-md transition-opacity ${
                    hoveredKey && !isHovered ? "opacity-65" : "opacity-100"
                  }`}
                >
                  <div className="absolute inset-x-2 top-1.5 h-1 rounded-full bg-white/35" />
                </motion.div>
              </div>

              <div className="mt-3 mb-4 flex flex-col items-center text-center">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-default-text">
                  <HugeiconsIcon
                    icon={item.icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={1.8}
                    className="text-neutral-800 dark:text-neutral-600 hidden sm:inline"
                  />
                  <span>{item.label}</span>
                </div>
                <span className="mt-0.5 text-[11px] text-neutral-800 dark:text-neutral-600 hidden md:inline">
                  {item.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-800 dark:text-neutral-600">
        <span>
          میانگین رزرو به ازای هر اقامتگاه:{" "}
          <strong className="text-default-text">
            {stats.totalHouses > 0
              ? new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(
                  stats.totalBookings / stats.totalHouses
                )
              : "۰"}{" "}
            رزرو
          </strong>
        </span>
        <span>
          نرخ تبدیل کاربر به رزرو:{" "}
          <strong className="text-secondary-600 dark:text-secondary-500">
            {stats.totalUsers > 0
              ? new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(
                  (stats.totalBookings / stats.totalUsers) * 100
                )
              : "۰"}
            ٪
          </strong>
        </span>
      </div>
    </motion.div>
  );
}