"use client";

import { FC } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit02Icon,
  Home01Icon,
  Location01Icon,
  StarIcon,
  TrashIcon,
} from "@hugeicons/core-free-icons";
import Modal from "@/components/molecules/modal/Modal";
import Button from "@/components/atoms/button/Button";
import ImageFallback from "@/components/molecules/ImageFallBack/ImageFallBack";
import { Skeleton } from "@/components/ui/skeleton";
import { IAdminComment } from "@/core/types/admin/adminComments.types";
import { useGetAdminCommentById } from "@/hooks/queries/useGetAdminComments";
import {
  formatAdminCommentDate,
  getAdminHouseLabel,
  getAdminUserFullName,
  getAdminUserInitials,
  getNumericRating,
} from "./adminCommentUtils";

interface AdminCommentDetailModalProps {
  onEdit: (comment: IAdminComment) => void;
  onDelete: (id: string) => void;
}

const AdminCommentDetailModal: FC<AdminCommentDetailModalProps> = ({
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const commentId = searchParams.get("commentId");
  const { data: comment, isLoading } = useGetAdminCommentById(commentId);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("commentId");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const numericRating = getNumericRating(comment?.rating);

  return (
    <Modal
      title={comment?.parent_comment_id ? "جزئیات پاسخ" : "جزئیات نظر"}
      contentClassName="sm:max-w-2xl"
      open={Boolean(commentId)}
      onOpenChange={handleOpenChange}
    >
      {isLoading && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-6 w-2/3" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      )}

      {!isLoading && !comment && (
        <p className="py-10 text-center text-sm text-neutral-dark-300 dark:text-neutral-400">
          نظر مورد نظر یافت نشد
        </p>
      )}

      {!isLoading && comment && (
        <div className="flex max-h-[70vh] flex-col gap-5 overflow-y-auto scrollbar-hide">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {comment.user?.profilePicture ? (
                <ImageFallback
                  src={comment.user.profilePicture}
                  alt={getAdminUserFullName(comment.user)}
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-sm font-bold text-primary-500">
                  {getAdminUserInitials(comment.user)}
                </div>
              )}
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate text-base font-bold text-default-text">
                  {getAdminUserFullName(comment.user)}
                </p>
                <p className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
                  {formatAdminCommentDate(comment.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
              <HugeiconsIcon
                icon={StarIcon}
                className="size-4 fill-amber-400 text-amber-400"
              />
              <span>{numericRating}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 rounded-[16px] border border-neutral-300 p-4 text-neutral-dark-200 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Home01Icon} className="size-5 shrink-0" />
              <span className="text-sm font-semibold text-default-text">
                {getAdminHouseLabel(comment.house)} (کد ملک: {comment.house_id})
              </span>
            </div>
            {comment.house?.address && (
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Location01Icon}
                  className="size-5 shrink-0"
                />
                <span className="text-sm">{comment.house.address}</span>
              </div>
            )}
            {comment.parent_comment_id && (
              <span className="mt-1 text-xs font-medium text-primary-500">
                پاسخ به نظر شماره #{comment.parent_comment_id}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold text-default-text">
              {comment.title}
            </p>
            <p className="whitespace-pre-line text-sm leading-7 text-default-text">
              {comment.caption}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="button"
              onClick={() => {
                handleOpenChange(false);
                onEdit(comment);
              }}
              className="cursor-pointer rounded-[16px] bg-primary-500! p-3 text-white"
              startIcon={
                <HugeiconsIcon
                  icon={Edit02Icon}
                  className="size-5 text-white"
                />
              }
            >
              ویرایش
            </Button>
            <Button
              type="button"
              onClick={() => {
                handleOpenChange(false);
                onDelete(comment.id);
              }}
              className="cursor-pointer rounded-[16px] bg-red-500! p-3 text-white"
              startIcon={
                <HugeiconsIcon icon={TrashIcon} className="size-5 text-white" />
              }
            >
              حذف
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AdminCommentDetailModal;
