"use client";

import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

export function useThemeTransition() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = (e: MouseEvent<HTMLElement>) => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const button = e.currentTarget;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!document.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    button.blur();

    const rect = button.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--theme-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--theme-y", `${rect.top + rect.height / 2}px`);

    document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
  };

  return { resolvedTheme, toggleTheme };
}
