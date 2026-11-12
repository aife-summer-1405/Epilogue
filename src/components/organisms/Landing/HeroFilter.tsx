"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import Button from "@/components/atoms/button/Button";
import FilterInput from "@/components/molecules/inputs/filterInput/FilterInput";
import { useGetLocations } from "@/hooks/queries/useGetLocations";
import { ILocations } from "@/core/types/locations/locations.types";
import { getToday, getTomorrow } from "@/utils/getToday";
import { getUtcTimestamp } from "@/utils/date";

type SearchMode = "reservation" | "rental" | "mortgage";

const routeByMode: Record<SearchMode, string> = {
  reservation: "/fastReserve",
  rental: "/mortgage-rent",
  mortgage: "/mortgage-rent",
};

const searchModes: { label: string; value: SearchMode }[] = [
  { label: "رزرو ملک", value: "reservation" },
  { label: "اجاره ملک", value: "rental" },
  { label: "رهن ملک", value: "mortgage" },
];

const guestItems = [
  { label: "۱ نفر", value: "1" },
  { label: "۲ نفر", value: "2" },
  { label: "۳ نفر", value: "3" },
  { label: "۴ نفر", value: "4" },
  { label: "۵ نفر یا بیشتر", value: "5+" },
];

const dateInputClass =
  "!h-10 !py-6 w-full! text-default-black font-semibold !rounded-full !border-0 !bg-[#F0F0F3] !px-4 !pl-10 !text-sm !outline-none dark:!bg-[#353535]";

const labelClass = "mb-2 block text-start text-sm font-semibold";

const toMidnight = (date: DateObject) =>
  new DateObject(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

export default function HeroFilter() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { data, isLoading } = useGetLocations();

  const [mode, setMode] = useState<SearchMode>("reservation");
  const [destination, setDestination] = useState<string | null>(null);
  const [today, setToday] = useState<DateObject | null>(null);
  const [startDate, setStartDate] = useState<DateObject | null>(null);
  const [endDate, setEndDate] = useState<DateObject | null>(null);

  const locations = useMemo(
    () =>
      (data?.data ?? []).map((loc: ILocations) => ({
        ...loc,
        label: loc.areaName,
        value: loc.areaName,
      })),
    [data],
  );

  useEffect(() => {
    setToday(getToday());
    setStartDate(getToday());
    setEndDate(getTomorrow());
  }, []);

  const handleStartDateChange = (date: DateObject | null) => {
    if (!date || Array.isArray(date)) return;

    const selected = toMidnight(date);
    setStartDate(selected);

    if (!endDate || getUtcTimestamp(endDate) <= getUtcTimestamp(selected)) {
      setEndDate(new DateObject(selected).add(1, "day"));
    }
  };

  const handleEndDateChange = (date: DateObject | null) => {
    if (!date || Array.isArray(date)) return;

    const selected = toMidnight(date);
    if (startDate && getUtcTimestamp(selected) <= getUtcTimestamp(startDate)) {
      return;
    }

    setEndDate(selected);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("location", destination);

    const query = params.toString();
    router.push(`${routeByMode[mode]}${query ? `?${query}` : ""}`);
  };
  return (
    <div className="w-full">
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
      <div
        className="
          flex w-full flex-col gap-4 rounded-[28px]
          bg-default-white p-4 shadow-lg
          lg:flex-row lg:items-end lg:gap-5
          lg:rounded-[30px] lg:px-5 lg:py-6
        "
      >
        <div
          className="
            grid min-w-0 flex-1 grid-cols-1 items-end gap-4
            sm:grid-cols-2
            lg:grid-cols-4 lg:gap-5
            2xl:grid-cols-[1.6fr_1fr_1fr_1fr]
          "
        >
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <FilterInput
              size="default"
              items={!isLoading && locations}
              isTitle="انتخاب مقصد"
              placeHolder="استان، شهر، اقامتگاه ..."
              onValueChange={(value) =>
                setDestination(value ? value.value : null)
              }
              className="w-full!"
            />
          </div>
          <div className="min-w-0">
            <label className={labelClass}>تاریخ ورود</label>
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/M/D"
              minDate={today ?? undefined}
              calendarPosition="bottom-right"
              inputClass={dateInputClass}
              containerClassName="w-full!"
              zIndex={100}
              className={isDark ? "bg-dark" : ""}
            />
          </div>
          <div className="min-w-0">
            <label className={labelClass}>تاریخ خروج</label>
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              calendar={persian}
              locale={persian_fa}
              format="YYYY/M/D"
              minDate={
                startDate ? new DateObject(startDate).add(1, "day") : undefined
              }
              calendarPosition="bottom-right"
              inputClass={dateInputClass}
              containerClassName="w-full!"
              zIndex={100}
              className={isDark ? "bg-dark" : ""}
            />
          </div>
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <FilterInput
              items={guestItems}
              isTitle="تعداد نفرات"
              placeHolder="وارد کنید ..."
              className="w-full!"
            />
          </div>
        </div>
        <Button
          size="md"
          variant="primary"
          className="w-full shrink-0 lg:w-auto"
          onClick={handleSearch}
          startIcon={<HugeiconsIcon icon={Search01Icon} className="h-5 w-5" />}
        >
          جستجو کن
        </Button>
      </div>
    </div>
  );
}
