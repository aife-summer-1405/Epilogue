"use client";

import { useState } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import {
  NotificationItem,
  NotificationsFilters,
  NotificationsResponse,
} from "@/core/types/notification";
import { NotificationsManagementTemplate } from "@/components/templates/NotificationsManagementTemplate";

interface NotificationsClientProps {
  initialData: NotificationsResponse;
  initialFilters: NotificationsFilters;
}

export function NotificationsClient({
  initialData,
  initialFilters,
}: NotificationsClientProps) {
  const [filters, setFilters] = useState<NotificationsFilters>(initialFilters);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  const { data, isFetching } = useNotifications(filters);

  const handleFilterChange = (next: Partial<NotificationsFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...next,
    }));
  };

  return (
    <>
      <NotificationsManagementTemplate
        response={data ?? initialData}
        filters={filters}
        isLoading={isFetching}
        onFilterChange={handleFilterChange}
        onSelectNotification={(item) => setSelectedNotification(item)}
      />

      {selectedNotification && null}
    </>
  );
}