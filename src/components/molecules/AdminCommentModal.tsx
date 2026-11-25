"use client";

import { FormEvent, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, StarIcon } from "@hugeicons/core-free-icons";
import type {
  AdminCommentItem,
  UpdateAdminCommentPayload,
} from "@/core/types/adminComment";
import { toPersianDigits } from "@/lib/formatters/house";

function toEnglishDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

function formatCommentDate(raw?: string | null): string {
  if (!raw) return "ثبت نشده";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return toPersianDigits(raw);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

interface AdminCommentDetailModalProps {
  comment: AdminCommentItem | null;
  onClose: () => void;
}

export function AdminCommentDetailModal({
  comment,
  onClose,
}: AdminCommentDetailModalProps) {
  if (!comment) return null;

  const fullName =
    [comment.user?.firstName, comment.user?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "کاربر";

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold">
              جزئیات نظر #{toPersianDigits(String(comment.id))}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-800 dark:text-neutral-600">
              اقامتگاه #{toPersianDigits(String(comment.house_id))} ·{" "}
              {formatCommentDate(comment.created_at || comment.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3 text-xs">
          <div className="flex items-center gap-3">
            {comment.user?.profilePicture ? (
              <img
                src={comment.user.profilePicture}
                alt={fullName}
                className="h-10 w-10 rounded-full object-cover border border-neutral-300 dark:border-neutral-200"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold">
                {fullName.slice(0, 1)}
              </div>
            )}
            <div>
              <div className="font-bold text-default-text">
                {toPersianDigits(fullName)}
              </div>
              <div className="text-neutral-800 dark:text-neutral-600">
                {comment.house?.title
                  ? toPersianDigits(comment.house.title)
                  : `اقامتگاه #${toPersianDigits(String(comment.house_id))}`}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 rounded-xl bg-warning-50 dark:bg-warning-900/30 px-3 py-1.5 text-xs font-extrabold text-warning-700 dark:text-warning-400">
            <HugeiconsIcon icon={StarIcon} size={15} color="currentColor" />
            <span>{toPersianDigits(String(comment.rating))}</span>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-neutral-200 dark:border-neutral-100 p-3.5 text-xs">
          <p className="font-bold text-default-text">
            {toPersianDigits(comment.title)}
          </p>
          <p className="leading-relaxed text-neutral-800 dark:text-neutral-600">
            {toPersianDigits(comment.caption)}
          </p>
        </div>

        {comment.house?.address && (
          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3 text-xs">
            <span className="text-neutral-800 dark:text-neutral-600">
              آدرس اقامتگاه:{" "}
            </span>
            <strong className="font-semibold">
              {toPersianDigits(comment.house.address)}
            </strong>
          </div>
        )}

        <div className="flex justify-end border-t border-neutral-200 dark:border-neutral-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}

interface AdminCommentEditModalProps {
  comment: AdminCommentItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSave: (payload: UpdateAdminCommentPayload) => Promise<void>;
}

export function AdminCommentEditModal({
  comment,
  isSubmitting,
  onClose,
  onSave,
}: AdminCommentEditModalProps) {
  const [title, setTitle] = useState(comment?.title ?? "");
  const [caption, setCaption] = useState(comment?.caption ?? "");
  const [rating, setRating] = useState(
    toPersianDigits(String(Math.round(Number(comment?.rating ?? 5)) || 5))
  );

  if (!comment) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const numericRating = Math.min(
      5,
      Math.max(1, Math.round(Number(toEnglishDigits(rating)) || 5))
    );

    await onSave({
      id: comment.id,
      title: title.trim(),
      caption: caption.trim(),
      rating: numericRating,
    });
    onClose();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-lg rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
          <h2 className="text-base font-extrabold">
            ویرایش نظر #{toPersianDigits(String(comment.id))}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-800 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-50 cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
                عنوان نظر
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-default-text outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
                امتیاز (۱ تا ۵)
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={rating}
                onChange={(e) => setRating(toPersianDigits(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-default-text outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
              متن نظر
            </label>
            <textarea
              rows={4}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-default-text outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-neutral-200 dark:border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-300 dark:border-neutral-200 px-4 py-2 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary-500 hover:bg-primary-600 px-5 py-2 font-bold text-white transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting
                ? `در حال ذخیره ${toPersianDigits("...")}`
                : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}