import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Package, ArrowRight, AlertCircle } from "lucide-react";
import { getItems } from "../api/services";

function formatPrice(val) {
  const n = Number(val);
  return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
}

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getItems()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch(() => { if (!cancelled) setError("Failed to load items."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-b-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error-container px-5 py-4 text-on-error-container">
        <AlertCircle size={18} />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">Items</h1>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <Plus size={16} aria-hidden="true" />
          Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-12 text-center">
          <Package size={40} className="mx-auto mb-4 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-on-surface-variant">No items yet. Add your first item to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container">
          <div className="hidden border-b border-outline-variant bg-surface-container-high px-5 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant md:grid md:grid-cols-[2fr_1fr_1fr_1fr_40px]">
            <span>Name</span>
            <span>Category</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Price</span>
            <span />
          </div>
          {items.map((item, i) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className={`flex items-center justify-between px-5 py-3.5 text-sm transition-colors hover:bg-surface-container-high md:grid md:grid-cols-[2fr_1fr_1fr_1fr_40px] ${
                i < items.length - 1 ? "border-b border-outline-variant" : ""
              }`}
            >
              <span className="font-medium text-on-surface">{item.name}</span>
              <span className="text-on-surface-variant">{item.category?.name || "—"}</span>
              <span className="text-right font-data text-on-surface">{item.quantity}</span>
              <span className="text-right font-data text-on-surface">{formatPrice(item.price)}</span>
              <ArrowRight size={14} className="hidden text-on-surface-variant/40 md:block" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
