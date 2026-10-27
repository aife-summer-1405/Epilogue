import clientApi from "@/lib/http/interceptorsClient";

export const getCategories = async () => {
  const { data } = await clientApi("/categories");
  return data;
};
