import { IBreadCrumbsList } from "@/core/types/BreadCrumb/breadCrumb.types";
import { cn } from "@/lib/utils";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { FC } from "react";
import { Fragment } from "react/jsx-runtime";

interface IProps {
  list?: IBreadCrumbsList[];
}
const defaultValue: IBreadCrumbsList[] = [
  {
    label: "خانه",
    href: "/",
  },
];

const BreadCrumb: FC<IProps> = ({ list = defaultValue }) => {
  return (
    <div className="mx-auto w-fit flex items-center gap-1">
      {list.map((value, index) => (
        <Fragment key={index}>
          <Link
            href={value.href}
            className={cn(
              "text-neutral-800 text-base font-semibold",
              index + 1 === list.length
                ? "text-primary-500 dark:text-primary-400"
                : null,
            )}
          >
            {value.label}
          </Link>
          {index + 1 !== list.length ? (
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="size-6 text-neutral-900"
              stroke="1.5"
            />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
};

export default BreadCrumb;
