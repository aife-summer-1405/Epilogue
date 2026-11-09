import { getHouseById, getHouses } from "@/services/landing/house.service";
import { useQuery } from "@tanstack/react-query";

export const useHouses = () => {
  return useQuery({
    queryKey: ["houses"],
    queryFn: getHouses,
  });
};

export const useHouse = (id: string) => {
  return useQuery({
    queryKey: ["house", id],
    queryFn: () => getHouseById(id),
    enabled: Boolean(id),
  });
};
