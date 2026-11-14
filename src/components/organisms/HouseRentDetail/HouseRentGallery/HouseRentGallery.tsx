"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Copy01Icon,
  StarIcon,
  Share01Icon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";

import ButtonOnlyIcon from "@/components/atoms/buttonOnlyIcon/buttonOnlyIcon";
import Button from "@/components/atoms/button/Button";
import HouseRentGalleryModal from "./HouseRentGalleryModal";
import { useToggleFavorite } from "@/hooks/queries/useFavorite";
import { toast } from "react-toastify";

export interface HouseRentGalleryProps {
  houseId: number | string;
  title: string;
  address: string;
  rating: number | string;
  photos?: string[] | null;
  userId?: string | number; 
}

export function HouseRentGallery({
  houseId,
  title,
  address,
  rating,
  photos,
  userId,
}: HouseRentGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

  const [isFav, setIsFav] = useState<boolean>(false);
  const [favId, setFavId] = useState<string | number | undefined>(undefined);

  const { addMutation, removeMutation } = useToggleFavorite();

  const currentUserId = userId || (typeof window !== "undefined" ? localStorage.getItem("user_id") : null) || "362";

  useEffect(() => {
    if (typeof window !== "undefined" && currentUserId) {
      const savedFav = localStorage.getItem(`fav_user_${currentUserId}_house_${houseId}`);
      if (savedFav) {
        try {
          const parsed = JSON.parse(savedFav);
          setIsFav(parsed.isFav);
          setFavId(parsed.favId);
        } catch {
        }
      } else {
        setIsFav(false);
        setFavId(undefined);
      }
    }
  }, [houseId, currentUserId]);

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

  const handleFavoriteToggle = () => {
    if (!currentUserId) {
      toast.error("لطفاً ابتدا وارد حساب کاربری خود شوید.");
      return;
    }

    if (isFav) {
      const currentFavId = favId;
      
      if (!currentFavId) {
        setIsFav(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem(`fav_user_${currentUserId}_house_${houseId}`);
        }
        toast.info("وضعیت علاقه‌مندی بازنشانی شد. لطفاً دوباره کلیک کنید.");
        return;
      }

      removeMutation.mutate(currentFavId, {
        onSuccess: () => {
          setIsFav(false);
          setFavId(undefined);
          if (typeof window !== "undefined") {
            localStorage.removeItem(`fav_user_${currentUserId}_house_${houseId}`);
          }
        },
      });
    } else {
      addMutation.mutate(
        {
          user_id: String(currentUserId),
          house_id: String(houseId),
        },
        {
          onSuccess: (response: any) => {
            const recordId = response?.id || response?.data?.id || response?.favorite?.id;
            
            setIsFav(true);
            setFavId(recordId);

            if (typeof window !== "undefined") {
              localStorage.setItem(
                `fav_user_${currentUserId}_house_${houseId}`,
                JSON.stringify({ isFav: true, favId: recordId })
              );
            }
          },
        }
      );
    }
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
    } catch {}
  };

  const galleryLayout =
    imageCount === 1
      ? "grid-cols-1 grid-rows-1 aspect-[4/3] sm:aspect-auto sm:h-[500px] lg:h-[626px]"
      : imageCount === 2
        ? "grid-cols-2 grid-rows-1 h-[220px] sm:h-[320px] md:h-[500px] lg:h-[626px]"
        : "grid-cols-2 grid-rows-[220px_110px] sm:h-[320px] sm:grid-cols-3 sm:grid-rows-2 md:h-[500px] lg:h-[626px]";

  return (
    <>
      <section className="w-full min-w-0">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row-reverse sm:items-start sm:justify-between">
          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
<Button size="sm">
  <span className="flex items-center gap-2">
    <span className="mt-1">
      {rating ? Number(rating).toString() : "0"} ستاره
    </span>
    <HugeiconsIcon icon={StarIcon} size={24} />
  </span>
</Button>

            <div className="flex items-center gap-2">
              <ButtonOnlyIcon
                hasIcon={false}
                variant="outline"
                size="sm"
                onClick={handleFavoriteToggle}
                aria-label="افزودن به علاقه‌مندی‌ها"
              >
                <HugeiconsIcon
                  icon={FavouriteIcon}
                  size={19}
                  className={isFav ? "text-red-500 fill-red-500" : ""}
                />
              </ButtonOnlyIcon>

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
                <HugeiconsIcon icon={Share01Icon} size={19} />
              </ButtonOnlyIcon>
            </div>

            {copied && (
              <span role="status" className="text-xs text-green-700">
                لینک کپی شد
              </span>
            )}
          </div>

          <div className="min-w-0 text-right">
            <h1 className="wrap-break-word text-lg font-bold leading-8 sm:text-[24px]">
              {title}
            </h1>
            <div className="mt-4 flex items-start justify-start gap-1 text-[14px] text-[#8B8D98] sm:text-sm">
              <HugeiconsIcon icon={Location01Icon} size={18} className="shrink-0" />
              <span className="wrap-break-word">{address}</span>
            </div>
          </div>
        </div>

        {imageCount === 0 ? (
          <div className="flex aspect-4/3 w-full items-center justify-center rounded-2xl bg-neutral-100 text-sm text-neutral-500 sm:aspect-auto sm:h-[320px] md:h-[400px]">
            تصویری برای این ملک ثبت نشده است
          </div>
        ) : (
          <div className={`grid w-full min-w-0 gap-2 overflow-hidden sm:gap-3 ${galleryLayout}`}>
            {images.slice(0, imageCount === 2 ? 2 : 3).map((photo, index) => {
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
                  className={`group relative block h-full min-h-0 min-w-0 w-full overflow-hidden rounded-xl bg-neutral-100 sm:rounded-2xl ${positionClass}`}
                >
                  <Image
                    src={photo}
                    alt={`${title} تصویر ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  {isThird && hasMore && (
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-white transition-colors group-hover:bg-black/60">
                      <span className="text-sm font-semibold">مشاهده همه تصاویر</span>
                      <span className="text-xs">+{imageCount - 3} تصویر دیگر</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

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