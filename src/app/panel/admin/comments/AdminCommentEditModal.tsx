"use client";

import { FC, FormEvent, useEffect, useState } from "react";
import Modal from "@/components/molecules/modal/Modal";
import Button from "@/components/atoms/button/Button";
import { IAdminComment } from "@/core/types/admin/adminComments.types";
import { getNumericRating } from "./adminCommentUtils";

interface AdminCommentEditModalProps {
  comment: IAdminComment | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    caption: string;
    rating: number;
  }) => void;
}

const RATING_CHOICES = [1, 2, 3, 4, 5];

const AdminCommentEditModal: FC<AdminCommentEditModalProps> = ({
  comment,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState<number>(5);

  useEffect(() => {
    if (comment) {
      setTitle(comment.title || "");
      setCaption(comment.caption || "");
      const parsed = Math.round(getNumericRating(comment.rating));
      setRating(parsed >= 1 && parsed <= 5 ? parsed : 5);
    }
  }, [comment]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caption.trim()) return;
    onSubmit({ title: title.trim(), caption: caption.trim(), rating });
  };

  return (
    <Modal
      title="ویرایش نظر"
      contentClassName="sm:max-w-xl"
      open={Boolean(comment)}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="admin-comment-title"
            className="text-sm font-semibold text-default-text"
          >
            عنوان نظر
          </label>
          <input
            id="admin-comment-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان نظر را وارد کنید..."
            className="w-full rounded-[16px] border border-neutral-300 bg-transparent px-4 py-2.5 text-sm text-default-text outline-none transition-colors focus:border-primary-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="admin-comment-caption"
            className="text-sm font-semibold text-default-text"
          >
            متن نظر
          </label>
          <textarea
            id="admin-comment-caption"
            rows={4}
            required
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="متن نظر را وارد کنید..."
            className="w-full resize-none rounded-[16px] border border-neutral-300 bg-transparent px-4 py-3 text-sm leading-6 text-default-text outline-none transition-colors focus:border-primary-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-default-text">
            امتیاز
          </span>
          <div className="flex flex-wrap gap-2">
            {RATING_CHOICES.map((star) => (
              <button
                key={star}
                type="button"
                aria-pressed={rating === star}
                onClick={() => setRating(star)}
                className={`cursor-pointer rounded-[12px] border px-3.5 py-2 text-sm font-medium transition-colors ${
                  rating === star
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-neutral-300 text-default-text hover:bg-primary-50 dark:hover:bg-neutral-200"
                }`}
              >
                {star} ستاره
              </button>
            ))}
          </div>
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
            disabled={isSubmitting || !title.trim() || !caption.trim()}
            className="w-full cursor-pointer rounded-[16px] py-2.5 text-sm text-white sm:w-40"
          >
            {isSubmitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminCommentEditModal;
