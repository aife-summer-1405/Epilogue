import React from 'react';
import Link from 'next/link';

export interface TitleInDetailProps {
  title: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

const TitleInDetail: React.FC<TitleInDetailProps> = ({
  title,
  actionText,
  actionHref,
  onActionClick,
}) => {
  const renderAction = () => {
    if (!actionText) return null;

    const actionContent = (
      <>
        <span className="pt-0.5">{actionText}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </>
    );

    const baseClasses =
      'inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-600 bg-transparent px-3 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-600/10';

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
    <div className="flex w-full items-center justify-between py-2" dir="rtl">
      <h2 className="text-base font-bold text-gray-800 dark:text-white">
        {title}
      </h2>
      {renderAction()}
    </div>
  );
};

export default TitleInDetail;