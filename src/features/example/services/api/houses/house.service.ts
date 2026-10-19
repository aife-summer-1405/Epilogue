import api from "@/lib/http/interceptors";

export const getHouses = async () => {
  const { data } = await api.get("/api/houses");
  return data;
};