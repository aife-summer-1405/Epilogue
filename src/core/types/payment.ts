export type PaymentStatus = "pending" | "completed" | "failed" | string;

export interface Payment {
  id: string;
  userId: string;
  bookingId: number | null;
  amount: string;
  description: string;
  status: PaymentStatus;
  paymentUrl: string;
  transactionId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaymentsResponse {
  data: Payment[];
  totalCount: number;
}

export interface PaymentFilters {
  page: number;
  limit: number;
  sort?: string;
  order?: "ASC" | "DESC";
  status?: string;
  userId?: string;
  amount?: string;
}

export interface UpdatePaymentPayload {
  amount: number;
  status: string;
  description: string;
  transactionId: string;
}

export interface VerifyPaymentPayload {
  token: string;
}