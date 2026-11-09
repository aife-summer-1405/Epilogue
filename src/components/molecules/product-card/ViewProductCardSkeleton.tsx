import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface IProps {
  className?: string;
}

const ViewProductCardSkeleton: FC<IProps> = ({ className }) => {
  return (
    <article
      dir="rtl"
      aria-hidden="true"
      className={cn(
        "flex w-full flex-col overflow-hidden",
        "rounded-[26px] border border-gray-200 dark:border-none bg-white",
        "dark:bg-[#272727]",
        "sm:flex-row sm:items-stretch sm:gap-3 sm:p-2",
        className,
      )}
    >
      <Skeleton className="aspect-340/230 w-full shrink-0 rounded-[20px] sm:aspect-auto sm:w-[34%]" />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:order-1 sm:p-2">
        <Skeleton className="h-7 w-2/3 sm:h-8" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <div className="flex items-center gap-1">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-12 w-full rounded-full sm:w-64" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
    </article>
  );
};

export default ViewProductCardSkeleton;
