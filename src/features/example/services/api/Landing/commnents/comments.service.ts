import api from "@/lib/http/interceptors";

export const getComments = async () => {
  const { data } = await api.get("/api/comments");
  return data;
};