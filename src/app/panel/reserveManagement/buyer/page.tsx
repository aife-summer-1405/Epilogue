"use client";

import Modal from "@/components/molecules/modal/Modal";
import {
  AlertCircleIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
  FilterIcon,
  Search02Icon,
  TrashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Suspense, useMemo, useState } from "react";
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
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  IReserved,
  IReservedList,
  ReservedParams,
  ReservedStatus,
} from "@/core/types/panel/buyer/reserveManagement.types";
import {
  getBuyerReserved,
  payReserveRequestById,
  removeBuyerReserveById,
} from "@/services/panel/buyer/reserveManagement.service";
import EditReserveModal from "@/components/organisms/panel/buyer/reserveManagement/EditReserveModal";
import ReserveDetailModal from "@/components/organisms/panel/buyer/reserveManagement/ReserveDetailModal";
import { toast } from "react-toastify";
import { formatPersianDate, formatPrice } from "@/utils/formatters";
import { PayRequestBody } from "@/core/types/panel/buyer/paymentManagement.types";

const reserveTypeOptions: IFilterInputs[] = [
  { label: "تایید شده", value: "confirmed" },
  { label: "در انتظار", value: "pending" },
  { label: "تایید نشده", value: "canceled" },
];

const perPageOptions = [
  { value: "12", label: "12 در هر صفحه" },
  { value: "8", label: "8 در هر صفحه" },
  { value: "18", label: "18 در هر صفحه" },
];

const BuyerReservePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [statusValue, setStatusValue] = useState<ReservedStatus | null>(null);
  const [params, setParams] = useState<ReservedParams>({
    page: "1",
    limit: "8",
    sort: null,
    order: null,
    status: null,
  });

  const { data, isPending } = useQuery<IReservedList>({
    queryKey: ["BuyerReservedManagement", params],
    queryFn: () => getBuyerReserved(params),
    placeholderData: keepPreviousData,
  });

  const { mutate: deleteReserveMutate } = useMutation({
    mutationKey: [`DeleteReserve`],
    mutationFn: (id: string) => removeBuyerReserveById(id),
    onMutate: () => {
      toast.loading("درحال حذف رزرو", { toastId: "DeletingReserveToast" });
    },
    onSuccess: () => {
      toast.update("DeletingReserveToast", {
        render: "رزرو شما با موفقیت حذف شد",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["BuyerReservedManagement", params],
      });
    },
    onError: () => {
      toast.update("DeletingReserveToast", {
        render: "رزرو مورد نظر پیدا نشد",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(
      1,
      Math.ceil((data.totalCount || 1) / Number(params.limit)),
    );
  }, [params.limit, data]);

  const openDetails = (id: number) => {
    router.push(`?detailId=${id}`, { scroll: false });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-lg font-bold text-default-text sm:text-[20px]">
          لیست رزرو های شما
        </p>
        <div className="flex w-full items-center gap-3 lg:w-auto lg:gap-4">
          <div className="flex w-full min-w-0 flex-1 items-center justify-between gap-2 rounded-[16px] border border-neutral-300 bg-default-white-bg px-4 py-2.5 lg:w-60 xl:w-100 lg:flex-none">
            <input
              type="text"
              className="min-w-0 flex-1 bg-transparent text-base font-normal text-neutral-dark-300 outline-none placeholder:text-neutral-dark-300 dark:text-neutral-400 dark:placeholder:text-neutral-400"
              placeholder="جستجو ..."
            />
            <HugeiconsIcon
              icon={Search02Icon}
              className="size-5 shrink-0 text-neutral-dark-300 dark:text-neutral-400"
              stroke="1.5"
            />
          </div>
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
                  onClick={() => setParams({ ...params, status: statusValue })}
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
                  items={reserveTypeOptions}
                  onValueChange={(value) =>
                    value ? setStatusValue(value.value) : setStatusValue(null)
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
                  اطلاعات مسافر
                </th>
                <th
                  className={
                    "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"
                  }
                >
                  وضعیت رزرو
                </th>
                <th
                  className={`${"py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base"} text-left`}
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
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-7 w-20 rounded-[8px]" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-7 w-20 rounded-[8px]" />
                    </td>
                    <td className="py-3 pl-3">
                      <Skeleton className="mr-auto size-6 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : data?.data.length === 0 ? (
                <tr className="border-t border-neutral-300">
                  <td
                    colSpan={7}
                    className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                  >
                    رزروی یافت نشد
                  </td>
                </tr>
              ) : (
                data?.data.map((value: IReserved, index: number) => {
                  const reserveStatusLabel =
                    value.status === "canceled"
                      ? "تایید نشده"
                      : value.status === "confirmed"
                        ? "تایید شده"
                        : "در انتظار";
                  const travellersCount = value.traveler_details.length;
                  return (
                    <tr
                      key={index}
                      className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                    >
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-3">
                          <ImageFallback
                            src={"/images/hotel.jpg"}
                            alt={value.house.title}
                            className="size-8 shrink-0 rounded-full object-cover"
                            width={32}
                            height={32}
                          />
                          <span className="whitespace-nowrap text-sm font-normal text-default-text sm:text-base">
                            {value.house.title}
                          </span>
                        </div>
                      </td>
                      <td
                        className={
                          "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base"
                        }
                      >
                        {formatPersianDate(value.createdAt)}
                      </td>
                      <td
                        className={
                          "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base"
                        }
                      >
                        {formatPrice(Number(value.house.price))}
                        <span className="mr-1">تومان</span>
                      </td>
                      <td
                        className={
                          "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base"
                        }
                      >
                        {travellersCount} نفر مسافر
                      </td>
                      <td className="py-3">
                        <Badge text={reserveStatusLabel} type={value.status} />
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
                            dropDownItems={[
                              ...(value.status === "confirmed"
                                ? [
                                    {
                                      label: "پرداخت کردن",
                                      icon: CreditCardIcon,
                                      onClick: () =>
                                        router.push(`/pay/${value.id}`),
                                    },
                                  ]
                                : []),
                              {
                                label: "جزئیات",
                                icon: AlertCircleIcon,
                                onClick: () => openDetails(Number(value.id)),
                              },
                              {
                                label: "حذف",
                                icon: TrashIcon,
                                onClick: () =>
                                  deleteReserveMutate(String(value.id)),
                              },
                            ]}
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
                  ? setParams({ ...params, limit: event })
                  : setParams({ ...params, limit: "8" })
              }
              triggerClassName="bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto!"
            />
          </div>
        </div>
      </div>
      <Suspense>
        <ReserveDetailModal />
        <EditReserveModal />
      </Suspense>
    </div>
  );
};

export default BuyerReservePage;
