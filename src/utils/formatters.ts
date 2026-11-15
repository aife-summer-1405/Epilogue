import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const formatPersianDate = (dateString?: string | null): string => {
  if (!dateString) return "تاریخ نامشخص";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "تاریخ نامشخص";

  return new DateObject({
    date,
    calendar: persian,
    locale: persian_fa,
  }).format("D MMMM - YYYY HH:mm");
};

export const formatPrice = (
  price: number | string | null | undefined,
): string => {
  if (price === null || price === undefined || price === "") return "—";

  const numericPrice = Number(String(price).replace(/[٬,،]/g, ""));

  if (!Number.isFinite(numericPrice)) return "—";

  return new Intl.NumberFormat("fa-IR").format(numericPrice);
};

export const parseIsoDay = (value?: string | null): Date | null => {
  if (!value) return null;
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(value);
  if (!match) return null;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return Number.isNaN(date.getTime()) ? null : date;
};

export const countNights = (dates?: string[]): number | null => {
  const start = parseIsoDay(dates?.[0]);
  const end = parseIsoDay(dates?.[1]);
  if (!start || !end) return null;
  const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
  return diff > 0 ? diff : null;
};
