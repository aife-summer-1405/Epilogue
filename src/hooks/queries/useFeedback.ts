import { createFeedbackAction } from "@/app/actions/Feedback.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: {
      userId: number;
      houseId: number;
      rating: number;
      comment: string;
      pointsAwarded: number;
    }) => createFeedbackAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["house"] });
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
};