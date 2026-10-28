import React from "react";
import Link from "next/link";
import BlogsContent from "@/components/organisms/blogs/BlogsContent";

export const metadata = {
  title: "مقالات و اخبار | مشاور املاک",
  description: "جدیدترین مقالات، راهنمای گردشگری و اخبار بازار مسکن",
};

const BreadcrumbArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="h-3.5 w-3.5 shrink-0 text-gray-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);

export default function BlogsPage() {
  return (
    <main
      className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-6 md:px-8 md:py-8"
      dir="rtl"
    >
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium text-gray-400 md:mb-8 md:gap-2 md:text-sm"
      >
        <Link
          href="/"
          className="transition-colors hover:text-gray-700 dark:hover:text-gray-200"
        >
          خانه
        </Link>
        <BreadcrumbArrow />
        <span className="font-bold text-blue-700 dark:text-blue-400">
          مقالات و وبلاگ
        </span>
      </nav>
      <BlogsContent />
    </main>
  );
}
