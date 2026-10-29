import clientApi from "@/lib/http/interceptorsClient";
import { HouseRent, HousesResponse } from "@/core/types/RentHouse/house";
import { HouseCommentsResponse } from "@/core/types/RentHouse/Comments/HouseRentComments.types";

export const getHouses = async (): Promise<HousesResponse> => {
  const { data } = await clientApi.get("/houses");
  return data;
};

export const getHouseById = async (id: string): Promise<HouseRent> => {
  const { data } = await clientApi.get(`/houses/${id}`);
  return data;
};

export const getHouseComments = async (
  id: string,
  page: number,
): Promise<HouseCommentsResponse> => {
  const { data } = await clientApi.get(`/houses/${id}/comments`, {
    params: { page },
  });

  return data;
};

export interface CreateCommentPayload {
  house_id: number;
  title: string;
  caption: string;
  rating: number;
  parent_comment_id: number | null;
}

export const postComment = async (payload: CreateCommentPayload) => {
  const { data } = await clientApi.post("/comments", payload);
  return data;
};
