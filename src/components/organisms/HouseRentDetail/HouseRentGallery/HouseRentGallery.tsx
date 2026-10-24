
"use client";

import Image from "next/image";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Copy01Icon,
  StarIcon,
  Share01Icon,
} from "@hugeicons/core-free-icons";

import ButtonOnlyIcon from "@/components/atoms/buttonOnlyIcon/buttonOnlyIcon";
import Button from "@/components/atoms/button/Button";
import HouseRentGalleryModal from "./HouseRentGalleryModal";

export interface HouseRentGalleryProps {
  title: string;
  address: string;
  rating: number | string;
  photos?: string[] | null;
}

export function HouseRentGallery({
  title,
  address,
  rating,
  photos,
}: HouseRentGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

  // حذف عکس‌های خالی یا نامعتبر
  const images = (Array.isArray(photos) ? photos : []).filter(
    (photo): photo is string =>
      typeof photo === "string" && photo.trim().length > 0
  );

  const imageCount = images.length;

  const openGallery = (index: number) => {
    if (imageCount === 0) return;

    setActiveImage(index);
    setGalleryOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } else {
        await handleCopy();
      }
    } catch {
      // اشتراک‌گذاری ممکن است توسط کاربر لغو شود
    }
  };

  // چیدمان بر اساس تعداد عکس‌ها
  const galleryLayout =
    imageCount === 1
      ? "grid-cols-1 grid-rows-1 aspect-[4/3] sm:aspect-auto sm:h-[500px] lg:h-[626px]"
      : imageCount === 2
        ? "grid-cols-2 grid-rows-1 h-[220px] sm:h-[320px] md:h-[500px] lg:h-[626px]"
        : "grid-cols-2 grid-rows-[220px_110px] sm:h-[320px] sm:grid-cols-3 sm:grid-rows-2 md:h-[500px] lg:h-[626px]";

  return (
    <>
      <section className="w-full min-w-0">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row-reverse sm:items-start sm:justify-between">
          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
            <Button size="sm">
              <span className="flex items-center gap-2">
                <span className="mt-1">{rating} ستاره</span>
                <HugeiconsIcon icon={StarIcon} size={24} />
              </span>
            </Button>

            <div className="flex items-center gap-2">
              <ButtonOnlyIcon
                hasIcon={false}
                variant="outline"
                size="sm"
                onClick={handleCopy}
                aria-label="کپی لینک ملک"
              >
                <HugeiconsIcon icon={Copy01Icon} size={19} />
              </ButtonOnlyIcon>

              <ButtonOnlyIcon
                hasIcon={false}
                variant="outline"
                size="sm"
                onClick={handleShare}
                aria-label="اشتراک‌گذاری لینک ملک"
              >
                <HugeiconsIcon icon={Share01Icon} />              </ButtonOnlyIcon>
            </div>

            {copied && (
              <span role="status" className="text-xs text-green-700">
                لینک کپی شد
              </span>
            )}
          </div>

          <div className="min-w-0 text-right">
            <h1 className="break-words text-lg font-bold leading-8  sm:text-[24px]">
              {title}
            </h1>

            <div className="mt-4 flex items-start justify-start gap-1 text-[14px] text-[#8B8D98] sm:text-sm">
              <HugeiconsIcon
                icon={Location01Icon}
                size={18}
                className="shrink-0"
              />
              <span className="break-words">{address}</span>
            </div>
          </div>
        </div>

        {/* Responsive Gallery */}
        {imageCount === 0 ? (
          <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-neutral-100 text-sm text-neutral-500 sm:aspect-auto sm:h-[320px] md:h-[400px]">
            تصویری برای این ملک ثبت نشده است
          </div>
        ) : (
          <div
            className={`grid w-full min-w-0 gap-2 overflow-hidden sm:gap-3 ${galleryLayout}`}
          >
            {images.slice(0, imageCount === 2 ? 2 : 3).map(
              (photo, index) => {
                const isMain = index === 0;
                const isThird = index === 2;
                const hasMore = imageCount > 3;

                const positionClass =
                  imageCount === 1
                    ? "col-span-1 row-span-1"
                    : imageCount === 2
                      ? "col-span-1 row-span-1"
                      : isMain
                        ? "col-span-2 row-span-1 sm:col-span-2 sm:row-span-2"
                        : isThird
                          ? "col-start-2 row-start-2 sm:col-start-3 sm:row-start-2"
                          : "col-start-1 row-start-2 sm:col-start-3 sm:row-start-1";

                return (
                  <button
                    key={`${photo}-${index}`}
                    type="button"
                    onClick={() => openGallery(index)}
                    aria-label={`نمایش تصویر ${index + 1} از ${imageCount}`}
                    className={`group relative block h-full min-h-0 min-w-0 w-full overflow-hidden rounded-xl bg-neutral-100 sm:rounded-2xl ${positionClass}`}
                  >
                    <Image
                      src={photo}
                      alt={`${title} - تصویر ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes={
                        imageCount === 1
                          ? "100vw"
                          : imageCount === 2
                            ? "(max-width: 639px) 50vw, 50vw"
                            : isMain
                              ? "(max-width: 639px) 100vw, 66vw"
                              : "(max-width: 639px) 50vw, 34vw"
                      }
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />

                    {isThird && hasMore && (
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-white transition-colors group-hover:bg-black/60">
                        <span className="text-sm font-semibold">
                          مشاهده همه تصاویر
                        </span>
                        <span className="text-xs">
                          +{imageCount - 3} تصویر دیگر
                        </span>
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>
        )}

        {/* View all images */}
        {imageCount > 3 && (
          <button
            type="button"
            onClick={() => openGallery(0)}
            className="mt-3 text-sm font-medium text-neutral-700 underline underline-offset-4 hover:text-neutral-950"
          >
            مشاهده همه {imageCount} تصویر
          </button>
        )}
      </section>

      {/* Separate Gallery Modal */}
      {galleryOpen && imageCount > 0 && (
        <HouseRentGalleryModal
          title={title}
          photos={images}
          initialIndex={activeImage}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  );
}
