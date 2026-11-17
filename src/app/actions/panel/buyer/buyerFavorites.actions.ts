"use server";

import { cookies } from "next/headers";
import instance from "@/lib/http/interceptors";

export interface IFavoriteHouseApi {
  id: string;
  title: string;
  address: string;
  photos: string[] | null;
  rate: string | number;
  price: string | number;
}

export interface IFavoriteItemApi {
  id: string;
  user_id: string;
  house_id: string;
  created_at: string;
  updated_at: string;
  house?: IFavoriteHouseApi;
}

export interface IGetBuyerFavoritesParams {
  page?: number;
  limit?: number;
  sort?: "createdAt" | "updatedAt";
  order?: "ASC" | "DESC";
}

export interface IGetBuyerFavoritesResponse {
  data: IFavoriteItemApi[];
  totalCount: number;
  totalPages: number;
}

async function resolveUserId(passedId?: string): Promise<string> {
  if (passedId) return passedId;

  const cookieStore = await cookies();
  const explicitId =
    cookieStore.get("userId")?.value || cookieStore.get("id")?.value;
  if (explicitId) return explicitId;

  const token = cookieStore.get("accessToken")?.value;
  if (token) {
    try {
      const base64Payload = token.split(".")[1];
      const decoded = JSON.parse(
        Buffer.from(base64Payload, "base64").toString("utf-8"),
      );
      const extracted = decoded.id || decoded.userId || decoded.sub;
      if (extracted) return String(extracted);
    } catch {}
  }
  throw new Error("شناسه کاربری یافت نشد. لطفاً مجدداً وارد حساب شوید.");
}

export async function getBuyerFavoritesAction(
  params: IGetBuyerFavoritesParams = {},
  userId?: string,
): Promise<IGetBuyerFavoritesResponse> {
  const targetUserId = await resolveUserId(userId);

  const cleanParams: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? 12,
    sort: params.sort ?? "createdAt",
    order: params.order ?? "DESC",
  };

  const response = await instance.get(`/favorites/user/${targetUserId}`, {
    params: cleanParams,
    headers: { tokenNeeded: "true" },
  });

  const rawData = response.data;
  const list: IFavoriteItemApi[] = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : [];

  const totalCount = Number(rawData?.totalCount ?? list.length);
  const limit = Number(cleanParams.limit) || 12;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return {
    data: list,
    totalCount,
    totalPages,
  };
}

export async function deleteBuyerFavoriteAction(favoriteId: string | number) {
  try {
    const response = await instance.delete(`/favorites/${favoriteId}`, {
      headers: { tokenNeeded: "true" },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در حذف از علاقه‌مندی‌ها",
    };
  }
}