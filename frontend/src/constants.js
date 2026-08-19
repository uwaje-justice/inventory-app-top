export const STORAGE_TOKEN_KEY = "motiv-token";
export const STORAGE_THEME_KEY = "motiv-theme";

export const API_BASE = "/api";
export const API_ROUTES = {
  auth: { login: `${API_BASE}/auth/login`, register: `${API_BASE}/auth/register`, me: `${API_BASE}/auth/me` },
  categories: `${API_BASE}/categories`,
  items: `${API_BASE}/items`,
  suppliers: `${API_BASE}/suppliers`,
  vehicles: `${API_BASE}/vehicles`,
};

export const RECENT_ITEMS_LIMIT = 5;
export const FIRST_CAR_YEAR = 1886;
