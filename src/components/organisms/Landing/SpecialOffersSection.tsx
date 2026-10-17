
import ProductCard from "@/components/molecules/product-card/ProductCard";
import Button from "@/components/atoms/button/Button";

import bedroomImage from "@/app/assets/Image/BedRoom.png";

import { SectionHeading } from "@/components/molecules";

const products = [
  { id: 1, image: bedroomImage },
  { id: 2, image: bedroomImage },
  { id: 3, image: bedroomImage },
];

export default function SpecialOffersSection() {
  return (
    <section className="w-full overflow-hidden  px-4 py-10 md:px-6 md:pb-24">
      <SectionHeading
        title="تخفیفات ویژه برای شروع تابستان"
        subtitle="فرصت رو از دست نده"
        timeLabel="2:25:20"
      />

      {/* Responsive product list */}
      <div className="mt-4 flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-4">
        {products.map((product) => (
          <div key={product.id} className="w-full min-w-0">
            <ProductCard
              image={product.image.src}
              title="خانه ویلایی با پارکینگ اختصاصی"
              address="خیابان 404 بروکلین، کالیفرنیا"
              rating={4.5}
              bedrooms={3}
              bathrooms={3}
              guests={3}
              parking={1}
              monthlyRent="4.500.000"
              pricePerNight="3.825.000"
              originalPrice="4.500.000"
              off={15}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button size="lg" variant="outline">
          مشاهده بیشتر
        </Button>
      </div>
    </section>
  );
}
