"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Megaphone01Icon,
  Menu01Icon,
  Cancel01Icon,
  User02Icon,
  Sun01Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import { UserProfileBadge } from "@/components/molecules";
import HomeLogo from "@/components/atoms/Logo/home-logo";
import ButtonOnlyIcon from "@/components/atoms/buttonOnlyIcon/buttonOnlyIcon";

export interface HeaderUser {
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
}

interface HeaderProps {
  isLoggedIn: boolean;
  user?: HeaderUser;
  onLoginClick?: () => void;
  onProfileClick?: () => void;
  onSellerClick?: () => void;
}

const navItems = [
  { label: "خانه", href: "/" },
  { label: "رهن و اجاره", href: "/mortgage-rent" },
  { label: "رزرو سریع", href: "/fastReserve" },
  { label: "تماس با ما", href: "/contactUs" },
];

export default function Header({
  isLoggedIn,
  user,
  onLoginClick,
  onProfileClick,
  onSellerClick,
}: HeaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

      setScrollProgress(progress);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const renderAuthAction = () => {
    if (isLoggedIn && user) {
      return (
        <UserProfileBadge
          name={user.name}
          phoneNumber={user.phoneNumber}
          avatarUrl={user.avatarUrl}
          onClick={onProfileClick}
        />
      );
    }

    return (
      <Link href={"/auth/login"}>
        <Button variant="primary" size="sm" onClick={onLoginClick}>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <HugeiconsIcon icon={User02Icon} size={20} />
            ورود / ثبت نام
          </span>
        </Button>
      </Link>
    );
  };

  const renderSellerButton = () => (
    <Link href="/blogs">
      <Button variant="primary" size="sm" onClick={onSellerClick}>
        <span className="flex items-center gap-2 whitespace-nowrap">
          <HugeiconsIcon icon={Megaphone01Icon} size={24} />
          مهمترین اخبار!
        </span>
      </Button>
    </Link>
  );

  const renderThemeButton = () => (
    <ButtonOnlyIcon
      hasIcon={false}
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "فعال کردن تم روشن" : "فعال کردن تم تاریک"}
    >
      {mounted && (
        <HugeiconsIcon
          icon={theme === "dark" ? Sun01Icon : Moon02Icon}
          size={20}
          strokeWidth={1.8}
        />
      )}
    </ButtonOnlyIcon>
  );

  const renderNavItems = (mobile = false) =>
    navItems.map((item) => {
      const isActive =
        pathname === item.href &&
        !(item.href === "/villas" && pathname !== "/villas");

      return (
        <Link
          key={item.label}
          href={item.href}
          onClick={mobile ? closeMenu : undefined}
          aria-current={isActive ? "page" : undefined}
          className={`flex ${
            mobile
              ? "min-h-11 items-center justify-between rounded-lg px-3 py-2 font-medium"
              : "shrink-0 items-center gap-1.5 whitespace-nowrap pr-5"
          } text-sm transition-colors hover:text-primary-500 ${
            isActive ? "text-primary-500" : "text-neutral-950 dark:text-white"
          }`}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <>
      <header
        className={`
    z-50 w-full transition-all duration-300
    ${
      isScrolled
        ? "fixed inset-x-0 top-0 bg-white px-10 md:px-20 pt-6 pb-10 shadow-sm dark:bg-neutral-950"
        : `
          px-4 py-6 sm:px-6 sm:py-8 lg:px-20
          ${pathname === "/" ? "absolute inset-x-0 top-0" : "relative"}
        `
    }
  `}
      >
        <div className="mx-auto flex w-full items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="صفحه اصلی"
            className="shrink-0"
            onClick={closeMenu}
          >
            <HomeLogo />
          </Link>

          <nav
            aria-label="منوی اصلی"
            className="hidden min-w-0 items-center gap-3 rounded-full bg-[#EDEDED] p-2 text-neutral-950 dark:bg-[#272727] dark:text-white min-[1071px]:flex lg:gap-5"
          >
            {renderNavItems()}
            {renderSellerButton()}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 min-[1071px]:flex">
            {mounted && renderThemeButton()}
            {renderAuthAction()}
          </div>

          <div className="flex shrink-0 items-center gap-2 min-[1071px]:hidden">
            {renderAuthAction()}

            <ButtonOnlyIcon
              size="sm"
              hasIcon={false}
              onClick={() => setIsMenuOpen(true)}
              aria-label="باز کردن منو"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              <HugeiconsIcon icon={Menu01Icon} size={22} />
            </ButtonOnlyIcon>
          </div>
        </div>
        {isScrolled && (
          <div className="absolute inset-x-0 bottom-0 h-3.5 bg-[#D9D9D9]">
            <div
              className="h-full bg-primary-500 transition-[width] duration-100"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        )}
      </header>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          dir="rtl"
          className="fixed inset-0 z-50 flex h-dvh w-full flex-col overflow-y-auto bg-primary-50 px-5 pt-8 pb-5 text-neutral-950 min-[1071px]:hidden"
        >
          {/* Menu Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#8B8D98] bg-primary-50 pb-5">
            <Link
              href="/"
              aria-label="صفحه اصلی"
              onClick={closeMenu}
              className="shrink-0"
            >
              <HomeLogo />
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="بستن منو"
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-neutral-950 dark:text-white"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={24} />
            </button>
          </div>

          <nav aria-label="منوی موبایل" className="flex flex-col gap-3 pt-5">
            {renderNavItems(true)}
          </nav>
        </div>
      )}
    </>
  );
}
