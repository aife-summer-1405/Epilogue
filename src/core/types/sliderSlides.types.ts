import { StaticImageData } from "next/image";

export interface ISlide {
  src: string | StaticImageData;
  alt: string;
}
