"use client";

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import Button from "@/components/atoms/button/Button";
import type { TravelerFormValues } from "./Travelerform";
import { formatPrice } from "@/utils/formatters";

interface Props {
  values: TravelerFormValues;
  /** قیمت نمایش‌داده‌شده داخل کارت مشخصات (تومان) */
  price: number;
  /** متن «هزینه‌های جانبی» (در صورت نبود از متن پیش‌فرض استفاده می‌شود) */
  extraCostsText?: string;
  onEdit: () => void;
}

const DEFAULT_EXTRA_COSTS =
  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد";

const getAgeRange = (birthDate: string) => {
  const year = Number(
    birthDate.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).split("/")[0],
  );
  if (!year) return "—";
  const age = new DateObject({ calendar: persian }).year - year;
  if (age < 12) return "کودک";
  if (age < 18) return "نوجوان";
  if (age < 40) return "جوان";
  if (age < 60) return "میانسال";
  return "سالمند";
};

const maskNationalId = (id: string) =>
  id.length >= 6 ? `${id.slice(0, 3)}****${id.slice(-3)}` : id;

export default function TravelerSummary({
  values,
  price,
  extraCostsText = DEFAULT_EXTRA_COSTS,
  onEdit,
}: Props) {
  const rows: [string, string][] = [
    ["بازه سنی", getAgeRange(values.birthDate)],
    ["نام و نام خانوادگی", `${values.firstName} ${values.lastName}`],
    ["جنسیت", values.gender === "male" ? "مرد" : "زن"],
    ["کد ملی", maskNationalId(values.nationalId)],
    ["خدمات", "-"],
    ["مبلغ خدمات", "-"],
    ["قیمت", `${formatPrice(price.toLocaleString("en-US"))} تومان`],
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(280px,360px)_1fr]">
        {/* کارت مشخصات مسافران (سمت راست) */}
        <section className="flex flex-col gap-5 rounded-3xl bg-gray-100 p-5 dark:bg-[#353535]">
          <h2 className="text-center text-xl font-bold text-primary-500">
            مشخصات مسافران
          </h2>

          <dl className="flex flex-col gap-4 text-sm font-semibold">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <dt>{label}</dt>
                <dd className="font-normal" dir="auto">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <Button
            type="button"
            size="md"
            variant="primary"
            onClick={onEdit}
            className="w-full rounded-full"
          >
            ویرایش مسافران
          </Button>
        </section>

        {/* هزینه‌های جانبی (سمت چپ) */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-primary-500">هزینه های جانبی</h2>
          <p className="text-justify text-sm leading-8 text-neutral-800 dark:text-neutral-200">
            {extraCostsText}
          </p>
        </section>
      </div>

      {/* اطلاع‌رسانی سفر */}
      <section className="flex flex-col gap-3 border-t border-[#CDCED6] pt-6">
        <p className="text-primary-500">
          اطلاع رسانی سفر ( اطلاعات بلیط و اطلاع رسانی بعدی به این آدرس ارسال می شود . )
        </p>
        <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span>
            <span className="text-[#a6a6a6]">شماره تماس </span>
            <span dir="ltr" className="text-primary-500">{values.sharedMobile || "—"}</span>
          </span>
          <span>
            <span className="text-[#a6a6a6]">ایمیل </span>
            <span dir="ltr" className="text-primary-500">{values.sharedEmail || "—"}</span>
          </span>
        </p>
      </section>
    </div>
  );
}