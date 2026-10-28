"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getHouses } from "@/app/actions/fastReserve/houses.actions";

export function useHouses() {
  const params = useSearchParams();
  const filters = Object.fromEntries(params.entries());

  return useInfiniteQuery({
    queryKey: ["houses", filters],
    queryFn: ({ pageParam }) =>
      getHouses({
        ...filters,
        page: String(pageParam),
        limit: String(8),
        transactionType: "reservation",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.totalCount / 8);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    placeholderData: keepPreviousData,
  });
}
