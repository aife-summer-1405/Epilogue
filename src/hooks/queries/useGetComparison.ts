import { useQuery } from "@tanstack/react-query";
import { getComparisonHouses } from "@/services/comparison/comparison.service";

export const useGetComparison = (ids: string[]) => {
  const normalizedKey = ids.slice(0, 4).join(",");

  return useQuery({
    queryKey: ["comparison-houses", normalizedKey],
    queryFn: () => getComparisonHouses(ids),
    enabled: ids.length > 0,
  });
};