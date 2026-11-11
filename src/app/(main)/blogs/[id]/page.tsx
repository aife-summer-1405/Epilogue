import React, { FC, Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BlogDetailContent from "@/components/organisms/blogs/BlogDetailContent";
import {
  getBlogById,
  getBlogs,
  GetBlogsParams,
} from "@/services/blogs/blogs.service";

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "جزئیات مقاله | مشاور املاک",
  description: "مطالعه کامل مقاله و بررسی مقالات مرتبط در حوزه املاک و گردشگری",
};

const RELATED_BLOGS_PARAMS: GetBlogsParams = {
  page: 1,
  limit: 12,
  sort: "created_at",
  order: "DESC",
};

async function BlogDetailHydration({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["blog-detail", String(id)],
      queryFn: () => getBlogById(id),
    }),
    queryClient.prefetchQuery({
      queryKey: ["blogs-list", RELATED_BLOGS_PARAMS],
      queryFn: () => getBlogs(RELATED_BLOGS_PARAMS),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogDetailContent blogId={id} />
    </HydrationBoundary>
  );
}

const BlogDetailPage: FC<BlogDetailPageProps> = ({ params }) => {
  return (
    <main
      className="mx-auto flex w-full max-w-11/12 flex-col items-center gap-12 py-6 lg:max-w-10/12 xl:max-w-11/12"
      dir="rtl"
    >
      <Suspense
        fallback={
          <div className="flex w-full flex-col gap-8" dir="rtl">
            <div className="mx-auto h-5 w-64 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-800" />
            <div className="aspect-video max-h-125 w-full animate-pulse rounded-[32px] bg-gray-200 dark:bg-zinc-800" />
          </div>
        }
      >
        <BlogDetailHydration params={params} />
      </Suspense>
    </main>
  );
};

export default BlogDetailPage;
