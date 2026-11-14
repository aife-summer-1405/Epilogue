"use client";

import { FC } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { useTheme } from "next-themes";

interface IProps {
  label: string;
  value: DateObject | null;
  onChange: (date: DateObject | null) => void;
  minDate?: DateObject;
}

const ThemedDatePicker: FC<IProps> = ({ label, value, onChange, minDate }) => {
  const { theme } = useTheme();

  return (
    <div className="min-w-0 w-full sm:w-60">
      <label className="mb-2 block text-base text-default-text font-semibold">
        {label}
      </label>
      <DatePicker
        value={value}
        onChange={onChange}
        calendar={persian}
        locale={persian_fa}
        format="YYYY/M/D"
        minDate={minDate}
        calendarPosition="bottom-right"
        inputClass="!h-10 !py-6 w-full! text-neutral-dark-300 dark:text-neutral-400 font-normal !rounded-full !border-0 !bg-[#F0F0F3] !px-4 !pl-10 !text-base !outline-none dark:!bg-[#353535]"
        containerClassName="w-full!"
        portal
        zIndex={9999}
        className={theme === "dark" ? "bg-dark" : ""}
      />
    </div>
  );
};

export default ThemedDatePicker;
