export interface ICommentUser {
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

export interface ICommentHouse {
  id: string;
  title: string;
  address: string;
}

export interface ISellerComment {
  id: string;
  house_id: string;
  title: string;
  caption: string;
  rating: string;
  created_at: string;
  parent_comment_id: string | null;
  user: ICommentUser;
  house: ICommentHouse;
}

export interface ISellerCommentDetail extends ISellerComment {
  parent_comment: ISellerComment | null;
}

export interface ICommentsResponse {
  comments: ISellerComment[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export type RatingFilter = "all" | "1" | "2" | "3" | "4" | "5";

export type TypeFilter = "all" | "customers" | "mine";

export interface ICommentsQuery {
  page: number;
  perPage: number;
  search: string;
  rating: RatingFilter;
  type: TypeFilter;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface ICommentFormValues {
  title: string;
  caption: string;
}
