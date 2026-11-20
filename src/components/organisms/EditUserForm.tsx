"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format as formatJalali,
  getDay,
  isSameDay,
  isValid,
  parse,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  UserIcon,
  SmartPhone01Icon,
  Calendar03Icon,
  Image01Icon,
  FloppyDiskIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import { useUpdateUserMutation } from "@/hooks/useAdminUsers";
import type {
  AdminUserItem,
  UpdateAdminUserPayload,
} from "@/core/types/userManagement.types";

interface EditUserFormProps {
  user: AdminUserItem;
}

const WEEK_DAYS_FA = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const faToastOptions = {
  rtl: true,
  style: {
    direction: "rtl" as const,
    textAlign: "right" as const,
    fontFamily: "var(--font-primary), Vazirmatn, sans-serif",
  },
};

export function formatDateTime(dateValue?: string | Date | null): string {
  if (!dateValue) return "";
  const parsed =
    dateValue instanceof Date
      ? dateValue
      : typeof dateValue === "string"
        ? parseISO(dateValue)
        : new Date(dateValue);

  if (!isValid(parsed)) {
    const fallback = new Date(String(dateValue));
    if (!isValid(fallback)) return "";
    return formatJalali(fallback, "yyyy/MM/dd HH:mm", { locale: faIR });
  }

  return formatJalali(parsed, "yyyy/MM/dd HH:mm", { locale: faIR });
}

function parseAnyDate(rawValue?: string | null): Date | null {
  if (!rawValue || !rawValue.trim()) return null;
  const val = rawValue.trim().replace(/-/g, "/");

  const jalaliWithTime = parse(val, "yyyy/MM/dd HH:mm", new Date(), {
    locale: faIR,
  });
  if (isValid(jalaliWithTime) && jalaliWithTime.getFullYear() >= 1900) {
    return jalaliWithTime;
  }

  const jalaliDateOnly = parse(val, "yyyy/MM/dd", new Date(), {
    locale: faIR,
  });
  if (isValid(jalaliDateOnly) && jalaliDateOnly.getFullYear() >= 1900) {
    return jalaliDateOnly;
  }

  const isoDate = parseISO(rawValue.trim());
  if (isValid(isoDate)) {
    return isoDate;
  }

  const nativeDate = new Date(rawValue.trim());
  if (isValid(nativeDate)) {
    return nativeDate;
  }

  return null;
}

function toApiMembershipDate(rawValue?: string | null): string {
  const parsed = parseAnyDate(rawValue);
  if (!parsed) return "";
  return parsed.toISOString();
}

export function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateUserMutation();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => parseAnyDate(user.membershipDate) || new Date()
  );

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<UpdateAdminUserPayload>({
      defaultValues: {
        email: user.email || "",
        fullName: user.fullName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        emailVerified: Boolean(user.emailVerified),
        membershipDate: formatDateTime(user.membershipDate),
        profilePicture: user.profilePicture || "",
      },
    });

  useEffect(() => {
    reset({
      email: user.email || "",
      fullName: user.fullName || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.phoneNumber || "",
      emailVerified: Boolean(user.emailVerified),
      membershipDate: formatDateTime(user.membershipDate),
      profilePicture: user.profilePicture || "",
    });
  }, [user, reset]);

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const emailVerified = watch("emailVerified");
  const membershipDate = watch("membershipDate");

  useEffect(() => {
    const combined = [firstName, lastName].filter(Boolean).join(" ").trim();
    if (combined) {
      setValue("fullName", combined, { shouldDirty: true });
    }
  }, [firstName, lastName, setValue]);

  const handleSetNowJalali = () => {
    const nowFormatted = formatJalali(new Date(), "yyyy/MM/dd HH:mm", {
      locale: faIR,
    });
    setValue("membershipDate", nowFormatted, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingEmptyDays = (getDay(monthStart) + 1) % 7;
  const selectedDateObj = parseAnyDate(membershipDate);

  const handleSelectDay = (day: Date) => {
    const now = new Date();
    const merged = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      now.getHours(),
      now.getMinutes()
    );
    const formatted = formatJalali(merged, "yyyy/MM/dd HH:mm", {
      locale: faIR,
    });
    setValue("membershipDate", formatted, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setIsCalendarOpen(false);
  };

  const onSubmit = (values: UpdateAdminUserPayload) => {
    const isoMembershipDate = toApiMembershipDate(values.membershipDate);

    if (values.membershipDate?.trim() && !isoMembershipDate) {
      toast.error(
        "فرمت تاریخ عضویت معتبر نیست. مثال صحیح: 1405/08/29 یا 1405/08/29 16:30",
        faToastOptions
      );
      return;
    }

    const payload: UpdateAdminUserPayload = {
      email: values.email.trim(),
      fullName:
        values.fullName.trim() ||
        [values.firstName, values.lastName].filter(Boolean).join(" ").trim(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      emailVerified: Boolean(values.emailVerified),
      membershipDate: isoMembershipDate,
      profilePicture: values.profilePicture.trim(),
    };

mutate(
  { userId: user.id, payload },
  {
    onSuccess: () => {
      router.push("/panel/admin/users");
      router.refresh();
    },
  }
);
  };

  const parsedPreviewDate = parseAnyDate(membershipDate);

  return (
    <motion.form
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 sm:p-7 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextInput
          name="firstName"
          control={control}
          title="نام"
          placeholder="نام کاربر را وارد کنید"
          icons={UserIcon}
          rules={{ required: "وارد کردن نام الزامی است" }}
        />

        <TextInput
          name="lastName"
          control={control}
          title="نام خانوادگی"
          placeholder="نام خانوادگی کاربر را وارد کنید"
          icons={UserIcon}
          rules={{ required: "وارد کردن نام خانوادگی الزامی است" }}
        />

        <TextInput
          name="fullName"
          control={control}
          title="نام کامل (Full Name)"
          placeholder="نام کامل کاربر"
          icons={UserIcon}
        />

        <TextInput
          name="email"
          control={control}
          type="email"
          title="ایمیل"
          placeholder="example@domain.com"
          icons={Mail01Icon}
          rules={{ required: "وارد کردن ایمیل الزامی است" }}
        />

        <TextInput
          name="phoneNumber"
          control={control}
          title="شماره موبایل"
          placeholder="09123456789"
          icons={SmartPhone01Icon}
        />

        <div className="relative space-y-1.5">
          <div onClick={() => setIsCalendarOpen((prev) => !prev)}>
            <TextInput
              name="membershipDate"
              control={control}
              title="تاریخ عضویت (شمسی)"
              placeholder="1405/08/29 16:30"
              icons={Calendar03Icon}
              className="cursor-pointer"
            />
          </div>

          {isCalendarOpen && (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border border-neutral-300 dark:border-neutral-200 bg-default-white-bg dark:bg-default-dark-content p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCalendarMonth((m) => subMonths(m, 1))}
                  className="rounded-lg p-1.5 text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100 cursor-pointer"
                  aria-label="ماه قبل"
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    color="currentColor"
                  />
                </button>

                <span className="text-sm font-bold text-default-text">
                  {formatJalali(calendarMonth, "MMMM yyyy", { locale: faIR })}
                </span>

                <button
                  type="button"
                  onClick={() => setCalendarMonth((m) => addMonths(m, 1))}
                  className="rounded-lg p-1.5 text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100 cursor-pointer"
                  aria-label="ماه بعد"
                >
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    size={16}
                    color="currentColor"
                  />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-neutral-800 dark:text-neutral-600 mb-1.5">
                {WEEK_DAYS_FA.map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: leadingEmptyDays }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}

                {daysInMonth.map((day) => {
                  const isSelected =
                    selectedDateObj && isSameDay(day, selectedDateObj);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`h-8 rounded-lg font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary-500 text-white"
                          : isToday
                            ? "border border-primary-500 text-primary-600 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-100/20"
                            : "text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100"
                      }`}
                    >
                      {formatJalali(day, "d", { locale: faIR })}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-100 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setValue("membershipDate", "", { shouldDirty: true });
                    setIsCalendarOpen(false);
                  }}
                  className="text-danger-600 dark:text-danger-400 font-semibold hover:underline cursor-pointer"
                >
                  پاک کردن
                </button>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(false)}
                  className="font-bold text-neutral-800 dark:text-neutral-600 hover:underline cursor-pointer"
                >
                  بستن
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 text-xs">

            <button
              type="button"
              onClick={handleSetNowJalali}
              className="font-bold text-primary-500 dark:text-primary-200 hover:underline cursor-pointer"
            >
              ثبت زمان فعلی
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <TextInput
            name="profilePicture"
            control={control}
            title="لینک تصویر پروفایل"
            placeholder="https://example.com/avatar.jpg"
            icons={Image01Icon}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50 px-4 py-3.5">
        <div>
          <p className="text-sm font-bold text-default-text">وضعیت تایید ایمیل</p>
          <p className="text-xs text-neutral-800 dark:text-neutral-600">
            تعیین می‌کند که ایمیل این کاربر تایید شده است یا خیر
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={Boolean(emailVerified)}
            onChange={(e) =>
              setValue("emailVerified", e.target.checked, { shouldDirty: true })
            }
            className="h-4 w-4 accent-primary-500 cursor-pointer"
          />
          <span className="text-xs sm:text-sm font-bold text-default-text">
            {emailVerified ? "تایید شده" : "تایید نشده"}
          </span>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end pt-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => router.push("/panel/admin/users")}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-300 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-50 px-5 py-2.5 text-xs sm:text-sm font-bold text-default-text hover:bg-neutral-200 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={17} color="currentColor" />
          <span>بازگشت به لیست</span>
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
        >
          <HugeiconsIcon
            icon={FloppyDiskIcon}
            size={17}
            color="currentColor"
            strokeWidth={1.8}
          />
          <span>{isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
        </button>
      </div>
    </motion.form>
  );
}