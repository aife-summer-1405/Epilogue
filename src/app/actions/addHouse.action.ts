"use server";

import instance from "@/lib/http/interceptors";
import { AddHouseFormData } from "@/core/types/addHouse";
import { AxiosError } from "axios";

export async function createHouseAction(formData: AddHouseFormData): Promise<{ success: boolean; message?: string }> {
  try {
    await instance.post("/houses", formData, {
      headers: {
        tokenNeeded: "true",
      },
    });

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("CREATE HOUSE ERROR:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "خطا در ثبت ملک" };
    }
    return { success: false, message: "خطای ناشناخته رخ داد" };
  }
}