"use server";

import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import api from "@/lib/http/interceptors";
import type { GetUserResponse } from "@/core/types/user.types";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type UserRole = "buyer" | "seller" | "admin";

export type CurrentUser = {
  id: string;
  role: UserRole;
  membershipDate: string | null;
  email: string;
  phoneNumber: string | null;
  emailVerified: boolean;
  fullName: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetCurrentUserActionResult =
  | { success: true; user: CurrentUser; additionalPercentage: number }
  | { success: false; message: string; unauthenticated?: boolean };

export async function getCurrentUserAction(): Promise<GetCurrentUserActionResult> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return { success: false, message: "وارد نشده اید.", unauthenticated: true };
  }

  try {
    const { data } = await api.get<GetUserResponse>(`/users/${userId}`, {
      headers: { tokenNeeded: "true" },
    });

    const userData = data.user;

    return {
      success: true,
      user: {
        ...userData,
        role: userData.role as UserRole,
      },
      additionalPercentage: data.additionalPercentage ?? 0,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;

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
