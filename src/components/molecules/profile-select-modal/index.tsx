"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import { cn } from "@/lib/utils";

export interface ProfileSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl?: string | null;
  onSelectPhoto?: (file: File) => void;
  onConfirm?: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  enableFilePicker?: boolean;
  className?: string;
}

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";

const ProfileSelectModal: React.FC<ProfileSelectModalProps> = ({
  isOpen,
  onClose,
  avatarUrl,
  onSelectPhoto,
  onConfirm,
  title = "انتخاب پروفایل",
  confirmText = "انتخاب عکس",
  cancelText = "انصراف",
  enableFilePicker = true,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrimaryClick = () => {
    if (enableFilePicker && onSelectPhoto) {
      fileInputRef.current?.click();
    } else if (onConfirm) {
      onConfirm();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSelectPhoto) {
      onSelectPhoto(file);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      dir="rtl"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex w-full max-w-115 flex-col items-center rounded-[32px] bg-white p-6 shadow-[0_12px_40px_rgb(0,0,0,0.12)] sm:p-8 dark:border dark:border-zinc-800 dark:bg-[#272727]",
          className
        )}
      >
        <div className="flex w-full items-center justify-between">
          <h2
            id="profile-modal-title"
            className="text-xl font-extrabold text-gray-900 sm:text-2xl dark:text-white"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن مودال"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-800 transition-colors hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} strokeWidth={1.8} />
          </button>
        </div>

        <div className="my-8 relative h-44 w-44 overflow-hidden rounded-full bg-gray-100 shadow-sm sm:h-48 sm:w-48 dark:bg-zinc-800">
          <Image
            src={avatarUrl || DEFAULT_AVATAR}
            alt={title}
            fill
            sizes="(max-width: 640px) 176px, 192px"
            className="object-cover"
          />
        </div>

        {enableFilePicker && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        )}

        <div className="mt-2 grid w-full grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            hasIcon={false}
            onClick={onClose}
            className="h-13 w-full rounded-2xl border border-gray-400 bg-transparent text-base font-medium text-gray-600 hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="lg"
            hasIcon={false}
            onClick={handlePrimaryClick}
            className="h-13 w-full rounded-2xl bg-[#0b3155] text-base font-medium text-white hover:bg-[#154675]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelectModal;