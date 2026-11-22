import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createSocialMediaLinkAction,
  updateSocialMediaLinkAction,
  deleteSocialMediaLinkAction,
} from "@/app/actions/admin/socialMedia.actions";
import {
  ICreateSocialMediaPayload,
  IUpdateSocialMediaPayload,
} from "@/core/types/admin/socialMedia.types";
import { SOCIAL_MEDIA_QUERY_KEY } from "@/hooks/queries/useGetSocialMediaLinks";

export const useCreateSocialMediaLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateSocialMediaPayload) =>
      createSocialMediaLinkAction(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در افزودن لینک");
        return;
      }
      toast.success("لینک شبکه اجتماعی با موفقیت اضافه شد.");
      queryClient.invalidateQueries({ queryKey: [SOCIAL_MEDIA_QUERY_KEY] });
    },
    onError: () => toast.error("خطا در برقراری ارتباط با سرور"),
  });
};

export const useUpdateSocialMediaLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateSocialMediaPayload) =>
      updateSocialMediaLinkAction(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در ویرایش لینک");
        return;
      }
      toast.success("لینک شبکه اجتماعی با موفقیت ویرایش شد.");
      queryClient.invalidateQueries({ queryKey: [SOCIAL_MEDIA_QUERY_KEY] });
    },
    onError: () => toast.error("خطا در برقراری ارتباط با سرور"),
  });
};

export const useDeleteSocialMediaLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteSocialMediaLinkAction(id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در حذف لینک");
        return;
      }
      toast.success("لینک شبکه اجتماعی با موفقیت حذف شد.");
      queryClient.invalidateQueries({ queryKey: [SOCIAL_MEDIA_QUERY_KEY] });
    },
    onError: () => toast.error("خطا در برقراری ارتباط با سرور"),
  });
};