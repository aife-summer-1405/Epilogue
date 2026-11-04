import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";

export const getToday = () =>
  new DateObject({ calendar: persian }).set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

export const getTomorrow = () => getToday().add(1, "day");
