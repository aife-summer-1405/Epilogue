"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";
import { switchStyles } from "./switch.styles";
import type { SwitchProps } from "./switch.types";

export default function Switch({
  className,
  ...props
}: SwitchProps) {
  return (
    <BaseSwitch.Root
      {...props}
      className={cn(switchStyles.root, className)}
    >
      <BaseSwitch.Thumb className={switchStyles.thumb} />
    </BaseSwitch.Root>
  );
}