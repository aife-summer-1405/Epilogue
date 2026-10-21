import api from "@/lib/http/interceptors";

export const getHouses = async () => {
  const { data } = await api.get("/houses");
  return data;
};
