import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUserNotificationsAction } from "@/app/actions/panel/buyer/notifications.actions";
import { IGetNotificationsParams } from "@/core/types/notifications/notifications.types";

export const NOTIFICATIONS_QUERY_KEY = "buyer-notifications";

export const useGetNotifications = (params: IGetNotificationsParams) => {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => getUserNotificationsAction(params),
    placeholderData: keepPreviousData,
  });
};
