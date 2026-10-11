'use client';

import React, { useCallback, useMemo } from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 4;

    if (totalPages >= totalPageNumbers) {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

      const firstPageIndex = 1;
      const lastPageIndex = totalPages;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
        return [...leftRange, '...', totalPages];
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblingCount;
        const rightRange = Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1
        );
        return [firstPageIndex, '...', ...rightRange];
      }

      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        );
        return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
      }
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [currentPage, totalPages, siblingCount]);

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination"
      className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1"
    >
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500"
        aria-label="Previous page"
      >
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
      </button>

      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-sm font-medium text-gray-500"
            >
              &#8230;
            </span>
          );
        }

        const isCurrentPage = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber as number)}
            aria-current={isCurrentPage ? 'page' : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
              isCurrentPage
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500"
        aria-label="Next page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;