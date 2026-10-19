"use client";

import type { FC, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { User02Icon, UserAdd02Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import { cn } from "@/lib/utils";

interface IProps {
  children: ReactNode;
}

const tabs = [
  { href: "/auth/login", label: "ورود به حساب کاربری", icon: User02Icon },
  { href: "/auth/signUp", label: "ساخت حساب کاربری", icon: UserAdd02Icon },
];

const AuthShell: FC<IProps> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith("/auth/login");

  return (
    <div className="flex flex-col items-center sm:gap-8 gap-4 w-full">
      <h5 className="text-default-text sm:text-2xl text-[18px] font-semibold">
        {isLoginPage ? "ورود به حساب کاربری" : "ساخت حساب کاربری"}
      </h5>

      <div className="p-2 sm:rounded-full rounded-[16px] bg-[#EDEDED] dark:bg-[#353535] flex flex-col sm:flex-row items-stretch gap-2 w-full">
        {tabs.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} className="flex-1">
              <Button
                variant={active ? "primary" : "tertiary"}
                startIcon={
                  <HugeiconsIcon
                    icon={icon}
                    strokeWidth={1.5}
                    className={cn(
                      "text-default-text 2xl:size-6 xl:size-5 size-6",
                      active && "text-[#FFFFFA]",
                    )}
                  />
                }
                className="w-full"
              >
                <span
                  className={cn(
                    "2xl:text-base xl:text-[14px] text-[14px] font-semibold text-default-text",
                    active && "text-[#FFFFFA]",
                  )}
                >
                  {label}
                </span>
              </Button>
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
};

export default AuthShell;
