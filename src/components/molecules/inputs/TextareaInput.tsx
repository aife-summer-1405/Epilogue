"use client";

import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { ComponentProps } from "react";

interface ITextareaInputProps<T extends FieldValues> extends Omit<
  ComponentProps<"textarea">,
  "name" | "defaultValue"
> {
  icons?: IconSvgElement;
  name: Path<T>;
  title?: string;
  description?: string;
  control: Control<T>;
  variableName?: "mdSm" | "mdMd" | "mdLg";
}

const TextareaInput = <T extends FieldValues>({
  name,
  title,
  description,
  control,
  icons,
  variableName = "mdSm",
  ...textareaProps
}: ITextareaInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const inputVariables = {
    mdSm: {
      container: "p-3 rounded-[12px]",
      label: "text-base leading-5.5",
    },
    mdMd: {
      container: "px-3 py-4 rounded-[16px]",
      label: "text-[20px] leading-6",
    },
    mdLg: {
      container: "px-3 py-5 rounded-[12px]",
      label: "text-[20px] leading-6",
    },
  };

  return (
    <div className={"flex flex-col gap-3"}>
      {title && (
        <label
          className={`${inputVariables[variableName].label} font-semibold`}
          htmlFor={name}
        >
          {title}
        </label>
      )}
      <div
        className={`${inputVariables[variableName].container} border border-neutral-600 dark:border-neutral-200 flex items-start gap-3 bg-neutral-100/50`}
      >
        {icons && (
          <HugeiconsIcon
            icon={icons}
            className="size-6 text-neutral-900 mt-1"
          />
        )}
        <textarea
          className={
            "text-neutral-800 placeholder:text-neutral-800 text-base leading-5.5 outline-none w-full resize-none bg-transparent"
          }
          id={name}
          rows={5}
          {...field}
          {...textareaProps}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      {description && !error ? (
        <div className="flex gap-2">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="size-6 text-primary-500"
          />
          <p className="text-primary-500 text-base">{description}</p>
        </div>
      ) : null}
    </div>
  );
};

export default TextareaInput;
