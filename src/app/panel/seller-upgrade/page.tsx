"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  Sent02Icon,
  UserIcon,
  Mail01Icon,
  SmartPhone01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CancelCircleIcon,
} from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import Badge from "@/components/atoms/badge/Badge";
import Modal from "@/components/molecules/modal/Modal";
import { Dialog } from "@base-ui/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createSellerUpgradeRequestAction,
  getMySellerUpgradeRequestAction,
  IMySellerUpgradeRequest,
} from "@/app/actions/seller-upgrade.action";
import { formatPersianDate } from "@/utils/formatters";

const DEFAULT_MESSAGE =
  "I want to become a seller to list my properties";

function mapStatusToBadgeType(
  status?: string | null
): "confirmed" | "pending" | "canceled" {
  const normalized = (status ?? "").toLowerCase();
  if (normalized === "approved" || normalized === "confirmed") {
    return "confirmed";
  }
  if (normalized === "rejected" || normalized === "canceled") {
    return "canceled";
  }
  return "pending";
}

function getStatusLabel(status?: string | null): string {
  const normalized = (status ?? "").toLowerCase();
  if (normalized === "approved" || normalized === "confirmed") {
    return "تایید شده";
  }
  if (normalized === "rejected" || normalized === "canceled") {
    return "رد شده";
  }
  return "در انتظار بررسی";
}

const BuyerSellerUpgradePage = () => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: myRequest, isPending } =
    useQuery<IMySellerUpgradeRequest | null>({
      queryKey: ["BuyerSellerUpgradeRequest"],
      queryFn: getMySellerUpgradeRequestAction,
    });

  const { mutate: submitRequestMutate, isPending: isSubmitting } = useMutation({
    mutationKey: ["CreateSellerUpgradeRequest"],
    mutationFn: (payloadMessage: string) =>
      createSellerUpgradeRequestAction({ message: payloadMessage }),
    onMutate: () => {
      toast.loading("در حال ثبت درخواست فروشندگی...", {
        toastId: "SellerUpgradeToast",
      });
    },
    onSuccess: (created) => {
      toast.update("SellerUpgradeToast", {
        render: "درخواست ارتقا به فروشنده با موفقیت ثبت شد",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.setQueryData(["BuyerSellerUpgradeRequest"], created);
      queryClient.invalidateQueries({ queryKey: ["BuyerSellerUpgradeRequest"] });
      setIsModalOpen(false);
    },
    onError: (err: unknown) => {
      toast.update("SellerUpgradeToast", {
        render:
          err instanceof Error
            ? err.message
            : "ثبت درخواست فروشندگی با خطا مواجه شد",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanMessage = message.trim();
    if (!cleanMessage) return;
    submitRequestMutate(cleanMessage);
  };

  const statusNormalized = (myRequest?.status ?? "").toLowerCase();
  const isApproved = statusNormalized === "approved";
  const isRejected = statusNormalized === "rejected";

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-lg font-bold text-default-text sm:text-[20px]">
          درخواست ارتقا به فروشنده
        </p>

        {!isPending && !myRequest && (
          <div className="flex w-full items-center gap-3 lg:w-auto lg:gap-4">
            <Modal
              title="ثبت درخواست ارتقا به فروشنده"
              contentClassName="sm:max-w-xl"
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
              trigger={
                <Button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[16px] px-4 py-2.5 text-sm font-normal text-white lg:w-auto">
                  <HugeiconsIcon
                    icon={Store01Icon}
                    className="size-5 shrink-0"
                    stroke="1.5"
                  />
                  <span>ثبت درخواست فروشندگی</span>
                </Button>
              }
              hasFooter={true}
              footer={
                <div className="flex w-full flex-col-reverse items-center justify-between gap-3 sm:flex-row sm:gap-8">
                  <Dialog.Close
                    data-slot="dialog-close"
                    render={
                      <Button
                        className="w-full cursor-pointer rounded-[16px] border-neutral-dark-300 py-3 text-center text-base font-normal text-neutral-dark-300 sm:w-4/10 dark:border-neutral-400 dark:text-neutral-400"
                        variant="outline"
                      />
                    }
                  >
                    انصراف
                  </Dialog.Close>
                  <Button
                    disabled={isSubmitting || !message.trim()}
                    onClick={() => submitRequestMutate(message.trim())}
                    className="w-full cursor-pointer rounded-[16px] text-white sm:w-4/10"
                  >
                    {isSubmitting ? "در حال ارسال..." : "ارسال درخواست"}
                  </Button>
                </div>
              }
            >
              <div className="flex w-full flex-col gap-4">
                <p className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
                  توضیح یا پیام خود را برای ثبت اقامتگاه و تبدیل حساب به
                  فروشنده وارد کنید:
                </p>
                <textarea
                  rows={4}
                  dir="ltr"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I want to become a seller to list my properties"
                  className="w-full rounded-[16px] border border-neutral-300 bg-default-white-bg p-3.5 text-left text-sm font-normal text-default-text outline-none focus:border-primary-500"
                />
              </div>
            </Modal>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
        {isPending ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-7 w-24 rounded-[8px]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton className="h-24 w-full rounded-[16px]" />
              <Skeleton className="h-24 w-full rounded-[16px]" />
            </div>
            <Skeleton className="h-32 w-full rounded-[16px]" />
          </div>
        ) : myRequest ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-300 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                  <HugeiconsIcon
                    icon={
                      isApproved
                        ? CheckmarkCircle02Icon
                        : isRejected
                          ? CancelCircleIcon
                          : Clock01Icon
                    }
                    className="size-5"
                    stroke="1.5"
                  />
                </div>
                <div>
                  <h2 className="text-base font-bold text-default-text sm:text-lg">
                    وضعیت درخواست شما #{myRequest.id}
                  </h2>
                  <p className="text-xs text-neutral-dark-300 dark:text-neutral-400">
                    {isApproved
                      ? "حساب کاربری شما به فروشنده ارتقا یافته است."
                      : isRejected
                        ? "درخواست شما توسط مدیریت رد شده است."
                        : "درخواست شما در صف بررسی مدیریت قرار دارد."}
                  </p>
                </div>
              </div>

              <Badge
                text={getStatusLabel(myRequest.status)}
                type={mapStatusToBadgeType(myRequest.status)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-[16px] border border-neutral-300 p-3.5">
                <HugeiconsIcon
                  icon={UserIcon}
                  className="size-5 shrink-0 text-neutral-dark-300 dark:text-neutral-400"
                />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-dark-300 dark:text-neutral-400">
                    نام و نام خانوادگی
                  </p>
                  <p className="truncate text-sm font-bold text-default-text">
                    {myRequest.user?.fullName || "ثبت نشده"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[16px] border border-neutral-300 p-3.5">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="size-5 shrink-0 text-neutral-dark-300 dark:text-neutral-400"
                />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-dark-300 dark:text-neutral-400">
                    ایمیل
                  </p>
                  <p className="truncate text-sm font-bold text-default-text">
                    {myRequest.user?.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-[16px] border border-neutral-300 p-3.5">
                <HugeiconsIcon
                  icon={SmartPhone01Icon}
                  className="size-5 shrink-0 text-neutral-dark-300 dark:text-neutral-400"
                />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-dark-300 dark:text-neutral-400">
                    شماره تماس
                  </p>
                  <p
                    dir="ltr"
                    className="truncate text-right text-sm font-bold text-default-text"
                  >
                    {myRequest.user?.phoneNumber || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-[16px] border border-neutral-300 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-dark-300 dark:text-neutral-400">
                <span className="font-bold text-default-text">
                  متن پیام ارسال‌شده
                </span>
                <span>تاریخ ثبت: {formatPersianDate(myRequest.createdAt)}</span>
              </div>
              <p
                dir="ltr"
                className="rounded-[12px] bg-neutral-100 dark:bg-neutral-200 p-3 text-left text-sm text-default-text break-words"
              >
                {myRequest.message || "—"}
              </p>

              {myRequest.adminNote && (
                <div className="border-t border-neutral-300 pt-3">
                  <p className="mb-1.5 text-xs font-bold text-default-text">
                    یادداشت مدیریت
                  </p>
                  <p
                    dir="rtl"
                    className="rounded-[12px] bg-neutral-100 dark:bg-neutral-200 p-3 text-right text-xs sm:text-sm text-neutral-dark-300 dark:text-neutral-400 break-words"
                  >
                    {myRequest.adminNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            <div className="border-b border-neutral-300 pb-4">
              <h2 className="text-base font-bold text-default-text sm:text-lg">
                هنوز درخواست ارتقا به فروشنده ثبت نکرده‌اید
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-dark-300 dark:text-neutral-400">
                با ثبت این درخواست، پس از تایید مدیریت امکان ثبت و مدیریت
                اقامتگاه‌ها برای شما فعال می‌شود.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-default-text">
                پیام درخواست (message)
              </label>
              <textarea
                rows={4}
                required
                dir="ltr"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I want to become a seller to list my properties"
                className="w-full rounded-[16px] border border-neutral-300 bg-default-white-bg p-3.5 text-left text-sm font-normal text-default-text outline-none transition-colors focus:border-primary-500"
              />
            </div>

            <div className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[16px] px-5 py-2.5 text-sm font-normal text-white sm:w-auto"
              >
                <HugeiconsIcon
                  icon={Sent02Icon}
                  className="size-4 shrink-0"
                  stroke="1.5"
                />
                <span>
                  {isSubmitting ? "در حال ارسال..." : "ثبت درخواست فروشندگی"}
                </span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BuyerSellerUpgradePage;