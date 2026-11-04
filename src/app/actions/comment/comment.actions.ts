"use server";

import axios from "axios";
import serverApi from "@/lib/http/interceptors";
import { ICreateCommentPayload } from "@/core/types/comments/comments.types";

export async function createCommentAction(payload: ICreateCommentPayload) {
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

    const response = await serverApi.post("/comments", payload, {
      headers: {
        tokenNeeded: true,
      },
    });
    const data = response.data;

    return {
      success: true,
      message: "نظر شما با موفقیت ثبت شد.",
      data,
    };
  } catch (error) {
    console.error("[Comment Action]", {
      message: error instanceof Error ? error.message : error,
      isAxiosError: axios.isAxiosError(error),
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      responseData: axios.isAxiosError(error)
        ? error.response?.data
        : undefined,
      requestUrl: axios.isAxiosError(error) ? error.config?.url : undefined,
    });

    return {
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "خطای غیرمنتظره‌ای رخ داد.",
    };
  }
}
