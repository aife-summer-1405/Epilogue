// app/actions/Feedback.actions.ts
"use server";

import instance from "@/lib/http/interceptors";
import { AxiosError } from "axios";

export async function getGivenFeedbacksAction(userId: string | number) {
  try {
    const response = await instance.get(`/feedback/given/${userId}`, {
      headers: { tokenNeeded: "true" },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("GIVEN FEEDBACKS ERROR:", error.response?.data || error.message);
    }
    throw new Error("خطا در دریافت فیدبک‌های ارسالی");
  }
}

export async function getReceivedFeedbacksAction(userId: string | number) {
  try {
    const response = await instance.get(`/feedback/received/${userId}`, {
      headers: { tokenNeeded: "true" },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("RECEIVED FEEDBACKS ERROR:", error.response?.data || error.message);
    }
    throw new Error("خطا در دریافت فیدبک‌های دریافتی");
  }
}

export async function getLoyaltyAction(userId: string | number) {
  try {
    const response = await instance.get(`/feedback/loyalty/${userId}`, {
      headers: { tokenNeeded: "true" },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("LOYALTY FETCH ERROR:", error.response?.data || error.message);
    }
    throw new Error("خطا در دریافت امتیاز وفاداری");
  }
}

export async function createFeedbackAction(payload: {
  userId: number | string;
  houseId: number | string;
  rating: number;
  comment: string;
  pointsAwarded?: number;
}) {
  try {
    const response = await instance.post("/feedback", payload, {
      headers: { tokenNeeded: "true" },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("FEEDBACK CREATE ERROR:", error.response?.data || error.message);
    }
    throw new Error("خطا در ثبت دیدگاه");
  }
}