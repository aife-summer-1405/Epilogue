"use client";

import { useEffect, useRef } from "react";
import ViewProductCard from "@/components/molecules/product-card/ViewProductCard";
import { useHouses } from "@/hooks/queries/fastReserve/useHouses";
import { useRouter } from "next/navigation";
import ViewProductCardSkeleton from "@/components/molecules/product-card/ViewProductCardSkeleton";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/molecules/product-card/ProductCard";
import ProductCardSkeleton from "@/components/molecules/product-card/ProductCardSkeleton";

interface IHouse {
  id: string;
  title: string;
  address: string;
  photos: string[];
  rate: string;
  price: string;
  discounted_price: string | null;
  capacity: number;
  bathrooms: number;
  rooms: number;
  parking: number;
  transaction_type: string;
}

const HousesListClient = () => {
  const router = useRouter();

  const {
    data,
    isError,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useHouses();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const houses: IHouse[] =
    data?.pages.flatMap((page) => page?.houses ?? []) ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ViewProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (isError) return <p>خطا در دریافت اطلاعات</p>;
  if (houses.length === 0) return <p>چیزی یافت نشد !</p>;

  return (
    <>
      <div
        className={cn(
          "hidden lg:grid gap-3",
          isFetching && !isFetchingNextPage ? "opacity-60" : null,
        )}
      >
        {houses.map((house) => (
          <ViewProductCard
            key={house.id}
            slides={house.photos.map((src) => ({ src, alt: house.title }))}
            title={house.title}
            address={house.address}
            bathrooms={house.bathrooms}
            bedrooms={house.rooms}
            guests={house.capacity}
            rating={Number(house.rate)}
            parking={house.parking}
            pricePerNight={house.discounted_price ?? house.price}
            monthlyRent={house.price}
            onDetailsClick={() => router.push(`/fastReserve/${house.id}`)}
          />
        ))}
        {isFetchingNextPage && (
          <>
            <ViewProductCardSkeleton />
            <ViewProductCardSkeleton />
          </>
        )}
      </div>
      <div
        className={cn(
          "grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden",
          isFetching && !isFetchingNextPage ? "opacity-60" : null,
        )}
      >
        {houses.map((house) => (
          <ProductCard
            key={house.id}
            slides={house.photos.map((src) => ({ src, alt: house.title }))}
            title={house.title}
            address={house.address}
            bathrooms={house.bathrooms}
            bedrooms={house.rooms}
            guests={house.capacity}
            rating={Number(house.rate)}
            parking={house.parking}
            pricePerNight={house.discounted_price ?? house.price}
            monthlyRent={house.price}
            onDetailsClick={() => router.push(`/fastReserve/${house.id}`)}
          />
        ))}
        {isFetchingNextPage && (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        )}
      </div>
      <div ref={loadMoreRef} className="h-1" />
    </>
  );
};

export default HousesListClient;
