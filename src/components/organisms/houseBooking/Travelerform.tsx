"use client";

import { useState } from "react";
import { z } from "zod";
import {
  Controller,
  useFieldArray,
  type Control,
} from "react-hook-form";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserAdd01Icon,
  UserGroupIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import Button from "@/components/atoms/button/Button";

const additionalTravelerSchema = z.object({
  firstName: z.string().min(1, "نام را وارد کنید"),
  lastName: z.string().min(1, "نام خانوادگی را وارد کنید"),
  gender: z.string().min(1, "جنسیت را انتخاب کنید"),
  birthDate: z.string().min(1, "تاریخ تولد را وارد کنید"),
  nationalId: z.string().regex(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد"),
});

export const travelerSchema = z.object({
  firstName: z.string().min(1, "نام را وارد کنید"),
  lastName: z.string().min(1, "نام خانوادگی را وارد کنید"),
  gender: z.string().min(1, "جنسیت را انتخاب کنید"),
  birthDate: z.string().min(1, "تاریخ تولد را وارد کنید"),
  nationalId: z.string().regex(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد"),

  additionalTravelers: z.array(additionalTravelerSchema).default([]),

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

const emptyTraveler = {
  firstName: "",
  lastName: "",
  gender: "",
  birthDate: "",
  nationalId: "",
};

interface Props {
  control: Control<TravelerFormValues>;
  onGenderChange: (value: string) => void;
  genderError?: string;
  onSelectPreviousTravelers?: () => void;
}

export default function TravelerForm({
  control,
  onGenderChange,
  genderError,
  onSelectPreviousTravelers,
}: Props) {
  const [previousTravelersMessage, setPreviousTravelersMessage] =
    useState("");

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "additionalTravelers",
  });

  const handlePreviousTravelers = () => {
    if (onSelectPreviousTravelers) {
      onSelectPreviousTravelers();
      return;
    }

    setPreviousTravelersMessage(
      "برای انتخاب مسافران سابق، ابتدا باید API مسافران ذخیره‌شده متصل شود.",
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* مشخصات مسافر اول */}
      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-bold">مشخصات مسافران</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            variableName="fullSm"
            control={control}
            name="firstName"
            title="نام"
            placeholder="نام"
          />

          <TextInput
            variableName="fullSm"
            control={control}
            name="lastName"
            title="نام خانوادگی"
            placeholder="نام خانوادگی"
          />

          <div>
            <FilterInput
              isTitle="جنسیت"
              placeHolder="جنسیت شما"
              items={GENDERS}
              onValueChange={(value) => {
                const item = value as
                  | { value: string }
                  | string
                  | null;

                onGenderChange(
                  typeof item === "string"
                    ? item
                    : (item?.value ?? ""),
                );
              }}
            />

            {genderError && (
              <p className="mt-2 text-xs text-danger-500">
                {genderError}
              </p>
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
                      field.onChange(
                        date ? date.format("YYYY/M/D") : "",
                      )
                    }
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/M/D"
                    maxDate={new DateObject({ calendar: persian })}
                    calendarPosition="bottom-right"
                    placeholder="تاریخ تولد"
                    inputClass="!h-10 !w-full !rounded-full !border-0 !bg-[#F0F0F3] !px-4 !text-sm !outline-none dark:!bg-[#353535]"
                    containerClassName="!w-full"
                  />

                  {fieldState.error && (
                    <p className="mt-2 text-xs text-danger-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <TextInput
            variableName="fullSm"
            control={control}
            name="nationalId"
            title="کد ملی"
            placeholder="کد ملی"
            inputMode="numeric"
          />
                  {/* دکمه‌های مدیریت مسافران */}
        <div className="flex flex-wrap items-center pt-8 gap-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => append({ ...emptyTraveler })}
            className="flex items-center gap-2 rounded-full"
          >
            <HugeiconsIcon icon={UserAdd01Icon} size={19} />
            افزودن مسافر جدید
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handlePreviousTravelers}
            className="flex items-center gap-2 rounded-full"
          >
            <HugeiconsIcon icon={UserGroupIcon} size={19} />
            انتخاب مسافران سابق
          </Button>
        </div>
        </div>



        {previousTravelersMessage && (
          <p className="text-sm text-[#8B8D98]" role="status">
            {previousTravelersMessage}
          </p>
        )}

        {/* فرم مسافران اضافه‌شده */}
        {fields.map((field, index) => (
          <section
            key={field.id}
            className="flex flex-col gap-5 rounded-2xl border border-[#CDCED6] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold">
                مشخصات مسافر {index + 2}
              </h3>

              <button
                type="button"
                onClick={() => remove(index)}
                className="flex items-center gap-1 text-sm text-red-500"
              >
                <HugeiconsIcon icon={Delete02Icon} size={18} />
                حذف مسافر
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name={`additionalTravelers.${index}.firstName`}
                render={({ field, fieldState }) => (
                  <div>
                    <input
                      {...field}
                      placeholder="نام"
                      aria-label={`نام مسافر ${index + 2}`}
                      className="h-11 w-full rounded-full bg-[#F0F0F3] px-4 text-sm outline-none dark:bg-[#353535]"
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-xs text-danger-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`additionalTravelers.${index}.lastName`}
                render={({ field, fieldState }) => (
                  <div>
                    <input
                      {...field}
                      placeholder="نام خانوادگی"
                      aria-label={`نام خانوادگی مسافر ${index + 2}`}
                      className="h-11 w-full rounded-full bg-[#F0F0F3] px-4 text-sm outline-none dark:bg-[#353535]"
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-xs text-danger-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`additionalTravelers.${index}.gender`}
                render={({ field, fieldState }) => (
                  <div>
                    <select
                      {...field}
                      aria-label={`جنسیت مسافر ${index + 2}`}
                      className="h-11 w-full rounded-full border-0 bg-[#F0F0F3] px-4 text-sm outline-none dark:bg-[#353535]"
                    >
                      <option value="">جنسیت</option>
                      <option value="male">مرد</option>
                      <option value="female">زن</option>
                    </select>
                    {fieldState.error && (
                      <p className="mt-1 text-xs text-danger-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`additionalTravelers.${index}.birthDate`}
                render={({ field, fieldState }) => (
                  <div>
                    <DatePicker
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(
                          date ? date.format("YYYY/M/D") : "",
                        )
                      }
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/M/D"
                      maxDate={new DateObject({ calendar: persian })}
                      calendarPosition="bottom-right"
                      placeholder="تاریخ تولد"
                      inputClass="!h-11 !w-full !rounded-full !border-0 !bg-[#F0F0F3] !px-4 !text-sm !outline-none dark:!bg-[#353535]"
                      containerClassName="!w-full"
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-xs text-danger-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name={`additionalTravelers.${index}.nationalId`}
                render={({ field, fieldState }) => (
                  <div>
                    <input
                      {...field}
                      inputMode="numeric"
                      placeholder="کد ملی"
                      aria-label={`کد ملی مسافر ${index + 2}`}
                      className="h-11 w-full rounded-full bg-[#F0F0F3] px-4 text-sm outline-none dark:bg-[#353535]"
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-xs text-danger-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </section>
        ))}
      </section>

      {/* اطلاعات ارسال بلیط */}
      <section className="flex flex-col gap-6 border-t border-[#CDCED6] pt-6">
        <h2 className="text-lg font-bold">ارسال بلیط به دیگران</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            variableName="fullSm"
            control={control}
            name="sharedEmail"
            title="ایمیل"
            placeholder="example@mail.com"
            type="email"
          />

          <TextInput
            variableName="fullSm"
            control={control}
            name="sharedMobile"
            title="شماره موبایل"
            placeholder="09123456789"
            inputMode="tel"
          />
        </div>
      </section>
    </div>
  );
}
