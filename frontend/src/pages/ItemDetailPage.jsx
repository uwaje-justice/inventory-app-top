import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Package, AlertCircle } from "lucide-react";
import { getItem } from "../api/services";

function formatPrice(val) {
  const n = Number(val);
  return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
}

export default function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getItem(id)
      .then((data) => { if (!cancelled) setItem(data); })
      .catch(() => { if (!cancelled) setError("Failed to load item."); })
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

  if (error || !item) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error-container px-5 py-4 text-on-error-container">
        <AlertCircle size={18} />
        <p className="text-sm">{error || "Item not found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/items" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Items
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary/10">
          <Package size={24} className="text-tertiary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">{item.name}</h1>
          {item.description && (
            <p className="mt-1 text-sm text-on-surface-variant">{item.description}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Category", value: item.category?.name || "—" },
          { label: "Supplier", value: item.supplier?.name || "—" },
          { label: "Quantity", value: item.quantity },
          { label: "Price", value: formatPrice(item.price) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-outline-variant bg-surface-container p-4">
            <p className="text-xs font-medium text-on-surface-variant">{label}</p>
            <p className="mt-1 font-data text-lg font-bold text-on-surface">{value}</p>
          </div>
        ))}
      </div>

      {item.vehicles?.length > 0 && (
        <div>
          <h2 className="mb-3 font-heading text-lg font-semibold text-on-surface">
            Compatible Vehicles ({item.vehicles.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {item.vehicles.map((iv) => (
              <Link
                key={iv.vehicle.id}
                to={`/vehicles/${iv.vehicle.id}`}
                className="rounded-2xl border border-outline-variant bg-surface-container p-4 transition-shadow hover:shadow-md"
              >
                <p className="font-heading text-sm font-semibold text-on-surface">
                  {iv.vehicle.year} {iv.vehicle.make} {iv.vehicle.model}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
