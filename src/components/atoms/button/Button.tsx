"use client";

import type { ButtonProps } from "./button.type";
import {
  buttonSizeVariants,
  buttonVariants,
  buttonWidthVariants,
} from "./button.style";
import { cn } from "@/lib/utils";

const Button = ({
  children,
  state = "default",
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  hasIcon = true,
  className = "",
  disabled = false,
  type = "button",
  ...props
}: ButtonProps) => {
  const isButtonDisabled = disabled || state === "disabled";
  const currentState = isButtonDisabled ? "disabled" : "default";

  const visibleStartIcon = hasIcon ? startIcon : undefined;
  const visibleEndIcon = hasIcon ? endIcon : undefined;

  const hasVisibleIcon = Boolean(visibleStartIcon || visibleEndIcon);

  const dynamicPadding = !hasVisibleIcon
    ? "px-6"
    : visibleStartIcon && visibleEndIcon
      ? "px-4"
      : visibleStartIcon
        ? "2xl:pl-4 2xl:pr-6 xl:pl-2 xl:pr-4 pl-4 pr-6"
        : "2xl:pl-6 2xl:pr-4 xl:pl-4 xl:pr-2 pl-6 pr-4";

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-full transition-all duration-300",
        "shrink-0 font-medium whitespace-nowrap",
        dynamicPadding,
        buttonSizeVariants[size],
        buttonWidthVariants[currentState],
        buttonVariants[variant][currentState],
        className,
      )}
      {...props}
    >
      {visibleStartIcon && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {visibleStartIcon}
        </span>
      )}

      <span className="inline-flex items-center justify-center leading-none">
        {children}
      </span>

      {visibleEndIcon && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {visibleEndIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
