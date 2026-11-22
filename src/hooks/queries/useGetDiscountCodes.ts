import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getDiscountCodesAction } from "@/app/actions/admin/discountCodes.actions";
import { IGetDiscountCodesParams } from "@/core/types/admin/discountCodes.types";

export const DISCOUNT_CODES_QUERY_KEY = "admin-discount-codes";

export const useGetDiscountCodes = (params: IGetDiscountCodesParams) => {
  return useQuery({
    queryKey: [DISCOUNT_CODES_QUERY_KEY, params],
    queryFn: () => getDiscountCodesAction(params),
    placeholderData: keepPreviousData,
  });
};