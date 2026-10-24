
import { bookingService } from "@/features/example/services/api/houses/booking.service";
import { useQuery } from "@tanstack/react-query";

export const useBooking = (id: number | string, enabled = true) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getById(id),
    enabled: enabled && Boolean(id),
  });
};
