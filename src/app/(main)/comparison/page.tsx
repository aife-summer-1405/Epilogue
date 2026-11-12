import React, { FC, ReactNode, Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BreadCrumb from "@/components/molecules/breadcrumb/BreadCrumb";
import { IBreadCrumbsList } from "@/core/types/BreadCrumb/breadCrumb.types";
import ComparisonContent from "@/components/organisms/comparison/ComparisonContent";
import {
  getComparisonHouses,
  parseComparisonIds,
} from "@/services/comparison/comparison.service";

export const metadata = {
  title: "مقایسه املاک   ",
  description: "مقایسه مشخصات، امکانات و قیمت املاک انتخاب شده",
};

interface IProps {
  searchParams: Promise<{ ids?: string | string[] }>;
}

const breadcrumbList: IBreadCrumbsList[] = [
  { href: "/", label: "خانه" },
  { href: "/comparison", label: "مقایسه املاک" },
];

async function ComparisonHydration({
  searchParams,
  children,
}: IProps & { children: ReactNode }) {
  const resolved = await searchParams;
  const ids = parseComparisonIds(resolved.ids);
  const queryClient = new QueryClient();

  if (ids.length > 0) {
    const normalizedKey = ids.slice(0, 4).join(",");
    await queryClient.prefetchQuery({
      queryKey: ["comparison-houses", normalizedKey],
      queryFn: () => getComparisonHouses(ids),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

const ComparisonPage: FC<IProps> = ({ searchParams }) => {
  return (
    <main
      className="mx-auto flex w-full max-w-11/12 flex-col items-center gap-10 py-6 lg:max-w-10/12 xl:max-w-11/12"
      dir="rtl"
    >
      <BreadCrumb list={breadcrumbList} />
      <Suspense
        fallback={
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-135 w-full animate-pulse rounded-[28px] bg-gray-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        <ComparisonHydration searchParams={searchParams}>
          <ComparisonContent />
        </ComparisonHydration>
      </Suspense>
    </main>
  );
};

export default ComparisonPage;
