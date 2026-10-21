import { getComments } from "@/services/landing/comments.service";
import { useQuery } from "@tanstack/react-query";

export const useComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
  });
};
