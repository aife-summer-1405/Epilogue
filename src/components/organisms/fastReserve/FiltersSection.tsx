"use client";

import Button from "@/components/atoms/button/Button";
import { FilterIcon, FilterRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getLocations } from "@/services/fastReserve/locations.service";
import { IFilterInputs } from "@/components/molecules/inputs/filterInput/IFilterInput";
import { useHouses } from "@/hooks/queries/fastReserve/useHouses";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallBack";
import FiltersInputs from "./FiltersInputs";
import { FilterKeys } from "@/core/types/houses/housesFilter.types";
import DrawerComponent from "@/components/molecules/drawer/Drawer";

interface ILocations {
  id: string;
  areaName: string;
  lat: string;
  lng: string;
}

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
    <div className="flex flex-wrap self-start lg:items-end items-center gap-x-5 gap-y-6.25 lg:bg-transparent! lg:p-0 lg:rounded-none bg-[#EDEDED] dark:bg-default-dark-content p-2 sm:rounded-full rounded-[24px]">
      <DrawerComponent
        triggerClassName={"lg:hidden"}
        trigger={
          <Button
            state="default"
            size="sm"
            variant="outline"
            startIcon={
              <HugeiconsIcon
                icon={FilterIcon}
                className="size-6 text-primary-500"
              />
            }
          >
            فیلتر
          </Button>
        }
      >
        <div className="flex flex-col gap-2 lg:hidden px-4 py-10">
          <FiltersInputs
            debouncedSearch={debouncedSearch}
            isLoading={isLoading}
            locations={locations}
            locationsValue={locationsValue}
            maxPriceValue={maxPriceValue}
            minPriceValue={minPriceValue}
            propertyTypeOptions={propertyTypeOptions}
            propertyTypesValue={propertyTypesValue}
            searchValue={searchValue}
            setLocationsValue={setLocationsValue}
            setMaxPriceValue={setMaxPriceValue}
            setMinPriceValue={setMinPriceValue}
            setPropertyTypesValue={setPropertyTypesValue}
            setSearchParams={setSearchParams}
            setSearchValue={setSearchValue}
            setSortValue={setSortValue}
            sortValue={sortValue}
          />
        </div>
      </DrawerComponent>
      <div className="hidden lg:flex flex-wrap items-end gap-x-5 gap-y-6.25">
        <FiltersInputs
          debouncedSearch={debouncedSearch}
          isLoading={isLoading}
          locations={locations}
          locationsValue={locationsValue}
          maxPriceValue={maxPriceValue}
          minPriceValue={minPriceValue}
          propertyTypeOptions={propertyTypeOptions}
          propertyTypesValue={propertyTypesValue}
          searchValue={searchValue}
          setLocationsValue={setLocationsValue}
          setMaxPriceValue={setMaxPriceValue}
          setMinPriceValue={setMinPriceValue}
          setPropertyTypesValue={setPropertyTypesValue}
          setSearchParams={setSearchParams}
          setSearchValue={setSearchValue}
          setSortValue={setSortValue}
          sortValue={sortValue}
        />
      </div>
      <Button className="lg:h-12 lg:text-base h-10 text-[14px]">
        {totalCount} آگهی پیدا شد
      </Button>
      <Button
        className="lg:h-12 lg:text-base h-10 text-[14px]"
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
