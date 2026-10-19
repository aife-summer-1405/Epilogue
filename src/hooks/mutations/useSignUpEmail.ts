import { signUpEmailUser } from "@/services/auth.service";
import { useSignUpStore } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const useSignUpEmail = () => {
  const { addInfo } = useSignUpStore((state) => state.actions);
  const { mutate, isPending } = useMutation({
    mutationKey: ["RegisterEmailStep"],
    mutationFn: signUpEmailUser,
    onSuccess: (data, variable) => {
      toast.success("کد تایید برای ایمیل شما ارسال شد.");
      addInfo({ tempId: data?.tempUserId, step: 2, email: variable?.email });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.status === 400) {
          toast.error("شما قبلا با این ایمیل ثبت نام کرده اید.");
        } else {
          toast.error("مشکلی در ارسال کد تایید پیش آمد مجدد تلاش کنید.");
        }
      } else {
        toast.error("مشکلی در ارسال کد تایید پیش آمد مجدد تلاش کنید.");
      }
    },
  });
  return { mutate, isPending };
};
