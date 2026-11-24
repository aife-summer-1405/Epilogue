"use server";

import { cookies } from "next/headers";
import type {
  AdminCommentItem,
  AdminCommentsListResponse,
  AdminCommentsQueryParams,
  UpdateAdminCommentPayload,
} from "@/core/types/adminComment";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  "https://aife-api.hexorix.net";

const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");
function toEnglishDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("token")?.value ||
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("authToken")?.value ||
    "";

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function normalizeListResponse(
  raw: unknown,
  fallbackPage: number,
  fallbackLimit: number
): AdminCommentsListResponse {
  if (Array.isArray(raw)) {
    return {
      data: raw as AdminCommentItem[],
      totalCount: raw.length,
      page: fallbackPage,
      limit: fallbackLimit,
    };
  }

  const obj = (raw ?? {}) as Record<string, unknown>;
  const list = Array.isArray(obj.data)
    ? (obj.data as AdminCommentItem[])
    : Array.isArray(obj.comments)
      ? (obj.comments as AdminCommentItem[])
      : [];

  const totalCount =
    typeof obj.totalCount === "number"
      ? obj.totalCount
      : typeof obj.total === "number"
        ? obj.total
        : list.length;

  return {
    data: list,
    totalCount,
    page: typeof obj.page === "number" ? obj.page : fallbackPage,
    limit: typeof obj.limit === "number" ? obj.limit : fallbackLimit,
  };
}

export async function getAdminCommentsAction(
  params: AdminCommentsQueryParams
): Promise<AdminCommentsListResponse> {
  const query = new URLSearchParams();
  query.set("page", String(params.page || 1));
  query.set("limit", String(params.limit || 10));
  query.set("sort", params.sort || "created_at");
  query.set("order", params.order || "DESC");

  const cleanUserId = toEnglishDigits(params.user_id || "").trim();
  const cleanHouseId = toEnglishDigits(params.house_id || "").trim();
  const cleanRating = toEnglishDigits(params.rating || "").trim();

  if (cleanUserId) query.set("user_id", cleanUserId);
  if (cleanHouseId) query.set("house_id", cleanHouseId);
  if (cleanRating) query.set("rating", cleanRating);

  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/comments?${query.toString()}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(errBody || `خطا در دریافت لیست نظرات (${res.status})`);
  }

  const json = await res.json();
  return normalizeListResponse(json, params.page || 1, params.limit || 10);
}

export async function getAdminCommentByIdAction(
  id: string | number
): Promise<AdminCommentItem> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/comments/${id}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(errBody || `خطا در دریافت جزئیات نظر (${res.status})`);
  }

  const json = await res.json();
  return (json?.data && !Array.isArray(json.data)
    ? json.data
    : json) as AdminCommentItem;
}

export async function updateAdminCommentAction(
  payload: UpdateAdminCommentPayload
): Promise<AdminCommentItem> {
  const headers = await getAuthHeaders();
  const { id, title, caption, rating } = payload;

  const res = await fetch(`${API_BASE_URL}/admin/comments/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      title,
      caption,
      rating: Math.round(Number(rating)),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(errBody || `خطا در ویرایش نظر (${res.status})`);
  }

  const json = await res.json().catch(() => null);
  return (json?.data && !Array.isArray(json.data)
    ? json.data
    : json ?? {
        id,
        title,
        caption,
        rating,
      }) as AdminCommentItem;
}

export async function deleteAdminCommentAction(
  id: string | number
): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/admin/comments/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(errBody || `خطا در حذف نظر (${res.status})`);
  }
}