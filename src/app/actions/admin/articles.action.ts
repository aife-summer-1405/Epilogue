"use server";

import { cookies } from "next/headers";
import type {
  AdminArticleItem,
  AdminArticlesListResponse,
  AdminArticlesQueryParams,
  CreateAdminArticlePayload,
  UpdateAdminArticlePayload,
} from "@/core/types/adminArticle";

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
): AdminArticlesListResponse {
  if (Array.isArray(raw)) {
    return {
      data: raw as AdminArticleItem[],
      totalCount: raw.length,
      page: fallbackPage,
      limit: fallbackLimit,
    };
  }

  const obj = (raw ?? {}) as Record<string, unknown>;
  const list = Array.isArray(obj.data)
    ? (obj.data as AdminArticleItem[])
    : Array.isArray(obj.blogs)
      ? (obj.blogs as AdminArticleItem[])
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

export async function getAdminArticlesAction(
  params: AdminArticlesQueryParams
): Promise<AdminArticlesListResponse> {
  const query = new URLSearchParams();
  query.set("page", String(params.page || 1));
  query.set("limit", String(params.limit || 10));
  query.set("sort", params.sort || "created_at");
  query.set("order", params.order || "DESC");

  const cleanTitle = (params.title || "").trim();
  const cleanAuthorId = toEnglishDigits(params.author_id || "").trim();
  const cleanCategoryId = toEnglishDigits(params.category_id || "").trim();

  if (cleanTitle) query.set("title", cleanTitle);
  if (cleanAuthorId) query.set("author_id", cleanAuthorId);
  if (cleanCategoryId) query.set("category_id", cleanCategoryId);

  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/blogs?${query.toString()}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(errBody || `خطا در دریافت لیست مقالات (${res.status})`);
  }

  const json = await res.json();
  return normalizeListResponse(json, params.page || 1, params.limit || 10);
}

export async function getAdminArticleByIdAction(
  id: string | number
): Promise<AdminArticleItem> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(errBody || `خطا در دریافت جزئیات مقاله (${res.status})`);
  }

  const json = await res.json();
  return (json?.data && !Array.isArray(json.data)
    ? json.data
    : json) as AdminArticleItem;
}

export async function createAdminArticleAction(
  payload: CreateAdminArticlePayload
): Promise<AdminArticleItem> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/blogs`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: payload.title,
      caption: payload.caption,
      estimated_reading_time: payload.estimated_reading_time,
      author_id: Number(payload.author_id),
      category_id: Number(payload.category_id),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(errBody || `خطا در ایجاد مقاله (${res.status})`);
  }

  const json = await res.json().catch(() => null);
  return (json?.data && !Array.isArray(json.data)
    ? json.data
    : json ?? {
        id: Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      }) as AdminArticleItem;
}

export async function updateAdminArticleAction(
  payload: UpdateAdminArticlePayload
): Promise<AdminArticleItem> {
  const headers = await getAuthHeaders();
  const { id, title, caption, estimated_reading_time, author_id, category_id } =
    payload;

  const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      title,
      caption,
      estimated_reading_time,
      author_id: Number(author_id),
      category_id: Number(category_id),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(errBody || `خطا در ویرایش مقاله (${res.status})`);
  }

  const json = await res.json().catch(() => null);
  return (json?.data && !Array.isArray(json.data)
    ? json.data
    : json ?? payload) as AdminArticleItem;
}

export async function deleteAdminArticleAction(
  id: string | number
): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(errBody || `خطا در حذف مقاله (${res.status})`);
  }
}