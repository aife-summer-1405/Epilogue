import {
  getHouseById,
  getHouses,
} from "@/features/example/services/api/houses/house.service";
import { useQuery } from "@tanstack/react-query";

// دریافت لیست خانه‌ها
export const useHouses = () => {
  return useQuery({
    queryKey: ["houses"],
    queryFn: getHouses,
  });
};

// دریافت جزئیات یک خانه
export const useHouse = (id: string) => {
  return useQuery({
    queryKey: ["house", id],
    queryFn: () => getHouseById(id),
    enabled: Boolean(id),
  });
};