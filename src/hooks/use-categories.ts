"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createCategoryAction,
  deleteCategoryAction,
  getCategoriesAction,
  updateCategoryAction,
} from "@/app/actions/admin/categories.action";
import { CategoryFilters, CategoryMutationPayload } from "@/core/types/category";

export const CATEGORIES_QUERY_KEY = ["categories"];

export function useCategories(filters: CategoryFilters) {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, filters],
    queryFn: () => getCategoriesAction(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryMutationPayload) =>
      createCategoryAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success("دسته‌بندی جدید با موفقیت اضافه شد");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "خطا در افزودن دسته‌بندی"
      );
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CategoryMutationPayload;
    }) => updateCategoryAction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success("دسته‌بندی با موفقیت ویرایش شد");
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "خطا در ویرایش دسته‌بندی"
      );
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategoryAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      toast.success("دسته‌بندی با موفقیت حذف شد");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "خطا در حذف دسته‌بندی");
    },
  });
}