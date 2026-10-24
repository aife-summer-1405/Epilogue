import DateObject from "react-date-object";

export const toGregorianDate = (date: DateObject): string => {
  const gregorian = new DateObject(date).convert("gregorian");

  const year = String(gregorian.year);
  const month = String(gregorian.month.number).padStart(2, "0");
  const day = String(gregorian.day).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getUtcTimestamp = (date: DateObject): number => {
  const gregorian = new DateObject(date).convert("gregorian");

  return Date.UTC(
    gregorian.year,
    gregorian.month.number - 1,
    gregorian.day
  );
};