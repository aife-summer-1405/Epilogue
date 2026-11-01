"use client";

import EmailStep from "./email/EmailStep";
import CredentialsStep from "./email/CredentialsStep";
import OtpStep from "./email/OtpStep";
import { useSignUpStore } from "@/store/auth.store";
import { useEffect } from "react";
import PhoneStep from "./phoneNumber/PhoneStep";
import OtpStepPhone from "./phoneNumber/OtpStepPhone";
import CredentialsStepPhone from "./phoneNumber/CredentialsStepPhone";

const SignUpForm = () => {
  const { step, type } = useSignUpStore((state) => state.signUpValues);
  const { resetValues } = useSignUpStore((state) => state.actions);

  useEffect(() => {
    return () => resetValues();
  }, [resetValues]);

  if (step === 1 && type === "email") {
    return <EmailStep />;
  } else if (step === 1 && type === "phoneNumber") {
    return <PhoneStep />;
  }

  if (step === 2 && type === "email") {
    return <OtpStep />;
  } else if (step === 2 && type === "phoneNumber") {
    return <OtpStepPhone />;
  }

  if (step === 3 && type === "email") {
    return <CredentialsStep />;
  } else if (step === 3 && type === "phoneNumber") {
    return <CredentialsStepPhone />;
  }
};

export default SignUpForm;
