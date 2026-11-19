"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getGivenFeedbacksAction, 
  getReceivedFeedbacksAction, 
  getLoyaltyAction, 
  createFeedbackAction 
} from "@/app/actions/feedback.action";
import { toast } from "react-toastify";

export function useGivenFeedbacks(userId: string | number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["feedbacks", "given", userId],
    queryFn: async () => {
      try {
        return await getGivenFeedbacksAction(userId);
      } catch (error) {
        toast.error("خطا در دریافت فیدبک‌های ارسالی");
        throw error;
      }
    },
    enabled: enabled && Boolean(userId),
  });
}

export function useReceivedFeedbacks(userId: string | number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["feedbacks", "received", userId],
    queryFn: async () => {
      try {
        return await getReceivedFeedbacksAction(userId);
      } catch (error) {
        toast.error("خطا در دریافت فیدبک‌های دریافتی");
        throw error;
      }
    },
    enabled: enabled && Boolean(userId),
  });
}

export function useLoyalty(userId: string | number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["loyalty", userId],
    queryFn: async () => {
      try {
        return await getLoyaltyAction(userId);
      } catch (error) {
        toast.error("خطا در دریافت امتیاز وفاداری");
        throw error;
      }
    },
    enabled: enabled && Boolean(userId),
  });
}

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      userId: number | string;
      houseId: number | string;
      rating: number;
      comment: string;
      pointsAwarded?: number;
    }) => createFeedbackAction(payload),
    
    onSuccess: () => {
      toast.success("دیدگاه شما با موفقیت ثبت شد!");
      queryClient.invalidateQueries({ queryKey: ["house"] });
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["loyalty"] });
    },
    
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ثبت دیدگاه، لطفاً دوباره تلاش کنید.");
    },
  });
};