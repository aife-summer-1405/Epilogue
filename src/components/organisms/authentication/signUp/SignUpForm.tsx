"use client";

import EmailStep from "./EmailStep";
import CredentialsStep from "./CredentialsStep";
import OtpStep from "./OtpStep";
import { useSignUpStore } from "@/store/auth.store";
import { useEffect } from "react";

const SignUpForm = () => {
  const { step } = useSignUpStore((state) => state.signUpValues);
  const { resetValues } = useSignUpStore((state) => state.actions);

  useEffect(() => {
    return () => resetValues();
  }, [resetValues]);

  if (step === 1) {
    return <EmailStep />;
  }

  if (step === 2) {
    return <OtpStep />;
  }

  return <CredentialsStep />;
};

export default SignUpForm;
