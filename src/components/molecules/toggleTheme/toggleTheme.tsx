"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import ButtonOnlyIcon from "@/components/atoms/buttonOnlyIcon/buttonOnlyIcon";
import { useThemeTransition } from "@/features/theme/hooks/useThemeTransition";

const ThemeToggle = () => {
  const { resolvedTheme, toggleTheme } = useThemeTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <ButtonOnlyIcon
      hasIcon={false}
      size="sm"
      onClick={toggleTheme}
      className="shrink-0 flex items-center justify-center transition-none hover:translate-none! hover:scale-none! hover:shadow-none! active:translate-none! active:scale-none! focus:outline-none focus-visible:ring-2"
      aria-label={isDark ? "فعال کردن تم روشن" : "فعال کردن تم تاریک"}
    >
      <HugeiconsIcon
        icon={isDark ? Sun01Icon : Moon02Icon}
        size={24}
        strokeWidth={1.8}
      />
    </ButtonOnlyIcon>
  );
};

export default ThemeToggle;
