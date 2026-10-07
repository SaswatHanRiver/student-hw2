"use client";

import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isWorking: boolean; // true while the action runs: buttons are disabled
  onConfirm: () => void;
  onCancel: () => void;
}

// Modal "Are you sure?" box. Uses the native <dialog>, which traps focus and closes on Esc.
export function ConfirmDialog({ open, title, message, confirmLabel, isWorking, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Keep the real <dialog> in sync with the `open` prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby="confirm-dialog-title"
      onCancel={(event) => {
        event.preventDefault(); // Esc: let the parent decide, so state stays in sync
        if (!isWorking) onCancel();
      }}
    >
      <h2 id="confirm-dialog-title" className="confirm-dialog-title">
        {title}
      </h2>
      <p className="confirm-dialog-message">{message}</p>
      <div className="confirm-dialog-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isWorking}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={isWorking}>
          {isWorking ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
