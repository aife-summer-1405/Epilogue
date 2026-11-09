import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
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
    gregorianDate.day
  );
};