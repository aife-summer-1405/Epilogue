import Link from "next/link";
import { LinkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface IProps {
  icon: typeof LinkCircle02Icon;
  label: string;
  value: number;
  href: string;
  isLoading?: boolean;
}

const StatCard: FC<IProps> = ({ icon, label, value, href, isLoading }) => {
  return (
    <div className="flex w-full min-w-0 items-center gap-3 rounded-[24px] bg-default-white-bg p-4 sm:gap-4">
      {isLoading ? (
        <>
          <Skeleton className="size-10 shrink-0 rounded-[8px] sm:size-12" />
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-4 w-24 sm:h-5" />
            <Skeleton className="h-6 w-12 sm:h-7" />
          </div>
        </>
      ) : (
        <>
          <div className="flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-[8px] bg-neutral-200 sm:min-h-12 sm:min-w-12">
            <HugeiconsIcon
              icon={icon}
              className="size-5 text-primary-500 dark:text-primary-800 sm:size-6"
            />
          </div>
          <div className="flex w-full min-w-0 flex-col">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-normal text-default-text sm:text-base">
                {label}
              </p>
              <Link href={href} className="shrink-0 rounded-full">
                <HugeiconsIcon
                  icon={LinkCircle02Icon}
                  className="size-5 text-default-text transform-[scaleX(-1)] sm:size-5.5"
                />
              </Link>
            </div>
            <p className="text-xl font-bold text-default-text sm:text-2xl">
              {value}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default StatCard;
