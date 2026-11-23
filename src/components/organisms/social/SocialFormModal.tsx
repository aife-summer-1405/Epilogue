"use client";

import { FormEvent, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { SocialMediaLink } from "@/core/types/social";
import {
  useCreateSocialMediaLink,
  useUpdateSocialMediaLink,
} from "@/hooks/use-socials";
import { normalizePlatformToApi } from "@/lib/formatters/social";
import { toPersianDigits } from "@/lib/formatters/house";

interface SocialFormModalProps {
  item: SocialMediaLink | null;
  onClose: () => void;
}

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "اینستاگرام " },
  { value: "telegram", label: "تلگرام " },
  { value: "whatsapp", label: "واتساپ " },
  { value: "youtube", label: "یوتیوب " },
  { value: "linkedin", label: "لینکدین " },
  { value: "x", label: "ایکس " },
  { value: "aparat", label: "آپارات " },
  { value: "rubika", label: "روبیکا" },
  { value: "eitaa", label: "ایتا " },
  { value: "bale", label: "بله " },
];

export function SocialFormModal({ item, onClose }: SocialFormModalProps) {
  const isEdit = Boolean(item);
  const createMutation = useCreateSocialMediaLink();
  const updateMutation = useUpdateSocialMediaLink();

  const [platform, setPlatform] = useState(
    isEdit ? (item?.platform ?? "instagram") : ""
  );
  const [url, setUrl] = useState(item?.url ?? "");

  const isPending = createMutation.isPending || updateMutation.isPending;

  const selectOptions = useMemo(() => {
    const currentVal = platform.trim();
    if (!currentVal) return PLATFORM_OPTIONS;
    const exists = PLATFORM_OPTIONS.some(
      (opt) => opt.value.toLowerCase() === currentVal.toLowerCase()
    );
    if (exists) return PLATFORM_OPTIONS;
    return [{ value: currentVal, label: currentVal }, ...PLATFORM_OPTIONS];
  }, [platform]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    const cleanPlatform = normalizePlatformToApi(platform);
    if (!cleanPlatform || !cleanUrl) return;

    if (isEdit && item) {
      await updateMutation.mutateAsync({
        id: item.id,
        payload: { platform: cleanPlatform, url: cleanUrl },
      });
    } else {
      await createMutation.mutateAsync({
        platform: cleanPlatform,
        url: cleanUrl,
      });
    }

    onClose();
  };

  const fieldClass =
    "w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3.5 py-2.5 text-xs sm:text-sm text-default-text outline-none focus:border-primary-500 transition-colors";

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold">
              {isEdit
                ? `ویرایش شبکه اجتماعی #${toPersianDigits(item!.id)}`
                : "افزودن شبکه اجتماعی جدید"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-neutral-800 dark:text-neutral-600">
              پلتفرم
            </label>
            {isEdit ? (
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className={`${fieldClass} cursor-pointer`}
              >
                {selectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="نام پلتفرم را وارد کنید (مثلاً: instagram، روبیکا...)"
                className={fieldClass}
              />
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-neutral-800 dark:text-neutral-600">
              لینک صفحه (URL)
            </label>
            <input
              type="url"
              dir="ltr"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/example"
              className={`${fieldClass} text-left`}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-neutral-200 dark:border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-4 py-2 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2 text-xs font-bold text-white transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isPending
                ? "در حال ذخیره..."
                : isEdit
                  ? "ذخیره تغییرات"
                  : "ثبت شبکه اجتماعی"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}