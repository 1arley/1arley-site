import api from "@/utils/lib/api";
import { LoginCredentials, LoginResponse } from "../types/auth";
import { AxiosError } from "axios";

export function disableCredentials() {
  api.defaults.withCredentials = false;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return api
    .post("/auth/login", { ...credentials })
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      throw new Error(`Falha ao fazer login (${error.response?.status})`);
    });
}

export function setSession(token: string, user: { role: string }) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem("adminAuthToken", token);
  window.sessionStorage.setItem("adminUser", JSON.stringify(user));
  window.sessionStorage.setItem("adminRole", user.role);
}
