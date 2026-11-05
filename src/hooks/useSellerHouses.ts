import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSellerHousesClient } from "@/services/sellerHouse.service";
import { deleteSellerHouseAction } from "@/app/actions/sellerHouse.action";
import { SellerHouseQueryParams } from "@/core/types/sellerHouse";

export const useSellerHouses = (params: SellerHouseQueryParams, initialData?: any) => {
  return useQuery({
    queryKey: ["sellerHouses", params],
    queryFn: () => fetchSellerHousesClient(params),
    initialData: initialData,
    staleTime: 0, // برای اینکه با هر تغییر فوراً فچ انجام شود
  });
};

export const useDeleteSellerHouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSellerHouseAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerHouses"] });
    },
  });
};