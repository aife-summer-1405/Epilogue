import { bookingService } from "@/features/example/services/api/houses/booking.service";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useBooking = (
  id: number | string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      try {
        const result = await bookingService.getById(id);
        console.log("[Booking] GET success:", result);
        return result;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("[Booking] GET failed:", {
            url: error.config?.url,
            status: error.response?.status,
            response: error.response?.data,
            message: error.message,
          });
        } else {
          console.error("[Booking] GET unexpected error:", error);
        }

        throw error;
      }
    },
    enabled: enabled && Boolean(id),
  });
};