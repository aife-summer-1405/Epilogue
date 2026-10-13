import type { IconSvgElement } from "@hugeicons/react";

export type CategoryCardProps = {
  image: string;
  title: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  titleClassName?: string;
  icon?: IconSvgElement;
  onClick?: () => void;
};
