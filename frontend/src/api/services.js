import api from "./axios";
import { API_ROUTES } from "../constants";

// ── Auth ──────────────────────────────────────────────
export const login = (email, password) =>
  api.post(API_ROUTES.auth.login, { email, password }).then((r) => r.data);
export const register = (data) =>
  api.post(API_ROUTES.auth.register, data).then((r) => r.data);
export const getMe = () => api.get(API_ROUTES.auth.me).then((r) => r.data.user);

// ── Categories ────────────────────────────────────────
export const getCategories = (params) =>
  api.get(API_ROUTES.categories, { params }).then((r) => r.data.categories);
export const getCategory = (id) =>
  api.get(`${API_ROUTES.categories}/${id}`).then((r) => r.data.category);
export const createCategory = (data) =>
  api.post(API_ROUTES.categories, data).then((r) => r.data.category);
export const updateCategory = (id, data) =>
  api.put(`${API_ROUTES.categories}/${id}`, data).then((r) => r.data.category);
export const deleteCategory = (id) =>
  api.delete(`${API_ROUTES.categories}/${id}`);

// ── Items ─────────────────────────────────────────────
export const getItems = (params) =>
  api.get(API_ROUTES.items, { params }).then((r) => r.data.items);
export const getItem = (id) =>
  api.get(`${API_ROUTES.items}/${id}`).then((r) => r.data.item);
export const createItem = (data) =>
  api.post(API_ROUTES.items, data).then((r) => r.data.item);
export const updateItem = (id, data) =>
  api.put(`${API_ROUTES.items}/${id}`, data).then((r) => r.data.item);
export const deleteItem = (id) =>
  api.delete(`${API_ROUTES.items}/${id}`);

// ── Suppliers ─────────────────────────────────────────
export const getSuppliers = (params) =>
  api.get(API_ROUTES.suppliers, { params }).then((r) => r.data.suppliers);
export const getSupplier = (id) =>
  api.get(`${API_ROUTES.suppliers}/${id}`).then((r) => r.data.supplier);
export const createSupplier = (data) =>
  api.post(API_ROUTES.suppliers, data).then((r) => r.data.supplier);
export const updateSupplier = (id, data) =>
  api.put(`${API_ROUTES.suppliers}/${id}`, data).then((r) => r.data.supplier);
export const deleteSupplier = (id) =>
  api.delete(`${API_ROUTES.suppliers}/${id}`);

// ── Vehicles ──────────────────────────────────────────
export const getVehicles = (params) =>
  api.get(API_ROUTES.vehicles, { params }).then((r) => r.data.vehicles);
export const getVehicle = (id) =>
  api.get(`${API_ROUTES.vehicles}/${id}`).then((r) => r.data.vehicle);
export const createVehicle = (data) =>
  api.post(API_ROUTES.vehicles, data).then((r) => r.data.vehicle);
export const updateVehicle = (id, data) =>
  api.put(`${API_ROUTES.vehicles}/${id}`, data).then((r) => r.data.vehicle);
export const deleteVehicle = (id) =>
  api.delete(`${API_ROUTES.vehicles}/${id}`);
export const addVehicleItem = (vehicleId, itemId) =>
  api.post(`/api/vehicles/${vehicleId}/items`, { itemId }).then((r) => r.data);
export const removeVehicleItem = (vehicleId, itemId) =>
  api.delete(`/api/vehicles/${vehicleId}/items/${itemId}`);
