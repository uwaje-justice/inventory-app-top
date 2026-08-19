import { STORAGE_TOKEN_KEY } from "../constants";

export function getToken() {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}

export function logout() {
  removeToken();
  window.location.href = "/login";
}
