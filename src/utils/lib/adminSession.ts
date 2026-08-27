import type { LoginUser } from "@/types/auth";

const ADMIN_AUTH_TOKEN_KEY = "adminAuthToken";
const ADMIN_USER_KEY = "adminUser";
const ADMIN_ROLE_KEY = "adminRole";

export function setAdminSession(token: string, user: LoginUser): void {
  window.sessionStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
  window.sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  window.sessionStorage.setItem(ADMIN_ROLE_KEY, user.role);
}

export function setAdminAuthToken(token: string): void {
  window.sessionStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
}

export function clearAdminSession(): void {
  window.sessionStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(ADMIN_USER_KEY);
  window.sessionStorage.removeItem(ADMIN_ROLE_KEY);

  import("@/services/auth").then((auth) => {
    if (auth.disableCredentials) {
      auth.disableCredentials();
    }
  });
}
