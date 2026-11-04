import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getHouses } from "@/services/houses/houses.service";
import type { IHouseParams } from "@/core/types/houses/houseParams.types";

export const useGetHouses = (params: IHouseParams) => {
  return useQuery({
    queryKey: ["houses-list", params],
    queryFn: () => getHouses(params),
    placeholderData: keepPreviousData,
  });
};
