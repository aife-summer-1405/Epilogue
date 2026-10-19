import { forgetPassEmailUser } from "@/services/auth.service";
import { useForgetPassStore } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const useForgetPassEmail = () => {
  const { addInfo } = useForgetPassStore((state) => state.actions);
  const { mutate, isPending } = useMutation({
    mutationKey: ["ForgetPassEmail"],
    mutationFn: forgetPassEmailUser,
    onSuccess: (_, variable) => {
      toast.success("کد تایید برای ایمیل شما ارسال شد.");
      addInfo({ step: 2, email: variable?.email });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.status === 404) {
          toast.error("حساب کاربری یافت نشد.");
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
