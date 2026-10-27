import { ISlide } from "@/core/types/sliderSlides.types";

export type ProductCardProps = {
  image?: string;
  title: string;
  address: string;
  rating: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  parking: number;
  monthlyRent: string;
  pricePerNight: string;
  off?: number;
  originalPrice?: string;
  className?: string;
  onClick?: () => void;
  onDetailsClick?: () => void;
  slides: ISlide[];
};
