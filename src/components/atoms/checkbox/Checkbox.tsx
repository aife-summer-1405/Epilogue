"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon } from "@hugeicons/core-free-icons";

import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { CheckboxProps } from "./checkbox.types";
import { checkboxStyles } from "./checkbox.styles";

export default function Checkbox({
  className,
  label,
  labelClassName,
  id,
  ...props
}: CheckboxProps) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2">
      {label && <span className={cn("text-sm", labelClassName)}>{label}</span>}
      <ShadcnCheckbox
        {...props}
        id={id}
        className={cn(checkboxStyles.root, className)}
      >
        <HugeiconsIcon
          icon={Tick01Icon}
          className={cn(checkboxStyles.icon, "text-primary-600 ")}
          color="currentColor"
          strokeWidth={3}
        />
      </ShadcnCheckbox>
    </label>
  );
}
