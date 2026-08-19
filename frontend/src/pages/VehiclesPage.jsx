import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Car, ArrowRight, AlertCircle } from "lucide-react";
import { getVehicles } from "../api/services";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getVehicles()
      .then((data) => { if (!cancelled) setVehicles(data); })
      .catch(() => { if (!cancelled) setError("Failed to load vehicles."); })
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
        <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">Vehicles</h1>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <Plus size={16} aria-hidden="true" />
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-12 text-center">
          <Car size={40} className="mx-auto mb-4 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-on-surface-variant">No vehicles yet. Add your first vehicle to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((veh, i) => (
            <Link
              key={veh.id}
              to={`/vehicles/${veh.id}`}
              className="group rounded-2xl border border-outline-variant bg-surface-container p-5 transition-shadow hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/40">
                  <Car size={20} className="text-on-primary-container" aria-hidden="true" />
                </div>
                <ArrowRight size={16} className="text-on-surface-variant/40 transition-transform group-hover:translate-x-0.5 group-hover:text-on-surface-variant" aria-hidden="true" />
              </div>
              <h2 className="mt-3 font-heading text-lg font-semibold text-on-surface">
                {veh.year} {veh.make} {veh.model}
              </h2>
              <p className="mt-3 font-data text-sm text-on-surface-variant">
                {veh._count?.items ?? 0} compatible items
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
