"use client";

import { useEffect, useState } from "react";

// Returns `value` only after it has stopped changing for `delayMs`.
// Used so the list doesn't reload on every key press in the search box.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    // Cleanup: if value changes again before the timer ends, cancel the old timer
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
