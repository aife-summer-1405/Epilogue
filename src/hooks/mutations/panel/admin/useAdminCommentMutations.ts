import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  updateAdminCommentAction,
  deleteAdminCommentAction,
} from "@/app/actions/admin/adminComments.actions";
import { IUpdateAdminCommentPayload } from "@/core/types/admin/adminComments.types";
import {
  ADMIN_COMMENTS_QUERY_KEY,
  ADMIN_COMMENT_DETAIL_QUERY_KEY,
} from "@/hooks/queries/useGetAdminComments";

export const useUpdateAdminComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateAdminCommentPayload) =>
      updateAdminCommentAction(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در ویرایش نظر");
        return;
      }
      toast.success("نظر با موفقیت ویرایش شد.");
      queryClient.invalidateQueries({ queryKey: [ADMIN_COMMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ADMIN_COMMENT_DETAIL_QUERY_KEY],
      });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};

export const useDeleteAdminComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteAdminCommentAction(id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "خطا در حذف نظر");
        return;
      }
      toast.success("نظر با موفقیت حذف شد.");
      queryClient.invalidateQueries({ queryKey: [ADMIN_COMMENTS_QUERY_KEY] });
    },
    onError: () => {
      toast.error("خطا در برقراری ارتباط با سرور");
    },
  });
};
