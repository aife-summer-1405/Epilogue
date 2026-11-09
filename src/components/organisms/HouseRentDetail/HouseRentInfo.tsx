import { HouseRent } from "@/core/types/RentHouse/house";


interface Props {
  house: HouseRent;
}

export default function HouseRentInfo({ house }: Props) {
  return (
    <section dir="rtl" className="space-y-3 text-right">
      <h2 className="text-lg font-bold ">
        چرا {house.title} را انتخاب کنیم؟
      </h2>

      <p className="text-sm leading-7 dark:text-white text-[#8B8D98]">
        {house.caption || "توضیحاتی برای این اقامتگاه ثبت نشده است."}
      </p>

      {house.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {house.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
