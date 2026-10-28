"use server";

import api from "@/lib/http/interceptors";

// src/types/house.ts
export interface IHouse {
  id: string;
  title: string;
  address: string;
  photos: string[];
  rate: string;
  discounted_price: string | null;
  price: string;
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
  discount_id: string | null;
  transaction_type: string;
  sellerId: string;
  sellerName: string;
  caption: string | null;
  bookings: number;
  favoriteId: string | null;
  isFavorite: boolean;
}

export interface IHousesResponse {
  houses: IHouse[];
  totalCount: number;
}

export async function getHouses(filters: {
  [key: string]: string | string[] | undefined;
}): Promise<IHousesResponse> {
  try {
    const res = await api.get("/houses", { params: filters });
    return res.data as IHousesResponse;
  } catch {
    throw new Error("دریافت خانه ها با خطا روبرو شد");
  }
}
