import React from "react";
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

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;

  return (
    <main
      className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-6 md:px-8 md:py-8"
      dir="rtl"
    >
      <BlogDetailContent blogId={id} />
    </main>
  );
}
