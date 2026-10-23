import axios from "@/lib/http/interceptors";
import {
  HouseRent,
  HousesResponse,
} from "@/core/types/RentHouse/house";
import { HouseCommentsResponse } from "@/core/types/RentHouse/Comments/HouseRentComments.types";

// دریافت لیست همه‌ی خانه‌ها
export const getHouses = async (): Promise<HousesResponse> => {
  const { data } = await axios.get("/api/houses");
  return data;
};

// دریافت جزئیات یک خانه بر اساس ID
export const getHouseById = async (id: string): Promise<HouseRent> => {
  const { data } = await axios.get(`/api/houses/${id}`);
  return data;
};

// دریافت کامنت‌های یک خانه
export const getHouseComments = async (
  id: string,
  page: number
): Promise<HouseCommentsResponse> => {
  const { data } = await axios.get(
    `/api/houses/${id}/comments`,
    {
      params: { page },
    }
  );

  return data;
};

// نوع اطلاعاتی که برای ثبت کامنت ارسال می‌کنیم
export interface CreateCommentPayload {
  house_id: number;
  title: string;
  caption: string;
  rating: number;
  parent_comment_id: number | null;
}

// ثبت کامنت جدید
export const postComment = async (payload: CreateCommentPayload) => {
  const { data } = await axios.post("/api/comments", payload);
  return data;
};