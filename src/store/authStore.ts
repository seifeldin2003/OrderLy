import type { AuthSession, User } from "../types/auth";

const AUTH_KEY = "cos.auth";

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("auth:changed"));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("auth:changed"));
}

export function getCurrentUser(): User | null {
  return getAuthSession()?.user ?? null;
}
