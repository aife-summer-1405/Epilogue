import { SectionHeading } from "@/components/molecules";
import BreadCrumb from "@/components/molecules/breadcrumb/BreadCrumb";
import ContactForm from "@/components/organisms/contactUs/ContactForm";
import { IBreadCrumbsList } from "@/core/types/BreadCrumb/breadCrumb.types";
import {
  MapIcon,
  TelephoneIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const list: IBreadCrumbsList[] = [
  {
    href: "/",
    label: "خانه",
  },
  {
    href: "/contactUs",
    label: "ارتباط با ما",
  },
];

export default function ContactPage() {
  return (
    <main className="flex w-full flex-col items-center font-sans">
      <section className="w-full max-w-6xl px-4 py-12 md:px-8">
        <BreadCrumb list={list} />
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-center">
          <div className="flex w-full flex-col items-start gap-6 text-right md:w-1/2 lg:w-7/12">
            <h1 className="text-4xl font-extrabold leading-tight text-default-black md:text-5xl">
              بیش از یک مشاور املاک؛ <br />
              شریک آرامش و سرمایه شما
            </h1>
            <p className="text-lg font-medium leading-relaxed text-neutral-800">
              با تخصص، شفافیت و تعهد، رویای ملک ایده‌آل را به واقعیت تبدیل
              می‌کنیم. از مشاوره تا کلید، همراه شما هستیم.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 md:w-1/2 lg:w-5/12">
            <ContactInfoCard text="گیلان، رشت، میدان آزادی، جنب چهار راه عظیمی زاده">
              <HugeiconsIcon
                icon={MapIcon}
                className="w-9 h-8.5 text-default-black"
              />
            </ContactInfoCard>
            <ContactInfoCard text="09229167194 - 098541612310" dir="ltr">
              <HugeiconsIcon
                icon={TelephoneIcon}
                className="size-9 text-default-black"
              />
            </ContactInfoCard>
            <ContactInfoCard text="Delta@gmail.com" dir="ltr">
              <HugeiconsIcon
                icon={WhatsappIcon}
                className="size-9 text-default-black"
              />
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
          <div className="relative min-h-100 w-full overflow-hidden rounded-[2rem] bg-default-white shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14448744400494!3d40.69763123331089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <ContactForm />
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
    <div
      className="relative flex items-center justify-start gap-5 rounded-3xl bg-default-white px-8 py-5 border-r-4 border-primary-500 shadow-[0_50px_100px_0_rgba(72,72,72,0.16)]"
      dir="rtl"
    >
      <div className="flex shrink-0 items-center justify-center text-gray-800">
        {children}
      </div>
      <span
        className="w-full text-right text-[15px] font-semibold text-neutral-900 dark:text-neutral-600"
        dir={dir}
      >
        {text}
      </span>
    </div>
  );
};
