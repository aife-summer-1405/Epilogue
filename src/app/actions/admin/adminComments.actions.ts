"use server";

import instance from "@/lib/http/interceptors";
import {
  IAdminComment,
  IGetAdminCommentsParams,
  IGetAdminCommentsResponse,
  IUpdateAdminCommentPayload,
} from "@/core/types/admin/adminComments.types";

export async function getAdminCommentsAction(
  params: IGetAdminCommentsParams = {},
): Promise<IGetAdminCommentsResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const cleanParams: Record<string, string | number> = {
    page,
    limit,
    sort: params.sort ?? "created_at",
    order: params.order ?? "DESC",
  };

  if (
    params.rating !== undefined &&
    params.rating !== "" &&
    params.rating !== "all"
  ) {
    cleanParams.rating = Number(params.rating);
  }
  if (params.user_id !== undefined && String(params.user_id).trim() !== "") {
    cleanParams.user_id = Number(params.user_id);
  }
  if (params.house_id !== undefined && String(params.house_id).trim() !== "") {
    cleanParams.house_id = Number(params.house_id);
  }

  const response = await instance.get("/admin/comments", {
    params: cleanParams,
    headers: { tokenNeeded: "true" },
  });

  const rawData = response.data;
  const list: IAdminComment[] = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : [];

  const totalCount = Number(rawData?.totalCount ?? list.length);
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return {
    data: list,
    totalCount,
    currentPage: page,
    totalPages,
  };
}

export async function getAdminCommentByIdAction(
  id: string | number,
): Promise<IAdminComment | null> {
  try {
    const response = await instance.get(`/admin/comments/${id}`, {
      headers: { tokenNeeded: "true" },
    });
    return response.data?.data || response.data?.comment || response.data;
  } catch {
    return null;
  }
}

export async function updateAdminCommentAction(
  payload: IUpdateAdminCommentPayload,
) {
  try {
    const response = await instance.put(
      `/admin/comments/${payload.id}`,
      {
        title: payload.title.trim(),
        caption: payload.caption.trim(),
        rating: Math.min(5, Math.max(1, Math.round(Number(payload.rating)))),
      },
      { headers: { tokenNeeded: "true" } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در ویرایش نظر",
    };
  }
}

export async function deleteAdminCommentAction(id: string | number) {
  try {
    const response = await instance.delete(`/admin/comments/${id}`, {
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
