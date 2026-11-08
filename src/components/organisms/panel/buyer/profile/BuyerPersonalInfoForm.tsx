"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Camera01Icon } from "@hugeicons/core-free-icons";
import { toast } from "react-toastify";

import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import Button from "@/components/atoms/button/Button";
import {
  personalInfoSchema,
  PersonalInfoFormValues,
} from "@/lib/validations/panel/buyerProfile.schema";
import { IBuyerUser } from "@/core/types/buyerProfile/buyerProfile.types";
import {
  useUpdateBuyerProfile,
  useUploadBuyerPicture,
} from "@/hooks/mutations/panel/buyer/useBuyerProfileMutations";

interface BuyerPersonalInfoFormProps {
  user?: IBuyerUser;
}

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";

const BuyerPersonalInfoForm: React.FC<BuyerPersonalInfoFormProps> = ({ user }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateBuyerProfile(user?.id);
  const { mutateAsync: uploadPicture, isPending: isUploading } =
    useUploadBuyerPicture();

  const { control, handleSubmit, reset } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
      });
      setPreviewAvatar(user.profilePicture);
    }
  }, [user, reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewAvatar(localUrl);

    const formData = newRetriesFormData(file);
    const result = await uploadPicture(formData);

    if (result.success) {
      toast.success("تصویر پروفایل با موفقیت بروزرسانی شد");
    } else {
      toast.error(result.message || "خطا در آپلود تصویر");
    }
  };

  const newRetriesFormData = (file: File) => {
    const fd = new FormData();
    fd.append("picture", file);
    return fd;
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: PersonalInfoFormValues) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      fullName: `${values.firstName} ${values.lastName}`.trim(),
      phoneNumber: values.phoneNumber,
      email: values.email,
    };

    const result = await updateProfile(payload);
    if (result.success) {
      toast.success("اطلاعات کاربری با موفقیت بروزرسانی شد");
    } else {
      toast.error(result.message || "خطا در ثبت تغییرات");
    }
  };

  const panelInputOverride =
    "[&_label]:!text-sm [&_label]:!font-bold [&_label]:!text-gray-800 dark:[&_label]:!text-gray-100 [&_div.border]:!rounded-2xl [&_div.border]:!border-gray-200 dark:[&_div.border]:!border-zinc-700 [&_div.border]:!bg-white dark:[&_div.border]:!bg-[#1e1e1e] [&_div.border]:!h-[52px] [&_div.border]:!px-4 [&_input]:!text-sm [&_input]:!text-gray-800 dark:[&_input]:!text-gray-100 [&_input]:placeholder:!text-gray-400";

  return (
    <div className="flex w-full flex-col items-center" dir="rtl">
      <div className="my-6 flex flex-col items-center justify-center">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-36 w-36 cursor-pointer overflow-hidden rounded-full border-4 border-white shadow-md md:h-40 md:w-40 dark:border-zinc-700"
        >
          <Image
            src={previewAvatar || DEFAULT_AVATAR}
            alt={user?.fullName || "تصویر کاربر"}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/35">
            {previewAvatar ? (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                title="حذف تصویر"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-md transition-transform hover:scale-110"
              >
                <HugeiconsIcon icon={Delete02Icon} size={20} strokeWidth={1.8} />
              </button>
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-md">
                <HugeiconsIcon icon={Camera01Icon} size={20} strokeWidth={1.8} />
              </span>
            )}
          </div>

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-bold text-white">
              در حال آپلود...
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex w-full flex-col gap-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className={panelInputOverride}>
            <TextInput
              name="firstName"
              title="نام"
              placeholder="نام خود را وارد کنید"
              control={control}
              variableName="fullMd"
            />
          </div>

          <div className={panelInputOverride}>
            <TextInput
              name="lastName"
              title="نام خانوادگی"
              placeholder="نام خانوادگی خود را وارد کنید"
              control={control}
              variableName="fullMd"
            />
          </div>

          <div className={panelInputOverride}>
            <TextInput
              name="phoneNumber"
              title="شماره تماس"
              placeholder="شماره تماس خود را وارد کنید"
              control={control}
              variableName="fullMd"
            />
          </div>

          <div className={`${panelInputOverride} [&_input]:text-left [&_input]:dir-ltr`}>
            <TextInput
              name="email"
              title="ایمیل"
              type="email"
              placeholder="example@gmail.com"
              control={control}
              variableName="fullMd"
              dir="ltr"
            />
          </div>
        </div>

        <div className="mt-2 flex justify-start">
          <Button
            type="submit"
            variant="primary"
            size="md"
            hasIcon={false}
            disabled={isUpdating}
            className="h-12 min-w-35 rounded-2xl bg-[#0f2d59] px-7 text-sm font-bold text-white hover:bg-[#1e3a8a] disabled:opacity-60"
          >
            {isUpdating ? "در حال ثبت..." : "اعمال تغییرات"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BuyerPersonalInfoForm;