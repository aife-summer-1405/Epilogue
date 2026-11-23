"use server";

import { cookies } from "next/headers";
import {
  CategoriesListResponse,
  Category,
  CategoryFilters,
  CategoryMutationPayload,
} from "@/core/types/category";

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

export async function getCategoriesAction(
  filters: Partial<CategoryFilters> = {}
): Promise<CategoriesListResponse> {
  const params = new URLSearchParams();

  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  params.set("sort", filters.sort ?? "id");
  params.set("order", filters.order ?? "ASC");

  if (filters.name && filters.name.trim() !== "") {
    params.set("name", filters.name.trim());
  }

  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/categories?${params.toString()}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "خطا در دریافت لیست دسته‌بندی‌ها");
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

export async function createCategoryAction(
  payload: CategoryMutationPayload
): Promise<Category> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "خطا در ایجاد دسته‌بندی جدید");
  }

  const json = await res.json();
  return json.data ?? json;
}

export async function updateCategoryAction(
  id: string,
  payload: CategoryMutationPayload
): Promise<Category> {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/categories/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "خطا در ویرایش دسته‌بندی");
  }

  const json = await res.json();
  return json.data ?? json;
}

export async function deleteCategoryAction(
  id: string
): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/categories/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers,
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "خطا در حذف دسته‌بندی");
  }

  return { success: true };
}