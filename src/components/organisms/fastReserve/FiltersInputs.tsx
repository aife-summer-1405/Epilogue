import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { IFilterInputs } from "@/components/molecules/inputs/filterInput/IFilterInput";
import { FilterKeys } from "@/core/types/houses/housesFilter.types";
import { cn } from "@/lib/utils";
import { Dispatch, FC, SetStateAction } from "react";

interface IProps {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  debouncedSearch: (value: string) => void;
  locationsValue: IFilterInputs | null;
  isLoading: boolean;
  locations: IFilterInputs[];
  setLocationsValue: Dispatch<SetStateAction<IFilterInputs | null>>;
  setSearchParams: (key: FilterKeys, value: string | null) => void;
  propertyTypesValue: IFilterInputs | null;
  propertyTypeOptions: IFilterInputs[];
  setPropertyTypesValue: Dispatch<SetStateAction<IFilterInputs | null>>;
  sortValue: IFilterInputs | null;
  setSortValue: Dispatch<SetStateAction<IFilterInputs | null>>;
  minPriceValue: string;
  setMinPriceValue: Dispatch<SetStateAction<string>>;
  maxPriceValue: string;
  setMaxPriceValue: Dispatch<SetStateAction<string>>;
}

const sortOptions: IFilterInputs[] = [
  {
    label: "برروز ترین",
    value: "last_updated",
  },
  {
    label: "گران ترین",
    value: "price",
  },
  {
    label: "ارزان ترین",
    value: "ascPrice",
  },
  {
    label: "جدید ترین",
    value: "created_at",
  },
];

const FiltersInputs: FC<IProps> = ({
  searchValue,
  setSearchValue,
  debouncedSearch,
  locationsValue,
  isLoading,
  locations,
  setLocationsValue,
  setSearchParams,
  propertyTypesValue,
  propertyTypeOptions,
  setPropertyTypesValue,
  sortValue,
  setSortValue,
  minPriceValue,
  setMinPriceValue,
  maxPriceValue,
  setMaxPriceValue,
}) => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <p className={`leading-5.5 text-base text-default-black font-semibold`}>
          جستوجو
        </p>
        <input
          type={"text"}
          placeholder="جستوجو ..."
          className={cn(
            "lg:w-94.5 w-full text-neutral-800 placeholder:text-neutral-800 sm:text-base text-[14px] outline-none h-12 bg-neutral-200 px-5 rounded-[40px]",
          )}
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            debouncedSearch(event.target.value);
          }}
        />
      </div>
      <FilterInput
        className="lg:w-52 w-full"
        size="mini"
        isTitle="مقصد یا  هتل شما"
        value={locationsValue}
        items={!isLoading && locations}
        onValueChange={(event) => {
          setLocationsValue(event);
          if (event === null) {
            return setSearchParams("location", event);
          }
          setSearchParams("location", event.value);
        }}
      />
      <FilterInput
        className="lg:w-52 w-full"
        size="mini"
        isTitle="نوع ملک"
        value={propertyTypesValue}
        items={propertyTypeOptions}
        onValueChange={(event) => {
          setPropertyTypesValue(event);
          if (event === null) {
            return setSearchParams("propertyType", event);
          }
          setSearchParams("propertyType", event.value);
        }}
      />
      <FilterInput
        className="lg:w-52 w-full"
        size="mini"
        isTitle="مرتب سازی بر اساس"
        value={sortValue}
        onValueChange={(event) => {
          setSortValue(event);
          if (event === null) {
            return setSearchParams("sort", event);
          } else if (event.value === "ascPrice") {
            setSearchParams("sort", "price");
            return setSearchParams("order", "ASC");
          }
          setSearchParams("sort", event.value);
          setSearchParams("order", "DESC");
        }}
        items={sortOptions}
      />
      <div className="flex flex-col gap-3">
        <p className={`leading-5.5 text-base text-default-black font-semibold`}>
          حداقل قیمت
        </p>
        <input
          type={"text"}
          placeholder="حداقل قیمت ..."
          className={cn(
            "lg:w-52 w-full text-base font-normal text-default-black placeholder:text-neutral-800 outline-none h-12 bg-neutral-200 px-5 rounded-[40px]",
          )}
          onBeforeInput={(e) => {
            const data = (e as unknown as InputEvent).data;
            if (data && !/^[0-9]+$/.test(data)) {
              e.preventDefault();
            }
          }}
          value={minPriceValue}
          onChange={(event) => {
            setMinPriceValue(event.target.value);
            if (event.target.value === "") {
              return setSearchParams("minPrice", null);
            }
            setSearchParams("minPrice", event.target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className={`leading-5.5 text-base text-default-black font-semibold`}>
          حداکثر قیمت
        </p>
        <input
          type={"text"}
          placeholder="حداکثر قیمت ..."
          className={cn(
            "lg:w-52 w-full text-neutral-800 placeholder:text-neutral-800 sm:text-base text-[14px] outline-none h-12 bg-neutral-200 px-5 rounded-[40px]",
          )}
          onBeforeInput={(e) => {
            const data = (e as unknown as InputEvent).data;
            if (data && !/^[0-9]+$/.test(data)) {
              e.preventDefault();
            }
          }}
          value={maxPriceValue}
          onChange={(event) => {
            setMaxPriceValue(event.target.value);
            if (event.target.value === "") {
              return setSearchParams("maxPrice", null);
            }
            setSearchParams("maxPrice", event.target.value);
          }}
        />
      </div>
    </>
  );
};

export default FiltersInputs;
