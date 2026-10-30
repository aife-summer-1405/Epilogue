"use server";

import axios from "axios";

import { commentService } from "@/features/example/services/api/houses/comment.service";

import type { CreateCommentPayload } from "@/features/example/services/api/houses/house.service";

export async function createCommentAction(
  payload: CreateCommentPayload,
) {
  try {
    if (
      !payload.house_id ||
      !payload.title?.trim() ||
      !payload.caption?.trim() ||
      !Number.isFinite(payload.rating) ||
      payload.rating < 1 ||
      payload.rating > 5
    ) {
      return {
        success: false,
        message: "اطلاعات نظر معتبر نیست.",
      };
    }

    const data = await commentService.create(payload);

    return {
      success: true,
      message: "نظر شما با موفقیت ثبت شد.",
      data,
    };
  }catch (error) {
  console.error("[Comment Action]", {
    message: error instanceof Error ? error.message : error,
    isAxiosError: axios.isAxiosError(error),
    status: axios.isAxiosError(error) ? error.response?.status : undefined,
    responseData: axios.isAxiosError(error)
      ? error.response?.data
      : undefined,
    requestUrl: axios.isAxiosError(error)
      ? error.config?.url
      : undefined,
  });

  return {
    success: false,
    message: axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : "خطای غیرمنتظره‌ای رخ داد.",
  };
}
}