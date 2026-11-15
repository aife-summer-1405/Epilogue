import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";

export const toGregorianDate = (date: DateObject): string => {
  const gregorianDate = new DateObject({
    date,
    calendar: persian,
  }).convert(gregorian);

  return gregorianDate.format("YYYY-MM-DD");
};

export const getUtcTimestamp = (date: DateObject): number => {
  const gregorianDate = new DateObject({
    date,
    calendar: persian,
  }).convert(gregorian);

  return Date.UTC(
    gregorianDate.year,
    gregorianDate.month.number - 1,
    gregorianDate.day,
  );
};

export const formatDateTime = (value?: string | null): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new DateObject({
    date,
    calendar: persian,
    locale: persian_fa,
  }).format("YYYY/M/D - HH:mm");
};
