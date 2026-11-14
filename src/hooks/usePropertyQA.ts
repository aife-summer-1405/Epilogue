"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPropertyQAs,
  createQuestionAction,
  createAnswerAction,
} from "@/app/actions/PropertyQA.actions";
import { toast } from "react-toastify";

export function usePropertyQAs(houseId: string | number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["property-qa", houseId],
    queryFn: async () => {
      try {
        return await getPropertyQAs(houseId);
      } catch (error) {
        toast.error("خطا در دریافت لیست پرسش و پاسخ‌ها");
        throw error;
      }
    },
    enabled: enabled && Boolean(houseId),
  });
}

export function usePropertyQAMutations(houseId: string | number) {
  const queryClient = useQueryClient();

  const questionMutation = useMutation({
    mutationFn: (question: string) =>
      createQuestionAction({ houseId: houseId, question }),
    onSuccess: () => {
      toast.success("سوال شما با موفقیت ثبت شد");
      queryClient.invalidateQueries({ queryKey: ["property-qa", houseId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ثبت سوال");
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({
      questionId,
      answer,
    }: {
      questionId: string | number;
      answer: string;
    }) => createAnswerAction({ questionId, answer }),
    onSuccess: () => {
      toast.success("پاسخ شما با موفقیت ثبت شد");
      queryClient.invalidateQueries({ queryKey: ["property-qa", houseId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "خطا در ثبت پاسخ");
    },
  });

  return {
    questionMutation,
    answerMutation,
  };
}