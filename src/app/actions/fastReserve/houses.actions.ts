"use server";

import api from "@/lib/http/interceptors";

export async function getHouses(filters: Record<string, string>) {
  try {
    const res = await api.get("/houses", { params: filters });
    return res.data;
  } catch {
    throw new Error("دریافت خانه ها با خطا روبرو شد");
  }
}
