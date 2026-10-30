"use client";

import Button from "@/components/atoms/button/Button";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { cn } from "@/lib/utils";
import { FilterRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getLocations } from "@/services/fastReserve/locations.service";
import { IFilterInputs } from "@/components/molecules/inputs/filterInput/IFilterInput";
import { useHouses } from "@/hooks/queries/fastReserve/useHouses";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallBack";

interface ILocations {
  id: string;
  areaName: string;
  lat: string;
  lng: string;
}

type FilterKeys =
  | "page"
  | "limit"
  | "transactionType"
  | "search"
  | "order"
  | "sort"
  | "propertyType"
  | "location"
  | "minPrice"
  | "maxPrice"
  | "minRent"
  | "maxRent"
  | "minMortgage"
  | "maxMortgage"
  | "minArea"
  | "maxArea";

const filterKeys = [
  "page",
  "limit",
  "transactionType",
  "search",
  "order",
  "sort",
  "propertyType",
  "location",
  "minPrice",
  "maxPrice",
  "minRent",
  "maxRent",
  "minMortgage",
  "maxMortgage",
  "minArea",
  "maxArea",
];

const propertyTypeOptions: IFilterInputs[] = [
  {
    label: "آپارتمان",
    value: "apartment",
  },
  { label: "ویلا", value: "villa" },
  { label: "خانه", value: "house" },
  { label: "زمین", value: "land" },
  { label: "تجاری", value: "commercial" },
];
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

const FiltersSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const { data: housesData } = useHouses();
  const totalCount = housesData?.pages[0]?.totalCount ?? 0;

  const { data, isLoading } = useQuery({
    queryKey: ["Locations"],
    queryFn: getLocations,
  });

  const locations = useMemo(
    () =>
      (data?.data ?? []).map((loc: ILocations) => ({
        ...loc,
        label: loc.areaName,
        value: loc.areaName,
      })),
    [data],
  );
  const [locationsValue, setLocationsValue] = useState<null | IFilterInputs>(
    () => {
      const location = searchParams.get("location");
      return location ? { label: location, value: location } : null;
    },
  );

  const [propertyTypesValue, setPropertyTypesValue] =
    useState<null | IFilterInputs>(() => {
      const propertyType = searchParams.get("propertyType");
      return propertyTypeOptions.find((o) => o.value === propertyType) ?? null;
    });

  const [sortValue, setSortValue] = useState<null | IFilterInputs>(() => {
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    if (sort === "price") {
      if (order === "ASC") {
        return {
          label: "ارزان ترین",
          value: "ascPrice",
        };
      } else {
        return {
          label: "گران ترین",
          value: "price",
        };
      }
    } else if (sort === "created_at") {
      return {
        label: "جدید ترین",
        value: "created_at",
      };
    } else if (sort === "last_updated") {
      return {
        label: "برروز ترین",
        value: "last_updated",
      };
    } else {
      return null;
    }
  });
  const [searchValue, setSearchValue] = useState(
    () => searchParams.get("search") ?? "",
  );
  const [minPriceValue, setMinPriceValue] = useState(
    () => searchParams.get("minPrice") ?? "",
  );
  const [maxPriceValue, setMaxPriceValue] = useState(
    () => searchParams.get("maxPrice") ?? "",
  );

  const setSearchParams = (key: FilterKeys, value: string | null) => {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    return router.push(`?${params.toString()}`);
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchParams("search", value === "" ? null : value);
  }, 1000);
  return (
    <div className="flex flex-wrap items-end gap-x-5 gap-y-6.25">
      <div className="flex flex-col gap-3">
        <p className={`leading-5.5 text-base text-default-black font-semibold`}>
          جستوجو
        </p>
        <input
          type={"text"}
          placeholder="جستوجو ..."
          className={cn(
            "w-94.5 text-neutral-800 placeholder:text-neutral-800 sm:text-base text-[14px] outline-none h-12 bg-neutral-200 px-5 rounded-[40px]",
          )}
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            debouncedSearch(event.target.value);
          }}
        />
      </div>
      <FilterInput
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
            "w-52 text-base font-normal text-default-black placeholder:text-neutral-800 outline-none h-12 bg-neutral-200 px-5 rounded-[40px]",
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
            "w-52 text-neutral-800 placeholder:text-neutral-800 sm:text-base text-[14px] outline-none h-12 bg-neutral-200 px-5 rounded-[40px]",
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
      <Button>{totalCount} آگهی پیدا شد</Button>
      <Button
        variant="danger"
        startIcon={
          <HugeiconsIcon
            icon={FilterRemoveIcon}
            className="size-4.5"
            stroke="1.5"
          />
        }
        onClick={() => {
          filterKeys.map((value) => {
            params.delete(value);
          });
          setMinPriceValue("");
          setSearchValue("");
          setMaxPriceValue("");
          setLocationsValue(null);
          setPropertyTypesValue(null);
          setSortValue(null);
          return router.push(`?${params.toString()}`);
        }}
      >
        حذف فیلتر
      </Button>
    </div>
  );
};

export default FiltersSection;
