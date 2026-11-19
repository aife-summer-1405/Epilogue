"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  PencilEdit01Icon,
  Delete02Icon,
  Tick02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HouseComment } from "@/core/types/RentHouse/Comments/HouseRentComments.types";
import { formatPersianDate } from "@/utils/formatters";
import {
  useDeleteComment,
  useUpdateComment,
} from "@/hooks/queries/houses/useHouseComments";

interface Props {
  comment: HouseComment;
  index: number;
  houseId: string;
  currentUserId?: number | string | null;
  currentUserName?: string;
}

export default function HouseRentCommentCard({
  comment,
  index,
  houseId,
  currentUserId,
  currentUserName,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(comment.title ?? "");
  const [editCaption, setEditCaption] = useState(comment.caption ?? "");
  const [editRating, setEditRating] = useState(Number(comment.rating) || 5);

  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateComment(houseId);

  const { mutate: deleteComment, isPending: isDeleting } =
    useDeleteComment(houseId);

  const fullName =
    `${comment.user?.firstName ?? ""} ${comment.user?.lastName ?? ""}`.trim();

  const commentUserId =
    (comment.user as any)?.id ??
    (comment.user as any)?._id ??
    (comment as any).user_id ??
    (comment as any).userId;

  const isOwner = Boolean(
    (currentUserId &&
      commentUserId &&
      String(currentUserId) === String(commentUserId)) ||
      (currentUserName && fullName && currentUserName.trim() === fullName)
  );

  const rating = Number(comment.rating);
  const formattedDate = formatPersianDate(comment.created_at);

  useEffect(() => {
    if (!isDeleteModalOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        setIsDeleteModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isDeleteModalOpen, isDeleting]);

  const handleOpenEdit = () => {
    setEditTitle(comment.title ?? "");
    setEditCaption(comment.caption ?? "");
    setEditRating(Number(comment.rating) || 5);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditTitle(comment.title ?? "");
    setEditCaption(comment.caption ?? "");
    setEditRating(Number(comment.rating) || 5);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    const trimmedTitle = editTitle.trim();
    const trimmedCaption = editCaption.trim();

    if (!trimmedTitle || !trimmedCaption) {
      toast.error("لطفاً عنوان و متن نظر را تکمیل کنید.");
      return;
    }

    if (isUpdating) return;

    updateComment(
      {
        id: comment.id,
        payload: {
          title: trimmedTitle,
          caption: trimmedCaption,
          rating: editRating,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("نظر شما با موفقیت ویرایش شد.");
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "ویرایش نظر با خطا مواجه شد."
          );
        },
      }
    );
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (isDeleting) return;

    deleteComment(comment.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.success("نظر شما با موفقیت حذف شد.");
      },
      onError: (err) => {
        toast.error(
          err instanceof Error
            ? err.message
            : "حذف نظر با خطا مواجه شد. لطفاً دوباره تلاش کنید."
        );
      },
    });
  };

  return (
    <>
      <article
        dir="rtl"
        className={`rounded-xl border-r-4 border-[#1E40AF] p-3 transition-opacity dark:bg-[#353535] sm:p-4 ${
          isDeleting ? "pointer-events-none opacity-50" : ""
        } ${index % 3 === 0 ? "bg-[#F0F0F3]" : "bg-white"}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-200">
            {comment.user?.profilePicture ? (
              <Image
                src={comment.user.profilePicture}
                alt={fullName || "کاربر"}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-neutral-600">
                {fullName.charAt(0) || "ک"}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[20px] font-bold">
              {fullName || "کاربر"}
            </h3>

            <p className="mt-1 text-xs">{formattedDate}</p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {!isEditing && (
              <div className="flex items-center gap-1 text-[15px] text-amber-500">
                <span className="mt-1">
                  {Number.isFinite(rating) ? rating : 0}
                </span>
                <HugeiconsIcon icon={StarIcon} fill="#f7df0e" size={18} />
              </div>
            )}

            {isOwner && !isEditing && (
              <div className="flex items-center gap-1 border-r border-neutral-300 pr-2 dark:border-neutral-600">
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  title="ویرایش نظر"
                  aria-label="ویرایش نظر"
                  className="rounded-lg p-1.5 text-neutral-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <HugeiconsIcon icon={PencilEdit01Icon} size={18} />
                </button>

                <button
                  type="button"
                  onClick={handleOpenDeleteModal}
                  disabled={isDeleting}
                  title="حذف نظر"
                  aria-label="حذف نظر"
                  className="rounded-lg p-1.5 text-neutral-600 transition hover:bg-red-50 hover:text-red-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="my-3.75 w-full border border-[#DDDDDD] dark:border-neutral-600" />

        {isEditing ? (
          <div className="mt-3 space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="عنوان نظر"
              maxLength={100}
              className="w-full rounded-lg border border-neutral-300 bg-white p-2 text-sm outline-none focus:border-blue-500 dark:border-neutral-600 dark:bg-[#272727]"
            />

            <textarea
              rows={3}
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="متن نظر"
              maxLength={2000}
              className="w-full resize-y rounded-lg border border-neutral-300 bg-white p-2 text-sm outline-none focus:border-blue-500 dark:border-neutral-600 dark:bg-[#272727]"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEditRating(value)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md border text-xs transition ${
                      editRating === value
                        ? "border-amber-400 bg-amber-50 font-bold text-amber-500"
                        : "border-neutral-200 bg-neutral-50 text-neutral-500"
                    }`}
                  >
                    {value}
                    <HugeiconsIcon
                      className="pr-0.5"
                      icon={StarIcon}
                      fill="#f7df0e"
                      size={12}
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="flex items-center gap-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={15} />
                  انصراف
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="flex items-center gap-1 rounded-lg bg-blue-700 px-3 py-1.5 text-xs text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  <HugeiconsIcon icon={Tick02Icon} size={15} />
                  {isUpdating ? "در حال ذخیره..." : "ذخیره"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            {comment.title && (
              <h4 className="mb-1 text-[14px] font-semibold text-[#8B8D98] dark:text-[#909090]">
                {comment.title}
              </h4>
            )}

            <p className="break-words text-[14px] leading-6 text-[#8B8D98] dark:text-[#909090]">
              {comment.caption}
            </p>
          </div>
        )}
      </article>

      {isDeleteModalOpen && (
        <div
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-comment-title-${comment.id}`}
          onClick={handleCloseDeleteModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl dark:border-neutral-700 dark:bg-[#272727] sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                  <HugeiconsIcon icon={Delete02Icon} size={22} />
                </div>
                <div>
                  <h3
                    id={`delete-comment-title-${comment.id}`}
                    className="text-base font-bold text-neutral-900 dark:text-white"
                  >
                    حذف نظر
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    این عملیات قابل بازگشت نیست
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                aria-label="بستن پنجره"
                className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              آیا مطمئن هستید که می‌خواهید نظر{" "}
              {comment.title ? (
                <span className="font-semibold text-neutral-900 dark:text-white">
                  «{comment.title}»
                </span>
              ) : (
                "خود"
              )}{" "}
              را حذف کنید؟
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} />
                {isDeleting ? "در حال حذف..." : "بله، حذف شود"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}