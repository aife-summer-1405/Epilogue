"use server";

import instance from "@/lib/http/interceptors";
import { AddHouseFormData } from "@/core/types/addHouse";
import { AxiosError } from "axios";

export interface EditHouseFormData extends AddHouseFormData {
  photos?: string[];
}

export async function getHouseByIdAction(houseId: string) {
  try {
    const response = await instance.get(`/houses/${houseId}`, {
      headers: { tokenNeeded: "true" },
    });
    return { success: true, data: response.data?.data || response.data };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return { success: false, message: error.response?.data?.message || "خطا در دریافت اطلاعات ملک" };
    }
    return { success: false, message: "خطای ناشناخته رخ داد" };
  }
}

export async function updateHouseAction(houseId: string, formData: EditHouseFormData): Promise<{ success: boolean; message?: string }> {
  try {
    await instance.put(`/houses/${houseId}`, formData, {
      headers: { tokenNeeded: "true" },
    });

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("UPDATE HOUSE ERROR:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "خطا در ویرایش ملک" };
    }
    return { success: false, message: "خطای ناشناخته رخ داد" };
  }
}

export async function uploadHousePhotosAction(houseId: string, images: File[]): Promise<{ success: boolean; message?: string }> {
  try {
    const formData = new FormData();
    images.forEach((file) => {
      formData.append("photos", file);
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
      return { success: false, message: error.response?.data?.message || "خطا در آپلود تصاویر" };
    }
    return { success: false, message: "خطای ناشناخته در آپلود تصاویر" };
  }
}