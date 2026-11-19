"use client";

import { useEffect, useState } from "react";
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
  useBookmarkById,
  useCreateBookmark,
  useUpdateBookmark,
  useDeleteBookmark,
  useHouseBookmarkRef,
} from "@/hooks/mutations/useSocialBookmark";

interface Props {
  houseId: number | string;
  userId: string | null;
}

export default function SocialBookmarkButton({ houseId, userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [note, setNote] = useState("");

  const { bookmarkId, save, clear } = useHouseBookmarkRef(houseId, userId);
  const detail = useBookmarkById(bookmarkId);

  const createMut = useCreateBookmark();
  const updateMut = useUpdateBookmark();
  const deleteMut = useDeleteBookmark();

  const isBookmarked = Boolean(bookmarkId);
  const shareUrl = detail.data?.shareUrl;
  const isPending =
    createMut.isPending || updateMut.isPending || deleteMut.isPending;

  useEffect(() => {
    if (bookmarkId && detail.isSuccess && detail.data === null) clear();
  }, [bookmarkId, detail.isSuccess, detail.data, clear]);

  useEffect(() => {
    setNote(detail.data?.bookmark?.note ?? "");
  }, [detail.data?.bookmark?.note]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setConfirmDelete(false);
  };

  const handleOpen = () => checkAuthAndExecute(() => setIsOpen(true));

  const handleCreate = () => {
    if (!note.trim()) return toast.warning("لطفاً یک یادداشت کوتاه بنویسید.");
    createMut.mutate(
      { houseId, note: note.trim() },
      {
        onSuccess: (data) => {
          if (data?.bookmark?.id) save(data.bookmark.id);
          close();
        },
      },
    );
  };

  const handleUpdate = () => {
    if (!bookmarkId) return;
    if (!note.trim()) return toast.warning("یادداشت نمی‌تواند خالی باشد.");
    updateMut.mutate(
      { id: bookmarkId, houseId, note: note.trim() },
      { onSuccess: close },
    );
  };

  const handleDelete = () => {
    if (!bookmarkId) return;
    deleteMut.mutate(bookmarkId, {
      onSuccess: () => {
        clear();
        setNote("");
        close();
      },
    });
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.info("لینک اشتراک‌گذاری کپی شد.");
    } catch {
      toast.error("کپی لینک انجام نشد.");
    }
  };

  const spinner = (
    <HugeiconsIcon icon={Loading03Icon} size={16} className="animate-spin" />
  );

  return (
    <>
      <ButtonOnlyIcon
        hasIcon={false}
        variant="outline"
        size="sm"
        onClick={handleOpen}
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs sm:items-center sm:p-4"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl dark:bg-[#272727] dark:text-white sm:rounded-[24px] sm:p-6"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-600 sm:hidden" />

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
                onClick={close}
                aria-label="بستن"
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#353535]"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} />
              </button>
            </div>

            <label className="mb-2 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              یادداشت شما برای این اقامتگاه (قابل اشتراک‌گذاری با دوستان)
            </label>
            <textarea
              rows={3}
              value={note}
              maxLength={300}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثلاً: ویلای استخردار عالی برای آخر هفته..."
              className="w-full resize-none rounded-2xl border border-neutral-200 bg-[#F7F7F8] p-3.5 text-sm outline-none transition focus:border-amber-500 dark:border-[#3A3A3A] dark:bg-[#353535]"
            />
            <p className="mt-1 text-left text-[11px] text-neutral-400">
              {note.length}/300
            </p>

            <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {isBookmarked && !confirmDelete && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setConfirmDelete(true)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/20 disabled:opacity-50 dark:text-rose-400 sm:flex-none"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                    حذف
                  </button>
                )}

                {isBookmarked && confirmDelete && (
                  <div className="flex flex-1 items-center gap-2 sm:flex-none">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={handleDelete}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-rose-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700 disabled:opacity-50"
                    >
                      {deleteMut.isPending && spinner}
                      مطمئنم، حذف شود
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="rounded-full bg-neutral-100 px-4 py-2.5 text-xs font-medium dark:bg-[#353535]"
                    >
                      انصراف
                    </button>
                  </div>
                )}

                {isBookmarked && shareUrl && !confirmDelete && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-2.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-[#353535] dark:text-neutral-200 sm:flex-none"
                  >
                    <HugeiconsIcon icon={Share08Icon} size={16} />
                    کپی لینک
                  </button>
                )}
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={isBookmarked ? handleUpdate : handleCreate}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-50 sm:w-auto"
              >
                {(createMut.isPending || updateMut.isPending) && spinner}
                <span>{isBookmarked ? "ویرایش یادداشت" : "ثبت نشان‌شده"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}