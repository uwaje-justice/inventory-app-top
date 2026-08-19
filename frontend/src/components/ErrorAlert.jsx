import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-error/20 bg-error-container p-5">
      <div className="flex items-start gap-3">
        <AlertCircle
          size={20}
          className="mt-0.5 shrink-0 text-on-error-container"
          aria-hidden="true"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-on-error-container">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-on-error-container transition-colors hover:bg-on-error-container/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
          >
            <RefreshCw size={12} aria-hidden="true" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
