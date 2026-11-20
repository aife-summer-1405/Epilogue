import { TravelerDetails } from "../../BookingFilter/booking";

export type FinanceStatus = "pending" | "completed" | "failed" | "refunded";

export type FinanceParams = {
  page: string;
  limit: string;
  sort: string | null;
  order: string | null;
  status: FinanceStatus | null;
};

export interface IFinanceBooking {
  id: number;
  user_id: number;
  houseId: string;
  reservedDates: string[];
  traveler_details: TravelerDetails[];
  status: string;
  sharedEmail: string;
  sharedMobile: string;
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
  house: {
    id: string;
    title: string;
    sellerId: string;
    sellerName: string;
  };
}

export interface IFinance {
  id: string;
  userId: string;
  bookingId: number;
  amount: string;
  description: string;
  status: string;
  paymentUrl: string;
  transactionId: null;
  createdAt: null;
  updatedAt: null;
  booking: IFinanceBooking;
}

export interface IFinanceList {
  payments: IFinance[];
  totalCount: number;
}
