"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  Payment,
  PaymentFilters,
  PaymentsResponse,
  UpdatePaymentPayload,
  VerifyPaymentPayload,
} from "@/core/types/payment";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

async function getHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || cookieStore.get("accessToken")?.value;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getPaymentsAction(
  filters: PaymentFilters
): Promise<PaymentsResponse> {
  const params = new URLSearchParams();

  params.set("page", String(filters.page || 1));
  params.set("limit", String(filters.limit || 10));

  if (filters.sort) {
    params.set("sort", filters.sort);
  }
  if (filters.order) {
    params.set("order", filters.order);
  }
  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }
  if (filters.userId && filters.userId.trim() !== "") {
    params.set("userId", filters.userId.trim());
  }
  if (filters.amount && filters.amount.trim() !== "") {
    params.set("amount", filters.amount.trim());
  }

  const url = `${API_BASE_URL}/admin/payments?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: await getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    console.error("getPaymentsAction error:", res.status, url, errorText);
    throw new Error(`خطا در دریافت لیست پرداخت‌ها (${res.status})`);
  }

  return res.json();
}

export async function getPaymentByIdAction(id: string): Promise<Payment> {
  const res = await fetch(`${API_BASE_URL}/admin/payments/${id}`, {
    method: "GET",
    headers: await getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`خطا در دریافت جزئیات پرداخت (${res.status})`);
  }

  return res.json();
}

export async function updatePaymentAction(
  id: string,
  payload: UpdatePaymentPayload
): Promise<Payment> {
  const res = await fetch(`${API_BASE_URL}/admin/payments/${id}`, {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`خطا در بروزرسانی پرداخت (${res.status})`);
  }

  revalidatePath("/admin/payments");
  return res.json();
}

export async function deletePaymentAction(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/admin/payments/${id}`, {
    method: "DELETE",
    headers: await getHeaders(),
  });

  if (!res.ok) {
    throw new Error(`خطا در حذف پرداخت (${res.status})`);
  }

  revalidatePath("/admin/payments");
  return { success: true };
}

export async function verifyPaymentAction(
  id: string,
  payload: VerifyPaymentPayload
): Promise<Payment> {
  const res = await fetch(`${API_BASE_URL}/payments/${id}/verify`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`خطا در تایید تراکنش (${res.status})`);
  }

  revalidatePath("/admin/payments");
  return res.json();
}