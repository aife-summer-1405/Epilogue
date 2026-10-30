import {
  getHouses,
  IHousesResponse,
} from "@/app/actions/fastReserve/houses.actions";
import BreadCrumb from "@/components/molecules/breadcrumb/BreadCrumb";
import ViewProductCardSkeleton from "@/components/molecules/product-card/ViewProductCardSkeleton";
import FiltersSection from "@/components/organisms/fastReserve/FiltersSection";
import HousesListClient from "@/components/organisms/fastReserve/HousesListClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { FC, ReactNode, Suspense } from "react";
import HousesMapLoader from "@/components/organisms/fastReserve/HousesMapLoader";

type Filters = { [key: string]: string | string[] | undefined };

const list = [
  { label: "خانه", href: "/" },
  { label: "رزرو هتل", href: "/fastReserve" },
];

interface IProps {
  searchParams: Promise<Filters>;
}

async function HousesHydration({
  searchParams,
  children,
}: IProps & { children: ReactNode }) {
  const filters = await searchParams;
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["houses", filters],
    queryFn: ({ pageParam }) =>
      getHouses({
        ...filters,
        page: String(pageParam),
        limit: String(8),
        transactionType: "reservation",
      }),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: IHousesResponse,
      allPages: IHousesResponse[],
    ) => {
      const totalPages = Math.ceil(lastPage.totalCount / 8);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

const page: FC<IProps> = ({ searchParams }) => {
  return (
    <div className="mx-auto flex flex-col items-center gap-12 xl:max-w-11/12 lg:max-w-10/12 max-w-11/12">
      <BreadCrumb list={list} />
      <Suspense
        fallback={
          <div className="grid gap-3 w-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <ViewProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <HousesHydration searchParams={searchParams}>
          <FiltersSection />
          <div className="flex flex-col-reverse lg:flex-col xl:flex-row xl:items-stretch gap-3 w-full">
            <div
              dir="ltr"
              className="xl:w-6/10 w-full gap-3 lg:max-h-270 overflow-y-auto lg:pr-4 scrollbar-brand"
            >
              <HousesListClient />
            </div>
            <div className="relative xl:w-4/10 w-full min-h-135">
              <div className="absolute inset-0">
                <HousesMapLoader />
              </div>
            </div>
          </div>
        </HousesHydration>
      </Suspense>
    </div>
  );
};

export default page;
