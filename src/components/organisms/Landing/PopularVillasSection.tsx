
import VillaCard from "@/components/molecules/villa-card/VillaCard";
import Button from "@/components/atoms/button/Button";
import villa2Image from "@/app/assets/Image/Villa2.png";
import { SectionHeading } from "@/components/molecules";

const villas = [
  { id: 1, image: villa2Image },
  { id: 2, image: villa2Image },
  { id: 3, image: villa2Image },
  { id: 4, image: villa2Image },
];

export default function PopularVillasSection() {
  return (
    <section className="w-full overflow-hidden  px-4 py-8 md:px-6 md:pb-24">
      <SectionHeading
        title="اجاره ویلا در محبوب‌ترین مقاصد ایران"
        subtitle="ویلاها را با ما انتخاب کنید"
      />

      <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-4">
        {villas.map((villa) => (
          <div key={villa.id} className="w-full min-w-0">
            <VillaCard
              image={villa.image.src}
              title="اجاره ویلا در سوادکوه"
              count={50}
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
