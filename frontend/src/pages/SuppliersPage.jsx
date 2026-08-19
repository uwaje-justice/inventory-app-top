import { Link } from "react-router";
import { Plus, Truck, ArrowRight } from "lucide-react";
import { getSuppliers } from "../api/services";
import { useFetch } from "../hooks/useFetch";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

export default function SuppliersPage() {
  const { data: suppliers, loading, error, refetch } = useFetch(() => getSuppliers());

  if (loading) return <LoadingSpinner fullScreen={false} />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">Suppliers</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Track the vendors and contacts you source parts from.</p>
        </div>
        <Link to="/suppliers/new" className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto">
          <Plus size={16} aria-hidden="true" />
          Add Supplier
        </Link>
      </div>

      {suppliers?.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-12 text-center">
          <Truck size={40} className="mx-auto mb-4 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-on-surface-variant">No suppliers yet. Add your first supplier to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suppliers?.map((sup, i) => (
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
