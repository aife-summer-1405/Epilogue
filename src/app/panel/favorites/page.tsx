"use client";

import Modal from "@/components/molecules/modal/Modal";
import {
  CheckmarkCircle02Icon,
  EllipsisVerticalIcon,
  FilterIcon,
  Search02Icon,
  TrashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { IFilterInputs } from "@/components/molecules/inputs/filterInput/IFilterInput";
import RangeInput from "@/components/molecules/inputs/RangeInput";
import { Dialog } from "@base-ui/react";
import Button from "@/components/atoms/button/Button";
import { Pagination } from "@/components/molecules";
import SelectComponent from "@/components/molecules/select/Select";
import DropDownMenu from "@/components/molecules/dropdown/DropDownMenu";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import { Skeleton } from "@/components/ui/skeleton";
import useFakeLoading from "@/hooks/useFakeLoading";

interface IFavorite {
  id: number;
  name: string;
  image: string;
  price: string;
  address: string;
}

const initialFavorites: IFavorite[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: "هتل سراوان رانین رشت",
  image: "/images/hotel.jpg",
  price: "2,000,000",
  address: "گیلان - رشت - میدان آزادی - جنب چهار راه علم الهدی - پلاک 12",
}));

const propertyTypeOptions: IFilterInputs[] = [
  { label: "آپارتمان", value: "apartment" },
  { label: "ویلا", value: "villa" },
  { label: "خانه", value: "house" },
  { label: "هتل", value: "hotel" },
  { label: "تجاری", value: "commercial" },
];

const destinationOptions: IFilterInputs[] = [
  { label: "گیلان - رشت", value: "gilan-rasht" },
  { label: "تهران", value: "tehran" },
  { label: "مازندران - ساری", value: "mazandaran-sari" },
  { label: "اصفهان", value: "isfahan" },
];

const perPageOptions = [
  { value: "12", label: "12 در هر صفحه" },
  { value: "8", label: "8 در هر صفحه" },
  { value: "18", label: "18 در هر صفحه" },
];

const PRICE_MIN = 1000000;
const PRICE_MAX = 20000000;
const PRICE_STEP = 500000;

const thClass =
  "py-3 font-bold text-sm text-default-text whitespace-nowrap sm:text-base";
const tdClass =
  "py-3 text-sm font-normal text-default-text whitespace-nowrap sm:text-base";

const BuyerFavoritesPage = () => {
  const [whichPage, setWhichPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [favorites, setFavorites] = useState<IFavorite[]>(initialFavorites);
  const [priceRange, setPriceRange] = useState<number[]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);
  const isTableLoading = useFakeLoading(whichPage);

  const filteredFavorites = useMemo(() => {
    const q = search.trim();
    if (!q) return favorites;
    return favorites.filter((f) => f.name.includes(q) || f.address.includes(q));
  }, [favorites, search]);

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const getDropDownOptions = (favorite: IFavorite) => [
    { label: "رزرو", icon: CheckmarkCircle02Icon },
    {
      label: "حذف",
      icon: TrashIcon,
      onClick: () => removeFavorite(favorite.id),
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-lg font-bold text-default-text sm:text-[20px]">
          لیست علاقه مندی ها
        </p>
        <div className="flex w-full items-center gap-3 lg:w-auto lg:gap-4">
          <div className="flex w-full min-w-0 flex-1 items-center justify-between gap-2 rounded-[16px] border border-neutral-300 bg-default-white-bg px-4 py-2.5 lg:w-60 xl:w-100 lg:flex-none">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                <FilterInput
                  items={propertyTypeOptions}
                  className="w-full sm:w-60"
                  isTitle="نوع ملک"
                  inputClassName="text-neutral-dark-300! dark:text-neutral-400! font-normal! text-base!"
                />
                <FilterInput
                  items={destinationOptions}
                  className="w-full sm:w-60"
                  isTitle="مقصد یا هتل شما"
                  inputClassName="text-neutral-dark-300! dark:text-neutral-400! font-normal! text-base!"
                />
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-136 sm:max-w-full">
                <p className="text-base font-semibold text-default-text">
                  بازه قیمت
                </p>
                <RangeInput
                  value={priceRange}
                  setValue={setPriceRange}
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 rounded-[24px] bg-default-white-bg p-4 sm:p-6">
        <div className="max-h-130 overflow-x-auto overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-200 text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-default-white-bg">
              <tr className="text-right">
                <th className={thClass}>نام اقامتگاه</th>
                <th className={thClass}>قیمت کل</th>
                <th className={thClass}>آدرس</th>
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
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="py-3">
                      <Skeleton className="h-4 w-64 max-w-full" />
                    </td>
                    <td className="py-3 pl-3">
                      <Skeleton className="mr-auto size-6 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : filteredFavorites.length === 0 ? (
                <tr className="border-t border-neutral-300">
                  <td
                    colSpan={4}
                    className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400"
                  >
                    موردی یافت نشد
                  </td>
                </tr>
              ) : (
                filteredFavorites.map((favorite) => (
                  <tr
                    key={favorite.id}
                    className="border-t border-neutral-300 transition-colors duration-300 ease-in-out hover:bg-primary-50 dark:hover:bg-neutral-200"
                  >
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-3">
                        <ImageFallback
                          src={favorite.image}
                          alt={favorite.name}
                          className="size-8 shrink-0 rounded-full object-cover"
                          width={32}
                          height={32}
                        />
                        <span className="whitespace-nowrap text-sm font-normal text-default-text sm:text-base">
                          {favorite.name}
                        </span>
                      </div>
                    </td>
                    <td className={tdClass}>
                      {favorite.price} <span className="mr-1">تومان</span>
                    </td>
                    <td className="max-w-40 py-3 pl-4 sm:max-w-72 lg:max-w-96">
                      <span
                        title={favorite.address}
                        className="block truncate text-sm font-normal text-default-text sm:text-base"
                      >
                        {favorite.address}
                      </span>
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
                          dropDownItems={getDropDownOptions(favorite)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
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
    </div>
  );
};

export default BuyerFavoritesPage;
