import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, LogOut, LayoutDashboard, Boxes, Package, Truck, Car } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/categories", label: "Categories", icon: Boxes },
  { to: "/items", label: "Items", icon: Package },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/vehicles", label: "Vehicles", icon: Car },
];

function handleLogout() {
  localStorage.removeItem("motiv-token");
  window.location.href = "/login";
}

export default function DashboardNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link to="/dashboard" className="font-heading text-xl font-bold tracking-tight text-on-surface">
          motiv
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <LogOut size={16} aria-hidden="true" />
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div
          ref={menuRef}
          className="absolute top-16 left-0 right-0 border-b border-outline-variant bg-surface-container px-5 py-4 shadow-lg animate-panel-drop md:hidden"
        >
          <ul className="space-y-1">
            {navLinks.map(({ to, label, icon: Icon }, i) => {
              const active = pathname === to;
              return (
                <li key={to} className="animate-click-in" style={{ animationDelay: `${i * 50 + 80}ms` }}>
                  <Link
                    to={to}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    }`}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary animate-click-in"
            style={{ animationDelay: `${navLinks.length * 50 + 80}ms` }}
          >
            <LogOut size={18} aria-hidden="true" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
