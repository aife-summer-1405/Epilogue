"use client";

import { FormEvent, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import type {
  AdminArticleItem,
  CreateAdminArticlePayload,
} from "@/core/types/adminArticle";
import { toPersianDigits } from "@/lib/formatters/house";

function toEnglishDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

function formatArticleDate(raw?: string | null): string {
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

interface AdminArticleDetailModalProps {
  article: AdminArticleItem | null;
  onClose: () => void;
}

export function AdminArticleDetailModal({
  article,
  onClose,
}: AdminArticleDetailModalProps) {
  if (!article) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-neutral-300 dark:border-neutral-100 bg-default-white-bg dark:bg-default-dark-content p-5 shadow-xl text-default-text space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold">
              جزئیات مقاله #{toPersianDigits(String(article.id))}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-800 dark:text-neutral-600">
              تاریخ انتشار:{" "}
              {formatArticleDate(article.created_at || article.createdAt)}
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3">
            <span className="text-neutral-800 dark:text-neutral-600">
              شناسه نویسنده:{" "}
            </span>
            <strong className="font-bold">
              #{toPersianDigits(String(article.author_id))}
            </strong>
          </div>
          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3">
            <span className="text-neutral-800 dark:text-neutral-600">
              شناسه دسته‌بندی:{" "}
            </span>
            <strong className="font-bold">
              #{toPersianDigits(String(article.category_id))}
            </strong>
          </div>
          <div className="rounded-xl bg-neutral-100 dark:bg-neutral-50 p-3 flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={14}
              color="currentColor"
              className="text-primary-500"
            />
            <span className="text-neutral-800 dark:text-neutral-600">
              زمان مطالعه:{" "}
            </span>
            <strong className="font-bold">
              {toPersianDigits(article.estimated_reading_time || "—")}
            </strong>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-neutral-200 dark:border-neutral-100 p-4 text-xs">
          <p className="text-sm font-extrabold text-default-text">
            {toPersianDigits(article.title)}
          </p>
          <p className="leading-relaxed text-neutral-800 dark:text-neutral-600 whitespace-pre-line">
            {toPersianDigits(article.caption)}
          </p>
        </div>

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

interface AdminArticleFormModalProps {
  isOpen: boolean;
  article?: AdminArticleItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAdminArticlePayload) => Promise<void>;
}

export function AdminArticleFormModal({
  isOpen,
  article,
  isSubmitting,
  onClose,
  onSubmit,
}: AdminArticleFormModalProps) {
  const isEditMode = Boolean(article);

  const [title, setTitle] = useState(article?.title ?? "");
  const [caption, setCaption] = useState(article?.caption ?? "");
  const [readingTime, setReadingTime] = useState(
    toPersianDigits(article?.estimated_reading_time ?? "۵ دقیقه")
  );
  const [authorId, setAuthorId] = useState(
    toPersianDigits(String(article?.author_id ?? "1"))
  );
  const [categoryId, setCategoryId] = useState(
    toPersianDigits(String(article?.category_id ?? "1"))
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title: title.trim(),
      caption: caption.trim(),
      estimated_reading_time: toPersianDigits(readingTime.trim()),
      author_id: Number(toEnglishDigits(authorId)) || 1,
      category_id: Number(toEnglishDigits(categoryId)) || 1,
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
            {isEditMode
              ? `ویرایش مقاله #${toPersianDigits(String(article?.id))}`
              : "ایجاد مقاله جدید"}
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
          <div>
            <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
              عنوان مقاله
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان مقاله را وارد کنید..."
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-default-text outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
                زمان مطالعه
              </label>
              <input
                type="text"
                required
                value={readingTime}
                onChange={(e) => setReadingTime(toPersianDigits(e.target.value))}
                placeholder={toPersianDigits("۶ دقیقه")}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-default-text outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
                شناسه نویسنده
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={authorId}
                onChange={(e) => setAuthorId(toPersianDigits(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-default-text outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
                شناسه دسته‌بندی
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(toPersianDigits(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 dark:border-neutral-200 bg-neutral-100 dark:bg-[#353535] px-3 py-2 text-default-text outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-bold text-neutral-800 dark:text-neutral-600">
              متن / توضیحات مقاله
            </label>
            <textarea
              rows={5}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="متن کامل یا خلاصه مقاله..."
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
                : isEditMode
                  ? "ذخیره تغییرات"
                  : "ثبت مقاله"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}