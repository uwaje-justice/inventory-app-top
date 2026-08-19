import { Boxes, Car, Wrench } from "lucide-react";

export default function HeroMockup() {
  return (
    <div className="animate-scale-in" style={{ animationDelay: "400ms" }}>
      <div className="relative w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container p-4 shadow-2xl shadow-shadow/10 md:max-w-lg">
        {/* Window chrome */}
        <div className="mb-4 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-error/60" />
          <span className="h-3 w-3 rounded-full bg-primary/60" />
          <span className="h-3 w-3 rounded-full bg-success/60" />
          <span className="ml-2 h-2 flex-1 rounded-full bg-surface-container-high" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Categories", value: "5", icon: Boxes },
              { label: "Vehicles", value: "12", icon: Car },
              { label: "Parts", value: "48", icon: Wrench },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl bg-surface-container-low p-3 text-center"
              >
                <Icon size={16} className="mx-auto mb-1 text-primary" aria-hidden="true" />
                <p className="font-data text-lg font-bold text-on-surface">{value}</p>
                <p className="text-[10px] text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>

          {/* Table mock */}
          <div className="overflow-hidden rounded-xl border border-outline-variant">
            <div className="bg-surface-container-high px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Recent Items
            </div>
            {[
              { name: "Brake Pads (Front)", cat: "Brakes", qty: "20" },
              { name: "Oil Filter", cat: "Engine", qty: "50" },
              { name: "Car Battery", cat: "Electrical", qty: "10" },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between border-t border-outline-variant px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-on-surface">{item.name}</p>
                  <p className="text-[10px] text-on-surface-variant">{item.cat}</p>
                </div>
                <span className="rounded-full bg-primary-container px-2 py-0.5 font-data text-[10px] font-bold text-on-primary-container">
                  x{item.qty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
