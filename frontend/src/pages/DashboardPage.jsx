import { Link } from "react-router";
import { Boxes, Package, Truck, Car, Plus, ArrowRight } from "lucide-react";
import { getCategories, getItems, getSuppliers, getVehicles } from "../api/services";
import { useFetch } from "../hooks/useFetch";
import { formatPrice } from "../utils/format";
import { RECENT_ITEMS_LIMIT } from "../constants";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

const statCards = [
  { key: "categories", label: "Categories", icon: Boxes, to: "/categories", color: "text-primary", bg: "bg-primary/10" },
  { key: "items", label: "Items", icon: Package, to: "/items", color: "text-tertiary", bg: "bg-tertiary/10" },
  { key: "suppliers", label: "Suppliers", icon: Truck, to: "/suppliers", color: "text-secondary", bg: "bg-secondary/10" },
  { key: "vehicles", label: "Vehicles", icon: Car, to: "/vehicles", color: "text-on-primary-container", bg: "bg-primary-container/40" },
];

const quickActions = [
  { label: "Add Category", to: "/categories", icon: Plus, color: "bg-primary" },
  { label: "Add Item", to: "/items", icon: Plus, color: "bg-tertiary" },
  { label: "Add Supplier", to: "/suppliers", icon: Plus, color: "bg-secondary" },
  { label: "Add Vehicle", to: "/vehicles", icon: Plus, color: "bg-primary" },
];

async function fetchDashboard() {
  const [cats, items, sups, vehs] = await Promise.all([getCategories(), getItems(), getSuppliers(), getVehicles()]);
  return {
    counts: { categories: cats.length, items: items.length, suppliers: sups.length, vehicles: vehs.length },
    recentItems: items.slice(0, RECENT_ITEMS_LIMIT),
  };
}

export default function DashboardPage() {
  const { data, loading, error, refetch } = useFetch(fetchDashboard);

  if (loading) return <LoadingSpinner fullScreen={false} />;
  if (error) return <div className="flex flex-1 items-center justify-center py-32"><ErrorAlert message={error} onRetry={refetch} /></div>;

  const { counts, recentItems } = data;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-6 font-heading text-2xl font-bold text-on-surface md:text-3xl">Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map(({ key, label, icon: Icon, to, color, bg }, i) => (
            <Link key={key} to={to} className="group rounded-2xl border border-outline-variant bg-surface-container p-5 transition-shadow hover:shadow-md animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={20} className={color} aria-hidden="true" />
              </div>
              <p className="font-data text-2xl font-bold text-on-surface">{counts[key]}</p>
              <p className="text-sm text-on-surface-variant">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-lg font-semibold text-on-surface">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, to, icon: Icon, color }, i) => (
            <span key={label} className="animate-slide-up" style={{ animationDelay: `${280 + i * 60}ms` }}>
              <Link to={to} className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full ${color} px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}>
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            </span>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-on-surface">Recent Items</h2>
          <Link to="/items" className="flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80">
            View all
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {recentItems.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-8 text-center">
            <Package size={32} className="mx-auto mb-3 text-on-surface-variant/40" aria-hidden="true" />
            <p className="text-sm text-on-surface-variant">No items yet. Add your first item to get started.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container">
            <div className="grid grid-cols-[2fr_1fr_0.6fr_0.8fr] border-b border-outline-variant bg-surface-container-high px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant sm:grid-cols-[2fr_1fr_1fr_1fr] sm:px-5 sm:text-xs">
              <span>Name</span>
              <span>Category</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Price</span>
            </div>
            {recentItems.map((item, i) => (
              <Link key={item.id} to={`/items/${item.id}`} className={`grid grid-cols-[2fr_1fr_0.6fr_0.8fr] items-center px-4 py-3.5 text-xs transition-colors hover:bg-surface-container-high sm:grid-cols-[2fr_1fr_1fr_1fr] sm:px-5 sm:text-sm ${i < recentItems.length - 1 ? "border-b border-outline-variant" : ""}`}>
                <span className="truncate font-medium text-on-surface">{item.name}</span>
                <span className="truncate text-on-surface-variant">{item.category?.name || "—"}</span>
                <span className="text-right font-data text-on-surface">{item.quantity}</span>
                <span className="text-right font-data text-on-surface">{formatPrice(item.price)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
