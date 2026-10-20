import { forgetPassEmailAction } from "@/app/actions/auth/auth.actions";
import { useForgetPassStore } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useForgetPassEmail = () => {
  const { addInfo } = useForgetPassStore((state) => state.actions);

  const { mutate, isPending } = useMutation({
    mutationKey: ["ForgetPassEmail"],
    mutationFn: forgetPassEmailAction,
    onSuccess: (result, variable) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("کد تایید برای ایمیل شما ارسال شد.");
      addInfo({ step: 2, email: variable.email });
    },
    onError: () => {
      toast.error("مشکلی در ارسال کد تایید پیش آمد مجدد تلاش کنید.");
    },
  });

  return { mutate, isPending };
};
