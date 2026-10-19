import { getComments } from "@/features/example/services/api/commnents/comments.service";
import { useQuery } from "@tanstack/react-query";

export const useComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
  });
};