export interface ContactMessageItem {
  id: string;
  title: string;
  message: string;
}

export interface GetContactMessagesResponse {
  data: ContactMessageItem[];
  totalCount: number;
}

export interface GetContactMessagesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  title?: string;
}