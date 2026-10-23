import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getHouses, GetHousesParams } from "@/services/houses/houses.service";

export const useGetHouses = (params: GetHousesParams) => {
  return useQuery({
    queryKey: ["houses-list", params],
    queryFn: () => getHouses(params),
    placeholderData: keepPreviousData,
  });
};