export function toPersianDigits(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function formatPersianNumber(value: number | string, grouping = true): string {
  const num = Number(toEnglishDigits(String(value)).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(num)) return toPersianDigits(value);
  return new Intl.NumberFormat("fa-IR", { useGrouping: grouping }).format(num);
}