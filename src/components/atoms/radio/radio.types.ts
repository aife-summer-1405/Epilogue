import type { ComponentProps } from "react";
import { RadioGroup } from "@/components/ui/radio-group";

export type RadioProps = Omit<
  ComponentProps<typeof RadioGroup>,
  "className" | "children"
> & {
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
  className?: string;
  labelClassName?: string;
};