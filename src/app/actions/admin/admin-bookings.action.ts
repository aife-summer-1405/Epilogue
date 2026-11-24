"use server";

import { cookies } from "next/headers";
import type {
  AdminBookingItem,
  AdminBookingsListResponse,
  AdminBookingsQueryParams,
  UpdateAdminBookingPayload,
} from "@/core/types/adminBooking";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || "";

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value ||
    cookieStore.get("auth_token")?.value ||
    "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function getAdminBookingsAction(
  params: AdminBookingsQueryParams
): Promise<AdminBookingsListResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    sort: params.sort || "createdAt",
    order: params.order || "DESC",
  });

  if (params.status?.trim()) {
    searchParams.set("status", params.status.trim());
  }
  if (params.user_id?.trim()) {
    searchParams.set("user_id", params.user_id.trim());
  }
  if (params.house_id?.trim()) {
    searchParams.set("house_id", params.house_id.trim());
  }

  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/admin/bookings?${searchParams.toString()}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "خطا در دریافت لیست رزروها");
  }

  const raw = await res.json();
  const list = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
      ? raw
      : [];

  return {
    data: list,
    totalCount: Number(raw?.totalCount ?? list.length ?? 0),
  };
}

export async function getAdminBookingByIdAction(
  id: number | string
): Promise<AdminBookingItem> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "خطا در دریافت جزئیات رزرو");
  }

  const raw = await res.json();
  return (raw?.data ?? raw) as AdminBookingItem;
}

export async function updateAdminBookingAction({
  id,
  ...body
}: UpdateAdminBookingPayload): Promise<AdminBookingItem> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "خطا در ویرایش رزرو");
  }

  const raw = await res.json().catch(() => ({}));
  return (raw?.data ?? raw) as AdminBookingItem;
}

export async function deleteAdminBookingAction(
  id: number | string
): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
    method: "DELETE",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "خطا در حذف رزرو");
  }
}

export async function continueBookingAction(id: number | string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/continue`, {
    method: "POST",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "خطا در ادامه رزرو");
  }
}

export async function cancelBookingAction(id: number | string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
    method: "POST",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "خطا در لغو رزرو");
  }
}