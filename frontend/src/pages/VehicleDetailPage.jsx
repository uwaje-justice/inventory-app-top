import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Car, Package, AlertCircle } from "lucide-react";
import { getVehicle } from "../api/services";

function formatPrice(val) {
  const n = Number(val);
  return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
}

export default function VehicleDetailPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getVehicle(id)
      .then((data) => { if (!cancelled) setVehicle(data); })
      .catch(() => { if (!cancelled) setError("Failed to load vehicle."); })
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

  if (error || !vehicle) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error-container px-5 py-4 text-on-error-container">
        <AlertCircle size={18} />
        <p className="text-sm">{error || "Vehicle not found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/vehicles" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Vehicles
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container/40">
          <Car size={24} className="text-on-primary-container" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
        </div>
      </div>

      <h2 className="font-heading text-lg font-semibold text-on-surface">
        Compatible Items ({vehicle.items?.length ?? 0})
      </h2>

      {!vehicle.items?.length ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center">
          <Package size={32} className="mx-auto mb-3 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-sm text-on-surface-variant">No compatible items yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container">
          {vehicle.items.map((iv, i) => (
            <Link
              key={iv.item.id}
              to={`/items/${iv.item.id}`}
              className={`flex items-center justify-between px-5 py-3.5 text-sm transition-colors hover:bg-surface-container-high ${
                i < vehicle.items.length - 1 ? "border-b border-outline-variant" : ""
              }`}
            >
              <div>
                <span className="font-medium text-on-surface">{iv.item.name}</span>
                {iv.item.category && (
                  <span className="ml-2 text-on-surface-variant">/ {iv.item.category.name}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-data text-on-surface-variant">x{iv.item.quantity}</span>
                <span className="font-data text-on-surface-variant">{formatPrice(iv.item.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
