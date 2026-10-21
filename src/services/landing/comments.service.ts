import api from "@/lib/http/interceptors";

export const getComments = async () => {
  const { data } = await api.get("/comments");
  return data;
};
