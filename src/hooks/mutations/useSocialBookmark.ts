"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  getSocialBookmarkByIdAction,
  createSocialBookmarkAction,
  updateSocialBookmarkAction,
  deleteSocialBookmarkAction,
} from "@/app/actions/bookmark.actions";
import type {
  CreateBookmarkPayload,
  UpdateBookmarkPayload,
} from "@/core/types/bookmark";

const detailKey = (id: number | string) => ["social-bookmark", String(id)];

export function useBookmarkById(id?: number | string | null) {
  return useQuery({
    queryKey: detailKey(id ?? "none"),
    enabled: Boolean(id),
    retry: false,
    queryFn: async () => {
      const r = await getSocialBookmarkByIdAction(id as string | number);
      if (!r.success) throw new Error(r.message);
      return r.data; 
    },
  });
}

export function useCreateBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBookmarkPayload) => {
      const r = await createSocialBookmarkAction(payload);
      if (!r.success) throw new Error(r.message);
      return r.data;
    },
    onSuccess: (data) => {
      toast.success("اقامتگاه با یادداشت شما ذخیره شد");
      const id = data?.bookmark?.id;
      if (id) qc.setQueryData(detailKey(id), data);
    },
    onError: (e: Error) => toast.error(e.message || "خطا در ثبت نشان‌شده"),
  });
}

export function useUpdateBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateBookmarkPayload) => {
      const r = await updateSocialBookmarkAction(payload);
      if (!r.success) throw new Error(r.message);
      return r.data;
    },
    onSuccess: (_d, vars) => {
      toast.success("یادداشت با موفقیت ویرایش شد");
      qc.invalidateQueries({ queryKey: detailKey(vars.id) });
    },
    onError: (e: Error) => toast.error(e.message || "خطا در ویرایش نشان‌شده"),
  });
}

export function useDeleteBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      const r = await deleteSocialBookmarkAction(id);
      if (!r.success) throw new Error(r.message);
      return r.data;
    },
    onSuccess: (_d, id) => {
      toast.success("از لیست نشان‌شده‌ها حذف شد");
      qc.removeQueries({ queryKey: detailKey(id) });
    },
    onError: (e: Error) => toast.error(e.message || "خطا در حذف نشان‌شده"),
  });
}

const storageKey = (userId: string, houseId: number | string) =>
  `bookmark_user_${userId}_house_${houseId}`;

export function useHouseBookmarkRef(
  houseId: number | string,
  userId: string | null,
) {
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setBookmarkId(null);
      return;
    }
    try {
      setBookmarkId(localStorage.getItem(storageKey(userId, houseId)));
    } catch {
      setBookmarkId(null);
    }
  }, [houseId, userId]);

  const save = useCallback(
    (id: number | string) => {
      if (!userId) return;
      try {
        localStorage.setItem(storageKey(userId, houseId), String(id));
      } catch {}
      setBookmarkId(String(id));
    },
    [houseId, userId],
  );

  const clear = useCallback(() => {
    if (userId) {
      try {
        localStorage.removeItem(storageKey(userId, houseId));
      } catch {}
    }
    setBookmarkId(null);
  }, [houseId, userId]);

  return { bookmarkId, save, clear };
}