"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { TOAST_DURATION_MS } from "@/constants/student-list";

type ToastVariant = "success" | "error";

interface ToastState {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Wrap the app with this so any screen can call showToast(...)
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    setToast({ id: Date.now(), message, variant });
  }, []);

  // Hide the toast after a few seconds; a new toast restarts the timer
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Live region: screen readers announce the message */}
      <div className="toast-region" aria-live="polite">
        {toast && (
          <div key={toast.id} className={`toast toast-${toast.variant}`} role="status" data-testid="toast">
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

// Hook to show a toast from any client component inside ToastProvider
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
