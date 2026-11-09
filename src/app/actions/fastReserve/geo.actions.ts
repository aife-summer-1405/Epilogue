"use server";

import api from "@/lib/http/interceptors";

interface IGeoHouse {
  id: string;
  title: string;
  address: string;
  photos: string[];
  rate: string;
  price: string;
  discounted_price: string | null;
  tags: string[];
  capacity: number;
  location: { lat: number; lng: number };
  categories: { name: string };
  bathrooms: number;
  parking: number;
  rooms: number;
  transaction_type: string;
  caption: string | null;
}

export async function getGeoHouses(params: {
  lat: number;
  lng: number;
  radius: number;
}): Promise<IGeoHouse[]> {
  try {
    const res = await api.get("/houses/search/geo-search", { params });
    return res.data as IGeoHouse[];
  } catch {
    throw new Error("دریافت خانه‌های اطراف با خطا روبرو شد");
  }
}
