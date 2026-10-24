import axios from "@/lib/http/interceptors";

export const getCategories = async () => {
  const { data } = await axios.get("/api/categories");
  return data;
};