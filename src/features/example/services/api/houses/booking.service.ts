import axios from "@/lib/http/interceptors";
import {
  Booking,
  CreateBookingPayload,
  CreateBookingResponse,
} from "@/core/types/BookingFilter/booking";

export const bookingService = {
  getById: async (id: number | string): Promise<Booking> => {
    const response = await axios.get<CreateBookingResponse>(
      `/api/bookings/${id}`,
    );

    return response.data.booking;
  },

  create: async (payload: CreateBookingPayload) => {
    const response = await axios.post("/bookings", payload);
    return response.data;
  },
};
