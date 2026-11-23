"use server";

import { isAxiosError } from "axios";
import api from "@/lib/http/interceptors";

export type VisitAppointmentType = "virtual" | "in_person";

interface CreateVisitAppointmentPayload {
  houseId: number | string;
  appointmentTime: string;
  type: VisitAppointmentType;
}

export interface UpdateVisitAppointmentPayload {
  appointmentTime: string;
  type: VisitAppointmentType;
}

export async function createVisitAppointment(
  payload: CreateVisitAppointmentPayload,
) {
  try {
    const { data } = await api.post("/visit-appointments", payload, {
      headers: {
        tokenNeeded: true,
      },
    });

    return {
      success: true as const,
      data,
    };
  } catch (error) {
    const message = isAxiosError(error)
      ? error.response?.data?.message || "ثبت زمان بازدید با مشکل مواجه شد"
      : "خطای غیرمنتظره‌ای رخ داد";

    return {
      success: false as const,
      message,
    };
  }
}

export interface VisitAppointment {
  id: number;
  houseId: string;
  userId: string;
  appointmentTime: string;
  type: "in_person" | "virtual";
  status: "pending" | "confirmed" | "cancelled" | "completed" | string;
  created_at: string;
  updated_at: string;
}

export async function getUserVisitAppointments(): Promise<VisitAppointment[]> {
  try {
    const response = await api.get("/visit-appointments/user", {
      headers: { tokenNeeded: true },
    });

    const result = response.data;

    if (Array.isArray(result)) return result;

    if (Array.isArray(result?.data)) return result.data;

    if (Array.isArray(result?.appointments)) return result.appointments;

    if (Array.isArray(result?.data?.appointments))
      return result.data.appointments;

    console.error("Unexpected appointments response:", result);

    return [];
  } catch (error) {
    const message = isAxiosError(error)
      ? error.response?.data?.message || "دریافت لیست بازدیدها با مشکل مواجه شد"
      : "خطای غیرمنتظره‌ای رخ داد";

    throw new Error(message);
  }
}

export async function cancelVisitAppointment(id: number) {
  try {
    const { data } = await api.post(
      `/visit-appointments/${id}/cancel`,
      undefined,
      { headers: { tokenNeeded: true } },
    );

    return data;
  } catch (error) {
    const message = isAxiosError(error)
      ? error.response?.data?.message || "لغو بازدید با مشکل مواجه شد"
      : "خطای غیرمنتظره‌ای رخ داد";

    throw new Error(message);
  }
}

export async function updateVisitAppointment(
  id: number,
  payload: UpdateVisitAppointmentPayload,
) {
  try {
    const { data } = await api.put(`/visit-appointments/${id}`, payload, {
      headers: { tokenNeeded: true },
    });

    return data;
  } catch (error) {
    const message = isAxiosError(error)
      ? error.response?.data?.message || "ویرایش بازدید با مشکل مواجه شد"
      : "خطای غیرمنتظره‌ای رخ داد";

    throw new Error(message);
  }
}
