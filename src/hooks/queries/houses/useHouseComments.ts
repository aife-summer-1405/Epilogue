"use client";

import {
  createCommentAction,
  deleteCommentAction,
  IUpdateCommentPayload,
  updateCommentAction,
} from "@/app/actions/comment/comment.actions";
import { ICreateCommentPayload } from "@/core/types/comments/comments.types";
import { getHouseComments } from "@/services/landing/house.service";
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
    mutationFn: async (payload: ICreateCommentPayload) => {
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

export function useUpdateComment(houseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number | string;
      payload: IUpdateCommentPayload;
    }) => {
      const result = await updateCommentAction(id, payload);

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

export function useDeleteComment(houseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const result = await deleteCommentAction(id);

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