import { FC } from "react";

interface IProps {
  value: number;
  className?: string;
}

const StarRating: FC<IProps> = ({ value, className = "size-4" }) => {
  const filled = Math.round(value);

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`امتیاز ${value} از 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={`${className} shrink-0 ${
            i < filled
              ? "text-orange-500"
              : "text-neutral-300 dark:text-neutral-400"
          }`}
        >
          <path d="M12 2.5l2.94 5.96 6.57.96-4.75 4.63 1.12 6.54L12 17.5l-5.88 3.09 1.12-6.54L2.49 9.42l6.57-.96L12 2.5z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
