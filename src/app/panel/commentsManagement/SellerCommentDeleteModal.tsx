"use client";

import { FC } from "react";
import { Dialog } from "@base-ui/react";
import Button from "@/components/atoms/button/Button";
import Modal from "@/components/molecules/modal/Modal";

interface IProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SellerCommentDeleteModal: FC<IProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      title="حذف نظر"
      contentClassName="sm:max-w-md"
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      hasFooter={true}
      footer={
        <div className="flex w-full flex-col-reverse items-center justify-center gap-3 sm:flex-row sm:gap-6">
          <Dialog.Close
            data-slot="dialog-close"
            render={
              <Button
                className="w-full cursor-pointer rounded-[16px] border-neutral-dark-300 py-3 text-center text-base font-normal text-neutral-dark-300 sm:w-40 dark:border-neutral-400 dark:text-neutral-400"
                variant="outline"
              />
            }
          >
            انصراف
          </Dialog.Close>
          <Dialog.Close
            data-slot="dialog-close"
            render={
              <Button
                onClick={onConfirm}
                className="w-full cursor-pointer rounded-[16px] bg-red-500! text-white sm:w-40"
              />
            }
          >
            حذف
          </Dialog.Close>
        </div>
      }
    >
      <p className="text-center text-base font-normal leading-8 text-default-text">
        آیا از حذف این نظر مطمئن هستید؟ این عمل قابل بازگشت نیست.
      </p>
    </Modal>
  );
};

export default SellerCommentDeleteModal;
