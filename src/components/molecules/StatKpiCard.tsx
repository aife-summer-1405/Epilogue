"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { AnimatedCounter } from "@/components/atoms/AnimatedCounter";

interface StatKpiCardProps {
  title: string;
  subtitle: string;
  value: number;
  unitLabel: string;
  icon: IconSvgElement;
  variant: "primary" | "secondary" | "warning" | "success";
  progressPercent: number;
  index: number;
  decimals?: number;
}

const variantStyles = {
  primary: {
    iconBg: "bg-primary-50 text-primary-500 dark:bg-primary-100/40 dark:text-primary-800",
    barFill: "bg-primary-500 dark:bg-primary-400",
    borderHover: "hover:border-primary-300 dark:hover:border-primary-400",
    glow: "group-hover:shadow-primary-500/10",
  },
  secondary: {
    iconBg: "bg-secondary-50 text-secondary-500 dark:bg-secondary-100/40 dark:text-secondary-700",
    barFill: "bg-secondary-500 dark:bg-secondary-400",
    borderHover: "hover:border-secondary-300 dark:hover:border-secondary-400",
    glow: "group-hover:shadow-secondary-500/10",
  },
  warning: {
    iconBg: "bg-warning-50 text-warning-600 dark:bg-warning-100/30 dark:text-warning-500",
    barFill: "bg-warning-500 dark:bg-warning-400",
    borderHover: "hover:border-warning-300 dark:hover:border-warning-400",
    glow: "group-hover:shadow-warning-500/10",
  },
  success: {
    iconBg: "bg-success-50 text-success-700 dark:bg-success-100/30 dark:text-success-600",
    barFill: "bg-success-600 dark:bg-success-500",
    borderHover: "hover:border-success-300 dark:hover:border-success-500",
    glow: "group-hover:shadow-success-500/10",
  },
};

export function StatKpiCard({
  title,
  subtitle,
  value,
  unitLabel,
  icon,
  variant,
  progressPercent,
  index,
  decimals = 0,
}: StatKpiCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-sm transition-all duration-300 ${styles.borderHover} ${styles.glow} hover:shadow-lg`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-700">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <AnimatedCounter
              value={value}
              decimals={decimals}
              className="text-3xl font-extrabold tracking-tight text-default-text"
            />
            <span className="text-xs font-medium text-neutral-800 dark:text-neutral-600">
              {unitLabel}
            </span>
          </div>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${styles.iconBg}`}
        >
          <HugeiconsIcon icon={icon} size={24} color="currentColor" strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-neutral-800 dark:text-neutral-600">
          <span>{subtitle}</span>
          <span className="font-semibold">
            {new Intl.NumberFormat("fa-IR").format(Math.round(progressPercent))}٪
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(8, progressPercent))}%` }}
            transition={{ duration: 1.2, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full rounded-full ${styles.barFill}`}
          />
        </div>
      </div>
    </motion.div>
  );
}