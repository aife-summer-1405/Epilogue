"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Edit02Icon,
  Delete02Icon,
  Share08Icon,
  Loading03Icon,
  Location01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";

import { checkAuthAndExecute } from "@/utils/authGuard";
import { useBookmarkById, useDeleteBookmark, useUpdateBookmark } from "@/hooks/mutations/useSocialBookmark";


interface Props {
  bookmarkId: string;
  basePath: string; 
}

export default function BookmarkDetail({ bookmarkId, basePath }: Props) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useBookmarkById(bookmarkId);
  const updateMut = useUpdateBookmark();
  const deleteMut = useDeleteBookmark();

  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const bookmark = data?.bookmark;
  const house = bookmark?.house;

  useEffect(() => {
    setNote(bookmark?.note ?? "");
  }, [bookmark?.note]);

  if (isLoading) {
    return (
      <div dir="rtl" className="mx-auto max-w-3xl animate-pulse space-y-4 p-4">
        <div className="h-56 rounded-3xl bg-neutral-200 dark:bg-[#353535] sm:h-72" />
        <div className="h-24 rounded-3xl bg-neutral-200 dark:bg-[#353535]" />
      </div>
    );
  }

  if (isError || !bookmark) {
    return (
      <div
        dir="rtl"
        className="mx-auto max-w-3xl p-8 text-center text-sm text-neutral-500"
      >
        {isError ? (error as Error).message : "این نشان‌شده پیدا نشد."}
        <div className="mt-4">
          <Link href={basePath} className="text-amber-600">
            بازگشت
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!note.trim()) return toast.warning("یادداشت نمی‌تواند خالی باشد.");
    checkAuthAndExecute(() =>
      updateMut.mutate(
        { id: bookmark.id, houseId: bookmark.houseId, note: note.trim() },
        { onSuccess: () => setEditing(false) },
      ),
    );
  };

  const handleDelete = () =>
    checkAuthAndExecute(() =>
      deleteMut.mutate(bookmark.id, {
        onSuccess: () => router.push(basePath),
      }),
    );

  const handleCopy = async () => {
    if (!data?.shareUrl) return;
    try {
      await navigator.clipboard.writeText(data.shareUrl);
      toast.info("لینک اشتراک‌گذاری کپی شد.");
    } catch {
      toast.error("کپی لینک انجام نشد.");
    }
  };

  const specs = [
    { label: "اتاق", value: house?.rooms },
    { label: "سرویس", value: house?.bathrooms },
    { label: "ظرفیت", value: house?.capacity },
    { label: "پارکینگ", value: house?.parking },
  ].filter((s) => s.value != null);

  return (
    <main
      dir="rtl"
      className="mx-auto w-full max-w-3xl space-y-4 p-4 sm:space-y-5 sm:p-6"
    >
      {house && (
        <Link
          href={`/properties/${house.id}`}
          className="group block overflow-hidden rounded-3xl border border-neutral-200 bg-white transition hover:shadow-lg dark:border-[#3A3A3A] dark:bg-[#272727]"
        >
          <div className="grid gap-0 sm:grid-cols-[1.1fr_1fr]">
            <div className="relative aspect-[4/3] bg-neutral-100 sm:aspect-auto sm:min-h-64">
              {house.photos?.[0] && (
                <Image
                  src={house.photos[0]}
                  alt={house.title}
                  fill
                  sizes="(min-width: 640px) 400px, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              )}
              {house.rate && (
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                  <HugeiconsIcon icon={StarIcon} size={14} />
                  {Number(house.rate).toLocaleString("fa-IR")}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 p-4 sm:p-5">
              <h1 className="text-base font-bold leading-7 sm:text-lg">
                {house.title}
              </h1>
              <p className="flex items-start gap-1 text-xs text-neutral-500 sm:text-sm">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={16}
                  className="mt-0.5 shrink-0"
                />
                {house.address}
              </p>

              {specs.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {specs.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl bg-neutral-50 py-2 text-center dark:bg-[#353535]"
                    >
                      <div className="text-sm font-bold">
                        {Number(s.value).toLocaleString("fa-IR")}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!!house.tags?.length && (
                <div className="flex flex-wrap gap-1.5">
                  {house.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {house.price && (
                <p className="mt-auto text-sm">
                  <span className="text-lg font-bold">
                    {Number(house.price).toLocaleString("fa-IR")}
                  </span>{" "}
                  <span className="text-neutral-500">تومان / شب</span>
                </p>
              )}
            </div>
          </div>
        </Link>
      )}

      <section className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">یادداشت شما</h2>
          {!editing && (
            <button
              type="button"
              onClick={() => checkAuthAndExecute(() => setEditing(true))}
              className="flex items-center gap-1 text-xs font-medium text-amber-600"
            >
              <HugeiconsIcon icon={Edit02Icon} size={16} />
              ویرایش
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <textarea
              rows={3}
              maxLength={300}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full resize-none rounded-2xl border border-neutral-200 bg-white p-3.5 text-sm outline-none focus:border-amber-500 dark:border-[#3A3A3A] dark:bg-[#353535]"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={updateMut.isPending}
                onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50 sm:flex-none"
              >
                {updateMut.isPending && (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={16}
                    className="animate-spin"
                  />
                )}
                ذخیره
              </button>
              <button
                type="button"
                onClick={() => {
                  setNote(bookmark.note);
                  setEditing(false);
                }}
                className="rounded-full bg-neutral-100 px-5 py-2.5 text-xs font-medium dark:bg-[#353535]"
              >
                انصراف
              </button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-7">
            {bookmark.note}
          </p>
        )}
      </section>

      <div className="flex flex-col gap-2 sm:flex-row">
        {data?.shareUrl && (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-full bg-neutral-100 px-5 py-3 text-xs font-medium hover:bg-neutral-200 dark:bg-[#353535] sm:flex-1"
          >
            <HugeiconsIcon icon={Share08Icon} size={16} />
            کپی لینک اشتراک‌گذاری
          </button>
        )}

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex items-center justify-center gap-2 rounded-full bg-rose-500/10 px-5 py-3 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400 sm:flex-1"
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            حذف از نشان‌شده‌ها
          </button>
        ) : (
          <div className="flex gap-2 sm:flex-1">
            <button
              type="button"
              disabled={deleteMut.isPending}
              onClick={handleDelete}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {deleteMut.isPending && (
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={16}
                  className="animate-spin"
                />
              )}
              مطمئنم، حذف شود
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-full bg-neutral-100 px-5 py-3 text-xs font-medium dark:bg-[#353535]"
            >
              انصراف
            </button>
          </div>
        )}
      </div>
    </main>
  );
}