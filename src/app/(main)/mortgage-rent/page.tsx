import React, { FC, ReactNode, Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BreadCrumb from "@/components/molecules/breadcrumb/BreadCrumb";
import { IBreadCrumbsList } from "@/core/types/BreadCrumb/breadCrumb.types";
import { IHouseParams } from "@/core/types/houses/houseParams.types";
import { getHouses } from "@/services/houses/houses.service";
import MortgageRentContent from "@/components/organisms/mortgageRent/MortgageRentContent";

export const metadata = {
  title: "رهن و اجاره آپارتمان | مشاور املاک",
  description: "جستجو و مشاهده لیست کامل املاک برای رهن و اجاره",
};

type Filters = { [key: string]: string | string[] | undefined };

interface IProps {
  searchParams: Promise<Filters>;
}

const list: IBreadCrumbsList[] = [
  {
    href: "/",
    label: "خانه",
  },
  {
    href: "/mortgage-rent",
    label: "رهن و اجاره",
  },
];

export const parseHouseSearchParams = (raw: Filters): IHouseParams => {
  const getStr = (k: string) =>
    typeof raw[k] === "string" ? (raw[k] as string) : undefined;
  const getNum = (k: string) => {
    const val = getStr(k);
    return val && !isNaN(Number(val)) ? Number(val) : undefined;
  };

  return {
    page: getNum("page") || 1,
    limit: getNum("limit") || 9,
    order: (getStr("order") as "ASC" | "DESC") || "DESC",
    sort: (getStr("sort") as IHouseParams["sort"]) || "last_updated",
    search: getStr("search"),
    location: getStr("location"),
    propertyType: getStr("propertyType"),
    transactionType: getStr("transactionType"),
    minPrice: getNum("minPrice"),
    maxPrice: getNum("maxPrice"),
    minRent: getNum("minRent"),
    maxRent: getNum("maxRent"),
    minMortgage: getNum("minMortgage"),
    maxMortgage: getNum("maxMortgage"),
    minArea: getNum("minArea"),
    maxArea: getNum("maxArea"),
  };
};

async function MortgageHousesHydration({
  searchParams,
  children,
}: IProps & { children: ReactNode }) {
  const resolvedParams = await searchParams;
  const normalizedParams = parseHouseSearchParams(resolvedParams);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["houses-list", normalizedParams],
    queryFn: () => getHouses(normalizedParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

const MortgageAndRentPage: FC<IProps> = ({ searchParams }) => {
  return (
    <main
      className="mx-auto flex w-full max-w-11/12 flex-col items-center gap-12 lg:max-w-10/12 xl:max-w-11/12"
      dir="rtl"
    >
      <BreadCrumb list={list} />
      <Suspense
        fallback={
          <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:mt-8 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div
                key={idx}
                className="h-95 w-full animate-pulse rounded-[28px] bg-gray-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        <MortgageHousesHydration searchParams={searchParams}>
          <MortgageRentContent />
        </MortgageHousesHydration>
      </Suspense>
    </main>
  );
};

export default MortgageAndRentPage;