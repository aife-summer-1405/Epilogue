"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 1.4,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        setDisplayValue(latest);
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  const formatted = new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(displayValue.toFixed(decimals)));

  return <span className={className}>{formatted}</span>;
}