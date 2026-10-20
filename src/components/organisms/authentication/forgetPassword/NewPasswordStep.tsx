import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LockKeyIcon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import BackButton from "../shared/BackButton";
import {
  newPasswordSchema,
  type NewPasswordValues,
} from "@/lib/validations/authentication/auth";
import { resetPasswordUser } from "@/services/auth.service";
import { useForgetPassStore } from "@/store/auth.store";
import { resetPasswordAction } from "@/app/actions/auth/auth.actions";

const NewPasswordStep = () => {
  const router = useRouter();
  const { email, code } = useForgetPassStore((state) => state.forgetPassValues);
  const { addInfo, resetValues } = useForgetPassStore((state) => state.actions);

  const { control, handleSubmit } = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["ResetPassword"],
    mutationFn: resetPasswordAction,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        if (result.resetFlow) resetValues();
        return;
      }
      toast.success("رمز عبور با موفقیت تغییر کرد.");
      resetValues();
      router.replace("/auth/login");
    },
    onError: () => {
      toast.error("مشکلی در تغییر رمزعبور پیش آمد لطفا مجدد تلاش کنید.");
    },
  });

  const onSubmit = (values: NewPasswordValues) => {
    console.log(email, code);
    if (!email || !code) {
      toast.error("نشست شما منقضی شده، دوباره تلاش کنید.");
      return;
    }
    mutate({ email, code, newPassword: values.password });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <TextInput<NewPasswordValues>
        control={control}
        name="password"
        type="password"
        variableName="fullSm"
        icons={LockKeyIcon}
        placeholder="رمز عبور جدید خود را وارد کنید"
        autoComplete="new-password"
      />
      <TextInput<NewPasswordValues>
        control={control}
        name="confirmPassword"
        type="password"
        variableName="fullSm"
        icons={LockKeyIcon}
        placeholder="تکرار رمز عبور"
        autoComplete="new-password"
      />

      <Button type="submit" variant="primary" size="lg" disabled={isPending}>
        {isPending ? "در حال ثبت..." : "ثبت رمز عبور جدید"}
      </Button>

      <BackButton onClick={() => addInfo({ step: 2 })} />
    </form>
  );
};

export default NewPasswordStep;
