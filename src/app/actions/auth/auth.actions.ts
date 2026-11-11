"use server";

import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import api from "@/lib/http/interceptors";
import type {
  CompleteRegistrationPayload,
  CompleteRegistrationResponse,
  ForgetPassEmailPayload,
  ForgetPassEmailResponse,
  ForgetPassVerifyEmailPayload,
  ForgetPassVerifyEmailResponse,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  SignUpEmailPayload,
  SignUpEmailResponse,
  SignUpPhonePayload,
  SignUpPhoneResponse,
  SignUpVerifyEmailPayload,
  SignUpVerifyEmailResponse,
  SignUpVerifyPhonePayload,
  SignUpVerifyPhoneResponse,
} from "@/core/types/auth.types";
import { CurrentUser } from "../user.actions";

const GENERIC_ERROR = "مشکلی در فرایند ورود پیش آمد لطفا مجدد تلاش کنید.";

export type LoginActionResult =
  | { success: true; user?: CurrentUser }
  | { success: false; message: string };

export async function loginAction(
  raw: LoginPayload,
): Promise<LoginActionResult> {
  try {
    const { data } = await api.post<LoginResponse>("/auth/login", raw);

    if (!data.accessToken) {
      return { success: false, message: GENERIC_ERROR };
    }

    const cookieStore = await cookies();
    const base = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24,
    };

    cookieStore.set("accessToken", data.accessToken, {
      ...base,
    });
    if (data.user) {
      cookieStore.set("userId", data.user.id, {
        ...base,
        httpOnly: false,
      });
      cookieStore.set("userRole", data.user.role, {
        ...base,
        httpOnly: false,
      });
    }
    if (data.refreshToken) {
      cookieStore.set("refreshToken", data.refreshToken, {
        ...base,
      });
    }

    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        return { success: false, message: "اطلاعات وارد شده صحیح نیست." };
      } else if (error.response?.status === 404) {
        return { success: false, message: "کاربر یافت نشد." };
      } else {
        return { success: false, message: GENERIC_ERROR };
      }
    } else {
      return { success: false, message: GENERIC_ERROR };
    }
  }
}

export type SignUpEmailActionResult =
  | { success: true; tempUserId?: string }
  | { success: false; message: string };

export async function signUpEmailAction(
  raw: SignUpEmailPayload,
): Promise<SignUpEmailActionResult> {
  try {
    const { data } = await api.post<SignUpEmailResponse>("/auth/register", raw);

    return { success: true, tempUserId: data.tempUserId };
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.status === 400) {
        return {
          success: false,
          message: "شما قبلا با این ایمیل ثبت نام کرده اید.",
        };
      } else {
        return {
          success: false,
          message: "مشکلی در ارسال کد تایید پیش آمد مجدد تلاش کنید.",
        };
      }
    } else {
      return {
        success: false,
        message: "مشکلی در ارسال کد تایید پیش آمد مجدد تلاش کنید.",
      };
    }
  }
}

export type SignUpVerifyEmailActionResult =
  | { success: true }
  | { success: false; message: string };

export async function signUpVerifyEmailAction(
  raw: SignUpVerifyEmailPayload,
): Promise<SignUpVerifyEmailActionResult> {
  try {
    await api.post<SignUpVerifyEmailResponse>("/auth/verify-email", raw);

    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        return {
          success: false,
          message:
            error.response?.data?.message === "Invalid verification code"
              ? "کد وارد شده صحیح نمی باشد."
              : "کد تایید شما منقضی شده است لطفا مجدد تلاش کنید.",
        };
      } else if (status === 404) {
        return { success: false, message: "کاربر یافت نشد." };
      } else {
        return {
          success: false,
          message: "مشکلی در تایید کد پیش آمد، لطفا مجدد تلاش کنید.",
        };
      }
    } else {
      return {
        success: false,
        message: "مشکلی در تایید کد پیش آمد، لطفا مجدد تلاش کنید.",
      };
    }
  }
}
export type SignUpPhoneActionResult =
  | { success: true; tempUserId?: string }
  | { success: false; message: string };

export async function signUpPhoneAction(
  raw: SignUpPhonePayload,
): Promise<SignUpPhoneActionResult> {
  try {
    const { data } = await api.post<SignUpPhoneResponse>(
      "/auth/register-phone",
      raw,
    );

    return { success: true, tempUserId: data.tempUserId };
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 400) {
        return {
          success: false,
          message: "شما قبلا با این شماره ثبت نام کرده اید.",
        };
      } else {
        return {
          success: false,
          message: "مشکلی در ارسال کد تایید پیش آمد مجدد تلاش کنید.",
        };
      }
    } else {
      return {
        success: false,
        message: "مشکلی در ارسال کد تایید پیش آمد مجدد تلاش کنید.",
      };
    }
  }
}

export type SignUpVerifyPhoneActionResult =
  | { success: true }
  | { success: false; message: string };

export async function signUpVerifyPhoneAction(
  raw: SignUpVerifyPhonePayload,
): Promise<SignUpVerifyPhoneActionResult> {
  try {
    await api.post<SignUpVerifyPhoneResponse>("/auth/verify-phone", raw);

    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        return {
          success: false,
          message:
            error.response?.data?.message === "Invalid verification code"
              ? "کد وارد شده صحیح نمی باشد."
              : "کد تایید شما منقضی شده است لطفا مجدد تلاش کنید.",
        };
      } else if (status === 404) {
        return { success: false, message: "کاربر یافت نشد." };
      } else {
        return {
          success: false,
          message: "مشکلی در تایید کد پیش آمد، لطفا مجدد تلاش کنید.",
        };
      }
    } else {
      return {
        success: false,
        message: "مشکلی در تایید کد پیش آمد، لطفا مجدد تلاش کنید.",
      };
    }
  }
}
export type CompleteRegistrationActionResult =
  | { success: true }
  | { success: false; message: string; resetFlow?: boolean };

export async function completeRegistrationAction(
  raw: CompleteRegistrationPayload,
): Promise<CompleteRegistrationActionResult> {
  try {
    await api.post<CompleteRegistrationResponse>(
      "/auth/complete-registration",
      raw,
    );

    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        return {
          success: false,
          message: "لطفا مراحل ثبت نام را از ابتدا طی کنید.",
          resetFlow: true,
        };
      } else if (status === 404) {
        return { success: false, message: "کاربر یافت نشد." };
      } else {
        return {
          success: false,
          message: "مشکلی در ثبت اطلاعات شما پیش آمد مجدد تلاش کنید.",
        };
      }
    } else {
      return {
        success: false,
        message: "مشکلی در ثبت اطلاعات شما پیش آمد مجدد تلاش کنید.",
      };
    }
  }
}

export type ForgetPassEmailActionResult =
  | { success: true }
  | { success: false; message: string };

export async function forgetPassEmailAction(
  raw: ForgetPassEmailPayload,
): Promise<ForgetPassEmailActionResult> {
  try {
    await api.post<ForgetPassEmailResponse>(
      "/auth/forgot-password/request",
      raw,
    );
    return { success: true };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return { success: false, message: "حساب کاربری یافت نشد." };
    }
    return {
      success: false,
      message: "مشکلی در ارسال کد تایید پیش آمد مجدد تلاش کنید.",
    };
  }
}

export type ForgetPassVerifyActionResult =
  | { success: true }
  | { success: false; message: string };

export async function forgetPassVerifyEmailAction(
  raw: ForgetPassVerifyEmailPayload,
): Promise<ForgetPassVerifyActionResult> {
  try {
    await api.post<ForgetPassVerifyEmailResponse>(
      "/auth/forgot-password/verify",
      raw,
    );
    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        return {
          success: false,
          message:
            error.response?.data?.message === "Invalid reset code"
              ? "کد وارد شده صحیح نمی باشد."
              : "کد تایید شما منقضی شده است لطفا مجدد تلاش کنید.",
        };
      }
      if (status === 404) {
        return { success: false, message: "کاربر یافت نشد." };
      }
    }
    return {
      success: false,
      message: "مشکلی در تایید کد پیش آمد، لطفا مجدد تلاش کنید.",
    };
  }
}

export type ResetPasswordActionResult =
  | { success: true }
  | { success: false; message: string; resetFlow?: boolean };

export async function resetPasswordAction(
  raw: ResetPasswordPayload,
): Promise<ResetPasswordActionResult> {
  try {
    await api.post<ResetPasswordResponse>("/auth/forgot-password/reset", raw);
    return { success: true };
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400) {
        if (error.response?.data?.message === "Invalid reset code") {
          return {
            success: false,
            message:
              "کد وارد شده صحیح نمی باشد لطفا مراحل را از ابتدا طی کنید.",
            resetFlow: true,
          };
        }
        return {
          success: false,
          message: "کد تایید شما منقضی شده است لطفا مجدد تلاش کنید.",
          resetFlow: true,
        };
      }
      if (status === 404) {
        return { success: false, message: "کاربر یافت نشد." };
      }
    }
    return {
      success: false,
      message: "مشکلی در تغییر رمزعبور پیش آمد لطفا مجدد تلاش کنید.",
    };
  }
}

export type LogoutActionResult = { success: true; revoked: boolean };
export async function logoutAction(): Promise<LogoutActionResult> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  let revoked = false;

  try {
    if (refreshToken) {
      await api.post(
        "/auth/logout",
        { refreshToken },
        { headers: { tokenNeeded: "true" } },
      );
      revoked = true;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "[logout] API error:",
        error.response?.status ?? error.code,
      );
    }
  } finally {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("userId");
  }

  return { success: true, revoked };
}
