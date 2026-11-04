import { IHouseItem } from "@/core/types/houses/houseItems.types";
import { IHouseParams } from "@/core/types/houses/houseParams.types";

export interface GetHousesResponse {
  data: IHouseItem[];
  totalCount: number;
  totalPages: number;
}

export const getHouses = async (
  params: IHouseParams,
): Promise<GetHousesResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://aife-api.hexorix.net/api";
  const response = await fetch(`${baseUrl}/houses?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("خطا در دریافت لیست املاک");
  }

  const result = await response.json();

  if (Array.isArray(result)) {
    return {
      data: result,
      totalCount: result.length,
      totalPages: 1,
    };
  }

  const items: IHouseItem[] =
    result.data || result.houses || result.items || [];
  const totalCount = Number(result.totalCount ?? result.total ?? items.length);
  const limit = params.limit || 9;
  const totalPages = Number(
    result.totalPages ?? (Math.ceil(totalCount / limit) || 1),
  );

  return {
    data: items,
    totalCount,
    totalPages,
  };
};
