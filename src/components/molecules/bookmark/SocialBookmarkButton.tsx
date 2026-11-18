"use client";

import { useState, useEffect, useTransition } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark02Icon,
  Delete02Icon,
  Edit02Icon,
  Cancel01Icon,
  Share08Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "react-toastify";
import { checkAuthAndExecute } from "@/utils/authGuard";
import ButtonOnlyIcon from "@/components/atoms/buttonOnlyIcon/buttonOnlyIcon";
import {
  createSocialBookmarkAction,
  updateSocialBookmarkAction,
  deleteSocialBookmarkAction,
} from "@/app/actions/bookmark.actions";

interface Props {
  houseId: number;
  existingBookmark?: {
    id: number;
    note: string;
    shareUrl?: string;
  } | null;
  onBookmarkChanged?: () => void;
}

export default function SocialBookmarkButton({
  houseId,
  existingBookmark,
  onBookmarkChanged,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(existingBookmark?.note || "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setNote(existingBookmark?.note || "");
  }, [existingBookmark]);

  const isBookmarked = Boolean(existingBookmark?.id);

  const handleOpenModal = () => {
    checkAuthAndExecute(() => {
      setIsOpen(true);
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      toast.warning("لطفاً یک یادداشت کوتاه بنویسید.");
      return;
    }

    startTransition(async () => {
      const res = await createSocialBookmarkAction({
        houseId,
        note: note.trim(),
      });
      if (res.success) {
        toast.success("اقامتگاه با یادداشت شما ذخیره شد.");
        setIsOpen(false);
        onBookmarkChanged?.();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleUpdate = () => {
    if (!existingBookmark?.id) return;
    if (!note.trim()) {
      toast.warning("یادداشت نمی‌تواند خالی باشد.");
      return;
    }

    startTransition(async () => {
      const res = await updateSocialBookmarkAction({
        id: existingBookmark.id,
        houseId,
        note: note.trim(),
      });
      if (res.success) {
        toast.success("یادداشت با موفقیت ویرایش شد.");
        setIsOpen(false);
        onBookmarkChanged?.();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDelete = () => {
    if (!existingBookmark?.id) return;
    startTransition(async () => {
      const res = await deleteSocialBookmarkAction(existingBookmark.id);
      if (res.success) {
        toast.success("از لیست نشان‌شده‌ها حذف شد.");
        setNote("");
        setIsOpen(false);
        onBookmarkChanged?.();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleCopyShareUrl = () => {
    if (!existingBookmark?.shareUrl) return;
    navigator.clipboard.writeText(existingBookmark.shareUrl);
    toast.info("لینک اشتراک‌گذاری در حافظه کپی شد.");
  };

  return (
    <>
      <ButtonOnlyIcon
        hasIcon={false}
        variant="outline"
        size="sm"
        onClick={handleOpenModal}
        aria-label={isBookmarked ? "مدیریت نشان‌شده" : "افزودن به نشان‌شده‌ها"}
      >
        <HugeiconsIcon
          icon={Bookmark02Icon}
          size={19}
          className={
            isBookmarked
              ? "text-amber-500 fill-amber-500"
              : "text-neutral-700 dark:text-neutral-200"
          }
        />
      </ButtonOnlyIcon>

      {isOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-xs sm:items-center sm:p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-[28px] bg-white p-5 shadow-2xl dark:bg-[#272727] dark:text-white sm:rounded-[24px] sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold">
                <HugeiconsIcon
                  icon={isBookmarked ? Edit02Icon : Bookmark02Icon}
                  size={20}
                  className="text-amber-500"
                />
                {isBookmarked ? "مدیریت نشان‌شده و یادداشت" : "ذخیره با یادداشت"}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#353535]"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  یادداشت شما برای این اقامتگاه (قابل اشتراک‌گذاری با دوستان)
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="مثلاً: ویلای استخردار عالی برای آخر هفته..."
                  className="w-full resize-none rounded-2xl border border-neutral-200 bg-[#F7F7F8] p-3.5 text-sm outline-none transition focus:border-amber-500 dark:border-[#3A3A3A] dark:bg-[#353535]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                {isBookmarked ? (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-400 disabled:opacity-50"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={16} />
                        حذف
                      </button>

                      {existingBookmark?.shareUrl && (
                        <button
                          type="button"
                          onClick={handleCopyShareUrl}
                          className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-2.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-[#353535] dark:text-neutral-200"
                        >
                          <HugeiconsIcon icon={Share08Icon} size={16} />
                          کپی لینک
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleUpdate}
                      className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
                    >
                      {isPending && (
                        <HugeiconsIcon
                          icon={Loading03Icon}
                          size={16}
                          className="animate-spin"
                        />
                      )}
                      <span>ویرایش یادداشت</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleCreate}
                    className="mr-auto flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-50"
                  >
                    {isPending && (
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        size={16}
                        className="animate-spin"
                      />
                    )}
                    <span>ثبت نشان‌شده</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}