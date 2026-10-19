import { Suspense, type FC, type ReactNode } from "react";
import AuthCard from "@/components/organisms/authentication/AuthCard";
import ImageSlider from "@/components/organisms/authentication/ImageSlider";
import slider1 from "@/app/assets/Image/Slider1.webp";
import slider2 from "@/app/assets/Image/Slider2.webp";
import slider3 from "@/app/assets/Image/Slider3.webp";

interface IProps {
  children: ReactNode;
}

const slides = [
  { src: slider1, alt: "نمای بیرونی ویلا" },
  { src: slider2, alt: "نمای ورودی ساختمان" },
  { src: slider3, alt: "حیاط و محوطه" },
];

const AuthLayout: FC<IProps> = ({ children }) => {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full sm:max-w-9/10 flex justify-center gap-8">
        <div className="flex min-w-0 xl:h-auto sm:h-187.5 min-h-165 h-[calc(100vh-32px)] max-h-195 xl:w-4/10 lg:w-6/10 md:w-8/10 w-full lg:max-w-none">
          <AuthCard>{children}</AuthCard>
        </div>
        <div className="hidden xl:block relative w-6/10 min-w-0 h-187 self-center shrink-0">
          <Suspense
            fallback={
              <div className="size-full rounded-[24px] bg-neutral-300 animate-pulse" />
            }
          >
            <ImageSlider slides={slides} className="size-full" />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
