"use server";

import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import api from "@/lib/http/interceptors";
import type { GetUserResponse } from "@/core/types/user.types";

export type CurrentUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  profilePicture?: string;
};

export type GetCurrentUserActionResult =
  | { success: true; user: CurrentUser }
  | { success: false; message: string; unauthenticated?: boolean };

export async function getCurrentUserAction(): Promise<GetCurrentUserActionResult> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!userId || !accessToken) {
    return { success: false, message: "وارد نشده اید.", unauthenticated: true };
  }

  try {
    const { data } = await api.get<GetUserResponse>(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const u = data.user;

    return {
      success: true,
      user: {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        phoneNumber: u.phoneNumber,
        role: u.role,
        profilePicture: u.profilePicture ?? undefined,
      },
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return {
        success: false,
        message: "نشست شما منقضی شده است.",
        unauthenticated: true,
      };
    }
    return {
      success: false,
      message: "مشکلی در دریافت اطلاعات کاربر پیش آمد.",
    };
  }
}
