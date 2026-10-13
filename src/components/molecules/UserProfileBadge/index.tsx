import React from 'react';
import Image from 'next/image';

export interface UserProfileBadgeProps {
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
  onClick?: () => void;
}

const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({
  name,
  phoneNumber,
  avatarUrl,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      dir="ltr"
      className="flex items-center justify-between gap-6 rounded-full bg-white p-1 pr-4 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-yellow-100">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </div>

        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-gray-900">
            {name}
          </span>
          <span className="text-xs font-medium text-gray-400">
            {phoneNumber}
          </span>
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="h-4 w-4 text-gray-400"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
  );
};

export default UserProfileBadge;