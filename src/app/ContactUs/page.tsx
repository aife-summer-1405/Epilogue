"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionHeading } from "@/components/molecules";
import TextInput from "@/components/molecules/inputs/TextInput";
import TextareaInput from "@/components/molecules/inputs/TextareaInput";
import Button from "@/components/atoms/button/Button";
import {
  contactSchema,
  type ContactFormValues,
} from "@/features/contact/schemas/contact.schema";

export default function ContactPage() {
  const { control, handleSubmit } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Form Submitted:", data);
  };

  return (
    <main
      className="flex w-full flex-col items-center bg-white font-sans"
      dir="rtl"
    >
      <section className="w-full max-w-6xl px-4 py-12 md:px-8">
        <div className="mb-12 flex justify-center text-sm font-semibold text-gray-500">
          <span>خانه</span>
          <span className="mx-2">&lt;</span>
          <span className="text-blue-700">ارتباط با ما</span>
        </div>

        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-center">
          <div className="flex w-full flex-col items-start gap-6 text-right md:w-1/2 lg:w-7/12">
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              بیش از یک مشاور املاک؛ <br />
              شریک آرامش و سرمایه شما
            </h1>
            <p className="text-lg font-medium leading-relaxed text-gray-500">
              با تخصص، شفافیت و تعهد، رویای ملک ایده‌آل را به واقعیت تبدیل
              می‌کنیم. از مشاوره تا کلید، همراه شما هستیم.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 md:w-1/2 lg:w-5/12">
            <ContactInfoCard text="گیلان، رشت، میدان آزادی، جنب چهار راه عظیمی زاده">
              <svg
                width="28"
                height="28"
                viewBox="0 0 42 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-800"
              >
                <path
                  d="M4.80116 4.77827L7.2569 3.27455C9.94755 1.62699 11.2929 0.803214 12.7748 0.752475C14.2566 0.701735 15.6477 1.43182 18.4297 2.892L25.093 6.38921C26.7429 7.25515 26.7579 7.2589 28.5927 7.2589H32.75C36.5212 7.2589 38.4069 7.2589 39.5784 8.52286C40.75 9.78683 40.75 11.8211 40.75 15.8898V30.1191C40.75 34.1877 40.75 36.2221 39.5784 37.486C38.4069 38.75 36.5212 38.75 32.75 38.75H28.5927C26.7579 38.75 26.7429 38.7463 25.093 37.8803L17.4652 33.8769C15.6346 32.9161 14.7193 32.4357 13.7597 32.2973C11.6502 31.9932 9.95312 33.1147 8.18975 34.1944C5.59296 35.7845 4.29453 36.5796 3.234 36.3798C2.52831 36.2469 1.89001 35.8459 1.43453 35.2494C0.75 34.3529 0.75 32.7422 0.75 29.5208V12.2844C0.75 9.83269 0.75 8.60682 1.29329 7.60019C1.83658 6.59356 2.82477 5.98846 4.80116 4.77827Z"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="currentColor"
                />
                <path
                  d="M12.75 0.75L12.75 31.3611"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="currentColor"
                />
                <path
                  d="M26.75 8.13889L26.75 37.6944"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="currentColor"
                />
              </svg>
            </ContactInfoCard>
            <ContactInfoCard text="09229167194 - 098541612310" dir="ltr">
              <svg
                width="28"
                height="28"
                viewBox="0 0 42 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-800"
              >
                <path
                  d="M10.137 21.7639L6.23076 24.6838C4.46325 26.005 3.64052 26.6436 3.18169 27.6593C2.75 28.6148 2.75 29.7353 2.75 31.9762C2.75 36.005 2.75 38.0194 3.8216 39.3108C5.18818 40.9575 8.49393 40.7406 10.5667 40.7406H30.9333C33.006 40.7406 36.3804 40.8749 37.6784 39.3108C38.75 38.0194 38.75 36.005 38.75 31.9762C38.75 29.7353 38.75 28.6148 38.3183 27.6593C37.8594 26.6436 37.0368 26.005 35.2692 24.6838L31.363 21.7639C30.2698 20.9467 29.1541 20.3911 27.8693 20.031C26.406 19.6208 25.75 18.7802 25.75 16.9838C25.75 11.9415 15.75 12.4264 15.75 16.9838C15.75 18.7802 15.094 19.6208 13.6307 20.031C12.3561 20.3883 11.2389 20.9402 10.137 21.7639Z"
                  strokeWidth={1.5}
                  stroke="currentColor"
                />
                <path
                  d="M24.75 30.2237C24.75 32.5491 22.9591 34.4342 20.75 34.4342C18.5409 34.4342 16.75 32.5491 16.75 30.2237C16.75 27.8983 18.5409 26.0132 20.75 26.0132C22.9591 26.0132 24.75 27.8983 24.75 30.2237Z"
                  strokeWidth={1.5}
                  stroke="currentColor"
                />
                <path
                  d="M10.6703 2.21889C8.03341 3.01136 6.13768 3.99446 4.4029 5.18064C1.65637 7.05862 0.478864 10.4427 0.802142 13.7082C0.938772 15.0883 1.99129 15.7482 3.21178 15.3912C4.13903 15.1199 5.06776 14.8559 5.98922 14.5682C8.68411 13.7268 9.31798 12.7039 9.69249 9.8002L10.6703 2.21889ZM10.6703 2.21889C17.1872 0.260369 24.3128 0.260369 30.8297 2.21889M30.8297 2.21889C33.4666 3.01136 35.3623 3.99446 37.0971 5.18064C39.8436 7.05862 41.0211 10.4427 40.6979 13.7082C40.5612 15.0883 39.5087 15.7482 38.2882 15.3912C37.361 15.1199 36.4322 14.8559 35.5108 14.5682C32.8159 13.7268 32.182 12.7039 31.8075 9.8002L30.8297 2.21889Z"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  stroke="currentColor"
                />
              </svg>
            </ContactInfoCard>
            <ContactInfoCard text="Delta@gmail.com" dir="ltr">
              <svg
                width="28"
                height="28"
                viewBox="0 0 42 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-800"
              >
                <path
                  d="M40.75 20.75C40.75 31.7957 31.7957 40.75 20.75 40.75C17.9923 40.75 15.3649 40.1919 12.9747 39.1824C11.6537 38.6244 10.9932 38.3455 10.494 38.3109C9.99488 38.2764 9.44577 38.4233 8.34754 38.7172L0.75 40.75L2.78283 33.1525C3.07668 32.0542 3.2236 31.5051 3.18906 31.006C3.15452 30.5068 2.87556 29.8463 2.31764 28.5253C1.30815 26.1351 0.75 23.5077 0.75 20.75C0.75 9.7043 9.7043 0.75 20.75 0.75C31.7957 0.75 40.75 9.7043 40.75 20.75Z"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  stroke="currentColor"
                />
                <path
                  d="M13.9263 21.5047L15.6682 19.3413C16.4023 18.4295 17.3099 17.5806 17.3809 16.3665C17.3989 16.0599 17.1831 14.6831 16.7516 11.9297C16.582 10.8476 15.5717 10.75 14.6966 10.75C13.5563 10.75 12.9861 10.75 12.4199 11.0086C11.7043 11.3355 10.9696 12.2546 10.8083 13.0247C10.6808 13.6339 10.7756 14.0537 10.9652 14.8934C11.7705 18.4596 13.6596 21.9817 16.589 24.911C19.5183 27.8404 23.0404 29.7295 26.6066 30.5348C27.4463 30.7244 27.8661 30.8192 28.4753 30.6917C29.2454 30.5304 30.1645 29.7957 30.4914 29.0801C30.75 28.5139 30.75 27.9437 30.75 26.8034C30.75 25.9283 30.6524 24.918 29.5703 24.7484C26.8169 24.3169 25.4401 24.1011 25.1335 24.1191C23.9194 24.1901 23.0705 25.0977 22.1587 25.8318L19.9953 27.5737"
                  strokeWidth={1.5}
                  stroke="currentColor"
                />
              </svg>
            </ContactInfoCard>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl px-4 py-12 md:px-8">
        <div className="mb-10 text-center">
          <SectionHeading
            subtitle="برای بهترین تجربه"
            title="نظرات خود را به ما بگید"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative min-h-100 w-full overflow-hidden rounded-[2rem] bg-gray-200 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14448744400494!3d40.69763123331089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="flex flex-col rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h3 className="mb-8 text-center text-xl font-bold text-gray-900">
              با ما در ارتباط باشید
            </h3>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 [&_.border-neutral-600]:!border-none [&_.border-neutral-600]:!bg-gray-100 [&_input]:!bg-transparent [&_input]:!w-full [&_textarea]:!bg-transparent"
            >
              <TextInput
                name="fullName"
                title=""
                control={control}
                placeholder="نام و نام خانوادگی"
                variableName="fullMd"
              />
              <TextInput
                name="email"
                title=""
                control={control}
                placeholder="ایمیل"
                variableName="fullMd"
              />
              <TextareaInput
                name="message"
                control={control}
                placeholder="پیام شما"
                variableName="mdMd"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-4 w-full bg-[#1e3a8a] text-white hover:bg-blue-900"
              >
                ارسال درخواست شما
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

const ContactInfoCard = ({
  text,
  children,
  dir = "rtl",
}: {
  text: string;
  children: React.ReactNode;
  dir?: "rtl" | "ltr";
}) => {
  return (
    <div className="relative flex items-center justify-end gap-4 rounded-full bg-white px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <span className="text-sm font-semibold text-gray-600" dir={dir}>
        {text}
      </span>
      <div className="relative flex items-center justify-center border-r-2 border-blue-800 pr-4">
        {children}
      </div>
    </div>
  );
};
