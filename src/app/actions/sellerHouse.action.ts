"use server";

import instance from "@/lib/http/interceptors";
import { SellerHouseResponse, SellerHouseQueryParams, Category } from "@/core/types/sellerHouse";
import { revalidatePath } from "next/cache";
import { AxiosError } from "axios";

export async function getSellerHousesAction(params: SellerHouseQueryParams): Promise<SellerHouseResponse> {
  try {
    const cleanParams: Record<string, string | number> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (key !== "transaction_type" && key !== "sort" && value !== undefined && value !== null && value !== "") {
        cleanParams[key] = value;
      }
    });

    const response = await instance.get<SellerHouseResponse>("/houses/seller/user", {
      params: cleanParams,
      headers: {
        tokenNeeded: "true",
      },
    });
    
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("SERVER SIDE FETCH ERROR:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("SERVER SIDE FETCH ERROR:", error.message);
    }
    return {
      houses: [],
      totalCount: 0,
    };
  }
}

export async function getCategoriesAction(): Promise<{ data: Category[]; totalCount: number }> {
  try {
    const response = await instance.get<{ data: Category[]; totalCount: number }>("/categories", {
      headers: {
        tokenNeeded: "true",
      },
    });
    return response.data;
  } catch {
    return { data: [], totalCount: 0 };
  }
}

export async function deleteSellerHouseAction(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    await instance.delete(`/houses/${id}`, {
      headers: {
        tokenNeeded: "true",
      },
    });
    revalidatePath("/seller/dashboard/places-management");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("DELETE ERROR:", error.response?.data || error.message);
    }
    return { success: false, message: "خطا در حذف ملک" };
  }
}