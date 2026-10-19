
import Image from "next/image";
import CoupleImage from "@/app/assets/Image/Couple.png";

const features = [
  {
    id: 1,
    title: "24 / 7 ساعت شبانه روز",
    description: "تیم پشتیبانی در تمام طول روز همراه شما هستن",
  },
  {
    id: 2,
    title: "چرا باید ما را انتخاب کنید",
    description:
      "تیم باتجربه ما در زمینه املاک و مستغلات با سال‌ها سابقه بازار موفق سرآمد است.",
  },
  {
    id: 3,
    title: "چرا باید ما را انتخاب کنید",
    description:
      "تیم باتجربه ما در زمینه املاک و مستغلات با سال‌ها سابقه بازار موفق سرآمد است.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section
      className="
        mx-auto grid w-full 
        grid-cols-1 overflow-hidden rounded-r-4xl
        bg-[#F0F0F0] dark:bg-[#272727]
        md:grid-cols-2
        
      "
    >
      {/* Image */}
      <div className="relative min-h-[280px] w-full md:min-h-[720px]">
        <Image
          src={CoupleImage}
          alt="زوج در حال انتخاب خانه"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center px-5 py-8 sm:px-8 md:px-10 md:py-12">
        <h2 className=" text-[32px] font-bold dark:text-white text-neutral-950">
          چرا باید ما را انتخاب کنید
        </h2>

        <p className="mt-4  text-[18px] w-10/12 leading-6 dark:text-[#CDCED6] text-[#80838D]">
          تیم باتجربه ما در زمینه املاک و مستغلات با سال‌ها سابقه بازار
          موفق سرآمد است. نوآوری، ارائه تصمیمات آگاهانه و نتایج بهینه.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          {features.map((feature) => (
            <article
              key={feature.id}
              className="
                rounded-2xl border-l-8 border-[#2948C7]
                bg-white dark:bg-[#353535]  px-4 py-3
              "
            >
              <h3 className="text-[20px] dark:text-white font-bold text-neutral-950">
                {feature.title}
              </h3>

              <p className="mt-2 text-[16px] leading-5 dark:text-[#CDCED6] text-[#80838D]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
