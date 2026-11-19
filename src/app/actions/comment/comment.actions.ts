"use server";

import axios from "axios";
import serverApi from "@/lib/http/interceptors";
import { ICreateCommentPayload } from "@/core/types/comments/comments.types";

export interface IUpdateCommentPayload {
  title: string;
  caption: string;
  rating: number;
}

export type ActionResult<T = unknown> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; data?: never };

function handleActionError(error: unknown): ActionResult<never> {
  console.error("[Comment Action]", {
    message: error instanceof Error ? error.message : error,
    isAxiosError: axios.isAxiosError(error),
    status: axios.isAxiosError(error) ? error.response?.status : undefined,
    responseData: axios.isAxiosError(error) ? error.response?.data : undefined,
    requestUrl: axios.isAxiosError(error) ? error.config?.url : undefined,
  });

  return {
    success: false,
    message: axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : "خطای غیرمنتظره‌ای رخ داد.",
  };
}

export async function createCommentAction(
  payload: ICreateCommentPayload
): Promise<ActionResult<any>> {
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

    return {
      success: true,
      message: "نظر شما با موفقیت ثبت شد.",
      data: response.data,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateCommentAction(
  id: number | string,
  payload: IUpdateCommentPayload
): Promise<ActionResult<any>> {
  try {
    if (
      !id ||
      !payload.title?.trim() ||
      !payload.caption?.trim() ||
      !Number.isFinite(payload.rating) ||
      payload.rating < 1 ||
      payload.rating > 5
    ) {
      return {
        success: false,
        message: "اطلاعات ویرایش نظر معتبر نیست.",
      };
    }

    const response = await serverApi.put(`/comments/${id}`, payload, {
      headers: {
        tokenNeeded: true,
      },
    });

    return {
      success: true,
      message: "نظر با موفقیت ویرایش شد.",
      data: response.data,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteCommentAction(
  id: number | string
): Promise<ActionResult<any>> {
  try {
    if (!id) {
      return {
        success: false,
        message: "شناسه نظر نامعتبر است.",
      };
    }

    const response = await serverApi.delete(`/comments/${id}`, {
      headers: {
        tokenNeeded: true,
      },
    });

    return {
      success: true,
      message: "نظر با موفقیت حذف شد.",
      data: response.data,
    };
  } catch (error) {
    return handleActionError(error);
  }
}