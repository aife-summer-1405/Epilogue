import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "@/components/atoms/button/Button";
import OtpInput from "@/components/molecules/inputs/OtpInput";
import BackButton from "../shared/BackButton";
import { useCountdown } from "@/hooks/useCountDown";
import { useSignUpStore } from "@/store/auth.store";
import { useSignUpEmail } from "@/hooks/mutations/useSignUpEmail";
import { signUpOtpSchema } from "@/lib/validations/authentication/auth";
import { signUpVerifyEmailAction } from "@/app/actions/auth/auth.actions";

const OtpStep = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { left, label, reset } = useCountdown(90);

  const { tempId, email } = useSignUpStore((s) => s.signUpValues);
  const { addInfo, resetValues } = useSignUpStore((s) => s.actions);

  const { mutate, isPending } = useMutation({
    mutationKey: ["VerifyEmail"],
    mutationFn: signUpVerifyEmailAction,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("ایمیل شما با موفقیت تایید شد.");
      addInfo({ step: 3 });
    },
    onError: () => {
      toast.error("مشکلی در تایید کد پیش آمد، لطفا مجدد تلاش کنید.");
    },
  });

  const { mutate: resetVerifyCode, isPending: resetPending } = useSignUpEmail();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = signUpOtpSchema.safeParse({ otp });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    mutate({ tempUserId: tempId, verificationCode: result.data.otp });
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
          setValue={(v) => {
            setOtp(v);
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
