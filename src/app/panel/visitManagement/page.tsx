"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit02Icon,
  Cancel01Icon,
  Location01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";

import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import Badge from "@/components/atoms/badge/Badge";
import Modal from "@/components/molecules/modal/Modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  cancelVisitAppointment,
  getUserVisitAppointments,
  updateVisitAppointment,
  VisitAppointment,
  VisitAppointmentType,
} from "@/services/visitAppointment.service";

import { toast } from "react-toastify";

import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { useTheme } from "next-themes";

type FilterStatus = "all" | "pending" | "confirmed" | "cancelled" | "completed";

const statusOptions = [
  { value: "all", label: "همه وضعیت ها" },
  { value: "pending", label: "در انتظار تایید" },
  { value: "confirmed", label: "تایید شده" },
  { value: "cancelled", label: "لغو شده" },
  { value: "completed", label: "انجام شده" },
];

const perPageOptions = [
  { value: "8", label: "8 در هر صفحه" },
  { value: "12", label: "12 در هر صفحه" },
  { value: "18", label: "18 در هر صفحه" },
];

const statusConfig: Record<
  string,
  {
    label: string;
    badge: "confirmed" | "canceled" | "pending";
  }
> = {
  pending: {
    label: "در انتظار تایید",
    badge: "pending",
  },
  confirmed: {
    label: "تایید شده",
    badge: "confirmed",
  },
  canceled: {
    label: "لغو شده",
    badge: "canceled",
  },
  completed: {
    label: "انجام شده",
    badge: "confirmed",
  },
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
};

const formatTime = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsedDate);
};

const VisitAppointmentsPage = () => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();

  const [page, setPage] = useState("1");
  const [limit, setLimit] = useState("8");
  const [status, setStatus] = useState<FilterStatus>("all");

  const [editingAppointment, setEditingAppointment] =
    useState<VisitAppointment | null>(null);

  const [cancellingAppointment, setCancellingAppointment] =
    useState<VisitAppointment | null>(null);

  const [selectedDate, setSelectedDate] = useState<DateObject | null>(null);

  const [selectedTime, setSelectedTime] = useState("10:00");

  const [selectedType, setSelectedType] =
    useState<VisitAppointmentType>("in_person");

  const {
    data: appointments = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["BuyerVisitAppointments"],
    queryFn: getUserVisitAppointments,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: {
        appointmentTime: string;
        type: VisitAppointmentType;
      };
    }) => updateVisitAppointment(id, payload),

    onSuccess: () => {
      toast.success("زمان بازدید با موفقیت ویرایش شد");

      queryClient.invalidateQueries({
        queryKey: ["BuyerVisitAppointments"],
      });

      setEditingAppointment(null);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelVisitAppointment,

    onSuccess: () => {
      toast.success("بازدید با موفقیت لغو شد");

      queryClient.invalidateQueries({
        queryKey: ["BuyerVisitAppointments"],
      });

      setCancellingAppointment(null);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const filteredAppointments = useMemo(() => {
    if (!Array.isArray(appointments)) return [];

    if (status === "all") return appointments;

    return appointments.filter((appointment) => appointment.status === status);
  }, [appointments, status]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredAppointments.length / Number(limit)));
  }, [filteredAppointments, limit]);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (Number(page) - 1) * Number(limit);

    return filteredAppointments.slice(startIndex, startIndex + Number(limit));
  }, [filteredAppointments, page, limit]);

  const handleEdit = (appointment: VisitAppointment) => {
    const date = new Date(appointment.appointmentTime);

    setEditingAppointment(appointment);

    setSelectedDate(
      new DateObject({
        date,
        calendar: persian,
        locale: persian_fa,
      }),
    );

    setSelectedTime(
      `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes(),
      ).padStart(2, "0")}`,
    );

    setSelectedType(appointment.type);
  };

  const handleUpdate = () => {
    if (!editingAppointment || !selectedDate) {
      toast.error("لطفاً تاریخ بازدید را انتخاب کنید");
      return;
    }

    const date = selectedDate.toDate();
    const [hours, minutes] = selectedTime.split(":").map(Number);

    date.setHours(hours, minutes, 0, 0);

    if (date.getTime() <= Date.now()) {
      toast.error("زمان بازدید باید در آینده باشد");
      return;
    }

    updateMutation.mutate({
      id: editingAppointment.id,
      payload: {
        appointmentTime: date.toISOString(),
        type: selectedType,
      },
    });
  };

  const handleCancel = () => {
    if (!cancellingAppointment) return;

    cancelMutation.mutate(cancellingAppointment.id);
  };

  return (
    <>
      <div dir="rtl" className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-lg font-bold text-default-text sm:text-[20px]">
            لیست بازدیدهای شما
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
            <SelectComponent
              items={statusOptions}
              placeHolder="وضعیت بازدید"
              onChange={(value: string | null) => {
                setStatus((value || "all") as FilterStatus);
                setPage("1");
              }}
              triggerClassName="w-full bg-default-white-bg rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text h-auto! sm:w-48"
            />

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isPending}
              className="rounded-[16px] border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 disabled:opacity-50 dark:hover:bg-neutral-700"
            >
              بروزرسانی
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
          <div className="max-h-130 overflow-x-auto overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-250 text-xs sm:text-sm">
              <thead className="sticky top-0 z-10 bg-default-white-bg">
                <tr className="text-right">
                  <th className="py-3 font-bold text-sm whitespace-nowrap sm:text-base">
                    شناسه بازدید
                  </th>

                  <th className="py-3 font-bold text-sm whitespace-nowrap sm:text-base">
                    شناسه ملک
                  </th>

                  <th className="py-3 font-bold text-sm whitespace-nowrap sm:text-base">
                    تاریخ بازدید
                  </th>

                  <th className="py-3 font-bold text-sm whitespace-nowrap sm:text-base">
                    ساعت
                  </th>

                  <th className="py-3 font-bold text-sm whitespace-nowrap sm:text-base">
                    نوع بازدید
                  </th>

                  <th className="py-3 font-bold text-sm whitespace-nowrap sm:text-base">
                    وضعیت
                  </th>

                  <th className="py-3 text-left font-bold text-sm whitespace-nowrap sm:text-base">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {isPending ? (
                  Array.from({ length: 8 }, (_, index) => (
                    <tr key={index} className="border-t border-neutral-300">
                      {Array.from({ length: 7 }, (_, cell) => (
                        <td key={cell} className="px-2 py-4">
                          <Skeleton className="h-5 w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : isError ? (
                  <tr className="border-t border-neutral-300">
                    <td
                      colSpan={7}
                      className="py-10 text-center text-sm text-red-500"
                    >
                      {error instanceof Error
                        ? error.message
                        : "خطا در دریافت اطلاعات"}

                      <button
                        type="button"
                        onClick={() => refetch()}
                        className="mr-3 text-blue-600"
                      >
                        تلاش مجدد
                      </button>
                    </td>
                  </tr>
                ) : paginatedAppointments.length === 0 ? (
                  <tr className="border-t border-neutral-300">
                    <td
                      colSpan={7}
                      className="py-12 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                    >
                      بازدیدی یافت نشد
                    </td>
                  </tr>
                ) : (
                  paginatedAppointments.map((appointment: VisitAppointment) => {
                    const appointmentStatus = statusConfig[appointment.status];

                    const canManage =
                      appointment.status === "pending" ||
                      appointment.status === "confirmed";

                    return (
                      <tr
                        key={appointment.id}
                        className="border-t border-neutral-300 transition-colors duration-300 hover:bg-primary-50 dark:hover:bg-neutral-200"
                      >
                        <td className="py-4 text-sm whitespace-nowrap sm:text-base">
                          #{appointment.id}
                        </td>

                        <td className="py-4 text-sm whitespace-nowrap sm:text-base">
                          {appointment.houseId}
                        </td>

                        <td className="py-4 text-sm whitespace-nowrap sm:text-base">
                          {formatDate(appointment.appointmentTime)}
                        </td>

                        <td className="py-4 text-sm whitespace-nowrap sm:text-base">
                          {formatTime(appointment.appointmentTime)}
                        </td>

                        <td className="py-4">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <HugeiconsIcon
                              icon={
                                appointment.type === "virtual"
                                  ? Video01Icon
                                  : Location01Icon
                              }
                              size={19}
                            />

                            <span className="text-sm">
                              {appointment.type === "virtual"
                                ? "مجازی"
                                : "حضوری"}
                            </span>
                          </div>
                        </td>

                        <td className="py-4">
                          <Badge
                            text={appointmentStatus?.label}
                            type={appointmentStatus?.badge || "pending"}
                          />
                        </td>

                        <td className="py-4 pl-3">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              disabled={
                                !canManage ||
                                updateMutation.isPending ||
                                cancelMutation.isPending
                              }
                              title="ویرایش بازدید"
                              onClick={() => handleEdit(appointment)}
                              className="cursor-pointer text-blue-600 transition hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <HugeiconsIcon
                                icon={Edit02Icon}
                                className="size-5 sm:size-6"
                              />
                            </button>

                            <button
                              type="button"
                              disabled={!canManage || cancelMutation.isPending}
                              title="لغو بازدید"
                              onClick={() =>
                                setCancellingAppointment(appointment)
                              }
                              className="cursor-pointer text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <HugeiconsIcon
                                icon={Cancel01Icon}
                                className="size-5 sm:size-6"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Pagination
                currentPage={Number(page)}
                onPageChange={(event) => setPage(String(event))}
                totalPages={totalPages}
                siblingCount={0}
                containerClassName="w-fit! bg-transparent! gap-1! sm:gap-2!"
                itemClassName="cursor-pointer! size-7! rounded-full! flex! items-center! justify-center!"
                buttonsClassName="cursor-pointer! rounded-full! flex! items-center! justify-center! p-0 mx-1! sm:mx-2! size-7"
              />
            </div>

            <div className="hidden shrink-0 sm:block">
              <SelectComponent
                items={perPageOptions}
                placeHolder="تعداد نمایش"
                onChange={(value: string | null) => {
                  setLimit(value || "8");
                  setPage("1");
                }}
                triggerClassName="bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text h-auto!"
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={!!editingAppointment}
        onOpenChange={(open) => {
          if (!open && !updateMutation.isPending) {
            setEditingAppointment(null);
          }
        }}
        title="ویرایش زمان بازدید"
        contentClassName="sm:max-w-md"
        hasFooter
        footer={
          <div className="flex w-full gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={updateMutation.isPending}
              onClick={() => setEditingAppointment(null)}
              className="flex-1"
            >
              انصراف
            </Button>

            <Button
              type="button"
              disabled={updateMutation.isPending}
              onClick={handleUpdate}
              className="flex-1"
            >
              {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </div>
        }
      >
        <div className="space-y-5" dir="rtl">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              نوع بازدید
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedType("in_person")}
                className={`rounded-xl border p-3 text-sm transition ${
                  selectedType === "in_person"
                    ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950"
                    : "border-neutral-200 dark:border-neutral-600"
                }`}
              >
                بازدید حضوری
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("virtual")}
                className={`rounded-xl border p-3 text-sm transition ${
                  selectedType === "virtual"
                    ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950"
                    : "border-neutral-200 dark:border-neutral-600"
                }`}
              >
                بازدید مجازی
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              تاریخ بازدید
            </label>

            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/M/D"
              minDate={
                new DateObject({
                  calendar: persian,
                  locale: persian_fa,
                })
              }
              calendarPosition="bottom-right"
              inputClass="!h-12 !w-full !rounded-xl !border !border-neutral-200 !bg-[#F0F0F3] !px-4 !text-base !outline-none dark:!border-neutral-600 dark:!bg-[#353535] dark:!text-white"
              containerClassName="w-full"
              portal
              zIndex={10000}
              className={theme === "dark" ? "bg-dark" : ""}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              ساعت بازدید
            </label>

            <input
              type="time"
              value={selectedTime}
              onChange={(event) => setSelectedTime(event.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-200 bg-[#F0F0F3] px-4 text-left outline-none dark:border-neutral-600 dark:bg-[#353535] dark:text-white"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!cancellingAppointment}
        onOpenChange={(open) => {
          if (!open && !cancelMutation.isPending) {
            setCancellingAppointment(null);
          }
        }}
        title="لغو زمان بازدید"
        contentClassName="sm:max-w-md"
        hasFooter
        footer={
          <div className="flex w-full gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={cancelMutation.isPending}
              onClick={() => setCancellingAppointment(null)}
              className="flex-1"
            >
              انصراف
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={handleCancel}
              className="flex-1"
            >
              {cancelMutation.isPending ? "در حال لغو..." : "بله، لغو بازدید"}
            </Button>
          </div>
        }
      >
        <div dir="rtl" className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            آیا از لغو این بازدید اطمینان دارید؟
          </p>

          {cancellingAppointment && (
            <div className="rounded-xl bg-neutral-100 p-4 dark:bg-[#353535]">
              <p className="text-sm font-semibold">
                شناسه بازدید: #{cancellingAppointment.id}
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                تاریخ: {formatDate(cancellingAppointment.appointmentTime)}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                ساعت: {formatTime(cancellingAppointment.appointmentTime)}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                نوع بازدید:{" "}
                {cancellingAppointment.type === "virtual" ? "مجازی" : "حضوری"}
              </p>
            </div>
          )}

          <p className="text-xs text-red-500">
            پس از تأیید، درخواست لغو این بازدید ارسال خواهد شد.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default VisitAppointmentsPage;
