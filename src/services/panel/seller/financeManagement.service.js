"use server";

import instance from "../../../lib/http/interceptors";

export const getSellerFinanceList = async (params) => {
  const response = await instance.get("/payments/seller-houses", {
    params: params,
    headers: { tokenNeeded: true },
  });
  return response.data;
};

export const acceptAPayment = async (params) => {
  const response = await instance.post(`/payments/${params}/verify`, null, {
    headers: { tokenNeeded: true },
  });
  return response.data;
};
