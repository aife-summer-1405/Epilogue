"use client";

import { FC } from "react";
import Modal from "@/components/molecules/modal/Modal";
import Button from "@/components/atoms/button/Button";

interface SocialMediaDeleteModalProps {
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SocialMediaDeleteModal: FC<SocialMediaDeleteModalProps> = ({
  open,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      title="حذف لینک شبکه اجتماعی"
      contentClassName="sm:max-w-md"
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isDeleting) onClose();
      }}
    >
      <div className="flex flex-col gap-6">
        <p className="text-sm leading-7 text-default-text sm:text-base">
          آیا از حذف این لینک اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={onClose}
            className="w-full cursor-pointer rounded-[16px] border-neutral-dark-300 py-2.5 text-sm text-neutral-dark-300 sm:w-32 dark:border-neutral-400 dark:text-neutral-400"
          >
            انصراف
          </Button>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="w-full cursor-pointer rounded-[16px] bg-red-500! py-2.5 text-sm text-white hover:bg-red-600! sm:w-36"
          >
            {isDeleting ? "در حال حذف..." : "بله، حذف شود"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SocialMediaDeleteModal;