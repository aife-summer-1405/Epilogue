
export interface HouseComment {
  id: string;
  house_id: string;
  title: string;
  caption: string;
  rating: string | number;
  created_at: string;
  parent_comment_id: string | null;
  user: {
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
  parent_comment: HouseComment | null;
}

export interface HouseCommentsResponse {
  comments: HouseComment[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
