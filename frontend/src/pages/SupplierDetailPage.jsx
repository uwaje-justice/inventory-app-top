import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Truck, Package, AlertCircle } from "lucide-react";
import { getSupplier } from "../api/services";

function formatPrice(val) {
  const n = Number(val);
  return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
}

export default function SupplierDetailPage() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getSupplier(id)
      .then((data) => { if (!cancelled) setSupplier(data); })
      .catch(() => { if (!cancelled) setError("Failed to load supplier."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-transparent border-b-primary" />
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error-container px-5 py-4 text-on-error-container">
        <AlertCircle size={18} />
        <p className="text-sm">{error || "Supplier not found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/suppliers" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Suppliers
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
          <Truck size={24} className="text-secondary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">{supplier.name}</h1>
          {supplier.contactName && (
            <p className="mt-1 text-sm text-on-surface-variant">{supplier.contactName}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {supplier.email && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-4">
            <p className="text-xs font-medium text-on-surface-variant">Email</p>
            <p className="mt-1 text-sm font-medium text-on-surface">{supplier.email}</p>
          </div>
        )}
        {supplier.phone && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-4">
            <p className="text-xs font-medium text-on-surface-variant">Phone</p>
            <p className="mt-1 text-sm font-medium text-on-surface">{supplier.phone}</p>
          </div>
        )}
      </div>

      <h2 className="font-heading text-lg font-semibold text-on-surface">
        Items ({supplier.items?.length ?? 0})
      </h2>

      {!supplier.items?.length ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center">
          <Package size={32} className="mx-auto mb-3 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-sm text-on-surface-variant">No items from this supplier yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container">
          {supplier.items.map((item, i) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className={`flex items-center justify-between px-5 py-3.5 text-sm transition-colors hover:bg-surface-container-high ${
                i < supplier.items.length - 1 ? "border-b border-outline-variant" : ""
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
