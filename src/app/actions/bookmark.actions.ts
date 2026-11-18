"use server";

import instance from "@/lib/http/interceptors";
import type {
  BookmarkResponse,
  CreateBookmarkPayload,
  UpdateBookmarkPayload,
} from "@/core/types/bookmark";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; status?: number };

const AUTH = { headers: { tokenNeeded: "true" } };

function fail(error: any, fallback: string): ActionResult<never> {
  const status = error?.response?.status as number | undefined;
  return {
    success: false,
    status,
    message:
      status === 401
        ? "برای این کار باید وارد حساب کاربری شوید"
        : error?.response?.data?.message || error?.message || fallback,
  };
}

export async function getSocialBookmarkByIdAction(
  id: number | string,
): Promise<ActionResult<BookmarkResponse | null>> {
  try {
    const res = await instance.get(`/social-bookmarks/${id}`, AUTH);
    return { success: true, data: res.data };
  } catch (error: any) {
    if (error?.response?.status === 404) return { success: true, data: null };
    return fail(error, "خطا در دریافت نشان‌شده");
  }
}

export async function createSocialBookmarkAction(
  payload: CreateBookmarkPayload,
): Promise<ActionResult<BookmarkResponse>> {
  try {
    const res = await instance.post(
      "/social-bookmarks/bookmark",
      { houseId: Number(payload.houseId), note: payload.note },
      AUTH,
    );
    return { success: true, data: res.data };
  } catch (error: any) {
    return fail(error, "خطا در ثبت نشان‌شده");
  }
}

export async function updateSocialBookmarkAction(
  payload: UpdateBookmarkPayload,
): Promise<ActionResult<unknown>> {
  try {
    const body: Record<string, unknown> = { note: payload.note };
    if (payload.houseId != null) body.houseId = Number(payload.houseId);

    const res = await instance.put(`/social-bookmarks/${payload.id}`, body, AUTH);
    return { success: true, data: res.data };
  } catch (error: any) {
    return fail(error, "خطا در ویرایش نشان‌شده");
  }
}

export async function deleteSocialBookmarkAction(
  id: number | string,
): Promise<ActionResult<unknown>> {
  try {
    const res = await instance.delete(`/social-bookmarks/${id}`, AUTH);
    return { success: true, data: res.data };
  } catch (error: any) {
    return fail(error, "خطا در حذف نشان‌شده");
  }
}