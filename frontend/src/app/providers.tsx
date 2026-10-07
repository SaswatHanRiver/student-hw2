"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/components/toast/toast-provider";
import { isNotFoundError } from "@/utils/api-client";

// How long fetched data counts as fresh before TanStack Query refetches it
const STALE_TIME_MS = 30_000;

// Retry a failed read once (a network blip), but never retry a 404: the record is gone
const MAX_QUERY_RETRIES = 1;
const shouldRetry = (failureCount: number, error: unknown) => !isNotFoundError(error) && failureCount < MAX_QUERY_RETRIES;

// Client-side providers for the whole app: TanStack Query cache + toasts
export function Providers({ children }: { children: ReactNode }) {
  // useState so the QueryClient is created once per browser tab, not on every render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: STALE_TIME_MS, retry: shouldRetry, refetchOnWindowFocus: false },
          mutations: { retry: 0 }, // never repeat a create/edit/delete automatically
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
