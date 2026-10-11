"use client";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import type { RadioProps } from "./radio.types";
import { radioStyles } from "./radio.styles";

export default function Radio({
  options,
  className,
  labelClassName,
  ...props
}: RadioProps) {
  return (
    <RadioGroup
      {...props}
      className={cn(radioStyles.group, className)}
    >
      
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "inline-flex items-center gap-2",
            option.disabled && "cursor-not-allowed opacity-50"
          )}
        >
                 <span className={cn("text-sm", labelClassName)}>
            {option.label}
          </span>
          <RadioGroupItem
            value={option.value}
            disabled={option.disabled}
            className={radioStyles.root}
          />

   
        </label>
      ))}
    </RadioGroup>
  );
}