import { z } from "zod";

export const contactSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "نام و نام خانوادگی باید حداقل ۵ حرف باشد" }),
  email: z.string().email({ message: "فرمت ایمیل نامعتبر است" }),
  message: z
    .string()
    .min(10, { message: "متن پیام باید حداقل ۱۰ کاراکتر باشد" }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
