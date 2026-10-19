"use client";

import { type FieldValues, useController } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ToolTip from "@/components/atoms/tooltip/ToolTip";
import { inputVariables } from "./TextInput.styles";
import { ITextInputProps } from "./TextInput.types";

const TextInput = <T extends FieldValues>({
  name,
  title,
  description,
  control,
  icons,
  type,
  className,
  variableName = "mdSm",
  ...inputProps
}: ITextInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-3">
      {title && (
        <label
          className={cn("font-semibold", inputVariables[variableName].label)}
          htmlFor={name}
        >
          {title}
        </label>
      )}

      <div
        className={cn(
          "border border-neutral-600 dark:bg-[#353535] flex items-center gap-3",
          inputVariables[variableName].container,
        )}
      >
        {icons && (
          <HugeiconsIcon
            icon={icons}
            className="sm:size-6 size-5 text-neutral-900 shrink-0"
          />
        )}
        <input
          {...inputProps}
          {...field}
          id={name}
          type={inputType}
          aria-invalid={!!error}
          className={cn(
            "flex-1 min-w-0 bg-transparent text-neutral-800 placeholder:text-neutral-800 sm:text-base text-[14px] outline-none",
            "[&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]",
            "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-neutral-800)]",
            "[&:-webkit-autofill]:[caret-color:var(--color-neutral-800)]",
            className,
          )}
        />
        {isPassword && (
          <ToolTip
            side="top"
            tooltipText={showPassword ? "پنهان کردن رمزعبور" : "نمایش رمز عبور"}
          >
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="shrink-0 cursor-pointer"
              aria-label={
                showPassword ? "پنهان کردن رمزعبور" : "نمایش رمز عبور"
              }
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffIcon : ViewIcon}
                className="sm:size-6 size-5 text-neutral-900"
              />
            </div>
          </ToolTip>
        )}
      </div>

      {error && (
        <p className="text-danger-500 sm:text-sm text-[12px]">
          {error.message}
        </p>
      )}

      {description ? (
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="sm:size-6 size-5 text-primary-500 dark:text-primary-200 shrink-0"
          />
          <div className="text-primary-500 dark:text-primary-200 sm:text-base text-[14px]">
            {description}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TextInput;
