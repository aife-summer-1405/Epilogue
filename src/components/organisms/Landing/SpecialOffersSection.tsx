"use client";

import ProductCard from "@/components/molecules/product-card/ProductCard";
import Button from "@/components/atoms/button/Button";
import { SectionHeading } from "@/components/molecules";
import { useHouses } from "@/hooks/queries/houses/useHouses";
import Link from "next/link";

export default function SpecialOffersSection() {
  const { data, isLoading, isError } = useHouses();

  const houses = data?.houses ?? [];

  const discountedHouses = houses
    .filter((house) => Number(house.discounted_price ?? 0) > 0)
    .slice(0, 3);

  return (
    <section className="w-full overflow-hidden px-4 py-10 md:px-6 md:pb-24">
      <SectionHeading
        title="تخفیفات ویژه برای شروع تابستان"
        subtitle="فرصت رو از دست نده"
        timeLabel="2:25:20"
      />

      {isLoading ? (
        <p className="mt-8 py-12 text-center text-neutral-500">
          در حال دریافت خانه‌ها...
        </p>
      ) : isError ? (
        <p className="mt-8 py-12 text-center text-red-500">
          دریافت اطلاعات با خطا مواجه شد.
        </p>
      ) : discountedHouses.length === 0 ? (
        <p className="mt-8 py-12 text-center text-neutral-500">
          در حال حاضر خانه تخفیف‌داری برای نمایش وجود ندارد.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-4">
            {discountedHouses.map((house) => (
              <Link
                key={house.id}
                href={`/mortgage-rent/${house.id}`}
              >
                <div key={house.id} className="w-full min-w-0">
                  <ProductCard
                    image={house.photos?.[0] || house.photos || ""}
                    title={house.title}
                    address={house.address}
                    rating={Number(house.rate ?? house.rate ?? 0)}
                    bedrooms={Number(house.rooms ?? house.rooms ?? 0)}
                    bathrooms={Number(house.bathrooms ?? 0)}
                    guests={Number(house.capacity ?? house.capacity ?? 0)}
                    parking={Number(house.parking ?? 0)}
                    monthlyRent={String(house.price ?? house.price ?? 0)}
                    pricePerNight={String(
                      house.discounted_price ?? house.price ?? 0
                    )}
                    originalPrice={String(house.price ?? "")}
                    off={Number(house.discounted_price)}
                  />

                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href={`/mortgage-rent/`}
            >
              <Button size="lg" variant="outline">
                مشاهده بیشتر
              </Button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
