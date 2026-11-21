"use server";

import { ReserveSellerParams } from "@/core/types/panel/seller/reserveManagement.types";
import instance from "@/lib/http/interceptors";

export const getSellerReserveList = async (
  userId: string | undefined,
  params: ReserveSellerParams,
) => {
  const response = await instance(`/bookings/${userId}/customers`, {
    params: params,
    headers: { tokenNeeded: true },
  });
  return response.data;
};

export const acceptReserve = async (reserveId: string | undefined) => {
  const response = await instance.post(
    `/bookings/${reserveId}/continue`,
    null,
    {
      headers: { tokenNeeded: true },
    },
  );
  return response.data;
};

export const rejectReserve = async (reserveId: string | undefined) => {
  const response = await instance.post(`/bookings/${reserveId}/cancel`, null, {
    headers: { tokenNeeded: true },
  });
  return response.data;
};
