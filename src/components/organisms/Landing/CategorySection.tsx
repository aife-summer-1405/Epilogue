"use client";

import { SectionHeading } from "@/components/molecules";
import CategoryCard from "@/components/molecules/category-card/CategoryCard";
import { useCategories } from "@/hooks/queries/useCategories";

export default function CategorySection() {
    const { data, isPending, isError } = useCategories();

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
    const categories = Array.isArray(data) ? data : [];
    if (categories.length === 0) {
        return (
            <section className="w-full py-10 md:py-24">
                <SectionHeading
                    title="هرملکی بخوای اینجا پیدا میشه"
                    subtitle="فقط بگرد و پیدا کن"
                />
                <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
                    <p className="text-lg font-semibold text-neutral-800 dark:text-white">
                        دسته‌بندی‌ای برای نمایش وجود ندارد.
                    </p>

                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        در حال حاضر هیچ دسته‌بندی‌ای ثبت نشده است.
                    </p>
                </div>
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

                {/* Mobile slider */}
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
                                title={category.title}
                                image={category.image}
                            />
                        </div>
                    ))}
                </div>

                {/* Desktop grid */}
                <div className="hidden grid-cols-6 gap-3 px-[63px] lg:grid">
                    {categories.map((category) => (
                        <div key={category.id} className="min-w-0">
                            <CategoryCard
                                title={category.title}
                                image={category.image}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}