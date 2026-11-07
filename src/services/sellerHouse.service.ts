import clientApi from "@/lib/http/interceptors";
import { SellerHouseResponse, SellerHouseQueryParams } from "@/core/types/sellerHouse";

export const fetchSellerHousesClient = async (params: SellerHouseQueryParams): Promise<SellerHouseResponse> => {
  const cleanParams: Record<string, any> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (key !== "transaction_type" && key !== "sort" && value !== undefined && value !== null && value !== "") {
      cleanParams[key] = value;
    }
  });

  try {
    const { data } = await clientApi.get<SellerHouseResponse>("/houses/seller/user", {
      params: cleanParams,
    });
    return data;
  } catch (error: any) {
    // چاپ اطلاعات کامل خطا برای بررسی وضعیت استتوس و هدرها
    console.error("🔍 FULL AXIOS ERROR OBJECT:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error?.message,
      config: error?.config,
    });
    throw error;
  }
};