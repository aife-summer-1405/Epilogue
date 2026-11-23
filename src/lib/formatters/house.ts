const CATEGORY_FA_MAP: Record<string, string> = {
  apartment: "آپارتمان",
  suite: "سوئیت",
  villa: "ویلا",
  "garden-villa": "ویلا باغ",
  "villa-house": "خانه ویلایی",
  house: "خانه",
  "traditional-house": "خانه سنتی",
  cottage: "کلبه",
  "eco-lodge": "اقامتگاه بوم‌گردی",
  penthouse: "پنت‌هاوس",
  room: "اتاق",
  duplex: "دوبلکس",
  bungalow: "بانگالو",
  cabin: "کلبه چوبی",
  hotel: "هتل",
  hostel: "هاستل",
  motel: "متل",
  resort: "مجتمع اقامتی",
  "beach-villa": "ویلا ساحلی",
  "forest-villa": "ویلا جنگلی",
  "wooden-cottage": "کلبه چوبی",
  "swiss-cottage": "کلبه سوئیسی",
};

const WORD_FA_MAP: Record<string, string> = {
  apartment: "آپارتمان",
  suite: "سوئیت",
  villa: "ویلا",
  garden: "باغ",
  house: "خانه",
  traditional: "سنتی",
  cottage: "کلبه",
  eco: "بوم‌گردی",
  lodge: "اقامتگاه",
  penthouse: "پنت‌هاوس",
  room: "اتاق",
  duplex: "دوبلکس",
  modern: "مدرن",
  luxury: "لوکس",
  beach: "ساحلی",
  forest: "جنگلی",
  wooden: "چوبی",
  swiss: "سوئیسی",
  pool: "استخردار",
  old: "قدیمی",
  new: "نوساز",
  small: "کوچک",
  big: "بزرگ",
  studio: "استودیو",
  flat: "فلت",
  townhouse: "تاون‌هاوس",
  mansion: "عمارت",
};

const FA_TO_CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_FA_MAP).map(([en, fa]) => [fa, en])
);

const YARD_TYPE_FA_MAP: Record<string, string> = {
  none: "بدون حیاط",
  garden: "باغچه / حیاط سرسبز",
  courtyard: "حیاط خلوت",
  private_yard: "حیاط اختصاصی",
  "private-yard": "حیاط اختصاصی",
  terrace: "تراس / بهارخواب",
  shared: "حیاط مشترک",
  pool: "حیاط استخردار",
};

const FA_TO_YARD_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(YARD_TYPE_FA_MAP).map(([en, fa]) => [fa, en])
);

function normalizeSlugKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function translateEnglishTokens(raw: string): string {
  const words = raw
    .trim()
    .toLowerCase()
    .split(/[\s\-_]+/)
    .filter(Boolean);

  if (words.length === 0) return "";

  const translated = words.map((w) => WORD_FA_MAP[w] ?? w);

  if (translated.length === 2 && WORD_FA_MAP[words[0]] && WORD_FA_MAP[words[1]]) {
    return `${translated[1]} ${translated[0]}`;
  }

  return translated.join(" ");
}

export function formatCategoryFa(name?: string | null): string {
  if (!name) return "-";
  const trimmed = name.trim();
  if (!trimmed) return "-";

  const slug = normalizeSlugKey(trimmed);

  if (CATEGORY_FA_MAP[slug]) {
    return CATEGORY_FA_MAP[slug];
  }

  if (!/[a-zA-Z]/.test(trimmed)) {
    return trimmed;
  }

  return translateEnglishTokens(trimmed);
}

export function normalizeCategoryToApi(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "suite";

  if (FA_TO_CATEGORY_MAP[trimmed]) {
    return FA_TO_CATEGORY_MAP[trimmed];
  }

  if (/[a-zA-Z]/.test(trimmed)) {
    return normalizeSlugKey(trimmed);
  }

  return trimmed;
}

export function formatYardTypeFa(yardType?: string | null): string {
  if (!yardType) return "بدون حیاط";
  const trimmed = yardType.trim();
  if (!trimmed) return "بدون حیاط";

  const slug = normalizeSlugKey(trimmed);
  if (YARD_TYPE_FA_MAP[slug]) {
    return YARD_TYPE_FA_MAP[slug];
  }

  if (!/[a-zA-Z]/.test(trimmed)) {
    return trimmed;
  }

  return translateEnglishTokens(trimmed);
}

export function normalizeYardTypeToApi(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "none";

  if (FA_TO_YARD_MAP[trimmed]) {
    return FA_TO_YARD_MAP[trimmed];
  }

  if (/[a-zA-Z]/.test(trimmed)) {
    return normalizeSlugKey(trimmed);
  }

  return trimmed;
}

export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function sanitizeDecimalInput(raw: string): string {
  const english = toEnglishDigits(raw);
  let result = "";
  let hasDot = false;

  for (const ch of english) {
    if (/\d/.test(ch)) {
      result += ch;
    } else if ((ch === "." || ch === "٫" || ch === "/") && !hasDot) {
      hasDot = true;
      result += ".";
    } else if (ch === "-" && result.length === 0) {
      result += "-";
    }
  }

  return result;
}