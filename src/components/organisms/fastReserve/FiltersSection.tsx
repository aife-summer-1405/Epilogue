"use client";

import Button from "@/components/atoms/button/Button";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { FilterRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

type filterKeys =
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

const sortOptions = [
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
  const searchParams = new URLSearchParams();
  searchParams.set("search", String("awdjknawk"));

  const setSearchParams = (key: filterKeys, value: string | null) => {
    if (value === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    return router.push(`?${searchParams.toString()}`);
  };
  return (
    <div className="flex flex-wrap items-end gap-x-5 gap-y-6.25">
      <FilterInput
        isTitle="جستوجو"
        onValueChange={(event) => {
          if (event === null) {
            return setSearchParams("search", event);
          }
          setSearchParams("search", event.value);
        }}
        placeHolder="نام هتل مورد نظر ..."
        items={[{ label: "awdkalwdkm", value: "string" }]}
      />
      <FilterInput
        size="mini"
        isTitle="مقصد یا  هتل شما"
        items={[{ label: "awdkalwdkm", value: "string" }]}
      />
      <FilterInput
        size="mini"
        isTitle="مرتب سازی بر اساس"
        items={sortOptions}
      />
      <FilterInput
        size="mini"
        isTitle="امکانات هتل"
        items={[{ label: "awdkalwdkm", value: "string" }]}
      />
      <FilterInput
        size="mini"
        isTitle="امتیاز هتل"
        items={[{ label: "awdkalwdkm", value: "string" }]}
      />
      <FilterInput
        size="mini"
        isTitle="حداقل قیمت "
        items={[{ label: "awdkalwdkm", value: "string" }]}
      />
      <FilterInput
        size="mini"
        isTitle="حداکثر قیمت :"
        items={[{ label: "awdkalwdkm", value: "string" }]}
      />
      <Button>آگهی پیدا شد</Button>
      <Button
        variant="danger"
        startIcon={
          <HugeiconsIcon
            icon={FilterRemoveIcon}
            className="size-4.5"
            stroke="1.5"
          />
        }
      >
        حذف فیلتر
      </Button>
    </div>
  );
};

export default FiltersSection;
