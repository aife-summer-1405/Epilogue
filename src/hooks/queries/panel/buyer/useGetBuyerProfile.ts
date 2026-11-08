import { useQuery } from "@tanstack/react-query";
import { getBuyerProfileAction } from "@/app/actions/panel/buyer/buyerProfile.actions";

export const useGetBuyerProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["buyer-profile", userId],
    queryFn: () => getBuyerProfileAction(userId),
  });
};