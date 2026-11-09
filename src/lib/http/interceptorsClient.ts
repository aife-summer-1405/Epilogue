import axios, { AxiosError, AxiosResponse } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const clientApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const onSuccess = (response: AxiosResponse) => response;

const onError = (error: AxiosError) => {
  return Promise.reject(error);
};

clientApi.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

clientApi.interceptors.response.use(onSuccess, onError);

export default clientApi;
