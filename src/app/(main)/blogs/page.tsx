import React, { FC, ReactNode, Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BreadCrumb from "@/components/molecules/breadcrumb/BreadCrumb";
import { IBreadCrumbsList } from "@/core/types/BreadCrumb/breadCrumb.types";
import BlogsContent from "@/components/organisms/blogs/BlogsContent";
import {
  getBlogs,
  parseBlogSearchParams,
  RawBlogFilters,
} from "@/services/blogs/blogs.service";

export const metadata = {
  title: "مقالات و اخبار | مشاور املاک",
  description: "جدیدترین مقالات، راهنمای گردشگری و اخبار بازار مسکن",
};

interface IProps {
  searchParams: Promise<RawBlogFilters>;
}

const breadcrumbList: IBreadCrumbsList[] = [
  { href: "/", label: "خانه" },
  { href: "/blogs", label: "مقالات و وبلاگ" },
];

async function BlogsHydration({
  searchParams,
  children,
}: IProps & { children: ReactNode }) {
  const resolvedParams = await searchParams;
  const apiParams = parseBlogSearchParams(resolvedParams);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["blogs-list", apiParams],
    queryFn: () => getBlogs(apiParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

const BlogsPage: FC<IProps> = ({ searchParams }) => {
  return (
    <main
      className="mx-auto flex w-full max-w-11/12 flex-col items-center gap-12 lg:max-w-10/12 xl:max-w-11/12"
      dir="rtl"
    >
      <BreadCrumb list={breadcrumbList} />
      <Suspense
        fallback={
          <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-110 w-full animate-pulse rounded-[28px] bg-gray-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        <BlogsHydration searchParams={searchParams}>
          <BlogsContent />
        </BlogsHydration>
      </Suspense>
    </main>
  );
};

export default BlogsPage;
