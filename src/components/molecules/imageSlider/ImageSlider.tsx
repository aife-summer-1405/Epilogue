import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { cn } from "@/lib/utils";
import { ISlide } from "@/core/types/sliderSlides.types";
import ImageFallback from "../ImageFallBack/ImageFallBack";

interface IProps {
  slides: ISlide[];
  className?: string;
  autoPlay?: boolean;
}

const paginationStyles = "[&_.swiper-pagination]:bottom-6";

const ImageSlider = ({ slides, className, autoPlay = true }: IProps) => {
  return (
    <Swiper
      dir="rtl"
      modules={[Pagination, Autoplay]}
      slidesPerView={1}
      loop={slides.length > 1}
      autoplay={
        autoPlay
          ? {
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }
          : false
      }
      speed={600}
      pagination={{
        clickable: true,
        bulletClass:
          "inline-block h-4 w-8 rounded-full bg-neutral-700 opacity-100 mx-2 cursor-pointer transition-all duration-300",
        bulletActiveClass: "w-21! bg-primary-500!",
      }}
      className={cn("rounded-[24px]", paginationStyles, className)}
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div className="relative size-full">
            <ImageFallback
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;
