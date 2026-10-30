"use server";

import axios from "axios";
import { bookingService } from "@/features/example/services/api/houses/booking.service";

interface Traveler {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  nationalId: string;
}

export interface CreateBookingPayload {
  houseId: number;
  reservedDates: [string, string];
  traveler_details: Traveler[];
  sharedEmail: string;
  sharedMobile: string;
}

export async function createBookingAction(
  payload: CreateBookingPayload,
) {
  try {
    if (
      !Number.isInteger(payload.houseId) ||
      payload.houseId <= 0 ||
      !payload.reservedDates[0] ||
      !payload.reservedDates[1] ||
      payload.reservedDates[1] <= payload.reservedDates[0] ||
      !payload.traveler_details.length
    ) {
      return {
        success: false,
        message: "اطلاعات رزرو معتبر نیست.",
      };
    }

    const response = await bookingService.create(payload);

    return {
      success: true,
      message: "رزرو با موفقیت ثبت شد.",
      booking: response.booking,
    };
  } catch (error) {
    console.error("[Booking Action]", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "ثبت رزرو ناموفق بود. لطفاً دوباره تلاش کنید.",
      };
    }

    return {
      success: false,
      message: "خطای غیرمنتظره‌ای هنگام ثبت رزرو رخ داد.",
    };
  }
}