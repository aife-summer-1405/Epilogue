"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { FC } from "react";

interface IProps {
  value: string;
  setValue: (value: string) => void;
}

const OtpInput: FC<IProps> = ({ value, setValue }) => {
  return (
    <InputOTP
      id="otp-input"
      maxLength={6}
      value={value}
      containerClassName="flex gap-2"
      onChange={(value) => setValue(value)}
      pattern={REGEXP_ONLY_DIGITS}
    >
      <InputOTPGroup className={`flex gap-1`}>
        <InputOTPSlot
          className={`bg-neutral-50 rounded-[12px]! w-11 h-12.5 border-2 border-neutral-100 data-[active=true]:border-primary-500 transition data-[active=true]:ring-0! aria-invalid:text-danger-500 text-neutral-800! text-[18px]!`}
          index={0}
        />
        <InputOTPSlot
          className={`bg-neutral-50 rounded-[12px]! w-11 h-12.5 border-2 border-neutral-100 data-[active=true]:border-primary-500 transition data-[active=true]:ring-0! aria-invalid:text-danger-500 text-neutral-800! text-[18px]!`}
          index={1}
        />
        <InputOTPSlot
          className={`bg-neutral-50 rounded-[12px]! w-11 h-12.5 border-2 border-neutral-100 data-[active=true]:border-primary-500 transition data-[active=true]:ring-0! aria-invalid:text-danger-500 text-neutral-800! text-[18px]!`}
          index={2}
        />
      </InputOTPGroup>
      <InputOTPSeparator className="text-neutral-300" />
      <InputOTPGroup className={`flex gap-1`}>
        <InputOTPSlot
          className={`bg-neutral-50 rounded-[12px]! w-11 h-12.5 border-2 border-neutral-100 data-[active=true]:border-primary-500 transition data-[active=true]:ring-0! aria-invalid:text-danger-500 text-neutral-800! text-[18px]!`}
          index={3}
        />
        <InputOTPSlot
          className={`bg-neutral-50 rounded-[12px]! w-11 h-12.5 border-2 border-neutral-100 data-[active=true]:border-primary-500 transition data-[active=true]:ring-0! aria-invalid:text-danger-500 text-neutral-800! text-[18px]!`}
          index={4}
        />
        <InputOTPSlot
          className={`bg-neutral-50 rounded-[12px]! w-11 h-12.5 border-2 border-neutral-100 data-[active=true]:border-primary-500 transition data-[active=true]:ring-0! aria-invalid:text-danger-500 text-neutral-800! text-[18px]!`}
          index={5}
        />
      </InputOTPGroup>
    </InputOTP>
  );
};

export default OtpInput;
