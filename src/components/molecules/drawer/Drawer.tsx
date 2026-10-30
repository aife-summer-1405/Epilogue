"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { type DrawerTriggerState, type DrawerPopupState } from "@base-ui/react";
import { FC, ReactNode } from "react";
import { JSX } from "react/jsx-runtime";

interface IProps {
  trigger: JSX.Element;
  title?: string;
  description?: string;
  children: ReactNode;
  close?: JSX.Element;
  className?:
    | string
    | ((state: DrawerPopupState) => string | undefined)
    | undefined;
  triggerClassName?:
    | string
    | ((state: DrawerTriggerState) => string | undefined)
    | undefined;
  swipeDirection?: "right" | "left" | "up" | "down";
}

const DrawerComponent: FC<IProps> = ({
  trigger,
  title,
  description,
  children,
  close,
  className,
  triggerClassName,
  swipeDirection = "down",
}) => {
  return (
    <Drawer swipeDirection={swipeDirection} showSwipeHandle>
      <DrawerTrigger className={triggerClassName} render={trigger} />
      <DrawerContent className={className}>
        {title || description ? (
          <DrawerHeader>
            {title ? <DrawerTitle>{title}</DrawerTitle> : null}
            {description ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : null}
          </DrawerHeader>
        ) : null}
        {children}
        <DrawerFooter>
          {close ? <DrawerClose render={close} /> : null}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerComponent;
