import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { clearAdminSession, setAdminAuthToken } from "@/utils/lib/adminSession";

let refreshPromise: Promise<void> | null = null;

export async function refreshAccessToken(apiInstance: AxiosInstance): Promise<void> {
  return apiInstance.post("/auth/refresh").then((response) => {
    const token =
      response.data.access_token ??
      response.data.accessToken ??
      response.data.token;

    if (!token) {
      throw new Error("Resposta inválida ao renovar token.");
    }

    setAdminAuthToken(token);
  });
}

export async function handleRefreshResponseError(
  error: AxiosError & { config?: { _retry?: boolean; url?: string } },
  apiInstance: AxiosInstance,
): Promise<AxiosResponse> {
  const originalRequest = error.config;

  if (!originalRequest) {
    return Promise.reject(error);
  }

  if (
    originalRequest.url?.includes("/auth/refresh") ||
    originalRequest.url?.includes("/auth/login")
  ) {
    return Promise.reject(error);
  }

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken(apiInstance).finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      return apiInstance.request(originalRequest);
    } catch (refreshError) {
      clearAdminSession();
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
}
