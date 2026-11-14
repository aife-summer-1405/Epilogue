"use server";

import { cookies } from "next/headers";
import instance from "@/lib/http/interceptors";
import {
  IGetNotificationsParams,
  IGetNotificationsResponse,
  INotificationItem,
  ISendNotificationPayload,
} from "@/core/types/notifications/notifications.types";

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

export async function getUserNotificationsAction(
  params: IGetNotificationsParams = {},
  userId?: string,
): Promise<IGetNotificationsResponse> {
  const targetId = await resolveUserId(userId);

  const cleanParams: Record<string, string | number | boolean> = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    sort: params.sort ?? "createdAt",
    order: params.order ?? "DESC",
  };

  if (typeof params.isRead === "boolean") {
    cleanParams.isRead = params.isRead;
  }
  if (params.type && params.type !== "all") {
    cleanParams.type = params.type;
  }

  const response = await instance.get(`/notifications/${targetId}`, {
    params: cleanParams,
    headers: { tokenNeeded: "true" },
  });

  const rawData = response.data;
  const list: INotificationItem[] = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : [];

  const totalCount = Number(rawData?.totalCount ?? list.length);
  const limit = Number(cleanParams.limit) || 10;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return {
    data: list,
    totalCount,
    totalPages,
  };
}

export async function markNotificationAsReadAction(id: string | number) {
  try {
    const response = await instance.put(
      `/notifications/${id}/read`,
      {},
      { headers: { tokenNeeded: "true" } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در بروزرسانی وضعیت اعلان",
    };
  }
}

export async function markAllNotificationsAsReadAction(userId?: string) {
  try {
    const targetId = await resolveUserId(userId);
    const response = await instance.put(
      `/notifications/mark-all-as-read`,
      { userId: Number(targetId) || targetId },
      {
        params: { userId: targetId },
        headers: { tokenNeeded: "true" },
      },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message:
        err.response?.data?.message || "خطا در علامت‌گذاری تمامی اعلان‌ها",
    };
  }
}

export async function sendNotificationAction(
  payload: ISendNotificationPayload,
) {
  try {
    const targetId = await resolveUserId(
      payload.notification.userId
        ? String(payload.notification.userId)
        : undefined,
    );
    const response = await instance.post(
      `/notifications`,
      {
        room: payload.room,
        notification: {
          ...payload.notification,
          userId: Number(targetId) || targetId,
        },
      },
      { headers: { tokenNeeded: "true" } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در ارسال اعلان",
    };
  }
}
