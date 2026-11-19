import { useQuery } from "@tanstack/react-query";
import { getSellerDashboardDataAction } from "@/app/actions/panel/seller/sellerDashboard.actions";

export const SELLER_DASHBOARD_QUERY_KEY = "seller-dashboard";

export const useGetSellerDashboard = () => {
  return useQuery({
    queryKey: [SELLER_DASHBOARD_QUERY_KEY],
    queryFn: () => getSellerDashboardDataAction(),
    staleTime: 1000 * 60 * 2,
  });
};