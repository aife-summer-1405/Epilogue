"use client";

import { CreateCommentPayload, getHouseComments, postComment } from "@/features/example/services/api/houses/house.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useHouseComments(id: string, page: number) {
  return useQuery({
    queryKey: ["house-comments", id, page],
    queryFn: () => getHouseComments(id, page),
    enabled: Boolean(id),
  });
}

export function usePostComment(houseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      postComment(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["house-comments", houseId],
      });
    },
  });
}