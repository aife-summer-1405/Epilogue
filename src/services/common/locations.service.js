import clientApi from "@/lib/http/interceptorsClient";

export const getLocations = async () => {
  const response = await clientApi.get("/locations", {
    params: { limit: 100 },
  });
  return response.data;
};
