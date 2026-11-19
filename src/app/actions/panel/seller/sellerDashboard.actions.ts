"use server";

import { cookies } from "next/headers";
import instance from "@/lib/http/interceptors";

export interface ISellerFinanceDashboardApi {
  totalAmount?: number;
  totalBookings?: number;
  totalPayments?: number;
  totalPerviousMonthAmount?: number;
  totalPreviousMonthAmount?: number;
  totalCurrentMonthAmount?: number;
}

export interface ISellerHouseApi {
  id: string;
  title?: string;
  photos?: string[] | null;
  price?: string | number;
}

export interface ISellerBookingItem {
  id: string | number;
  houseId?: string | number;
  house_id?: string | number;
  status?: string;
  price?: string | number;
  amount?: string | number;
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

export interface ISellerPaymentItem {
  id: string;
  bookingId?: number | string;
  amount?: string | number;
  status?: string;
  createdAt?: string | null;
  booking?: ISellerBookingItem;
}

export interface ISellerDashboardProfile {
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

export interface ISellerDashboardData {
  finance: ISellerFinanceDashboardApi | null;
  housesTotalCount: number;
  bookings: ISellerBookingItem[];
  payments: ISellerPaymentItem[];
  todayVisitsCount: number;
  profile: ISellerDashboardProfile | null;
}

async function resolveSellerId(passedId?: string): Promise<string> {
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
  throw new Error("شناسه فروشنده یافت نشد. لطفاً مجدداً وارد حساب شوید.");
}

function isSameCalendarDay(dateStr?: string | null, targetDate = new Date()) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  return (
    d.getFullYear() === targetDate.getFullYear() &&
    d.getMonth() === targetDate.getMonth() &&
    d.getDate() === targetDate.getDate()
  );
}

export async function getSellerDashboardDataAction(
  sellerId?: string,
): Promise<ISellerDashboardData> {
  const targetSellerId = await resolveSellerId(sellerId);
  const authHeaders = { tokenNeeded: "true" };

  const [financeRes, housesRes, bookingsRes, paymentsRes, profileRes] =
    await Promise.allSettled([
      instance.get("/seller/finance/dashboard", { headers: authHeaders }),
      instance.get("/houses/seller/user", {
        params: { page: 1, limit: 10 },
        headers: authHeaders,
      }),
      instance.get(`/bookings/${targetSellerId}/customers`, {
        params: { page: 1, limit: 50, sort: "created_at", order: "DESC" },
        headers: authHeaders,
      }),
      instance.get("/payments/seller-houses", {
        params: { page: 1, limit: 50, sort: "createdAt", order: "DESC" },
        headers: authHeaders,
      }),
      instance.get(`/users/${targetSellerId}`, { headers: authHeaders }),
    ]);

  const finance: ISellerFinanceDashboardApi | null =
    financeRes.status === "fulfilled" ? financeRes.value.data : null;

  let housesList: ISellerHouseApi[] = [];
  let housesTotalCount = 0;
  if (housesRes.status === "fulfilled") {
    const rawHouses = housesRes.value.data;
    housesList = Array.isArray(rawHouses?.houses)
      ? rawHouses.houses
      : Array.isArray(rawHouses?.data)
        ? rawHouses.data
        : [];
    housesTotalCount = Number(rawHouses?.totalCount ?? housesList.length);
  }

  let payments: ISellerPaymentItem[] = [];
  if (paymentsRes.status === "fulfilled") {
    const rawPayments = paymentsRes.value.data;
    payments = Array.isArray(rawPayments?.payments)
      ? rawPayments.payments
      : Array.isArray(rawPayments?.data)
        ? rawPayments.data
        : [];
  }

  let bookings: ISellerBookingItem[] = [];
  if (bookingsRes.status === "fulfilled") {
    const rawBookings = bookingsRes.value.data;
    bookings = Array.isArray(rawBookings?.data)
      ? rawBookings.data
      : Array.isArray(rawBookings?.bookings)
        ? rawBookings.bookings
        : Array.isArray(rawBookings)
          ? rawBookings
          : [];
  }

  if (bookings.length === 0 && payments.length > 0) {
    const seenIds = new Set<string>();
    bookings = payments
      .filter((p) => p.booking && !seenIds.has(String(p.booking.id)))
      .map((p) => {
        seenIds.add(String(p.booking!.id));
        return {
          ...p.booking!,
          amount: p.amount,
        };
      });
  }

  let todayVisitsCount = 0;
  if (housesList.length > 0) {
    const visitResponses = await Promise.allSettled(
      housesList.slice(0, 10).map((house) =>
        instance.get(`/visit-appointments/house/${house.id}`, {
          headers: authHeaders,
        }),
      ),
    );

    const today = new Date();
    visitResponses.forEach((res) => {
      if (res.status !== "fulfilled") return;
      const raw = res.value.data;
      const list: Array<{
        visitDate?: string;
        visit_date?: string;
        date?: string;
        createdAt?: string;
        created_at?: string;
      }> = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.appointments)
          ? raw.appointments
          : Array.isArray(raw)
            ? raw
            : [];

      list.forEach((visit) => {
        const dateCandidate =
          visit.visitDate ||
          visit.visit_date ||
          visit.date ||
          visit.createdAt ||
          visit.created_at;
        if (isSameCalendarDay(dateCandidate, today)) {
          todayVisitsCount += 1;
        }
      });
    });
  }

  let profile: ISellerDashboardProfile | null = null;
  if (profileRes.status === "fulfilled") {
    const rawProfile = profileRes.value.data;
    profile = rawProfile?.user || rawProfile || null;
  }

  return {
    finance,
    housesTotalCount,
    bookings,
    payments,
    todayVisitsCount,
    profile,
  };
}

export async function confirmSellerBookingAction(bookingId: string | number) {
  try {
    const response = await instance.post(
      `/bookings/${bookingId}/continue`,
      {},
      { headers: { tokenNeeded: "true" } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در تایید رزرو",
    };
  }
}

export async function cancelSellerBookingAction(bookingId: string | number) {
  try {
    const response = await instance.post(
      `/bookings/${bookingId}/cancel`,
      {},
      { headers: { tokenNeeded: "true" } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در لغو رزرو",
    };
  }
}

export async function deleteSellerBookingAction(bookingId: string | number) {
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