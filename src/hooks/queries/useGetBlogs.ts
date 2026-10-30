import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getBlogs, GetBlogsParams } from "@/services/blogs/blogs.service";

export const useGetBlogs = (params: GetBlogsParams) => {
  return useQuery({
    queryKey: ["blogs-list", params],
    queryFn: () => getBlogs(params),
    placeholderData: keepPreviousData,
  });
};