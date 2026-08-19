import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-sm rounded-2xl bg-surface-container-high p-6 shadow-xl animate-scale-in"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
          <AlertTriangle size={24} className="text-error" aria-hidden="true" />
        </div>
        <h2 id="confirm-dialog-title" className="mb-2 font-heading text-lg font-bold text-on-surface">
          {title}
        </h2>
        <p id="confirm-dialog-message" className="mb-6 text-sm leading-relaxed text-on-surface-variant">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-error px-5 py-2.5 text-sm font-semibold text-on-error transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
