import "server-only";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const COOKIE_MAX_AGE = 60 * 60 * 24;
const REFRESH_THRESHOLD_SECONDS = 5 * 60;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

const userIdCookieOptions = {
  ...cookieOptions,
  httpOnly: false,
};

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf-8"),
    );
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

function isExpiringSoon(token: string): boolean {
  const exp = getTokenExpiry(token);
  if (!exp) return false;
  return exp - Date.now() / 1000 < REFRESH_THRESHOLD_SECONDS;
}

async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) return null;

  try {
    const { data } = await instance.post("/auth/refresh", { refreshToken });
    console.log("[auth] token refreshed", new Date().toISOString());
    cookieStore.set("accessToken", data.accessToken, cookieOptions);
    if (data.refreshToken) {
      cookieStore.set("refreshToken", data.refreshToken, cookieOptions);
    }

    const userId = cookieStore.get("userId")?.value;
    if (userId) cookieStore.set("userId", userId, userIdCookieOptions);

    return data.accessToken;
  } catch {
    return null;
  }
}

const onSuccess = (response: AxiosResponse) => response;

const onError = async (error: AxiosError) => {
  const originalRequest = error.config as RetryConfig | undefined;

  if (
    error.response?.status !== 401 ||
    !originalRequest ||
    originalRequest._retry ||
    !originalRequest.headers.has("Authorization")
  ) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;
  const newToken = await refreshAccessToken();

  if (!newToken) {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("userId");
    redirect("/auth/login");
  }

  originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
  return instance(originalRequest);
};

instance.interceptors.request.use(
  async (config) => {
    if (config.headers?.tokenNeeded === "true") {
      const cookieStore = await cookies();
      let token = cookieStore.get("accessToken")?.value;

      if (token && isExpiringSoon(token)) {
        const newToken = await refreshAccessToken();
        if (newToken) token = newToken;
      }

      if (token) config.headers.set("Authorization", `Bearer ${token}`);
      config.headers.delete("tokenNeeded");
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(onSuccess, onError);

export default instance;
