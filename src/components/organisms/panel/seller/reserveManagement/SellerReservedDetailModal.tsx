"use client";

import Badge from "@/components/atoms/badge/Badge";
import Button from "@/components/atoms/button/Button";
import Modal from "@/components/molecules/modal/Modal";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import { Skeleton } from "@/components/ui/skeleton";
import useModalParams from "@/hooks/useModalParams";
import {
  AlertCircleIcon,
  BedDoubleIcon,
  Bathtub01Icon,
  BitcoinBagIcon,
  Calendar03Icon,
  CarParking01Icon,
  Edit02Icon,
  Home01Icon,
  Location01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  Sun03Icon,
  UserGroup03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  getBuyerReservedId,
  getHouseDetailById,
} from "@/services/panel/buyer/reserveManagement.service";
import {
  countNights,
  formatPersianDate,
  formatPrice,
} from "@/utils/formatters";
import SellerPassengersModal from "./SellerPassengersModal";
import SellerPaymentsModal from "./SellerPaymentsModal";
import SellerEditsHistoryModal from "./SellerEditsHistoryModal";

const houseTypeLabels: Record<string, string> = {
  house: "مسکونی",
  villa: "ویلا",
  commercial: "تجاری",
  land: "زمین",
};

const transactionLabels: Record<string, string> = {
  rental: "اجاره",
  mortgage: "رهن",
  reservation: "رزرو",
  sale: "خرید",
};

const statusLabel = (status: string) =>
  status === "confirmed"
    ? "تایید شده"
    : status === "pending"
      ? "در انتظار"
      : "تایید نشده";

const SellerReservedDetailModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { open } = useModalParams();

  const reserveId = searchParams.get("reserveId");

  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ["SellerReserveDetail", reserveId],
    queryFn: () => getBuyerReservedId(reserveId as string),
    enabled: !!reserveId,
  });

  const booking = data?.booking ?? null;

  const {
    data: house,
    isPending: housePending,
    isError: houseError,
    refetch: refetchHouse,
  } = useQuery({
    queryKey: ["SellerHouseDetail", booking?.houseId],
    queryFn: () => getHouseDetailById(booking.houseId),
    enabled: !!reserveId && !!booking?.houseId,
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("reserveId");
    params.delete("modal");
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const showSkeleton = !!reserveId && (isPending || (isFetching && !data));
  const showError = !showSkeleton && !!reserveId && (isError || !booking);
  const showContent = !showSkeleton && !showError && !!booking;

  const nights = countNights(booking?.reservedDates);
  const houseType = houseTypeLabels[house?.categories?.name] ?? "خانه";
  const transactionType = transactionLabels[house?.transaction_type] ?? "خرید";

  const specs = house
    ? [
        { icon: BedDoubleIcon, label: `${house.rooms} خوابه` },
        { icon: Bathtub01Icon, label: `${house.bathrooms} حمام` },
        { icon: CarParking01Icon, label: `${house.parking} پارکینگ` },
        { icon: UserGroup03Icon, label: `${house.capacity} نفر ظرفیت` },
        {
          icon: Sun03Icon,
          label: house.yard_type === "private" ? "حیاط شخصی" : house.yard_type,
        },
        { icon: Home01Icon, label: houseType },
        { icon: null, label: transactionType },
      ]
    : [];

  return (
    <>
      <Modal
        title="جزئیات اقامتگاه"
        contentClassName="sm:max-w-273"
        open={!!reserveId}
        onOpenChange={handleOpenChange}
      >
        {showSkeleton && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <Skeleton className="h-52 w-full shrink-0 rounded-[16px] sm:h-72 md:w-1/2" />
                <div className="flex w-full flex-col gap-3 md:w-1/2">
                  <Skeleton className="h-7 w-2/3" />
                  <Skeleton className="h-5 w-1/2" />
                  <div className="flex flex-1 flex-col gap-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-7 w-32" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-[8px]" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-[16px]" />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-12 w-28 rounded-[16px]" />
              <Skeleton className="h-12 w-28 rounded-[16px]" />
              <Skeleton className="h-12 w-36 rounded-[16px]" />
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
        {showContent && booking && (
          <div className="flex max-h-[65vh] flex-col gap-6 overflow-y-auto pb-2 pl-1 scrollbar-hide">
            {housePending ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row">
                  <Skeleton className="h-52 w-full shrink-0 rounded-[16px] sm:h-72 md:w-1/2" />
                  <div className="flex w-full flex-col gap-3 md:w-1/2">
                    <Skeleton className="h-7 w-2/3" />
                    <Skeleton className="h-5 w-1/2" />
                    <div className="flex flex-1 flex-col gap-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <Skeleton className="h-7 w-32" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-[8px]" />
                  ))}
                </div>
              </div>
            ) : houseError || !house ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-[16px] border border-neutral-300 px-4 py-8 text-center">
                <p className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
                  اطلاعات اقامتگاه دریافت نشد
                </p>
                <Button
                  onClick={() => refetchHouse()}
                  variant="outline"
                  className="cursor-pointer rounded-[12px] px-4 py-2 text-sm font-normal text-default-text"
                >
                  تلاش مجدد
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-[16px] sm:h-72 md:w-1/2">
                    <ImageFallback
                      src={house.image}
                      alt={house.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex w-full min-w-0 flex-col gap-3 md:w-1/2">
                    <p className="text-lg font-bold text-default-text sm:text-xl">
                      {house.title}
                    </p>
                    <div className="flex items-center gap-1 text-neutral-dark-200">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        className="size-5 shrink-0"
                      />
                      <span className="text-sm">{house.address}</span>
                    </div>
                    <p className="flex-1 text-sm leading-7 text-default-text">
                      {house.description ||
                        "توضیحاتی برای این اقامتگاه ثبت نشده است"}
                    </p>
                    <p className="text-default-text">
                      <span className="text-xl font-bold">
                        {formatPrice(Number(house.price))}
                      </span>{" "}
                      <span className="text-sm">تومان</span>
                    </p>
                  </div>
                </div>
                {house.tags?.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold text-default-text">
                      برچسب ها :
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {house.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className={
                            "bg-orange-500 text-white rounded-[8px] px-3 py-1.5 text-sm font-normal"
                          }
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold text-default-text">
                    سایر مشخصات :
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {specs.map((spec) => (
                      <span
                        key={spec.label}
                        className={
                          "bg-orange-500 text-white rounded-[8px] px-3 py-1.5 text-sm font-normal flex items-center gap-1.5"
                        }
                      >
                        {spec.icon && (
                          <HugeiconsIcon icon={spec.icon} className="size-4" />
                        )}
                        {spec.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="h-px w-full bg-neutral-300" />
            <div className="flex flex-col gap-3">
              <p className="text-lg font-bold text-default-text sm:text-xl">
                رزرو شماره {Number(booking.id).toLocaleString("fa-IR")}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-normal text-default-text">
                    وضعیت رزرو:
                  </span>
                  <Badge
                    text={statusLabel(booking.status)}
                    type={booking.status}
                  />
                </div>
                {data?.paymentStatus && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-normal text-default-text">
                      وضعیت پرداخت:
                    </span>
                    <Badge
                      text={
                        data.paymentStatus === "pending"
                          ? "پرداخت نشده"
                          : "پرداخت شده"
                      }
                      type={
                        data.paymentStatus === "pending"
                          ? "pending"
                          : "confirmed"
                      }
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div
                className={
                  "flex min-w-0 items-start gap-3 rounded-[16px] border border-neutral-300 p-3"
                }
              >
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  className={
                    "mt-0.5 size-5 shrink-0 text-neutral-dark-300 dark:text-neutral-400"
                  }
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <span
                    className={
                      "text-xs font-normal text-neutral-dark-300 dark:text-neutral-400"
                    }
                  >
                    تاریخ رفت
                  </span>
                  <span className="text-sm font-bold text-default-text">
                    {formatPersianDate(booking.reservedDates?.[0])}
                  </span>
                </div>
              </div>
              <div
                className={
                  "flex min-w-0 items-start gap-3 rounded-[16px] border border-neutral-300 p-3"
                }
              >
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  className={
                    "mt-0.5 size-5 shrink-0 text-neutral-dark-300 dark:text-neutral-400"
                  }
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <span
                    className={
                      "text-xs font-normal text-neutral-dark-300 dark:text-neutral-400"
                    }
                  >
                    تاریخ برگشت
                  </span>
                  <span className="text-sm font-bold text-default-text">
                    {formatPersianDate(booking.reservedDates?.[1])}
                    {nights ? ` (${nights.toLocaleString("fa-IR")} شب)` : ""}
                  </span>
                </div>
              </div>
              <div
                className={
                  "flex min-w-0 items-start gap-3 rounded-[16px] border border-neutral-300 p-3"
                }
              >
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className={
                    "mt-0.5 size-5 shrink-0 text-neutral-dark-300 dark:text-neutral-400"
                  }
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <span
                    className={
                      "text-xs font-normal text-neutral-dark-300 dark:text-neutral-400"
                    }
                  >
                    ایمیل
                  </span>
                  <span
                    dir="ltr"
                    className="block break-all text-right text-sm font-bold text-default-text"
                  >
                    {booking.sharedEmail || "-"}
                  </span>
                </div>
              </div>
              <div
                className={
                  "flex min-w-0 items-start gap-3 rounded-[16px] border border-neutral-300 p-3"
                }
              >
                <HugeiconsIcon
                  icon={SmartPhone01Icon}
                  className={
                    "mt-0.5 size-5 shrink-0 text-neutral-dark-300 dark:text-neutral-400"
                  }
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <span
                    className={
                      "text-xs font-normal text-neutral-dark-300 dark:text-neutral-400"
                    }
                  >
                    شماره موبایل
                  </span>
                  <span
                    dir="ltr"
                    className="block break-all text-right text-sm font-bold text-default-text"
                  >
                    {booking.sharedMobile || "-"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-default-text">
                انجام عملیات :
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => open("passengers")}
                  className={"bg-primary-500! text-white rounded-[16px] p-3"}
                  startIcon={
                    <HugeiconsIcon
                      icon={UserGroup03Icon}
                      className="size-5 text-white"
                    />
                  }
                >
                  مسافر ها
                </Button>
                <Button
                  onClick={() => open("payments")}
                  className={"bg-primary-500! text-white rounded-[16px] p-3"}
                  startIcon={
                    <HugeiconsIcon
                      icon={BitcoinBagIcon}
                      className="size-5 text-white"
                    />
                  }
                >
                  پرداختی ها
                </Button>
                <Button
                  onClick={() => open("edits")}
                  className={"bg-primary-500! text-white rounded-[16px] p-3"}
                  startIcon={
                    <HugeiconsIcon
                      icon={Edit02Icon}
                      className="size-5 text-white"
                    />
                  }
                >
                  تاریخچه تغییرات
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <SellerPassengersModal />
      <SellerPaymentsModal />
      <SellerEditsHistoryModal />
    </>
  );
};

export default SellerReservedDetailModal;
