import api from "./axios";

// ── Auth ──────────────────────────────────────────────
export const getMe = () => api.get("/api/auth/me").then((r) => r.data.user);

// ── Categories ────────────────────────────────────────
export const getCategories = () => api.get("/api/categories").then((r) => r.data.categories);
export const getCategory = (id) => api.get(`/api/categories/${id}`).then((r) => r.data.category);
export const createCategory = (data) => api.post("/api/categories", data).then((r) => r.data.category);
export const updateCategory = (id, data) => api.put(`/api/categories/${id}`, data).then((r) => r.data.category);
export const deleteCategory = (id) => api.delete(`/api/categories/${id}`);

// ── Items ─────────────────────────────────────────────
export const getItems = (params) => api.get("/api/items", { params }).then((r) => r.data.items);
export const getItem = (id) => api.get(`/api/items/${id}`).then((r) => r.data.item);
export const createItem = (data) => api.post("/api/items", data).then((r) => r.data.item);
export const updateItem = (id, data) => api.put(`/api/items/${id}`, data).then((r) => r.data.item);
export const deleteItem = (id) => api.delete(`/api/items/${id}`);

// ── Suppliers ─────────────────────────────────────────
export const getSuppliers = () => api.get("/api/suppliers").then((r) => r.data.suppliers);
export const getSupplier = (id) => api.get(`/api/suppliers/${id}`).then((r) => r.data.supplier);
export const createSupplier = (data) => api.post("/api/suppliers", data).then((r) => r.data.supplier);
export const updateSupplier = (id, data) => api.put(`/api/suppliers/${id}`, data).then((r) => r.data.supplier);
export const deleteSupplier = (id) => api.delete(`/api/suppliers/${id}`);

// ── Vehicles ──────────────────────────────────────────
export const getVehicles = () => api.get("/api/vehicles").then((r) => r.data.vehicles);
export const getVehicle = (id) => api.get(`/api/vehicles/${id}`).then((r) => r.data.vehicle);
export const createVehicle = (data) => api.post("/api/vehicles", data).then((r) => r.data.vehicle);
export const updateVehicle = (id, data) => api.put(`/api/vehicles/${id}`, data).then((r) => r.data.vehicle);
export const deleteVehicle = (id) => api.delete(`/api/vehicles/${id}`);
export const addVehicleItem = (vehicleId, itemId) =>
  api.post(`/api/vehicles/${vehicleId}/items`, { itemId }).then((r) => r.data);
export const removeVehicleItem = (vehicleId, itemId) =>
  api.delete(`/api/vehicles/${vehicleId}/items/${itemId}`);
