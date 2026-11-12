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
import { DateObject } from "react-multi-date-picker";
import { Suspense, useEffect, useState } from "react";
import { getToday, getTomorrow } from "@/utils/getToday";
import { getUtcTimestamp } from "@/utils/date";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { IFilterInputs } from "@/components/molecules/inputs/filterInput/IFilterInput";
import { Dialog } from "@base-ui/react";
import Button from "@/components/atoms/button/Button";
import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import DropDownMenu from "@/components/molecules/dropdown/DropDownMenu";
import Badge from "@/components/atoms/badge/Badge";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import ThemedDatePicker from "@/components/molecules/themedDatePicker/ThemedDatePicker";
import ReservedDetailModal from "@/components/organisms/panel/buyer/reserveManagement/ReservedDetailModal";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import useFakeLoading from "@/hooks/useFakeLoading";

const toMidnight = (date: DateObject) =>
  new DateObject(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

const propertyTypeOptions: IFilterInputs[] = [
  { label: "آپارتمان", value: "apartment" },
  { label: "ویلا", value: "villa" },
  { label: "خانه", value: "house" },
  { label: "زمین", value: "land" },
  { label: "تجاری", value: "commercial" },
];

const reserveTypeOptions: IFilterInputs[] = [
  { label: "تایید شده", value: "confirmed" },
  { label: "در انتظار", value: "pending" },
];

const perPageOptions = [
  { value: "12", label: "12 در هر صفحه" },
  { value: "8", label: "8 در هر صفحه" },
  { value: "18", label: "18 در هر صفحه" },
];

const thClass =
  "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base";
const tdClass =
  "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base";

const BuyerReservePage = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<DateObject | null>(null);
  const [endDate, setEndDate] = useState<DateObject | null>(null);
  const [whichPage, setWhichPage] = useState<number>(1);
  const isTableLoading = useFakeLoading(whichPage);

  const openDetails = (id: number) => {
    router.push(`?homeId=${id}`, { scroll: false });
  };

  const dropDownOptions = [
    { label: "پرداخت کردن", icon: CreditCardIcon },
    { label: "جزئیات", icon: AlertCircleIcon, onClick: () => openDetails(1) },
    { label: "حذف", icon: TrashIcon },
  ];

  useEffect(() => {
    setStartDate(getToday());
    setEndDate(getTomorrow());
  }, []);

  const handleStartDateChange = (date: DateObject | null) => {
    if (!date || Array.isArray(date)) return;

    const selected = toMidnight(date);
    setStartDate(selected);

    if (!endDate || getUtcTimestamp(endDate) <= getUtcTimestamp(selected)) {
      setEndDate(new DateObject(selected).add(1, "day"));
    }
  };

  const handleEndDateChange = (date: DateObject | null) => {
    if (!date || Array.isArray(date)) return;

    const selected = toMidnight(date);
    if (startDate && getUtcTimestamp(selected) <= getUtcTimestamp(startDate)) {
      return;
    }

    setEndDate(selected);
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
              <div className="flex w-full flex-col-reverse items-center justify-center gap-3 sm:flex-row sm:gap-8">
                <Dialog.Close
                  data-slot="dialog-close"
                  render={
                    <Button
                      className="w-full cursor-pointer rounded-[16px] border-neutral-dark-300 py-3 text-center text-base font-normal text-neutral-dark-300 sm:w-60 dark:border-neutral-400 dark:text-neutral-400"
                      variant="outline"
                    />
                  }
                >
                  انصراف
                </Dialog.Close>
                <Button className="w-full rounded-[16px] text-white sm:w-60">
                  اعمال فیلتر
                </Button>
              </div>
            }
          >
            <div className="flex w-full flex-col items-center gap-5 sm:gap-8">
              <div className="flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:gap-8">
                <ThemedDatePicker
                  label="تاریخ رفت"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
                <ThemedDatePicker
                  label="تاریخ برگشت"
                  value={endDate}
                  onChange={handleEndDateChange}
                  minDate={
                    startDate
                      ? new DateObject(startDate).add(1, "day")
                      : undefined
                  }
                />
              </div>
              <div className="flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:gap-8">
                <FilterInput
                  items={propertyTypeOptions}
                  className="w-full sm:w-60"
                  isTitle="نوع ملک"
                  inputClassName="text-neutral-dark-300! dark:text-neutral-400! font-normal! text-base!"
                />
                <FilterInput
                  items={reserveTypeOptions}
                  className="w-full sm:w-60"
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
                <th className={thClass}>نام اقامتگاه</th>
                <th className={thClass}>تاریخ رزرو</th>
                <th className={thClass}>قیمت</th>
                <th className={thClass}>اطلاعات مسافر</th>
                <th className={thClass}>وضعیت رزرو</th>
                <th className={thClass}>وضعیت پرداخت</th>
                <th className={`${thClass} text-left`}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isTableLoading ? (
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
              ) : (
                <tr className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200">
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-3">
                      <ImageFallback
                        src={"/images/hotel.jpg"}
                        alt={"هتل سراوان رانین رشت"}
                        className="size-8 shrink-0 rounded-full object-cover"
                        width={32}
                        height={32}
                      />
                      <span className="whitespace-nowrap text-sm font-normal text-default-text sm:text-base">
                        هتل سراوان رانین رشت
                      </span>
                    </div>
                  </td>
                  <td className={tdClass}>12 مرداد 1401 - 12:33</td>
                  <td className={tdClass}>
                    2000000 <span className="mr-1">تومان</span>
                  </td>
                  <td className={tdClass}>2 نفر مسافر</td>
                  <td className="py-3">
                    <Badge text={"تایید شده"} type={"success"} />
                  </td>
                  <td className="py-3">
                    <Badge text={"پرداخت شده"} type={"success"} />
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
                        dropDownItems={dropDownOptions}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 sm:mx-0">
            <Pagination
              currentPage={whichPage}
              onPageChange={(event) => setWhichPage(event)}
              totalPages={20}
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
              onChange={(event) => console.log(event)}
              triggerClassName="bg-transparent rounded-[16px] border border-neutral-300 px-3 py-2 text-base font-normal text-default-text placeholder:text-default-text h-auto!"
            />
          </div>
        </div>
      </div>
      <Suspense>
        <ReservedDetailModal />
      </Suspense>
    </div>
  );
};

export default BuyerReservePage;
