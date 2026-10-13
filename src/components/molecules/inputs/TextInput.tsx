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

interface ITextInputProps<T extends FieldValues> extends Omit<
  ComponentProps<"input">,
  "name" | "defaultValue"
> {
  icons?: IconSvgElement;
  name: Path<T>;
  title: string;
  description?: string;
  control: Control<T>;
  variableName: "mdSm" | "mdMd" | "mdLg" | "fullSm" | "fullMd" | "fullLg";
}

const TextInput = <T extends FieldValues>({
  name,
  title,
  description,
  control,
  icons,
  variableName = "mdSm",
  ...inputProps
}: ITextInputProps<T>) => {
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
      container: "px-3 py-4 rounded-[12px]",
      label: "text-[20px] leading-6",
    },
    mdLg: {
      container: "px-3 py-5 rounded-[12px]",
      label: "text-[20px] leading-6",
    },
    fullSm: {
      container: "p-3 rounded-full",
      label: "text-base leading-5.5",
    },
    fullMd: {
      container: "px-3 py-4 rounded-full",
      label: "text-[20px] leading-6",
    },
    fullLg: {
      container: "px-3 py-5 rounded-full",
      label: "text-[20px] leading-6",
    },
  };

  return (
    <div className={"flex flex-col gap-3"}>
      <label
        className={`${inputVariables[variableName].label} font-semibold`}
        htmlFor={name}
      >
        {title}
      </label>
      <div
        className={`${inputVariables[variableName].container} border border-neutral-600 flex items-center gap-3`}
      >
        {icons && (
          <HugeiconsIcon icon={icons} className="size-6 text-neutral-900" />
        )}
        <input
          className={
            "text-neutral-800 placeholder:text-neutral-800 text-base leading-5.5 outline-none"
          }
          id={name}
          {...field}
          {...inputProps}
        />
      </div>
      {description ? (
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

export default TextInput;
