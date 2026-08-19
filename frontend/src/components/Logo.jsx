import { Link } from "react-router";

export default function Logo({ to = "/" }) {
  return (
    <Link to={to} className="font-heading text-xl font-bold tracking-tight text-on-surface">
      motiv
    </Link>
  );
}
