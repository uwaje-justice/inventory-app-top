import { lazy } from "react";
import { Navigate } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CategoryDetailPage = lazy(() => import("./pages/CategoryDetailPage"));
const ItemsPage = lazy(() => import("./pages/ItemsPage"));
const ItemDetailPage = lazy(() => import("./pages/ItemDetailPage"));
const SuppliersPage = lazy(() => import("./pages/SuppliersPage"));
const SupplierDetailPage = lazy(() => import("./pages/SupplierDetailPage"));
const VehiclesPage = lazy(() => import("./pages/VehiclesPage"));
const VehicleDetailPage = lazy(() => import("./pages/VehicleDetailPage"));

export default [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/categories", element: <CategoriesPage /> },
          { path: "/categories/:id", element: <CategoryDetailPage /> },
          { path: "/items", element: <ItemsPage /> },
          { path: "/items/:id", element: <ItemDetailPage /> },
          { path: "/suppliers", element: <SuppliersPage /> },
          { path: "/suppliers/:id", element: <SupplierDetailPage /> },
          { path: "/vehicles", element: <VehiclesPage /> },
          { path: "/vehicles/:id", element: <VehicleDetailPage /> },
          { path: "/dashboard/*", element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
