import clientApi from "@/lib/http/interceptorsClient";

export const getComments = async () => {
  const { data } = await clientApi("/comments");
  return data;
};
