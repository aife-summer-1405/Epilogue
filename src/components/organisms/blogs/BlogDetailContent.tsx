"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Clock01Icon,
  Link01Icon,
  Bookmark02Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import BlogCard from "@/components/molecules/blog-card/BlogCard";
import { useGetBlogById } from "@/hooks/queries/useGetBlogById";
import { useGetBlogs } from "@/hooks/queries/useGetBlogs";
import { BlogItem } from "@/services/blogs/blogs.service";

interface BlogDetailContentProps {
  blogId: string;
}

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1400&auto=format&fit=crop";

const CATEGORY_NAMES_MAP: Record<string, string> = {
  "1": "رهن و اجاره",
  "2": "گردشگری",
  "3": "راهنمای ملک",
  "4": "حقوقی و قرارداد",
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

const BlogDetailContent: React.FC<BlogDetailContentProps> = ({ blogId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const {
    data: blog,
    isLoading: isBlogLoading,
    isError: isBlogError,
  } = useGetBlogById(blogId);

  const { data: relatedData, isLoading: isRelatedLoading } = useGetBlogs({
    page: 1,
    limit: 12,
    sort: "created_at",
    order: "DESC",
  });

  const relatedBlogs = useMemo(() => {
    const all = relatedData?.data || [];
    const filtered = all.filter((item) => String(item.id) !== String(blogId));

    if (blog?.category_id) {
      const sameCategory = filtered.filter(
        (item) => String(item.category_id) === String(blog.category_id),
      );
      const others = filtered.filter(
        (item) => String(item.category_id) !== String(blog.category_id),
      );
      return [...sameCategory, ...others];
    }

    return filtered;
  }, [relatedData?.data, blogId, blog?.category_id]);

  const totalSlides = Math.max(1, Math.ceil(relatedBlogs.length / 3));
  const visibleRelatedBlogs = relatedBlogs.slice(
    activeSlide * 3,
    activeSlide * 3 + 3,
  );

  const formatBlogDate = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    try {
      const dayMonth = new Intl.DateTimeFormat("fa-IR", {
        day: "numeric",
        month: "long",
      }).format(d);
      const year = new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
      }).format(d);
      const time = new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d);
      return `${dayMonth} - ${year} / ${time}`;
    } catch {
      return dateString;
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (isBlogLoading) {
    return (
      <div className="flex w-full flex-col gap-8" dir="rtl">
        <div className="mx-auto h-5 w-64 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-800" />
        <div className="flex items-center justify-between">
          <div className="h-10 w-2/3 animate-pulse rounded-xl bg-gray-200 dark:bg-zinc-800" />
          <div className="h-10 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-800" />
        </div>
        <div className="aspect-video max-h-125 w-full animate-pulse rounded-[32px] bg-gray-200 dark:bg-zinc-800" />
        <div className="flex flex-col gap-4">
          <div className="h-6 w-1/3 animate-pulse rounded-lg bg-gray-200 dark:bg-zinc-800" />
          <div className="h-32 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (isBlogError || !blog) {
    return (
      <div
        className="my-20 flex flex-col items-center justify-center gap-4 text-center"
        dir="rtl"
      >
        <p className="text-lg font-bold text-red-500">
          مقاله مورد نظر یافت نشد یا خطایی در ارتباط با سرور رخ داده است.
        </p>
        <Link
          href="/blogs"
          className="rounded-full bg-[#1e3a8a] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-900"
        >
          بازگشت به لیست مقالات
        </Link>
      </div>
    );
  }

  const heroImage =
    blog.image ||
    blog.cover ||
    blog.thumbnail ||
    blog.photos?.[0] ||
    DEFAULT_HERO_IMAGE;
  const readTime = blog.estimated_reading_time || blog.reading_time;
  const formattedReadTime = readTime
    ? String(readTime).includes("دقیقه")
      ? String(readTime)
      : `${readTime} دقیقه`
    : undefined;
  const mainText =
    blog.content || blog.caption || blog.description || blog.summary || "";

  return (
    <div className="flex w-full flex-col" dir="rtl">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium text-gray-400 md:gap-2 md:text-sm"
      >
        <Link
          href="/"
          className="transition-colors hover:text-gray-700 dark:hover:text-gray-200"
        >
          خانه
        </Link>
        <BreadcrumbArrow />
        <Link
          href="/blogs"
          className="transition-colors hover:text-gray-700 dark:hover:text-gray-200"
        >
          مقالات و وبلاگ
        </Link>
        <BreadcrumbArrow />
        <span className="line-clamp-1 max-w-60 font-bold text-blue-700 dark:text-blue-400 sm:max-w-md">
          {blog.title}
        </span>
      </nav>

      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col items-start gap-3">
          <h1 className="text-right text-xl font-extrabold leading-relaxed text-gray-900 dark:text-white md:text-2xl lg:text-3xl">
            {blog.title}
          </h1>

          {blog.created_at && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 md:text-sm">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={18}
                strokeWidth={1.8}
              />
              <span>{formatBlogDate(blog.created_at)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
          {formattedReadTime && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e3a8a] px-3.5 py-1.5 text-xs font-medium text-white shadow-sm">
              <span className="relative top-[0.5px]">{formattedReadTime}</span>
              <HugeiconsIcon icon={Clock01Icon} size={15} strokeWidth={1.8} />
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBookmarked((prev) => !prev)}
              aria-label="ذخیره مقاله"
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                isBookmarked
                  ? "border-[#1e3a8a] bg-[#1e3a8a] text-white"
                  : "border-[#1e3a8a] bg-transparent text-[#1e3a8a] hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-zinc-800"
              }`}
            >
              <HugeiconsIcon
                icon={Bookmark02Icon}
                size={18}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="کپی لینک مقاله"
              title={copiedLink ? "لینک کپی شد!" : "کپی لینک"}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                copiedLink
                  ? "bg-green-600 text-white"
                  : "bg-[#1e3a8a] text-white hover:bg-blue-900"
              }`}
            >
              <HugeiconsIcon icon={Link01Icon} size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      <div className="relative mb-10 aspect-16/10 max-h-130 w-full overflow-hidden rounded-[28px] bg-gray-200 shadow-sm dark:bg-zinc-800 md:rounded-[36px]">
        <Image
          src={heroImage}
          alt={blog.title}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover"
        />
      </div>

      <article className="mb-12 flex flex-col gap-8 border-b border-gray-200 pb-12 dark:border-zinc-800">
        <div className="flex flex-col gap-4">
          <h2 className="text-right text-lg font-extrabold text-gray-800 dark:text-gray-100 md:text-xl">
            {blog.title}
          </h2>
          <p className="whitespace-pre-line text-justify text-sm leading-8 text-gray-600 dark:text-gray-300 md:text-base md:leading-9">
            {mainText}
          </p>
        </div>

        {blog.description && blog.description !== mainText && (
          <div className="flex flex-col gap-4">
            <p className="whitespace-pre-line text-justify text-sm leading-8 text-gray-600 dark:text-gray-300 md:text-base md:leading-9">
              {blog.description}
            </p>
          </div>
        )}
      </article>

      <section className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-right text-xl font-extrabold text-gray-900 dark:text-white md:text-2xl">
            مقالات مشابه
          </h2>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 transition-colors hover:border-[#1e3a8a] hover:text-[#1e3a8a] dark:border-zinc-700 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
          >
            <span>مشاهده همه</span>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
          </Link>
        </div>

        {isRelatedLoading && (
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-105 w-full animate-pulse rounded-[28px] bg-gray-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        )}

        {!isRelatedLoading && visibleRelatedBlogs.length > 0 && (
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleRelatedBlogs.map((item: BlogItem) => {
              const itemImage =
                item.image || item.thumbnail || item.cover || item.photos?.[0];
              const itemCaption =
                item.caption ||
                item.summary ||
                item.description ||
                item.content ||
                "";
              const itemReadTime =
                item.estimated_reading_time || item.reading_time;
              const categoryTitle =
                typeof item.category === "object"
                  ? item.category?.name || item.category?.title
                  : typeof item.category === "string"
                    ? item.category
                    : item.category_id
                      ? CATEGORY_NAMES_MAP[String(item.category_id)] ||
                        `دسته ${item.category_id}`
                      : undefined;

              return (
                <BlogCard
                  key={item.id}
                  id={item.id}
                  image={itemImage}
                  title={item.title}
                  caption={itemCaption}
                  date={formatBlogDate(item.created_at || item.updated_at)}
                  readingTime={
                    itemReadTime
                      ? String(itemReadTime).includes("دقیقه")
                        ? String(itemReadTime)
                        : `${itemReadTime} دقیقه`
                      : undefined
                  }
                  categoryName={categoryTitle}
                />
              );
            })}
          </div>
        )}

        {!isRelatedLoading && totalSlides > 1 && (
          <div className="mt-4 mb-6 flex items-center justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => {
              const isActive = idx === activeSlide;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`اسلاید ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-10 bg-[#1e3a8a] dark:bg-blue-500"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-zinc-700"
                  }`}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogDetailContent;
