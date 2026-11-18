"use client";

import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark02Icon } from "@hugeicons/core-free-icons";

export default function SharedNoteBanner() {
  const note = useSearchParams().get("bookmarkNote");
  if (!note) return null;

  return (
    <div
      dir="rtl"
      className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm sm:p-4"
    >
      <HugeiconsIcon
        icon={Bookmark02Icon}
        size={20}
        className="mt-0.5 shrink-0 text-amber-500"
      />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
          یادداشت دوست شما درباره‌ی این اقامتگاه
        </p>
        <p className="mt-1 break-words leading-7">{note}</p>
      </div>
    </div>
  );
}