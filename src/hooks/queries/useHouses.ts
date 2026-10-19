import { getHouses } from "@/features/example/services/api/houses/house.service";
import { useQuery } from "@tanstack/react-query";

export const useHouses = () => {
  return useQuery({
    queryKey: ["houses"],
    queryFn: getHouses,
  });
};