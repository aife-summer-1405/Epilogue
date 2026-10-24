'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { categoryCardStyles as styles } from './category-card.styles';
import type { CategoryCardProps } from './category-card.types';
import ButtonOnlyIcon from '@/components/atoms/buttonOnlyIcon/buttonOnlyIcon';

export default function CategoryCard({
  image,
  title,
  alt,
  className,
  imageClassName,
  titleClassName,
  onClick,
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className={cn(styles.root, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={image||""}
        alt={alt ?? title}
        fill
        sizes="(max-width: 640px) 100vw, 220px"
        className={cn(styles.image, imageClassName)}
      />

      <div className={styles.content}>
        <span className={cn(styles.title, titleClassName)}>
          {title}
        </span>

        <ButtonOnlyIcon
          size="sm"
          variant={isHovered ? 'primary' : 'outline'}
          onClick={onClick}
        />
      </div>
    </article>
  );
}