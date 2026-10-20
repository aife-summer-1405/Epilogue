import { signUpEmailAction } from "@/app/actions/auth/auth.actions";
import { useSignUpStore } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useSignUpEmail = () => {
  const { addInfo } = useSignUpStore((state) => state.actions);

  const { mutate, isPending } = useMutation({
    mutationKey: ["RegisterEmailStep"],
    mutationFn: signUpEmailAction,
    onSuccess: (result, variable) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("کد تایید برای ایمیل شما ارسال شد.");
      addInfo({ tempId: result.tempUserId, step: 2, email: variable.email });
    },
    onError: () => {
      toast.error("مشکلی در ارسال کد تایید پیش آمد مجدد تلاش کنید.");
    },
  });

  return { mutate, isPending };
};
