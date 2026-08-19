import { Navigate, Outlet } from "react-router";
import { getToken } from "../utils/auth";

export default function ProtectedRoute() {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
