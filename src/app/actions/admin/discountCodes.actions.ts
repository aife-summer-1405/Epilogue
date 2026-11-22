"use server";

import instance from "@/lib/http/interceptors";
import {
  ICreateDiscountCodePayload,
  IDiscountCode,
  IGetDiscountCodesParams,
  IGetDiscountCodesResponse,
  IUpdateDiscountCodePayload,
} from "@/core/types/admin/discountCodes.types";

export async function getDiscountCodesAction(
  params: IGetDiscountCodesParams = {},
): Promise<IGetDiscountCodesResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const cleanParams: Record<string, string | number> = {
    page,
    limit,
    order: params.order ?? "ASC",
  };

  if (params.sort?.trim()) cleanParams.sort = params.sort.trim();
  if (params.code?.trim()) cleanParams.code = params.code.trim();
  if (
    params.discount_percentage !== undefined &&
    String(params.discount_percentage).trim() !== ""
  ) {
    cleanParams.discount_percentage = Number(params.discount_percentage);
  }

  const response = await instance.get("/discount-codes", {
    params: cleanParams,
    headers: { tokenNeeded: "true" },
  });

  const rawData = response.data;
  const list: IDiscountCode[] = Array.isArray(rawData?.data)
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

export async function createDiscountCodeAction(
  payload: ICreateDiscountCodePayload,
) {
  try {
    const response = await instance.post(
      "/discount-codes",
      {
        code: payload.code.trim().toUpperCase(),
        house_id: Number(payload.house_id),
        discount_percentage: Number(payload.discount_percentage),
        valid_until: payload.valid_until,
      },
      { headers: { tokenNeeded: "true" } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در ایجاد کد تخفیف",
    };
  }
}

export async function updateDiscountCodeAction(
  payload: IUpdateDiscountCodePayload,
) {
  try {
    const response = await instance.put(
      `/discount-codes/${payload.id}`,
      {
        code: payload.code.trim().toUpperCase(),
        house_id: Number(payload.house_id),
        discount_percentage: Number(payload.discount_percentage),
        valid_until: payload.valid_until,
      },
      { headers: { tokenNeeded: "true" } },
    );
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در ویرایش کد تخفیف",
    };
  }
}

export async function deleteDiscountCodeAction(id: string | number) {
  try {
    const response = await instance.delete(`/discount-codes/${id}`, {
      headers: { tokenNeeded: "true" },
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message: err.response?.data?.message || "خطا در حذف کد تخفیف",
    };
  }
}
