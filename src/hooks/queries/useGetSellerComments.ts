import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getSellerCommentsAction,
  getSellerCommentByIdAction,
  getCurrentSellerUserAction,
  IGetSellerCommentsParams,
} from "@/app/actions/panel/seller/sellerComments.actions";

export const SELLER_COMMENTS_QUERY_KEY = "seller-comments";
export const SELLER_COMMENT_DETAIL_QUERY_KEY = "seller-comment-detail";
export const SELLER_CURRENT_USER_QUERY_KEY = "seller-current-user";

export const useGetSellerComments = (params: IGetSellerCommentsParams) => {
  return useQuery({
    queryKey: [SELLER_COMMENTS_QUERY_KEY, params],
    queryFn: () => getSellerCommentsAction(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetSellerCommentById = (id?: string | null) => {
  return useQuery({
    queryKey: [SELLER_COMMENT_DETAIL_QUERY_KEY, id],
    queryFn: () => getSellerCommentByIdAction(id as string),
    enabled: Boolean(id),
  });
};

export const useGetCurrentSellerUser = () => {
  return useQuery({
    queryKey: [SELLER_CURRENT_USER_QUERY_KEY],
    queryFn: () => getCurrentSellerUserAction(),
    staleTime: 1000 * 60 * 10,
  });
};