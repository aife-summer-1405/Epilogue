import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getBuyerFavoritesAction,
  IGetBuyerFavoritesParams,
} from "@/app/actions/panel/buyer/buyerFavorites.actions";

export const BUYER_FAVORITES_QUERY_KEY = "buyer-favorites";

export const useGetBuyerFavorites = (params: IGetBuyerFavoritesParams) => {
  return useQuery({
    queryKey: [BUYER_FAVORITES_QUERY_KEY, params],
    queryFn: () => getBuyerFavoritesAction(params),
    placeholderData: keepPreviousData,
  });
};