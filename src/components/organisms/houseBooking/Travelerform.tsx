"use client";

import { z } from "zod";
import { Controller, type Control } from "react-hook-form";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
export const travelerSchema = z.object({
  firstName: z.string().min(1, "نام را وارد کنید"),
  lastName: z.string().min(1, "نام خانوادگی را وارد کنید"),
  gender: z.string().min(1, "جنسیت را انتخاب کنید"),
  birthDate: z.string().min(1, "تاریخ تولد را وارد کنید"),
  nationalId: z.string().regex(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد"),
  sharedEmail: z.string().email("ایمیل معتبر نیست").or(z.literal("")),
  sharedMobile: z
    .string()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر نیست")
    .or(z.literal("")),
});

export type TravelerFormValues = z.infer<typeof travelerSchema>;

const GENDERS = [
  { label: "مرد", value: "male" },
  { label: "زن", value: "female" },
];

interface Props {
  control: Control<TravelerFormValues>;
  onGenderChange: (value: string) => void;
  genderError?: string;
}

export default function TravelerForm({
  control,
  onGenderChange,
  genderError,
}: Props) {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-bold">مشخصات مسافران</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput variableName="fullSm" control={control} name="firstName" title="نام" placeholder="نام" />
          <TextInput variableName="fullSm" control={control} name="lastName" title="نام خانوادگی" placeholder="نام خانوادگی" />
          <div>
            <FilterInput
              isTitle="جنسیت"
              placeHolder="جنسیت"
              items={GENDERS}
              onValueChange={(v) => {
                const item = v as unknown as { value: string } | string | null;
                onGenderChange(
                  typeof item === "string" ? item : (item?.value ?? ""),
                );
              }}
            />
            {genderError && (
              <p className="mt-2 text-[12px] text-danger-500 sm:text-sm">{genderError}</p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              تاریخ تولد
            </label>

            <Controller
              control={control}
              name="birthDate"
              render={({ field, fieldState }) => (
                <>
                  <DatePicker
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(date ? date.format("YYYY/M/D") : "")
                    }
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/M/D"
                    maxDate={new Date()}
                    calendarPosition="bottom-right"
                    placeholder="تاریخ تولد"
                    inputClass="!h-10 !py-6 !w-full  !rounded-full  border border-neutral-600 dark:border-neutral-200 !px-4 !pl-10 !text-sm !outline-none dark:!bg-[#353535]"
                    containerClassName="!w-full"
                  />

                  {fieldState.error && (
                    <p className="mt-2 text-[12px] text-danger-500 sm:text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <TextInput variableName="fullSm" control={control} name="nationalId" title="کد ملی" placeholder="کد ملی" inputMode="numeric" />
        </div>
      </section>

      <section className="flex flex-col gap-6 border-t border-[#CDCED6] pt-6">
        <h2 className="text-lg font-bold">ارسال بلیط به دیگران</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput variableName="fullSm" control={control} name="sharedEmail" title="ایمیل" placeholder="example@mail.com" type="email" />
          <TextInput variableName="fullSm" control={control} name="sharedMobile" title="شماره موبایل" placeholder="09123456789" inputMode="tel" />
        </div>
      </section>
    </div>
  );
}