"use client";

import Modal from "@/components/molecules/modal/Modal";
import {
  AlertCircleIcon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  EllipsisVerticalIcon,
  FilterIcon,
  Search02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { IFilterInputs } from "@/components/molecules/inputs/filterInput/IFilterInput";
import { Dialog } from "@base-ui/react";
import Button from "@/components/atoms/button/Button";
import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import DropDownMenu from "@/components/molecules/dropdown/DropDownMenu";
import Badge from "@/components/atoms/badge/Badge";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import SellerReservedDetailModal from "@/components/organisms/panel/seller/reserveManagement/SellerReservedDetailModal";
import {
  acceptReserve,
  getSellerReserveList,
  rejectReserve,
} from "@/services/panel/seller/reserveManagement.service";
import {
  IReservedSellerItem,
  IReservedSellerList,
  ReserveSellerParams,
} from "@/core/types/panel/seller/reserveManagement.types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getCookie } from "@/utils/getCookie";
import { formatPersianDate, formatPrice } from "@/utils/formatters";
import { toast } from "react-toastify";

const reserveStatusOptions: IFilterInputs[] = [
  { label: "تایید شده", value: "confirmed" },
  { label: "در انتظار", value: "pending" },
  { label: "تایید نشده", value: "canceled" },
];

const perPageOptions = [
  { value: "8", label: "8 در هر صفحه" },
  { value: "12", label: "12 در هر صفحه" },
  { value: "18", label: "18 در هر صفحه" },
];

const getStatusLabel = (status: string) =>
  status === "confirmed"
    ? "تایید شده"
    : status === "canceled"
      ? "تایید نشده"
      : "در انتظار";

const SellerReservePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [statusValue, setStatusValue] = useState<
    ReserveSellerParams["status"] | null
  >(null);

  const [params, setParams] = useState<ReserveSellerParams>({
    page: "1",
    limit: "8",
    sort: null,
    order: null,
    status: null,
    houseId: null,
  });

  useEffect(() => {
    setUserId(getCookie("userId"));
  }, []);

  const { data, isPending } = useQuery<IReservedSellerList>({
    queryKey: ["SellerReservedManagement", userId, params],
    queryFn: () => getSellerReserveList(userId, params),
    placeholderData: keepPreviousData,
    enabled: !!userId,
  });

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(
      1,
      Math.ceil((data.totalCount || 1) / Number(params.limit)),
    );
  }, [params.limit, data]);

  const { mutate: acceptReserveMutate } = useMutation({
    mutationKey: [`AcceptReserve`],
    mutationFn: (reserveId: string) => acceptReserve(reserveId),
    onMutate: () => {
      toast.loading("درحال تایید رزرو", {
        toastId: "AcceptReserveToast",
      });
    },
    onSuccess: () => {
      toast.update("AcceptReserveToast", {
        render: "رزرو مورد نظر با موفقیت تایید شد",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["SellerReservedManagement", params],
      });
    },
    onError: () => {
      toast.update("AcceptReserveToast", {
        render: "تایید رزرو مورد نظر با خطا روبرو شد",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  const { mutate: rejectReserveMutate } = useMutation({
    mutationKey: [`RejectReserve`],
    mutationFn: (reserveId: string) => rejectReserve(reserveId),
    onMutate: () => {
      toast.loading("درحال لغو رزرو", {
        toastId: "RejectReserveToast",
      });
    },
    onSuccess: () => {
      toast.update("RejectReserveToast", {
        render: "رزرو مورد نظر با موفقیت لغو شد",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["SellerReservedManagement", params],
      });
    },
    onError: () => {
      toast.update("RejectReserveToast", {
        render: "لغو رزرو مورد نظر با خطا روبرو شد",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  const openDetails = (id: number) => {
    router.push(`?reserveId=${id}`, { scroll: false });
  };

  const getDropDownOptions = (reserve: IReservedSellerItem) => [
    ...(reserve.status === "pending" || reserve.status === "canceled"
      ? [
          {
            label: "تایید رزرو",
            icon: CheckmarkCircle02Icon,
            onClick: () => {
              acceptReserveMutate(String(reserve.id));
            },
          },
        ]
      : []),

    ...(reserve.status === "pending"
      ? [
          {
            label: "لغو رزرو",
            icon: CancelCircleIcon,
            onClick: () => {
              rejectReserveMutate(String(reserve.id));
            },
          },
        ]
      : []),
    {
      label: "جزئیات",
      icon: AlertCircleIcon,
      onClick: () => openDetails(reserve.id),
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-lg font-bold text-default-text sm:text-[20px]">
          لیست رزرو های مشتریان
        </p>
        <div className="flex w-full items-center gap-3 lg:w-auto lg:gap-4">
          <Modal
            title="فیلتر ها"
            contentClassName="sm:max-w-2xl"
            trigger={
              <div className="flex shrink-0 cursor-pointer items-center gap-3 rounded-[16px] border border-neutral-300 bg-default-white-bg px-3 py-2.5">
                <HugeiconsIcon
                  icon={FilterIcon}
                  className="size-5 text-default-text"
                />
                <p className="text-base font-normal text-default-text">
                  فیلتر ها
                </p>
              </div>
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
                  onClick={() =>
                    setParams({ ...params, status: statusValue, page: "1" })
                  }
                  className="w-full rounded-[16px] text-white sm:w-4/10"
                >
                  اعمال فیلتر
                </Button>
              </div>
            }
          >
            <div className="flex w-full flex-col items-center gap-5 sm:gap-8">
              <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:gap-8">
                <FilterInput
                  items={reserveStatusOptions}
                  onValueChange={(value) =>
                    value
                      ? setStatusValue(
                          value.value as ReserveSellerParams["status"],
                        )
                      : setStatusValue(null)
                  }
                  className="w-full"
                  isTitle="وضعیت رزرو"
                  inputClassName="text-neutral-dark-300! dark:text-neutral-400! font-normal! text-base!"
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
        <div className="max-h-130 overflow-x-auto overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-225 text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-default-white-bg">
              <tr className="text-right">
                <th
                  className={
                    "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                  }
                >
                  نام اقامتگاه
                </th>
                <th
                  className={
                    "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                  }
                >
                  اطلاعات مسافر
                </th>
                <th
                  className={
                    "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                  }
                >
                  تاریخ رزرو
                </th>
                <th
                  className={
                    "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                  }
                >
                  قیمت
                </th>
                <th
                  className={
                    "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                  }
                >
                  وضعیت رزرو
                </th>
                <th
                  className={`py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base text-left`}
                >
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="border-t border-neutral-300">
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-8 shrink-0 rounded-full" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-7 w-20 rounded-[8px]" />
                    </td>
                    <td className="py-3 pl-3">
                      <Skeleton className="mr-auto size-6 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : data?.bookings.length === 0 ? (
                <tr className="border-t border-neutral-300">
                  <td
                    colSpan={6}
                    className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                  >
                    رزروی یافت نشد
                  </td>
                </tr>
              ) : (
                data?.bookings.map((reserve: IReservedSellerItem) => {
                  const traveler = reserve.traveler_details[0];
                  const extraTravelers = reserve.traveler_details.length - 1;
                  return (
                    <tr
                      key={reserve.id}
                      className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                    >
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-3">
                          <ImageFallback
                            src={"/images/hotel.jpg"}
                            alt={reserve.house.title}
                            className="size-8 shrink-0 rounded-full object-cover"
                            width={32}
                            height={32}
                          />
                          <span className="whitespace-nowrap text-sm font-normal text-default-text sm:text-base">
                            {reserve.house.title}
                          </span>
                        </div>
                      </td>
                      <td
                        className={
                          "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base"
                        }
                      >
                        {traveler
                          ? `${traveler.firstName} ${traveler.lastName}`
                          : "-"}
                        {extraTravelers > 0 && (
                          <span className="mr-1 text-xs">
                            (+{extraTravelers})
                          </span>
                        )}
                      </td>
                      <td
                        className={
                          "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base"
                        }
                      >
                        {formatPersianDate(reserve.createdAt)}
                      </td>
                      <td
                        className={
                          "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base"
                        }
                      >
                        {formatPrice(Number(reserve.house.price))}
                        <span className="mr-1">تومان</span>
                      </td>
                      <td className="py-3">
                        <Badge
                          text={getStatusLabel(reserve.status)}
                          type={
                            reserve.status === "confirmed"
                              ? "confirmed"
                              : reserve.status === "canceled"
                                ? "canceled"
                                : "pending"
                          }
                        />
                      </td>
                      <td className="py-3 pl-3">
                        <div className="flex justify-end">
                          <DropDownMenu
                            triggerRender={
                              <HugeiconsIcon
                                icon={EllipsisVerticalIcon}
                                className="size-5 cursor-pointer text-default-black sm:size-6"
                              />
                            }
                            dropDownItems={getDropDownOptions(reserve)}
                          />
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
          <div className="min-w-0 sm:mx-0">
            <Pagination
              currentPage={Number(params.page)}
              onPageChange={(event) =>
                setParams({ ...params, page: String(event) })
              }
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
              placeHolder={"تعداد نمایش"}
              onChange={(event) =>
                event
                  ? setParams({ ...params, limit: event, page: "1" })
                  : setParams({ ...params, limit: "8", page: "1" })
              }
              triggerClassName="bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto!"
            />
          </div>
        </div>
      </div>

      <Suspense>
        <SellerReservedDetailModal />
      </Suspense>
    </div>
  );
};

export default SellerReservePage;
