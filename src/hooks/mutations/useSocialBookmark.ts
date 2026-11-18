"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "react-toastify";

import {
  getSocialBookmarkByHouseIdAction,
  createSocialBookmarkAction,
  updateSocialBookmarkAction,
  deleteSocialBookmarkAction,
  type CreateBookmarkPayload,
  type UpdateBookmarkPayload,
  type SocialBookmark,
} from "@/app/actions/bookmark.actions";

function extractBookmark(response: any): SocialBookmark | null {
  if (!response) return null;

  const data = response.data ?? response;
  const bookmark =
    data?.bookmark ??
    data?.data?.bookmark ??
    data?.data ??
    data;

  if (!bookmark || !bookmark.id) return null;

  return {
    ...bookmark,
    note: bookmark.note ?? "",
    shareUrl: data?.shareUrl ?? bookmark.shareUrl ?? "",
  };
}

export function useHouseBookmark(houseId: number | string) {
  const queryClient = useQueryClient();

  const queryKey = ["house-bookmark", String(houseId)];

  const bookmarkQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getSocialBookmarkByHouseIdAction(houseId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return extractBookmark(result.data);
    },
    enabled: Boolean(houseId),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: CreateBookmarkPayload) => {
      const result = await createSocialBookmarkAction(payload);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      toast.success("نشان‌شده با موفقیت ثبت شد");
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ثبت نشان‌شده");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateBookmarkPayload) => {
      const result = await updateSocialBookmarkAction(payload);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      toast.success("نشان‌شده با موفقیت ویرایش شد");
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ویرایش نشان‌شده");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      const result = await deleteSocialBookmarkAction(id);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
    onSuccess: async () => {
      toast.success("نشان‌شده حذف شد");
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در حذف نشان‌شده");
    },
  });

  return {
    bookmark: bookmarkQuery.data ?? null,
    isLoading: bookmarkQuery.isLoading,
    isError: bookmarkQuery.isError,
    error: bookmarkQuery.error,
    refetch: bookmarkQuery.refetch,

    createBookmark: createMutation.mutateAsync,
    updateBookmark: updateMutation.mutateAsync,
    deleteBookmark: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}