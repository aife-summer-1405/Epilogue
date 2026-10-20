import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "ایمیل خود را وارد کنید")
  .email("فرمت ایمیل وارد شده صحیح نیست");

const passwordField = z
  .string()
  .min(1, "رمز عبور خود را وارد کنید")
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد");

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const signUpEmailSchema = z.object({ email: emailField });

export const signUpOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "کد تایید باید ۶ رقم باشد")
    .regex(/^\d+$/, "کد تایید فقط شامل عدد است"),
});

export const signUpCredentialsSchema = z
  .object({
    phone: z
      .string()
      .trim()
      .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
    password: passwordField,
    confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمز عبور و تکرار آن یکسان نیستند",
  });

export const newPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمز عبور و تکرار آن یکسان نیستند",
  });
