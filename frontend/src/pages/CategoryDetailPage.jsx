import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Boxes, Package, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { getCategory, deleteCategory } from "../api/services";

function formatPrice(val) {
  const n = Number(val);
  return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
}

export default function CategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCategory(id)
      .then((data) => { if (!cancelled) setCategory(data); })
      .catch(() => { if (!cancelled) setError("Failed to load category."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this category and all its items?")) return;
    setDeleting(true);
    try {
      await deleteCategory(id);
      navigate("/categories");
    } catch {
      setError("Failed to delete category.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-b-primary" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error-container px-5 py-4 text-on-error-container">
        <AlertCircle size={18} />
        <p className="text-sm">{error || "Category not found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Categories
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Boxes size={24} className="text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">{category.name}</h1>
          {category.description && (
            <p className="mt-1 text-sm text-on-surface-variant">{category.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/categories/${id}/edit`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            aria-label="Edit category"
          >
            <Pencil size={16} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container disabled:opacity-60"
            aria-label="Delete category"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h2 className="font-heading text-lg font-semibold text-on-surface">
        Items ({category.items?.length ?? 0})
      </h2>

      {!category.items?.length ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center">
          <Package size={32} className="mx-auto mb-3 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-sm text-on-surface-variant">No items in this category yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container">
          {category.items.map((item, i) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className={`flex items-center justify-between px-5 py-3.5 text-sm transition-colors hover:bg-surface-container-high ${
                i < category.items.length - 1 ? "border-b border-outline-variant" : ""
              }`}
            >
              <span className="font-medium text-on-surface">{item.name}</span>
              <div className="flex items-center gap-4">
                <span className="font-data text-on-surface-variant">x{item.quantity}</span>
                <span className="font-data text-on-surface-variant">{formatPrice(item.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
