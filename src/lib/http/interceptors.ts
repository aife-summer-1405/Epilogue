import axios, { AxiosError, AxiosResponse } from "axios";
// import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
});

const onSuccess = (response: AxiosResponse) => response;

const onError = (error: AxiosError) => {
  return Promise.reject(error);
};

instance.interceptors.request.use(
  async (config) => {
    if (!config.headers?.Authorization) {
      // const token = (await cookies()).get("accessToken")?.value;
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(onSuccess, onError);

export default instance;
