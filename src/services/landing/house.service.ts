import clientApi from "@/lib/http/interceptorsClient";

export const getHouses = async () => {
  const { data } = await clientApi.get("/houses");
  return data;
};
