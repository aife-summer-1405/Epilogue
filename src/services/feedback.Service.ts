import api from "@/lib/http/interceptors";
import { Feedback, CreateFeedbackPayload } from "@/core/types/RentHouse/feedback";

export const feedbackService = {
  createFeedback: async (payload: CreateFeedbackPayload): Promise<Feedback> => {
    const { data } = await api.post("/feedback", payload);
    return data;
  },
  
  getReceivedFeedbacks: async (userId: string | number): Promise<Feedback[]> => {
    const { data } = await api.get(`/feedback/received/${userId}`);
    return data;
  },

  getGivenFeedbacks: async (userId: string | number): Promise<Feedback[]> => {
    const { data } = await api.get(`/feedback/given/${userId}`);
    return data;
  }
};