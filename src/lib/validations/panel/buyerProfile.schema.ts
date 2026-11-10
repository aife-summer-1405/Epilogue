import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد"),
  phoneNumber: z
    .string()
    .regex(/^09\d{9}$/, "شماره تماس معتبر نیست (مثال: 09123456789)"),
  email: z.string().email("فرمت ایمیل وارد شده صحیح نیست"),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export const securityInfoSchema = z
  .object({
    currentPassword: z.string().min(1, "وارد کردن رمز عبور قبلی الزامی است"),
    newPassword: z
      .string()
      .min(6, "رمز عبور جدید باید حداقل ۶ کاراکتر باشد"),
    confirmNewPassword: z
      .string()
      .min(1, "تکرار رمز عبور جدید الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "تکرار رمز عبور با رمز عبور جدید مطابقت ندارد",
    path: ["confirmNewPassword"],
  });

export type SecurityInfoFormValues = z.infer<typeof securityInfoSchema>;