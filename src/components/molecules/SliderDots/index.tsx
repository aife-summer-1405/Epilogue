import React from 'react';

export interface SliderDotsProps {
  totalSlides: number;
  currentSlide: number;
  onDotClick?: (index: number) => void;
}

const SliderDots: React.FC<SliderDotsProps> = ({
  totalSlides,
  currentSlide,
  onDotClick,
}) => {
  if (totalSlides <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2" dir="ltr">
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isActive = index === currentSlide;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onDotClick?.(index)}
            disabled={!onDotClick}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={isActive ? 'true' : 'false'}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              isActive
                ? 'bg-blue-700'
                : 'bg-gray-400 hover:bg-gray-500'
            } ${onDotClick ? 'cursor-pointer' : 'cursor-default'}`}
          />
        );
      })}
    </div>
  );
};

export default SliderDots;