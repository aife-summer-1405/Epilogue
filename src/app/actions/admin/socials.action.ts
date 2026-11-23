"use server";

import { cookies } from "next/headers";
import {
  SocialMediaFilters,
  SocialMediaLink,
  SocialMediaListResponse,
  SocialMediaMutationPayload,
} from "@/core/types/social";

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

export async function getSocialMediaLinksAction(
  filters: Partial<SocialMediaFilters> = {}
): Promise<SocialMediaListResponse> {
  const params = new URLSearchParams();

  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  params.set("sort", filters.sort ?? "id");
  params.set("order", filters.order ?? "ASC");

  if (filters.platform && filters.platform.trim() !== "") {
    params.set("platform", filters.platform.trim());
  }

  if (filters.url && filters.url.trim() !== "") {
    params.set("url", filters.url.trim());
  }

  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/social-media-links?${params.toString()}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.message || "خطا در دریافت لیست شبکه‌های اجتماعی"
    );
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

export async function createSocialMediaLinkAction(
  payload: SocialMediaMutationPayload
): Promise<SocialMediaLink> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/social-media-links`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "خطا در ثبت شبکه اجتماعی");
  }

  const json = await res.json();
  return json.data ?? json;
}

export async function updateSocialMediaLinkAction(
  id: string,
  payload: SocialMediaMutationPayload
): Promise<SocialMediaLink> {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/social-media-links/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "خطا در ویرایش شبکه اجتماعی");
  }

  const json = await res.json();
  return json.data ?? json;
}

export async function deleteSocialMediaLinkAction(
  id: string
): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/social-media-links/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers,
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "خطا در حذف شبکه اجتماعی");
  }

  return { success: true };
}