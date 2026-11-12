export interface IComparisonHouse {
  id: string;
  title: string;
  address: string;
  photos: string[];
  rate: string | number;
  discounted_price: string | number | null;
  price: string | number;
  tags: string[];
  last_updated: string;
  capacity: number;
  location?: {
    lat: number;
    lng: number;
  };
  categories?: {
    name: string;
  };
  bathrooms: number;
  parking: number;
  rooms: number;
  yard_type: string;
  num_comments: number;
  discount_id: string | number | null;
  transaction_type: string;
  sellerId: string;
  sellerName: string;
  caption: string;
}

const getBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_API_URL || "https://aife-api.hexorix.net/api";
  return url.replace(/\/+$/, "");
};

export const parseComparisonIds = (rawIds?: string | string[]): string[] => {
  if (!rawIds) return [];
  const str = Array.isArray(rawIds) ? rawIds.join(",") : rawIds;
  return Array.from(
    new Set(
      str
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  ).slice(0, 4);
};

export const getComparisonHouses = async (
  ids: string[],
): Promise<IComparisonHouse[]> => {
  const validIds = ids.filter(Boolean).slice(0, 4);
  if (validIds.length === 0) return [];

  const response = await fetch(
    `${getBaseUrl()}/comparison?ids=${validIds.join(",")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("خطا در دریافت اطلاعات مقایسه املاک");
  }

  const result = await response.json();
  if (Array.isArray(result)) return result;
  return result.data || result.houses || [];
};