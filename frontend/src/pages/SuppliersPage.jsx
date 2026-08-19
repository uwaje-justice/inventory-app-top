import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Truck, ArrowRight, AlertCircle } from "lucide-react";
import { getSuppliers } from "../api/services";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getSuppliers()
      .then((data) => { if (!cancelled) setSuppliers(data); })
      .catch(() => { if (!cancelled) setError("Failed to load suppliers."); })
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
        <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">Suppliers</h1>
        <Link to="/suppliers/new" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <Plus size={16} aria-hidden="true" />
          Add Supplier
        </Link>
      </div>

      {suppliers.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-12 text-center">
          <Truck size={40} className="mx-auto mb-4 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-on-surface-variant">No suppliers yet. Add your first supplier to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((sup, i) => (
            <Link
              key={sup.id}
              to={`/suppliers/${sup.id}`}
              className="group rounded-2xl border border-outline-variant bg-surface-container p-5 transition-shadow hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                  <Truck size={20} className="text-secondary" aria-hidden="true" />
                </div>
                <ArrowRight size={16} className="text-on-surface-variant/40 transition-transform group-hover:translate-x-0.5 group-hover:text-on-surface-variant" aria-hidden="true" />
              </div>
              <h2 className="mt-3 font-heading text-lg font-semibold text-on-surface">{sup.name}</h2>
              {sup.contactName && (
                <p className="mt-1 text-sm text-on-surface-variant">{sup.contactName}</p>
              )}
              {sup.email && (
                <p className="mt-0.5 text-xs text-on-surface-variant/70">{sup.email}</p>
              )}
              <p className="mt-3 font-data text-sm text-on-surface-variant">
                {sup._count?.items ?? 0} items
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
