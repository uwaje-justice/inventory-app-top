import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import ErrorAlert from "./ErrorAlert";

export default function EntityFormLayout({
  backTo,
  backLabel,
  icon: Icon,
  title,
  apiError,
  submitting,
  submittingLabel,
  children,
}) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {backLabel}
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Icon size={24} className="text-primary" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">
          {title}
        </h1>
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface-container p-6 sm:p-8">
        {apiError && (
          <div className="mb-6">
            <ErrorAlert message={apiError} />
          </div>
        )}

        {children}

        <div className="mt-8 flex gap-3">
          <Link
            to={backTo}
            className="rounded-full border border-outline-variant px-6 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="entity-form"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-b-on-primary" />
                Saving...
              </>
            ) : (
              submittingLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
