"use client";

import { SectionHeading } from "@/components/molecules";
import CategoryCard from "@/components/molecules/category-card/CategoryCard";
import { useCategories } from "@/hooks/queries/landing/useCategories";
import pic from "@/app/assets/Image/Villa.png";

interface Category {
  id: string;
  name: string;
  image?: string | null;
}

export default function CategorySection() {
  const { data, isPending, isError } = useCategories();

  const categories: Category[] = (
    Array.isArray(data?.data) ? data.data : []
  ).slice(0, 6);

  if (isPending) {
    return (
      <section className="w-full py-10 md:py-24">
        <p className="text-center">در حال دریافت دسته‌بندی‌ها...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full py-10 md:py-24">
        <p className="text-center">
          دریافت دسته‌بندی‌ها با خطا مواجه شد.
        </p>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="w-full py-10 md:py-24">
        <SectionHeading
          title="هر ملکی بخوای اینجا پیدا میشه"
          subtitle="فقط بگرد و پیدا کن"
        />

        <p className="py-12 text-center text-neutral-500">
          دسته‌بندی‌ای برای نمایش وجود ندارد.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full overflow-hidden py-10 md:py-24">
      <div className="mx-auto flex flex-col gap-6">
        <div className="px-4 text-center">
          <p className="text-[20px] font-semibold text-primary-500">
            فقط بگرد و پیدا کن
          </p>

          <h3 className="mt-2 text-[40px] font-bold text-neutral-950 dark:text-white">
            هر ملکی بخوای اینجا پیدا میشه!
          </h3>
        </div>

        <div
          className="
            flex gap-3 overflow-x-auto px-4 pb-2
            snap-x snap-mandatory scrollbar-none
            [&::-webkit-scrollbar]:hidden
            lg:hidden
          "
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="w-[200px] shrink-0 snap-start"
            >
              <CategoryCard
                title={category.name}
                image={category.image || pic}
              />
            </div>
          ))}
        </div>

        <div className="hidden grid-cols-6 gap-3 px-[63px] lg:grid">
          {categories.map((category) => (
            <div key={category.id} className="min-w-0">
              <CategoryCard
                title={category.name}
                image={category.image || pic}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}