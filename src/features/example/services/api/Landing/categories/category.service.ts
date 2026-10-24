import api from "@/lib/http/interceptors";

export const getCategories = async () => {
  const { data } = await api.get("/api/categories");
  return data;
};