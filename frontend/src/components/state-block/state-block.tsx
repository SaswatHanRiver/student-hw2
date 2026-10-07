import type { ReactNode } from "react";

interface StateBlockProps {
  title: string;
  message: string;
  variant?: "default" | "error";
  action?: ReactNode; // e.g. a "Try again" or "Clear filters" button
  testId?: string;
}

// Shared block for empty, no-results and error states
export function StateBlock({ title, message, variant = "default", action, testId }: StateBlockProps) {
  const className = variant === "error" ? "state-block state-block-error" : "state-block";

  return (
    <div className={className} role={variant === "error" ? "alert" : "status"} data-testid={testId}>
      <h2 className="state-block-title">{title}</h2>
      <p className="state-block-message">{message}</p>
      {action}
    </div>
  );
}
