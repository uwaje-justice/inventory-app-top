import { Link } from "react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

export default function EntityDetailHeader({
  backTo,
  backLabel,
  icon: Icon,
  name,
  description,
  editTo,
  onDelete,
  deleting,
}) {
  return (
    <>
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
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">{name}</h1>
          {description && (
            <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={editTo}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            aria-label="Edit"
          >
            <Pencil size={16} />
          </Link>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container disabled:opacity-60"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
