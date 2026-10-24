import axios from "@/lib/http/interceptors";

export const getComments = async () => {
  const { data } = await axios.get("/api/comments");
  return data;
};