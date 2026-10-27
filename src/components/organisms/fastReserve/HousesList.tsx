"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getHouses } from "@/app/actions/fastReserve/houses.actions";
import ViewProductCard from "@/components/molecules/product-card/ViewProductCard";
import Link from "next/link";

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

export default function HousesList() {
  const searchParams = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());

  const { data, isFetching, isError } = useQuery({
    queryKey: ["houses", filters],
    queryFn: () => getHouses(filters),
    placeholderData: keepPreviousData,
  });

  if (isError) return <p>خطا در دریافت اطلاعات</p>;
  if (data && data.houses.length === 0) return <p>چیزی یافت نشد !</p>;

  return (
    <div className={isFetching ? "grid gap-3 opacity-60" : "grid gap-3"}>
      {data?.houses.map((house: IHouse) => (
                  <Link
            key={house.id}
            // هدایت به صفحه دیتیل با آیدی واقعی هر خانه
            href={`/houseReserve/${house.id}`}
             >
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
        />
        </Link>
      ))}
    </div>
  );
}
