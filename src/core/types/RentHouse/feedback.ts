export interface Feedback {
  id?: number;
  userId: number;
  houseId: number;
  rating: number;
  comment: string;
  pointsAwarded: number;
  createdAt?: string;
}

export interface CreateFeedbackPayload {
  userId: number;
  houseId: number;
  rating: number;
  comment: string;
  pointsAwarded: number;
}