"use client";

import { motion } from "framer-motion";

interface RadialProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  strokeColorClass?: string;
  trackColorClass?: string;
  children?: React.ReactNode;
}

export function RadialProgressRing({
  percentage,
  size = 132,
  strokeWidth = 11,
  strokeColorClass = "stroke-primary-500",
  trackColorClass = "stroke-neutral-200 dark:stroke-neutral-100",
  children,
}: RadialProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          className={trackColorClass}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className={strokeColorClass}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}