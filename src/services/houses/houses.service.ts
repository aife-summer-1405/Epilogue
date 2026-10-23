export interface GetHousesParams {
  page?: number;
  limit?: number;
  search?: string;
  order?: "ASC" | "DESC";
  sort?: "last_updated" | "price" | "area" | "created_at";
  propertyType?: string;
  transactionType?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRent?: number;
  maxRent?: number;
  minMortgage?: number;
  maxMortgage?: number;
  minArea?: number;
  maxArea?: number;
}

export interface HouseItem {
  id: string | number;
  title: string;
  address: string;
  rate?: number;
  rating?: number;
  photos?: string[];
  image?: string;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  capacity?: number;
  guests?: number;
  parking?: number;
  price?: number | string;
  rent?: number | string;
  discounted_price?: number | string;
  discount?: number;
}

export interface GetHousesResponse {
  data: HouseItem[];
  totalCount: number;
  totalPages: number;
}

export const getHouses = async (params: GetHousesParams): Promise<GetHousesResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://aife-api.hexorix.net/api";
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

  const items: HouseItem[] = result.data || result.houses || result.items || [];
  const totalCount = Number(result.totalCount ?? result.total ?? items.length);
  const limit = params.limit || 9;
  const totalPages = Number(result.totalPages ?? (Math.ceil(totalCount / limit) || 1));

  return {
    data: items,
    totalCount,
    totalPages,
  };
};