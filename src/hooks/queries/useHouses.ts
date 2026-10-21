import { getHouses } from "@/services/landing/house.service";
import { useQuery } from "@tanstack/react-query";

export const useHouses = () => {
  return useQuery({
    queryKey: ["houses"],
    queryFn: getHouses,
  });
};
