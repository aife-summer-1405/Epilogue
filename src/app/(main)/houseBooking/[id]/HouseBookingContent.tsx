"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/atoms/button/Button";
import BookingHouseCard from "@/components/organisms/houseBooking/BookingHouseCard";

import { useHouse } from "@/hooks/queries/houses/useHouses";

import BookingStepper from "@/components/organisms/houseBooking/Bookingstepper";
import BookingSuccessModal from "@/components/organisms/houseBooking/Bookingsuccessmodal";
import TravelerSummary from "@/components/organisms/houseBooking/Travelersummary";
import TravelerForm, {
  travelerSchema,
  type TravelerFormValues,
} from "@/components/organisms/houseBooking/Travelerform";
import BookingFooter from "@/components/organisms/houseBooking/Bookingfooter";

import { formatPrice } from "@/utils/formatters";
import { createBookingAction } from "@/app/actions/fastReserve/booking.actions";

const DAY = 24 * 60 * 60 * 1000;

export default function HouseBookingContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const houseId = Number(params.id);

  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";


  const {
    data: house,
    isLoading: houseLoading,
    isError: houseError,
  } = useHouse(houseId, Number.isInteger(houseId) && houseId > 0);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [discountCode, setDiscountCode] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<TravelerFormValues>({
    resolver: zodResolver(travelerSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: "",
      nationalId: "",
      additionalTravelers: [],
      sharedEmail: "",
      sharedMobile: "",
    },
  });

  const pricePerNight = useMemo(() => {
    return Number(String(house?.price ?? 0).replace(/[٬,،]/g, "")) || 0;
  }, [house?.price]);

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const startTime = Date.parse(`${startDate}T00:00:00Z`);
    const endTime = Date.parse(`${endDate}T00:00:00Z`);

    if (
      !Number.isFinite(startTime) ||
      !Number.isFinite(endTime) ||
      endTime <= startTime
    ) {
      return 0;
    }

    return Math.round((endTime - startTime) / DAY);
  }, [startDate, endDate]);

  const total = nights * pricePerNight;

  const handleTravelerSubmit = handleSubmit(() => {
    setStep(2);
  });

  const handleConfirmDetails = async () => {
    const isValid = await trigger();

    if (!isValid) {
      setStep(1);
      return;
    }

    setStep(3);
  };

const handleFinalConfirmation = async () => {
  if (submitting) return;

  const isValid = await trigger();

  if (!isValid) {
    setStep(1);
    return;
  }

  if (
    !Number.isInteger(houseId) ||
    houseId <= 0 ||
    !startDate ||
    !endDate ||
    nights <= 0
  ) {
    alert("اطلاعات خانه یا تاریخ‌های رزرو معتبر نیست.");
    return;
  }

  const values = getValues();

  const payload = {
    houseId,
    reservedDates: [startDate, endDate] as [string, string],

    traveler_details: [
      {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        birthDate: values.birthDate,
        nationalId: values.nationalId,
      },

      ...values.additionalTravelers.map((traveler) => ({
        firstName: traveler.firstName,
        lastName: traveler.lastName,
        gender: traveler.gender,
        birthDate: traveler.birthDate,
        nationalId: traveler.nationalId,
      })),
    ],

    sharedEmail: values.sharedEmail,
    sharedMobile: values.sharedMobile,
  };

  setSubmitting(true);

  try {
    const result = await createBookingAction(payload);

    if (!result.success) {
      alert(result.message);
      return;
    }

    console.log("[Booking] Created:", result.booking);

    setSuccess(true);
  } catch (error) {
    console.error("[Booking] Unexpected error:", error);

    alert("خطای غیرمنتظره‌ای هنگام ثبت رزرو رخ داد.");
  } finally {
    setSubmitting(false);
  }
};

  const footer =
    step === 1
      ? {
          label: "تأیید و ادامه فرایند",
          onClick: handleTravelerSubmit,
        }
      : step === 2
        ? {
            label: "تأیید و ادامه فرایند",
            onClick: handleConfirmDetails,
          }
        : {
            label: submitting
              ? "در حال ثبت رزرو..."
              : "تأیید اطلاعات و صدور بلیط",
            onClick: handleFinalConfirmation,
          };

  const isLoading = houseLoading;

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      alert("لطفاً کد تخفیف را وارد کنید.");
      return;
    }

    alert("سرویس اعتبارسنجی کد تخفیف هنوز به این بخش متصل نشده است.");
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen  px-4 py-6 text-[#191919]  dark:text-white sm:px-6 sm:py-8 lg:px-8"
    >
      <div className="mx-auto w-full max-w-360">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
          <section className="order-2 flex min-w-0 flex-col gap-6 lg:order-1">
            <BookingStepper current={step} />

            <div className="flex min-w-0 flex-col gap-8 rounded-[24px] dark:bg-[#272727] border border-[#CDCED6] dark:border-[#272727] p-4 sm:gap-10 sm:p-6">
              {step === 1 && (
                <TravelerForm
                  control={control}
                  genderError={errors.gender?.message}
                  onGenderChange={(value) =>
                    setValue("gender", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              )}

              {step === 2 && (
                <TravelerSummary
                  values={getValues()}
                  price={pricePerNight}
                  onEdit={() => setStep(1)}
                />
              )}

              {step === 3 && (
                <div className="flex flex-col gap-8">
                  <TravelerSummary
                    values={getValues()}
                    price={pricePerNight}
                    onEdit={() => setStep(1)}
                  />

                  <div className="rounded-2xl bg-[#F0F0F3] p-4 text-sm leading-7 dark:bg-[#353535]">
                    <h3 className="mb-2 font-bold">تأیید نهایی رزرو</h3>

                    <p className="text-[#777985] dark:text-[#C5C5C5]">
                      اطلاعات مسافر، تاریخ‌های رزرو و مبلغ نهایی را بررسی کنید.
                      رزرو پس از تأیید موفق سرور ثبت می‌شود.
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between gap-3">
                        <span>مدت اقامت</span>
                        <span>{formatPrice(nights)} شب</span>
                      </div>

                      <div className="flex justify-between gap-3 font-bold">
                        <span>مبلغ نهایی</span>
                        <span>{formatPrice(total)} تومان</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setStep(2)}
                    className="self-start"
                    disabled={submitting}
                  >
                    بازگشت به تأیید اطلاعات
                  </Button>
                </div>
              )}

              <BookingFooter total={total} {...footer} />
            </div>
          </section>

          <aside className="order-1 flex min-w-0 flex-col gap-5 lg:order-2 ">
            {isLoading ? (
              <div className="h-95 w-full animate-pulse rounded-[24px] bg-gray-100 dark:bg-[#353535]" />
            ) : houseError ? (
              <div
                role="alert"
                className="rounded-2xl p-4 text-sm text-red-600"
              >
                دریافت اطلاعات خانه ناموفق بود.
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="mt-4 w-full"
                  onClick={() => window.location.reload()}
                >
                  تلاش مجدد
                </Button>
              </div>
            ) : house ? (
              <>
                <BookingHouseCard
                  house={house}
                  startDate={startDate}
                  endDate={endDate}
                  nights={nights}
                  total={total}
                  onChangeHouse={() => router.push(`/houses/${houseId}`)}
                />

                <div dir="rtl" className="w-full pt-1">
                  <h3 className="mb-3 text-right text-xl font-semibold dark:text-white text-[#1E40AF]">
                    کد تخفیف
                  </h3>

                  <input
                    type="text"
                    value={discountCode}
                    onChange={(event) => setDiscountCode(event.target.value)}
                    placeholder="کد تخفیف"
                    aria-label="کد تخفیف"
                    className="h-11.5 w-full rounded-full border-0 bg-[#F0F0F3] px-5 text-sm outline-none placeholder:text-[#8B8D98] focus:ring-2 focus:ring-primary-500/20 dark:bg-[#353535] dark:text-white"
                  />

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="mt-3 h-13 w-full rounded-full text-sm font-semibold"
                    onClick={handleApplyDiscount}
                  >
                    اعمال کد تخفیف
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl p-4 text-sm text-[#8B8D98]">
                اطلاعات خانه پیدا نشد.
              </div>
            )}
          </aside>
        </div>
      </div>

      <BookingSuccessModal open={success} />
    </main>
  );
}
