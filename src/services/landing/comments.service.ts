import clientApi from "@/lib/http/interceptorsClient";

export const getComments = async () => {
  const { data } = await clientApi.get("/comments");
  return data;
};
