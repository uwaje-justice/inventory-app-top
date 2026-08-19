import { Link } from "react-router";
import { AlertCircle, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-surface-container-low to-background px-5 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <AlertCircle size={40} className="text-primary" aria-hidden="true" />
      </div>
      <h1 className="mb-2 font-heading text-4xl font-bold text-on-surface">404</h1>
      <p className="mb-8 text-on-surface-variant">Page not found. The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
      >
        <Home size={16} aria-hidden="true" />
        Back to Home
      </Link>
    </div>
  );
}
