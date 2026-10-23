"use client";

import { useState } from "react";
import Button from "@/components/atoms/button/Button";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

type SearchMode = "reserve" | "rent" | "buy";

const searchModes: { label: string; value: SearchMode }[] = [
  { label: "رزرو ملک", value: "reserve" },
  { label: "رهن و اجاره", value: "rent" },
  { label: "خرید و فروش", value: "buy" },
];

const destinationItems = [
  { label: "ساری", value: "sari" },
  { label: "تهران", value: "tehran" },
  { label: "رامسر", value: "ramsar" },
  { label: "چالوس", value: "chalous" },
];

const dateItems = [
  { label: "امروز", value: "today" },
  { label: "فردا", value: "tomorrow" },
  { label: "پس‌فردا", value: "day-after-tomorrow" },
];

const guestItems = [
  { label: "۱ نفر", value: "1" },
  { label: "۲ نفر", value: "2" },
  { label: "۳ نفر", value: "3" },
  { label: "۴ نفر", value: "4" },
  { label: "۵ نفر یا بیشتر", value: "5+" },
];

export default function HeroFilter() {
  const [mode, setMode] = useState<SearchMode>("reserve");
  const [destination, setDestination] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Search modes */}
      <div className="mb-3 flex flex-wrap items-center justify-start gap-2">
        {searchModes.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={mode === item.value ? "primary" : "outline"}
            onClick={() => setMode(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div
        className="
          flex w-full flex-col gap-4 rounded-[28px]
          bg-white dark:bg-[#272727] p-4 shadow-lg
          md:flex-row md:items-end md:gap-5
          md:rounded-[30px] md:px-5 md:py-6
        "
      >
        <div
          className="
            grid min-w-0 flex-1 grid-cols-1 gap-4
            sm:grid-cols-2 md:grid-cols-4 md:gap-5
          "
        >
          <div className="min-w-0">
            <FilterInput
              items={destinationItems}
              isTitle="انتخاب مقصد"
              placeHolder="استان، شهر، اقامتگاه ..."
              onValueChange={(value) =>
                setDestination(value ? String(value) : null)
              }
            />
          </div>

          <div className="min-w-0">
            <FilterInput
              items={dateItems}
              isTitle="تاریخ ورود"
              placeHolder="وارد کنید ..."
              onValueChange={(value) =>
                setCheckIn(value ? String(value) : null)
              }
            />
          </div>

          <div className="min-w-0">
            <FilterInput
              items={dateItems}
              isTitle="تاریخ خروج"
              placeHolder="وارد کنید ..."
              onValueChange={(value) =>
                setCheckOut(value ? String(value) : null)
              }
            />
          </div>

          <div className="min-w-0">
            <FilterInput
              items={guestItems}
              isTitle="تعداد نفرات"
              placeHolder="وارد کنید ..."
              onValueChange={(value) => setGuests(value ? String(value) : null)}
            />
          </div>
        </div>
        <Button
          size="sm"
          variant="primary"
          className="w-full shrink-0 md:w-auto"
          onClick={() => {
            console.log({
              mode,
              destination,
              checkIn,
              checkOut,
              guests,
            });
          }}
        >
          <div className="flex gap-1 justify-center items-center">
            <HugeiconsIcon icon={Search01Icon} />
            جستجو کن
          </div>
        </Button>
      </div>
    </div>
  );
}
