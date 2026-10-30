"use client";

import { createCommentAction } from "@/app/actions/comment/comment.actions";
import {
  getHouseComments,
  CreateCommentPayload,
} from "@/features/example/services/api/houses/house.service";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
    mutationFn: async (payload: CreateCommentPayload) => {
      const result = await createCommentAction(payload);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["house-comments", houseId],
        refetchType: "all",
      });
    },
  });
}