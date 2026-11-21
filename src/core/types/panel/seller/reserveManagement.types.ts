export type ReservedStatus = "confirmed" | "pending" | "canceled";

export type ReserveSellerParams = {
  page: string;
  limit: string;
  sort: string | null;
  order: string | null;
  status: ReservedStatus | null;
  houseId: string | null;
};

export interface ITravelerDetail {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  nationalId: string;
}

export interface IReservedSellerItem {
  id: number;
  user_id: number;
  houseId: string;
  reservedDates: string[];
  traveler_details: ITravelerDetail[];
  status: "confirmed" | "unconfirmed" | "canceled" | string;
  createdAt: string;
  house: { title: string; price: string };
}

export interface IReservedSellerList {
  bookings: IReservedSellerItem[];
  totalCount: number;
}
