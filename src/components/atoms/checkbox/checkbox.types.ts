import type { ComponentProps } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export type CheckboxProps = Omit<
  ComponentProps<typeof Checkbox>,
  "className"
> & {
  className?: string;
  label?: string;
  labelClassName?: string;
};