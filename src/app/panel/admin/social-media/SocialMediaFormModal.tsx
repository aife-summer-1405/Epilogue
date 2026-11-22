"use client";

import { FC, FormEvent, useEffect, useState } from "react";
import Modal from "@/components/molecules/modal/Modal";
import Button from "@/components/atoms/button/Button";
import { ISocialMediaLink } from "@/core/types/admin/socialMedia.types";

interface SocialMediaFormModalProps {
  open: boolean;
  initialData: ISocialMediaLink | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: { platform: string; url: string }) => void;
}

const SocialMediaFormModal: FC<SocialMediaFormModalProps> = ({
  open,
  initialData,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) {
      setPlatform(initialData?.platform || "");
      setUrl(initialData?.url || "");
    }
  }, [open, initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return;
    onSubmit({ platform: platform.trim(), url: url.trim() });
  };

  return (
    <Modal
      title={initialData ? "ویرایش لینک شبکه اجتماعی" : "افزودن لینک شبکه اجتماعی"}
      contentClassName="sm:max-w-xl"
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isSubmitting) onClose();
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="social-platform"
            className="text-sm font-semibold text-default-text"
          >
            نام پلتفرم
          </label>
          <input
            id="social-platform"
            type="text"
            required
            dir="ltr"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="مثلاً instagram"
            className="w-full rounded-[16px] border border-neutral-300 bg-transparent px-4 py-2.5 text-left text-sm text-default-text outline-none transition-colors focus:border-primary-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="social-url"
            className="text-sm font-semibold text-default-text"
          >
            آدرس لینک (URL)
          </label>
          <input
            id="social-url"
            type="url"
            required
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/..."
            className="w-full rounded-[16px] border border-neutral-300 bg-transparent px-4 py-2.5 text-left text-sm text-default-text outline-none transition-colors focus:border-primary-500"
          />
        </div>

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
            className="w-full cursor-pointer rounded-[16px] border-neutral-dark-300 py-2.5 text-sm text-neutral-dark-300 sm:w-36 dark:border-neutral-400 dark:text-neutral-400"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !platform.trim() || !url.trim()}
            className="w-full cursor-pointer rounded-[16px] py-2.5 text-sm text-white sm:w-40"
          >
            {isSubmitting
              ? "در حال ذخیره..."
              : initialData
                ? "ذخیره تغییرات"
                : "افزودن لینک"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SocialMediaFormModal;