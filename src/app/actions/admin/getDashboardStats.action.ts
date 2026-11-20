"use server";

import instance from "@/lib/http/interceptors";
import { AdminDashboardStats, DashboardActionResponse } from "@/core/types/dashboard.types";

export async function getAdminDashboardStatsAction(): Promise<DashboardActionResponse> {
  try {
    const response = await instance.get<AdminDashboardStats>("/admin/dashboard", {
      headers: {
        tokenNeeded: "true",
      },
    });

    const rawData = response.data;

    return {
      success: true,
      data: {
        totalUsers: Number(rawData?.totalUsers ?? 0),
        totalHouses: Number(rawData?.totalHouses ?? 0),
        totalBookings: Number(rawData?.totalBookings ?? 0),
        averageRating: String(rawData?.averageRating ?? "0.00"),
      },
    };
  } catch (error: any) {
    console.error("Admin Dashboard API Error:", error?.response?.data || error.message);
    return {
      success: false,
      message: error?.response?.data?.message || "خطا در دریافت اطلاعات داشبورد مدیریت",
    };
  }
}