import { getSellerHousesAction, getCategoriesAction } from "@/app/actions/sellerHouse.action";
import { SellerHouseListOrganism } from "@/components/organisms/SellerHouseList/SellerHouseListOrganism";
import { SellerHouseQueryParams } from "@/core/types/sellerHouse";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    category?: string;
  }>;
}

async function HouseListContent({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
  const limit = resolvedSearchParams.limit ? Number(resolvedSearchParams.limit) : 10;
  const search = resolvedSearchParams.search || "";
  const minPrice = resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined;
  const category = resolvedSearchParams.category || undefined;

  const queryParams: SellerHouseQueryParams = {
    page,
    limit,
    search,
    minPrice,
    maxPrice,
    category,
  };

  const [initialData, categoriesData] = await Promise.all([
    getSellerHousesAction(queryParams),
    getCategoriesAction(),
  ]);

  return (
    <SellerHouseListOrganism
      initialData={initialData}
      categories={categoriesData?.data || []}
    />
  );
}

export default function SellerHouseListPage({ searchParams }: PageProps) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto ">
        <Suspense fallback={<div className="py-12 text-center text-zinc-400">در حال بارگذاری اطلاعات...</div>}>
          <HouseListContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}