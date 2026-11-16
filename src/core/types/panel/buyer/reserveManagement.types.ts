export type ReservedStatus = "confirmed" | "pending" | "canceled";

export type ReservedParams = {
  page: string;
  limit: string;
  sort: string | null;
  order: string | null;
  status: ReservedStatus | null;
};

export type ReservedDetail = string;
export type HouseDetail = string;

export type TravelersDetails = {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  nationalId: string;
};

export interface IReserved {
  id: number;
  user_id: number;
  houseId: string;
  reservedDates: string[];
  traveler_details: TravelersDetails[];
  status: ReservedStatus;
  sharedEmail: string;
  sharedMobile: string;
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
  house: {
    title: string;
    price: string;
  };
}

export interface IReservedList {
  data: IReserved[];
  totalCount: number;
}

export interface IHouseDetail {
  id: string;
  title: string;
  address: string;
  photos: string[];
  rate: string;
  discounted_price: string | null;
  price: string;
  tags: string[];
  capacity: number;
  categories: { name: string };
  bathrooms: number;
  parking: number;
  rooms: number;
  yard_type: string | null;
  caption: string | null;
}

export interface IReservedUpdateBody {
  houseId: string;
  reservedDates: string[];
  traveler_details: TravelersDetails[];
  status: string;
  sharedEmail: string;
  sharedMobile: string;
}
