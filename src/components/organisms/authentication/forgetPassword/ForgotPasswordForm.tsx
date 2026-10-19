"use client";

import { useEffect } from "react";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";
import NewPasswordStep from "./NewPasswordStep";
import { useForgetPassStore } from "@/store/auth.store";

const ForgotPasswordForm = () => {
  const { step } = useForgetPassStore((state) => state.forgetPassValues);
  const { resetValues } = useForgetPassStore((state) => state.actions);

  useEffect(() => {
    return () => resetValues();
  }, [resetValues]);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h5 className="text-default-text text-2xl leading-7.5 font-semibold">
        فراموشی رمز عبور
      </h5>

      {step === 1 && <EmailStep />}

      {step === 2 && <OtpStep />}

      {step === 3 && <NewPasswordStep />}
    </div>
  );
};

export default ForgotPasswordForm;
