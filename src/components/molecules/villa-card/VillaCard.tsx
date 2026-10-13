"use client";

import Image from "next/image";
import { useState } from "react";

import Button from "@/components/atoms/button/Button";
import { cn } from "@/lib/utils";

import { villaCardStyles as styles } from "./villa-card.styles";
import type { VillaCardProps } from "./villa-card.types";

export default function VillaCard({
  image,
  title,
  count = 50,
  alt,
  className,
  imageClassName,
  onClick,
}: VillaCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className={cn(styles.root, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={image}
        alt={alt ?? title}
        fill
        sizes="(max-width: 640px) 100vw, 318px"
        className={cn(styles.image, imageClassName)}
      />

      <div className={styles.content}>
        <span className={styles.title}>{title}</span>

        <Button
          size="md"
          variant={isHovered ? "primary" : "outline"}
          hasIcon={false}
          onClick={onClick}
        >
          {isHovered ? "مشاهده" : `${count} مورد`}
        </Button>
      </div>
    </article>
  );
}
