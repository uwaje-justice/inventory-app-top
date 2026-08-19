import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function BackLink({ to = "/", children = "Back to home" }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      {children}
    </Link>
  );
}
