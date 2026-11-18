"use server";

import instance from "@/lib/http/interceptors";

export interface CreateBookmarkPayload {
  houseId: number | string;
  note?: string;
}

export interface UpdateBookmarkPayload {
  id: number | string;
  houseId?: number | string;
  note?: string;
}

export interface SocialBookmark {
  id: number | string;
  houseId?: number | string;
  note?: string;
  shareUrl?: string;
  [key: string]: unknown;
}

export interface BookmarkResponse {
  bookmark?: SocialBookmark;
  shareUrl?: string;
  [key: string]: unknown;
}

export async function getSocialBookmarkByHouseIdAction(
  houseId: number | string,
) {
  try {
    const response = await instance.get(
      `/social-bookmarks/${houseId}`,
      {
        headers: {
          tokenNeeded: "true",
        },
      },
    );

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error: any) {
    console.error("GET BOOKMARK ERROR:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

    // فرض: اگر نشان‌شده‌ای برای این شناسه وجود نداشته باشد، API کد 404 می‌دهد.
    if (error?.response?.status === 404) {
      return {
        success: true as const,
        data: null,
      };
    }

    return {
      success: false as const,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "خطا در دریافت اطلاعات نشان‌شده",
    };
  }
}

export async function createSocialBookmarkAction(
  payload: CreateBookmarkPayload,
) {
  try {
    const response = await instance.post(
      "/social-bookmarks/bookmark",
      payload,
      {
        headers: {
          tokenNeeded: "true",
        },
      },
    );

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error: any) {
    console.error("CREATE BOOKMARK ERROR:", error?.response?.data || error);

    return {
      success: false as const,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "خطا در ثبت نشان‌شده",
    };
  }
}

export async function updateSocialBookmarkAction(
  payload: UpdateBookmarkPayload,
) {
  try {
    const response = await instance.put(
      `/social-bookmarks/${payload.id}`,
      {
        note: payload.note,
      },
      {
        headers: {
          tokenNeeded: "true",
        },
      },
    );

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error: any) {
    console.error("UPDATE BOOKMARK ERROR:", error?.response?.data || error);

    return {
      success: false as const,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "خطا در ویرایش نشان‌شده",
    };
  }
}

export async function deleteSocialBookmarkAction(
  id: number | string,
) {
  try {
    const response = await instance.delete(
      `/social-bookmarks/${id}`,
      {
        headers: {
          tokenNeeded: "true",
        },
      },
    );

    return {
      success: true as const,
      data: response.data,
    };
  } catch (error: any) {
    console.error("DELETE BOOKMARK ERROR:", error?.response?.data || error);

    return {
      success: false as const,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "خطا در حذف نشان‌شده",
    };
  }
}