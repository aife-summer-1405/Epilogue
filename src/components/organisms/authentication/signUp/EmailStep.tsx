import Button from "@/components/atoms/button/Button";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import { useSignUpEmail } from "@/hooks/mutations/useSignUpEmail";
import {
  signUpEmailSchema,
  SignUpEmailValues,
} from "@/lib/validations/authentication/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { useForm } from "react-hook-form";

const EmailStep = () => {
  const { control, handleSubmit } = useForm<SignUpEmailValues>({
    resolver: zodResolver(signUpEmailSchema),
    defaultValues: { email: "" },
  });
  const { mutate, isPending } = useSignUpEmail();
  const onSubmit = (data: SignUpEmailValues) => {
    mutate(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <TextInput<SignUpEmailValues>
        control={control}
        name="email"
        type="text"
        variableName="fullSm"
        icons={Mail01Icon}
        placeholder="ایمیل خود را وارد کنید"
      />
      <Button disabled={isPending} type="submit" variant="primary" size="lg">
        {isPending ? "در حال ارسال درخواست" : "ارسال کد تایید"}
      </Button>
    </form>
  );
};

export default EmailStep;
