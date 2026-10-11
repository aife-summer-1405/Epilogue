import React from 'react';
import Image from 'next/image';

export interface CommentCardProps {
  content: string;
  authorName: string;
  date: string;
  avatarUrl?: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  content,
  authorName,
  date,
  avatarUrl,
}) => {
  return (
    <div 
      className="flex max-w-sm flex-col gap-2 rounded-[2rem] bg-[#2E7E7A] p-6 shadow-md" 
      dir="rtl"
    >
      <div className="flex justify-start">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="currentColor" 
          viewBox="0 0 24 24" 
          className="h-14 w-14 text-[#9BD0CD]"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
        </svg>
      </div>

      <p className="text-sm font-medium leading-[2.2] text-white">
        {content}
      </p>

      <div className="mt-4 flex items-center justify-start gap-3 rounded-2xl bg-[#1A4F4C] p-3">

        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-200">
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt={authorName}
              fill
              className="object-cover"
              sizes="48px"
            />
          )}
        </div>

        <div className="flex flex-col items-start gap-1.5">
          <span className="text-sm font-bold text-white">
            {authorName}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#9BD0CD]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span dir="rtl">{date}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommentCard;