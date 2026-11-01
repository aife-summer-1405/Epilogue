import { signUpPhoneAction } from "@/app/actions/auth/auth.actions";
import { useSignUpStore } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useSignUpPhone = () => {
  const { addInfo } = useSignUpStore((state) => state.actions);

  const { mutate, isPending } = useMutation({
    mutationKey: ["RegisterPhoneStep"],
    mutationFn: signUpPhoneAction,
    onSuccess: (result, variable) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("کد تایید برای شماره موبایل شما ارسال شد.");
      addInfo({
        tempId: result.tempUserId,
        step: 2,
        phoneNumber: variable.phoneNumber,
      });
    },
    onError: () => {
      toast.error("مشکلی در ارسال کد تایید پیش آمد مجدد تلاش کنید.");
    },
  });

  return { mutate, isPending };
};
