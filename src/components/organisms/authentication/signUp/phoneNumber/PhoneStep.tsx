import Button from "@/components/atoms/button/Button";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import { SignUpPhoneValues } from "@/core/types/auth.types";
import { useSignUpPhone } from "@/hooks/mutations/useSignUpPhone";
import { signUpPhoneSchema } from "@/lib/validations/authentication/auth";
import { useSignUpStore } from "@/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { SmartPhone01Icon } from "@hugeicons/core-free-icons";
import { useForm } from "react-hook-form";

const PhoneStep = () => {
  const { addInfo } = useSignUpStore((s) => s.actions);
  const { control, handleSubmit } = useForm<SignUpPhoneValues>({
    resolver: zodResolver(signUpPhoneSchema),
    defaultValues: { phoneNumber: "" },
  });
  const { mutate, isPending } = useSignUpPhone();
  const onSubmit = (data: SignUpPhoneValues) => {
    mutate(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <TextInput<SignUpPhoneValues>
        control={control}
        name="phoneNumber"
        type="text"
        inputMode="numeric"
        variableName="fullSm"
        icons={SmartPhone01Icon}
        placeholder="شماره موبایل خود را وارد کنید"
        description={
          <div
            className="cursor-pointer"
            onClick={() => addInfo({ type: "email" })}
          >
            ثبت نام با ایمیل
          </div>
        }
      />
      <Button disabled={isPending} type="submit" variant="primary" size="lg">
        {isPending ? "در حال ارسال درخواست" : "ارسال کد تایید"}
      </Button>
    </form>
  );
};

export default PhoneStep;
