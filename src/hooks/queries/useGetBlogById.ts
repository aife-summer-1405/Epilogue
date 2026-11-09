import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "@/services/blogs/blogs.service";

export const useGetBlogById = (id: string | number) => {
  return useQuery({
    queryKey: ["blog-detail", String(id)],
    queryFn: () => getBlogById(id),
    enabled: Boolean(id),
  });
};