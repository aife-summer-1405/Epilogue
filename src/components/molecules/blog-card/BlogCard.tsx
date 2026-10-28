"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import { cn } from "@/lib/utils";

export interface BlogCardProps {
  id: number | string;
  image?: string;
  title: string;
  caption: string;
  date: string;
  readingTime?: string;
  categoryName?: string;
  className?: string;
}

const DEFAULT_BLOG_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop";

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  image,
  title,
  caption,
  date,
  readingTime,
  categoryName,
  className,
}) => {
  const finalImage = image && image.trim() !== "" ? image : DEFAULT_BLOG_IMAGE;

  return (
    <article
      className={cn(
        "flex w-full flex-col justify-between overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-[#272727] dark:text-white",
        className,
      )}
      dir="rtl"
    >
      <div className="relative aspect-340/230 w-full overflow-hidden bg-gray-200 dark:bg-zinc-800">
        <Image
          src={finalImage}
          alt={title}
          fill
          loading="eager"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/75 via-black/30 to-transparent" />

        <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
          {readingTime && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e3a8a] px-3 py-1.5 text-xs font-medium text-white shadow-sm">
              <span className="relative top-[0.5px]">{readingTime}</span>
              <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.8} />
            </span>
          )}
          {categoryName && (
            <span className="inline-flex items-center justify-center rounded-full bg-[#1e3a8a] px-3.5 py-1.5 text-xs font-medium text-white shadow-sm">
              <span className="relative top-[0.5px]">{categoryName}</span>
            </span>
          )}
        </div>

        {date && (
          <div className="absolute right-3.5 bottom-3 flex items-center gap-1.5 text-xs font-medium text-white">
            <HugeiconsIcon icon={Calendar03Icon} size={18} strokeWidth={1.8} />
            <span className="relative top-px" dir="rtl">
              {date}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="flex flex-col gap-3">
          <h3 className="line-clamp-1 text-right text-xl font-extrabold text-gray-900 dark:text-white">
            {title}
          </h3>

          <p className="line-clamp-4 text-right text-sm leading-7 text-gray-500 dark:text-gray-300">
            {caption}
          </p>
        </div>

        <Link href={`/blogs/${id}`} className="mt-2 block w-full">
          <Button
            type="button"
            variant="primary"
            size="lg"
            hasIcon={false}
            className="h-12 w-full rounded-full bg-[#1e3a8a] text-sm font-bold text-white hover:bg-blue-900"
          >
            مشاهده جزئیات
          </Button>
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
