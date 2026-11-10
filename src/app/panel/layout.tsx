"use client";

import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import DrawerComponent from "@/components/molecules/drawer/Drawer";
import { FC, useEffect, useState } from "react";
import profileFallBack from "@/app/assets/Image/profileFallBack.jpg";
import ThemeToggle from "@/components/molecules/toggleTheme/toggleTheme";
import ButtonOnlyIcon from "@/components/atoms/buttonOnlyIcon/buttonOnlyIcon";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building06Icon,
  CheckListIcon,
  Comment01Icon,
  DashboardSquare02Icon,
  HeartIcon,
  Home07Icon,
  Logout01Icon,
  Menu01Icon,
  Notification01Icon,
  SaveMoneyDollarIcon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import HomeLogo from "@/components/atoms/Logo/home-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconSvgObject } from "@/core/types/icon.types";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAction } from "../actions/user.actions";
import { useLogout } from "@/hooks/mutations/useLogout";
import { getCookie } from "@/utils/getCookie";
import { Skeleton } from "@/components/ui/skeleton";

interface IProps {
  children: React.ReactNode;
}

interface INavigationItems {
  icon: IconSvgObject;
  text: string;
  path: string;
}

const menuNavigationItems: INavigationItems[] = [
  { icon: DashboardSquare02Icon, text: "داشبورد", path: "/panel/dashboard" },
  {
    icon: UserEdit01Icon,
    text: "مشخصات کاربری",
    path: "/panel/userInformation",
  },
  { icon: Notification01Icon, text: "اعلان ها", path: "/panel/notifications" },
];

const menuSellerNavigationItems: INavigationItems[] = [
  {
    icon: Building06Icon,
    text: "مدیریت املاک",
    path: "/panel/houseManagement",
  },
  {
    icon: CheckListIcon,
    text: "مدیریت رزرو ها",
    path: "/panel/reserveManagement/seller",
  },
  {
    icon: SaveMoneyDollarIcon,
    text: "مدیریت مالی",
    path: "/panel/financeManagement",
  },
  {
    icon: Comment01Icon,
    text: "مدیریت نظرات",
    path: "/panel/commentsManagement",
  },
];

const menuBuyerNavigationItems: INavigationItems[] = [
  {
    icon: CheckListIcon,
    text: "مدیریت رزرو ها",
    path: "/panel/reserveManagement/buyer",
  },
  {
    icon: SaveMoneyDollarIcon,
    text: "مدیریت پرداخت ها",
    path: "/panel/paymentManagement",
  },
  { icon: HeartIcon, text: "علاقه مندی ها", path: "/profile/favorites" },
];

interface INavLinkProps {
  item: INavigationItems;
  active: boolean;
  onClick?: () => void;
}

const NavLink: FC<INavLinkProps> = ({ item, active, onClick }) => (
  <Link
    href={item.path}
    onClick={onClick}
    className="flex items-center gap-3 xl:gap-4"
  >
    <HugeiconsIcon
      icon={item.icon}
      className={cn(
        "size-5 shrink-0 xl:size-6",
        active ? "text-default-text" : "text-neutral-800",
      )}
    />
    <p
      className={cn(
        "text-base xl:text-lg 2xl:text-[20px]",
        active ? "font-bold text-default-text" : "font-normal text-neutral-800",
      )}
    >
      {item.text}
    </p>
  </Link>
);

const PanelLayout: FC<IProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await getCurrentUserAction();
      return result.success ? result.user : null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: logout, isPending } = useLogout();

  const navigationItems =
    userRole === "seller"
      ? menuSellerNavigationItems
      : menuBuyerNavigationItems;

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const role = getCookie("userRole");
    setUserRole(role);
  }, []);

  const sidebarContent = (
    <>
      <HomeLogo />
      <div className="flex flex-col gap-4">
        <p className="text-base font-normal text-primary-500 dark:text-primary-800">
          منو
        </p>
        <div className="flex flex-col gap-5 xl:gap-6">
          {menuNavigationItems.map((item) => (
            <NavLink
              key={item.path}
              item={item}
              active={pathname.includes(item.path)}
              onClick={closeMenu}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-base font-normal text-primary-500 dark:text-primary-800">
          مدیریت
        </p>
        <div className="flex flex-col gap-5 xl:gap-6">
          {userRole
            ? navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  item={item}
                  active={pathname.includes(item.path)}
                  onClick={closeMenu}
                />
              ))
            : null}
          <button
            type="button"
            disabled={isPending}
            className="group flex w-fit cursor-pointer items-center gap-3 xl:gap-4"
            onClick={() => logout()}
          >
            <HugeiconsIcon
              icon={Logout01Icon}
              className="size-5 shrink-0 text-neutral-800 transition group-hover:text-default-text xl:size-6"
            />
            <p className="text-base font-normal text-neutral-800 transition group-hover:font-bold group-hover:text-default-text xl:text-lg 2xl:text-[20px]">
              خروج از حساب کاربری
            </p>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1920px] gap-4 p-3 sm:p-4 lg:gap-8 lg:p-8">
      <aside className="hidden w-72 max-h-dvh sticky top-3 sm:top-4 lg:top-8 shrink-0 flex-col gap-8 rounded-[40px] border border-neutral-300 bg-neutral-200 p-6 lg:flex xl:w-80 xl:p-8 2xl:w-[22%]">
        {sidebarContent}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-8">
        <header className="flex items-center justify-between gap-3 rounded-[24px] border border-neutral-300 bg-neutral-200 px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="lg:hidden">
              <DrawerComponent
                open={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                swipeDirection="right"
                className="w-[85%] max-w-sm overflow-y-auto bg-neutral-200 p-6"
                trigger={
                  <button
                    type="button"
                    aria-label="باز کردن منو"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-default-text"
                  >
                    <HugeiconsIcon icon={Menu01Icon} size={24} />
                  </button>
                }
                close={
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-neutral-300 py-3 text-default-text"
                  >
                    بستن منو
                  </button>
                }
              >
                <div className="flex flex-col gap-8">{sidebarContent}</div>
              </DrawerComponent>
            </div>
            <ImageFallback
              src={currentUser?.profilePicture ?? profileFallBack}
              fallbackSrc={profileFallBack}
              alt="پروفایل"
              className="size-10 shrink-0 rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-col">
              {!isLoading ? (
                <p className="truncate text-base font-normal text-default-black sm:text-[20px]">
                  {currentUser?.fullName}
                </p>
              ) : (
                <Skeleton className="w-20 h-7.5 bg-neutral-500" />
              )}
              <span className="text-xs font-normal text-primary-500 dark:text-primary-800 sm:text-sm">
                {userRole === "buyer" ? "( خریدار )" : "( فروشنده )"}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link href="/" className="rounded-full">
              <ButtonOnlyIcon size="sm" variant="primary" hasIcon={false}>
                <HugeiconsIcon
                  icon={Home07Icon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </ButtonOnlyIcon>
            </Link>
          </div>
        </header>
        <main className="flex-1 shrink-0 w-full rounded-[40px] border border-neutral-300 bg-neutral-200 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PanelLayout;
