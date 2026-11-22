"use server";

import { revalidatePath } from "next/cache";
import type {
  GetLocationsParams,
  GetLocationsResponse,
  LocationItem,
  LocationPayload,
} from "@/core/types/location.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

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

  const res = await fetch(`${BASE_URL}/locations?${searchParams.toString()}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت لیست موقعیت‌های مکانی");
  }

  return res.json();
}

export async function createLocationAction(
  payload: LocationPayload
): Promise<LocationItem> {
  const res = await fetch(`${BASE_URL}/locations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "خطا در ثبت موقعیت مکانی جدید");
  }

  revalidatePath("/admin/locations");
  return res.json();
}

export async function updateLocationAction(
  id: string,
  payload: LocationPayload
): Promise<LocationItem> {
  const res = await fetch(`${BASE_URL}/locations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "خطا در ویرایش موقعیت مکانی");
  }

  revalidatePath("/admin/locations");
  return res.json();
}

export async function deleteLocationAction(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/locations/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "خطا در حذف موقعیت مکانی");
  }

  revalidatePath("/admin/locations");
}