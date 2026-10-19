import { type IconSvgElement } from "@hugeicons/react";
import { type InputHTMLAttributes, type ReactNode } from "react";
import { type Control, type FieldValues, type Path } from "react-hook-form";

type TVariables = "mdSm" | "mdMd" | "mdLg" | "fullSm" | "fullMd" | "fullLg";

export interface ITextInputProps<T extends FieldValues> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "defaultValue" | "title"
> {
  icons?: IconSvgElement;
  name: Path<T>;
  title?: string;
  description?: ReactNode;
  className?: string;
  control: Control<T>;
  variableName?: TVariables;
}
