import BookmarkDetail from "@/components/organisms/bookmark/BookmarkDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookmarkDetail bookmarkId={id} basePath="/buyer/bookmarks" />;
}