"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type {
  ContactMessageItem,
  GetContactMessagesParams,
  GetContactMessagesResponse,
} from "@/core/types/contactUs.types";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("token")?.value ||
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("access_token")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function buildUrl(path: string, searchParams?: URLSearchParams) {
  const query = searchParams?.toString();
  const fullPath = query ? `${path}?${query}` : path;
  return BASE_URL ? `${BASE_URL}${fullPath}` : fullPath;
}

export async function getContactMessagesAction(
  params: GetContactMessagesParams = {}
): Promise<GetContactMessagesResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.order) searchParams.set("order", params.order);
  if (params.title) searchParams.set("title", params.title);

  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl("/contact-us", searchParams), {
    method: "GET",
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `خطا در دریافت پیام‌های تماس (${res.status})`);
  }

  return res.json();
}

export async function getContactMessageByIdAction(
  id: string
): Promise<ContactMessageItem> {
  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl(`/contact-us/${id}`), {
    method: "GET",
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `خطا در دریافت جزئیات پیام (${res.status})`);
  }

  return res.json();
}

export async function deleteContactMessageAction(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl(`/contact-us/${id}`), {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `خطا در حذف پیام (${res.status})`);
  }

  revalidatePath("/panel/admin/contact-us");
}