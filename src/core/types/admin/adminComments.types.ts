export interface IAdminCommentUser {
  firstName: string | null;
  lastName: string | null;
  profilePicture: string | null;
}

export interface IAdminCommentHouse {
  id: string;
  title: string;
  address: string;
}

export interface IAdminComment {
  id: string;
  house_id: string;
  title: string;
  caption: string;
  rating: string | number;
  created_at: string;
  parent_comment_id: string | null;
  user: IAdminCommentUser;
  house: IAdminCommentHouse;
}

export interface IGetAdminCommentsParams {
  page?: number;
  limit?: number;
  sort?: "created_at";
  order?: "ASC" | "DESC";
  user_id?: number | string;
  house_id?: number | string;
  rating?: number | string;
}

export interface IGetAdminCommentsResponse {
  data: IAdminComment[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface IUpdateAdminCommentPayload {
  id: string | number;
  title: string;
  caption: string;
  rating: number;
}
