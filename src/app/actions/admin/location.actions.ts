"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type {
  GetLocationsParams,
  GetLocationsResponse,
  LocationItem,
  LocationPayload,
} from "@/core/types/location.types";

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

export async function getLocationsAction(
  params: GetLocationsParams = {}
): Promise<GetLocationsResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.order) searchParams.set("order", params.order);
  if (params.area_name) searchParams.set("area_name", params.area_name);
  if (params.lat !== undefined && !Number.isNaN(params.lat)) {
    searchParams.set("lat", String(params.lat));
  }
  if (params.lng !== undefined && !Number.isNaN(params.lng)) {
    searchParams.set("lng", String(params.lng));
  }

  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl("/locations", searchParams), {
    method: "GET",
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `خطا در دریافت لیست (${res.status})`);
  }

  return res.json();
}

export async function createLocationAction(
  payload: LocationPayload
): Promise<LocationItem> {
  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl("/locations"), {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `خطا در ثبت موقعیت (${res.status})`);
  }

  revalidatePath("/panel/locations/admin");
  return res.json();
}

export async function updateLocationAction(
  id: string,
  payload: LocationPayload
): Promise<LocationItem> {
  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl(`/locations/${id}`), {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `خطا در ویرایش موقعیت (${res.status})`);
  }

  revalidatePath("/panel/locations/admin");
  return res.json();
}

export async function deleteLocationAction(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(buildUrl(`/locations/${id}`), {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `خطا در حذف موقعیت (${res.status})`);
  }

  revalidatePath("/panel/locations/admin");
}