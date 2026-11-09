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
  price: number | string | null | undefined
): string => {
  if (price === null || price === undefined || price === "") return "—";

  const numericPrice = Number(
    String(price).replace(/[٬,،]/g, "")
  );

  if (!Number.isFinite(numericPrice)) return "—";

  return new Intl.NumberFormat("fa-IR").format(numericPrice);
};