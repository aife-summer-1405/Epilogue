import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FC, ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";

interface IProps {
  title: string;
  description?: string;
  hasFooter?: boolean;
  trigger?: ReactNode;
  footer?: ReactNode;
  titleClassName?: string;
  contentClassName?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Modal: FC<IProps> = ({
  title,
  description,
  hasFooter = false,
  trigger,
  footer,
  titleClassName,
  contentClassName,
  children,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "max-h-[90vh] w-full max-w-[calc(100%-1.5rem)] overflow-y-auto overflow-x-hidden p-4 scrollbar-hide sm:p-6",
          contentClassName,
        )}
      >
        <DialogHeader className="flex items-center justify-between flex-row">
          <DialogTitle
            className={cn(
              "text-lg font-bold text-default-text sm:text-[24px]",
              titleClassName,
            )}
          >
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="size-10 shrink-0 cursor-pointer rounded-full bg-neutral-200 sm:size-12"
                size="icon-sm"
              />
            }
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              strokeWidth={1.5}
              className="size-6 sm:size-8"
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogHeader>
        {children}
        {hasFooter ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
