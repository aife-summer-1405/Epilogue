
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

import ButtonOnlyIcon from "@/components/atoms/buttonOnlyIcon/buttonOnlyIcon";

interface HouseRentGalleryModalProps {
  title: string;
  photos: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function HouseRentGalleryModal({
  title,
  photos,
  initialIndex,
  onClose,
}: HouseRentGalleryModalProps) {
  const [activeImage, setActiveImage] = useState(initialIndex);

  const imageCount = photos.length;

  const showNext = () => {
    if (imageCount < 2) return;

    setActiveImage((current) => (current + 1) % imageCount);
  };

  const showPrevious = () => {
    if (imageCount < 2) return;

    setActiveImage(
      (current) => (current - 1 + imageCount) % imageCount
    );
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();

      if (event.key === "ArrowRight") {
        setActiveImage((current) => (current + 1) % imageCount);
      }

      if (event.key === "ArrowLeft") {
        setActiveImage(
          (current) => (current - 1 + imageCount) % imageCount
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [imageCount, onClose]);

  if (imageCount === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="گالری تصاویر ملک"
      onClick={onClose}
    >
      <div className="absolute right-3 top-3 z-20 sm:right-6 sm:top-6">
        <ButtonOnlyIcon
          variant="outline"
          hasIcon={false}
          size="sm"
          onClick={onClose}
          aria-label="بستن گالری"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={22} />
        </ButtonOnlyIcon>
      </div>

      {imageCount > 1 && (
        <div className="absolute left-2 z-20 sm:left-6">
          <ButtonOnlyIcon
            variant="outline"
            hasIcon={false}
            size="sm"
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="تصویر قبلی"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={22} />
          </ButtonOnlyIcon>
        </div>
      )}

      <div
        className="relative h-[65vh] w-full max-w-5xl sm:h-[75vh]"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={photos[activeImage]}
          alt={`${title} - تصویر ${activeImage + 1}`}
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {imageCount > 1 && (
        <div className="absolute right-2 z-20 sm:right-6">
          <ButtonOnlyIcon
            variant="outline"
            size="sm"
            hasIcon={false}
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="تصویر بعدی"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={22} />
          </ButtonOnlyIcon>
        </div>
      )}

      <span className="absolute bottom-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
        {activeImage + 1} / {imageCount}
      </span>
    </div>
  );
}
