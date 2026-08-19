import { Boxes, Package, Truck, Car, Plus, ArrowRight } from "lucide-react";

export default function HeroMockup() {
  return (
    <div className="animate-scale-in" style={{ animationDelay: "400ms" }}>
      <div className="relative mx-auto w-full max-w-xl rounded-2xl border border-outline-variant bg-surface-container p-4 shadow-2xl shadow-shadow/10">
        {/* Window chrome */}
        <div className="mb-4 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-error/60" />
          <span className="h-3 w-3 rounded-full bg-primary/60" />
          <span className="h-3 w-3 rounded-full bg-success/60" />
          <span className="ml-2 h-2 flex-1 rounded-full bg-surface-container-high" />
        </div>

        <div className="space-y-4">
          {/* Dashboard title */}
          <p className="font-heading text-sm font-bold text-on-surface">Dashboard</p>

          {/* Stats row - 4 cards */}
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                label: "Categories",
                value: "5",
                icon: Boxes,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: "Items",
                value: "48",
                icon: Package,
                color: "text-tertiary",
                bg: "bg-tertiary/10",
              },
              {
                label: "Suppliers",
                value: "8",
                icon: Truck,
                color: "text-secondary",
                bg: "bg-secondary/10",
              },
              {
                label: "Vehicles",
                value: "12",
                icon: Car,
                color: "text-on-primary-container",
                bg: "bg-primary-container/40",
              },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="rounded-xl bg-surface-container-low p-2.5">
                <div
                  className={`mb-1.5 flex h-6 w-6 items-center justify-center rounded-lg ${bg}`}
                >
                  <Icon size={12} className={color} aria-hidden="true" />
                </div>
                <p className="font-data text-base font-bold text-on-surface">{value}</p>
                <p className="text-[9px] text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            {["Add Category", "Add Item", "Add Supplier"].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[9px] font-semibold text-on-primary"
              >
                <Plus size={8} aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>

          {/* Recent items table */}
          <div className="overflow-hidden rounded-xl border border-outline-variant">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-high px-3 py-1.5">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Recent Items
              </span>
              <span className="flex items-center gap-0.5 text-[9px] font-medium text-primary">
                View all <ArrowRight size={8} aria-hidden="true" />
              </span>
            </div>
            {/* Column headers */}
            <div className="grid grid-cols-[2fr_1fr_0.5fr_0.7fr] border-b border-outline-variant bg-surface-container-high px-3 py-1 text-[8px] font-semibold uppercase tracking-wider text-on-surface-variant">
              <span>Name</span>
              <span>Category</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Price</span>
            </div>
            {[
              { name: "Brake Pads (Front)", cat: "Brakes", qty: "20", price: "$45.00" },
              { name: "Oil Filter", cat: "Engine", qty: "50", price: "$12.99" },
              { name: "Car Battery", cat: "Electrical", qty: "10", price: "$89.50" },
              { name: "Air Filter", cat: "Engine", qty: "35", price: "$18.00" },
            ].map((item, i) => (
              <div
                key={item.name}
                className={`grid grid-cols-[2fr_1fr_0.5fr_0.7fr] items-center px-3 py-2 text-[10px] ${
                  i < 3 ? "border-b border-outline-variant" : ""
                }`}
              >
                <span className="font-medium text-on-surface">{item.name}</span>
                <span className="text-on-surface-variant">{item.cat}</span>
                <span className="text-right font-data text-on-surface">{item.qty}</span>
                <span className="text-right font-data text-on-surface">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
