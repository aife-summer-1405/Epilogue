"use server";

import instance from "@/lib/http/interceptors";

export interface CheckAvailabilityResponse {
  available: boolean;
  message?: string;
}

export async function checkHouseAvailabilityAction(
  houseId: number,
  startDate: string,
  endDate: string
): Promise<CheckAvailabilityResponse> {
  try {
    const response = await instance.get(`/houses/${houseId}/availability`, {
      params: { startDate, endDate },
      headers: {
        tokenNeeded: "true",
      },
    });

    console.log("Availability API Response:", response.data); 

    const data = response.data;

    const isAvailable = 
      data?.available ?? 
      data?.isAvailable ?? 
      data?.data?.available ?? 
      true; 

    return {
      available: Boolean(isAvailable),
      message: data?.message,
    };
  } catch (error: any) {
    console.error("Availability Error:", error?.response?.data || error.message);
    return {
      available: false,
      message: error?.response?.data?.message || "خطا در بررسی تاریخ اقامتگاه",
    };
  }
}