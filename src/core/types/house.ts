export type TransactionType =
  | "rental"
  | "mortgage"
  | "reservation"
  | "direct_purchase";

export interface HouseLocation {
  lat: number;
  lng: number;
}

export interface HouseCategory {
  name: string;
}

export interface House {
  id: string;
  title: string;
  address: string;
  photos: string[];
  rate: string | number;
  discounted_price?: string | number | null;
  price: string | number;
  tags: string[];
  last_updated: string;
  capacity: number;
  location: HouseLocation;
  categories: HouseCategory;
  bathrooms: number;
  parking: number;
  rooms: number;
  yard_type: string;
  num_comments: number;
  discount_id?: number | string | null;
  transaction_type: TransactionType;
  sellerId: string;
  sellerName?: string;
  caption: string | null;
}

export interface HousesListResponse {
  data: House[];
  totalCount: number;
}

export interface HouseFilters {
  page: number;
  limit: number;
  sort: string;
  order: "ASC" | "DESC";
  sellerId: string;
  price: string;
}

export interface UpdateHousePayload {
  title: string;
  address: string;
  rate: number;
  price: number;
  photos: string[];
  tags: string[];
  last_updated: string;
  capacity: number;
  location: {
    lat: number;
    lng: number;
  };
  categories: {
    name: string;
  };
  bathrooms: number;
  parking: number;
  rooms: number;
  yard_type: string;
  num_comments: number;
  transaction_type: TransactionType;
  caption: string | null;
}