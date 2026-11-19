"use server";

import { cookies } from "next/headers";
import instance from "@/lib/http/interceptors";

export interface IDashboardSummaryApi {
  houses?: number;
  users?: {
    userCount?: number;
    sellers?: number;
    buyers?: number;
    admins?: number;
  };
  bookings?: {
    bookingCount?: number;
    conformedBookings?: number;
    confirmedBookings?: number;
    canceledBookings?: number;
    pendingBookings?: number;
  };
  comments?: number;
  averageRating?: string | number;
}

export interface IBuyerBookingItem {
  id: string;
  houseId?: string | number;
  house_id?: string | number;
  status?: string;
  price?: string | number;
  totalPrice?: string | number;
  total_price?: string | number;
  reservedDates?: string[];
  created_at?: string;
  createdAt?: string;
  house?: {
    id?: string | number;
    title?: string;
    photos?: string[] | null;
    price?: string | number;
  };
}

export interface IBuyerDashboardProfile {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  emailVerified?: boolean;
  updatedAt?: string | null;
  updated_at?: string | null;
}

export interface IBuyerDashboardData {
  summary: IDashboardSummaryApi | null;
  bookings: IBuyerBookingItem[];
  bookingsTotalCount: number;
  favoritesTotalCount: number;
  profile: IBuyerDashboardProfile | null;
}

async function resolveUserId(passedId?: string): Promise<string> {
  if (passedId) return passedId;

  const cookieStore = await cookies();
  const explicitId =
    cookieStore.get("userId")?.value || cookieStore.get("id")?.value;
  if (explicitId) return explicitId;

  const token = cookieStore.get("accessToken")?.value;
  if (token) {
    try {
      const base64Payload = token.split(".")[1];
      const decoded = JSON.parse(
        Buffer.from(base64Payload, "base64").toString("utf-8"),
      );
      const extracted = decoded.id || decoded.userId || decoded.sub;
      if (extracted) return String(extracted);
    } catch {}
  }
  throw new Error("شناسه کاربری یافت نشد. لطفاً مجدداً وارد حساب شوید.");
}

export async function getBuyerDashboardDataAction(
  userId?: string,
): Promise<IBuyerDashboardData> {
  const targetUserId = await resolveUserId(userId);
  const authHeaders = { tokenNeeded: "true" };

  const [summaryRes, bookingsRes, profileRes, favoritesRes] =
    await Promise.allSettled([
      instance.get("/dashboard/summary", { headers: authHeaders }),
      instance.get(`/bookings/${targetUserId}/customers`, {
        params: { page: 1, limit: 50, sort: "created_at", order: "DESC" },
        headers: authHeaders,
      }),
      instance.get(`/users/${targetUserId}`, { headers: authHeaders }),
      instance.get(`/favorites/user/${targetUserId}`, {
        params: { page: 1, limit: 1 },
        headers: authHeaders,
      }),
    ]);

  const summary: IDashboardSummaryApi | null =
    summaryRes.status === "fulfilled" ? summaryRes.value.data : null;

  let bookings: IBuyerBookingItem[] = [];
  let bookingsTotalCount = 0;

  if (bookingsRes.status === "fulfilled") {
    const raw = bookingsRes.value.data;
    bookings = Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.bookings)
        ? raw.bookings
        : Array.isArray(raw)
          ? raw
          : [];
    bookingsTotalCount = Number(raw?.totalCount ?? bookings.length);
  }

  let profile: IBuyerDashboardProfile | null = null;
  if (profileRes.status === "fulfilled") {
    const rawProfile = profileRes.value.data;
    profile = rawProfile?.user || rawProfile || null;
  }

  let favoritesTotalCount = 0;
  if (favoritesRes.status === "fulfilled") {
    const rawFav = favoritesRes.value.data;
    const favList = Array.isArray(rawFav?.data)
      ? rawFav.data
      : Array.isArray(rawFav)
        ? rawFav
        : [];
    favoritesTotalCount = Number(rawFav?.totalCount ?? favList.length);
  }

  return {
    summary,
    bookings,
    bookingsTotalCount,
    favoritesTotalCount,
    profile,
  };
}

export async function deleteBuyerBookingAction(bookingId: string | number) {
  try {
    const response = await instance.delete(`/bookings/${bookingId}`, {
      headers: { tokenNeeded: "true" },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در حذف رزرو",
    };
  }
}