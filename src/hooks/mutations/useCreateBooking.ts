
import { CreateBookingPayload } from "@/core/types/BookingFilter/booking";
import { bookingService } from "@/features/example/services/api/houses/booking.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) =>
      bookingService.create(payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["booking"],
      });

      queryClient.setQueryData(
        ["booking", response.booking.id],
        response.booking
      );
    },
  });
};
