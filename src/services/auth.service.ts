import axios from "axios";

export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
};

export type SignUpEmailPayload = { email: string };
export type SignUpEmailResponse = {
  success: boolean;
  message?: string;
  tempUserId?: string;
};

export type SignUpVerifyEmailPayload = {
  tempUserId: string;
  verificationCode: string;
};
export type SignUpVerifyEmailResponse = {
  success: boolean;
  message?: string;
  userId?: string;
};

export type CompleteRegistrationPayload = {
  userId: string;
  password: string;
  phoneNumber: string;
};
export type CompleteRegistrationResponse = {
  success: boolean;
  message?: string;
  user?: { id: string; email: string; phoneNumber: string; fullName: string };
};

export type ForgetPassEmailPayload = { email: string };
export type ForgetPassEmailResponse = { success: boolean; message?: string };

export type ForgetPassVerifyEmailPayload = {
  email: string;
  code: string;
};
export type ForgetPassVerifyEmailResponse = {
  success: boolean;
  message?: string;
  userId?: string;
};

export type ResetPasswordPayload = {
  email: string;
  code: string;
  newPassword: string;
};
export type ResetPasswordResponse = { success: boolean; message?: string };

export const loginUser = async (body: LoginPayload) => {
  const response = await axios.post<LoginResponse>("/api/auth/login", body);
  return response.data;
};

export const signUpEmailUser = async (body: SignUpEmailPayload) => {
  const response = await axios.post<SignUpEmailResponse>(
    "/api/auth/register",
    body,
  );
  return response.data;
};

export const sigUpVerifyEmailUser = async (body: SignUpVerifyEmailPayload) => {
  const response = await axios.post<SignUpVerifyEmailResponse>(
    "/api/auth/register/verify-email",
    body,
  );
  return response.data;
};

export const completeRegistrationUser = async (
  body: CompleteRegistrationPayload,
) => {
  const response = await axios.post<CompleteRegistrationResponse>(
    "/api/auth/register/complete-registration",
    body,
  );
  return response.data;
};

export const forgetPassEmailUser = async (body: ForgetPassEmailPayload) => {
  const response = await axios.post<ForgetPassEmailResponse>(
    "/api/auth/forget-password",
    body,
  );
  return response.data;
};

export const forgetPassVerifyEmailUser = async (
  body: ForgetPassVerifyEmailPayload,
) => {
  const response = await axios.post<ForgetPassVerifyEmailResponse>(
    "/api/auth/forget-password/verify",
    body,
  );
  return response.data;
};

export const resetPasswordUser = async (body: ResetPasswordPayload) => {
  const response = await axios.post<ResetPasswordResponse>(
    "/api/auth/forget-password/reset",
    body,
  );
  return response.data;
};
