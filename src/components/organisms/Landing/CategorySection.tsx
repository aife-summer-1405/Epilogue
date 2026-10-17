

import CategoryCard from "@/components/molecules/category-card/CategoryCard";
import Category1 from "@/app/assets/Image/Villa.png";
import Category2 from "@/app/assets/Image/Villa2.png";

const categories = [
    { id: 1, title: "ملک ویلایی", image: Category1 },
    { id: 2, title: "ملک ویلایی", image: Category2 },
    { id: 3, title: "ملک ویلایی", image: Category1 },
    { id: 4, title: "ملک ویلایی", image: Category2 },
    { id: 5, title: "ملک ویلایی", image: Category2 },
    { id: 6, title: "ملک ویلایی", image: Category2 },
];

export default function CategorySection() {
    return (
        <section className="w-full overflow-hidden  py-10 md:py-24">
            <div className="mx-auto flex flex-col gap-6">
                {/* Section heading */}
                <div className="px-4 text-center">
                    <p className="text-[20px] font-semibold text-primary-500">
                        فقط بگرد و پیدا کن
                    </p>

                    <h3 className="mt-2 text-[40px] font-bold text-neutral-950 dark:text-white md:text-[40px]">
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

                {/* Desktop full-width grid */}
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
