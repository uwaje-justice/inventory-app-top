import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Boxes, Package, Truck, Car, Plus, ArrowRight, AlertCircle } from "lucide-react";
import { getCategories, getItems, getSuppliers, getVehicles } from "../api/services";

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

function formatPrice(val) {
  const n = Number(val);
  return isNaN(n) ? "$0.00" : `$${n.toFixed(2)}`;
}

export default function DashboardPage() {
  const [counts, setCounts] = useState({ categories: 0, items: 0, suppliers: 0, vehicles: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [cats, items, sups, vehs] = await Promise.all([
          getCategories(),
          getItems(),
          getSuppliers(),
          getVehicles(),
        ]);
        if (cancelled) return;
        setCounts({
          categories: cats.length,
          items: items.length,
          suppliers: sups.length,
          vehicles: vehs.length,
        });
        setRecentItems(items.slice(0, 5));
      } catch {
        if (!cancelled) setError("Failed to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
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
      <div className="flex flex-1 items-center justify-center py-32">
        <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error-container px-5 py-4 text-on-error-container">
          <AlertCircle size={18} />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Stats */}
      <section>
        <h1 className="mb-6 font-heading text-2xl font-bold text-on-surface md:text-3xl">
          Dashboard
        </h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map(({ key, label, icon: Icon, to, color, bg }, i) => (
            <Link
              key={key}
              to={to}
              className="group rounded-2xl border border-outline-variant bg-surface-container p-5 transition-shadow hover:shadow-md animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={20} className={color} aria-hidden="true" />
              </div>
              <p className="font-data text-2xl font-bold text-on-surface">{counts[key]}</p>
              <p className="text-sm text-on-surface-variant">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 font-heading text-lg font-semibold text-on-surface">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, to, icon: Icon, color }, i) => (
            <span
              key={label}
              className="animate-slide-up"
              style={{ animationDelay: `${280 + i * 60}ms` }}
            >
              <Link
                to={to}
                className={`inline-flex items-center gap-2 rounded-full ${color} px-5 py-2.5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            </span>
          ))}
        </div>
      </section>

      {/* Recent Items */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-on-surface">Recent Items</h2>
          <Link
            to="/items"
            className="flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
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
            <div className="hidden border-b border-outline-variant bg-surface-container-high px-5 py-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant md:grid md:grid-cols-[2fr_1fr_1fr_1fr]">
              <span>Name</span>
              <span>Category</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Price</span>
            </div>
            {recentItems.map((item, i) => (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className={`flex items-center justify-between px-5 py-3.5 text-sm transition-colors hover:bg-surface-container-high md:grid md:grid-cols-[2fr_1fr_1fr_1fr] ${
                  i < recentItems.length - 1 ? "border-b border-outline-variant" : ""
                }`}
              >
                <span className="font-medium text-on-surface">{item.name}</span>
                <span className="text-on-surface-variant">
                  {item.category?.name || "—"}
                </span>
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
