import React from "react";

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  timeLabel?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  timeLabel,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 py-4"
      dir="rtl"
    >
      {(subtitle || timeLabel) && (
        <div className="flex items-center justify-center gap-2">
          {timeLabel && (
            <div className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-3 w-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              <span className="pt-0.5" dir="ltr">
                {timeLabel}
              </span>
            </div>
          )}

          {subtitle && (
            <span
              className={`text-sm font-bold ${
                timeLabel ? "text-red-500" : "text-blue-600 dark:text-blue-500"
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
    </div>
  );
};

export default SectionHeading;
