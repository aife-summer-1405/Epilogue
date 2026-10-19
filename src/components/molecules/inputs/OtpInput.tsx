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
  invalid?: boolean;
}

const slotClass =
  "bg-neutral-100 rounded-[12px]! w-11 h-12.5 border-2 border-neutral-600 first:border-l-2 " +
  "transition text-neutral-800! text-[18px]! " +
  "data-[active=true]:border-primary-500 data-[active=true]:ring-0! " +
  "aria-invalid:border-danger-500 aria-invalid:text-danger-500";

const OtpInput: FC<IProps> = ({ value, setValue, invalid }) => {
  return (
    <InputOTP
      id="otp-input"
      maxLength={6}
      value={value}
      containerClassName="flex gap-2"
      onChange={setValue}
      pattern={REGEXP_ONLY_DIGITS}
    >
      <InputOTPGroup className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <InputOTPSlot
            key={i}
            index={i}
            aria-invalid={invalid}
            className={slotClass}
          />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator className="text-neutral-700" />
      <InputOTPGroup className="flex gap-1">
        {[3, 4, 5].map((i) => (
          <InputOTPSlot
            key={i}
            index={i}
            aria-invalid={invalid}
            className={slotClass}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};

export default OtpInput;
