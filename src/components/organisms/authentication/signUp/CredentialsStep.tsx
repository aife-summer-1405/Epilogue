import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LockKeyIcon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import BackButton from "../shared/BackButton";
import {
  signUpCredentialsSchema,
  type SignUpCredentialsValues,
} from "@/lib/validations/authentication/auth";
import { useSignUpStore } from "@/store/auth.store";
import { completeRegistrationUser } from "@/services/auth.service";

const CredentialsStep = () => {
  const router = useRouter();
  const userId = useSignUpStore((s) => s.signUpValues.tempId);
  const { addInfo, resetValues } = useSignUpStore((s) => s.actions);

  const { control, handleSubmit } = useForm<SignUpCredentialsValues>({
    resolver: zodResolver(signUpCredentialsSchema),
    defaultValues: { phone: "", password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["CompleteRegistration"],
    mutationFn: completeRegistrationUser,
    onSuccess: () => {
      toast.success("حساب کاربری شما با موفقیت ساخته شد.");
      resetValues();
      router.replace("/auth/login");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.status === 400) {
          toast.error("لطفا مراحل ثبت نام را از ابتدا طی کنید.");
          resetValues();
        } else if (error.status === 404) {
          toast.error("کاربر یافت نشد.");
        } else {
          toast.error("مشکلی در ثبت اطلاعات شما پیش آمد مجدد تلاش کنید.");
        }
      } else {
        toast.error("مشکلی در ثبت اطلاعات شما پیش آمد مجدد تلاش کنید.");
      }
    },
  });

  const onSubmit = (values: SignUpCredentialsValues) => {
    if (!userId) {
      toast.error("نشست شما منقضی شده، دوباره ثبت نام کنید.");
      return;
    }
    mutate({ userId, password: values.password, phoneNumber: values.phone });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <TextInput<SignUpCredentialsValues>
        control={control}
        name="phone"
        type="text"
        inputMode="numeric"
        variableName="fullSm"
        icons={SmartPhone01Icon}
        placeholder="شماره تماس خود را وارد کنید"
      />
      <TextInput<SignUpCredentialsValues>
        control={control}
        name="password"
        type="password"
        variableName="fullSm"
        icons={LockKeyIcon}
        placeholder="رمز عبور خود را وارد کنید"
      />
      <TextInput<SignUpCredentialsValues>
        control={control}
        name="confirmPassword"
        type="password"
        variableName="fullSm"
        icons={LockKeyIcon}
        placeholder="تکرار رمز عبور"
      />

      <Button type="submit" variant="primary" size="lg" disabled={isPending}>
        {isPending ? "در حال ساخت حساب..." : "ساخت حساب کاربری"}
      </Button>

      <BackButton onClick={() => addInfo({ step: 2 })} />
    </form>
  );
};

export default CredentialsStep;
