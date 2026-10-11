import React from 'react';
import Link from 'next/link';

export interface MapMarkerProps {
  title: string;
  address: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  title,
  address,
  actionText = 'جزئیات بیشتر و رزرو',
  actionHref,
  onActionClick,
}) => {
  const renderAction = () => {
    if (!actionText) return null;

    const actionContent = (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <span>{actionText}</span>
      </>
    );

    const baseClasses =
      'mt-1 flex w-fit items-center gap-1 text-sm font-bold text-blue-900 transition-colors hover:text-blue-950';

    if (actionHref) {
      return (
        <Link href={actionHref} className={baseClasses}>
          {actionContent}
        </Link>
      );
    }

    return (
      <button onClick={onActionClick} className={baseClasses} type="button">
        {actionContent}
      </button>
    );
  };

  return (
    <div 
      className="relative flex w-fit flex-col items-start gap-2 rounded-xl rounded-br-none bg-blue-700 px-5 py-4 text-white shadow-md" 
      dir="rtl"
    >
      
      <div className="absolute -bottom-3 right-0 h-4 w-6 translate-x-0.5 -rotate-12 transform">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-full w-full text-blue-700"
        >
          <path d="M24 0L12 24L0 0Z" />
        </svg>
      </div>

      <h3 className="text-base font-bold">
        {title}
      </h3>
      
      <div className="flex items-center gap-1.5 text-sm font-medium text-blue-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4 shrink-0"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <span>{address}</span>
      </div>

      {renderAction()}
      
    </div>
  );
};

export default MapMarker;