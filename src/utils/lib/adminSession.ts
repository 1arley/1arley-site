import type { LoginUser } from "@/types/auth";

const LEGACY_ADMIN_AUTH_TOKEN_KEY = "adminAuthToken";
const ADMIN_USER_KEY = "adminUser";
const ADMIN_ROLE_KEY = "adminRole";

export function purgeLegacyAdminToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(LEGACY_ADMIN_AUTH_TOKEN_KEY);
  } catch {
    // Ignore storage access errors
  }
}

if (typeof window !== "undefined") {
  purgeLegacyAdminToken();
}

export function setAdminSession(
  user: { role: string } & Partial<LoginUser>,
): void {
  if (typeof window === "undefined") return;
  purgeLegacyAdminToken();
  window.sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  window.sessionStorage.setItem(ADMIN_ROLE_KEY, user.role);
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  purgeLegacyAdminToken();
  window.sessionStorage.removeItem(ADMIN_USER_KEY);
  window.sessionStorage.removeItem(ADMIN_ROLE_KEY);
}
