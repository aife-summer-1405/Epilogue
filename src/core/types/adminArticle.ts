export interface AdminArticleItem {
  id: string | number;
  title: string;
  caption: string;
  estimated_reading_time: string;
  author_id: string | number;
  category_id: string | number;
  created_at?: string | null;
  createdAt?: string | null;
}

export interface AdminArticlesListResponse {
  data: AdminArticleItem[];
  totalCount: number;
  page?: number;
  limit?: number;
}

export interface AdminArticlesQueryParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "ASC" | "DESC";
  title?: string;
  author_id?: string;
  category_id?: string;
}

export interface CreateAdminArticlePayload {
  title: string;
  caption: string;
  estimated_reading_time: string;
  author_id: number;
  category_id: number;
}

export interface UpdateAdminArticlePayload extends CreateAdminArticlePayload {
  id: string | number;
}