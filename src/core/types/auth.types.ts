export type NewPasswordValues = {
  password: string;
  confirmPassword: string;
};
export type LoginValues = {
  email: string;
  password: string;
};
export type SignUpEmailValues = {
  email: string;
};
export type SignUpOtpValues = {
  otp: string;
};
export type SignUpCredentialsValues = {
  phone: string;
  password: string;
  confirmPassword: string;
};

export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    role: string;
    membershipDate: null | string;
    email: string;
    phoneNumber: string;
    emailVerified: boolean;
    fullName: string;
    firstName: string;
    lastName: string;
    profilePicture: null | string;
    createdAt: string;
    updatedAt: string;
    created_at: string;
    updated_at: string;
  };
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
