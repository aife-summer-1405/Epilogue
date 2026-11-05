"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";

import { AddHouseFormData } from "@/core/types/addHouse";
import { createHouseAction } from "@/app/actions/addHouse.action";
import TextInput from "@/components/molecules/inputs/textInput/TextInput";
import TextareaInput from "@/components/molecules/inputs/TextareaInput";

const steps = [
  { id: 1, label: "مشخصات اولیه" },
  { id: 2, label: "موقعیت مکانی" },
  { id: 3, label: "امکانات ملک" },
  { id: 4, label: "تصویر ملک" },
  { id: 5, label: "تایید نهایی" },
];

export const AddHouseFormOrganism = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, setIsPending] = useState(false);

  // نگهداری داده‌های مراحل مختلف به صورت تجمیع‌شده
  const [houseData, setHouseData] = useState<Partial<AddHouseFormData>>({
    title: "",
    address: "",
    rate: 0,
    price: 0,
    tags: [],
    capacity: 1,
    location: { lat: 0, lng: 0 },
    categories: { name: "آپارتمانی" },
    bathrooms: 0,
    parking: 0,
    rooms: 0,
    yard_type: "",
    transaction_type: "rental",
    caption: "",
  });

  const { control, handleSubmit, getValues } = useForm<AddHouseFormData>({
    defaultValues: houseData as AddHouseFormData,
  });

  // مدیریت دکمه مرحله بعد یا ثبت نهایی (بدون ارسال درخواست در مراحل میانی)
  const handleNextStep = () => {
    const currentValues = getValues();
    setHouseData((prev) => ({ ...prev, ...currentValues }));

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // ثبت نهایی اطلاعات و ارسال به سرور اکشن در آخرین مرحله
  const onSubmitFinal = async (data: AddHouseFormData) => {
    const finalPayload: AddHouseFormData = {
      ...houseData,
      ...data,
      capacity: Number(data.capacity),
      price: Number(data.price),
      rooms: Number(data.rooms),
      bathrooms: Number(data.bathrooms),
      parking: Number(data.parking),
    };

    setIsPending(true);
    const result = await createHouseAction(finalPayload);
    setIsPending(false);

    if (result.success) {
      router.push("/seller/dashboard/places");
    } else {
      alert(result.message || "خطا در ثبت اطلاعات");
    }
  };

  return (
    <div dir="rtl" className="w-full max-w-5xl mx-auto space-y-8 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
      
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          مدیریت املاک
        </h1>
        <button
          onClick={() => router.push("/seller/dashboard/places-management")}
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-[#0f3d61] transition"
        >
          <span>رفتن به لیست املاک</span>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* نوار مراحل با واریانت outline و فاصله ۳۲ پیکسلی (gap-8) */}
      <div className="flex items-center overflow-x-auto pb-2 gap-8">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          return (
            <Button
              key={step.id}
              variant="outline"
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`flex-1 min-w-[130px] rounded-2xl py-3 text-sm font-medium transition ${
                isActive
                  ? "border-[#0f3d61] text-[#0f3d61] bg-[#0f3d61]/5 dark:border-primary-200 dark:text-primary-200"
                  : "border-neutral-300 text-neutral-500 hover:border-neutral-400"
              }`}
            >
              {step.label}
            </Button>
          );
        })}
      </div>

      {/* فرم اصلی */}
      <form onSubmit={handleSubmit(currentStep === steps.length ? onSubmitFinal : handleNextStep)} className="space-y-6">
        
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <TextInput
                name="title"
                title="نام ملک"
                control={control}
                placeholder="آپارتمان لوکس"
              />

              <TextInput
                name="address"
                title="آدرس"
                control={control}
                placeholder="آدرس دقیق ملک..."
              />

              <TextInput
                name="capacity"
                title="ظرفیت (نفر)"
                type="number"
                control={control}
                placeholder="2"
              />

              <TextInput
                name="price"
                title="قیمت (تومان)"
                type="number"
                control={control}
                placeholder="20000000"
              />

              <TextInput
                name="rooms"
                title="تعداد اتاق"
                type="number"
                control={control}
                placeholder="2"
              />

              <TextInput
                name="bathrooms"
                title="تعداد حمام"
                type="number"
                control={control}
                placeholder="1"
              />

              <TextInput
                name="parking"
                title="تعداد پارکینگ"
                type="number"
                control={control}
                placeholder="1"
              />

            </div>

            <TextareaInput
              name="caption"
              title="توضیحات"
              control={control}
              placeholder="درباره ملک خود بیشتر توضیح دهید..."
              rows={5}
            />
          </div>
        )}

        {currentStep > 1 && (
          <div className="py-16 text-center text-zinc-400">
            محتوای مرحله {currentStep} در حال توسعه است...
          </div>
        )}

        {/* دکمه‌های ناوبری پایین فرم */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.5} />
              <span>مرحله قبل</span>
            </Button>
          ) : <div />}

          <Button
            type="submit"
            variant="primary"
            isLoading={isPending && currentStep === steps.length}
            className="bg-[#0f3d61] hover:bg-[#0b2f4c] dark:bg-[#1a507a] px-8 py-2.5 rounded-full text-white flex items-center gap-2"
          >
            <span>{currentStep === steps.length ? "ثبت نهایی" : "مرحله بعد"}</span>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={2} />
          </Button>
        </div>
      </form>
    </div>
  );
};