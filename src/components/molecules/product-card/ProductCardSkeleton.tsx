import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

export default function ProductCardSkeleton({
  className,
}: ProductCardSkeletonProps) {
  return (
    <article
      dir="rtl"
      className={cn(
        "w-full overflow-hidden rounded-[28px]",
        "bg-white border border-gray-200 dark:border-none",
        "dark:bg-[#272727] dark:text-white",
        className,
      )}
    >
      <div className="relative aspect-340/230 w-full overflow-hidden">
        <Skeleton className="size-full rounded-none" />

        <div className="absolute right-3 top-3 flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-12 rounded-full" />
        </div>

        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-7 w-3/4 rounded-md" />

        <div className="flex flex-wrap items-center gap-3 gap-y-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="inline-flex items-center gap-1">
              <Skeleton className="size-5.5 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
          ))}
        </div>

        <div className="flex min-h-13.5 items-center justify-between gap-3 rounded-2xl bg-gray-100 px-3 py-3 dark:bg-[#353535]">
          <Skeleton className="h-4 w-24" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </article>
  );
}
