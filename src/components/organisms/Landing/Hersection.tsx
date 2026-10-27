
import HeroFilter from "./HeroFilter";
import Hero1 from "@/app/assets/Image/Hero1.jpg";

export default function HeroSection() {
  return (
    <section
      className="
        relative isolate min-h-[600px]
        overflow-hidden bg-cover bg-center bg-no-repeat
        bg-fixed
        md:min-h-[800px]
      "
      style={{
        backgroundImage: `url("${Hero1.src}")`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-black/25"
      />

      <div
        className="
          relative z-10 mx-auto flex w-full max-w-[1200px]
          flex-col items-center px-4 pb-24 pt-32
          md:px-6 md:pt-32
        "
      >
        <div className="w-full py-16 items-center text-center flex flex-col gap-6 md:py-20">
                  <h1
          className="
            max-w-[700px] text-center text-3xl font-bold
            leading-[1.5] text-white
            md:text-[64px] md:leading-[1.4]
          "
        >
          خانه رویایی
          <br />
          خودت رو پیدا کن
        </h1>

        <p
          className="
            mt-6 max-w-[700px] text-center
            text-sm font-medium leading-7 text-white
            md:text-[18px]
          "
        >
          ما آژانس املاکی هستیم که به شما کمک می‌کنیم بهترین
          اقامتگاه‌تان را پیدا کنید. بیایید درباره خانه رویایی
          شما بحث کنیم!
        </p>
        </div>


        <div className=" w-full md:mt-12">
          <HeroFilter />
        </div>
      </div>
    </section>
  );
}
