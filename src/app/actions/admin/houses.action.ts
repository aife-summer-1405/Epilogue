"use server";

import { cookies } from "next/headers";
import {
  House,
  HouseFilters,
  HousesListResponse,
  UpdateHousePayload,
} from "@/core/types/house";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://aife-api.hexorix.net";

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value ||
    "";

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getAdminHousesAction(
  filters: Partial<HouseFilters> = {}
): Promise<HousesListResponse> {
  const params = new URLSearchParams();

  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  params.set("sort", filters.sort ?? "created_at");
  params.set("order", filters.order ?? "DESC");

  if (filters.sellerId && filters.sellerId.trim() !== "") {
    params.set("sellerId", String(Number(filters.sellerId)));
  }

  if (filters.price && filters.price.trim() !== "") {
    params.set("price", String(Number(filters.price)));
  }

  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/houses?${params.toString()}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "خطا در دریافت لیست اقامتگاه‌ها");
  }

  const json = await res.json();

  if (Array.isArray(json)) {
    return { data: json, totalCount: json.length };
  }

  return {
    data: Array.isArray(json.data) ? json.data : [],
    totalCount:
      typeof json.totalCount === "number"
        ? json.totalCount
        : Array.isArray(json.data)
          ? json.data.length
          : 0,
  };
}

export async function updateAdminHouseAction(
  id: string,
  payload: UpdateHousePayload
): Promise<House> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/houses/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "خطا در بروزرسانی اقامتگاه");
  }

  const json = await res.json();
  return json.data ?? json;
}

export async function deleteAdminHouseAction(id: string): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/houses/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "خطا در حذف اقامتگاه");
  }

  return { success: true };
}