export interface NotificationDataPayload {
  offerId?: number | string;
  [key: string]: unknown;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: NotificationDataPayload | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationsResponse {
  data: NotificationItem[];
  totalCount: number;
}

export interface NotificationsFilters {
  page?: number;
  limit?: number;
  userId?: string;
  type?: string;
  isRead?: "all" | "read" | "unread";
  search?: string;
}

export interface NotificationsActionResult {
  success: boolean;
  data: NotificationsResponse;
  error?: string;
}