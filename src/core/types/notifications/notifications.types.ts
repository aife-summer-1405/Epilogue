export interface INotificationDataPayload {
  offerId?: number | string;
  [key: string]: unknown;
}

export interface INotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: string;
  data?: INotificationDataPayload;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IGetNotificationsParams {
  page?: number;
  limit?: number;
  sort?: "createdAt" | "updatedAt";
  order?: "ASC" | "DESC";
  isRead?: boolean;
  type?: string;
}

export interface IGetNotificationsResponse {
  data: INotificationItem[];
  totalCount: number;
  totalPages?: number;
}

export interface ISendNotificationPayload {
  room: string;
  notification: {
    userId?: number | string;
    title: string;
    message: string;
    type?: string;
    data?: INotificationDataPayload;
  };
}
