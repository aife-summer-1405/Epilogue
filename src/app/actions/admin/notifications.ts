"use server";

import { cookies } from "next/headers";
import {
  NotificationsActionResult,
  NotificationsFilters,
  NotificationsResponse,
} from "@/core/types/notification";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "";

function normalizeEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .trim();
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const tokenCookie = allCookies.find((c) =>
    ["accessToken", "access_token", "token", "auth_token", "jwt"].includes(
      c.name
    )
  );

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (tokenCookie?.value) {
    headers.Authorization = `Bearer ${tokenCookie.value}`;
  }

  return headers;
}

export async function getNotificationsAction(
  filters: NotificationsFilters = {}
): Promise<NotificationsActionResult> {
  const fallbackData: NotificationsResponse = {
    data: [],
    totalCount: 0,
  };

  try {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 10);

    const searchParams = new URLSearchParams();
    searchParams.set("page", String(page));
    searchParams.set("limit", String(limit));

    if (filters.userId) {
      const cleanUserId = normalizeEnglishDigits(filters.userId).replace(
        /[^\d]/g,
        ""
      );
      if (cleanUserId) searchParams.set("userId", cleanUserId);
    }

    if (filters.type && filters.type !== "all") {
      searchParams.set("type", filters.type.trim());
    }

    if (filters.isRead && filters.isRead !== "all") {
      searchParams.set(
        "isRead",
        filters.isRead === "read" ? "true" : "false"
      );
    }

    if (filters.search && filters.search.trim()) {
      searchParams.set("search", filters.search.trim());
    }

    const baseUrl = API_BASE_URL.replace(/\/+$/, "");
    const endpoint = `${baseUrl}/notifications?${searchParams.toString()}`;
    const headers = await getAuthHeaders();

    console.log("[Notifications Request]:", endpoint, {
      hasAuth: Boolean((headers as Record<string, string>).Authorization),
    });

    const response = await fetch(endpoint, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("[Notifications Error]:", response.status, errorText);
      return {
        success: false,
        data: fallbackData,
        error: errorText || `خطا در دریافت اعلانات (کد ${response.status})`,
      };
    }

    const rawJson = await response.json();

    const payload =
      rawJson?.data && !Array.isArray(rawJson.data) && Array.isArray(rawJson.data.data)
        ? rawJson.data
        : rawJson;

    const list = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];

    const total =
      typeof payload?.totalCount === "number"
        ? payload.totalCount
        : typeof rawJson?.totalCount === "number"
          ? rawJson.totalCount
          : list.length;

    return {
      success: true,
      data: {
        data: list,
        totalCount: total,
      },
    };
  } catch (err) {
    console.error("[Notifications Exception]:", err);
    return {
      success: false,
      data: fallbackData,
      error:
        err instanceof Error ? err.message : "خطای غیرمنتظره در ارتباط با سرور",
    };
  }
}