const PLATFORM_FA_MAP: Record<string, string> = {
  instagram: "اینستاگرام",
  telegram: "تلگرام",
  whatsapp: "واتساپ",
  youtube: "یوتیوب",
  x: "ایکس (توییتر)",
  twitter: "توییتر",
  linkedin: "لینکدین",
  aparat: "آپارات",
  rubika: "روبیکا",
  eitaa: "ایتا",
  bale: "بله",
  soroush: "سروش",
  tiktok: "تیک‌تاک",
  facebook: "فیسبوک",
};

const FA_TO_PLATFORM_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(PLATFORM_FA_MAP).map(([en, fa]) => [fa, en])
);

export function formatPlatformFa(platform?: string | null): string {
  if (!platform) return "-";
  const trimmed = platform.trim();
  const key = trimmed.toLowerCase();
  if (PLATFORM_FA_MAP[key]) return PLATFORM_FA_MAP[key];
  return trimmed;
}

export function normalizePlatformToApi(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "instagram";
  if (FA_TO_PLATFORM_MAP[trimmed]) return FA_TO_PLATFORM_MAP[trimmed];
  return trimmed.toLowerCase();
}