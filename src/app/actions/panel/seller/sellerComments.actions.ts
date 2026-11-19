"use server";

import { cookies } from "next/headers";
import instance from "@/lib/http/interceptors";
import {
  ISellerComment,
  ICommentUser,
} from "@/app/panel/commentsManagement/ICommentManagement";

export interface IGetSellerCommentsParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  rating?: string;
  user_id?: number | string;
  house_id?: number | string;
  parent_comment_id?: number | string;
  created_at_from?: string;
  created_at_to?: string;
}

export interface ISellerCommentsApiResponse {
  comments: ISellerComment[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface ICreateReplyPayload {
  house_id: string | number;
  parent_comment_id: string | number;
  title: string;
  caption: string;
  rating?: number | string;
}

export interface IUpdateCommentPayload {
  id: string | number;
  title: string;
  caption: string;
  rating?: number | string;
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

export async function getCurrentSellerUserAction(): Promise<ICommentUser | null> {
  try {
    const sellerId = await resolveSellerId();
    const response = await instance.get(`/users/${sellerId}`, {
      headers: { tokenNeeded: "true" },
    });
    const rawUser = response.data?.user || response.data;
    return {
      firstName: rawUser?.firstName || "",
      lastName: rawUser?.lastName || "",
      profilePicture: rawUser?.profilePicture || null,
    };
  } catch {
    return null;
  }
}

export async function getSellerCommentsAction(
  params: IGetSellerCommentsParams = {},
  sellerId?: string,
): Promise<ISellerCommentsApiResponse> {
  const targetSellerId = await resolveSellerId(sellerId);

  const cleanParams: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    sort: params.sort ?? "created_at",
    order: params.order ?? "DESC",
  };

  if (params.rating && params.rating !== "all") {
    cleanParams.rating = params.rating;
  }
  if (params.user_id) {
    cleanParams.user_id = params.user_id;
  }
  if (params.house_id) {
    cleanParams.house_id = params.house_id;
  }
  if (params.parent_comment_id) {
    cleanParams.parent_comment_id = params.parent_comment_id;
  }
  if (params.created_at_from) {
    cleanParams.created_at_from = params.created_at_from;
  }
  if (params.created_at_to) {
    cleanParams.created_at_to = params.created_at_to;
  }

  const response = await instance.get(`/comments/seller/${targetSellerId}`, {
    params: cleanParams,
    headers: { tokenNeeded: "true" },
  });

  const data = response.data;
  const comments: ISellerComment[] = Array.isArray(data?.comments)
    ? data.comments
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const totalCount = Number(data?.totalCount ?? comments.length);
  const currentPage = Number(data?.currentPage ?? cleanParams.page);
  const totalPages = Number(
    data?.totalPages ??
      Math.max(1, Math.ceil(totalCount / Number(cleanParams.limit))),
  );

  return {
    comments,
    totalCount,
    currentPage,
    totalPages,
  };
}

export async function getSellerCommentByIdAction(
  id: string | number,
): Promise<(ISellerComment & { parent_comment?: ISellerComment | null }) | null> {
  try {
    const response = await instance.get(`/comments/${id}`, {
      headers: { tokenNeeded: "true" },
    });
    return response.data?.comment || response.data;
  } catch {
    return null;
  }
}

export async function replyToCommentAction(payload: ICreateReplyPayload) {
  try {
    const sellerId = await resolveSellerId();
    const response = await instance.post(
      "/comments",
      {
        house_id: Number(payload.house_id) || payload.house_id,
        user_id: Number(sellerId) || sellerId,
        parent_comment_id:
          Number(payload.parent_comment_id) || payload.parent_comment_id,
        title: payload.title || "پاسخ فروشنده",
        caption: payload.caption,
        rating: payload.rating !== undefined ? Number(payload.rating) : null,
      },
      { headers: { tokenNeeded: "true" } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در ثبت پاسخ",
    };
  }
}

export async function updateSellerCommentAction(
  payload: IUpdateCommentPayload,
) {
  try {
    const body: Record<string, string | number> = {
      title: payload.title,
      caption: payload.caption,
    };

    if (payload.rating !== undefined && Number(payload.rating) > 0) {
      body.rating = Number(payload.rating);
    }

    const response = await instance.put(`/comments/${payload.id}`, body, {
      headers: { tokenNeeded: "true" },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در ویرایش نظر",
    };
  }
}

export async function deleteSellerCommentAction(id: string | number) {
  try {
    const response = await instance.delete(`/comments/${id}`, {
      headers: { tokenNeeded: "true" },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در حذف نظر",
    };
  }
}