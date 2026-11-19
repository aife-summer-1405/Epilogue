"use client";

import { FC, useEffect, useState } from "react";
import { Dialog } from "@base-ui/react";
import Button from "@/components/atoms/button/Button";
import Modal from "@/components/molecules/modal/Modal";
import { ICommentFormValues, ISellerComment } from "./ICommentManagement";
import CommentAvatar from "./CommentAvatar";
import StarRating from "./StarRating";
import { getRatingNumber, getUserFullName } from "./commentUtils";

interface IProps {
  mode: "reply" | "edit";
  comment: ISellerComment | null;
  onClose: () => void;
  onSubmit: (values: ICommentFormValues) => void;
}

const MAX_TITLE = 100;
const MAX_CAPTION = 500;

const fieldClass =
  "w-full rounded-[16px] border border-neutral-300 bg-default-white-bg px-4 py-3 text-base font-normal text-default-text outline-none placeholder:text-neutral-dark-300 focus:border-primary-500 dark:placeholder:text-neutral-400";

const SellerCommentFormModal: FC<IProps> = ({
  mode,
  comment,
  onClose,
  onSubmit,
}) => {
  const isEdit = mode === "edit";
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    setTitle(isEdit && comment ? comment.title : "");
    setCaption(isEdit && comment ? comment.caption : "");
  }, [comment?.id, isEdit]);

  const trimmedTitle = title.trim();
  const trimmedCaption = caption.trim();
  const hasChanges =
    !isEdit ||
    !comment ||
    trimmedTitle !== comment.title ||
    trimmedCaption !== comment.caption;
  const canSubmit =
    !!trimmedCaption && (!isEdit || !!trimmedTitle) && hasChanges;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      title: isEdit ? trimmedTitle : "",
      caption: trimmedCaption,
    });
  };

  return (
    <Modal
      title={isEdit ? "ویرایش نظر" : "پاسخ به نظر"}
      contentClassName="sm:max-w-xl"
      open={!!comment}
      onOpenChange={(open) => !open && onClose()}
      hasFooter={true}
      footer={
        <div className="flex w-full flex-col-reverse items-center justify-center gap-3 sm:flex-row sm:gap-8">
          <Dialog.Close
            data-slot="dialog-close"
            render={
              <Button
                className="w-full cursor-pointer rounded-[16px] border-neutral-dark-300 py-3 text-center text-base font-normal text-neutral-dark-300 sm:w-52 dark:border-neutral-400 dark:text-neutral-400"
                variant="outline"
              />
            }
          >
            انصراف
          </Dialog.Close>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full rounded-[16px] text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-52"
          >
            {isEdit ? "ذخیره تغییرات" : "ثبت پاسخ"}
          </Button>
        </div>
      }
    >
      {comment && (
        <div className="flex flex-col gap-4">
          {!isEdit && (
            <div className="flex flex-col gap-3 rounded-[16px] border border-neutral-300 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <CommentAvatar user={comment.user} />
                  <span className="truncate text-sm font-bold text-default-text">
                    {getUserFullName(comment.user)}
                  </span>
                </div>
                <StarRating value={getRatingNumber(comment.rating)} />
              </div>
              <p className="text-sm font-bold text-default-text">
                {comment.title}
              </p>
              <p className="line-clamp-3 whitespace-pre-line text-sm leading-7 text-neutral-dark-300 dark:text-neutral-400">
                {comment.caption}
              </p>
            </div>
          )}

          {isEdit && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="seller-comment-title"
                className="text-base font-semibold text-default-text"
              >
                عنوان
              </label>
              <input
                id="seller-comment-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={MAX_TITLE}
                placeholder="عنوان نظر"
                className={fieldClass}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="seller-comment-caption"
              className="text-base font-semibold text-default-text"
            >
              {isEdit ? "متن نظر" : "متن پاسخ"}
            </label>
            <textarea
              id="seller-comment-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={MAX_CAPTION}
              rows={5}
              placeholder={
                isEdit
                  ? "متن نظر خود را بنویسید ..."
                  : "پاسخ خود را بنویسید ..."
              }
              className={`${fieldClass} resize-none`}
            />
            <p className="text-left text-xs font-normal text-neutral-dark-300 dark:text-neutral-400">
              {caption.length}/{MAX_CAPTION}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SellerCommentFormModal;
