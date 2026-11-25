"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

import Button from "@/components/atoms/button/Button";
import { addHouseSchema } from "@/lib/validations/addHouseSchema";
import {
  createHouseAction,
  uploadHousePhotosAction,
} from "@/app/actions/addHouse.action";

import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2Location } from "./steps/Step2Location";
import { Step3Amenities } from "./steps/Step3Amenities";
import { Step4Photos } from "./steps/Step4Photos";
import { Step5Review } from "./steps/Step5Review";
import { AddHouseFormData } from "@/core/types/addHouse";

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

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  const [houseData, setHouseData] = useState<Partial<AddHouseFormData>>({
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
  });

  const { control, handleSubmit, getValues, setValue, trigger } =
    useForm<AddHouseFormData>({
      resolver: zodResolver(addHouseSchema),
      defaultValues: houseData as AddHouseFormData,
      mode: "onChange",
    });

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof AddHouseFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["title", "address", "capacity", "price", "caption"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["address", "location"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["rooms", "bathrooms", "parking", "yard_type"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    const currentValues = getValues();
    setHouseData((prev) => ({ ...prev, ...currentValues }));
    if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    const currentValues = getValues();
    setHouseData((prev) => ({ ...prev, ...currentValues }));
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

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
    const toastId = toast.loading("در حال ثبت ملک...");

    try {
      const result = await createHouseAction(finalPayload);

      if (result.success && result.houseId) {
        if (selectedImages.length > 0) {
          toast.update(toastId, {
            render: "ملک ثبت شد؛ در حال آپلود تصاویر...",
            type: "info",
            isLoading: true,
          });

          const uploadResult = await uploadHousePhotosAction(
            result.houseId,
            selectedImages,
          );

          if (!uploadResult.success) {
            toast.update(toastId, {
              render:
                uploadResult.message ||
                "ملک ثبت شد اما در آپلود تصاویر خطایی رخ داد",
              type: "warning",
              isLoading: false,
              autoClose: 4000,
            });
            setIsPending(false);
            return;
          }
        }

        toast.update(toastId, {
          render: "ملک با موفقیت ثبت شد",
          type: "success",
          isLoading: false,
          autoClose: 3500,
        });
        setIsPending(false);
        router.push("/panel/houseManagement/");
      } else {
        setIsPending(false);
        toast.update(toastId, {
          render: result.message || "خطا در ثبت اطلاعات",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      }
    } catch {
      setIsPending(false);
      toast.update(toastId, {
        render: "خطای ناشناخته در ثبت اطلاعات",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="w-full  space-y-8 bg-white dark:bg-[#212121] p-6 sm:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          ساخت ملک جدید        </h1>
        <button
          onClick={() => router.push("/panel/houseManagement/")}
          className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-[#0f3d61] transition"
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
              onClick={async () => {
                if (step.id < currentStep) {
                  setHouseData((prev) => ({ ...prev, ...getValues() }));
                  setCurrentStep(step.id);
                } else {
                  await handleNextStep();
                }
              }}
              className={`flex-1 min-w-[130px] rounded-2xl py-3 text-sm font-medium transition ${isActive
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
            location={houseData.location || { lat: 35.6892, lng: 51.389 }}
            onChangeLocation={(lat, lng) => {
              setValue("location", { lat, lng });
              setHouseData((prev) => ({ ...prev, location: { lat, lng } }));
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
          <Step4Photos
            selectedImages={selectedImages}
            mainImageIndex={mainImageIndex}
            onImageChange={(e) =>
              e.target.files &&
              setSelectedImages((prev) => [
                ...prev,
                ...Array.from(e.target.files!),
              ])
            }
            onRemoveImage={(idx) => {
              setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
              if (mainImageIndex === idx) setMainImageIndex(0);
            }}
            onSetMainImage={(idx) => setMainImageIndex(idx)}
          />
        )}

        {currentStep === 5 && (
          <Step5Review
            houseData={{ ...houseData, ...getValues() }}
            selectedImages={selectedImages}
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
              {currentStep === steps.length ? "ثبت نهایی" : "مرحله بعد"}
            </span>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};