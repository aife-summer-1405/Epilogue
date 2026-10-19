import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import Button from "@/components/atoms/button/Button";
import OtpInput from "@/components/molecules/inputs/OtpInput";
import BackButton from "../shared/BackButton";
import { useCountdown } from "@/hooks/useCountDown";
import { useForgetPassStore } from "@/store/auth.store";
import { forgetPassVerifyEmailUser } from "@/services/auth.service";
import { useForgetPassEmail } from "@/hooks/mutations/useForgetPassEmail";
import { signUpOtpSchema } from "@/lib/validations/authentication/auth";

const OtpStep = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { left, label, reset } = useCountdown(90);

  const { email } = useForgetPassStore((s) => s.forgetPassValues);
  const { addInfo, resetValues } = useForgetPassStore((s) => s.actions);

  const { mutate, isPending } = useMutation({
    mutationKey: ["VerifyEmailForget"],
    mutationFn: forgetPassVerifyEmailUser,
    onSuccess: (_, variable) => {
      toast.success("ایمیل شما با موفقیت تایید شد.");
      addInfo({ step: 3, code: variable.code });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.status === 400) {
          if (error.response?.data.message === "Invalid reset code") {
            toast.error("کد وارد شده صحیح نمی باشد.");
          } else {
            toast.error("کد تایید شما منقضی شده است لطفا مجدد تلاش کنید.");
          }
        } else if (error.status === 404) {
          toast.error("کاربر یافت نشد.");
        } else {
          toast.error("مشکلی در تایید کد پیش آمد، لطفا مجدد تلاش کنید.");
        }
      } else {
        toast.error("مشکلی در تایید کد پیش آمد، لطفا مجدد تلاش کنید.");
      }
    },
  });

  const { mutate: resetVerifyCode, isPending: resetPending } =
    useForgetPassEmail();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = signUpOtpSchema.safeParse({ otp });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    mutate({ email, code: result.data.otp });
  };

  const handleResend = () => {
    setOtp("");
    resetVerifyCode({ email });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-6 w-full"
    >
      <div dir="ltr">
        <OtpInput
          value={otp}
          setValue={(event) => {
            setOtp(event);
            if (error) setError(null);
          }}
        />
      </div>
      {error && <p className="text-danger-500 text-sm">{error}</p>}

      {left > 0 ? (
        <span className="text-default-text font-semibold text-sm">
          {label} تا ارسال مجدد
        </span>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          className="text-default-text font-semibold text-sm cursor-pointer"
        >
          ارسال مجدد کد
        </button>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isPending || resetPending}
      >
        {isPending || resetPending ? "در حال بررسی..." : "تایید کد"}
      </Button>

      <BackButton
        onClick={() => {
          addInfo({ step: 1 });
          resetValues();
        }}
      />
    </form>
  );
};

export default OtpStep;
