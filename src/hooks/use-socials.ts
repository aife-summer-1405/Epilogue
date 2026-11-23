"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createSocialMediaLinkAction,
  deleteSocialMediaLinkAction,
  getSocialMediaLinksAction,
  updateSocialMediaLinkAction,
} from "@/app/actions/admin/socials.action";
import {
  SocialMediaFilters,
  SocialMediaMutationPayload,
} from "@/core/types/social";

export const SOCIALS_QUERY_KEY = ["social-media-links"];

export function useSocialMediaLinks(filters: SocialMediaFilters) {
  return useQuery({
    queryKey: [...SOCIALS_QUERY_KEY, filters],
    queryFn: () => getSocialMediaLinksAction(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateSocialMediaLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SocialMediaMutationPayload) =>
      createSocialMediaLinkAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIALS_QUERY_KEY });
      toast.success("شبکه اجتماعی جدید با موفقیت اضافه شد");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "خطا در افزودن شبکه اجتماعی"
      );
    },
  });
}

export function useUpdateSocialMediaLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SocialMediaMutationPayload;
    }) => updateSocialMediaLinkAction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIALS_QUERY_KEY });
      toast.success("شبکه اجتماعی با موفقیت ویرایش شد");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "خطا در ویرایش شبکه اجتماعی"
      );
    },
  });
}

export function useDeleteSocialMediaLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSocialMediaLinkAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOCIALS_QUERY_KEY });
      toast.success("شبکه اجتماعی با موفقیت حذف شد");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "خطا در حذف شبکه اجتماعی"
      );
    },
  });
}