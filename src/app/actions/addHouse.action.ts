// src/app/actions/addHouse.action.ts
"use server";

import instance from "@/lib/http/interceptors";
import { AddHouseFormData } from "@/core/types/addHouse";
import { AxiosError } from "axios";

export async function createHouseAction(formData: AddHouseFormData): Promise<{ success: boolean; houseId?: string; message?: string }> {
  try {
    const response = await instance.post("/houses", formData, {
      headers: {
        tokenNeeded: "true",
      },
    });

    const houseId = response.data?.id || response.data?.data?.id || response.data?.house?.id;

    return { success: true, houseId };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("CREATE HOUSE ERROR:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "خطا در ثبت ملک" };
    }
    return { success: false, message: "خطای ناشناخته رخ داد" };
  }
}

export async function uploadHousePhotosAction(houseId: string, images: File[]): Promise<{ success: boolean; message?: string }> {
  try {
    const formData = new FormData();
    images.forEach((file) => {
      formData.append("photos", file); // کلید درخواست دقیقا برابر با photos
    });

    await instance.post(`/houses/upload/photos/${houseId}`, formData, {
      headers: {
        tokenNeeded: "true",
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("UPLOAD PHOTOS ERROR:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "خطا در آپلود تصاویر" };
    }
    return { success: false, message: "خطای ناشناخته در آپلود تصاویر" };
  }
}