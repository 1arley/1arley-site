import type { AdminRole } from "@/types/auth";

interface StoredAdminUser {
  id?: string | number
  name?: string
  email?: string
  role?: string
}

const isBrowser = (): boolean => typeof window !== "undefined";

const normalizeRole = (role: string): AdminRole | "" => {
  const normalizedRole = role.trim().toUpperCase();
  if (normalizedRole === "USER" || normalizedRole === "ADMIN" || normalizedRole === "SUPERADMIN") {
    return normalizedRole;
  }
  return "";
};

export const getStoredAdminRole = (): AdminRole | "" => {
  if (!isBrowser()) return "";
  const storedRole = window.sessionStorage.getItem("adminRole");
  if (storedRole) {
    const normalizedStoredRole = normalizeRole(storedRole);
    if (normalizedStoredRole) return normalizedStoredRole;
  }
  const rawUser = window.sessionStorage.getItem("adminUser");
  if (!rawUser) return "";
  try {
    const parsedUser = JSON.parse(rawUser) as StoredAdminUser;
    return normalizeRole(String(parsedUser.role ?? ""));
  } catch {
    return "";
  }
};

export const getStoredAdminUser = (): StoredAdminUser | null => {
  if (!isBrowser()) return null;
  const rawUser = window.sessionStorage.getItem("adminUser");
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser) as StoredAdminUser;
  } catch {
    return null;
  }
};

export const getStoredAdminUserId = (): string => {
  const storedUser = getStoredAdminUser();
  return storedUser?.id !== undefined && storedUser?.id !== null ? String(storedUser.id) : "";
};

export const hasAdminAccess = (role: string): boolean => {
  return role === "ADMIN" || role === "SUPERADMIN";
};

export const hasSuperAdminAccess = (role: string): boolean => {
  return role === "SUPERADMIN";
};

export const isAdminSessionActive = (): boolean => {
  if (!isBrowser()) return false;
  const token = window.sessionStorage.getItem("adminAuthToken");
  const role = getStoredAdminRole();
  return Boolean(token) && hasAdminAccess(role);
};

export const isSuperAdminSessionActive = (): boolean => {
  if (!isBrowser()) return false;
  const token = window.sessionStorage.getItem("adminAuthToken");
  const role = getStoredAdminRole();
  return Boolean(token) && hasSuperAdminAccess(role);
};
