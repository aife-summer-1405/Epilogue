"use server";

import { cookies } from "next/headers";

export interface SellerUpgradeUserInfo {
  id: string;
  email: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  role?: string | null;
}

export type SellerUpgradeRequestStatus = "pending" | "approved" | "rejected";

export interface IMySellerUpgradeRequest {
  id: string;
  userId: string;
  message: string;
  status: SellerUpgradeRequestStatus | string;
  reviewedBy?: string | null;
  adminNote?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  user?: SellerUpgradeUserInfo | null;
}

export interface CreateSellerUpgradePayload {
  message: string;
}

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

export async function getMySellerUpgradeRequestAction(): Promise<IMySellerUpgradeRequest | null> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/seller-upgrade/my-request`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(
      errorText || "خطا در دریافت وضعیت درخواست فروشندگی"
    );
  }

  const json = await res.json().catch(() => null);
  const data = json?.data ?? json ?? null;
  if (!data || !data.id) {
    return null;
  }

  return data as IMySellerUpgradeRequest;
}

export async function createSellerUpgradeRequestAction(
  payload: CreateSellerUpgradePayload
): Promise<IMySellerUpgradeRequest> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/seller-upgrade/request`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message: payload.message.trim() }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || "خطا در ثبت درخواست فروشندگی");
  }

  const json = await res.json();
  return (json?.data ?? json) as IMySellerUpgradeRequest;
}