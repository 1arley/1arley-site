import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { sanitizeNextPath } from "@/lib/admin-cookie";
import { clearAdminSession } from "@/utils/lib/adminSession";

export async function handleRefreshResponseError(
  error: AxiosError & { config?: { _retry?: boolean; url?: string } },
  apiInstance: AxiosInstance,
): Promise<AxiosResponse> {
  const originalRequest = error.config;

  if (!originalRequest) {
    return Promise.reject(error);
  }

  if (
    originalRequest.url?.includes("/auth/login") ||
    originalRequest.url?.includes("/auth/logout")
  ) {
    return Promise.reject(error);
  }

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    clearAdminSession();

    try {
      await apiInstance.post("/auth/logout");
    } catch {
      // Ignore logout failure when handling 401
    }

    if (typeof window !== "undefined") {
      const currentRoute = `${window.location.pathname}${window.location.search}`;
      const nextPath = sanitizeNextPath(currentRoute, "/admin/site");
      window.location.assign(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }

  return Promise.reject(error);
}
