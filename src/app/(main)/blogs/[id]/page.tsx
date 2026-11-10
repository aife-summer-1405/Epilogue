import React, { Suspense } from "react";
import BlogDetailContent from "@/components/organisms/blogs/BlogDetailContent";

interface BlogDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "جزئیات مقاله | مشاور املاک",
  description: "مطالعه کامل مقاله و بررسی مقالات مرتبط در حوزه املاک و گردشگری",
};

async function BlogContent({ params }: BlogDetailPageProps) {
  const { id } = await params;
  return <BlogDetailContent blogId={id} />;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  return (
    <main
      className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-6 md:px-8 md:py-8"
      dir="rtl"
    >
      <Suspense
        fallback={
          <div className="flex h-100 w-full items-center justify-center">
            <span className="text-lg text-neutral-500">
              در حال بارگذاری مقاله...
            </span>
          </div>
        }
      >
        <BlogContent params={params} />
      </Suspense>
    </main>
  );
}
