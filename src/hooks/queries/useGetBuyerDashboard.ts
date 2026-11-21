import { useQuery } from "@tanstack/react-query";
import { getBuyerDashboardDataAction } from "@/app/actions/panel/buyer/buyerDashboard.actions";

export const BUYER_DASHBOARD_QUERY_KEY = "buyer-dashboard";

export const useGetBuyerDashboard = () => {
  return useQuery({
    queryKey: [BUYER_DASHBOARD_QUERY_KEY],
    queryFn: () => getBuyerDashboardDataAction(),
    staleTime: 1000 * 60 * 2,
  });
};