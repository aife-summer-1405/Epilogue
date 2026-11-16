"use client";

import Button from "@/components/atoms/button/Button";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { IFilterInputs } from "@/components/molecules/inputs/filterInput/IFilterInput";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import Modal from "@/components/molecules/modal/Modal";
import ThemedDatePicker from "@/components/molecules/themedDatePicker/ThemedDatePicker";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog } from "@base-ui/react";
import {
  AlertCircleIcon,
  Add01Icon,
  TrashIcon,
  UserGroup03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {
  getBuyerReservedId,
  updateBuyerReservedById,
} from "@/services/panel/buyer/reserveManagement.service";
import { cn } from "@/lib/utils";
import { getToday, getTomorrow } from "@/utils/getToday";
import { getUtcTimestamp, toGregorianDate } from "@/utils/date";
import { parseIsoDay } from "@/utils/formatters";
import { toast } from "react-toastify";
import {
  IReserved,
  IReservedUpdateBody,
} from "@/core/types/panel/buyer/reserveManagement.types";
import {
  editReserveSchema,
  type EditReserveInput,
  type EditReserveOutput,
} from "@/lib/validations/panel/buyerReserveManagement.schema";

const MAX_TRAVELERS = 10;

const genderOptions: IFilterInputs[] = [
  { label: "مرد", value: "male" },
  { label: "زن", value: "female" },
];

const paymentLabels: Record<string, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  success: "پرداخت شده",
  failed: "ناموفق",
  canceled: "لغو شده",
};

const reserveLabels: Record<string, string> = {
  confirmed: "تایید شده",
  pending: "در انتظار",
  canceled: "تایید نشده",
};

const toLatinDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));

const toMidnight = (date: DateObject) =>
  new DateObject(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

const parseIsoDate = (value?: string | null): DateObject | null => {
  const date = parseIsoDay(value);
  if (!date) return null;
  return new DateObject({ date, calendar: persian, locale: persian_fa });
};

const parseJalaliDate = (value?: string | null): DateObject | null => {
  if (!value) return null;
  const match = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(
    toLatinDigits(value).trim(),
  );
  if (!match) return null;
  const date = new DateObject({
    calendar: persian,
    locale: persian_fa,
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  });
  return date.isValid ? date : null;
};

const formatJalaliDate = (date: DateObject | null): string =>
  date
    ? new DateObject(date).convert(persian, persian_fa).format("YYYY/M/D")
    : "";

const createEmptyTraveler = (): EditReserveInput["travelers"][number] => ({
  firstName: "",
  lastName: "",
  gender: null,
  birthDate: null,
  nationalId: "",
});

const emptyValues: EditReserveInput = {
  startDate: null,
  endDate: null,
  travelers: [createEmptyTraveler()],
  sharedEmail: "",
  sharedMobile: "",
};

const mapToForm = (booking: IReserved): EditReserveInput => {
  const travelers = (booking.traveler_details ?? []).map((t) => ({
    firstName: t.firstName ?? "",
    lastName: t.lastName ?? "",
    gender: genderOptions.find((o) => o.value === t.gender) ?? null,
    birthDate: parseJalaliDate(t.birthDate),
    nationalId: toLatinDigits(t.nationalId ?? ""),
  }));

  return {
    startDate: parseIsoDate(booking.reservedDates?.[0]),
    endDate: parseIsoDate(booking.reservedDates?.[1]),
    travelers: travelers.length > 0 ? travelers : [createEmptyTraveler()],
    sharedEmail: booking.sharedEmail ?? "",
    sharedMobile: toLatinDigits(booking.sharedMobile ?? ""),
  };
};

const EditReserveModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const editId = searchParams.get("editId");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`ReserveDetail-${editId}`],
    queryFn: () => getBuyerReservedId(editId as string),
    enabled: !!editId,
  });

  const booking: IReserved | null = data?.booking ?? (data?.id ? data : null);
  const paymentStatus: string | null =
    data?.paymentStatus ?? data?.payment_status ?? null;

  const { control, handleSubmit, reset, setValue, getValues } = useForm<
    EditReserveInput,
    unknown,
    EditReserveOutput
  >({
    resolver: zodResolver(editReserveSchema),
    defaultValues: emptyValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "travelers",
  });

  const startDate = useWatch({ control, name: "startDate" });

  const minStartDate = useMemo(() => getTomorrow(), []);
  const maxBirthDate = useMemo(() => getToday(), []);
  const endMinDate = useMemo(
    () => (startDate ? new DateObject(startDate).add(1, "day") : undefined),
    [startDate],
  );

  useEffect(() => {
    reset(booking ? mapToForm(booking) : emptyValues);
  }, [booking, reset]);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("editId");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationKey: [`UpdatingReserve-${editId}`],
    mutationFn: (body: IReservedUpdateBody) =>
      updateBuyerReservedById(editId as string, body),
    onMutate: () => {
      toast.loading("درحال ویرایش رزرو", {
        toastId: `UpdatingReserve-${editId}`,
      });
    },
    onSuccess: () => {
      toast.update(`UpdatingReserve-${editId}`, {
        type: "success",
        render: "رزرو شما با موفقیت ویرایش شد",
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [`ReserveDetail-${editId}`] });
      queryClient.invalidateQueries({ queryKey: ["BuyerReservedManagement"] });
      closeModal();
    },
    onError: () => {
      toast.update(`UpdatingReserve-${editId}`, {
        type: "error",
        render: "ویرایش رزرو با خطا روبرو شد",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen || isPending) return;
    closeModal();
  };

  const onSubmit = (values: EditReserveOutput) => {
    if (!booking || !values.startDate || !values.endDate) return;

    mutate({
      houseId: String(booking.houseId),
      reservedDates: [
        toGregorianDate(values.startDate),
        toGregorianDate(values.endDate),
      ],
      traveler_details: values.travelers.map((t) => ({
        firstName: t.firstName.trim(),
        lastName: t.lastName.trim(),
        gender: String(t.gender?.value ?? ""),
        birthDate: formatJalaliDate(t.birthDate),
        nationalId: t.nationalId,
      })),
      status: booking.status,
      sharedEmail: values.sharedEmail,
      sharedMobile: values.sharedMobile,
    });
  };

  const showSkeleton = !!editId && isLoading;
  const showError = !showSkeleton && !!editId && (isError || !booking);
  const showForm = !showSkeleton && !showError && !!booking;
  const canAddTraveler = fields.length < MAX_TRAVELERS;

  return (
    <Modal
      title="ویرایش رزرو"
      contentClassName="w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-3xl"
      open={!!editId}
      onOpenChange={handleOpenChange}
      hasFooter={showForm}
      footer={
        <div className="flex w-full flex-col-reverse items-center justify-center gap-3 sm:flex-row sm:gap-8">
          <Dialog.Close
            data-slot="dialog-close"
            render={
              <Button
                disabled={isPending}
                className="w-full cursor-pointer rounded-[16px] border-neutral-dark-300 py-3 text-center text-base font-normal text-neutral-dark-300 sm:w-60 dark:border-neutral-400 dark:text-neutral-400"
                variant="outline"
              />
            }
          >
            انصراف
          </Dialog.Close>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="w-full rounded-[16px] text-white sm:w-60"
          >
            {isPending ? "در حال ذخیره ..." : "ذخیره تغییرات"}
          </Button>
        </div>
      }
    >
      {showSkeleton && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
            <Skeleton className="h-14 w-full rounded-[16px]" />
            <Skeleton className="h-14 w-full rounded-[16px]" />
          </div>
          <div className="flex flex-col gap-4 rounded-[16px] border border-neutral-300 p-4">
            <Skeleton className="h-5 w-24" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-[12px]" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-12 w-full rounded-[12px]" />
            <Skeleton className="h-12 w-full rounded-[12px]" />
          </div>
        </div>
      )}

      {showError && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="size-12 text-neutral-dark-300 dark:text-neutral-400"
          />
          <p className="text-base font-bold text-default-text">
            اطلاعات رزرو دریافت نشد
          </p>
          <p className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
            رزرو مورد نظر پیدا نشد یا ارتباط با سرور برقرار نیست
          </p>
          <Button
            onClick={() => refetch()}
            className="mt-2 rounded-[16px] px-6 py-2.5 text-white"
          >
            تلاش مجدد
          </Button>
        </div>
      )}

      {showForm && booking && (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-h-[60vh] flex-col gap-5 overflow-y-auto px-1 pb-5 scrollbar-hide sm:max-h-[65vh] sm:gap-6"
        >
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-default-text sm:text-xl">
              رزرو شماره {Number(booking.id).toLocaleString("fa-IR")}
            </p>
            <p className="text-xs font-normal text-neutral-dark-300 sm:text-sm dark:text-neutral-400">
              وضعیت رزرو: {reserveLabels[booking.status] ?? booking.status}
              {paymentStatus
                ? ` - ${paymentLabels[paymentStatus] ?? paymentStatus}`
                : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
            <Controller
              control={control}
              name="startDate"
              render={({ field, fieldState }) => (
                <div className="flex min-w-0 flex-col gap-1">
                  <ThemedDatePicker
                    label="تاریخ رفت"
                    value={field.value}
                    minDate={minStartDate}
                    onChange={(date: DateObject | null) => {
                      if (!date || Array.isArray(date)) return;
                      const selected = toMidnight(date);
                      field.onChange(selected);
                      const end = getValues("endDate");
                      if (
                        !end ||
                        getUtcTimestamp(end) <= getUtcTimestamp(selected)
                      ) {
                        setValue(
                          "endDate",
                          new DateObject(selected).add(1, "day"),
                          { shouldValidate: true },
                        );
                      }
                    }}
                  />
                  {fieldState.error && (
                    <span
                      className={"text-xs font-normal text-red-500 sm:text-sm"}
                    >
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="endDate"
              render={({ field, fieldState }) => (
                <div className="flex min-w-0 flex-col gap-1">
                  <ThemedDatePicker
                    label="تاریخ برگشت"
                    value={field.value}
                    onChange={(date: DateObject | null) => {
                      if (!date || Array.isArray(date)) return;
                      const selected = toMidnight(date);
                      if (
                        startDate &&
                        getUtcTimestamp(selected) <= getUtcTimestamp(startDate)
                      ) {
                        return;
                      }
                      field.onChange(selected);
                    }}
                    minDate={endMinDate}
                  />
                  {fieldState.error && (
                    <span
                      className={"text-xs font-normal text-red-500 sm:text-sm"}
                    >
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={UserGroup03Icon}
                  className="size-5 text-default-text"
                />
                <p className="text-base font-bold text-default-text">
                  اطلاعات مسافر ها
                </p>
              </div>
              <Button
                onClick={() => append(createEmptyTraveler())}
                disabled={!canAddTraveler || isPending}
                variant="outline"
                className="cursor-pointer rounded-[12px] px-3 py-2 text-sm font-normal text-default-text"
                startIcon={
                  <HugeiconsIcon icon={Add01Icon} className="size-4" />
                }
              >
                افزودن مسافر
              </Button>
            </div>

            {fields.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[16px] border border-neutral-300 p-3 sm:p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-default-text">
                    مسافر {(index + 1).toLocaleString("fa-IR")}
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1 || isPending}
                    aria-label="حذف مسافر"
                    className="cursor-pointer text-red-500 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <HugeiconsIcon icon={TrashIcon} className="size-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextInput<EditReserveInput>
                    control={control}
                    name={`travelers.${index}.firstName`}
                    title="نام"
                    placeholder="نام"
                  />
                  <TextInput<EditReserveInput>
                    control={control}
                    name={`travelers.${index}.lastName`}
                    title="نام خانوادگی"
                    placeholder="نام خانوادگی"
                  />
                  <TextInput<EditReserveInput>
                    control={control}
                    name={`travelers.${index}.nationalId`}
                    title="کد ملی"
                    placeholder="کد ملی"
                    inputMode="numeric"
                    maxLength={10}
                    dir="ltr"
                    onBeforeInput={(event: FormEvent<HTMLInputElement>) => {
                      const data = (event.nativeEvent as InputEvent).data;
                      if (data && !/^[0-9۰-۹٠-٩]+$/.test(data))
                        event.preventDefault();
                    }}
                    className="text-right"
                  />
                  <Controller
                    control={control}
                    name={`travelers.${index}.gender`}
                    render={({ field, fieldState }) => (
                      <div className="flex w-full min-w-0 flex-col gap-1">
                        <FilterInput
                          items={genderOptions}
                          isTitle="جنسیت"
                          placeHolder="انتخاب جنسیت"
                          value={field.value as IFilterInputs | null}
                          onValueChange={(option) => field.onChange(option)}
                          className={cn(
                            "w-full rounded-[12px] border border-neutral-600 dark:border-neutral-200 dark:bg-[#353535]",
                            "border-none",
                          )}
                          inputClassName={
                            "text-neutral-800! font-normal! text-base! placeholder:text-neutral-800!"
                          }
                        />
                        {fieldState.error && (
                          <span
                            className={
                              "text-xs font-normal text-red-500 sm:text-sm"
                            }
                          >
                            {fieldState.error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name={`travelers.${index}.birthDate`}
                    render={({ field, fieldState }) => (
                      <div className="flex min-w-0 flex-col gap-1 sm:col-span-2">
                        <ThemedDatePicker
                          label="تاریخ تولد"
                          value={field.value}
                          maxDate={maxBirthDate}
                          onChange={(date: DateObject | null) => {
                            if (!date || Array.isArray(date)) return;
                            field.onChange(toMidnight(date));
                          }}
                        />
                        {fieldState.error && (
                          <span
                            className={
                              "text-xs font-normal text-red-500 sm:text-sm"
                            }
                          >
                            {fieldState.error.message}
                          </span>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-base font-bold text-default-text">
              اطلاعات تماس
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput<EditReserveInput>
                control={control}
                name="sharedEmail"
                title="ایمیل"
                type="email"
                placeholder="example@mail.com"
                dir="ltr"
                className="text-right"
              />
              <TextInput<EditReserveInput>
                control={control}
                name="sharedMobile"
                title="شماره موبایل"
                type="tel"
                placeholder="09123456789"
                inputMode="numeric"
                maxLength={11}
                dir="ltr"
                onBeforeInput={(event: FormEvent<HTMLInputElement>) => {
                  const data = (event.nativeEvent as InputEvent).data;
                  if (data && !/^[0-9۰-۹٠-٩]+$/.test(data))
                    event.preventDefault();
                }}
                className="text-right"
              />
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditReserveModal;
