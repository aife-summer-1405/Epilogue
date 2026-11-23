"use server";

import {
  PaymentParams,
  PayRequestBody,
} from "@/core/types/panel/buyer/paymentManagement.types";
import {
  HouseDetail,
  IReservedUpdateBody,
  ReservedDetail,
  ReservedParams,
} from "@/core/types/panel/buyer/reserveManagement.types";
import instance from "@/lib/http/interceptors";
import { headers } from "next/headers";

export const getBuyerReserved = async (params: ReservedParams) => {
  const response = await instance("/bookings", {
    params: params,
    headers: { tokenNeeded: true },
  });
  return response.data;
};

export const getHouseDetailById = async (params: HouseDetail) => {
  const response = await instance(`/houses/${params}`);
  return response.data;
};

export const getBuyerReservedId = async (params: ReservedDetail) => {
  const response = await instance(`/bookings/${params}`, {
    headers: { tokenNeeded: true },
  });
  return response.data;
};

export const updateBuyerReservedById = async (
  params: ReservedDetail,
  body: IReservedUpdateBody,
) => {
  const response = await instance.put(`/bookings/${params}`, body, {
    headers: { tokenNeeded: true },
  });
  return response.data;
};

export const removeBuyerReserveById = async (params: ReservedDetail) => {
  const response = await instance.delete(`/bookings/${params}`, {
    headers: { tokenNeeded: true },
  });
  return response.data;
};

export const payReserveRequestById = async (body: PayRequestBody) => {
  const response = await instance.post("/payments", body, {
    headers: { tokenNeeded: true },
  });
  return response.data;
};

export const getBuyerPayments = async (params: PaymentParams) => {
  const response = await instance("/payments", {
    params: params,
    headers: { tokenNeeded: true },
  });
  return response.data;
};

export const getBuyerPaymentDetailById = async (params: ReservedDetail) => {
  const response = await instance(`/payments/${params}`, {
    headers: { tokenNeeded: true },
  });
  return response.data;
};

export const uploadContractDocument = async (formData: FormData) => {
  const response = await instance.post("/documents/upload", formData, {
    headers: { tokenNeeded: true },
  });
  return response.data;
};
