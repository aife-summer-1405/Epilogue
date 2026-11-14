"use server";

import instance from "@/lib/http/interceptors";
import { Feedback, CreateFeedbackPayload } from "@/core/types/RentHouse/feedback";
import { AxiosError } from "axios";

// === Feedback Actions ===

export async function createFeedbackAction(payload: CreateFeedbackPayload): Promise<Feedback | null> {
  try {
    const response = await instance.post<Feedback>("/feedback", payload, {
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

export async function getReceivedFeedbacksAction(userId: string | number): Promise<Feedback[]> {
  try {
    const response = await instance.get<Feedback[]>(`/feedback/received/${userId}`, {
      headers: { tokenNeeded: "true" },
    });
    return response.data;
  } catch {
    return [];
  }
}


export async function addFavoriteAction(payload: { user_id: string; house_id: string }) {
  try {
    const response = await instance.post("/favorites", payload, {
      headers: { tokenNeeded: "true" },
    });
    return response.data; 
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("FAVORITE ADD ERROR:", error.response?.data || error.message);
    }
    throw new Error("خطا در افزودن به علاقه‌مندی‌ها");
  }
}

export async function removeFavoriteAction(favoriteId: string | number) {
  try {
    await instance.delete(`/favorites/${favoriteId}`, {
      headers: { tokenNeeded: "true" },
    });
    return true;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("FAVORITE DELETE ERROR RESPONSE:", error.response?.data || error.message);
    }
    throw new Error("خطا در حذف از علاقه‌مندی‌ها");
  }
}