import "server-only";
import axios from "@/lib/http/interceptors";
import {
  Booking,
  CreateBookingPayload,
  CreateBookingResponse,
} from "@/core/types/BookingFilter/booking";

export const bookingService = {
  getById: async (id: number | string): Promise<Booking> => {
    const response = await axios.get<CreateBookingResponse>(`/bookings/${id}`);

    return response.data.booking;
  },

  create: async (
    payload: CreateBookingPayload,
  ): Promise<CreateBookingResponse> => {
    const response = await axios.post<CreateBookingResponse>(
      "/bookings",
      payload,
      { headers: { tokenNeeded: true } },
    );

    return response.data;
  },
};
