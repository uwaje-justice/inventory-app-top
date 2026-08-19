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
const CategoryFormPage = lazy(() => import("./pages/CategoryFormPage"));
const ItemsPage = lazy(() => import("./pages/ItemsPage"));
const ItemDetailPage = lazy(() => import("./pages/ItemDetailPage"));
const ItemFormPage = lazy(() => import("./pages/ItemFormPage"));
const SuppliersPage = lazy(() => import("./pages/SuppliersPage"));
const SupplierDetailPage = lazy(() => import("./pages/SupplierDetailPage"));
const SupplierFormPage = lazy(() => import("./pages/SupplierFormPage"));
const VehiclesPage = lazy(() => import("./pages/VehiclesPage"));
const VehicleDetailPage = lazy(() => import("./pages/VehicleDetailPage"));
const VehicleFormPage = lazy(() => import("./pages/VehicleFormPage"));

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
          { path: "/categories/new", element: <CategoryFormPage /> },
          { path: "/categories/:id/edit", element: <CategoryFormPage /> },
          { path: "/categories/:id", element: <CategoryDetailPage /> },
          { path: "/items", element: <ItemsPage /> },
          { path: "/items/new", element: <ItemFormPage /> },
          { path: "/items/:id/edit", element: <ItemFormPage /> },
          { path: "/items/:id", element: <ItemDetailPage /> },
          { path: "/suppliers", element: <SuppliersPage /> },
          { path: "/suppliers/new", element: <SupplierFormPage /> },
          { path: "/suppliers/:id/edit", element: <SupplierFormPage /> },
          { path: "/suppliers/:id", element: <SupplierDetailPage /> },
          { path: "/vehicles", element: <VehiclesPage /> },
          { path: "/vehicles/new", element: <VehicleFormPage /> },
          { path: "/vehicles/:id/edit", element: <VehicleFormPage /> },
          { path: "/vehicles/:id", element: <VehicleDetailPage /> },
          { path: "/dashboard/*", element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
