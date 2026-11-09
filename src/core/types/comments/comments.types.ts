export interface ICreateCommentPayload {
  house_id: number;
  title: string;
  caption: string;
  rating: number;
  parent_comment_id: number | null;
}
