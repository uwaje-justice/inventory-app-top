import { getToken } from "../utils/auth";

export function useAuth() {
  return { isLoggedIn: !!getToken() };
}
