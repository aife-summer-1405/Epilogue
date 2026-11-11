"use server";

import { cookies } from "next/headers";
import instance from "@/lib/http/interceptors";
import {
  IGetBuyerUserResponse,
  IUpdateBuyerUserPayload,
  IChangePasswordPayload,
} from "@/core/types/buyerProfile/buyerProfile.types";

async function resolveUserId(passedId?: string): Promise<string> {
  if (passedId) return passedId;

  const cookieStore = await cookies();
  const explicitId = cookieStore.get("userId")?.value || cookieStore.get("id")?.value;
  if (explicitId) return explicitId;

  const token = cookieStore.get("accessToken")?.value;
  if (token) {
    try {
      const base64Payload = token.split(".")[1];
      const decoded = JSON.parse(Buffer.from(base64Payload, "base64").toString("utf-8"));
      const extracted = decoded.id || decoded.userId || decoded.sub;
      if (extracted) return String(extracted);
    } catch {
    }
  }
  throw new Error("شناسه کاربری یافت نشد. لطفاً مجدداً وارد حساب شوید.");
}

export async function getBuyerProfileAction(
  userId?: string
): Promise<IGetBuyerUserResponse> {
  const targetId = await resolveUserId(userId);
  const response = await instance.get(`/users/${targetId}`, {
    headers: { tokenNeeded: "true" },
  });
  return response.data;
}

export async function updateBuyerProfileAction(
  payload: IUpdateBuyerUserPayload,
  userId?: string
) {
  try {
    const targetId = await resolveUserId(userId);
    const response = await instance.put(`/users/${targetId}`, payload, {
      headers: { tokenNeeded: "true" },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در بروزرسانی اطلاعات کاربری",
    };
  }
}

export async function uploadBuyerPictureAction(formData: FormData) {
  try {
    const response = await instance.put("/users/upload/picture", formData, {
      headers: {
        tokenNeeded: "true",
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در آپلود تصویر پروفایل",
    };
  }
}

export async function changeBuyerPasswordAction(payload: IChangePasswordPayload) {
  try {
    const response = await instance.put("/users/change-password", payload, {
      headers: { tokenNeeded: "true" },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "رمز عبور فعلی اشتباه است یا خطایی رخ داد",
    };
  }
}