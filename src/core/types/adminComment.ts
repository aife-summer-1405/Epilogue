export interface AdminCommentUser {
  id?: string | number;
  firstName?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
}

export interface AdminCommentHouse {
  id: string | number;
  title: string;
  address?: string | null;
}

export interface AdminCommentItem {
  id: string | number;
  house_id: string | number;
  user_id?: string | number | null;
  title: string;
  caption: string;
  rating: string | number;
  created_at?: string | null;
  createdAt?: string | null;
  parent_comment_id?: string | number | null;
  user?: AdminCommentUser | null;
  house?: AdminCommentHouse | null;
}

export interface AdminCommentsListResponse {
  data: AdminCommentItem[];
  totalCount: number;
  page?: number;
  limit?: number;
}

export interface AdminCommentsQueryParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "ASC" | "DESC";
  user_id?: string;
  house_id?: string;
  rating?: string;
}

export interface UpdateAdminCommentPayload {
  id: string | number;
  title: string;
  caption: string;
  rating: number;
}