"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { logoutAction } from "@/app/actions/auth/auth.actions";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["LogoutUser"],
    mutationFn: logoutAction,
    onSuccess: () => {
      queryClient.clear();
      toast.success("با موفقیت از حساب کاربری خارج شدید.");
      router.replace("/auth/login");
      router.refresh();
    },
    onError: () => {
      toast.error("مشکلی در خروج پیش آمد، لطفا مجدد تلاش کنید.");
    },
  });

  return { mutate, isPending };
};
