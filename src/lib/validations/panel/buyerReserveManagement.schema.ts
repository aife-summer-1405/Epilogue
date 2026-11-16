import { z } from "zod";
import { DateObject } from "react-multi-date-picker";

const toLatinDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));

const dateField = (message: string) =>
  z
    .custom<DateObject | null>((v) => v === null || v instanceof DateObject)
    .refine((v) => v !== null, message);

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const startDateField = dateField("تاریخ رفت را انتخاب کنید").refine((v) => {
  if (!v) return true;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return startOfDay(v.toDate()) >= startOfDay(tomorrow);
}, "تاریخ رفت باید از فردا به بعد باشد");

const birthDateField = dateField("تاریخ تولد الزامی است").refine(
  (v) => !v || startOfDay(v.toDate()) <= startOfDay(new Date()),
  "تاریخ تولد نمی‌تواند بعد از امروز باشد",
);

const travelerSchema = z.object({
  firstName: z.string().trim().min(1, "نام الزامی است"),
  lastName: z.string().trim().min(1, "نام خانوادگی الزامی است"),
  gender: z
    .object({ label: z.string(), value: z.union([z.string(), z.number()]) })
    .nullable()
    .refine((v) => v !== null, "جنسیت را انتخاب کنید"),
  birthDate: birthDateField,
  nationalId: z
    .string()
    .transform((v) => toLatinDigits(v.trim()))
    .pipe(z.string().regex(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد")),
});

export const editReserveSchema = z
  .object({
    startDate: startDateField,
    endDate: dateField("تاریخ برگشت را انتخاب کنید"),
    travelers: z
      .array(travelerSchema)
      .min(1, "حداقل یک مسافر لازم است")
      .max(10, "حداکثر ۱۰ مسافر مجاز است"),
    sharedEmail: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || z.string().email().safeParse(v).success,
        "فرمت ایمیل وارد شده صحیح نیست",
      ),
    sharedMobile: z
      .string()
      .transform((v) => toLatinDigits(v.trim()))
      .pipe(
        z
          .string()
          .refine(
            (v) => v === "" || /^09\d{9}$/.test(v),
            "شماره موبایل معتبر نیست (مثال: 09123456789)",
          ),
      ),
  })
  .superRefine((d, ctx) => {
    if (
      d.startDate &&
      d.endDate &&
      d.endDate.toDate().getTime() <= d.startDate.toDate().getTime()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "تاریخ برگشت باید بعد از تاریخ رفت باشد",
      });
    }
    const seen = new Set<string>();
    d.travelers.forEach((t, i) => {
      if (seen.has(t.nationalId)) {
        ctx.addIssue({
          code: "custom",
          path: ["travelers", i, "nationalId"],
          message: "کد ملی تکراری است",
        });
      }
      seen.add(t.nationalId);
    });
  });

export type EditReserveInput = z.input<typeof editReserveSchema>;
export type EditReserveOutput = z.output<typeof editReserveSchema>;
