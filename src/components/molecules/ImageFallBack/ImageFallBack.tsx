"use client";

import Image, { ImageProps } from "next/image";
import { FC, useState } from "react";
import fallBack from "@/app/assets/Image/Slider1.webp";

interface IProps extends Omit<ImageProps, "src"> {
  src?: ImageProps["src"] | null;
  fallbackSrc?: ImageProps["src"];
}

const ImageFallback: FC<IProps> = ({
  src,
  fallbackSrc = fallBack,
  alt,
  ...props
}) => {
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);

  const hasError = !src || failedSrc === src;

  return (
    <Image
      {...props}
      alt={alt}
      src={hasError ? fallbackSrc : src}
      onError={() => setFailedSrc(src ?? null)}
    />
  );
};

export default ImageFallback;
