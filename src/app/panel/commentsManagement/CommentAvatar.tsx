"use client";

import { FC } from "react";
import Button from "@/components/atoms/button/Button";
import Modal from "@/components/molecules/modal/Modal";
import { Skeleton } from "@/components/ui/skeleton";
import useFakeLoading from "@/hooks/useFakeLoading";
import {
  CommentAdd01Icon,
  Edit02Icon,
  Home01Icon,
  Location01Icon,
  TrashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ICommentUser, ISellerComment } from "./ICommentManagement";
import CommentAvatar from "./CommentAvatar";
import StarRating from "./StarRating";
import { buildCommentDetail } from "./commentMock";
import {
  formatCommentDate,
  getHouseLabel,
  getRatingNumber,
  getUserFullName,
  isOwnComment,
} from "./commentUtils";

interface IProps {
  comments: ISellerComment[];
  currentUser: ICommentUser;
  onReply: (comment: ISellerComment) => void;
  onEdit: (comment: ISellerComment) => void;
  onDelete: (id: string) => void;
}

const actionButtonClass = "bg-primary-500! text-white rounded-[16px] p-3";

const SellerCommentDetailModal: FC<IProps> = ({
  comments,
  currentUser,
  onReply,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const commentId = searchParams.get("commentId");
  const comment = commentId ? buildCommentDetail(comments, commentId) : null;
  const isLoading = useFakeLoading(commentId);

  const isReply = !!comment?.parent_comment_id;
  const isOwn = !!comment && isOwnComment(comment.user, currentUser);
  const canReply = !!comment && !isOwn && !isReply;
  const parent = comment?.parent_comment ?? null;

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("commentId");
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <Modal
      title={isReply ? "جزئیات پاسخ" : "جزئیات نظر"}
      contentClassName="sm:max-w-2xl"
      open={!!commentId}
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
          <Skeleton className="h-12 w-32 rounded-[16px]" />
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
              <CommentAvatar user={comment.user} size="md" />
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate text-base font-bold text-default-text">
                  {getUserFullName(comment.user)}
                  {isOwn && (
                    <span className="mr-2 text-sm font-normal text-primary-500">
                      (شما)
                    </span>
                  )}
                </p>
                <p className="text-sm font-normal text-neutral-dark-300 dark:text-neutral-400">
                  {formatCommentDate(comment.created_at)}
                </p>
              </div>
            </div>
            {!isReply && (
              <StarRating
                value={getRatingNumber(comment.rating)}
                className="size-5"
              />
            )}
          </div>

          <div className="flex flex-col gap-1 text-neutral-dark-200">
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={Home01Icon} className="size-5 shrink-0" />
              <span className="text-sm">{getHouseLabel(comment.house)}</span>
            </div>
            {comment.house.address && (
              <div className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={Location01Icon}
                  className="size-5 shrink-0"
                />
                <span className="text-sm">{comment.house.address}</span>
              </div>
            )}
          </div>

          {parent && (
            <div className="flex flex-col gap-2 rounded-[16px] border border-neutral-300 p-4">
              <p className="text-sm font-bold text-default-text">
                در پاسخ به نظر {getUserFullName(parent.user)}
              </p>
              <p className="whitespace-pre-line text-sm leading-7 text-neutral-dark-300 dark:text-neutral-400">
                {parent.caption}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold text-default-text">
              {comment.title}
            </p>
            <p className="whitespace-pre-line text-sm leading-7 text-default-text">
              {comment.caption}
            </p>
          </div>

          {(canReply || isOwn) && (
            <div className="flex flex-wrap gap-3">
              {canReply && (
                <Button
                  onClick={() => onReply(comment)}
                  className={actionButtonClass}
                  startIcon={
                    <HugeiconsIcon
                      icon={CommentAdd01Icon}
                      className="size-5 text-white"
                    />
                  }
                >
                  پاسخ دادن
                </Button>
              )}
              {isOwn && (
                <>
                  <Button
                    onClick={() => onEdit(comment)}
                    className={actionButtonClass}
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
                    onClick={() => onDelete(comment.id)}
                    className="rounded-[16px] bg-red-500! p-3 text-white"
                    startIcon={
                      <HugeiconsIcon
                        icon={TrashIcon}
                        className="size-5 text-white"
                      />
                    }
                  >
                    حذف
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default SellerCommentDetailModal;
