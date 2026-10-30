"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode, useState } from "react";

interface IProps {
  children: ReactNode;
}

const QueryProvider: FC<IProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
