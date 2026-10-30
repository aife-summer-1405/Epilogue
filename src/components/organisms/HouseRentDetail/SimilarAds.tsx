"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ProductCard from "@/components/molecules/product-card/ProductCard";
import { useHouses } from "@/hooks/queries/houses/useHouses";
import { SliderDots } from "@/components/molecules";
import Button from "@/components/atoms/button/Button";
import { formatPrice } from "@/utils/formatters";

export default function SimilarAds() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isLoading, isError } = useHouses();

  const houses = data?.houses ?? [];
  const slides: (typeof houses)[] = [];

  for (let i = 0; i < houses.length; i += 3) {
    slides.push(houses.slice(i, i + 3));
  }

  const openDetails = (id: string) => {
    router.push(`/mortgage-rent/${id}`);
  };

  return (
    <section dir="rtl" className="w-full px-4 py-12  sm:px-6 lg:px-10.5">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold sm:text-xl">آگهی‌های مشابه</h2>

        <Button
          variant="outline"
          type="button"
          onClick={() => router.push("/mortgage-rent")}
        >
          مشاهده همه
        </Button>
      </div>

      {isLoading && (
        <p className="py-12 text-center text-sm text-neutral-400">
          در حال دریافت آگهی‌ها...
        </p>
      )}

      {isError && (
        <p className="py-12 text-center text-sm text-red-400">
          دریافت آگهی‌ها با خطا مواجه شد.
        </p>
      )}

      {!isLoading && !isError && houses.length === 0 && (
        <p className="py-12 text-center text-sm text-neutral-400">
          آگهی‌ای برای نمایش وجود ندارد.
        </p>
      )}

      {!isLoading && !isError && houses.length > 0 && (
        <>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${currentSlide * 100}%)`,
              }}
            >
              {slides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full shrink-0"
                  aria-hidden={currentSlide !== slideIndex}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {slide.map((house) => {
                      const isReservation =
                        house.transaction_type === "reservation";

                      const hasDiscount =
                        house.discounted_price != null &&
                        Number(house.discounted_price) > 0 &&
                        Number(house.discounted_price) < Number(house.price);

                      const discount = hasDiscount
                        ? Math.round(
                            (1 -
                              Number(house.discounted_price) /
                                Number(house.price)) *
                              100,
                          )
                        : undefined;

                      const displayedPrice = hasDiscount
                        ? house.discounted_price!
                        : house.price;

                      return (
                        <div key={house.id} className="min-w-0">
                          <ProductCard
                            image={
                              house.photos?.[0] ?? "/images/placeholder.png"
                            }
                            slides={house.photos.map((src) => ({
                              src,
                              alt: house.title,
                            }))}
                            title={house.title}
                            address={house.address}
                            rating={Number(house.rate) || 0}
                            bedrooms={house.rooms ?? 0}
                            bathrooms={house.bathrooms ?? 0}
                            guests={house.capacity ?? 0}
                            parking={house.parking ?? 0}
                            monthlyRent={formatPrice(
                              isReservation ? undefined : displayedPrice,
                            )}
                            pricePerNight={formatPrice(
                              isReservation ? displayedPrice : undefined,
                            )}
                            off={discount}
                            originalPrice={
                              hasDiscount ? formatPrice(house.price) : undefined
                            }
                            onClick={() => openDetails(house.id)}
                            onDetailsClick={() => openDetails(house.id)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <SliderDots
              totalSlides={slides.length}
              currentSlide={currentSlide}
              onDotClick={setCurrentSlide}
            />
          </div>
        </>
      )}
    </section>
  );
}
