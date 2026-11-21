"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotificationsAction } from "@/app/actions/admin/notifications";
import { NotificationsFilters, NotificationsResponse } from "@/core/types/notification";

export const notificationsKeys = {
  all: ["notifications"] as const,
  list: (filters: NotificationsFilters) =>
    [...notificationsKeys.all, "list", filters] as const,
};

export function useNotifications(
  filters: NotificationsFilters = {},
  initialData?: NotificationsResponse
) {
  const normalizedFilters: NotificationsFilters = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    userId: filters.userId ?? "",
    type: filters.type ?? "all",
    isRead: filters.isRead ?? "all",
    search: filters.search ?? "",
  };

  return useQuery({
    queryKey: notificationsKeys.list(normalizedFilters),
    queryFn: async () => {
      const result = await getNotificationsAction(normalizedFilters);
      if (!result.success) {
        throw new Error(result.error || "خطا در بارگذاری اعلانات");
      }
      return result.data;
    },
    initialData,
    placeholderData: (prev) => prev,
  });
}