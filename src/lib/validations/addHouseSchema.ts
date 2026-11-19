import { z } from "zod";

export const addHouseSchema = z.object({
  title: z.string().min(3, "نام ملک باید حداقل ۳ کاراکتر باشد"),
  address: z.string().min(5, "آدرس دقیق ملک را وارد کنید"),
  capacity: z.coerce.number().min(1, "ظرفیت باید حداقل ۱ نفر باشد"),
  price: z.coerce.number().min(1000, "قیمت معتبر نیست"),
  rooms: z.coerce.number().min(0, "تعداد اتاق نامعتبر است"),
  bathrooms: z.coerce.number().min(0, "تعداد حمام نامعتبر است"),
  parking: z.coerce.number().min(0, "تعداد پارکینگ نامعتبر است"),
  caption: z.string().min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد"),
  yard_type: z.string().min(1, "انتخاب نوع حیاط الزامی است"),
  tags: z.array(z.string()).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

export type AddHouseFormData = z.infer<typeof addHouseSchema>;