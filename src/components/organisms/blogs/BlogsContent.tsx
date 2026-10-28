"use client";

import React, { useMemo, useState, useCallback } from "react";
import Pagination from "@/components/molecules/Pagination";
import BlogCard from "@/components/molecules/blog-card/BlogCard";
import BlogsFilterSection from "./BlogsFilterSection";
import { useGetBlogs } from "@/hooks/queries/useGetBlogs";
import { BlogItem, GetBlogsParams } from "@/services/blogs/blogs.service";
import { IFilterInputs } from "../../molecules/inputs/filterInput/IFilterInput";

const CATEGORY_NAMES_MAP: Record<string, string> = {
  "1": "رهن و اجاره",
  "2": "گردشگری",
  "3": "راهنمای ملک",
  "4": "حقوقی و قرارداد",
};

const INITIAL_PARAMS: GetBlogsParams = {
  page: 1,
  limit: 12,
  sort: "created_at",
  order: "DESC",
};

const normalizePersian = (str?: string) => {
  if (!str) return "";
  return str
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .trim()
    .toLowerCase();
};

const BlogsContent: React.FC = () => {
  const [queryParams, setQueryParams] =
    useState<GetBlogsParams>(INITIAL_PARAMS);

  const apiParams = useMemo(() => {
    const { title, ...rest } = queryParams;
    return rest;
  }, [queryParams]);

  const { data, isLoading, isError, isFetching } = useGetBlogs(apiParams);

  const categoryOptions = useMemo<IFilterInputs[]>(() => {
    const map = new Map<string, string>();

    Object.entries(CATEGORY_NAMES_MAP).forEach(([id, label]) => {
      map.set(id, label);
    });

    data?.data?.forEach((item) => {
      if (item.category_id) {
        const idStr = String(item.category_id);
        if (!map.has(idStr)) {
          map.set(idStr, `دسته‌بندی ${idStr}`);
        }
      }
    });

    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [data?.data]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<GetBlogsParams>) => {
      setQueryParams((prev) => ({
        ...prev,
        ...newFilters,
        page: 1,
      }));
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setQueryParams(INITIAL_PARAMS);
  }, []);

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMoreMobile = () => {
    setQueryParams((prev) => ({
      ...prev,
      limit: (prev.limit || 12) + 12,
    }));
  };

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

  const filteredBlogsList = useMemo(() => {
    const rawList = data?.data || [];
    const searchQuery = normalizePersian(queryParams.title);

    if (!searchQuery) return rawList;

    return rawList.filter((blog) => {
      const normalizedTitle = normalizePersian(blog.title);
      const normalizedCaption = normalizePersian(blog.caption);
      return (
        normalizedTitle.includes(searchQuery) ||
        normalizedCaption.includes(searchQuery)
      );
    });
  }, [data?.data, queryParams.title]);

  const totalPages = data?.totalPages || 1;

  return (
    <div className="flex w-full flex-col items-center" dir="rtl">
      <BlogsFilterSection
        filters={queryParams}
        categoryOptions={categoryOptions}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {isLoading && (
        <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-110 w-full animate-pulse rounded-[28px] bg-gray-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="my-16 text-center text-base font-bold text-red-500">
          خطا در دریافت لیست مقالات از سرور.
        </div>
      )}

      {!isLoading && !isError && filteredBlogsList.length > 0 && (
        <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogsList.map((blog: BlogItem) => {
            const imageSrc =
              blog.image || blog.thumbnail || blog.cover || blog.photos?.[0];
            const captionText =
              blog.caption ||
              blog.summary ||
              blog.description ||
              blog.content ||
              "";
            const readTime = blog.estimated_reading_time || blog.reading_time;

            const categoryTitle =
              typeof blog.category === "object"
                ? blog.category?.name || blog.category?.title
                : typeof blog.category === "string"
                  ? blog.category
                  : blog.category_id
                    ? CATEGORY_NAMES_MAP[String(blog.category_id)] ||
                      `دسته ${blog.category_id}`
                    : undefined;

            return (
              <BlogCard
                key={blog.id}
                id={blog.id}
                image={imageSrc}
                title={blog.title}
                caption={captionText}
                date={formatBlogDate(blog.created_at || blog.updated_at)}
                readingTime={
                  readTime
                    ? String(readTime).includes("دقیقه")
                      ? String(readTime)
                      : `${readTime} دقیقه`
                    : undefined
                }
                categoryName={categoryTitle}
              />
            );
          })}
        </div>
      )}

      {!isLoading && !isError && filteredBlogsList.length === 0 && (
        <div className="my-16 text-center text-base font-semibold text-gray-500 dark:text-gray-400">
          مقاله‌ای با این مشخصات یافت نشد!
        </div>
      )}

      {!isLoading &&
        !isError &&
        filteredBlogsList.length > 0 &&
        totalPages > 1 && (
          <div className="mt-8 mb-6 flex w-full justify-center md:hidden">
            <button
              type="button"
              onClick={handleLoadMoreMobile}
              disabled={isFetching}
              className="rounded-full border border-[#1e3a8a] bg-transparent px-8 py-2.5 text-sm font-bold text-[#1e3a8a] transition-colors hover:bg-blue-50 disabled:opacity-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-zinc-800"
            >
              {isFetching ? "در حال دریافت..." : "مشاهده بیشتر"}
            </button>
          </div>
        )}

      {!isLoading && !isError && totalPages > 1 && (
        <div className="mt-14 mb-8 hidden w-full justify-center md:flex">
          <Pagination
            currentPage={queryParams.page || 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default BlogsContent;
