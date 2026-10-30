import axios, { type AxiosError, type AxiosInstance } from "axios";

import { handleRefreshResponseError } from "@/services/tokenRefresh";
import { purgeLegacyAdminToken } from "@/utils/lib/adminSession";

if (typeof window !== "undefined") {
  purgeLegacyAdminToken();
}

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

function setupHttpInterceptors(apiInstance: AxiosInstance): void {
  apiInstance.interceptors.request.use((config) => {
    purgeLegacyAdminToken();
    config.headers.Accept = "application/json";

    const method = config.method?.toLowerCase();
    if (method === "post" || method === "put" || method === "patch") {
      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  });

  apiInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError & { config?: { _retry?: boolean; url?: string } }) =>
      handleRefreshResponseError(error, apiInstance),
  );
}

setupHttpInterceptors(api);

export default api;
