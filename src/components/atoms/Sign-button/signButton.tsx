"use client";

import type { SignButtonProps } from "./sign-button.types";
import { signButtonStyles, signButtonIcon } from "./sign-button.styles";
import { cn } from "@/lib/utils";

export default function SignButton({
  text,
  icon,
  onClick,
  disabled,
}: SignButtonProps) {
  return (
    <button
      dir="ltr"
      disabled={disabled}
      type="button"
      className={cn(signButtonStyles)}
      onClick={onClick}
    >
      {icon && <span className={cn(signButtonIcon)}>{icon}</span>}
      <span className="flex items-center sm:text-base text-[14px] justify-center pt-1">
        {text}
      </span>
    </button>
  );
}
