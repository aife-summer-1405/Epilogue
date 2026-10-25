import clientApi from "@/lib/http/interceptorsClient";

export const getCategories = async () => {
  const { data } = await clientApi.get("/categories");
  return data;
};
