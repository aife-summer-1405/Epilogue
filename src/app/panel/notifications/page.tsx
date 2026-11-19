import React, { Suspense } from "react";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import BuyerNotificationsContainer from "@/components/organisms/panel/buyer/notifications/BuyerNotificationsContainer";
import { getUserNotificationsAction } from "@/app/actions/panel/buyer/notifications.actions";
import { NOTIFICATIONS_QUERY_KEY } from "@/hooks/queries/useGetNotifications";
import { IGetNotificationsParams } from "@/core/types/notifications/notifications.types";

interface NotificationsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    type?: string;
  }>;
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 10;
  const status = resolvedParams.status || "all";

  const queryParams: IGetNotificationsParams = {
    page,
    limit,
    sort: "createdAt",
    order: "DESC",
    isRead: status === "unread" ? false : status === "read" ? true : undefined,
    type: resolvedParams.type || undefined,
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, queryParams],
    queryFn: () => getUserNotificationsAction(queryParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="h-135 w-full animate-pulse rounded-[28px] bg-white p-6 dark:bg-[#272727]" />
        }
      >
        <BuyerNotificationsContainer />
      </Suspense>
    </HydrationBoundary>
  );
}
