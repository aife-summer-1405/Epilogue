"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import { AddHouseFormData } from "@/core/types/addHouse";
import {
  getHouseByIdAction,
  updateHouseAction,
  uploadHousePhotosAction,
} from "@/app/actions/editHouse.action";
import { Step1BasicInfo } from "../AddHouse/steps/Step1BasicInfo";
import { Step2Location } from "../AddHouse/steps/Step2Location";
import { Step3Amenities } from "../AddHouse/steps/Step3Amenities";
import { Step4Photos } from "../AddHouse/steps/Step4Photos";
import { Step5Review } from "../AddHouse/steps/Step5Review";

const steps = [
  { id: 1, label: "مشخصات اولیه" },
  { id: 2, label: "موقعیت مکانی" },
  { id: 3, label: "امکانات ملک" },
  { id: 4, label: "تصویر ملک" },
  { id: 5, label: "تایید نهایی" },
];

interface EditHouseFormProps {
  houseId: string;
}

export const EditHouseFormOrganism = ({ houseId }: EditHouseFormProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  // مدیریت عکس‌های قبلی (به صورت URL) و عکس‌های جدید (به صورت فایل)
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  const { control, handleSubmit, getValues, setValue, reset } =
    useForm<AddHouseFormData>({
      defaultValues: {
        title: "",
        address: "",
        rate: 5,
        price: 0,
        tags: [],
        capacity: 1,
        location: { lat: 35.6892, lng: 51.389 },
        categories: { name: "آپارتمانی" },
        bathrooms: 1,
        parking: 1,
        rooms: 1,
        yard_type: "بالکن دار",
        transaction_type: "rental",
        caption: "",
      },
    });

  // دریافت اطلاعات ملک به محض لود صفحه و قرار دادن روی فرم
  useEffect(() => {
    const fetchHouseData = async () => {
      const res = await getHouseByIdAction(houseId);
      if (res.success && res.data) {
        reset(res.data); // جایگذاری اطلاعات دقیق ملک روی فیلدها
        if (res.data.photos) {
          setExistingPhotos(res.data.photos);
        }
      } else {
        alert(res.message || "خطا در بارگذاری اطلاعات ملک");
      }
      setIsLoading(false);
    };

    fetchHouseData();
  }, [houseId, reset]);

  const handleNextStep = () => {
    if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const onSubmitFinal = async (data: AddHouseFormData) => {
    const finalPayload = {
      ...data,
      capacity: Number(data.capacity),
      price: Number(data.price),
      rooms: Number(data.rooms),
      bathrooms: Number(data.bathrooms),
      parking: Number(data.parking),
      photos: existingPhotos,
    };

    setIsPending(true);

    // ۱. ارسال تغییرات متنی ملک
    const result = await updateHouseAction(houseId, finalPayload);

    if (result.success) {
      // ۲. آپلود عکس‌های جدید در صورت انتخاب
      if (newImages.length > 0) {
        await uploadHousePhotosAction(houseId, newImages);
      }

      setIsPending(false);
      router.push("/panel/houseManagement");
    } else {
      setIsPending(false);
      alert(result.message || "خطا در ویرایش اطلاعات");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 text-zinc-500">
        در حال بارگذاری اطلاعات ملک...
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="w-full max-w-5xl mx-auto space-y-8 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          ویرایش اطلاعات ملک
        </h1>
        <button
          onClick={() => router.push("/seller/dashboard/places-management")}
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-[#0f3d61] transition"
        >
          <span>رفتن به لیست املاک</span>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex items-center overflow-x-auto pb-2 gap-4">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          return (
            <Button
              key={step.id}
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(step.id)}
              className={`flex-1 min-w-[130px] rounded-2xl py-3 text-sm font-medium transition ${
                isActive
                  ? "border-[#0f3d61] text-[#0f3d61] bg-[#0f3d61]/5"
                  : "border-neutral-300 text-neutral-500"
              }`}
            >
              {step.label}
            </Button>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit(
          currentStep === steps.length ? onSubmitFinal : handleNextStep,
        )}
        className="space-y-6"
      >
        {currentStep === 1 && <Step1BasicInfo control={control} />}

        {currentStep === 2 && (
          <Step2Location
            control={control}
            getValues={getValues}
            setValue={setValue}
            location={getValues("location") || { lat: 35.6892, lng: 51.389 }}
            onChangeLocation={(lat, lng) => {
              setValue("location", { lat, lng }, { shouldDirty: true });
            }}
          />
        )}

        {currentStep === 3 && (
          <Step3Amenities
            control={control}
            setValue={setValue}
            getValues={getValues}
          />
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              تصاویر فعلی ملک
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {existingPhotos.map((url, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl overflow-hidden border-2 border-zinc-200 h-56"
                >
                  <img
                    src={url}
                    alt="Existing House"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExistingPhotos(
                        existingPhotos.filter((_, i) => i !== idx),
                      )
                    }
                    className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white rounded-lg text-xs"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 pt-4">
              افزودن تصاویر جدید
            </h3>
            <Step4Photos
              selectedImages={newImages}
              mainImageIndex={mainImageIndex}
              onImageChange={(e) =>
                e.target.files &&
                setNewImages((prev) => [
                  ...prev,
                  ...Array.from(e.target.files!),
                ])
              }
              onRemoveImage={(idx) =>
                setNewImages((prev) => prev.filter((_, i) => i !== idx))
              }
              onSetMainImage={(idx) => setMainImageIndex(idx)}
            />
          </div>
        )}

        {currentStep === 5 && (
          <Step5Review
            houseData={getValues()}
            selectedImages={newImages}
            mainImageIndex={mainImageIndex}
          />
        )}

        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              className="flex items-center gap-5 px-6 py-2.5 rounded-full"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              <span>مرحله قبل</span>
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isPending && currentStep === steps.length}
            className="bg-[#0f3d61] px-8 py-2.5 rounded-full text-white flex items-center gap-2"
          >
            <span>
              {currentStep === steps.length ? "ثبت تغییرات" : "مرحله بعد"}
            </span>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};
