import { getLocations } from "@/services/common/locations.service";
import { useQuery } from "@tanstack/react-query";

export const useGetLocations = () =>
  useQuery({
    queryKey: ["Locations"],
    queryFn: getLocations,
  });
