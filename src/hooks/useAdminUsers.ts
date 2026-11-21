"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deleteAdminUserAction,
  getAdminUserByIdAction,
  getAdminUsersAction,
  updateAdminUserAction,
  updateAdminUserRoleAction,
} from "@/app/actions/admin/users.action";
import type {
  UpdateAdminUserPayload,
  UpdateAdminUserRolePayload,
} from "@/core/types/userManagement.types";

import type { GetAdminUsersParams } from "@/app/actions/admin/users.action";

export const adminUsersKeys = {
  all: ["admin", "users"] as const,
  list: (params?: GetAdminUsersParams) =>
    [...adminUsersKeys.all, "list", params] as const,
  detail: (userId: string) =>
    [...adminUsersKeys.all, "detail", userId] as const,
};

export function useAdminUsersQuery(params?: GetAdminUsersParams) {
  return useQuery({
    queryKey: adminUsersKeys.list(params),
    queryFn: async () => {
      const res = await getAdminUsersAction(params);
      if (!res.success || !res.data) {
        throw new Error(res.message || "خطا در دریافت لیست کاربران");
      }
      return res.data;
    },
  });
}

export function useAdminUserDetailQuery(userId: string) {
  return useQuery({
    queryKey: adminUsersKeys.detail(userId),
    queryFn: async () => {
      const res = await getAdminUserByIdAction(userId);
      if (!res.success || !res.data) {
        throw new Error(res.message || "خطا در دریافت اطلاعات کاربر");
      }
      return res.data;
    },
    enabled: Boolean(userId),
  });
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["UpdatingUserRole"],
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: UpdateAdminUserRolePayload["role"];
    }) => {
      const res = await updateAdminUserRoleAction(userId, { role });
      if (!res.success) {
        throw new Error(res.message || "خطا در تغییر نقش کاربر");
      }
      return res;
    },
    onMutate: (variables) => {
      toast.loading("درحال تغییر نقش کاربر", {
        toastId: `UpdatingUserRole-${variables.userId}`,
      });
    },
    onSuccess: (_, variables) => {
      toast.update(`UpdatingUserRole-${variables.userId}`, {
        type: "success",
        render: "نقش کاربر با موفقیت تغییر کرد",
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminUsersKeys.detail(variables.userId),
      });
    },
    onError: (_, variables) => {
      toast.update(`UpdatingUserRole-${variables.userId}`, {
        type: "error",
        render: "تغییر نقش کاربر با خطا روبرو شد",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["UpdatingAdminUser"],
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateAdminUserPayload;
    }) => {
      const res = await updateAdminUserAction(userId, payload);
      if (!res.success) {
        throw new Error(res.message || "خطا در ویرایش کاربر");
      }
      return res;
    },
    onMutate: (variables) => {
      toast.loading("درحال ویرایش اطلاعات کاربر", {
        toastId: `UpdatingAdminUser-${variables.userId}`,
      });
    },
    onSuccess: (_, variables) => {
      toast.update(`UpdatingAdminUser-${variables.userId}`, {
        type: "success",
        render: "اطلاعات کاربر با موفقیت ویرایش شد",
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminUsersKeys.detail(variables.userId),
      });
    },
    onError: (_, variables) => {
      toast.update(`UpdatingAdminUser-${variables.userId}`, {
        type: "error",
        render: "ویرایش اطلاعات کاربر با خطا روبرو شد",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["DeletingAdminUser"],
    mutationFn: async (userId: string) => {
      const res = await deleteAdminUserAction(userId);
      if (!res.success) {
        throw new Error(res.message || "خطا در حذف کاربر");
      }
      return res;
    },
    onMutate: (userId) => {
      toast.loading("درحال حذف حساب کاربری", {
        toastId: `DeletingAdminUser-${userId}`,
      });
    },
    onSuccess: (_, userId) => {
      toast.update(`DeletingAdminUser-${userId}`, {
        type: "success",
        render: "حساب کاربری با موفقیت حذف شد",
        isLoading: false,
        autoClose: 3000,
      });
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.all });
    },
    onError: (_, userId) => {
      toast.update(`DeletingAdminUser-${userId}`, {
        type: "error",
        render: "حذف حساب کاربری با خطا روبرو شد",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
}
