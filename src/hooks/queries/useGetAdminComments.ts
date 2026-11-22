import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getAdminCommentsAction,
  getAdminCommentByIdAction,
} from "@/app/actions/admin/adminComments.actions";
import { IGetAdminCommentsParams } from "@/core/types/admin/adminComments.types";

export const ADMIN_COMMENTS_QUERY_KEY = "admin-comments";
export const ADMIN_COMMENT_DETAIL_QUERY_KEY = "admin-comment-detail";

export const useGetAdminComments = (params: IGetAdminCommentsParams) => {
  return useQuery({
    queryKey: [ADMIN_COMMENTS_QUERY_KEY, params],
    queryFn: () => getAdminCommentsAction(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetAdminCommentById = (id?: string | null) => {
  return useQuery({
    queryKey: [ADMIN_COMMENT_DETAIL_QUERY_KEY, id],
    queryFn: () => getAdminCommentByIdAction(id as string),
    enabled: Boolean(id),
  });
};
