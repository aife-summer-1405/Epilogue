"use server";

import { cookies } from "next/headers";
import type {
  ReviewSellerUpgradePayload,
  SellerUpgradeFilters,
  SellerUpgradeRequestsResponse,
} from "@/core/types/sellerUpgrade";

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

export async function getSellerUpgradeRequestsAction(
  filters: SellerUpgradeFilters
): Promise<SellerUpgradeRequestsResponse> {
  const params = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
  });

  if (filters.status) {
    params.set("status", filters.status);
  }

  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/seller-upgrade/admin/requests?${params.toString()}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "خطا در دریافت لیست درخواست‌های فروشندگی");
  }

  const raw = await res.json();

  return {
    totalCount: Number(raw.totalCount ?? raw.requests?.length ?? 0),
    requests: Array.isArray(raw.requests) ? raw.requests : [],
    currentPage: Number(raw.currentPage ?? filters.page),
    totalPages: Math.max(1, Number(raw.totalPages ?? 1)),
  };
}

export async function approveSellerUpgradeRequestAction({
  id,
  adminNote,
}: ReviewSellerUpgradePayload) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/seller-upgrade/admin/requests/${id}/approve`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ adminNote }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "خطا در تایید درخواست فروشنده");
  }

  return res.json().catch(() => ({ success: true }));
}

export async function rejectSellerUpgradeRequestAction({
  id,
  adminNote,
}: ReviewSellerUpgradePayload) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/seller-upgrade/admin/requests/${id}/reject`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ adminNote }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "خطا در رد درخواست فروشنده");
  }

  return res.json().catch(() => ({ success: true }));
}