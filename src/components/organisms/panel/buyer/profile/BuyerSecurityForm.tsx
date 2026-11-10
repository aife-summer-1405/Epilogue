"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import Button from "@/components/atoms/button/Button";
import {
  securityInfoSchema,
  SecurityInfoFormValues,
} from "@/lib/validations/panel/buyerProfile.schema";
import { useChangeBuyerPassword } from "@/hooks/mutations/panel/buyer/useBuyerProfileMutations";

const BuyerSecurityForm: React.FC = () => {
  const { mutateAsync: changePassword, isPending } = useChangeBuyerPassword();

  const { control, handleSubmit, reset } = useForm<SecurityInfoFormValues>({
    resolver: zodResolver(securityInfoSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: SecurityInfoFormValues) => {
    const result = await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (result.success) {
      toast.success("رمز عبور شما با موفقیت تغییر یافت");
      reset();
    } else {
      toast.error(result.message || "خطا در تغییر رمز عبور");
    }
  };

  const panelInputOverride =
    "[&_label]:!text-sm [&_label]:!font-bold [&_label]:!text-gray-800 dark:[&_label]:!text-gray-100 [&_div.border]:!rounded-2xl [&_div.border]:!border-gray-200 dark:[&_div.border]:!border-zinc-700 [&_div.border]:!bg-white dark:[&_div.border]:!bg-[#1e1e1e] [&_div.border]:!h-[52px] [&_div.border]:!px-4 [&_input]:!text-sm [&_input]:!text-gray-800 dark:[&_input]:!text-gray-100 [&_input]:placeholder:!text-gray-400";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 flex w-full flex-col gap-6"
      dir="rtl"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className={panelInputOverride}>
          <TextInput
            name="currentPassword"
            title="رمز عبور قبلی"
            type="password"
            placeholder="رمز عبور قبلی را وارد کنید"
            control={control}
            variableName="fullMd"
          />
        </div>

        <div className={panelInputOverride}>
          <TextInput
            name="newPassword"
            title="رمز عبور جدید"
            type="password"
            placeholder="رمز عبور جدید را وارد کنید"
            control={control}
            variableName="fullMd"
          />
        </div>

        <div className={panelInputOverride}>
          <TextInput
            name="confirmNewPassword"
            title="تکرار رمز عبور جدید"
            type="password"
            placeholder="رمز عبور جدید را تکرار کنید"
            control={control}
            variableName="fullMd"
          />
        </div>
      </div>

      <div className="mt-2 flex justify-start">
        <Button
          type="submit"
          variant="primary"
          size="md"
          hasIcon={false}
          disabled={isPending}
          className="h-12 min-w-35 rounded-2xl bg-[#0f2d59] px-7 text-sm font-bold text-white hover:bg-[#1e3a8a] disabled:opacity-60"
        >
          {isPending ? "در حال ثبت..." : "اعمال تغییرات"}
        </Button>
      </div>
    </form>
  );
};

export default BuyerSecurityForm;