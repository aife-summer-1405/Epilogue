import api from "@/lib/http/interceptors"; 

export interface AvailabilityResponse {
  available: boolean;
  message?: string;
}

export const checkHouseAvailability = async (
  houseId: number,
  startDate: string,
  endDate: string
): Promise<AvailabilityResponse> => {
  const { data } = await api.get(`/houses/${houseId}/availability`, {
    params: { startDate, endDate },
  });
  return data;
};