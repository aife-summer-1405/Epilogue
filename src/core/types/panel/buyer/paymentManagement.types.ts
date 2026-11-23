export type PaymentStatus = "pending" | "completed";

export type PaymentParams = {
  page: string;
  limit: string;
  sort: string | null;
  order: string | null;
  status: PaymentStatus | null;
};

export interface PaymentDetail {
  id: string;
  userId: string;
  bookingId: number;
  amount: string;
  description: string | null;
  status: PaymentStatus;
  paymentUrl: string;
  transactionId: null | string;
  createdAt: null | string;
  updatedAt: null | string;
}

export type PayRequestBody = {
  amount: number;
  description: string;
  callbackUrl: string;
  bookingId: number | string;
};
