import instance from "@/lib/http/interceptors";
import { toast } from "react-toastify";

export interface SellerUpgradeUserInfo {
  id: string;
  email: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  role?: string | null;
}

export type SellerUpgradeRequestStatus = "pending" | "approved" | "rejected";

export interface IMySellerUpgradeRequest {
  id: string;
  userId: string;
  message: string;
  status: SellerUpgradeRequestStatus | string;
  reviewedBy?: string | null;
  adminNote?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  user?: SellerUpgradeUserInfo | null;
}

export interface CreateSellerUpgradePayload {
  message: string;
}

export const getMySellerUpgradeRequest =
  async (): Promise<IMySellerUpgradeRequest | null> => {
    try {
      const response = await instance.get("/seller-upgrade/my-request");
      const data = response?.data?.data ?? response?.data ?? null;
      if (!data || !data.id) return null;
      return data as IMySellerUpgradeRequest;
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 404) {
        return null;
      }
      throw error;
    }
  };

export const createSellerUpgradeRequest = async (
  payload: CreateSellerUpgradePayload
): Promise<IMySellerUpgradeRequest> => {
  try {
    const response = await instance.post("/seller-upgrade/request", payload);
    return response?.data?.data ?? response?.data;
  } catch (error: unknown) {
    const errMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "خطا در ثبت درخواست فروشندگی";
    toast.error(errMessage);
    throw error;
  }
};