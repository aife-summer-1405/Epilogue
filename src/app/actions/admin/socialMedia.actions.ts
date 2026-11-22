"use server";

import instance from "@/lib/http/interceptors";
import {
  ICreateSocialMediaPayload,
  IGetSocialMediaLinksParams,
  IGetSocialMediaLinksResponse,
  ISocialMediaLink,
  IUpdateSocialMediaPayload,
} from "@/core/types/admin/socialMedia.types";

export async function getSocialMediaLinksAction(
  params: IGetSocialMediaLinksParams = {},
): Promise<IGetSocialMediaLinksResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const cleanParams: Record<string, string | number> = {
    page,
    limit,
    order: params.order ?? "ASC",
  };

  if (params.sort?.trim()) cleanParams.sort = params.sort.trim();
  if (params.platform?.trim()) cleanParams.platform = params.platform.trim();
  if (params.url?.trim()) cleanParams.url = params.url.trim();

  const response = await instance.get("/social-media-links", {
    params: cleanParams,
    headers: { tokenNeeded: "true" },
  });

  const rawData = response.data;
  const list: ISocialMediaLink[] = Array.isArray(rawData?.data)
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

export async function createSocialMediaLinkAction(
  payload: ICreateSocialMediaPayload,
) {
  try {
    const response = await instance.post(
      "/social-media-links",
      {
        platform: payload.platform.trim(),
        url: payload.url.trim(),
      },
      { headers: { tokenNeeded: "true" } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در افزودن لینک شبکه اجتماعی",
    };
  }
}

export async function updateSocialMediaLinkAction(
  payload: IUpdateSocialMediaPayload,
) {
  try {
    const response = await instance.put(
      `/social-media-links/${payload.id}`,
      {
        platform: payload.platform.trim(),
        url: payload.url.trim(),
      },
      { headers: { tokenNeeded: "true" } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در ویرایش لینک شبکه اجتماعی",
    };
  }
}

export async function deleteSocialMediaLinkAction(id: string | number) {
  try {
    const response = await instance.delete(`/social-media-links/${id}`, {
      headers: { tokenNeeded: "true" },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در حذف لینک شبکه اجتماعی",
    };
  }
}