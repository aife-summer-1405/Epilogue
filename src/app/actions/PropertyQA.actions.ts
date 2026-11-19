"use server";

import instance from "@/lib/http/interceptors";
import { AxiosError } from "axios";

export async function getPropertyQAs(houseId: string | number) {
  try {
    const response = await instance.get(`/property-QA/${houseId}`, {
      headers: { tokenNeeded: "true" },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("QA FETCH ERROR:", error.response?.data || error.message);
    }
    throw new Error("خطا در دریافت پرسش و پاسخ‌ها");
  }
}

export async function createQuestionAction(payload: { houseId: string | number; question: string }) {
  try {
    const response = await instance.post("/property-QA/question", payload, {
      headers: { tokenNeeded: "true" },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("QUESTION POST ERROR:", error.response?.data || error.message);
    }
    throw new Error("خطا در ارسال سوال");
  }
}

export async function createAnswerAction(payload: { questionId: string | number; answer: string }) {
  try {
    const response = await instance.post("/property-QA/answer", payload, {
      headers: { tokenNeeded: "true" },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("ANSWER POST ERROR:", error.response?.data || error.message);
    }
    throw new Error("خطا در ارسال پاسخ");
  }
}