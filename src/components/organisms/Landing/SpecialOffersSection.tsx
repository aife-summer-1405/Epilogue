"use client";

import ProductCard from "@/components/molecules/product-card/ProductCard";
import Button from "@/components/atoms/button/Button";
import { SectionHeading } from "@/components/molecules";
import { useHouses } from "@/hooks/queries/houses/useHouses";

export default function SpecialOffersSection() {
  const { data, isPending, isError } = useHouses();

  // فرض بر این است که پاسخ API مستقیماً آرایه است.
  const houses = Array.isArray(data) ? data : [];

  return (
    <section className="w-full overflow-hidden px-4 py-10 md:px-6 md:pb-24">
      <SectionHeading
        title="تخفیفات ویژه برای شروع تابستان"
        subtitle="فرصت رو از دست نده"
        timeLabel="2:25:20"
      />

      {isPending ? (
        <p className="mt-8 py-12 text-center text-neutral-500">
          در حال دریافت خانه‌ها...
        </p>
      ) : isError ? (
        <p className="mt-8 py-12 text-center text-red-500">
          دریافت اطلاعات با خطا مواجه شد.
        </p>
      ) : houses.length === 0 ? (
        <p className="mt-8 py-12 text-center text-neutral-500">
          در حال حاضر خانه‌ای برای نمایش وجود ندارد.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-4">
            {houses.map((house) => (
              <div key={house.id} className="w-full min-w-0">
                <ProductCard
                  image={house.image}
                  title={house.title}
                  address={house.address}
                  rating={house.rating}
                  bedrooms={house.bedrooms}
                  bathrooms={house.bathrooms}
                  guests={house.guests}
                  parking={house.parking}
                  monthlyRent={house.monthlyRent}
                  pricePerNight={house.pricePerNight}
                  originalPrice={house.originalPrice}
                  off={house.off}
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button size="lg" variant="outline">
              مشاهده بیشتر
            </Button>
          </div>
        </>
      )}
    </section>
  );
}