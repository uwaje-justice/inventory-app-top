import { Link } from "react-router";
import { Plus, Package, ArrowRight } from "lucide-react";
import { getItems } from "../api/services";
import { useFetch } from "../hooks/useFetch";
import { formatPrice } from "../utils/format";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

export default function ItemsPage() {
  const { data: items, loading, error, refetch } = useFetch(() => getItems());

  if (loading) return <LoadingSpinner fullScreen={false} />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-on-surface md:text-3xl">Items</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Browse and manage all vehicle parts in your inventory.</p>
        </div>
        <Link to="/items/new" className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto">
          <Plus size={16} aria-hidden="true" />
          Add Item
        </Link>
      </div>

      {items?.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant bg-surface-container p-12 text-center">
          <Package size={40} className="mx-auto mb-4 text-on-surface-variant/40" aria-hidden="true" />
          <p className="text-on-surface-variant">No items yet. Add your first item to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container">
          <div className="grid grid-cols-[2fr_1fr_0.6fr_0.8fr] border-b border-outline-variant bg-surface-container-high px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant sm:grid-cols-[2fr_1fr_1fr_1fr_40px] sm:px-5 sm:text-xs">
            <span>Name</span>
            <span>Category</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Price</span>
            <span className="hidden sm:block" />
          </div>
          {items?.map((item, i) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className={`grid grid-cols-[2fr_1fr_0.6fr_0.8fr] items-center px-4 py-3.5 text-xs transition-colors hover:bg-surface-container-high sm:grid-cols-[2fr_1fr_1fr_1fr_40px] sm:px-5 sm:text-sm ${
                i < items.length - 1 ? "border-b border-outline-variant" : ""
              }`}
            >
              <span className="truncate font-medium text-on-surface">{item.name}</span>
              <span className="truncate text-on-surface-variant">{item.category?.name || "—"}</span>
              <span className="text-right font-data text-on-surface">{item.quantity}</span>
              <span className="text-right font-data text-on-surface">{formatPrice(item.price)}</span>
              <ArrowRight size={14} className="hidden text-on-surface-variant/40 sm:block" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
