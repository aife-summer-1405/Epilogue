import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LockKeyIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/atoms/button/Button";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import BackButton from "../../shared/BackButton";
import { signUpCredentialsSchemaPhone } from "@/lib/validations/authentication/auth";
import { useSignUpStore } from "@/store/auth.store";
import { completeRegistrationAction } from "@/app/actions/auth/auth.actions";
import { SignUpCredentialsValuesPhone } from "@/core/types/auth.types";

const CredentialsStepPhone = () => {
  const router = useRouter();
  const userId = useSignUpStore((s) => s.signUpValues.tempId);
  const { addInfo, resetValues } = useSignUpStore((s) => s.actions);

  const { control, handleSubmit } = useForm<SignUpCredentialsValuesPhone>({
    resolver: zodResolver(signUpCredentialsSchemaPhone),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["CompleteRegistrationPhone"],
    mutationFn: completeRegistrationAction,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        if (result.resetFlow) resetValues();
        return;
      }
      toast.success("حساب کاربری شما با موفقیت ساخته شد.");
      resetValues();
      router.replace("/auth/login");
    },
    onError: () => {
      toast.error("مشکلی در ثبت اطلاعات شما پیش آمد مجدد تلاش کنید.");
    },
  });

  const onSubmit = (values: SignUpCredentialsValuesPhone) => {
    if (!userId) {
      toast.error("لطفا مراحل ثبت نام را از ابتدا طی کنید.");
      return;
    }
    mutate({
      userId,
      password: values.password,
      email: values.email,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <TextInput<SignUpCredentialsValuesPhone>
        control={control}
        name="email"
        type="text"
        variableName="fullSm"
        icons={Mail01Icon}
        placeholder="ایمیل خود را وارد کنید"
      />
      <TextInput<SignUpCredentialsValuesPhone>
        control={control}
        name="password"
        type="password"
        variableName="fullSm"
        icons={LockKeyIcon}
        placeholder="رمز عبور خود را وارد کنید"
      />
      <TextInput<SignUpCredentialsValuesPhone>
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

export default CredentialsStepPhone;
